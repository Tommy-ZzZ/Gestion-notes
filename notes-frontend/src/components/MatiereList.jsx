import { useEffect, useState } from 'react';
import { getMatieres, deleteMatiere } from '../api/api';
import { Link } from 'react-router-dom';

function MatiereList() {
  const [matieres, setMatieres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMatieres = async () => {
      try {
        const response = await getMatieres();
        setMatieres(response.data);
        setLoading(false);
      } catch (err) {
        setError('Erreur lors du chargement des matières');
        setLoading(false);
      }
    };
    fetchMatieres();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Voulez-vous supprimer cette matière ?')) {
      try {
        await deleteMatiere(id);
        setMatieres(matieres.filter((mat) => mat.id !== id));
      } catch (err) {
        setError('Erreur lors de la suppression');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
          <p className="mt-4 text-lg font-semibold text-gray-700">Chargement des matières...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
        <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-r-xl shadow-lg max-w-md">
          <div className="flex items-center">
            <span className="text-red-600 text-lg font-semibold">⚠️ {error}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-6 transform transition-all duration-300 hover:shadow-2xl">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-8 sm:px-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="text-3xl font-bold text-white tracking-tight">
                  📚 Liste des Matières
                </h3>
                <p className="mt-2 text-blue-100 text-sm">
                  Gérez toutes les matières du système
                </p>
              </div>
              <Link
                to="/matieres/create"
                className="inline-flex items-center bg-white text-blue-600 font-semibold px-6 py-3 rounded-xl hover:bg-blue-50 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl focus:ring-4 focus:ring-blue-300 focus:outline-none whitespace-nowrap"
              >
                <span className="mr-2">➕</span>
                Ajouter Matière
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500 transform transition-all duration-200 hover:shadow-lg hover:scale-105">
            <p className="text-sm font-semibold text-gray-600">Total Matières</p>
            <p className="text-3xl font-bold text-blue-600 mt-2">{matieres.length}</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500 transform transition-all duration-200 hover:shadow-lg hover:scale-105">
            <p className="text-sm font-semibold text-gray-600">Coefficient Moyen</p>
            <p className="text-3xl font-bold text-green-600 mt-2">
              {matieres.length > 0 ? (matieres.reduce((acc, mat) => acc + parseFloat(mat.coefficient || 0), 0) / matieres.length).toFixed(1) : '0'}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500 transform transition-all duration-200 hover:shadow-lg hover:scale-105">
            <p className="text-sm font-semibold text-gray-600">Crédits Totaux</p>
            <p className="text-3xl font-bold text-purple-600 mt-2">
              {matieres.reduce((acc, mat) => acc + parseFloat(mat.credit || 0), 0)}
            </p>
          </div>
        </div>

        {/* Table Container */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {matieres.length === 0 ? (
            <div className="text-center py-16 px-4">
              <div className="text-6xl mb-4">📭</div>
              <h4 className="text-xl font-semibold text-gray-700 mb-2">Aucune matière trouvée</h4>
              <p className="text-gray-500 mb-6">Commencez par ajouter votre première matière</p>
              <Link
                to="/matieres/create"
                className="inline-flex items-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold px-6 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
              >
                <span className="mr-2">➕</span>
                Créer une matière
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      📖 Nom Matière
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      🔢 Coefficient
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      ⭐ Crédit
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                      ⚙️ Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {matieres.map((mat, index) => (
                    <tr 
                      key={mat.id}
                      className="hover:bg-blue-50 transition-colors duration-150 transform hover:scale-105"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-lg flex items-center justify-center text-white font-bold shadow-md">
                            {mat.nom_matiere.charAt(0).toUpperCase()}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-semibold text-gray-900">{mat.nom_matiere}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-800">
                          {mat.coefficient}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800">
                          {mat.credit}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Link
                            to={`/matieres/edit/${mat.id}`}
                            className="inline-flex items-center px-4 py-2 bg-blue-500 text-white text-sm font-semibold rounded-lg hover:bg-blue-600 transform hover:scale-105 transition-all duration-200 shadow hover:shadow-md focus:ring-2 focus:ring-blue-300 focus:outline-none"
                          >
                            ✏️ Modifier
                          </Link>
                          <button
                            onClick={() => handleDelete(mat.id)}
                            className="inline-flex items-center px-4 py-2 bg-red-500 text-white text-sm font-semibold rounded-lg hover:bg-red-600 transform hover:scale-105 transition-all duration-200 shadow hover:shadow-md focus:ring-2 focus:ring-red-300 focus:outline-none"
                          >
                            🗑️ Supprimer
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer Info */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            💡 Cliquez sur une ligne pour voir les détails
          </p>
        </div>
      </div>
    </div>
  );
}

export default MatiereList;