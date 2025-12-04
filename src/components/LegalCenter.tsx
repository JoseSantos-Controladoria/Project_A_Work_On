import { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button, buttonVariants } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { cn } from "./ui/utils";
import {
  ArrowLeft,
  Upload,
  Download,
  Eye,
  FileText,
  Clock,
  Shield,
  Search,
  Lock,
  AlertTriangle,
  Briefcase,
  Calendar,
  History,
  FileWarning,
  UserX,
  FileDown,
  Loader2,
  CloudUpload,
  X,
  Kanban,
  Gavel,
  CheckCircle2,
  MoreHorizontal
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { Alert, AlertDescription } from "./ui/alert";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

// Importações do React-PDF
import { 
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFDownloadLink 
} from '@react-pdf/renderer';

import { useAuth } from "@/contexts/AuthContext";
import { ReauthDialog } from "./ReauthDialog";

interface LegalCenterProps {
  onClose: () => void;
  userName: string;
  userRole: string;
}

// --- TIPOS EXISTENTES ---
interface DocumentType { id: number; name: string; department: string; category: string; version: string; uploadDate: string; uploadedBy: string; size: string; status: "Ativo" | "Arquivado" | "Revisão"; fileType: string; accessCount: number; }
interface AuditLog { id: number; user: string; action: string; document: string; timestamp: string; ip: string; }
interface CollaboratorDossier { matricula: string; name: string; cpf: string; role: string; department: string; admissionDate: string; terminationDate?: string; terminationReason?: string; status: "Ativo" | "Desligado" | "Afastado"; riskLevel: "Baixo" | "Médio" | "Alto"; pointHistory: { month: string; absences: number; delays: number; overtime: number; status: string; }[]; occurrences: { id: number; type: "Advertência" | "Suspensão" | "Atestado" | "Promoção" | "Rescisão"; date: string; description: string; documentUrl?: string; }[]; documents: { id: number; name: string; type: string; date: string; }[]; }

// --- NOVOS TIPOS PARA O KANBAN ---
type ProcessStatus = "analise" | "juizo" | "concluido";

interface LegalProcess {
  id: string;
  number: string;
  title: string;
  value: string;
  priority: "Alta" | "Média" | "Baixa";
  type: "Trabalhista" | "Cível" | "Tributário";
  dueDate: string;
}

interface KanbanColumn {
  id: ProcessStatus;
  title: string;
  items: LegalProcess[];
}

// --- MOCK DATA PARA O KANBAN ---
const initialKanbanData: KanbanColumn[] = [
  {
    id: "analise",
    title: "Em Análise",
    items: [
      { id: "p1", number: "0012345-88.2025.5.02.0001", title: "Reclamação Trab. - Silva", value: "R$ 45.000", priority: "Alta", type: "Trabalhista", dueDate: "15/12/2025" },
      { id: "p2", number: "0054321-12.2025.8.26.0100", title: "Ação Indenizatória Fornecedor", value: "R$ 12.500", priority: "Média", type: "Cível", dueDate: "20/01/2026" },
    ]
  },
  {
    id: "juizo",
    title: "Em Juízo",
    items: [
      { id: "p3", number: "0098765-33.2024.5.02.0055", title: "Recurso Ordinário - Oliveira", value: "R$ 120.000", priority: "Alta", type: "Trabalhista", dueDate: "10/11/2025" },
    ]
  },
  {
    id: "concluido",
    title: "Concluído / Arquivado",
    items: [
      { id: "p4", number: "0011223-44.2023.4.03.6100", title: "Execução Fiscal - ISS", value: "R$ 5.000", priority: "Baixa", type: "Tributário", dueDate: "Finalizado" },
    ]
  }
];

const pdfStyles = StyleSheet.create({ page: { padding: 40, fontFamily: 'Helvetica' }, headerContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20, borderBottomWidth: 1, borderBottomColor: '#ccc', paddingBottom: 10 }, headerTitle: { fontSize: 18, color: '#1e293b', fontWeight: 'bold' }, headerSubtitle: { fontSize: 10, color: '#64748b' }, sectionTitle: { fontSize: 14, marginTop: 20, marginBottom: 10, padding: 5, backgroundColor: '#f1f5f9', color: '#334155', fontWeight: 'bold' }, row: { flexDirection: 'row', marginBottom: 5 }, label: { width: '30%', fontSize: 10, color: '#64748b' }, value: { width: '70%', fontSize: 10, color: '#0f172a' }, statusValue: { width: '70%', fontSize: 10, color: '#0f172a', fontWeight: 'bold' }, warningText: { color: '#dc2626', fontWeight: 'bold' }, tableHeader: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#000', paddingBottom: 5, marginTop: 10, backgroundColor: '#e2e8f0' }, tableRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#e2e8f0', paddingVertical: 6 }, colDate: { width: '20%', fontSize: 9, paddingLeft: 5 }, colType: { width: '30%', fontSize: 9 }, colDesc: { width: '50%', fontSize: 9 }, footer: { position: 'absolute', bottom: 30, left: 40, right: 40, textAlign: 'center', fontSize: 8, color: '#94a3b8', borderTopWidth: 1, borderTopColor: '#e2e8f0', paddingTop: 10 } });

const LegalDossierDocument = ({ data, user }: { data: CollaboratorDossier; user: string }) => (
  <Document>
    <Page size="A4" style={pdfStyles.page}>
      {/* CABEÇALHO */}
      <View style={pdfStyles.headerContainer}>
        <View>
          <Text style={pdfStyles.headerTitle}>Dossiê Jurídico</Text>
          <Text style={pdfStyles.headerSubtitle}>Confidencial - Uso Interno</Text>
        </View>
        <View>
          <Text style={pdfStyles.headerSubtitle}>
            Gerado em: {new Date().toLocaleDateString("pt-BR")}
          </Text>
          <Text style={pdfStyles.headerSubtitle}>Solicitante: {user}</Text>
        </View>
      </View>

      {/* DADOS DO COLABORADOR */}
      <Text style={pdfStyles.sectionTitle}>Dados do Colaborador</Text>
      <View>
        <View style={pdfStyles.row}>
          <Text style={pdfStyles.label}>Nome Completo:</Text>
          <Text style={pdfStyles.value}>{data.name}</Text>
        </View>
        <View style={pdfStyles.row}>
          <Text style={pdfStyles.label}>CPF:</Text>
          <Text style={pdfStyles.value}>{data.cpf}</Text>
        </View>
        <View style={pdfStyles.row}>
          <Text style={pdfStyles.label}>Matrícula:</Text>
          <Text style={pdfStyles.value}>{data.matricula}</Text>
        </View>
        <View style={pdfStyles.row}>
          <Text style={pdfStyles.label}>Departamento:</Text>
          <Text style={pdfStyles.value}>{data.department}</Text>
        </View>
        <View style={pdfStyles.row}>
          <Text style={pdfStyles.label}>Cargo:</Text>
          <Text style={pdfStyles.value}>{data.role}</Text>
        </View>
        <View style={pdfStyles.row}>
          <Text style={pdfStyles.label}>Status:</Text>
          <Text
            style={
              data.status === "Desligado"
                ? [pdfStyles.statusValue, pdfStyles.warningText]
                : pdfStyles.statusValue
            }
          >
            {data.status.toUpperCase()}
          </Text>
        </View>
      </View>

      {/* ANÁLISE DE VÍNCULO */}
      <Text style={pdfStyles.sectionTitle}>Análise de Vínculo</Text>
      <View>
        <View style={pdfStyles.row}>
          <Text style={pdfStyles.label}>Data de Admissão:</Text>
          <Text style={pdfStyles.value}>
            {new Date(data.admissionDate).toLocaleDateString("pt-BR")}
          </Text>
        </View>
        <View style={pdfStyles.row}>
          <Text style={pdfStyles.label}>Risco Trabalhista:</Text>
          <Text style={pdfStyles.value}>{data.riskLevel}</Text>
        </View>
        {data.terminationDate && (
          <>
            <View style={pdfStyles.row}>
              <Text style={pdfStyles.label}>Data de Desligamento:</Text>
              <Text style={pdfStyles.value}>
                {new Date(data.terminationDate).toLocaleDateString("pt-BR")}
              </Text>
            </View>
            <View style={pdfStyles.row}>
              <Text style={pdfStyles.label}>Motivo:</Text>
              <Text style={pdfStyles.value}>{data.terminationReason}</Text>
            </View>
          </>
        )}
      </View>

      {/* HISTÓRICO DE OCORRÊNCIAS */}
      <Text style={pdfStyles.sectionTitle}>Histórico de Ocorrências</Text>
      <View style={pdfStyles.tableHeader}>
        <Text style={pdfStyles.colDate}>DATA</Text>
        <Text style={pdfStyles.colType}>TIPO</Text>
        <Text style={pdfStyles.colDesc}>DESCRIÇÃO</Text>
      </View>
      {data.occurrences.map((occ) => (
        <View key={occ.id} style={pdfStyles.tableRow}>
          <Text style={pdfStyles.colDate}>
            {new Date(occ.date).toLocaleDateString("pt-BR")}
          </Text>
          <Text style={pdfStyles.colType}>{occ.type}</Text>
          <Text style={pdfStyles.colDesc}>{occ.description}</Text>
        </View>
      ))}

      {/* RODAPÉ */}
      <Text style={pdfStyles.footer}>
        Este documento contém informações sensíveis protegidas pela LGPD. O
        compartilhamento não autorizado é proibido. Gerado pelo sistema Work On.
      </Text>
    </Page>
  </Document>
);

const mockDocuments: DocumentType[] = [
  { id: 1, name: "Contrato de Trabalho - Modelo 2025", department: "RH", category: "Contratos", version: "v3.2", uploadDate: "2025-11-01", uploadedBy: "Dr. Ricardo Alves", size: "245 KB", status: "Ativo", fileType: "PDF", accessCount: 127 },
  { id: 2, name: "Política de LGPD - Tratamento de Dados", department: "Compliance", category: "Políticas", version: "v2.1", uploadDate: "2025-10-15", uploadedBy: "Dra. Marina Costa", size: "1.2 MB", status: "Ativo", fileType: "PDF", accessCount: 89 },
  { id: 3, name: "Acordo de Fornecimento - TechSupply Ltda", department: "Financeiro", category: "Contratos", version: "v1.5", uploadDate: "2025-10-20", uploadedBy: "Dr. Ricardo Alves", size: "512 KB", status: "Ativo", fileType: "DOCX", accessCount: 45 },
  { id: 4, name: "Procuração - Representação Legal", department: "Jurídico", category: "Procurações", version: "v1.0", uploadDate: "2025-09-30", uploadedBy: "Dra. Marina Costa", size: "180 KB", status: "Ativo", fileType: "PDF", accessCount: 23 },
  { id: 5, name: "Licença Ambiental - Sede Principal", department: "Operações", category: "Licenças", version: "v4.0", uploadDate: "2025-08-10", uploadedBy: "Dr. Ricardo Alves", size: "3.5 MB", status: "Ativo", fileType: "PDF", accessCount: 34 },
  { id: 6, name: "Contrato de Prestação de Serviços - Modelo 2025", department: "Jurídico", category: "Contratos", version: "v2.3", uploadDate: "2025-11-05", uploadedBy: "Dra. Marina Costa", size: "300 KB", status: "Ativo", fileType: "PDF", accessCount: 56 },
  { id: 7, name: "Aditivo Contratual - TechSupply Ltda", department: "Financeiro", category: "Contratos", version: "v1.1", uploadDate: "2025-11-03", uploadedBy: "Dr. Ricardo Alves", size: "150 KB", status: "Ativo", fileType: "DOCX", accessCount: 12 },
  { id: 8, name: "Política de Segurança da Informação", department: "TI", category: "Políticas", version: "v3.0", uploadDate: "2025-10-25", uploadedBy: "Dra. Marina Costa", size: "2.1 MB", status: "Ativo", fileType: "PDF", accessCount: 78 },
  { id: 9, name: "Relatório Anual de Sustentabilidade 2024", department: "Sustentabilidade", category: "Relatórios", version: "v1.0", uploadDate: "2025-09-15", uploadedBy: "Dr. Ricardo Alves", size: "4.8 MB", status: "Ativo", fileType: "PDF", accessCount: 67 },
  { id: 10, name: "Estratégia de Vendas 2025", department: "Comercial", category: "Planejamento", version: "v2.0", uploadDate: "2025-10-05", uploadedBy: "Dra. Marina Costa", size: "1.5 MB", status: "Ativo", fileType: "PPTX", accessCount: 41 },
];

const mockAuditLogs: AuditLog[] = [
  { id: 1, user: "Ana Silva", action: "Download", document: "Política de LGPD", timestamp: "2025-11-07 14:23:15", ip: "192.168.1.10" },
  { id: 2, user: "Dr. Ricardo Alves", action: "Upload", document: "Contrato de Trabalho", timestamp: "2025-11-07 11:45:30", ip: "192.168.1.25" },
  { id: 3, user: "Carlos Santos", action: "Visualização", document: "Acordo de Fornecimento", timestamp: "2025-11-07 09:12:42", ip: "192.168.1.33" },
  { id: 4, user: "Dra. Marina Costa", action: "Edição", document: "Procuração - Representação Legal", timestamp: "2025-11-06 16:05:18", ip: "192.168.1.34" },
  { id: 5, user: "Fernanda Lima", action: "Download", document: "Licença Ambiental", timestamp: "2025-11-06 13:37:50", ip: "192.168.1.10" },
];

const activeDossierMock: CollaboratorDossier = {
  matricula: "009821", name: "João da Silva", cpf: "123.456.789-00", role: "Analista de Operações Pleno", department: "Operações", admissionDate: "2022-03-15", status: "Ativo", riskLevel: "Médio",
  pointHistory: [{ month: "Out/2025", absences: 0, delays: 15, overtime: 2, status: "Normal" }, { month: "Set/2025", absences: 1, delays: 45, overtime: 0, status: "Atenção" }, { month: "Ago/2025", absences: 0, delays: 0, overtime: 12, status: "Hora Extra" }],
  occurrences: [{ id: 1, type: "Advertência", date: "2025-09-10", description: "Atraso injustificado recorrente (>3 vezes na semana).", documentUrl: "#" }, { id: 2, type: "Atestado", date: "2025-07-20", description: "Afastamento médico de 3 dias (CID J00).", documentUrl: "#" }, { id: 3, type: "Promoção", date: "2024-01-01", description: "Promovido de Júnior para Pleno por mérito.", documentUrl: "#" }],
  documents: [{ id: 101, name: "Contrato de Trabalho Assinado.pdf", type: "Contrato", date: "2022-03-15" }, { id: 102, name: "Termo de Confidencialidade (NDA).pdf", type: "Legal", date: "2022-03-15" }, { id: 103, name: "Advertência_01_Atrasos.pdf", type: "Disciplinar", date: "2025-09-10" }, { id: 104, name: "Espelho_Ponto_2024.pdf", type: "Ponto", date: "2024-12-31" }]
};

const dismissedDossierMock: CollaboratorDossier = {
  matricula: "005540-X", name: "Roberto Campos", cpf: "456.789.123-00", role: "Gerente de Vendas", department: "Comercial", admissionDate: "2020-05-10", terminationDate: "2025-10-30", terminationReason: "Demissão sem justa causa", status: "Desligado", riskLevel: "Alto",
  pointHistory: [{ month: "Out/2025", absences: 5, delays: 0, overtime: 0, status: "Crítico" }, { month: "Set/2025", absences: 2, delays: 120, overtime: 0, status: "Atenção" }, { month: "Ago/2025", absences: 0, delays: 30, overtime: 4, status: "Normal" }],
  occurrences: [{ id: 99, type: "Rescisão", date: "2025-10-30", description: "Desligamento efetuado. Pagamento das verbas rescisórias agendado.", documentUrl: "#" }, { id: 98, type: "Suspensão", date: "2025-09-15", description: "Suspensão de 3 dias por conduta inadequada com cliente.", documentUrl: "#" }, { id: 97, type: "Advertência", date: "2025-08-01", description: "Não cumprimento de metas e ausência em reuniões.", documentUrl: "#" }],
  documents: [{ id: 201, name: "TRCT - Termo de Rescisão.pdf", type: "Legal", date: "2025-10-30" }, { id: 202, name: "Exame Demissional.pdf", type: "Saúde", date: "2025-10-28" }, { id: 203, name: "Carta de Preposto.pdf", type: "Legal", date: "2025-11-01" }, { id: 204, name: "Contrato de Trabalho 2020.pdf", type: "Contrato", date: "2020-05-10" }, { id: 205, name: "Suspensão_Disciplinar.pdf", type: "Disciplinar", date: "2025-09-15" }]
};

export function LegalCenter({ onClose, userName }: LegalCenterProps) {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all");
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);

  const [dossierSearch, setDossierSearch] = useState("");
  const [activeDossier, setActiveDossier] = useState<CollaboratorDossier | null>(null);
  const [isSearchingDossier, setIsSearchingDossier] = useState(false);

  const [showExportReauth, setShowExportReauth] = useState(false);
  const [isExportUnlocked, setIsExportUnlocked] = useState(false);

  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- KANBAN STATES ---
  const [kanbanColumns, setKanbanColumns] = useState<KanbanColumn[]>(initialKanbanData);
  const [draggedItem, setDraggedItem] = useState<{ id: string; sourceColumn: ProcessStatus } | null>(null);

  const filteredDocuments = mockDocuments.filter((doc) => {
    return (
      (doc.name.toLowerCase().includes(searchTerm.toLowerCase()) || doc.category.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (selectedDepartment === "all" || doc.department === selectedDepartment)
    );
  });

  // --- FUNÇÕES KANBAN ---
  const onDragStart = (e: React.DragEvent, id: string, sourceColumn: ProcessStatus) => {
    setDraggedItem({ id, sourceColumn });
    e.dataTransfer.effectAllowed = "move";
  };

  const onDragOverKanban = (e: React.DragEvent) => {
    e.preventDefault(); // Necessário para permitir o drop
  };

  const onDropKanban = (e: React.DragEvent, targetColumnId: ProcessStatus) => {
    e.preventDefault();
    if (!draggedItem) return;
    if (draggedItem.sourceColumn === targetColumnId) return;

    // Lógica para mover o item
    const sourceColIndex = kanbanColumns.findIndex(c => c.id === draggedItem.sourceColumn);
    const targetColIndex = kanbanColumns.findIndex(c => c.id === targetColumnId);
    
    if (sourceColIndex === -1 || targetColIndex === -1) return;

    const sourceCol = kanbanColumns[sourceColIndex];
    const targetCol = kanbanColumns[targetColIndex];
    if (!sourceCol || !targetCol) return;

    const sourceItems = [...sourceCol.items];
    const targetItems = [...targetCol.items];

    const itemIndex = sourceItems.findIndex(i => i.id === draggedItem.id);
    if (itemIndex === -1) return;
    
    const movedItem = sourceItems[itemIndex];
    if (!movedItem) return;
    
    sourceItems.splice(itemIndex, 1);
    targetItems.push(movedItem);

    const newColumns = [...kanbanColumns];
    newColumns[sourceColIndex] = { ...sourceCol, items: sourceItems };
    newColumns[targetColIndex] = { ...targetCol, items: targetItems };

    setKanbanColumns(newColumns);
    setDraggedItem(null);
    toast.success(`Processo movido para: ${targetCol.title}`);
  };
  // --------------------

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles = Array.from(e.dataTransfer.files);
      setUploadedFiles((prev) => [...prev, ...newFiles]);
      toast.success(`${newFiles.length} arquivo(s) adicionado(s) à lista.`);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setUploadedFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleConfirmUpload = () => {
    if (uploadedFiles.length === 0) {
      toast.error("Selecione pelo menos um arquivo.");
      return;
    }
    toast.success(`${uploadedFiles.length} arquivo(s) enviado(s) com sucesso!`, { description: "Disponível para consulta no repositório." });
    setUploadedFiles([]); // Limpa lista
    setUploadDialogOpen(false); // Fecha modal
  };

  const handleDossierSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dossierSearch) return;

    setIsSearchingDossier(true);
    setIsExportUnlocked(false);
    
    setTimeout(() => {
      const term = dossierSearch.toLowerCase();
      if (term.includes("roberto") || term.includes("456") || term.includes("5540")) {
        setActiveDossier(dismissedDossierMock);
        toast.warning("Colaborador Desligado Localizado", { description: "Atenção: Passivo trabalhista em análise." });
      } else if (term.includes("joao") || term.includes("joão") || term.includes("9821")) {
        setActiveDossier(activeDossierMock);
        toast.success("Colaborador Ativo Localizado", { description: "Dossiê carregado com sucesso." });
      } else {
        toast.error("Não encontrado", { description: "Tente buscar por Matrícula, Nome ou CPF." });
        setActiveDossier(null);
      }
      setIsSearchingDossier(false);
    }, 800);
  };

  const handleExportClick = () => {
    if (isExportUnlocked) return;
    setShowExportReauth(true);
  };

  const handleReauthConfirm = () => {
    setShowExportReauth(false);
    setIsExportUnlocked(true);
    toast.success("Acesso Liberado!", { description: "O download do dossiê está disponível." });
  };

  const handleDownload = (docName: string) => {
    toast.success(`Download iniciado: ${docName}`, { description: "Acesso registrado no log de auditoria." });
  };

  const handleView = (docName: string) => {
    toast.info(`Visualizando: ${docName}`, { description: "Acesso registrado no log de auditoria." });
  };

  const getStatusBadge = (status: string) => {
    const map: Record<string, string> = { Ativo: "bg-green-100 text-green-700", Arquivado: "bg-slate-100 text-slate-700", Revisão: "bg-amber-100 text-amber-700" };
    return map[status] || "bg-slate-100";
  };

  const getDossierStatusBadge = (status: string) => {
    if (status === "Desligado") return <Badge variant="destructive" className="bg-red-100 text-red-700 border-red-200 hover:bg-red-200">Desligado</Badge>;
    if (status === "Afastado") return <Badge variant="secondary" className="bg-amber-100 text-amber-700 border-amber-200">Afastado (INSS)</Badge>;
    return <Badge className="bg-green-100 text-green-700 hover:bg-green-200 border-green-200">Ativo</Badge>;
  };

  const getRiskBadge = (level: string) => {
    const map: Record<string, string> = {
      Baixo: "bg-blue-50 text-blue-700 border-blue-200",
      Médio: "bg-amber-50 text-amber-700 border-amber-200",
      Alto: "bg-red-50 text-red-700 border-red-200",
    };
    return <Badge variant="outline" className={map[level]}>{level} Risco</Badge>;
  };

  const getCategoryIcon = (cat: string) => {
    if (cat === "Contratos") return <FileText className="w-4 h-4" />;
    if (cat === "Políticas") return <Shield className="w-4 h-4" />;
    return <FileText className="w-4 h-4" />;
  };

  return (
    <div className="flex-1 overflow-auto bg-slate-50">
      <div className="p-6 max-w-7xl mx-auto">
        <Button variant="ghost" onClick={onClose} className="mb-6 print:hidden">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar ao Dashboard
        </Button>

        <div className="mb-6 print:hidden">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-red-700 rounded-xl flex items-center justify-center">
              <Lock className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-slate-900">Central de Documentações Jurídicas</h1>
              <p className="text-slate-600">Área restrita - Acesso monitorado e auditado</p>
            </div>
          </div>
          <Alert className="border-red-200 bg-red-50">
            <Shield className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              <strong>Atenção:</strong> Esta área contém dados sensíveis (LGPD). Todos os acessos são registrados.
            </AlertDescription>
          </Alert>
        </div>

        <Tabs defaultValue="documents" className="space-y-6">
          <TabsList className="bg-white border border-slate-200 p-1 w-full justify-start h-auto print:hidden">
            <TabsTrigger value="documents" className="flex-1 max-w-[200px]">Documentos</TabsTrigger>
            <TabsTrigger value="processos" className="flex-1 max-w-[200px]">
                <Kanban className="w-4 h-4 mr-2" /> Processos
            </TabsTrigger>
            <TabsTrigger value="dossier" className="flex-1 max-w-[200px] data-[state=active]:bg-red-50 data-[state=active]:text-red-700">
                <Search className="w-4 h-4 mr-2"/>
                Investigação
            </TabsTrigger>
            <TabsTrigger value="audit" className="flex-1 max-w-[200px]">Auditoria</TabsTrigger>
            <TabsTrigger value="versions" className="flex-1 max-w-[200px]">Versões</TabsTrigger>
          </TabsList>

          <TabsContent value="documents" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Repositório Geral</CardTitle>
                    <CardDescription>Contratos, licenças e políticas corporativas</CardDescription>
                  </div>
                  <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-red-600 hover:bg-red-700">
                        <Upload className="w-4 h-4 mr-2" /> Upload
                      </Button>
                    </DialogTrigger>
                    
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>Upload de Documento</DialogTitle>
                            <DialogDescription>Arraste arquivos ou clique para selecionar.</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 pt-4">
                            
                            <div 
                              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                                isDragging ? "border-blue-500 bg-blue-50" : "border-slate-300 hover:bg-slate-50"
                              }`}
                              onDragOver={handleDragOver}
                              onDragLeave={handleDragLeave}
                              onDrop={handleDrop}
                              onClick={() => fileInputRef.current?.click()}
                            >
                              <input 
                                ref={fileInputRef}
                                type="file" 
                                className="hidden" 
                                multiple 
                                onChange={handleFileSelect} 
                              />
                              <CloudUpload className={`w-10 h-10 mx-auto mb-2 ${isDragging ? "text-blue-500" : "text-slate-400"}`} />
                              <p className="text-sm text-slate-600 font-medium">
                                {isDragging ? "Solte os arquivos aqui" : "Clique ou arraste arquivos aqui"}
                              </p>
                              <p className="text-xs text-slate-400 mt-1">PDF, DOCX, JPG (Máx. 10MB)</p>
                            </div>

                            {uploadedFiles.length > 0 && (
                              <div className="space-y-2 max-h-32 overflow-y-auto pr-1">
                                <p className="text-xs font-bold text-slate-500 uppercase">Arquivos Selecionados:</p>
                                {uploadedFiles.map((file, idx) => (
                                  <div key={idx} className="flex items-center justify-between bg-slate-100 p-2 rounded text-sm">
                                    <div className="flex items-center gap-2 truncate">
                                      <FileText className="w-4 h-4 text-slate-500" />
                                      <span className="truncate max-w-[200px] text-slate-700">{file.name}</span>
                                    </div>
                                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={(e) => { e.stopPropagation(); removeFile(idx); }}>
                                      <X className="w-3 h-3 text-slate-400 hover:text-red-500" />
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            )}

                            <div className="space-y-2">
                              <Label>Categoria</Label>
                              <Select defaultValue="contrato">
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="contrato">Contrato</SelectItem>
                                  <SelectItem value="politica">Política</SelectItem>
                                  <SelectItem value="licenca">Licença</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="flex justify-end gap-2 pt-2">
                                <Button variant="outline" onClick={()=>setUploadDialogOpen(false)}>Cancelar</Button>
                                <Button className="bg-red-600 hover:bg-red-700" onClick={handleConfirmUpload} disabled={uploadedFiles.length === 0}>
                                  Salvar Arquivos
                                </Button>
                            </div>
                        </div>
                    </DialogContent>

                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-4 flex gap-3">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <Input placeholder="Buscar documentos..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
                    </div>
                    <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                        <SelectTrigger className="w-48"><SelectValue placeholder="Departamento" /></SelectTrigger>
                        <SelectContent><SelectItem value="all">Todos</SelectItem><SelectItem value="RH">RH</SelectItem><SelectItem value="Jurídico">Jurídico</SelectItem></SelectContent>
                    </Select>
                </div>
                <div className="border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>Depto</TableHead>
                        <TableHead>Data</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredDocuments.map((doc) => (
                        <TableRow key={doc.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                                {getCategoryIcon(doc.category)}
                                {doc.name}
                            </div>
                          </TableCell>
                          <TableCell>{doc.department}</TableCell>
                          <TableCell>{new Date(doc.uploadDate).toLocaleDateString()}</TableCell>
                          <TableCell><Badge className={getStatusBadge(doc.status)}>{doc.status}</Badge></TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                                <Button variant="ghost" size="icon" onClick={() => handleView(doc.name)}><Eye className="w-4 h-4" /></Button>
                                <Button variant="ghost" size="icon" onClick={() => handleDownload(doc.name)}><Download className="w-4 h-4" /></Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* --- NOVA ABA: KANBAN DE PROCESSOS --- */}
          <TabsContent value="processos" className="space-y-6 h-full">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
              {kanbanColumns.map((col) => (
                <div 
                  key={col.id} 
                  className="bg-slate-100 rounded-lg p-4 flex flex-col h-full border border-slate-200"
                  onDragOver={onDragOverKanban}
                  onDrop={(e) => onDropKanban(e, col.id)}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-slate-700 flex items-center gap-2">
                      {col.id === 'analise' && <Clock className="w-4 h-4 text-amber-500" />}
                      {col.id === 'juizo' && <Gavel className="w-4 h-4 text-blue-500" />}
                      {col.id === 'concluido' && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                      {col.title}
                    </h3>
                    <Badge variant="secondary" className="bg-slate-200 text-slate-600">
                      {col.items.length}
                    </Badge>
                  </div>
                  
                  <div className="space-y-3 flex-1">
                    {col.items.map((item) => (
                      <Card 
                        key={item.id} 
                        className="cursor-move hover:shadow-md transition-shadow border-l-4 border-l-transparent hover:border-l-blue-500"
                        draggable
                        onDragStart={(e) => onDragStart(e, item.id, col.id)}
                      >
                        <CardContent className="p-3">
                          <div className="flex justify-between items-start mb-2">
                            <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${
                              item.priority === 'Alta' ? 'border-red-200 bg-red-50 text-red-700' :
                              item.priority === 'Média' ? 'border-amber-200 bg-amber-50 text-amber-700' :
                              'border-blue-200 bg-blue-50 text-blue-700'
                            }`}>
                              {item.priority}
                            </Badge>
                            <Button variant="ghost" size="icon" className="h-6 w-6 -mt-1 -mr-1">
                              <MoreHorizontal className="w-3 h-3 text-slate-400" />
                            </Button>
                          </div>
                          
                          <h4 className="font-semibold text-sm text-slate-900 mb-1 leading-tight">{item.title}</h4>
                          <p className="text-xs text-slate-500 mb-2 truncate">{item.number}</p>
                          
                          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                            <span className="text-xs font-medium text-slate-700">{item.value}</span>
                            <span className="text-[10px] text-slate-400">{item.type}</span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    {col.items.length === 0 && (
                      <div className="h-24 border-2 border-dashed border-slate-200 rounded-lg flex items-center justify-center text-slate-400 text-sm italic">
                        Vazio
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          {/* ------------------------------------- */}

          <TabsContent value="dossier" className="space-y-6">
            <Card className="bg-slate-900 border-slate-800 text-white print:hidden">
                <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                        <Search className="w-5 h-5 text-red-400" />
                        Localizar "Capivara" (Dossiê Completo)
                    </CardTitle>
                    <CardDescription className="text-slate-400">
                        Busque por <b>Matrícula</b>, CPF ou Nome. Tente <b>"009821"</b> (ativo) ou <b>"005540"</b> (demitido).
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleDossierSearch} className="flex gap-4">
                        <Input 
                            placeholder="Digite Matrícula, CPF ou Nome..." 
                            className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 flex-1 h-12 text-lg"
                            value={dossierSearch}
                            onChange={(e) => setDossierSearch(e.target.value)}
                        />
                        <Button type="submit" className="h-12 px-8 bg-red-600 hover:bg-red-700 text-white font-semibold" disabled={isSearchingDossier}>
                            {isSearchingDossier ? "Pesquisando..." : "Investigar"}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            {activeDossier ? (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex flex-col md:flex-row gap-6 items-stretch">
                        <Card className={`flex-1 border-l-4 ${activeDossier.status === "Desligado" ? "border-l-red-600 bg-red-50/30" : "border-l-green-500"}`}>
                            <CardContent className="pt-6">
                                <div className="flex items-start justify-between">
                                    <div className="flex gap-4">
                                        <Avatar className={`w-20 h-20 border-4 ${activeDossier.status === "Desligado" ? "border-red-100 grayscale" : "border-slate-100"}`}>
                                            <AvatarImage src={`https://ui-avatars.com/api/?name=${activeDossier.name}&background=random`} />
                                            <AvatarFallback>
                                                {activeDossier.status === "Desligado" ? <UserX /> : "US"}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h2 className="text-2xl font-bold text-slate-900">{activeDossier.name}</h2>
                                                {activeDossier.status === "Desligado" && <span className="text-xs font-bold text-red-600 border border-red-200 bg-red-50 px-2 py-0.5 rounded">EX-COLABORADOR</span>}
                                            </div>
                                            <p className="text-slate-500 font-mono">{activeDossier.role} • {activeDossier.department}</p>
                                            <div className="flex gap-2 mt-2">
                                                <Badge variant="secondary" className="font-mono">CPF: {activeDossier.cpf}</Badge>
                                                <Badge variant="outline" className="bg-white">Matrícula: {activeDossier.matricula}</Badge>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-2 w-48">
                                        {!isExportUnlocked ? (
                                          <Button 
                                            variant="outline"
                                            className="w-full mb-2 bg-red-50 text-red-700 border-red-200 hover:bg-red-100 print:hidden transition-colors"
                                            onClick={handleExportClick}
                                          >
                                            <Lock className="w-4 h-4 mr-2" />
                                            Exportar PDF
                                          </Button>
                                        ) : (
                                          <PDFDownloadLink
                                              document={<LegalDossierDocument data={activeDossier} user={userName} />}
                                              fileName={`Dossie_${activeDossier.matricula}.pdf`}
                                              className={cn(
                                                  buttonVariants({ variant: "outline" }), 
                                                  "w-full mb-2 bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 print:hidden transition-colors"
                                              )}
                                          >
                                              {({ loading }) => 
                                                  loading ? (
                                                      <>
                                                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                          Gerando...
                                                      </>
                                                  ) : (
                                                      <>
                                                          <FileDown className="w-4 h-4 mr-2" />
                                                          Baixar Arquivo
                                                      </>
                                                  )
                                              }
                                          </PDFDownloadLink>
                                        )}
                                        {getRiskBadge(activeDossier.riskLevel)}
                                        {getDossierStatusBadge(activeDossier.status)}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="md:w-72 bg-slate-50">
                            <CardContent className="pt-6 flex flex-col justify-center h-full">
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-xs text-slate-500 uppercase font-bold">Data de Admissão</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <Calendar className="w-4 h-4 text-slate-400" />
                                            <span className="text-sm font-medium">{new Date(activeDossier.admissionDate).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                    {activeDossier.status === "Desligado" ? (
                                        <div className="pt-2 border-t border-slate-200">
                                            <p className="text-xs text-red-600 uppercase font-bold">Data de Desligamento</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <UserX className="w-4 h-4 text-red-500" />
                                                <span className="text-sm font-bold text-red-700">{activeDossier.terminationDate ? new Date(activeDossier.terminationDate).toLocaleDateString() : "N/A"}</span>
                                            </div>
                                            <p className="text-xs text-slate-500 mt-1 italic">"{activeDossier.terminationReason}"</p>
                                        </div>
                                    ) : (
                                        <div>
                                            <p className="text-xs text-slate-500 uppercase font-bold">Tempo de Casa</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <History className="w-4 h-4 text-slate-400" />
                                                <span className="text-sm font-medium">Ativo há 2 anos</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <div className="flex items-center gap-2">
                                    <Clock className="w-5 h-5 text-blue-600" />
                                    <CardTitle>Histórico de Ponto</CardTitle>
                                </div>
                                <CardDescription>Monitoramento de assiduidade e atrasos</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Mês</TableHead>
                                            <TableHead className="text-center">Faltas</TableHead>
                                            <TableHead className="text-center">Atrasos</TableHead>
                                            <TableHead>Status</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {activeDossier.pointHistory.map((record, idx) => (
                                            <TableRow key={idx}>
                                                <TableCell className="font-medium">{record.month}</TableCell>
                                                <TableCell className="text-center">{record.absences}</TableCell>
                                                <TableCell className={`text-center ${record.delays > 30 ? "text-red-600 font-bold" : ""}`}>
                                                    {record.delays} min
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline" className={
                                                        record.status === "Crítico" ? "border-red-500 text-red-700 bg-red-50" :
                                                        record.status === "Atenção" ? "border-amber-500 text-amber-700 bg-amber-50" : ""
                                                    }>
                                                        {record.status}
                                                    </Badge>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <div className="flex items-center gap-2">
                                    <AlertTriangle className="w-5 h-5 text-amber-600" />
                                    <CardTitle>Ocorrências & Eventos</CardTitle>
                                </div>
                                <CardDescription>Linha do tempo disciplinar</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="relative border-l border-slate-200 ml-3 space-y-6 pb-2">
                                    {activeDossier.occurrences.map((occ) => (
                                        <div key={occ.id} className="ml-6 relative">
                                            <span className={`absolute -left-[31px] top-1 w-4 h-4 rounded-full border-2 border-white ${
                                                occ.type === "Rescisão" ? "bg-black" :
                                                occ.type === "Advertência" ? "bg-red-500" :
                                                occ.type === "Suspensão" ? "bg-orange-500" : "bg-blue-500"
                                            }`}></span>
                                            <div className="flex items-center justify-between">
                                                <h4 className={`text-sm font-semibold ${occ.type === "Rescisão" ? "text-red-700 uppercase" : "text-slate-900"}`}>{occ.type}</h4>
                                                <span className="text-xs text-slate-500">{new Date(occ.date).toLocaleDateString()}</span>
                                            </div>
                                            <p className="text-sm text-slate-600 mt-1">{occ.description}</p>
                                            {occ.documentUrl && <Button variant="link" className="h-auto p-0 text-xs mt-1 text-blue-600 print:hidden">Ver documento</Button>}
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="md:col-span-2">
                            <CardHeader>
                                <div className="flex items-center gap-2">
                                    <Briefcase className="w-5 h-5 text-purple-600" />
                                    <CardTitle>Documentos Vinculados</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                    {activeDossier.documents.map((doc) => (
                                        <div key={doc.id} className="p-3 border rounded-lg hover:bg-slate-50 transition-colors cursor-pointer group">
                                            <div className="flex items-start gap-3">
                                                <div className={`w-8 h-8 rounded flex items-center justify-center flex-shrink-0 ${
                                                    doc.name.includes("Rescisão") ? "bg-red-600 text-white" : "bg-slate-100 text-slate-600"
                                                }`}>
                                                    {doc.name.includes("Rescisão") ? <FileWarning className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                                                </div>
                                                <div className="overflow-hidden">
                                                    <p className="text-sm font-medium text-slate-900 truncate group-hover:text-blue-600">{doc.name}</p>
                                                    <p className="text-xs text-slate-500 mt-1 flex justify-between">
                                                        <span>{doc.type}</span>
                                                        <span>{new Date(doc.date).toLocaleDateString()}</span>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center text-slate-400">
                    <Search className="w-16 h-16 mb-4 opacity-20" />
                    <h3 className="text-lg font-medium text-slate-600">Investigação Jurídica</h3>
                    <p className="max-w-md mx-auto mt-2">Utilize a barra de pesquisa acima para localizar um colaborador pela <b>matrícula</b> ou dados pessoais.</p>
                </div>
            )}
          </TabsContent>

          <TabsContent value="audit" className="space-y-4">
            <Card>
                <CardHeader>
                    <CardTitle>Logs de Auditoria</CardTitle>
                    <CardDescription>Rastreabilidade de todas as ações no sistema</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="border rounded-lg">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Usuário</TableHead>
                                    <TableHead>Ação</TableHead>
                                    <TableHead>Objeto</TableHead>
                                    <TableHead>Data/Hora</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {mockAuditLogs.map((log) => (
                                    <TableRow key={log.id}>
                                        <TableCell>{log.user}</TableCell>
                                        <TableCell><Badge variant="outline">{log.action}</Badge></TableCell>
                                        <TableCell className="text-slate-600">{log.document}</TableCell>
                                        <TableCell className="text-slate-500">{log.timestamp}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="versions" className="space-y-4">
            <Card>
              <CardHeader><CardTitle>Histórico de Versões</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border border-slate-200 rounded-lg">
                    <h3 className="text-slate-900 mb-2 font-medium">Contrato de Trabalho - Modelo 2025</h3>
                    <div className="flex items-center justify-between text-sm text-slate-500">
                        <span>Versão atual: v3.2</span>
                        <span>Última mod: 01/11/2025</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

        </Tabs>

        {/* DIÁLOGO DE REAUTENTICAÇÃO */}
        <ReauthDialog 
            open={showExportReauth} 
            onCancel={() => setShowExportReauth(false)}
            onSuccess={handleReauthConfirm}
            userEmail={user?.email || ""}
        />

      </div>
    </div>
  );
}