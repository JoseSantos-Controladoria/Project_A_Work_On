import { useState, useRef, useEffect } from "react";
import { X, Send, Bot, User, Sparkles, ArrowRightCircle, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";
import { enviarMensagemParaIA } from "../lib/openai";
import { BotAction, Message } from "@/types";

interface ChatbotPanelProps {
  onClose: () => void;
  userRole?: string;
  onAction: (action: BotAction) => void; // Função para disparar a ação no App.tsx
}

export function ChatbotPanel({ onClose, userRole = "Colaborador", onAction }: ChatbotPanelProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Olá! Sou o assistente Work On com IA. Posso controlar o sistema para você. Tente: 'Mostre o financeiro de setembro' ou 'Resumo jurídico'.",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll para a última mensagem
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userText = inputValue;
    setInputValue(""); // Limpa o input imediatamente

    // 1. Adiciona mensagem do usuário na tela
    const newMessage: Message = {
      id: Date.now(),
      text: userText,
      sender: "user",
      timestamp: new Date(),
    };
    
    const newHistory = [...messages, newMessage];
    setMessages(newHistory);
    setIsTyping(true);

    try {
      // 2. Prepara histórico para enviar à OpenAI
      const apiHistory = newHistory.map(m => ({
        role: m.sender === "user" ? "user" : "assistant",
        content: m.text || "" 
      }));

      // 3. Chama a "Inteligência"
      const aiResponse = await enviarMensagemParaIA(apiHistory);
      
      let botResponseText = aiResponse.content || "Entendido.";
      let botAction: BotAction | undefined = undefined;

      // 4. Verifica se a IA decidiu usar uma FERRAMENTA (Function Calling)
      if (aiResponse.tool_calls && aiResponse.tool_calls.length > 0) {
        const tool = aiResponse.tool_calls[0];
        const args = JSON.parse(tool.function.arguments);

        // --- Ferramenta: Navegação ---
        if (tool.function.name === "navegar_para") {
          botResponseText = `Navegando para a área de ${args.view}...`;
          botAction = {
            type: "NAVIGATE",
            payload: { view: args.view }
          };
        } 
        // --- Ferramenta: Financeiro ---
        else if (tool.function.name === "abrir_relatorio_financeiro") {
          botResponseText = `Abrindo relatório financeiro referente a ${args.mes}...`;
          botAction = {
            type: "OPEN_MODAL",
            payload: { 
              view: "financeiro_detalhe", 
              filter: args.mes,
              title: args.titulo || "Relatório Financeiro"
            }
          };
        }
        // --- Ferramenta: Jurídico (NOVO) ---
        else if (tool.function.name === "abrir_status_contratos") {
          botResponseText = "Acessando indicadores contratuais e jurídicos...";
          botAction = {
            type: "OPEN_MODAL",
            payload: { 
              view: "juridico_status",
              title: "Resumo Jurídico & Contratos"
            }
          };
        }
      }

      // 5. Adiciona resposta do Bot na tela
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: botResponseText,
        sender: "bot",
        timestamp: new Date(),
        action: botAction
      }]);

      // 6. Executa a ação real no App (abre o modal ou muda a tela)
      if (botAction) {
        setTimeout(() => {
          onAction(botAction!);
        }, 800); // Pequeno delay para o usuário ler a mensagem
      }

    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, {
        id: Date.now(),
        text: "Desculpe, tive um erro ao processar sua solicitação. Verifique sua conexão ou a API Key.",
        sender: "bot",
        timestamp: new Date()
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 w-96 h-[550px] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col z-50 overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300 font-sans">
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center backdrop-blur border border-white/20">
            <Sparkles className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-sm font-medium">Work On AI</h3>
            <p className="text-xs text-slate-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
              Online
            </p>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 text-white hover:bg-white/10 rounded-full">
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Área de Mensagens */}
      <ScrollArea ref={scrollRef} className="flex-1 p-4 bg-slate-50/80">
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex gap-3 ${message.sender === "user" ? "flex-row-reverse" : ""}`}>
              {/* Avatar */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm ${message.sender === "bot" ? "bg-white border border-slate-200" : "bg-slate-900 text-white"}`}>
                {message.sender === "bot" ? <Bot className="w-4 h-4 text-slate-700" /> : <User className="w-4 h-4" />}
              </div>
              
              {/* Balão de Mensagem */}
              <div className={`flex flex-col max-w-[75%] ${message.sender === "user" ? "items-end" : "items-start"}`}>
                <div className={`p-3 rounded-2xl text-sm shadow-sm ${
                  message.sender === "bot" 
                    ? "bg-white border border-slate-200 text-slate-700 rounded-tl-none" 
                    : "bg-blue-600 text-white rounded-tr-none"
                }`}>
                  {message.text}
                </div>
                
                {/* Feedback Visual da Ação Automática */}
                {message.action && (
                  <div className="mt-2 flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 px-3 py-2 rounded-lg border border-emerald-100 w-full animate-in fade-in slide-in-from-top-2">
                    <ArrowRightCircle className="w-3 h-3" />
                    <span className="font-medium">
                      {message.action.type === "NAVIGATE" ? "Navegando..." : "Gerando Dados..."}
                    </span>
                  </div>
                )}
                
                <span className="text-[10px] text-slate-400 mt-1 px-1">
                  {message.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </span>
              </div>
            </div>
          ))}
          
          {/* Indicador de Digitando */}
          {isTyping && (
            <div className="flex gap-3 animate-in fade-in duration-300">
              <div className="w-8 h-8 bg-white border border-slate-200 rounded-full flex items-center justify-center shadow-sm"><Loader2 className="w-4 h-4 animate-spin text-slate-400" /></div>
              <div className="bg-white border border-slate-200 p-3 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input de Texto */}
      <div className="p-3 bg-white border-t border-slate-200">
        <div className="flex gap-2 items-center bg-slate-50 p-1 pr-2 rounded-full border border-slate-200 focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-50 transition-all">
          <Input 
            value={inputValue} 
            onChange={(e) => setInputValue(e.target.value)} 
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Digite sua dúvida ou comando..." 
            className="flex-1 bg-transparent border-none shadow-none focus-visible:ring-0 h-10 px-4"
            disabled={isTyping}
          />
          <Button 
            onClick={handleSend} 
            size="icon" 
            className={`h-8 w-8 rounded-full transition-all ${inputValue.trim() ? 'bg-blue-600 hover:bg-blue-700 shadow-md scale-100' : 'bg-slate-300 cursor-not-allowed scale-90 opacity-50'}`}
            disabled={!inputValue.trim() || isTyping}
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}