// src/services/api.service.ts

const API_URL = 'http://localhost:3000/api';

// Helper para pegar headers com token (se tivermos implementado login no front)
const getHeaders = () => {
  const token = localStorage.getItem('access_token'); // Supondo que salvamos aqui
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

export const api = {
  // ... (método get mantém igual)
  get: async <T>(endpoint: string): Promise<T> => {
      // ... implementação existente
      const response = await fetch(`${API_URL}${endpoint}`, { headers: getHeaders() });
      return await response.json();
  },

  post: async <T>(endpoint: string, body: any): Promise<T> => {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(body)
    });
    return await response.json();
  },

  patch: async <T>(endpoint: string, body: any): Promise<T> => {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify(body)
    });
    return await response.json();
  },

  // --- Módulos Atualizados ---
  
  audit: {
    list: () => api.get<any[]>('/audit'),
    // Nova função para registrar log manualmente
    log: (action: string, resource: string) => api.post('/audit', { action, resource }),
  },

  legal: {
    list: () => api.get<any[]>('/legal'),
    // Nova função para atualizar status
    updateStatus: (id: string, status: string) => api.patch(`/legal/${id}`, { status }),
  },

  // ... (outros módulos documents, users, clients, financial, dossier mantêm igual)
  documents: { list: () => api.get<any[]>('/documents') },
  users: { list: () => api.get<any[]>('/users') },
  clients: { list: () => api.get<any[]>('/clients'), getById: (id: string) => api.get<any>(`/clients/${id}`) },
  financial: { list: () => api.get<any[]>('/financial') },
  dossier: { search: (term: string) => api.get<any>(`/dossier/search?q=${encodeURIComponent(term)}`) },
};