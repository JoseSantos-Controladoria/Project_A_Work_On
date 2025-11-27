import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { ArrowLeft, Save } from "lucide-react";
import { departments, Department } from "./DashboardSidebar";

interface UserSettingsProps {
  selectedDepartments: string[];
  onUpdateDepartments: (departments: string[]) => void;
  onClose: () => void;
}

export function UserSettings({ selectedDepartments, onUpdateDepartments, onClose }: UserSettingsProps) {
  const [localSelection, setLocalSelection] = useState<string[]>(selectedDepartments);

  const toggleDepartment = (deptId: string) => {
    if (localSelection.includes(deptId)) {
      setLocalSelection(localSelection.filter(id => id !== deptId));
    } else {
      setLocalSelection([...localSelection, deptId]);
    }
  };

  const handleSave = () => {
    onUpdateDepartments(localSelection);
    onClose();
  };

  return (
    <div className="flex-1 overflow-auto bg-slate-50">
      <div className="p-6 max-w-4xl mx-auto">
        <Button variant="ghost" onClick={onClose} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar ao Dashboard
        </Button>

        <div className="mb-6">
          <h1 className="text-slate-900 mb-2">Configurações do Usuário</h1>
          <p className="text-slate-600">Personalize sua experiência no Work On</p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Departamentos Visíveis</CardTitle>
              <CardDescription>
                Selecione quais departamentos deseja visualizar no seu dashboard
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {departments.map((dept) => (
                <div key={dept.id}>
                  <div className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 ${dept.color} rounded-lg flex items-center justify-center text-white`}>
                        {dept.icon}
                      </div>
                      <div>
                        <Label htmlFor={dept.id} className="cursor-pointer text-slate-900">
                          {dept.name}
                        </Label>
                        <p className="text-slate-500">
                          {dept.id === "rh" && "Métricas de pessoal e recrutamento"}
                          {dept.id === "financeiro" && "Receitas, despesas e fluxo de caixa"}
                          {dept.id === "operacoes" && "Eficiência operacional e projetos"}
                          {dept.id === "vendas" && "Performance de vendas e metas"}
                          {dept.id === "ti" && "Infraestrutura e sistemas"}
                        </p>
                      </div>
                    </div>
                    <Switch
                      id={dept.id}
                      checked={localSelection.includes(dept.id)}
                      onCheckedChange={() => toggleDepartment(dept.id)}
                    />
                  </div>
                  {dept.id !== "ti" && <Separator />}
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Preferências de Notificação</CardTitle>
              <CardDescription>
                Configure como deseja receber notificações
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="email-notifications" className="cursor-pointer text-slate-900">
                    Notificações por Email
                  </Label>
                  <p className="text-slate-500">Receba atualizações importantes por email</p>
                </div>
                <Switch id="email-notifications" defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="push-notifications" className="cursor-pointer text-slate-900">
                    Notificações Push
                  </Label>
                  <p className="text-slate-500">Notificações no navegador em tempo real</p>
                </div>
                <Switch id="push-notifications" defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="weekly-report" className="cursor-pointer text-slate-900">
                    Relatório Semanal
                  </Label>
                  <p className="text-slate-500">Resumo semanal enviado toda segunda-feira</p>
                </div>
                <Switch id="weekly-report" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Aparência</CardTitle>
              <CardDescription>
                Personalize a aparência da interface
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="dark-mode" className="cursor-pointer text-slate-900">
                    Modo Escuro
                  </Label>
                  <p className="text-slate-500">Ativar tema escuro (em breve)</p>
                </div>
                <Switch id="dark-mode" disabled />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="compact-view" className="cursor-pointer text-slate-900">
                    Visualização Compacta
                  </Label>
                  <p className="text-slate-500">Mostrar mais informações em menos espaço</p>
                </div>
                <Switch id="compact-view" />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
              <Save className="w-4 h-4 mr-2" />
              Salvar Configurações
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}