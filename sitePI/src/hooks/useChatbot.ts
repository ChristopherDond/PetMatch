import { useState, useCallback } from "react";
import type { ChatMessage } from "@/types";

const menuMessage = `Como posso ajudar? Digite o número da opção:

📍 1 - Como adotar
📍 2 - Informações sobre ONGs
📍 3 - Cães com deficiência
📍 4 - Processo de adoção

Ou digite sua dúvida abaixo:`;

export function useChatbot() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      text: "Olá! " + menuMessage,
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [isOpen, setIsOpen] = useState(false);

  const sendMessage = useCallback((text: string) => {
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      text,
      isUser: true,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);

    setTimeout(() => {
      let response =
        "Não entendi. 🤔\nDigite 'ajuda' para ver o menu de opções.";
      const input = text.trim();

      if (input === "1")
        response =
          '🐾 Para adotar, acesse a aba "Adoção" e escolha seu novo amigo!';
      if (input === "2")
        response = '🏠 Veja as ONGs parceiras na aba "Localizações".';
      if (input === "3")
        response = "♿ Cães especiais esperam por você! Confira na vitrine.";
      if (input === "4")
        response = "📝 O processo requer formulário e entrevista.";
      if (input.toLowerCase().includes("ajuda")) response = menuMessage;

      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: response,
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMsg]);
    }, 600);
  }, []);

  return {
    messages,
    isOpen,
    sendMessage,
    toggleChat: () => setIsOpen((prev) => !prev),
    closeChat: () => setIsOpen(false),
    clearMessages: () =>
      setMessages([
        { id: "1", text: menuMessage, isUser: false, timestamp: new Date() },
      ]),
  };
}
