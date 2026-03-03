import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { createNote, getNote, updateNote, getEtudiants } from '../api/api';

function NoteForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    id_etudiant: '',
    note: '',
  });
  const [etudiants, setEtudiants] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const etudResponse = await getEtudiants();
        setEtudiants(etudResponse.data);
        if (id) {
          const response = await getNote(id);
          setFormData(response.data);
        }
      } catch (err) {
        setError('Erreur lors du chargement des données');
      }
    };
    fetchData();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        await updateNote(id, formData);
      } else {
        await createNote(formData);
      }
      navigate('/notes');
    } catch (err) {
      setError('Erreur lors de la soumission');
    }
  };

  return (
    <div className="mt-6">
      <h3 className="text-2xl font-bold mb-4">
        {id ? 'Modifier Note' : 'Créer Note'}
      </h3>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Étudiant</label>
          <select
            name="id_etudiant"
            value={formData.id_etudiant}
            onChange={handleChange}
            className="mt-1 p-2 w-full border rounded"
            required
          >
            <option value="">Sélectionner un étudiant</option>
            {etudiants.map((etud) => (
              <option key={etud.id} value={etud.id}>
                {etud.nom_et} {etud.prenom_et} ({etud.matricule})
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Note</label>
          <input
            type="number"
            step="0.1"
            name="note"
            value={formData.note}
            onChange={handleChange}
            className="mt-1 p-2 w-full border rounded"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {id ? 'Mettre à jour' : 'Créer'}
        </button>
      </form>
    </div>
  );
}

export default NoteForm;