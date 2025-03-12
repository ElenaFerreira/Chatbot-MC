import React, { useEffect, useState } from "react";
import BlinkCursor from "../components/BlinkCursor";
import "./App.css";

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [visibleMessages, setVisibleMessages] = useState<string[]>([]);
  const [input, setInput] = useState<string>("");
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const chatBotInput = document.getElementById("chatbot") as HTMLInputElement | null;

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        handleFocusMessage();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleFocusMessage = () => {
    if (chatBotInput) {
      chatBotInput.focus();
    }
  };

  const handleInputFocus = () => {
    setVisibleMessages(messages.map((msg) => msg.content));
    if (timeoutId) clearTimeout(timeoutId);
    const newTimeoutId = setTimeout(() => {
      setVisibleMessages([]);
    }, 15000);
    setTimeoutId(newTimeoutId);
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;
    const newUserMessage = { role: "user", content: input };
    const newMessages = [...messages, newUserMessage];
    setMessages(newMessages);
    setVisibleMessages(newMessages.map((msg) => msg.content));
    setInput("");

    if (timeoutId) clearTimeout(timeoutId);
    const newTimeoutId = setTimeout(() => {
      setVisibleMessages([]);
    }, 15000);
    setTimeoutId(newTimeoutId);

    try {
      const fullMessage =
        "Si ce que je vais te dire n'a aucun rapport avec Minecraft le jeu vidéo, alors répond moi exactement 'Désolé, je ne peux pas répondre à ça'. Si c'est en rapport avec Minecraft, fais moi une réponse concise, maximum 100 mots, si deux suffisent pour répondre alors fais au plus court." +
        input;
      const response = await fetch("http://localhost:3000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: fullMessage }),
      });

      const data = await response.json();
      if (data.reply) {
        setMessages([...newMessages, { role: "bot", content: data.reply }]);
      } else {
        setMessages([...newMessages, { role: "notbot", content: "CraftBot is currently out of the office" }]);
      }
    } catch (error) {
      setMessages([...newMessages, { role: "notbot", content: "CraftBot is currently out of the office" }]);
    }
  };

  return (
    <div className="relative h-screen bg-cover bg-[url('./public/medias/images/background.png')]">
      <div className="absolute bottom-0 w-full p-4">
        {visibleMessages.length > 0 && (
          <div className="w-1/2 bg-black/50 p-2 overflow-y-auto mb-2">
            {messages.map((msg, index) => (
              <div key={index} className={`m-2 ${msg.role === "bot" ? "text-green-400" : msg.role === "notbot" ? "text-red-600" : "text-white"}`}>
                <span className="font-bold">{msg.role === "user" ? "<UserName> " : "<CraftBot> "}</span>
                <span>{msg.content}</span>
              </div>
            ))}
          </div>
        )}
        <div className="relative">
          <input
            id="chatbot"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onFocus={handleInputFocus}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            className="w-full p-2 pb-0 leading-[0.9] bg-black/50 text-white rounded border-0 focus:outline-none focus:ring-0 focus:border-0 active:outline-none active:ring-0 active:border-0"
            placeholder=""
          />
          <div className="absolute left-2 top-4 text-white">
            <BlinkCursor text={input} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
