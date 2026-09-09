'use client';

import { FileText, Plus, Save, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { createBrowserSupabaseClient } from '../lib/supabase/client';
import './floating-notes.css';

export type FloatingNotesMode = 'editor' | 'library' | null;

type NoteRecord = {
  id: string;
  subject: string;
  body: string;
  created_at: string;
  updated_at: string;
};

export default function FloatingNotes({ mode, onClose }: { mode: FloatingNotesMode; onClose: () => void }) {
  const supabase = useMemo(() => createBrowserSupabaseClient(), []);
  const [view, setView] = useState<'editor' | 'library'>('editor');
  const [notes, setNotes] = useState<NoteRecord[]>([]);
  const [noteId, setNoteId] = useState<string | null>(null);
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');

  const startNew = () => {
    setNoteId(null);
    setSubject('');
    setBody('');
    setMessage('');
    setView('editor');
  };

  const loadNotes = async () => {
    setBusy(true);
    setMessage('');
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setNotes([]);
      setMessage('Entre na sua conta para acessar suas anotações.');
      setBusy(false);
      return;
    }
    const { data, error } = await supabase
      .from('notes')
      .select('id,subject,body,created_at,updated_at')
      .order('updated_at', { ascending: false });
    if (error) setMessage('Não foi possível carregar suas anotações.');
    else setNotes((data || []) as NoteRecord[]);
    setBusy(false);
  };

  useEffect(() => {
    if (!mode) return;
    if (mode === 'library') {
      setView('library');
      void loadNotes();
    } else {
      startNew();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  useEffect(() => {
    if (!mode) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [mode, onClose]);

  const saveNote = async () => {
    if (!subject.trim() && !body.trim()) {
      setMessage('Escreva um assunto ou texto antes de salvar.');
      return;
    }
    setBusy(true);
    setMessage('');
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setMessage('Entre na sua conta para salvar a anotação.');
      setBusy(false);
      return;
    }
    const payload = {
      user_id: user.id,
      subject: subject.trim() || 'Sem assunto',
      body: body.trim(),
      updated_at: new Date().toISOString(),
    };
    const result = noteId
      ? await supabase.from('notes').update(payload).eq('id', noteId).select('id,subject,body,created_at,updated_at').single()
      : await supabase.from('notes').insert(payload).select('id,subject,body,created_at,updated_at').single();
    if (result.error || !result.data) {
      setMessage('Não foi possível salvar a anotação.');
      setBusy(false);
      return;
    }
    const savedNote = result.data as NoteRecord;
    try {
      localStorage.setItem('zyvo:last-saved-note', JSON.stringify(savedNote));
    } catch {}
    window.dispatchEvent(new CustomEvent<NoteRecord>('zyvo:note-saved', { detail: savedNote }));
    setBusy(false);
    onClose();
  };

  const openNote = (note: NoteRecord) => {
    setNoteId(note.id);
    setSubject(note.subject);
    setBody(note.body);
    setMessage('');
    setView('editor');
  };

  if (!mode) return null;

  return (
    <div className="floating-notes-layer" role="dialog" aria-modal="true" aria-label="Anotações">
      <section className="floating-notes">
        <header className="floating-notes-head">
          <div>
            <span className="floating-notes-accent" />
            <h3>{view === 'editor' ? (noteId ? 'Editar anotação' : 'Anotar') : 'Anotações'}</h3>
            <p>{view === 'editor' ? 'Registre ideias sem sair da reunião.' : 'Suas notas salvas em um só lugar.'}</p>
          </div>
          {view === 'library' && (
            <button className="floating-notes-icon" onClick={startNew} aria-label="Nova anotação"><Plus size={16}/></button>
          )}
          <button className="floating-notes-close" onClick={onClose} aria-label="Fechar"><X size={16}/></button>
        </header>

        {view === 'editor' ? (
          <div className="floating-notes-editor">
            <label>
              <span>ASSUNTO</span>
              <input value={subject} onChange={event => setSubject(event.target.value)} placeholder="Ex.: Reunião com cliente" autoFocus />
            </label>
            <label>
              <span>TEXTO</span>
              <textarea value={body} onChange={event => setBody(event.target.value)} placeholder="Escreva sua anotação..." />
            </label>
            <div className="floating-notes-actions">
              <button className="floating-notes-secondary" onClick={() => { setView('library'); void loadNotes(); }}>Ver anotações</button>
              <button className="floating-notes-save" onClick={saveNote} disabled={busy}><Save size={15}/>{busy ? 'Salvando...' : 'Salvar'}</button>
            </div>
          </div>
        ) : (
          <div className="floating-notes-library">
            {busy && <div className="floating-notes-empty">Carregando...</div>}
            {!busy && notes.length === 0 && <div className="floating-notes-empty"><FileText size={21}/><span>{message || 'Nenhuma anotação salva ainda.'}</span></div>}
            {!busy && notes.map(note => (
              <button className="floating-note-card" key={note.id} onClick={() => openNote(note)}>
                <div className="floating-note-card-top"><strong>{note.subject || 'Sem assunto'}</strong><time>{new Date(note.updated_at).toLocaleString('pt-BR', { day:'2-digit', month:'2-digit', hour:'2-digit', minute:'2-digit' })}</time></div>
                <p>{note.body || 'Sem texto.'}</p>
              </button>
            ))}
          </div>
        )}
        {message && view === 'editor' && <div className="floating-notes-message">{message}</div>}
      </section>
    </div>
  );
}
