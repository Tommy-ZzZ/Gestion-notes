import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { getEtudiants, getNotes, getMatieres } from '../api/api';

function Home() {
  const [stats, setStats] = useState({
    L1: { total: 0, admis: 0, redoublants: 0 },
    L2: { total: 0, admis: 0, redoublants: 0 },
    L3: { total: 0, admis: 0, redoublants: 0 },
    Master: { total: 0, admis: 0, redoublants: 0 },
    Doctorat: { total: 0, admis: 0, redoublants: 0 }
  });
  const [loadingStats, setLoadingStats] = useState(true);
  const [errorStats, setErrorStats] = useState(null);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Fonction pour calculer les stats
  const calculateStats = (etudiants, notes, matieres) => {
    const levels = ['L1', 'L2', 'L3', 'Master', 'Doctorat'];
    const newStats = {};
    levels.forEach(level => {
      const levelEtudiants = etudiants.filter(etud => etud.niveau === level);
      let totalAdmis = 0;
      levelEtudiants.forEach(etud => {
        const etudiantNotes = notes.filter(note => note.id_etudiant === etud.id);
        let totalScore = 0;
        let totalCoeff = 0;
        etudiantNotes.forEach(note => {
          const matiere = matieres.find(mat => mat.id === note.id_matiere);
          if (matiere) {
            totalScore += note.note * (matiere.coefficient || 1);
            totalCoeff += matiere.coefficient || 1;
          }
        });
        const moyenne = totalCoeff > 0 ? totalScore / totalCoeff : 0;
        if (moyenne >= 10) totalAdmis++;
      });
      newStats[level] = {
        total: levelEtudiants.length,
        admis: totalAdmis,
        redoublants: levelEtudiants.length - totalAdmis
      };
    });
    return newStats;
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [etudResponse, noteResponse, matResponse] = await Promise.all([
          getEtudiants(),
          getNotes(),
          getMatieres()
        ]);
        const newStats = calculateStats(etudResponse.data, noteResponse.data, matResponse.data);
        setStats(newStats);
      } catch (err) {
        setErrorStats('Erreur lors du chargement des statistiques');
      } finally {
        setLoadingStats(false);
      }
    };
    if (user) fetchStats(); // Ne charge les stats que si connecté
  }, [user]);

  if (loadingStats && user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Chargement des statistiques...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-20 left-1/2 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto p-6 pt-20">
        {/* Hero Section */}
        <div className="text-center mb-16 animate-fade-in-down">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-6 animate-bounce-slow shadow-lg">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent animate-gradient">
            Bienvenue dans Gestion de Notes
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Utilisez le menu ci-dessus pour gérer les établissements, professeurs, étudiants, matières, et notes.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <Link
            to="/etablissements"
            onClick={(e) => !user && (e.preventDefault(), navigate('/login'))}
            className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 animate-fade-in-up animation-delay-200 block"
          >
            <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl mb-4 group-hover:scale-110 transition-transform duration-300">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">Établissements</h3>
            <p className="text-gray-600">Gérez tous vos établissements scolaires en un seul endroit</p>
          </Link>

          <Link
            to="/professeurs"
            onClick={(e) => !user && (e.preventDefault(), navigate('/login'))}
            className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 animate-fade-in-up animation-delay-400 block"
          >
            <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl mb-4 group-hover:scale-110 transition-transform duration-300">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-purple-600 transition-colors">Professeurs</h3>
            <p className="text-gray-600">Administrez les profils et les affectations des enseignants</p>
          </Link>

          <Link
            to="/etudiants"
            onClick={(e) => !user && (e.preventDefault(), navigate('/login'))}
            className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 animate-fade-in-up animation-delay-600 block"
          >
            <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-xl mb-4 group-hover:scale-110 transition-transform duration-300">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-indigo-600 transition-colors">Étudiants</h3>
            <p className="text-gray-600">Suivez les inscriptions et les parcours des élèves</p>
          </Link>

          <Link
            to="/matieres"
            onClick={(e) => !user && (e.preventDefault(), navigate('/login'))}
            className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 animate-fade-in-up animation-delay-800 block"
          >
            <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-green-400 to-green-600 rounded-xl mb-4 group-hover:scale-110 transition-transform duration-300">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-green-600 transition-colors">Matières</h3>
            <p className="text-gray-600">Organisez le programme académique et les cours</p>
          </Link>

          <Link
            to="/notes"
            onClick={(e) => !user && (e.preventDefault(), navigate('/login'))}
            className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 animate-fade-in-up animation-delay-1000 block"
          >
            <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl mb-4 group-hover:scale-110 transition-transform duration-300">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-orange-600 transition-colors">Notes</h3>
            <p className="text-gray-600">Enregistrez et analysez les résultats académiques</p>
          </Link>
        </div>

        {/* Statistics Section */}
        {user && (
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent animate-gradient">
              Statistiques par Niveau
            </h2>
            {errorStats && <p className="text-red-500 text-center mb-4">{errorStats}</p>}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(stats).map(([level, data], index) => (
                <div
                  key={level}
                  className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 animate-fade-in-up"
                  style={{ animationDelay: `${(index + 1) * 200}ms` }}
                >
                  <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-pink-400 to-pink-600 rounded-xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-pink-600 transition-colors">{level}</h3>
                  <p className="text-gray-600">Total Étudiants: <span className="font-semibold">{data.total}</span></p>
                  <p className="text-gray-600">Admis: <span className="font-semibold text-green-600">{data.admis}</span></p>
                  <p className="text-gray-600">Redoublants: <span className="font-semibold text-red-600">{data.redoublants}</span></p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Call to action */}
        <div className="text-center animate-fade-in-up animation-delay-1400">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 shadow-xl transform hover:scale-105 transition-all duration-300">
            <h3 className="text-2xl font-bold text-white mb-4">Prêt à commencer ?</h3>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Explorez toutes les fonctionnalités de notre système de gestion pour optimiser votre établissement
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button className="bg-white text-blue-600 px-6 py-3 rounded-xl font-semibold hover:bg-blue-50 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span>Démarrage rapide</span>
              </button>
              <button className="bg-transparent border-2 border-white text-white px-6 py-3 rounded-xl font-semibold hover:bg-white hover:text-blue-600 transform hover:scale-105 transition-all duration-300 flex items-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <span>Documentation</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Custom animations */}
      <style>{`
        @keyframes fade-in-down {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-fade-in-down { animation: fade-in-down 0.8s ease-out; }
        .animate-fade-in-up { animation: fade-in-up 0.8s ease-out; }
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-200 { animation-delay: 0.2s; }
        .animation-delay-400 { animation-delay: 0.4s; }
        .animation-delay-600 { animation-delay: 0.6s; }
        .animation-delay-800 { animation-delay: 0.8s; }
        .animation-delay-1000 { animation-delay: 1s; }
        .animation-delay-1200 { animation-delay: 1.2s; }
        .animation-delay-1400 { animation-delay: 1.4s; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
        .animate-bounce-slow { animation: bounce-slow 3s ease-in-out infinite; }
        .animate-gradient { background-size: 200% 200%; animation: gradient 5s ease infinite; }
      `}</style>
    </div>
  );
}

export default Home;