import { Routes, Route } from 'react-router-dom';
import NoteList from '../components/NoteList';
import NoteForm from '../components/NoteForm';

function NotePage() {
  return (
    <div className="max-w-7xl mx-auto p-6">
      <Routes>
        <Route path="/" element={<NoteList />} />
        <Route path="/create" element={<NoteForm />} />
        <Route path="/edit/:id" element={<NoteForm />} />
      </Routes>
    </div>
  );
}

export default NotePage;