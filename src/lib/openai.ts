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

    return response.choices[0].message;
  } catch (error) {
    console.error("Erro na OpenAI:", error);
    throw error;
  }
}