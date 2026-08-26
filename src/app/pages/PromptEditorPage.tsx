import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { 
  Sliders, Save, RefreshCw, Copy, Check, Lock, ArrowLeft, Eye, Undo2, KeyRound,
  Camera, Upload, Play, Sparkles, Image as ImageIcon, FileText, Settings, AlertCircle
} from "lucide-react";

// Cấu hình Base URL trỏ tới API của project
const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
const BASE_URL = isLocal ? "http://127.0.0.1:6000/vinpalace-df621/asia-southeast1/api" : "https://api-phn3coaacq-as.a.run.app";

// Danh sách các concept của Vin Palace
const CONCEPTS = [
  { id: "1", name: "HẬU DUỆ RỒNG TIÊN", desc: "Cánh chim hạc khổng lồ, thác nước thiên giới, mây ngũ sắc" },
  { id: "2", name: "CƯ DÂN LÚA NƯỚC KHAI NGUYÊN", desc: "Cánh đồng lúa chín vàng, núi non Văn Lang hùng vĩ, trống đồng" },
  { id: "3", name: "HÀO KHÍ BẠCH ĐẰNG", desc: "Sông Bạch Đằng đỏ lửa, trận chiến cọc gỗ, kiếm giáo oai hùng" },
  { id: "4", name: "TRẨY HỘI NON SÔNG", desc: "Kinh thành Thăng Long cổ kính, hàng trăm đèn lồng, pháo hoa rực rỡ" },
  { id: "5", name: "NGÀY TOÀN THẮNG", desc: "Lá cờ Tổ quốc tung bay, đoàn quân giải phóng, bình minh hòa bình" },
  { id: "6", name: "VIỆT NAM THỊNH VƯỢNG", desc: "Thành phố ánh sáng hiện đại, trình diễn drone, pháo hoa tương lai" }
];

// Định nghĩa giới tính
const OPTIONS = [
  { key: "female", label: "Nữ", gender: "female" },
  { key: "male", label: "Nam", gender: "male" }
];

// Danh sách các prompt hệ thống
const SYSTEM_PROMPTS_CONFIG = [
  { key: "B1_SUGGEST_DESCRIPTION_PROMPT", name: "B1: Gợi ý Di sản", desc: "Prompt gợi ý 5 câu mô tả di sản mẫu cho khách chơi." },
  { key: "B4_1_INSIGHT_TEXT_PROMPT", name: "B4.1: Phân tích Insight", desc: "Từ câu tự hào của khách suy luận ra tương lai 10 năm và sản phẩm MSB." },
  { key: "B4_2_INSIGHT_IMAGE_PROMPT", name: "B4.2: Phân tích Ảnh gốc", desc: "Đếm số người, phân tích giới tính, độ tuổi từ ảnh chụp của camera." },
  { key: "B5_SLOGAN_PROMPT", name: "B5: Sinh Slogan bìa", desc: "Quy tắc viết slogan tạp chí bay bổng, ngăn cách bởi dấu /." },
  { key: "B6_IMAGE_PROMPT", name: "B6: Template Image Prompt", desc: "Khung sườn prompt tiếng Anh chi tiết để gửi lên Imagen 3." },
  { key: "BRAND_SAFETY_PROMPT", name: "Kiểm duyệt Brand Safety", desc: "Kiểm duyệt từ cấm hoặc nội dung nhạy cảm khách hàng nhập vào." }
];

export default function PromptEditorPage() {
  const navigate = useNavigate();
  
  // Tabs: "concepts" | "system"
  const [activeTab, setActiveTab] = useState<"concepts" | "system">("concepts");

  // Trạng thái bảo mật PIN
  const [pin, setPin] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(true);
  const [pinError, setPinError] = useState("");

  // Dữ liệu prompt bối cảnh (Concepts)
  const [prompts, setPrompts] = useState<Record<string, any>>({});
  // Dữ liệu prompt hệ thống
  const [systemPrompts, setSystemPrompts] = useState<Record<string, string>>({});

  const [loading, setLoading] = useState(true);
  
  // Trạng thái lưu dữ liệu
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [systemSaving, setSystemSaving] = useState(false);
  const [systemSaveSuccess, setSystemSaveSuccess] = useState(false);

  // Concept & Option đang chọn ở Tab 1
  const [selectedConceptId, setSelectedConceptId] = useState("1");
  const [selectedOptionKey, setSelectedOptionKey] = useState("female");
  const [editorText, setEditorText] = useState("");

  // Prompt hệ thống đang chọn ở Tab 2
  const [selectedSystemKey, setSelectedSystemKey] = useState("B6_IMAGE_PROMPT");
  const [systemEditorText, setSystemEditorText] = useState("");

  // Quản lý copy & reset
  const [copied, setCopied] = useState(false);
  const [resetting, setResetting] = useState(false);

  // --- UPLOAD REFERENCE IMAGE STATES ---
  const [uploadingSlots, setUploadingSlots] = useState<Record<string, boolean>>({});
  const [uploadSuccessSlots, setUploadSuccessSlots] = useState<Record<string, boolean>>({});
  const [activeUploadSlot, setActiveUploadSlot] = useState<string>("1");
  const refFileInputRef = useRef<HTMLInputElement | null>(null);

  // --- CAMERA TEST PROMPT STATES ---
  const [cameraActive, setCameraActive] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null); // base64 URL
  const [isMock, setIsMock] = useState(false);
  const [testLoading, setTestLoading] = useState(false);
  const [testResultImage, setTestResultImage] = useState<string | null>(null);
  const [showLogs, setShowLogs] = useState(false);
  const [testLogs, setTestLogs] = useState<{
    request: any;
    response: any;
    error?: string;
  } | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // 1. Fetch dữ liệu từ backend
  const fetchAllData = async () => {
    setLoading(true);
    try {
      // Fetch Concept Prompts
      const conceptRes = await fetch(`${BASE_URL}/tclife/get-vinplace-prompts`);
      const conceptData = await conceptRes.json();
      if (conceptData.ok && conceptData.prompts) {
        setPrompts(conceptData.prompts);
        const text = conceptData.prompts[selectedConceptId]?.[selectedOptionKey] || "";
        setEditorText(text);
      }

      // Fetch System Prompts
      const systemRes = await fetch(`${BASE_URL}/tclife/get-system-prompts`);
      const systemData = await systemRes.json();
      if (systemData.ok && systemData.prompts) {
        setSystemPrompts(systemData.prompts);
        const text = systemData.prompts[selectedSystemKey] || "";
        setSystemEditorText(text);
      }
    } catch (e) {
      console.error("Lỗi kết nối API lấy dữ liệu prompts:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthorized) {
      fetchAllData();
    }
  }, [isAuthorized]);

  // Đồng bộ editor khi đổi Concept hoặc Option ở Tab 1
  useEffect(() => {
    if (prompts[selectedConceptId]) {
      const text = prompts[selectedConceptId]?.[selectedOptionKey] || "";
      setEditorText(text);
    }
  }, [selectedConceptId, selectedOptionKey, prompts]);

  // Đồng bộ editor khi đổi System Key ở Tab 2
  useEffect(() => {
    if (systemPrompts[selectedSystemKey]) {
      const text = systemPrompts[selectedSystemKey] || "";
      setSystemEditorText(text);
    }
  }, [selectedSystemKey, systemPrompts]);

  // Xử lý mã PIN xác thực
  const handleVerifyPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === "123456") {
      setIsAuthorized(true);
      localStorage.setItem("prompt_editor_auth", "true");
      setPinError("");
    } else {
      setPinError("Mã PIN không chính xác. Vui lòng nhập lại.");
    }
  };

  // Thay đổi văn bản editor Tab 1
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setEditorText(newText);
    setPrompts(prev => {
      const updated = { ...prev };
      if (!updated[selectedConceptId]) updated[selectedConceptId] = {};
      updated[selectedConceptId][selectedOptionKey] = newText;
      return updated;
    });
  };

  // Thay đổi văn bản editor Tab 2
  const handleSystemTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setSystemEditorText(newText);
    setSystemPrompts(prev => ({
      ...prev,
      [selectedSystemKey]: newText
    }));
  };

  // Lưu cấu hình Tab 1 (Concept Prompts)
  const handleSaveConcepts = async () => {
    setSaving(true);
    setSaveSuccess(false);
    try {
      const res = await fetch(`${BASE_URL}/tclife/save-vinplace-prompts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompts })
      });
      const data = await res.json();
      if (data.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        alert("Lưu thất bại: " + data.error);
      }
    } catch (e: any) {
      alert("Lỗi API lưu prompt: " + e.message);
    } finally {
      setSaving(false);
    }
  };

  // Lưu cấu hình Tab 2 (System Prompts)
  const handleSaveSystem = async () => {
    setSystemSaving(true);
    setSystemSaveSuccess(false);
    try {
      const res = await fetch(`${BASE_URL}/tclife/save-system-prompts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompts: systemPrompts })
      });
      const data = await res.json();
      if (data.ok) {
        setSystemSaveSuccess(true);
        setTimeout(() => setSystemSaveSuccess(false), 3000);
      } else {
        alert("Lưu thất bại: " + data.error);
      }
    } catch (e: any) {
      alert("Lỗi API lưu prompt hệ thống: " + e.message);
    } finally {
      setSystemSaving(false);
    }
  };

  // Sao chép nhanh prompt
  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Khôi phục mặc định cho Concept Prompt
  const handleResetConceptDefault = async () => {
    if (!window.confirm("Bạn có chắc chắn muốn khôi phục dáng này về mặc định của hệ thống?")) return;
    setResetting(true);
    try {
      const defaultPrompts = await import("../../../functions/vinplace_prompts.json");
      const defaultText = defaultPrompts[selectedConceptId as keyof typeof defaultPrompts]?.[selectedOptionKey as keyof typeof defaultPrompts] || "";
      
      setEditorText(defaultText);
      setPrompts(prev => {
        const updated = { ...prev };
        if (!updated[selectedConceptId]) updated[selectedConceptId] = {};
        updated[selectedConceptId][selectedOptionKey] = defaultText;
        return updated;
      });
    } catch (e) {
      console.error("Lỗi khôi phục mặc định:", e);
    } finally {
      setResetting(false);
    }
  };

  // Khôi phục mặc định cho System Prompt (đọc từ file mặc định)
  const handleResetSystemDefault = () => {
    if (!window.confirm("Bạn muốn đặt lại prompt hệ thống này về mẫu chuẩn ban đầu?")) return;
    let defaultText = "";
    if (selectedSystemKey === "B1_SUGGEST_DESCRIPTION_PROMPT") {
      defaultText = `Bạn là trợ lý AI cho chiến dịch di sản nghệ thuật của Vin Palace Theatre. Hãy gợi ý cho tôi đúng 5 dòng mô tả ngắn gọn, truyền cảm hứng về chủ đề di sản "<topic>" của người dùng.\nYêu cầu:\n- Mỗi dòng phải bắt đầu bằng cụm từ "Di sản của tôi là..."\n- Mỗi gợi ý mô tả một khía cạnh ý nghĩa (ví dụ: nghệ thuật, cội nguồn truyền thống, công lao dựng nước, tình yêu quê hương, hay sự phồn vinh của đất nước).\n- Viết bằng tiếng Việt, súc tích, chạm vào cảm xúc và chuyên nghiệp.\n- Chỉ trả về danh sách 5 dòng gợi ý, không thêm lời dẫn, không đánh số thứ tự 1-5, không ghi chú gì thêm.`;
    } else if (selectedSystemKey === "B4_1_INSIGHT_TEXT_PROMPT") {
      defaultText = `# VAI TRÒ\nBạn là "Dynamic Inference Agent" cho chiến dịch "Tạp chí di sản tương lai" của MSB. \n\n# NHIỆM VỤ\nPhân tích câu {{Pride Statement}} của người dùng để trích xuất động lực tâm lý, dự đoán thành tựu/di sản tương lai sau 10 năm và ghép nối với sản phẩm MSB phù hợp nhất.\n⚠️ YÊU CẦU BẮT BUỘC: Toàn bộ nội dung sinh ra ở các trường dữ liệu (values) trong JSON phải được viết bằng TIẾNG VIỆT tự nhiên, đúng chính tả và ngữ pháp.\n\n# ĐẦU VÀO\n- Tên người dùng: {{Name}}\n- Điều tự hào (Pride Statement): {{Pride Statement}}`;
    } else if (selectedSystemKey === "B4_2_INSIGHT_IMAGE_PROMPT") {
      defaultText = `# VAI TRÒ\nBạn là Chuyên gia Phân tích Hình ảnh (Computer Vision Agent) cho chiến dịch của MSB.\n\n# ĐẦU VÀO\nReference Image 1: Ảnh chân dung của người dùng chụp trực tiếp tại photobooth.\n\n# NHIỆM VỤ\nPhân tích Reference Image 1 để phát hiện và ước tính các thông số nhân khẩu học của những người xuất hiện trong ảnh.`;
    } else if (selectedSystemKey === "BRAND_SAFETY_PROMPT") {
      defaultText = `# VAI TRÒ\nBạn là Trợ lý Kiểm duyệt nội dung (Brand Safety Assistant) cho ngân hàng MSB.\n\n# NHIỆM VỤ\nKiểm tra xem câu văn đầu vào của người dùng có chứa các yếu tố nhạy cảm, thô tục, phản động, vi phạm pháp luật, chính trị, tôn giáo, hoặc đả kích bất kỳ cá nhân/tổ chức nào không.`;
    } else if (selectedSystemKey === "B5_SLOGAN_PROMPT") {
      defaultText = `Bạn là Senior Copywriter của ngân hàng MSB. Hãy tạo một câu slogan ngắn gọn, truyền cảm hứng thể hiện phong cách của người viết bài từ nội dung tương lai của họ.`;
    } else if (selectedSystemKey === "B6_IMAGE_PROMPT") {
      defaultText = `Create a vertical 1:1.415 premium photorealistic editorial magazine-cover portrait.`;
    }

    setSystemEditorText(defaultText);
    setSystemPrompts(prev => ({
      ...prev,
      [selectedSystemKey]: defaultText
    }));
  };

  // --- AUTO SAVE LOGIC FOR REF IMAGES ---
  const savePromptsAuto = async (latestPrompts: any) => {
    try {
      const res = await fetch(`${BASE_URL}/tclife/save-vinplace-prompts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompts: latestPrompts })
      });
      const data = await res.json();
      if (!data.ok) {
        console.error("Tự động lưu prompts thất bại:", data.error);
      } else {
        console.log("Tự động lưu prompts thành công!");
      }
    } catch (e) {
      console.error("Lỗi tự động lưu prompts:", e);
    }
  };

  // --- UPLOAD REFERENCE IMAGE LOGIC ---
  const handleRefImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, slotIndex: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingSlots(prev => ({ ...prev, [slotIndex]: true }));
    setUploadSuccessSlots(prev => ({ ...prev, [slotIndex]: false }));

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Data = reader.result as string;
      const base64Raw = base64Data.replace(/^data:image\/[a-zA-Z]+;base64,/, "");
      const mimeType = base64Data.match(/^data:(image\/[a-zA-Z]+);base64,/)?.[1] || "image/png";

      try {
        const res = await fetch(`${BASE_URL}/tclife/upload-ref-image`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            imageBase64: base64Raw,
            mimeType: mimeType,
            conceptId: selectedConceptId,
            optionKey: selectedOptionKey,
            slotIndex: slotIndex
          })
        });
        const data = await res.json();
        if (data.ok && data.publicUrl) {
          // Cập nhật URL ảnh ref tương ứng với slotIndex vào Firestore
          setPrompts(prev => {
            const updated = { ...prev };
            if (!updated[selectedConceptId]) updated[selectedConceptId] = {};
            updated[selectedConceptId][`${selectedOptionKey}_refImage_${slotIndex}`] = data.publicUrl;
            
            // Tự động lưu cấu hình prompts ngay lập tức!
            savePromptsAuto(updated);
            
            return updated;
          });
          setUploadSuccessSlots(prev => ({ ...prev, [slotIndex]: true }));
          setTimeout(() => setUploadSuccessSlots(prev => ({ ...prev, [slotIndex]: false })), 3000);
        } else {
          alert(`Lỗi upload ảnh Ref slot ${slotIndex}: ` + (data.error || "Lỗi không xác định"));
        }
      } catch (err: any) {
        alert("Lỗi kết nối API upload ảnh: " + err.message);
      } finally {
        setUploadingSlots(prev => ({ ...prev, [slotIndex]: false }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveRefImage = (slotIndex: string) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa ảnh ref slot ${slotIndex}?`)) return;
    setPrompts(prev => {
      const updated = { ...prev };
      if (!updated[selectedConceptId]) updated[selectedConceptId] = {};
      updated[selectedConceptId][`${selectedOptionKey}_refImage_${slotIndex}`] = "";
      
      // Tự động lưu cấu hình prompts khi xóa ảnh ref
      savePromptsAuto(updated);
      
      return updated;
    });
  };

  // --- CAMERA LOGIC FUNCTIONS ---
  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 480, height: 480, facingMode: "user" } 
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setCameraActive(true);
      setCapturedImage(null);
    } catch (err) {
      console.error("Không mở được camera:", err);
      alert("Không mở được webcam. Vui lòng cấp quyền hoặc tải ảnh thủ công từ thiết bị.");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setCameraActive(false);
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth || 480;
      canvas.height = videoRef.current.videoHeight || 480;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
        setCapturedImage(dataUrl);
        stopCamera();
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCapturedImage(reader.result as string);
        stopCamera();
      };
      reader.readAsDataURL(file);
    }
  };

  // --- TEST RUN LOGIC ---
  const handleTestPrompt = async () => {
    if (!capturedImage) {
      alert("Vui lòng chụp ảnh camera hoặc tải ảnh lên để test.");
      return;
    }

    setTestLoading(true);
    setTestResultImage(null);
    setTestLogs(null);

    const base64Raw = capturedImage.replace(/^data:image\/[a-zA-Z]+;base64,/, "");
    const selectedOpt = OPTIONS.find(o => o.key === selectedOptionKey);
    
    // Payload test
    const payload = {
      prompt: activeTab === "concepts" ? editorText : systemPrompts["B6_IMAGE_PROMPT"] || systemEditorText,
      imageBase64: base64Raw,
      selectedConcept: selectedConceptId,
      selectedOption: selectedOpt?.option || "1",
      gender: selectedOpt?.gender || "female",
      isMock: isMock,
      sessionId: `test_${Date.now()}`
    };

    // Log payload gửi đi (ẩn bớt chuỗi base64 dài)
    setTestLogs({
      request: {
        endpoint: `${BASE_URL}/tclife/generate-magazine-image`,
        method: "POST",
        payload: {
          ...payload,
          imageBase64: payload.imageBase64.substring(0, 100) + "... (truncated data)"
        }
      },
      response: null
    });

    try {
      const res = await fetch(`${BASE_URL}/tclife/generate-magazine-image`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      
      setTestLogs(prev => {
        if (!prev) return null;
        return {
          ...prev,
          response: data
        };
      });

      if (data.ok) {
        if (data.rawImageBase64) {
          setTestResultImage(data.rawImageBase64);
        } else if (data.rawImageUrl) {
          setTestResultImage(data.rawImageUrl);
        }
      } else {
        setTestLogs(prev => {
          if (!prev) return null;
          return {
            ...prev,
            error: data.error || "Giao dịch API trả về lỗi không xác định."
          };
        });
      }
    } catch (err: any) {
      setTestLogs(prev => {
        if (!prev) return null;
        return {
          ...prev,
          error: err.message || "Lỗi kết nối tới backend API."
        };
      });
    } finally {
      setTestLoading(false);
    }
  };

  // Hủy camera khi đóng trang
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-[#07080a] text-gray-100 flex items-center justify-center relative px-4 overflow-hidden">
        <div className="absolute inset-0 bg-radial-at-t from-[#c08028]/10 via-[#07080a]/0 to-[#07080a] pointer-events-none z-0" />
        <div className="relative z-10 w-full max-w-[420px] bg-gray-900/60 backdrop-blur-xl border border-gray-800 p-8 rounded-3xl shadow-2xl flex flex-col items-center gap-6">
          <div className="size-16 rounded-2xl bg-gradient-to-tr from-[#c08028] to-[#ef4029] flex items-center justify-center text-white shadow-lg shadow-[#c08028]/25 animate-pulse">
            <Lock className="w-8 h-8" />
          </div>
          <div className="text-center">
            <h2 className="text-xl font-extrabold text-white tracking-wide uppercase">Cấu hình Prompt Vin Palace</h2>
            <p className="text-xs text-gray-400 mt-1.5 font-medium leading-relaxed">
              Vui lòng nhập mã PIN bảo mật để chỉnh sửa cấu hình hệ thống
            </p>
          </div>
          <form onSubmit={handleVerifyPin} className="w-full flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-[#c08028]" />
                Mã PIN Quản trị
              </label>
              <input
                type="password"
                placeholder="••••••"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-center text-lg font-bold tracking-[6px] text-white focus:outline-none focus:border-[#c08028] transition-all"
              />
            </div>
            {pinError && (
              <p className="text-xs text-red-500 font-semibold text-center mt-1 animate-bounce">
                {pinError}
              </p>
            )}
            <button
              type="submit"
              className="w-full mt-2 py-3 bg-gradient-to-r from-[#c08028] to-[#ef4029] hover:brightness-110 active:scale-[0.98] transition-all rounded-xl text-sm font-bold text-white shadow-lg shadow-[#c08028]/20 flex items-center justify-center cursor-pointer"
            >
              Xác thực truy cập
            </button>
          </form>
          <button 
            onClick={() => navigate("/vinpalacestep1")}
            className="text-xs text-gray-500 hover:text-white font-medium flex items-center gap-1 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Quay lại game
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#07080a] text-gray-200 font-sans pb-16 relative overflow-x-hidden">
      {/* Background Radial Glow */}
      <div className="absolute inset-0 bg-radial-at-t from-[#c08028]/10 via-[#07080a]/0 to-[#07080a] pointer-events-none z-0" />

      <div className="relative z-10 max-w-[1440px] mx-auto px-4 lg:px-8 pt-6 flex flex-col gap-6">
        
        {/* Header Bar */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-800 pb-5">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-3">
              <span className="h-8 w-1.5 rounded-full bg-[#c08028]" />
              <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-gray-200 to-[#c08028] bg-clip-text text-transparent uppercase">
                QUẢN TRỊ CẤU HÌNH PROMPTS AI
              </h1>
            </div>
            <p className="text-sm text-gray-400 pl-4">
              Hệ thống tối ưu từ khóa bối cảnh chụp ảnh (VinPalace) và cấu hình điều khiển AI (System Prompts).
            </p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <button 
              onClick={() => navigate("/vinpalacestep1")} 
              className="flex items-center gap-2 px-5 py-2 text-sm bg-gradient-to-r from-[#c08028] to-[#ef4029] hover:brightness-110 active:scale-95 text-white font-bold rounded-xl shadow-lg shadow-[#c08028]/25 transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              Quay lại game
            </button>
          </div>
        </header>

        {/* Tab Controls Navigation */}
        <div className="flex border-b border-gray-800/80 gap-6 px-1">
          <button
            onClick={() => setActiveTab("concepts")}
            className={`pb-3.5 text-sm font-extrabold relative transition-colors cursor-pointer ${
              activeTab === "concepts" ? "text-[#c08028]" : "text-gray-500 hover:text-gray-300"
            }`}
          >
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4" />
              CẤU HÌNH CONCEPT BỐI CẢNH (VINPALACE)
            </div>
            {activeTab === "concepts" && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#c08028] rounded-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("system")}
            className={`pb-3.5 text-sm font-extrabold relative transition-colors cursor-pointer ${
              activeTab === "system" ? "text-[#c08028]" : "text-gray-500 hover:text-gray-300"
            }`}
          >
            <div className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              CẤU HÌNH PROMPT HỆ THỐNG (SYSTEM PROMPTS)
            </div>
            {activeTab === "system" && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#c08028] rounded-full" />
            )}
          </button>
        </div>

        {loading ? (
          <div className="h-[50vh] flex flex-col items-center justify-center gap-3 text-gray-500">
            <RefreshCw className="w-8 h-8 animate-spin text-[#c08028]" />
            <p className="text-sm font-semibold">Đang đồng bộ dữ liệu prompts...</p>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            
            {/* GRID SOẠN THẢO PROMPTS */}
            {activeTab === "concepts" ? (
              /* TAB 1: CONCEPTS PROMPTS */
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Cột 1: Danh sách Concepts */}
                <div className="lg:col-span-1 flex flex-col gap-4">
                  <h3 className="text-xs font-bold uppercase text-gray-400 tracking-wider flex items-center gap-1.5 px-1">
                    <Sliders className="w-3.5 h-3.5 text-[#c08028]" />
                    1. Chọn Concept bối cảnh
                  </h3>
                  
                  <div className="flex flex-col gap-2.5">
                    {CONCEPTS.map((concept) => {
                      const isSelected = selectedConceptId === concept.id;
                      return (
                        <div
                          key={concept.id}
                          onClick={() => setSelectedConceptId(concept.id)}
                          className={`cursor-pointer rounded-2xl p-4 border transition-all duration-300 flex flex-col gap-1.5 text-left relative overflow-hidden group ${
                            isSelected 
                              ? "bg-gradient-to-r from-gray-900 to-[#c08028]/5 border-[#c08028] shadow-[0_0_15px_rgba(192,128,40,0.15)]"
                              : "bg-gray-900/40 border-gray-800 hover:border-gray-700 hover:bg-gray-900/60"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                              isSelected ? "bg-[#c08028] text-white" : "bg-gray-800 text-gray-400"
                            }`}>
                              Concept 0{concept.id}
                            </span>
                          </div>
                          <h4 className="font-bold text-sm text-white tracking-wide uppercase mt-0.5 group-hover:text-[#c08028] transition-colors">
                            {concept.name}
                          </h4>
                          <p className="text-xs text-gray-400 leading-relaxed font-medium">
                            {concept.desc}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Cột 2: Soạn thảo bối cảnh & Upload Ref */}
                <div className="lg:col-span-2 flex flex-col gap-4">
                  <h3 className="text-xs font-bold uppercase text-gray-400 tracking-wider flex items-center gap-1.5 px-1">
                    <Eye className="w-3.5 h-3.5 text-[#c08028]" />
                    2. Thiết lập từ khóa Prompt chi tiết
                  </h3>

                  <div className="bg-gray-900/40 backdrop-blur-md border border-gray-800 rounded-3xl p-6 flex flex-col gap-5 shadow-xl">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {OPTIONS.map((opt) => {
                        const isSelected = selectedOptionKey === opt.key;
                        return (
                          <button
                            key={opt.key}
                            onClick={() => setSelectedOptionKey(opt.key)}
                            className={`py-3 px-2.5 rounded-xl border text-xs font-bold transition-all active:scale-[0.98] cursor-pointer ${
                              isSelected
                                ? "bg-[#c08028] text-white border-[#c08028] shadow-[0_4px_12px_rgba(192,128,40,0.2)]"
                                : "bg-gray-950/85 text-gray-450 border-gray-850 hover:border-gray-700 hover:text-white"
                            }`}
                          >
                            {opt.label}
                          </button>
                        );
                      })}
                    </div>

                    <div className="flex flex-col gap-2 relative">
                      <div className="flex justify-between items-center px-1 text-xs text-gray-400">
                        <span className="font-semibold text-gray-300">
                          Từ khóa Prompt AI bối cảnh ({OPTIONS.find(o => o.key === selectedOptionKey)?.label}):
                        </span>
                        <span className="font-mono text-gray-500 font-bold">
                          {editorText.length} ký tự
                        </span>
                      </div>

                      <textarea
                        value={editorText}
                        onChange={handleTextChange}
                        placeholder="Nhập prompt mô tả chi tiết bối cảnh..."
                        className="w-full h-[280px] bg-gray-950 border border-gray-850 rounded-2xl p-4 text-sm text-white font-mono leading-relaxed outline-none focus:border-[#c08028] focus:ring-0 resize-none transition-all placeholder-gray-700 select-text"
                      />
                      
                      <div className="absolute right-4 bottom-4 flex items-center gap-2">
                        <button
                          onClick={() => handleCopyText(editorText)}
                          title="Sao chép prompt"
                          className="p-2.5 bg-gray-900 border border-gray-800 hover:border-gray-650 hover:text-white rounded-xl transition-all cursor-pointer group relative flex items-center justify-center active:scale-95"
                        >
                          {copied ? (
                            <Check className="w-4 h-4 text-green-500" />
                          ) : (
                            <Copy className="w-4 h-4 text-gray-400 group-hover:text-white" />
                          )}
                        </button>
                        
                        <button
                          onClick={handleResetConceptDefault}
                          disabled={resetting}
                          title="Khôi phục mặc định"
                          className="p-2.5 bg-gray-900 border border-gray-800 hover:border-red-900 hover:bg-red-950/20 rounded-xl transition-all cursor-pointer group disabled:opacity-40 disabled:cursor-not-allowed active:scale-95"
                        >
                          <Undo2 className="w-4 h-4 text-gray-400 group-hover:text-red-400" />
                        </button>
                      </div>
                    </div>

                    {/* REFERENCE IMAGE UPLOAD SLOTS GRID */}
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center justify-between px-1">
                        <span className="text-xs font-bold text-gray-300 flex items-center gap-1.5">
                          <ImageIcon className="w-4 h-4 text-[#c08028]" />
                          Quản lý ảnh tham chiếu (Tối thiểu 3 ảnh Ref để đối chiếu & random bối cảnh)
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {["1", "2", "3"].map((slot) => {
                          const refUrl = prompts[selectedConceptId]?.[`${selectedOptionKey}_refImage_${slot}`] || "";
                          const isUploading = uploadingSlots[slot];
                          const isSuccess = uploadSuccessSlots[slot];
                          
                          return (
                            <div 
                              key={slot}
                              className="bg-gray-950/60 border border-gray-850 p-3 rounded-2xl flex flex-col gap-3 items-center justify-between text-center relative"
                            >
                              <div className="w-full aspect-[4/3] bg-gray-900 border border-gray-800 rounded-xl overflow-hidden flex items-center justify-center relative group">
                                {refUrl ? (
                                  <img src={refUrl} alt={`Ref ${slot}`} className="w-full h-full object-cover" />
                                ) : (
                                  <div className="flex flex-col items-center gap-1 text-gray-600 text-[10px]">
                                    <ImageIcon className="w-5 h-5 opacity-25 text-[#c08028]" />
                                    <span>Trống (Slot 0{slot})</span>
                                  </div>
                                )}
                                
                                {isUploading && (
                                  <div className="absolute inset-0 bg-gray-950/80 flex items-center justify-center">
                                    <RefreshCw className="w-5 h-5 animate-spin text-[#c08028]" />
                                  </div>
                                )}
                              </div>
                              
                              <div className="text-left w-full">
                                <span className="text-[10px] font-bold text-gray-400 block">Ảnh Ref Slot 0{slot}</span>
                                <span className="text-[9px] text-gray-500 truncate block mt-0.5 max-w-full">
                                  {refUrl ? "✓ Đã cấu hình" : "Chưa tải lên"}
                                </span>
                              </div>
                              
                              <div className="flex gap-1.5 w-full mt-1">
                                <button
                                  onClick={() => {
                                    setActiveUploadSlot(slot);
                                    refFileInputRef.current?.setAttribute("data-slot", slot);
                                    refFileInputRef.current?.click();
                                  }}
                                  disabled={isUploading}
                                  className="flex-1 py-1.5 bg-gray-900 hover:bg-gray-800 border border-gray-800 text-[10px] font-bold text-white rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1 active:scale-95 disabled:opacity-40"
                                >
                                  <Upload className="w-3 h-3 text-[#ef4029]" />
                                  Tải lên
                                </button>
                                
                                {refUrl && (
                                  <button
                                    onClick={() => handleRemoveRefImage(slot)}
                                    className="py-1.5 px-2 bg-red-950/20 border border-red-900/30 hover:border-red-900/60 text-red-400 text-[10px] font-bold rounded-lg transition-all cursor-pointer active:scale-95"
                                  >
                                    Xóa
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      <input 
                        type="file" 
                        ref={refFileInputRef} 
                        onChange={(e) => {
                          const slot = refFileInputRef.current?.getAttribute("data-slot") || activeUploadSlot;
                          handleRefImageUpload(e, slot);
                        }} 
                        accept="image/*" 
                        className="hidden" 
                      />
                    </div>

                    <div className="bg-gray-950/30 border border-gray-850/60 p-4 rounded-2xl flex flex-col gap-1 text-xs text-gray-405 leading-relaxed">
                      <span className="font-bold text-gray-300">💡 Hướng dẫn cấu hình:</span>
                      <p>• Từ khóa mô tả dáng đứng, bối cảnh. Hãy tải lên tối thiểu 3 ảnh bối cảnh ở cả 3 slot để đối chiếu bố cục và tăng tính đa dạng.</p>
                      <p>• Nhớ bấm **Lưu cấu hình** ở góc dưới sau khi hoàn tất tải ảnh Ref hoặc thay đổi prompt.</p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-1 border-t border-gray-800/60 pt-4">
                      <div className="text-left w-full sm:w-auto">
                        {saveSuccess && (
                          <span className="text-xs text-green-400 font-bold flex items-center gap-1">
                            ✓ Đã lưu thành công lên Firestore!
                          </span>
                        )}
                        {!saveSuccess && (
                          <span className="text-xs text-gray-500 font-semibold italic">
                            * Nhớ bấm lưu sau khi thay đổi dữ liệu của bất kỳ dáng chụp nào.
                          </span>
                        )}
                      </div>

                      <button
                        onClick={handleSaveConcepts}
                        disabled={saving}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-[#c08028] to-[#ef4029] hover:brightness-110 active:scale-[0.97] disabled:brightness-75 disabled:cursor-not-allowed transition-all rounded-xl text-sm font-bold text-white shadow-lg shadow-[#c08028]/25 cursor-pointer border-none"
                      >
                        {saving ? (
                          <><RefreshCw className="w-4 h-4 animate-spin" />Đang lưu...</>
                        ) : (
                          <><Save className="w-4 h-4" />Lưu cấu hình</>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* TAB 2: SYSTEM PROMPTS */
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Cột 1: Danh sách System Prompts */}
                <div className="lg:col-span-1 flex flex-col gap-4">
                  <h3 className="text-xs font-bold uppercase text-gray-400 tracking-wider flex items-center gap-1.5 px-1">
                    <Settings className="w-3.5 h-3.5 text-[#c08028]" />
                    1. Chọn Prompt hệ thống
                  </h3>
                  
                  <div className="flex flex-col gap-2.5">
                    {SYSTEM_PROMPTS_CONFIG.map((item) => {
                      const isSelected = selectedSystemKey === item.key;
                      return (
                        <div
                          key={item.key}
                          onClick={() => setSelectedSystemKey(item.key)}
                          className={`cursor-pointer rounded-2xl p-4 border transition-all duration-300 flex flex-col gap-1.5 text-left relative overflow-hidden group ${
                            isSelected 
                              ? "bg-gradient-to-r from-gray-900 to-[#c08028]/5 border-[#c08028] shadow-[0_0_15px_rgba(192,128,40,0.15)]"
                              : "bg-gray-900/40 border-gray-800 hover:border-gray-700 hover:bg-gray-900/60"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                              isSelected ? "bg-[#c08028] text-white" : "bg-gray-800 text-gray-400"
                            }`}>
                              {item.key.replace("_PROMPT", "")}
                            </span>
                          </div>
                          <h4 className="font-bold text-sm text-white tracking-wide uppercase mt-0.5 group-hover:text-[#c08028] transition-colors">
                            {item.name}
                          </h4>
                          <p className="text-xs text-gray-400 leading-relaxed font-medium">
                            {item.desc}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Cột 2: Soạn thảo System Prompts */}
                <div className="lg:col-span-2 flex flex-col gap-4">
                  <h3 className="text-xs font-bold uppercase text-gray-400 tracking-wider flex items-center gap-1.5 px-1">
                    <FileText className="w-3.5 h-3.5 text-[#c08028]" />
                    2. Thiết lập cấu trúc Prompt Hệ thống
                  </h3>

                  <div className="bg-gray-900/40 backdrop-blur-md border border-gray-800 rounded-3xl p-6 flex flex-col gap-6 shadow-xl">
                    <div className="flex flex-col gap-2 relative">
                      <div className="flex justify-between items-center px-1 text-xs text-gray-400">
                        <span className="font-semibold text-gray-300">
                          Nội dung Prompt Hệ thống ({SYSTEM_PROMPTS_CONFIG.find(s => s.key === selectedSystemKey)?.name}):
                        </span>
                        <span className="font-mono text-gray-500 font-bold">
                          {systemEditorText.length} ký tự
                        </span>
                      </div>

                      <textarea
                        value={systemEditorText}
                        onChange={handleSystemTextChange}
                        placeholder="Cấu hình hệ thống prompt mẫu tại đây..."
                        className="w-full h-[320px] bg-gray-950 border border-gray-850 rounded-2xl p-4 text-sm text-white font-mono leading-relaxed outline-none focus:border-[#c08028] focus:ring-0 resize-none transition-all placeholder-gray-700 select-text"
                      />
                      
                      <div className="absolute right-4 bottom-4 flex items-center gap-2">
                        <button
                          onClick={() => handleCopyText(systemEditorText)}
                          title="Sao chép prompt"
                          className="p-2.5 bg-gray-900 border border-gray-800 hover:border-gray-650 hover:text-white rounded-xl transition-all cursor-pointer group relative flex items-center justify-center active:scale-95"
                        >
                          {copied ? (
                            <Check className="w-4 h-4 text-green-500" />
                          ) : (
                            <Copy className="w-4 h-4 text-gray-400 group-hover:text-white" />
                          )}
                        </button>
                        
                        <button
                          onClick={handleResetSystemDefault}
                          title="Khôi phục mặc định"
                          className="p-2.5 bg-gray-900 border border-gray-800 hover:border-red-900 hover:bg-red-950/20 rounded-xl transition-all cursor-pointer group active:scale-95"
                        >
                          <Undo2 className="w-4 h-4 text-gray-400 group-hover:text-red-400" />
                        </button>
                      </div>
                    </div>

                    <div className="bg-gray-950/50 border border-gray-850 p-4 rounded-2xl flex flex-col gap-1.5 text-xs text-gray-400 leading-relaxed">
                      <span className="font-bold text-gray-300">⚠️ Lưu ý an toàn hệ thống:</span>
                      <p>• Các trường bọc trong ngoặc kép hai bên như `{"{{Name}}"}` hay `{"{{Pride Statement}}"}` là placeholder hệ thống tự điền dữ liệu thật của khách chơi, hãy giữ nguyên định dạng này để tránh lỗi crash runtime.</p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-1 border-t border-gray-800/60 pt-4">
                      <div className="text-left w-full sm:w-auto">
                        {systemSaveSuccess && (
                          <span className="text-xs text-green-400 font-bold flex items-center gap-1">
                            ✓ Đã lưu cấu hình hệ thống thành công!
                          </span>
                        )}
                        {!systemSaveSuccess && (
                          <span className="text-xs text-gray-500 font-semibold italic">
                            * Cấu hình này định nghĩa hoạt động của toàn bộ lõi AI Agent.
                          </span>
                        )}
                      </div>

                      <button
                        onClick={handleSaveSystem}
                        disabled={systemSaving}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-[#c08028] to-[#ef4029] hover:brightness-110 active:scale-[0.97] disabled:brightness-75 disabled:cursor-not-allowed transition-all rounded-xl text-sm font-bold text-white shadow-lg shadow-[#c08028]/25 cursor-pointer border-none"
                      >
                        {systemSaving ? (
                          <><RefreshCw className="w-4 h-4 animate-spin" />Đang lưu...</>
                        ) : (
                          <><Save className="w-4 h-4" />Lưu cấu hình hệ thống</>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* PHẦN 3: PANEL THỬ NGHIỆM PROMPT (TEST PROMPT PANEL) */}
            <div className="flex flex-col gap-4 mt-6">
              <h3 className="text-xs font-bold uppercase text-gray-400 tracking-wider flex items-center gap-1.5 px-1">
                <Sparkles className="w-3.5 h-3.5 text-[#c08028]" />
                3. Chạy thử nghiệm Prompt (Test Prompt Panel)
              </h3>

              <div className="bg-gray-900/40 backdrop-blur-md border border-gray-800 rounded-3xl p-6 flex flex-col gap-6 shadow-xl">
                
                {/* Bố cục chia hai cột: Cột nhập ảnh (trái) và Cột kết quả sinh (phải) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Cột trái: Webcam/Camera chụp ảnh */}
                  <div className="bg-gray-950/80 border border-gray-850 p-5 rounded-2xl flex flex-col gap-4 items-center">
                    <h4 className="text-xs font-bold uppercase text-gray-300 self-start flex items-center gap-1">
                      <Camera className="w-3.5 h-3.5 text-[#c08028]" />
                      Webcam chụp / Chọn ảnh đầu vào
                    </h4>

                    {/* Camera stream view hoặc ảnh đã chụp */}
                    <div className="w-[280px] h-[280px] bg-gray-900 rounded-xl overflow-hidden border border-gray-800 relative flex items-center justify-center">
                      {cameraActive ? (
                        <video 
                          ref={videoRef} 
                          autoPlay 
                          playsInline 
                          className="w-full h-full object-cover scale-x-[-1]"
                        />
                      ) : capturedImage ? (
                        <img 
                          src={capturedImage} 
                          alt="Ảnh chụp mẫu" 
                          className="w-full h-full object-cover" 
                        />
                      ) : (
                        <div className="flex flex-col items-center gap-2 text-gray-600 text-xs text-center px-4">
                          <ImageIcon className="w-8 h-8 opacity-40 text-[#c08028]" />
                          Chưa có ảnh đầu vào. Hãy bật camera hoặc tải ảnh mẫu từ thiết bị.
                        </div>
                      )}
                    </div>

                    {/* Điều khiển Camera */}
                    <div className="flex flex-wrap gap-2 justify-center w-full">
                      {!cameraActive ? (
                        <button
                          onClick={startCamera}
                          className="flex items-center gap-1.5 px-4 py-2 bg-gray-900 hover:bg-gray-850 border border-gray-800 text-white rounded-lg text-xs font-bold transition-all cursor-pointer"
                        >
                          <Camera className="w-3.5 h-3.5 text-[#c08028]" />
                          Bật Camera
                        </button>
                      ) : (
                        <div className="flex gap-2">
                          <button
                            onClick={capturePhoto}
                            className="flex items-center gap-1.5 px-4 py-2 bg-green-900 hover:bg-green-800 border border-green-800 text-white rounded-lg text-xs font-bold transition-all cursor-pointer animate-pulse"
                          >
                            <Play className="w-3.5 h-3.5" />
                            Chụp ảnh
                          </button>
                          <button
                            onClick={stopCamera}
                            className="flex items-center gap-1.5 px-4 py-2 bg-red-950/30 hover:bg-red-950/50 border border-red-900/40 text-red-400 rounded-lg text-xs font-bold transition-all cursor-pointer"
                          >
                            Tắt Camera
                          </button>
                        </div>
                      )}

                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center gap-1.5 px-4 py-2 bg-gray-900 hover:bg-gray-850 border border-gray-800 text-white rounded-lg text-xs font-bold transition-all cursor-pointer"
                      >
                        <Upload className="w-3.5 h-3.5 text-[#ef4029]" />
                        Tải ảnh từ máy
                      </button>
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleFileChange} 
                        accept="image/*" 
                        className="hidden" 
                      />
                    </div>
                  </div>

                  {/* Cột phải: Kết quả sinh ảnh */}
                  <div className="bg-gray-950/80 border border-gray-850 p-5 rounded-2xl flex flex-col gap-4 items-center justify-between">
                    <h4 className="text-xs font-bold uppercase text-gray-300 self-start flex items-center gap-1 w-full justify-between">
                      <span className="flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-[#c08028]" />
                        Ảnh bìa tạp chí kết quả
                      </span>
                      {testLogs?.response?.fallbackTriggered && (
                        <span className="text-[10px] bg-amber-950/50 text-amber-400 px-2 py-0.5 rounded-full border border-amber-900/60 font-bold">
                          ⚠️ Fallback Active
                        </span>
                      )}
                    </h4>

                    {/* Khung hiển thị kết quả */}
                    <div className="w-[240px] h-[340px] bg-gray-900 rounded-xl overflow-hidden border border-gray-800 relative flex items-center justify-center shadow-lg">
                      {testLoading ? (
                        <div className="flex flex-col items-center gap-3 text-gray-500 text-xs px-4 text-center">
                          <RefreshCw className="w-8 h-8 animate-spin text-[#c08028]" />
                          <div>
                            <p className="font-bold text-white mb-0.5">Đang chạy sinh ảnh...</p>
                            <p className="opacity-50 text-[10px]">{isMock ? "Đang tải ảnh mẫu giả lập" : "Imagen 3 đang vẽ chân dung"}</p>
                          </div>
                        </div>
                      ) : testResultImage ? (
                        <img 
                          src={testResultImage} 
                          alt="Ảnh bìa test" 
                          className="w-full h-full object-contain" 
                        />
                      ) : (
                        <div className="flex flex-col items-center gap-2 text-gray-600 text-xs text-center px-4">
                          <ImageIcon className="w-8 h-8 opacity-40 text-gray-600" />
                          Kết quả chạy thử prompt sẽ hiển thị tại đây.
                        </div>
                      )}
                    </div>

                    {/* Nút Test và Config chế độ */}
                    <div className="flex flex-col items-center gap-3 w-full border-t border-gray-800/80 pt-4">
                      <div className="flex items-center gap-6 justify-center w-full">
                        <label className="flex items-center gap-2 text-xs font-bold text-gray-400 cursor-pointer">
                          <input 
                            type="checkbox"
                            checked={isMock}
                            onChange={(e) => setIsMock(e.target.checked)}
                            className="rounded border-gray-850 bg-gray-950 text-[#c08028] focus:ring-0 cursor-pointer"
                          />
                          Chạy Giả Lập (isMock)
                        </label>
                      </div>

                      <button
                        onClick={handleTestPrompt}
                        disabled={testLoading || !capturedImage}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-10 py-3 bg-gradient-to-r from-[#c08028] to-[#ef4029] hover:brightness-110 active:scale-[0.97] disabled:brightness-50 disabled:cursor-not-allowed transition-all rounded-xl text-xs font-extrabold text-white shadow-lg shadow-[#c08028]/15 cursor-pointer border-none"
                      >
                        {testLoading ? "Đang xử lý..." : "Bắt đầu Thử nghiệm (Imagen 3)"}
                      </button>
                    </div>

                  </div>

                </div>

                {/* KHU VỰC HIỂN THỊ LOG DETAIL CHI TIẾT */}
                {testLogs && (
                  <div className="border-t border-gray-850 pt-5 flex flex-col gap-3">
                    <button
                      onClick={() => setShowLogs(!showLogs)}
                      className="self-start text-xs font-bold text-gray-400 hover:text-white flex items-center gap-1 cursor-pointer bg-transparent border-none outline-none"
                    >
                      <FileText className="w-3.5 h-3.5 text-[#c08028]" />
                      {showLogs ? "▼ Ẩn Log chi tiết gửi/nhận" : "► Xem Log chi tiết gửi/nhận lúc test"}
                    </button>

                    {showLogs && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fadeIn">
                        {/* Request JSON */}
                        <div className="flex flex-col gap-1.5">
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider pl-1 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                            Request Payload gửi đi
                          </span>
                          <pre className="p-4 bg-gray-950/80 border border-gray-850 rounded-xl font-mono text-[10px] text-blue-300 overflow-x-auto h-[220px] select-text">
                            {JSON.stringify(testLogs.request, null, 2)}
                          </pre>
                        </div>

                        {/* Response JSON */}
                        <div className="flex flex-col gap-1.5">
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider pl-1 flex items-center gap-1">
                            <span className={`w-1.5 h-1.5 rounded-full ${testLogs.error ? "bg-red-500 animate-ping" : "bg-green-500"}`} />
                            Response JSON nhận về
                          </span>
                          <pre className={`p-4 bg-gray-950/80 border rounded-xl font-mono text-[10px] overflow-x-auto h-[220px] select-text ${
                            testLogs.error ? "border-red-900/60 text-red-400" : "border-gray-850 text-green-300"
                          }`}>
                            {testLogs.error 
                              ? `LỖI API:\n${testLogs.error}\n\nChi tiết response:\n${JSON.stringify(testLogs.response, null, 2)}`
                              : JSON.stringify(testLogs.response, null, 2)
                            }
                          </pre>
                        </div>
                      </div>
                    )}
                  </div>
                )}

              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
