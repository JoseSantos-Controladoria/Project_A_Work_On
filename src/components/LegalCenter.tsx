import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button, buttonVariants } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { cn } from "./ui/utils";
import {
  ArrowLeft, Upload, Download, Eye, FileText, Clock, Shield, Search, Lock,
  AlertTriangle, Calendar, UserX, Loader2, CloudUpload, Kanban, Gavel, CheckCircle2, MoreHorizontal
} from "lucide-react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "./ui/table";
// Select components removed — not used in current audit implementation
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger,
} from "./ui/dialog";
import { Alert, AlertDescription } from "./ui/alert";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { 
  Document as PdfDocument, Page, Text, View, StyleSheet, PDFDownloadLink 
} from '@react-pdf/renderer';

import { useAuth } from "@/contexts/AuthContext";
import { ReauthDialog } from "./ReauthDialog";
import { api } from "@/services/api.service";

interface LegalCenterProps {
  onClose: () => void;
  userName: string;
  userRole: string;
}

// --- TIPOS ---
interface DocumentType { 
  id: number; 
  name: string; 
  department: string; 
  category: string; 
  version: string; 
  uploadDate: string; 
  uploadedBy: string; 
  size: string; 
  status: string; 
  fileType: string; 
  accessCount: number; 
}

// Tipos do Kanban
type ProcessStatus = "analise" | "juizo" | "concluido";

interface LegalProcess {
  id: string;
  number: string;
  title: string;
  value: string;
  priority: "Alta" | "Média" | "Baixa";
  type: string;
  dueDate: string | null;
  status: ProcessStatus;
}

interface KanbanColumn {
  id: ProcessStatus;
  title: string;
  items: LegalProcess[];
}


// Estilos PDF
const pdfStyles = StyleSheet.create({ page: { padding: 40, fontFamily: 'Helvetica' }, headerContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20, borderBottomWidth: 1, borderBottomColor: '#ccc', paddingBottom: 10 }, headerTitle: { fontSize: 18, color: '#1e293b', fontWeight: 'bold' }, headerSubtitle: { fontSize: 10, color: '#64748b' }, sectionTitle: { fontSize: 14, marginTop: 20, marginBottom: 10, padding: 5, backgroundColor: '#f1f5f9', color: '#334155', fontWeight: 'bold' }, row: { flexDirection: 'row', marginBottom: 5 }, label: { width: '30%', fontSize: 10, color: '#64748b' }, value: { width: '70%', fontSize: 10, color: '#0f172a' }, statusValue: { width: '70%', fontSize: 10, color: '#0f172a', fontWeight: 'bold' }, warningText: { color: '#dc2626', fontWeight: 'bold' }, tableHeader: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#000', paddingBottom: 5, marginTop: 10, backgroundColor: '#e2e8f0' }, tableRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#e2e8f0', paddingVertical: 6 }, colDate: { width: '20%', fontSize: 9, paddingLeft: 5 }, colType: { width: '30%', fontSize: 9 }, colDesc: { width: '50%', fontSize: 9 }, footer: { position: 'absolute', bottom: 30, left: 40, right: 40, textAlign: 'center', fontSize: 8, color: '#94a3b8', borderTopWidth: 1, borderTopColor: '#e2e8f0', paddingTop: 10 } });

const LegalDossierDocument = ({ data, user }: { data: any; user: string }) => (
  <PdfDocument>
    <Page size="A4" style={pdfStyles.page}>
      <View style={pdfStyles.headerContainer}>
        <View><Text style={pdfStyles.headerTitle}>Dossiê Jurídico</Text><Text style={pdfStyles.headerSubtitle}>Confidencial - Uso Interno</Text></View>
        <View><Text style={pdfStyles.headerSubtitle}>Gerado em: {new Date().toLocaleDateString("pt-BR")}</Text><Text style={pdfStyles.headerSubtitle}>Por: {user}</Text></View>
      </View>
      <Text style={pdfStyles.sectionTitle}>Dados do Colaborador</Text>
      <View><View style={pdfStyles.row}><Text style={pdfStyles.label}>Nome:</Text><Text style={pdfStyles.value}>{data.name}</Text></View><View style={pdfStyles.row}><Text style={pdfStyles.label}>CPF:</Text><Text style={pdfStyles.value}>{data.cpf}</Text></View><View style={pdfStyles.row}><Text style={pdfStyles.label}>Cargo:</Text><Text style={pdfStyles.value}>{data.role}</Text></View><View style={pdfStyles.row}><Text style={pdfStyles.label}>Status:</Text><Text style={data.status === "Desligado" ? [pdfStyles.statusValue, pdfStyles.warningText] : pdfStyles.statusValue}>{data.status?.toUpperCase()}</Text></View></View>
      
      {data.occurrences && data.occurrences.length > 0 && (
        <>
          <Text style={pdfStyles.sectionTitle}>Histórico Disciplinar</Text>
          <View style={pdfStyles.tableHeader}><Text style={pdfStyles.colDate}>DATA</Text><Text style={pdfStyles.colType}>TIPO</Text><Text style={pdfStyles.colDesc}>DESCRIÇÃO</Text></View>
          {data.occurrences.map((occ: any, i: number) => (
            <View key={i} style={pdfStyles.tableRow}>
              <Text style={pdfStyles.colDate}>{new Date(occ.date).toLocaleDateString("pt-BR")}</Text>
              <Text style={pdfStyles.colType}>{occ.type}</Text>
              <Text style={pdfStyles.colDesc}>{occ.description}</Text>
            </View>
          ))}
        </>
      )}
      <Text style={pdfStyles.footer}>Gerado pelo sistema Work On - Proibida a reprodução.</Text>
    </Page>
  </PdfDocument>
);

export function LegalCenter({ onClose, userName }: LegalCenterProps) {
  const { user } = useAuth();
  
  // States de Dados
  const [documents, setDocuments] = useState<DocumentType[]>([]);
  const [kanbanColumns, setKanbanColumns] = useState<KanbanColumn[]>([
    { id: "analise", title: "Em Análise", items: [] },
    { id: "juizo", title: "Em Juízo", items: [] },
    { id: "concluido", title: "Concluído", items: [] }
  ]);
  const [loading, setLoading] = useState(true);
  
  // Estado para Drag and Drop do Kanban
  const [draggedItem, setDraggedItem] = useState<{ id: string; sourceColumn: ProcessStatus } | null>(null);

  // States de UI
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, _setSelectedDepartment] = useState<string>("all");
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  
  // States da Capivara (Dossiê)
  const [dossierSearch, setDossierSearch] = useState("");
  const [activeDossier, setActiveDossier] = useState<any | null>(null);
  const [isSearchingDossier, setIsSearchingDossier] = useState(false);
  const [showExportReauth, setShowExportReauth] = useState(false);
  const [isExportUnlocked, setIsExportUnlocked] = useState(false);
  
  // States de Upload
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Estado para logs de auditoria
  const [auditLogs, setAuditLogs] = useState<any[]>([]);

  // --- CARREGAMENTO INICIAL DE DADOS ---
  useEffect(() => {
    async function fetchLegalData() {
      try {
        setLoading(true);
        
        // 1. Carregar Documentos do Banco
        const docsData = await api.documents.list();
        setDocuments(docsData);

        // 2. Carregar Processos do Banco e montar Kanban
        const processData = await api.legal.list();
        
        const newColumns: KanbanColumn[] = [
          { id: "analise", title: "Em Análise", items: [] },
          { id: "juizo", title: "Em Juízo", items: [] },
          { id: "concluido", title: "Concluído", items: [] }
        ];

        // Distribui os processos nas colunas certas baseado no status do banco
        processData.forEach((proc: any) => {
          const col = newColumns.find(c => c.id === proc.status);
          if (col) {
            col.items.push({
              id: proc.id,
              number: proc.number,
              title: proc.title,
              value: proc.value,
              priority: proc.priority === "ALTA" ? "Alta" : proc.priority === "MEDIA" ? "Média" : "Baixa",
              type: proc.type,
              dueDate: proc.dueDate,
              status: proc.status
            });
          }
        });

        setKanbanColumns(newColumns);

        // 3. Carregar Auditoria
        const auditData = await api.audit.list();
        setAuditLogs(auditData);

      } catch (error) {
        console.error("Erro ao carregar dados jurídicos:", error);
        toast.error("Erro de conexão", { description: "Não foi possível carregar os dados do servidor." });
      } finally {
        setLoading(false);
      }
    }

    fetchLegalData();
  }, []);

  const filteredDocuments = documents.filter((doc) => {
    return (
      (doc.name.toLowerCase().includes(searchTerm.toLowerCase()) || doc.category.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (selectedDepartment === "all" || doc.department === selectedDepartment)
    );
  });

  // --- FUNÇÕES KANBAN (Interatividade Visual) ---
  const onDragStart = (e: React.DragEvent, id: string, sourceColumn: ProcessStatus) => {
    setDraggedItem({ id, sourceColumn });
    e.dataTransfer.effectAllowed = "move";
  };

  const onDragOverKanban = (e: React.DragEvent) => {
    e.preventDefault(); // Necessário para permitir o drop
  };

  const onDropKanban = async (e: React.DragEvent, targetColumnId: ProcessStatus) => {
    e.preventDefault();
    if (!draggedItem) return;
    if (draggedItem.sourceColumn === targetColumnId) return;

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
    
    const movedItem: LegalProcess = { ...sourceItems[itemIndex], status: targetColumnId } as LegalProcess;
    
    sourceItems.splice(itemIndex, 1);
    targetItems.push(movedItem);

    const newColumns = [...kanbanColumns];
    newColumns[sourceColIndex] = { ...sourceCol, items: sourceItems };
    newColumns[targetColIndex] = { ...targetCol, items: targetItems };

    setKanbanColumns(newColumns);
    setDraggedItem(null);

    // Chamada ao backend
    try {
      await api.legal.updateStatus(draggedItem.id, targetColumnId);
      toast.success(`Processo movido para: ${targetCol.title}`, { 
        description: "Status atualizado e registrado na auditoria." 
      });
      // Atualiza a lista de auditoria em tempo real
      refreshAuditLogs();
    } catch (error) {
      console.error("Erro ao salvar status:", error);
      toast.error("Erro ao salvar status no servidor.", { description: "A alteração não foi persistida." });
    }
  };

  // --- FUNÇÃO PARA ATUALIZAR LOGS DE AUDITORIA ---
  const refreshAuditLogs = async () => {
    try {
      const logs = await api.audit.list();
      setAuditLogs(logs);
    } catch (error) {
      console.error("Erro ao atualizar logs de auditoria:", error);
    }
  };

  // --- FUNÇÕES DE AÇÃO EM DOCUMENTOS ---
  const handleViewAction = async (docName: string) => {
    toast.info(`Visualizando: ${docName}`);
    try {
      await api.audit.log("Visualização de Documento", docName);
      refreshAuditLogs();
    } catch (error) {
      console.error("Erro ao registrar visualização:", error);
    }
  };

  const handleDownloadAction = async (docName: string) => {
    toast.success(`Iniciando download: ${docName}`);
    try {
      await api.audit.log("Download de Arquivo", docName);
      refreshAuditLogs();
    } catch (error) {
      console.error("Erro ao registrar download:", error);
    }
  };

  // --- FUNÇÕES UPLOAD ---
  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(false); };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setIsDragging(false);
    if (e.dataTransfer.files?.length) setUploadedFiles(prev => [...prev, ...Array.from(e.dataTransfer.files as FileList)]);
  };
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length) setUploadedFiles(prev => [...prev, ...Array.from(e.target.files as FileList)]);
  };
  const handleConfirmUpload = () => {
    if (!uploadedFiles.length) return;
    toast.success("Upload realizado!", { description: "Arquivos enviados para o repositório seguro (Simulado)." });
    setUploadedFiles([]);
    setUploadDialogOpen(false);
  };

  // --- FUNÇÃO "CAPIVARA" (Busca Real + Formatação) ---
  const handleDossierSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dossierSearch.trim()) return;

    setIsSearchingDossier(true);
    setActiveDossier(null);
    setIsExportUnlocked(false);

    try {
      // 1. Busca no Backend
      const data = await api.dossier.search(dossierSearch);
      
      if (data) {
        // 2. Formata e preenche dados visuais faltantes (Mock UI)
        const dossierFormatted = {
          ...data,
          pointHistory: [
            { month: "Out/2025", absences: 0, delays: 12, overtime: 4, status: "Normal" },
            { month: "Set/2025", absences: 1, delays: 45, overtime: 0, status: "Atenção" }
          ],
          documents: [
            { id: 101, name: "Contrato de Trabalho.pdf", type: "Contrato", date: data.admissionDate },
            ...(data.status === "Desligado" ? [{ id: 102, name: "Termo de Rescisão (TRCT).pdf", type: "Legal", date: data.terminationDate }] : [])
          ]
        };

        setActiveDossier(dossierFormatted);
        
        if (data.status === "Desligado") {
          toast.warning("Colaborador Desligado Localizado", { description: "Passivo trabalhista em análise." });
        } else {
          toast.success("Colaborador Ativo Localizado");
        }
      }
    } catch (error) {
      console.error("Erro na busca:", error);
      toast.error("Não encontrado", { description: "Nenhum colaborador com esses dados no banco." });
    } finally {
      setIsSearchingDossier(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const s = status.toUpperCase();
    if (s === "ATIVO") return "bg-green-100 text-green-700";
    if (s === "ARQUIVADO") return "bg-slate-100 text-slate-700";
    if (s === "REVISAO") return "bg-amber-100 text-amber-700";
    return "bg-slate-100 text-slate-700";
  };

  const getCategoryIcon = (cat: string) => {
    if (cat === "Contratos") return <FileText className="w-4 h-4" />;
    if (cat === "Políticas") return <Shield className="w-4 h-4" />;
    return <FileText className="w-4 h-4" />;
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-50 h-full">
        <Loader2 className="w-10 h-10 animate-spin text-red-600 mb-4" />
      </div>
    );
  }

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
              <p className="text-slate-600">Área restrita - Dados Reais Conectados</p>
            </div>
          </div>
          <Alert className="border-red-200 bg-red-50">
            <Shield className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              Esta área acessa a base de dados oficial. Todas as ações são auditadas.
            </AlertDescription>
          </Alert>
        </div>

        <Tabs defaultValue="documents" className="space-y-6">
          <TabsList className="bg-white border border-slate-200 p-1 w-full justify-start h-auto print:hidden">
            <TabsTrigger value="documents" className="flex-1 max-w-[200px]">Documentos</TabsTrigger>
            <TabsTrigger value="processos" className="flex-1 max-w-[200px]"><Kanban className="w-4 h-4 mr-2" /> Processos</TabsTrigger>
            <TabsTrigger value="dossier" className="flex-1 max-w-[200px]"><Search className="w-4 h-4 mr-2"/> Investigação</TabsTrigger>
            <TabsTrigger value="audit" className="flex-1 max-w-[200px]">Auditoria</TabsTrigger>
          </TabsList>

          {/* ABA DOCUMENTOS (Conectada) */}
          <TabsContent value="documents" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div><CardTitle>Repositório Geral</CardTitle><CardDescription>Gestão de contratos e políticas</CardDescription></div>
                  <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
                    <DialogTrigger asChild><Button className="bg-red-600 hover:bg-red-700"><Upload className="w-4 h-4 mr-2" /> Upload</Button></DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader><DialogTitle>Upload de Documento</DialogTitle><DialogDescription>Selecione arquivos para enviar.</DialogDescription></DialogHeader>
                      <div className="space-y-4 pt-4">
                        <div 
                          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${isDragging ? "border-blue-500 bg-blue-50" : "border-slate-300"}`}
                          onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop} onClick={() => fileInputRef.current?.click()}
                        >
                          <input ref={fileInputRef} type="file" className="hidden" multiple onChange={handleFileSelect} />
                          <CloudUpload className="w-10 h-10 mx-auto mb-2 text-slate-400" />
                          <p className="text-sm text-slate-600 font-medium">Clique ou arraste arquivos aqui</p>
                        </div>
                        {uploadedFiles.length > 0 && <p className="text-xs text-green-600 font-bold">{uploadedFiles.length} arquivos selecionados</p>}
                        <div className="flex justify-end gap-2"><Button variant="outline" onClick={()=>setUploadDialogOpen(false)}>Cancelar</Button><Button className="bg-red-600" onClick={handleConfirmUpload}>Salvar</Button></div>
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
                          <TableCell className="font-medium"><div className="flex items-center gap-2">{getCategoryIcon(doc.category)}{doc.name}</div></TableCell>
                          <TableCell>{doc.department}</TableCell>
                          <TableCell>{new Date(doc.uploadDate).toLocaleDateString()}</TableCell>
                          <TableCell><Badge className={getStatusBadge(doc.status)}>{doc.status}</Badge></TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                                <Button variant="ghost" size="icon" onClick={() => handleViewAction(doc.name)}><Eye className="w-4 h-4" /></Button>
                                <Button variant="ghost" size="icon" onClick={() => handleDownloadAction(doc.name)}><Download className="w-4 h-4" /></Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                      {filteredDocuments.length === 0 && <TableRow><TableCell colSpan={5} className="text-center py-4">Nenhum documento encontrado.</TableCell></TableRow>}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ABA PROCESSOS (Conectada + Drag&Drop Restaurado) */}
          <TabsContent value="processos" className="space-y-6 h-full">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
              {kanbanColumns.map((col) => (
                <div key={col.id} className="bg-slate-100 rounded-lg p-4 flex flex-col h-full border border-slate-200" onDragOver={onDragOverKanban} onDrop={(e) => onDropKanban(e, col.id)}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-slate-700 flex items-center gap-2">
                      {col.id === 'analise' && <Clock className="w-4 h-4 text-amber-500" />}
                      {col.id === 'juizo' && <Gavel className="w-4 h-4 text-blue-500" />}
                      {col.id === 'concluido' && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                      {col.title}
                    </h3>
                    <Badge variant="secondary" className="bg-slate-200 text-slate-600">{col.items.length}</Badge>
                  </div>
                  <div className="space-y-3 flex-1">
                    {col.items.map((item) => (
                      <Card key={item.id} className="cursor-move hover:shadow-md transition-shadow border-l-4 border-l-transparent hover:border-l-blue-500" draggable onDragStart={(e) => onDragStart(e, item.id, col.id)}>
                        <CardContent className="p-3">
                          <div className="flex justify-between items-start mb-2">
                            <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${
                              item.priority === 'Alta' ? 'border-red-200 bg-red-50 text-red-700' :
                              item.priority === 'Média' ? 'border-amber-200 bg-amber-50 text-amber-700' :
                              'border-blue-200 bg-blue-50 text-blue-700'
                            }`}>{item.priority}</Badge>
                            <Button variant="ghost" size="icon" className="h-6 w-6 -mt-1 -mr-1"><MoreHorizontal className="w-3 h-3 text-slate-400" /></Button>
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
                    {col.items.length === 0 && <div className="h-24 border-2 border-dashed border-slate-200 rounded-lg flex items-center justify-center text-slate-400 text-sm italic">Vazio</div>}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* ABA INVESTIGAÇÃO (Conectada ao Banco + UI) */}
          <TabsContent value="dossier" className="space-y-6">
            <Card className="bg-slate-900 border-slate-800 text-white">
                <CardHeader><CardTitle className="text-white flex items-center gap-2"><Search className="w-5 h-5 text-red-400" /> Investigação</CardTitle></CardHeader>
                <CardContent>
                    <form onSubmit={handleDossierSearch} className="flex gap-4">
                        <Input placeholder="Digite Matrícula, CPF ou Nome..." className="bg-slate-800 border-slate-700 text-white flex-1 h-12" value={dossierSearch} onChange={(e) => setDossierSearch(e.target.value)} />
                        <Button type="submit" className="h-12 px-8 bg-red-600 hover:bg-red-700" disabled={isSearchingDossier}>{isSearchingDossier ? "..." : "Buscar"}</Button>
                    </form>
                </CardContent>
            </Card>
            {activeDossier && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex flex-col md:flex-row gap-6 items-stretch">
                        <Card className={`flex-1 border-l-4 ${activeDossier.status === "Desligado" ? "border-l-red-600 bg-red-50/30" : "border-l-green-500"}`}>
                            <CardContent className="pt-6">
                                <div className="flex items-start justify-between">
                                    <div className="flex gap-4">
                                        <Avatar className={`w-20 h-20 border-4 ${activeDossier.status === "Desligado" ? "border-red-100 grayscale" : "border-slate-100"}`}>
                                            <AvatarImage src={`https://ui-avatars.com/api/?name=${activeDossier.name}&background=random`} />
                                            <AvatarFallback>{activeDossier.status === "Desligado" ? <UserX /> : "US"}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h2 className="text-2xl font-bold text-slate-900">{activeDossier.name}</h2>
                                                {activeDossier.status === "Desligado" && <span className="text-xs font-bold text-red-600 border border-red-200 bg-red-50 px-2 py-0.5 rounded">EX-COLABORADOR</span>}
                                            </div>
                                            <p className="text-slate-500 font-mono">{activeDossier.role} • {activeDossier.department}</p>
                                            <div className="flex gap-2 mt-2"><Badge variant="secondary" className="font-mono">CPF: {activeDossier.cpf}</Badge><Badge variant="outline" className="bg-white">Matrícula: {activeDossier.matricula}</Badge></div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-2 w-48">
                                        {!isExportUnlocked ? (
                                          <Button variant="outline" className="w-full mb-2 bg-red-50 text-red-700 border-red-200 hover:bg-red-100" onClick={() => setShowExportReauth(true)}><Lock className="w-4 h-4 mr-2" /> Exportar PDF</Button>
                                        ) : (
                                          <PDFDownloadLink document={<LegalDossierDocument data={activeDossier} user={userName} />} fileName={`Dossie_${activeDossier.matricula}.pdf`} className={cn(buttonVariants({ variant: "outline" }), "w-full mb-2 bg-emerald-50 text-emerald-700 border-emerald-200")}>{({ loading }) => loading ? "Gerando..." : "Baixar Arquivo"}</PDFDownloadLink>
                                        )}
                                        <Badge variant="outline" className={`border ${activeDossier.riskLevel === 'Alto' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-blue-50 text-blue-700 border-blue-200'}`}>{activeDossier.riskLevel} Risco</Badge>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="md:w-72 bg-slate-50">
                            <CardContent className="pt-6 flex flex-col justify-center h-full">
                                <div className="space-y-4">
                                    <div><p className="text-xs text-slate-500 uppercase font-bold">Data de Admissão</p><div className="flex items-center gap-2 mt-1"><Calendar className="w-4 h-4 text-slate-400" /><span className="text-sm font-medium">{new Date(activeDossier.admissionDate).toLocaleDateString()}</span></div></div>
                                    {activeDossier.terminationDate && (
                                        <div className="pt-2 border-t border-slate-200"><p className="text-xs text-red-600 uppercase font-bold">Data de Desligamento</p><div className="flex items-center gap-2 mt-1"><UserX className="w-4 h-4 text-red-500" /><span className="text-sm font-bold text-red-700">{new Date(activeDossier.terminationDate).toLocaleDateString()}</span></div></div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader><div className="flex items-center gap-2"><Clock className="w-5 h-5 text-blue-600" /><CardTitle>Histórico de Ponto</CardTitle></div></CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader><TableRow><TableHead>Mês</TableHead><TableHead className="text-center">Faltas</TableHead><TableHead className="text-center">Atrasos</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
                                    <TableBody>
                                        {activeDossier.pointHistory.map((record: any, idx: number) => (
                                            <TableRow key={idx}><TableCell className="font-medium">{record.month}</TableCell><TableCell className="text-center">{record.absences}</TableCell><TableCell className="text-center">{record.delays} min</TableCell><TableCell><Badge variant="outline">{record.status}</Badge></TableCell></TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader><div className="flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-amber-600" /><CardTitle>Ocorrências</CardTitle></div></CardHeader>
                            <CardContent>
                                <div className="relative border-l border-slate-200 ml-3 space-y-6 pb-2">
                                    {activeDossier.occurrences.map((occ: any) => (
                                        <div key={occ.id} className="ml-6 relative">
                                            <span className="absolute -left-[31px] top-1 w-4 h-4 rounded-full border-2 border-white bg-red-500"></span>
                                            <div className="flex items-center justify-between"><h4 className="text-sm font-semibold text-slate-900">{occ.type}</h4><span className="text-xs text-slate-500">{new Date(occ.date).toLocaleDateString()}</span></div>
                                            <p className="text-sm text-slate-600 mt-1">{occ.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            )}
          </TabsContent>

          {/* ABA AUDITORIA (Mockada) */}
          <TabsContent value="audit" className="space-y-4">
            <Card>
                <CardHeader><CardTitle>Logs de Auditoria</CardTitle></CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader><TableRow><TableHead>Usuário</TableHead><TableHead>Ação</TableHead><TableHead>Objeto</TableHead><TableHead>Data</TableHead></TableRow></TableHeader>
                        <TableBody>
                          {auditLogs.map((log) => (
                            <TableRow key={log.id}>
                              {/* O usuário pode ser null se for ação anônima/sistema, tratamos isso */}
                              <TableCell>{log.user?.name || "Sistema"}</TableCell>
                              <TableCell><Badge variant="outline">{log.action}</Badge></TableCell>
                              <TableCell className="truncate max-w-[200px]" title={log.resource}>{log.resource}</TableCell>
                              <TableCell>{new Date(log.timestamp).toLocaleString()}</TableCell>
                            </TableRow>
                          ))}
                          {auditLogs.length === 0 && (
                            <TableRow>
                              <TableCell colSpan={4} className="text-center text-muted-foreground">Nenhum registro encontrado.</TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
          </TabsContent>

        </Tabs>
        <ReauthDialog open={showExportReauth} onCancel={() => setShowExportReauth(false)} onSuccess={() => { setShowExportReauth(false); setIsExportUnlocked(true); }} userEmail={user?.email || ""} />
      </div>
    </div>
  );
}