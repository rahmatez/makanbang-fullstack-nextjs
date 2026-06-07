import { MessageCircle } from "lucide-react";

export function FloatingChatButton() {
  return (
    <a
      href="https://wa.me/6281393834186"
      target="_blank"
      rel="noopener noreferrer"
      className="animate-pulse-ring fixed bottom-[5.5rem] right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-[#25D366]/30 transition-transform hover:scale-105 active:scale-95 md:bottom-6 md:h-auto md:w-auto md:gap-2 md:px-5 md:py-3.5"
      aria-label="Chat WhatsApp"
    >
      <MessageCircle className="h-6 w-6 md:h-5 md:w-5" />
      <span className="hidden text-sm font-semibold md:inline">Chat</span>
    </a>
  );
}
