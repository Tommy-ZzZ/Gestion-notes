import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:4000',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Etablissement
export const createEtablissement = (data) => api.post('/etablissements', data);
export const getEtablissements = () => api.get('/etablissements');
export const getEtablissement = (id) => api.get(`/etablissements/${id}`);
export const updateEtablissement = (id, data) => api.put(`/etablissements/${id}`, data);
export const deleteEtablissement = (id) => api.delete(`/etablissements/${id}`);

// Professeur
export const createProfesseur = (data) => api.post('/professeurs', data);
export const getProfesseurs = () => api.get('/professeurs');
export const getProfesseur = (id) => api.get(`/professeurs/${id}`);
export const updateProfesseur = (id, data) => api.put(`/professeurs/${id}`, data);
export const deleteProfesseur = (id) => api.delete(`/professeurs/${id}`);

// Etudiant
export const createEtudiant = (data) => api.post('/etudiants', data);
export const getEtudiants = () => api.get('/etudiants');
export const getEtudiant = (id) => api.get(`/etudiants/${id}`);
export const updateEtudiant = (id, data) => api.put(`/etudiants/${id}`, data);
export const deleteEtudiant = (id) => api.delete(`/etudiants/${id}`);

// Matiere
export const createMatiere = (data) => api.post('/matieres', data);
export const getMatieres = () => api.get('/matieres');
export const getMatiere = (id) => api.get(`/matieres/${id}`);
export const updateMatiere = (id, data) => api.put(`/matieres/${id}`, data);
export const deleteMatiere = (id) => api.delete(`/matieres/${id}`);

// Note
export const createNote = (data) => api.post('/notes', data);
export const getNotes = () => api.get('/notes');
export const getNote = (id) => api.get(`/notes/${id}`);
export const updateNote = (id, data) => api.put(`/notes/${id}`, data);
export const deleteNote = (id) => api.delete(`/notes/${id}`);

//authentification
export const register = (data) => api.post('/auth/register', data);
export const login = (data) => api.post('/auth/login', data);