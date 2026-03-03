import { useEffect, useState } from 'react';
import { getNotes, deleteNote } from '../api/api';
import { Link } from 'react-router-dom';

function NoteList() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await getNotes();
        setNotes(response.data);
        setLoading(false);
      } catch (err) {
        setError('Erreur lors du chargement des notes');
        setLoading(false);
      }
    };
    fetchNotes();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Voulez-vous supprimer cette note ?')) {
      try {
        await deleteNote(id);
        setNotes(notes.filter((note) => note.id !== id));
      } catch (err) {
        setError('Erreur lors de la suppression');
      }
    }
  };

  if (loading) return <p className="text-center">Chargement...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="mt-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-2xl font-bold">Liste des Notes</h3>
        <Link
          to="/notes/create"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Ajouter Note
        </Link>
      </div>
      <table className="min-w-full bg-white border">
        <thead>
          <tr>
            <th className="py-2 px-4 border">Note</th>
            <th className="py-2 px-4 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {notes.map((note) => (
            <tr key={note.id}>
              <td className="py-2 px-4 border">{note.note}</td>
              <td className="py-2 px-4 border">
                <Link
                  to={`/notes/edit/${note.id}`}
                  className="text-blue-500 hover:underline mr-2"
                >
                  Modifier
                </Link>
                <button
                  onClick={() => handleDelete(note.id)}
                  className="text-red-500 hover:underline"
                >
                  Supprimer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default NoteList;