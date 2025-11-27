import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import {
  ArrowLeft,
  Upload,
  Download,
  Eye,
  FileText,
  Clock,
  User,
  Shield,
  Search,
  Filter,
  FolderOpen,
  Lock,
  CheckCircle2,
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
import { Textarea } from "./ui/textarea";
import { Alert, AlertDescription } from "./ui/alert";
import { toast } from "sonner@2.0.3";

interface LegalCenterProps {
  onClose: () => void;
  userName: string;
  userRole: string;
}

interface Document {
  id: number;
  name: string;
  department: string;
  category: string;
  version: string;
  uploadDate: string;
  uploadedBy: string;
  size: string;
  status: "Ativo" | "Arquivado" | "Revisão";
  fileType: string;
  accessCount: number;
}

interface AuditLog {
  id: number;
  user: string;
  action: string;
  document: string;
  timestamp: string;
  ip: string;
}

const mockDocuments: Document[] = [
  {
    id: 1,
    name: "Contrato de Trabalho - Modelo 2025",
    department: "RH",
    category: "Contratos",
    version: "v3.2",
    uploadDate: "2025-11-01",
    uploadedBy: "Dr. Ricardo Alves",
    size: "245 KB",
    status: "Ativo",
    fileType: "PDF",
    accessCount: 127,
  },
  {
    id: 2,
    name: "Política de LGPD - Tratamento de Dados",
    department: "Compliance",
    category: "Políticas",
    version: "v2.1",
    uploadDate: "2025-10-15",
    uploadedBy: "Dra. Marina Costa",
    size: "1.2 MB",
    status: "Ativo",
    fileType: "PDF",
    accessCount: 89,
  },
  {
    id: 3,
    name: "Acordo de Fornecimento - TechSupply Ltda",
    department: "Financeiro",
    category: "Contratos",
    version: "v1.5",
    uploadDate: "2025-10-20",
    uploadedBy: "Dr. Ricardo Alves",
    size: "512 KB",
    status: "Ativo",
    fileType: "DOCX",
    accessCount: 45,
  },
  {
    id: 4,
    name: "Procuração - Representação Legal",
    department: "Jurídico",
    category: "Procurações",
    version: "v1.0",
    uploadDate: "2025-09-30",
    uploadedBy: "Dra. Marina Costa",
    size: "180 KB",
    status: "Ativo",
    fileType: "PDF",
    accessCount: 23,
  },
  {
    id: 5,
    name: "Licença Ambiental - Sede Principal",
    department: "Operações",
    category: "Licenças",
    version: "v4.0",
    uploadDate: "2025-08-10",
    uploadedBy: "Dr. Ricardo Alves",
    size: "3.5 MB",
    status: "Ativo",
    fileType: "PDF",
    accessCount: 34,
  },
  {
    id: 6,
    name: "Código de Conduta e Ética",
    department: "Compliance",
    category: "Políticas",
    version: "v5.1",
    uploadDate: "2025-07-22",
    uploadedBy: "Dra. Marina Costa",
    size: "890 KB",
    status: "Ativo",
    fileType: "PDF",
    accessCount: 203,
  },
  {
    id: 7,
    name: "Contrato de Confidencialidade - Parceiros",
    department: "Comercial",
    category: "Contratos",
    version: "v2.3",
    uploadDate: "2025-10-05",
    uploadedBy: "Dr. Ricardo Alves",
    size: "320 KB",
    status: "Ativo",
    fileType: "PDF",
    accessCount: 67,
  },
  {
    id: 8,
    name: "Alvará de Funcionamento 2024",
    department: "Operações",
    category: "Licenças",
    version: "v1.0",
    uploadDate: "2025-01-15",
    uploadedBy: "Dr. Ricardo Alves",
    size: "450 KB",
    status: "Arquivado",
    fileType: "PDF",
    accessCount: 12,
  },
];

const mockAuditLogs: AuditLog[] = [
  {
    id: 1,
    user: "Ana Silva",
    action: "Download",
    document: "Política de LGPD - Tratamento de Dados",
    timestamp: "2025-11-07 14:23:15",
    ip: "192.168.1.10",
  },
  {
    id: 2,
    user: "Dr. Ricardo Alves",
    action: "Upload",
    document: "Contrato de Trabalho - Modelo 2025",
    timestamp: "2025-11-07 11:45:30",
    ip: "192.168.1.25",
  },
  {
    id: 3,
    user: "Carlos Santos",
    action: "Visualização",
    document: "Acordo de Fornecimento - TechSupply Ltda",
    timestamp: "2025-11-07 09:12:42",
    ip: "192.168.1.33",
  },
  {
    id: 4,
    user: "Dra. Marina Costa",
    action: "Atualização",
    document: "Código de Conduta e Ética",
    timestamp: "2025-11-06 16:55:18",
    ip: "192.168.1.42",
  },
  {
    id: 5,
    user: "Ana Silva",
    action: "Download",
    document: "Procuração - Representação Legal",
    timestamp: "2025-11-06 13:30:05",
    ip: "192.168.1.10",
  },
];

export function LegalCenter({ onClose, userName, userRole }: LegalCenterProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);

  const filteredDocuments = mockDocuments.filter((doc) => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = selectedDepartment === "all" || doc.department === selectedDepartment;
    const matchesCat = selectedCategory === "all" || doc.category === selectedCategory;
    return matchesSearch && matchesDept && matchesCat;
  });

  const handleDownload = (doc: Document) => {
    // Log the audit trail
    toast.success(`Download iniciado: ${doc.name}`, {
      description: "O acesso foi registrado nos logs de auditoria.",
    });
    console.log(`Audit Log: ${userName} downloaded ${doc.name} at ${new Date().toISOString()}`);
  };

  const handleView = (doc: Document) => {
    toast.info(`Visualizando: ${doc.name}`, {
      description: "O acesso foi registrado nos logs de auditoria.",
    });
    console.log(`Audit Log: ${userName} viewed ${doc.name} at ${new Date().toISOString()}`);
  };

  const handleUpload = () => {
    toast.success("Documento enviado com sucesso!", {
      description: "O arquivo foi processado e está disponível para consulta.",
    });
    setUploadDialogOpen(false);
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      Ativo: "bg-green-100 text-green-700",
      Arquivado: "bg-slate-100 text-slate-700",
      Revisão: "bg-amber-100 text-amber-700",
    };
    return variants[status] || "bg-slate-100 text-slate-700";
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Contratos":
        return <FileText className="w-4 h-4" />;
      case "Políticas":
        return <Shield className="w-4 h-4" />;
      case "Procurações":
        return <User className="w-4 h-4" />;
      case "Licenças":
        return <CheckCircle2 className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  return (
    <div className="flex-1 overflow-auto bg-slate-50">
      <div className="p-6 max-w-7xl mx-auto">
        <Button variant="ghost" onClick={onClose} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar ao Dashboard
        </Button>

        {/* Header with Security Alert */}
        <div className="mb-6">
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
              <strong>Atenção:</strong> Todos os acessos, downloads e visualizações são registrados para fins de auditoria e compliance. 
              Os documentos aqui contidos são confidenciais e de propriedade da empresa.
            </AlertDescription>
          </Alert>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle>Total de Documentos</CardTitle>
                <FileText className="w-5 h-5 text-red-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-slate-900">{mockDocuments.length}</div>
              <p className="text-slate-600 mt-1">8 ativos, 0 em revisão</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle>Categorias</CardTitle>
                <FolderOpen className="w-5 h-5 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-slate-900">4 tipos</div>
              <p className="text-slate-600 mt-1">Contratos, Políticas, Licenças</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle>Acessos Hoje</CardTitle>
                <Eye className="w-5 h-5 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-slate-900">37</div>
              <p className="text-slate-600 mt-1">15 downloads, 22 visualizações</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle>Última Atualização</CardTitle>
                <Clock className="w-5 h-5 text-purple-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-slate-900">Hoje</div>
              <p className="text-slate-600 mt-1">2 docs atualizados</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="documents" className="space-y-6">
          <TabsList className="bg-white border border-slate-200">
            <TabsTrigger value="documents">Documentos</TabsTrigger>
            <TabsTrigger value="audit">Auditoria</TabsTrigger>
            <TabsTrigger value="versions">Controle de Versões</TabsTrigger>
          </TabsList>

          {/* Documents Tab */}
          <TabsContent value="documents" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Repositório de Documentos</CardTitle>
                    <CardDescription>
                      Gestão centralizada de documentações corporativas
                    </CardDescription>
                  </div>
                  <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-red-600 hover:bg-red-700">
                        <Upload className="w-4 h-4 mr-2" />
                        Upload de Documento
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-lg">
                      <DialogHeader>
                        <DialogTitle>Upload de Documento Jurídico</DialogTitle>
                        <DialogDescription>
                          Envie um novo documento para a central jurídica
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 pt-4">
                        <div className="space-y-2">
                          <Label htmlFor="doc-name">Nome do Documento</Label>
                          <Input id="doc-name" placeholder="Ex: Contrato de Prestação de Serviços" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="doc-dept">Departamento</Label>
                            <Select>
                              <SelectTrigger id="doc-dept">
                                <SelectValue placeholder="Selecione" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="rh">RH</SelectItem>
                                <SelectItem value="financeiro">Financeiro</SelectItem>
                                <SelectItem value="comercial">Comercial</SelectItem>
                                <SelectItem value="operacoes">Operações</SelectItem>
                                <SelectItem value="juridico">Jurídico</SelectItem>
                                <SelectItem value="compliance">Compliance</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="doc-category">Categoria</Label>
                            <Select>
                              <SelectTrigger id="doc-category">
                                <SelectValue placeholder="Selecione" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="contratos">Contratos</SelectItem>
                                <SelectItem value="politicas">Políticas</SelectItem>
                                <SelectItem value="procuracoes">Procurações</SelectItem>
                                <SelectItem value="licencas">Licenças</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="doc-version">Versão</Label>
                          <Input id="doc-version" placeholder="Ex: v1.0" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="doc-notes">Observações</Label>
                          <Textarea 
                            id="doc-notes" 
                            placeholder="Adicione notas sobre o documento..."
                            rows={3}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="doc-file">Arquivo</Label>
                          <Input id="doc-file" type="file" accept=".pdf,.docx,.xlsx" />
                          <p className="text-slate-500">Formatos aceitos: PDF, DOCX, XLSX (máx. 10MB)</p>
                        </div>
                        <div className="flex justify-end gap-3 pt-4">
                          <Button variant="outline" onClick={() => setUploadDialogOpen(false)}>
                            Cancelar
                          </Button>
                          <Button className="bg-red-600 hover:bg-red-700" onClick={handleUpload}>
                            Enviar Documento
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                {/* Filters */}
                <div className="mb-4 flex gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <Input
                      type="search"
                      placeholder="Buscar documentos..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Departamento" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os Departamentos</SelectItem>
                      <SelectItem value="RH">RH</SelectItem>
                      <SelectItem value="Financeiro">Financeiro</SelectItem>
                      <SelectItem value="Comercial">Comercial</SelectItem>
                      <SelectItem value="Operações">Operações</SelectItem>
                      <SelectItem value="Jurídico">Jurídico</SelectItem>
                      <SelectItem value="Compliance">Compliance</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas as Categorias</SelectItem>
                      <SelectItem value="Contratos">Contratos</SelectItem>
                      <SelectItem value="Políticas">Políticas</SelectItem>
                      <SelectItem value="Procurações">Procurações</SelectItem>
                      <SelectItem value="Licenças">Licenças</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Documents Table */}
                <div className="border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Documento</TableHead>
                        <TableHead>Departamento</TableHead>
                        <TableHead>Categoria</TableHead>
                        <TableHead>Versão</TableHead>
                        <TableHead>Enviado Por</TableHead>
                        <TableHead>Data</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredDocuments.map((doc) => (
                        <TableRow key={doc.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className={`w-8 h-8 ${
                                doc.fileType === "PDF" ? "bg-red-100" : 
                                doc.fileType === "DOCX" ? "bg-blue-100" : "bg-green-100"
                              } rounded flex items-center justify-center`}>
                                {getCategoryIcon(doc.category)}
                              </div>
                              <div>
                                <p className="text-slate-900">{doc.name}</p>
                                <p className="text-slate-500">{doc.size}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-slate-600">{doc.department}</TableCell>
                          <TableCell className="text-slate-600">{doc.category}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{doc.version}</Badge>
                          </TableCell>
                          <TableCell className="text-slate-600">{doc.uploadedBy}</TableCell>
                          <TableCell className="text-slate-600">
                            {new Date(doc.uploadDate).toLocaleDateString("pt-BR")}
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusBadge(doc.status)}>
                              {doc.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => handleView(doc)}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => handleDownload(doc)}
                              >
                                <Download className="w-4 h-4" />
                              </Button>
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

          {/* Audit Tab */}
          <TabsContent value="audit" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Logs de Auditoria</CardTitle>
                <CardDescription>
                  Registro completo de todos os acessos e modificações
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Usuário</TableHead>
                        <TableHead>Ação</TableHead>
                        <TableHead>Documento</TableHead>
                        <TableHead>Data/Hora</TableHead>
                        <TableHead>IP de Origem</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockAuditLogs.map((log) => (
                        <TableRow key={log.id}>
                          <TableCell className="text-slate-900">{log.user}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className={
                              log.action === "Download" ? "border-blue-300 text-blue-700" :
                              log.action === "Upload" ? "border-green-300 text-green-700" :
                              log.action === "Atualização" ? "border-amber-300 text-amber-700" :
                              "border-slate-300 text-slate-700"
                            }>
                              {log.action}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-slate-600">{log.document}</TableCell>
                          <TableCell className="text-slate-600">{log.timestamp}</TableCell>
                          <TableCell className="text-slate-600">{log.ip}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Version Control Tab */}
          <TabsContent value="versions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Controle de Versões</CardTitle>
                <CardDescription>
                  Histórico de atualizações e versões de documentos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {["Contrato de Trabalho - Modelo 2025", "Política de LGPD - Tratamento de Dados"].map((docName, idx) => (
                    <div key={idx} className="p-4 border border-slate-200 rounded-lg bg-white">
                      <h3 className="text-slate-900 mb-3">{docName}</h3>
                      <div className="space-y-2">
                        {[
                          { version: "v3.2", date: "2025-11-01", user: "Dr. Ricardo Alves", changes: "Atualização de cláusulas trabalhistas" },
                          { version: "v3.1", date: "2025-09-15", user: "Dra. Marina Costa", changes: "Correções ortográficas" },
                          { version: "v3.0", date: "2025-07-10", user: "Dr. Ricardo Alves", changes: "Revisão completa do documento" },
                        ].map((ver, verIdx) => (
                          <div key={verIdx} className="flex items-start gap-3 p-3 bg-slate-50 rounded">
                            <Badge variant="outline">{ver.version}</Badge>
                            <div className="flex-1">
                              <p className="text-slate-900">{ver.changes}</p>
                              <p className="text-slate-500">
                                {new Date(ver.date).toLocaleDateString("pt-BR")} por {ver.user}
                              </p>
                            </div>
                            <Button variant="ghost" size="sm">
                              <Download className="w-4 h-4 mr-2" />
                              Baixar
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
