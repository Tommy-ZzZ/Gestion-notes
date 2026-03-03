import { Routes, Route } from 'react-router-dom';
import ProfesseurList from '../components/ProfesseurList';
import ProfesseurForm from '../components/ProfesseurForm';

function ProfesseurPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* En-tête de la page */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Gestion des Professeurs</h1>
              <p className="text-gray-600 mt-1">Gérez et organisez vos professeurs</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <Routes>
          <Route path="/" element={<ProfesseurList />} />
          <Route path="/create" element={<ProfesseurForm />} />
          <Route path="/edit/:id" element={<ProfesseurForm />} />
        </Routes>
      </div>
    </div>
  );
}

export default ProfesseurPage;