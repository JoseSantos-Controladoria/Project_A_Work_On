import OpenAI from "openai";


const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});


const tools: OpenAI.Chat.Completions.ChatCompletionTool[] = [
  {
    type: "function",
    function: {
      name: "navegar_para",
      description: "Navega para uma área específica do sistema (Dashboard, Financeiro, Jurídico, etc).",
      parameters: {
        type: "object",
        properties: {
          view: {
            type: "string",
            enum: ["dashboard", "financeiro", "vendas", "rh", "ti", "operacoes", "legal", "admin"],
            description: "O ID da visualização para onde navegar."
          },
        },
        required: ["view"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "abrir_relatorio_financeiro",
      description: "Abre um modal com detalhes financeiros de um mês específico.",
      parameters: {
        type: "object",
        properties: {
          mes: {
            type: "string",
            description: "O número do mês (01 a 12) ou nome (janeiro, etc) para filtrar.",
          },
          titulo: {
            type: "string",
            description: "Um título descritivo para o relatório.",
          },
        },
        required: ["mes"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "abrir_status_contratos",
      description: "Abre um painel rápido com indicadores de contratos, vencimentos e processos jurídicos.",
      parameters: {
        type: "object",
        properties: {}, // Não precisa de parâmetros para este resumo geral
        required: [],
      },
    },
  },
];


export async function enviarMensagemParaIA(historicoMensagens: any[]) {
  try {

    const messages = [
      {
        role: "system",
        content: `Você é o assistente inteligente do sistema 'Work On'. 
        Você tem controle sobre a interface do usuário.
        Sempre que o usuário pedir para ver dados ou ir para uma tela, USE AS FERRAMENTAS DISPONÍVEIS.
        Se a pergunta for genérica (ex: "olá"), responda educadamente.
        Hoje é ${new Date().toLocaleDateString('pt-BR')}.`
      },
      ...historicoMensagens
    ];

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: messages,
      tools: tools,
      tool_choice: "auto",
    });

    const choice = response.choices && response.choices[0];
    const rawMessage = choice?.message || {};

    // Normaliza o conteúdo (pode vir em formatos diferentes conforme a versão da SDK)
    let content = "";
    if (typeof rawMessage.content === "string") {
      content = rawMessage.content;
    } else if (Array.isArray(rawMessage.content)) {
      // Alguns SDKs dividem o conteúdo em blocos
      content = rawMessage.content.map((c: any) => (typeof c === "string" ? c : c?.text || "")).join("");
    } else if (rawMessage.content && typeof rawMessage.content === "object") {
      content = rawMessage.content.text || rawMessage.content?.parts?.join("") || "";
    } else {
      content = rawMessage?.text || "";
    }

    // Normaliza as chamadas de ferramenta (function/tool calls)
    let tool_calls: any[] = [];
    if (rawMessage.tool_calls && Array.isArray(rawMessage.tool_calls)) {
      tool_calls = rawMessage.tool_calls;
    } else if (rawMessage.function_call) {
      tool_calls = [ { function: rawMessage.function_call } ];
    } else if (choice?.function_call) {
      tool_calls = [ { function: choice.function_call } ];
    } else if (choice?.message?.function_call) {
      tool_calls = [ { function: choice.message.function_call } ];
    }

    return {
      role: rawMessage.role,
      content,
      tool_calls,
      raw: rawMessage,
    };
  } catch (error) {
    console.error("Erro na OpenAI:", error);
    throw error;
  }
}