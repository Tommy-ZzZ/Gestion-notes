import { useEffect, useState } from 'react';
import { getEtudiants, deleteEtudiant, getNotes, getMatieres, createNote } from '../api/api';
import { Link } from 'react-router-dom';
import jsPDF from 'jspdf';

function EtudiantList() {
  const [etudiants, setEtudiants] = useState([]);
  const [filteredEtudiants, setFilteredEtudiants] = useState([]);
  const [notes, setNotes] = useState([]);
  const [matieres, setMatieres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortLevel, setSortLevel] = useState('');
  const [selectedEtudiantId, setSelectedEtudiantId] = useState(null);
  const [noteFormData, setNoteFormData] = useState({ id_matiere: '', note: '' });
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [etudResponse, noteResponse, matResponse] = await Promise.all([
          getEtudiants(),
          getNotes(),
          getMatieres()
        ]);
        setEtudiants(etudResponse.data);
        setFilteredEtudiants(etudResponse.data);
        setNotes(noteResponse.data);
        setMatieres(matResponse.data);
        setLoading(false);
      } catch (err) {
        setError('Erreur lors du chargement des données');
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    let result = etudiants;

    if (searchQuery) {
      result = result.filter((etud) =>
        etud.matricule.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (etud.niveau && etud.niveau.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    if (sortLevel) {
      result = result.filter((etud) => etud.niveau === sortLevel);
    }

    setFilteredEtudiants(result);
  }, [searchQuery, sortLevel, etudiants]);

  const handleDelete = async (id) => {
    if (window.confirm('Voulez-vous supprimer cet étudiant ?')) {
      try {
        await deleteEtudiant(id);
        setEtudiants(etudiants.filter((etud) => etud.id !== id));
      } catch (err) {
        setError('Erreur lors de la suppression');
      }
    }
  };

  const getEtudiantNotes = (etudiantId) => {
    const etudiantNotes = notes.filter((note) => note.id_etudiant === etudiantId);
    let totalScore = 0;
    let totalCoeff = 0;
    const notesByMatiere = etudiantNotes.map((note) => {
      const matiere = matieres.find((mat) => mat.id === note.id_matiere);
      if (matiere) {
        totalScore += note.note * matiere.coefficient;
        totalCoeff += matiere.coefficient;
      }
      return {
        matiereNom: matiere ? matiere.nom_matiere : 'Inconnue',
        note: note.note
      };
    });
    const moyenne = totalCoeff > 0 ? totalScore / totalCoeff : 0;
    const statut = moyenne >= 10 ? 'Admis' : 'Redoubler';
    return { notesByMatiere, moyenne: moyenne.toFixed(2), statut };
  };

  const generatePDF = (etudiant) => {
    const { notesByMatiere, moyenne, statut } = getEtudiantNotes(etudiant.id);
    const doc = new jsPDF();
    doc.text(`Relevé de Notes - ${etudiant.nom_et} ${etudiant.prenom_et}`, 10, 10);
    doc.text(`Matricule: ${etudiant.matricule}`, 10, 20);
    doc.text(`Niveau: ${etudiant.niveau}`, 10, 30);
    doc.text('Notes par matière:', 10, 40);
    notesByMatiere.forEach((item, index) => {
      doc.text(`${item.matiereNom}: ${item.note}`, 10, 50 + index * 10);
    });
    doc.text(`Moyenne: ${moyenne}`, 10, 50 + notesByMatiere.length * 10);
    doc.text(`Statut: ${statut}`, 10, 60 + notesByMatiere.length * 10);
    doc.save(`releve_notes_${etudiant.matricule}.pdf`);
  };

  const handleAddNote = (etudiantId) => {
    setSelectedEtudiantId(etudiantId);
    setNoteFormData({ id_matiere: '', note: '' });
    setShowModal(true);
  };

  const handleNoteSubmit = async (e) => {
    e.preventDefault();
    try {
      await createNote({ ...noteFormData, id_etudiant: selectedEtudiantId });
      const noteResponse = await getNotes();
      setNotes(noteResponse.data);
      setShowModal(false);
      setSelectedEtudiantId(null);
    } catch (err) {
      setError('Erreur lors de l\'ajout de la note');
    }
  };

  const handleNoteChange = (e) => {
    setNoteFormData({ ...noteFormData, [e.target.name]: e.target.value });
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedEtudiantId(null);
    setNoteFormData({ id_matiere: '', note: '' });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <svg className="animate-spin h-12 w-12 text-blue-500 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-gray-600 font-medium">Chargement des données...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto mt-8">
        <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-6 animate-pulse">
          <div className="flex items-center">
            <svg className="w-6 h-6 text-red-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <p className="text-red-800 font-semibold">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête avec gradient */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-4 bg-white/20 backdrop-blur-sm rounded-xl">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-4xl font-bold">Gestion des Étudiants</h1>
              <p className="text-blue-100 mt-2">Gérez vos étudiants et leurs notes</p>
            </div>
          </div>
          <Link
            to="/etudiants/create"
            className="group relative px-6 py-3 bg-white text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center space-x-2 overflow-hidden"
          >
            <svg className="w-5 h-5 transition-transform duration-300 group-hover:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Nouvel Étudiant</span>
            <div className="absolute inset-0 bg-blue-600 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
          </Link>
        </div>
      </div>

      {/* Filtres et recherche */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Barre de recherche */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 transition-all duration-300 hover:shadow-xl">
          <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
            <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Recherche Dynamique
          </label>
          <div className="relative group">
            <input
              type="text"
              placeholder="Rechercher par matricule ou niveau..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900 placeholder-gray-400"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Tri par niveau */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 transition-all duration-300 hover:shadow-xl">
          <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
            <svg className="w-5 h-5 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
            </svg>
            Filtrer par Niveau
          </label>
          <select
            value={sortLevel}
            onChange={(e) => setSortLevel(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 text-gray-900"
          >
            <option value="">Tous les niveaux</option>
            {[...new Set(etudiants.map((etud) => etud.niveau).filter(Boolean))].map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tableau des étudiants */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Matricule</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Nom Prénom</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Notes</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Moyenne</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Statut</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredEtudiants.map((etud, idx) => {
                const { notesByMatiere, moyenne, statut } = getEtudiantNotes(etud.id);
                return (
                  <tr key={etud.id} className="hover:bg-blue-50 transition-colors duration-200">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold">
                          {etud.matricule.substring(0, 2).toUpperCase()}
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">{etud.matricule}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">{etud.nom_et} {etud.prenom_et}</div>
                      <div className="text-sm text-gray-500">{etud.niveau}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-700 space-y-1">
                        {notesByMatiere.length > 0 ? (
                          notesByMatiere.map((item, i) => (
                            <div key={i} className="flex items-center space-x-2">
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {item.matiereNom}: {item.note}
                              </span>
                            </div>
                          ))
                        ) : (
                          <span className="text-gray-400 italic">Aucune note</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
                        {moyenne}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                        statut === 'Admis' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {statut === 'Admis' ? (
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                          </svg>
                        )}
                        {statut}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <Link
                        to={`/etudiants/edit/${etud.id}`}
                        className="inline-flex items-center px-3 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-200 hover:shadow-lg"
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Modifier
                      </Link>
                      <button
                        onClick={() => handleDelete(etud.id)}
                        className="inline-flex items-center px-3 py-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-200 hover:shadow-lg"
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Supprimer
                      </button>
                      <button
                        onClick={() => generatePDF(etud)}
                        className="inline-flex items-center px-3 py-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all duration-200 hover:shadow-lg"
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        PDF
                      </button>
                      <button
                        onClick={() => handleAddNote(etud.id)}
                        className="inline-flex items-center px-3 py-1.5 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-all duration-200 hover:shadow-lg"
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Note
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal pour ajouter une note */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            {/* Overlay avec animation */}
            <div 
              className="fixed inset-0 transition-opacity bg-gray-900 bg-opacity-75 backdrop-blur-sm"
              onClick={closeModal}
            ></div>

            {/* Modal content */}
            <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              {/* En-tête du modal */}
              <div className="bg-gradient-to-r from-purple-500 to-pink-600 px-6 py-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-white">
                      Ajouter une Note
                    </h3>
                  </div>
                  <button
                    onClick={closeModal}
                    className="text-white hover:text-gray-200 transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Formulaire */}
              <form onSubmit={handleNoteSubmit} className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Matière
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400 group-focus-within:text-purple-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <select
                      name="id_matiere"
                      value={noteFormData.id_matiere}
                      onChange={handleNoteChange}
                      className="pl-10 w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 text-gray-900"
                      required
                    >
                      <option value="">Sélectionner une matière</option>
                      {matieres.map((mat) => (
                        <option key={mat.id} value={mat.id}>
                          {mat.nom_matiere}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Note
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400 group-focus-within:text-purple-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                      </svg>
                    </div>
                    <input
                      type="number"
                      step="0.1"
                      name="note"
                      value={noteFormData.note}
                      onChange={handleNoteChange}
                      className="pl-10 w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 text-gray-900 placeholder-gray-400"
                      placeholder="Ex: 15.5"
                      min="0"
                      max="20"
                      required
                    />
                  </div>
                  <p className="mt-2 text-xs text-gray-500">Note sur 20</p>
                </div>

                {/* Boutons d'action */}
                <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="group px-6 py-3 border-2 border-gray-300 rounded-xl text-gray-700 font-medium hover:border-gray-400 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200 flex items-center space-x-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span>Annuler</span>
                  </button>
                  
                  <button
                    type="submit"
                    className="group relative px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center space-x-2 overflow-hidden"
                  >
                    <svg className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Ajouter</span>
                    <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Message si aucun étudiant */}
      {filteredEtudiants.length === 0 && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 rounded-lg p-6 mt-6">
          <div className="flex items-center">
            <svg className="w-6 h-6 text-yellow-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <p className="text-yellow-800 font-medium">
              Aucun étudiant trouvé. {searchQuery || sortLevel ? "Essayez de modifier vos critères de recherche." : "Ajoutez votre premier étudiant pour commencer."}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default EtudiantList;