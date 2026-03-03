import { Routes, Route } from 'react-router-dom';
import EtablissementList from '../components/EtablissementList';
import EtablissementForm from '../components/EtablissementForm';

function EtablissementPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* En-tête de la page */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Gestion des Établissements</h1>
              <p className="text-gray-600 mt-1">Gérez et organisez vos établissements</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <Routes>
          <Route path="/" element={<EtablissementList />} />
          <Route path="/create" element={<EtablissementForm />} />
          <Route path="/edit/:id" element={<EtablissementForm />} />
        </Routes>
      </div>
    </div>
  );
}

export default EtablissementPage;