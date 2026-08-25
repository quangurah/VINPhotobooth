import { useEffect, useRef, useState } from "react";
import { Plane } from "curtainsjs";
import { gsap } from "gsap";
import { useWebGL, createNoiseTextureURL } from "./WebGLCanvas";

// Định nghĩa Vertex Shader theo CDA spec
const vertexShader = `
  #ifdef GL_ES
  precision mediump float;
  #endif
  attribute vec3 aVertexPosition;
  attribute vec2 aTextureCoord;
  uniform mat4 umvMatrix;
  uniform mat4 upMatrix;
  varying vec2 vTextureCoord;
  void main() {
      gl_Position = upMatrix * umvMatrix * vec4(aVertexPosition, 1.0);
      vTextureCoord = aTextureCoord;
  }
`;

// Định nghĩa Fragment Shader theo CDA spec
const fragmentShader = `
  #ifdef GL_ES
  precision mediump float;
  #endif
  varying vec2 vTextureCoord;
  uniform sampler2D uSampler0; // Ảnh gốc
  uniform sampler2D uDisplacementMap; // Ảnh displacement (noise/perlin)
  uniform float uTime;
  uniform float uMouseStrength;
  uniform vec2 uMousePosition;
  uniform float uScrollSpeed;
  void main() {
      vec2 uv = vTextureCoord;
      
      // Đọc displacement map để lấy độ lệch màu
      vec4 displacement = texture2D(uDisplacementMap, uv);
      
      // Tính toán độ biến dạng dựa trên cuộn và di chuột
      float distortion = displacement.r * (uScrollSpeed * 0.05 + uMouseStrength * 0.1);
      
      // Làm lệch tọa độ UV
      vec2 distortedUV = vec2(uv.x + distortion, uv.y + distortion);
      
      // Đọc màu từ ảnh gốc với tọa độ UV đã bị biến dạng
      vec4 color = texture2D(uSampler0, distortedUV);
      
      gl_FragColor = color;
  }
`;

interface WebGLPlaneImageProps {
  src: string;
  alt?: string;
  className?: string;
  wrapperClassName?: string;
}

export default function WebGLPlaneImage({ src, alt = "", className = "", wrapperClassName = "" }: WebGLPlaneImageProps) {
  const curtains = useWebGL();
  const planeRef = useRef<HTMLDivElement>(null);
  const [noiseUrl] = useState(() => createNoiseTextureURL());

  useEffect(() => {
    if (!curtains || !planeRef.current) return;

    const planeElement = planeRef.current;

    // Khởi tạo các Uniform ban đầu cho Shader
    const params = {
      vertexShader,
      fragmentShader,
      widthSegments: 10,
      heightSegments: 10,
      uniforms: {
        uTime: {
          name: "uTime",
          type: "1f",
          value: 0,
        },
        uMouseStrength: {
          name: "uMouseStrength",
          type: "1f",
          value: 0,
        },
        uMousePosition: {
          name: "uMousePosition",
          type: "2f",
          value: [0.5, 0.5],
        },
        uScrollSpeed: {
          name: "uScrollSpeed",
          type: "1f",
          value: 0,
        },
      },
    };

    // Tạo Plane trên curtains instance
    const plane = new Plane(curtains, planeElement, params);

    // Cập nhật uTime liên tục cho shader
    plane.onRender(() => {
      plane.uniforms.uTime.value += 0.01;
    });

    plane.onReady(() => {
      // 1. Xử lý tương tác Hover để gợn sóng mượt mà bằng GSAP
      const handleMouseEnter = () => {
        gsap.to(plane.uniforms.uMouseStrength, {
          value: 1.0,
          duration: 0.6,
          ease: "power2.out",
        });
      };

      const handleMouseLeave = () => {
        gsap.to(plane.uniforms.uMouseStrength, {
          value: 0.0,
          duration: 0.8,
          ease: "power2.out",
        });
      };

      const handleMouseMove = (e: MouseEvent) => {
        const rect = planeElement.getBoundingClientRect();
        // Tính toán tọa độ chuột chuẩn hóa (0.0 -> 1.0) trên Plane
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        plane.uniforms.uMousePosition.value = [x, y];
      };

      planeElement.addEventListener("mouseenter", handleMouseEnter);
      planeElement.addEventListener("mouseleave", handleMouseLeave);
      planeElement.addEventListener("mousemove", handleMouseMove);

      // 2. Xử lý gợn sóng khi cuộn trang
      const handleScroll = () => {
        const deltas = curtains.getScrollDeltas();
        if (Math.abs(deltas.y) > 0.1) {
          gsap.to(plane.uniforms.uScrollSpeed, {
            value: Math.min(10, Math.abs(deltas.y)),
            duration: 0.3,
            overwrite: "auto",
            onComplete: () => {
              gsap.to(plane.uniforms.uScrollSpeed, {
                value: 0,
                duration: 0.5,
              });
            },
          });
        }
      };

      curtains.onScroll(handleScroll);

      // Dọn dẹp listener khi unmount
      return () => {
        planeElement.removeEventListener("mouseenter", handleMouseEnter);
        planeElement.removeEventListener("mouseleave", handleMouseLeave);
        planeElement.removeEventListener("mousemove", handleMouseMove);
      };
    });

    return () => {
      plane.remove();
    };
  }, [curtains, src]);

  return (
    <div
      ref={planeRef}
      className={`plane relative w-full h-full overflow-hidden ${wrapperClassName}`}
    >
      {/* Texture 1: Ảnh gốc */}
      <img
        src={src}
        alt={alt}
        data-sampler="uSampler0"
        className={`w-full h-full object-cover pointer-events-none ${className}`}
      />
      {/* Texture 2: Displacement Noise Map (Dữ liệu Base64 tạo tự động) */}
      <img
        src={noiseUrl}
        alt=""
        data-sampler="uDisplacementMap"
        className="hidden pointer-events-none"
      />
    </div>
  );
}
