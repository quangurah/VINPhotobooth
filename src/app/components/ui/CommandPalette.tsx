import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const typingTimerRef = useRef<number | null>(null);

  // Phản hồi giả lập của AI dựa trên từ khóa câu hỏi
  const getAiAnswer = (q: string): string => {
    const cleanQ = q.toLowerCase().trim();
    if (cleanQ.includes("thể lệ") || cleanQ.includes("luật") || cleanQ.includes("tham gia")) {
      return "Chương trình Nhập vai Vở diễn Hoàng gia diễn ra từ ngày 01/06/2026. Bạn chỉ cần đồng ý điều khoản, bấm 'Tham gia ngay', chọn vai diễn bản sắc của mình và để AI VinPalace kiến tạo tác phẩm tương lai độc bản của bạn!";
    }
    if (cleanQ.includes("giải thưởng") || cleanQ.includes("quà") || cleanQ.includes("phần thưởng")) {
      return "Cơ cấu giải thưởng hấp dẫn bao gồm: Cơ hội được vinh danh trên Billboard tại các tòa nhà lớn, giải thưởng tiền mặt trị giá lên đến 1.000.000đ từ Nhà hát VinPalace Theatre!";
    }
    if (cleanQ.includes("vai diễn") || cleanQ.includes("vở diễn") || cleanQ.includes("vinpalace") || cleanQ.includes("di sản")) {
      return "Nhập vai các chương trong vở diễn hoàng gia VinPalace Theatre là chương trình tôn vinh các câu chuyện độc bản của mỗi cá nhân. Bằng cách sử dụng AI thông minh, VinPalace sẽ đồng hành vẽ nên phân cảnh tương lai vươn tầm từ chính những vai diễn hôm nay của bạn.";
    }
    if (cleanQ.startsWith("/")) {
      return "Lệnh điều hướng đã sẵn sàng. Hãy bấm Enter để thực thi di chuyển trang!";
    }
    return "Chào bạn! Tôi là AI Assistant của VinPalace Theatre. Bạn có thể gõ các lệnh điều hướng như /home-2, /step-1, /step-6 hoặc hỏi tôi về 'Thể lệ chương trình', 'Giải thưởng hấp dẫn'.";
  };

  // Hiệu ứng gõ chữ (typing animation)
  const triggerTypingAnimation = (text: string) => {
    if (typingTimerRef.current) {
      window.clearInterval(typingTimerRef.current);
    }
    setAiResponse("");
    setIsTyping(true);
    let index = 0;
    
    typingTimerRef.current = window.setInterval(() => {
      if (index < text.length) {
        setAiResponse((prev) => prev + text.charAt(index));
        index++;
      } else {
        if (typingTimerRef.current) {
          window.clearInterval(typingTimerRef.current);
        }
        setIsTyping(false);
      }
    }, 20); // 20ms mỗi ký tự
  };

  // Lắng nghe sự kiện gõ phím
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      triggerTypingAnimation("Chào bạn! Tôi là Trợ lý AI của Vinpearl Theatre. Bạn cần tôi hỗ trợ điều gì hôm nay?");
    }
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      if (typingTimerRef.current) window.clearInterval(typingTimerRef.current);
    };
  }, [isOpen]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;

    // Xử lý các lệnh điều hướng nhanh
    if (query.startsWith("/")) {
      const command = query.toLowerCase().trim();
      if (command === "/home-2" || command === "/home") {
        navigate("/vinpalacehome2");
        onClose();
        return;
      }
      if (command === "/step-1") {
        navigate("/vinpalacestep1");
        onClose();
        return;
      }
      if (command === "/step-2") {
        navigate("/vinpalacestep2");
        onClose();
        return;
      }
      if (command === "/step-6" || command === "/done") {
        navigate("/vinpalacestep6");
        onClose();
        return;
      }
      if (command === "/the-le" || command === "/rules") {
        navigate("/vinpalacehome2");
        setTimeout(() => {
          const el = document.getElementById("the-le-section");
          if (el) el.scrollIntoView({ behavior: "smooth" });
        }, 400);
        onClose();
        return;
      }
      triggerTypingAnimation("Lệnh không hợp lệ. Vui lòng nhập các lệnh hỗ trợ: /home-2, /step-1, /step-2, /step-6, /the-le.");
    } else {
      // Gọi AI trả lời
      const answer = getAiAnswer(query);
      triggerTypingAnimation(answer);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[99999] flex items-start justify-center pt-[15vh] px-4 pointer-events-auto transition-opacity duration-300 ease-out"
      style={{
        backdropFilter: "blur(12px) saturate(180%)",
        backgroundColor: "rgba(0, 0, 0, 0.65)"
      }}
      onClick={onClose}
    >
      {/* Search box container */}
      <div
        className="bg-[#121214] border border-gray-800 shadow-[0px_32px_64px_rgba(0,0,0,0.8)] rounded-2xl w-full max-w-[600px] overflow-hidden transform transition-all duration-300 ease-out translate-y-0 opacity-100"
        onClick={(e) => e.stopPropagation()}
        style={{
          animation: "slideDown 0.3s cubic-bezier(0.16, 1, 0.3, 1)"
        }}
      >
        <form onSubmit={handleSearchSubmit} className="flex items-center border-b border-gray-800 px-4 py-3 gap-3">
          <svg className="w-5 h-5 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            placeholder="Gõ lệnh điều hướng (/step-1...) hoặc hỏi AI Assistant..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent border-none text-white text-[16px] placeholder-gray-500 focus:outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="text-gray-500 hover:text-white text-xs px-1"
            >
              Clear
            </button>
          )}
          <span className="text-[11px] bg-gray-800 text-gray-400 px-2 py-0.5 rounded font-mono select-none">
            ESC
          </span>
        </form>

        {/* AI Chat / Suggestions Area */}
        <div className="p-5 max-h-[350px] overflow-y-auto flex flex-col gap-4">
          {/* AI Response Block */}
          <div className="bg-[#1a1a1e] border border-gray-800 rounded-xl p-4 flex gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#c08028] to-[#ef4029] flex items-center justify-center text-white text-xs font-bold shrink-0">
              AI
            </div>
            <div className="flex-1 flex flex-col gap-1">
              <span className="text-xs text-gray-500 font-medium">Vinpearl Theatre AI Assistant</span>
              <p className="text-[14px] text-gray-200 leading-[22px] font-['Inter',sans-serif] whitespace-pre-wrap">
                {aiResponse}
                {isTyping && (
                  <span className="inline-block w-1.5 h-4 ml-0.5 bg-[#c08028] animate-pulse align-middle" />
                )}
              </p>
            </div>
          </div>

          {/* Quick Navigation Commands */}
          <div className="flex flex-col gap-2">
            <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">
              Lệnh Điều Hướng Nhanh
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => { setQuery("/home-2"); inputRef.current?.focus(); }}
                className="flex items-center justify-between p-2.5 rounded-lg bg-[#18181b] border border-gray-800 hover:border-[#c08028]/50 hover:bg-[#c08028]/5 text-left text-xs transition-all text-gray-300"
              >
                <span>Về Trang chủ vở diễn</span>
                <span className="font-mono text-[10px] text-gray-500">/home-2</span>
              </button>
              <button
                type="button"
                onClick={() => { setQuery("/step-1"); inputRef.current?.focus(); }}
                className="flex items-center justify-between p-2.5 rounded-lg bg-[#18181b] border border-gray-800 hover:border-[#c08028]/50 hover:bg-[#c08028]/5 text-left text-xs transition-all text-gray-300"
              >
                <span>Bắt đầu chơi (Step 1)</span>
                <span className="font-mono text-[10px] text-gray-500">/step-1</span>
              </button>
              <button
                type="button"
                onClick={() => { setQuery("/step-6"); inputRef.current?.focus(); }}
                className="flex items-center justify-between p-2.5 rounded-lg bg-[#18181b] border border-gray-800 hover:border-[#c08028]/50 hover:bg-[#c08028]/5 text-left text-xs transition-all text-gray-300"
              >
                <span>Xem kết quả (Step 6)</span>
                <span className="font-mono text-[10px] text-gray-500">/step-6</span>
              </button>
              <button
                type="button"
                onClick={() => { setQuery("/the-le"); inputRef.current?.focus(); }}
                className="flex items-center justify-between p-2.5 rounded-lg bg-[#18181b] border border-gray-800 hover:border-[#c08028]/50 hover:bg-[#c08028]/5 text-left text-xs transition-all text-gray-300"
              >
                <span>Xem thể lệ cuộc thi</span>
                <span className="font-mono text-[10px] text-gray-500">/the-le</span>
              </button>
            </div>
          </div>
        </div>

        {/* Keyboard shortcut footer helper */}
        <div className="bg-[#0b0b0c] border-t border-gray-850 px-5 py-2.5 flex items-center justify-between text-[11px] text-gray-500">
          <span>Gõ từ khóa & nhấn Enter để hỏi AI.</span>
          <span>Bấm ESC để đóng.</span>
        </div>
      </div>
      
      {/* Định nghĩa CSS Keyframe trượt xuống inline */}
      <style>{`
        @keyframes slideDown {
          from {
            transform: translateY(-20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
