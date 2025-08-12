import { useState } from "react";
import { MessageSquare, X } from "lucide-react";
import { Button } from "@/components/ui/button"; 
export default function FloatingChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([...messages, { from: "user", text: input }]);
    setInput("");
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {open ? (
        <div className="w-80 h-[450px] bg-zinc-900 rounded-xl shadow-lg flex flex-col overflow-hidden border border-zinc-800">
          {/* Header */}
          <div className="bg-zinc-800 p-4 flex justify-between items-center">
            <h2 className="text-white text-sm font-semibold">roadmap.in Chat</h2>
            <button onClick={() => setOpen(false)} className="text-zinc-400 hover:text-white">
              <X size={18} />
            </button>
          </div>

          {/* Chat History */}
          <div className="flex-1 px-4 py-2 overflow-y-auto space-y-2 text-sm text-white">
            {messages.length === 0 && (
              <p className="text-zinc-500 text-center mt-10">Start typing to chat!</p>
            )}
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`p-2 rounded-lg max-w-[80%] ${
                  msg.from === "user"
                    ? "bg-blue-600 ml-auto text-white"
                    : "bg-zinc-700 mr-auto text-white"
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>

          {/* Input Box */}
          <div className="p-3 border-t border-zinc-800 flex items-center gap-2">
            <input
              className="flex-1 px-3 py-2 rounded-md bg-zinc-800 text-white text-sm outline-none"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <Button size="sm" onClick={handleSend} className="bg-blue-600">
              Send
            </Button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setOpen(true)}
          className="bg-white/10 backdrop-blur-xl hover:bg-white/30 text-white p-3 rounded-full shadow-lg"
        >
          <MessageSquare size={24} />
        </button>
      )}
    </div>
  );
}
