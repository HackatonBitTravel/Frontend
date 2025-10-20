import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MessageCircle, X, Send, Globe } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getChatbotResponse } from "@/lib/api";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [language, setLanguage] = useState("fr");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isBotTyping, setIsBotTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    setMessages([
      {
        role: "assistant",
        content: language === "fr"
          ? "Bonjour! Comment puis-je vous aider avec votre voyage aujourd'hui?"
          : "Salaam aleekum! Naka nga def pour votre voyage?",
      },
    ]);
  }, [language]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!message.trim() || isBotTyping) return;

    const userMessage = { role: "user", content: message };
    setMessages((prev) => [...prev, userMessage]);
    setMessage("");
    setIsBotTyping(true);

    const botResponseText = await getChatbotResponse(message, language);

    // Add a placeholder for the bot's message
    setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

    let charIndex = 0;
    const interval = setInterval(() => {
      setMessages((prev) => {
        const newMessages = [...prev];
        const lastMessage = newMessages[newMessages.length - 1];
        lastMessage.content = botResponseText.substring(0, charIndex + 1);
        return newMessages;
      });

      charIndex++;

      if (charIndex === botResponseText.length) {
        clearInterval(interval);
        setIsBotTyping(false);
      }
    }, 30); // Adjust typing speed here
  };

  return (
    <>
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          size="lg"
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-elevated bg-gradient-hero hover:opacity-90 animate-scale-in z-50"
        >
          <MessageCircle className="h-6 w-6 text-white" />
        </Button>
      )}

      {isOpen && (
        <Card className="fixed inset-0 w-full h-full rounded-none shadow-elevated flex flex-col animate-slide-up z-50 md:inset-auto md:bottom-6 md:right-6 md:w-96 md:h-[500px] md:rounded-lg">
          <div className="bg-gradient-hero p-4 md:rounded-t-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-white" />
              <h3 className="font-semibold text-white">Assistant bitTravel</h3>
            </div>
            <div className="flex items-center gap-2">
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="w-20 h-8 bg-white/20 border-white/30 text-white text-xs">
                  <Globe className="h-3 w-3 mr-1" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fr">FR</SelectItem>
                  <SelectItem value="wo">WO</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="h-8 w-8 text-white hover:bg-white/20"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    msg.role === "user"
                      ? "bg-gradient-hero text-white"
                      : "bg-muted text-foreground"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Input
                placeholder={language === "fr" ? "Votre message..." : "Ci message bi..."}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                disabled={isBotTyping}
              />
              <Button onClick={handleSend} size="icon" className="bg-gradient-hero hover:opacity-90" disabled={isBotTyping}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      )}
    </>
  );
};

export default Chatbot;
