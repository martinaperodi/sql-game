import { useState, useEffect } from 'react';
import { initDatabase, executeQuery } from './database';
import './App.css';
import { testimonials } from './testimonials';

function App() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDossier, setShowDossier] = useState(false);
  const [filterText, setFilterText] = useState('');
  
  // Modulo accusa
  const [suspect, setSuspect] = useState('');
  const [accusationResult, setAccusationResult] = useState('');

  useEffect(() => {
    initDatabase()
      .then(() => {
        setLoading(false);
      })
      .catch((err) => {
        setError("Errore caricamento DB: " + err.message);
        setLoading(false);
      });
  }, []);

  const handleRunQuery = () => {
    if (loading || !query.trim()) return;
    
    setError(null);
    try {
      const res = executeQuery(query);
      setResults(res);
    } catch (err) {
      setError(err.message);
      setResults(null);
    }
  };

  const handleAccuse = (e) => {
    e.preventDefault();
    if (suspect === 'Sandro') {
      setAccusationResult(
        'CASO RISOLTO! Sandro è crollato sotto le prove! I badge log e le testimonianze dimostrano che è stato l’unico a registrare un passaggio alla Porta d’Ingresso (OUT/IN) proprio tra le 20:45 e le 20:47, lasciando scappare Fulgenzio dopo essersi infastidito in cucina!'
      );
    } else if (suspect) {
      setAccusationResult(
        `Sbagliato! ${suspect} ha un alibi confermato dai log dei badge o dalle testimonianze incrociate. Controlla bene gli orari tra le 20:30 e le 21:00!`
      );
    }
  };

  // Filtra le testimonianze se il giocatore usa la barra di ricerca nel dossier
  const filteredTestimonials = testimonials.filter(t => 
    t.name.toLowerCase().includes(filterText.toLowerCase()) ||
    t.statement.toLowerCase().includes(filterText.toLowerCase()) ||
    t.room.toString().includes(filterText)
  );

  if (loading) {
    return (
      <div style={{ color: '#38bdf8', padding: 40, fontFamily: 'monospace', textAlign: 'center' }}>
        ⏳ Caricamento ed inizializzazione del Database SQLite in corso...
      </div>
    );
  }

  return (
    <div className="app-container">
      <header>
        <h1>Missing Fulgenzio</h1>
        <button onClick={() => setShowDossier(!showDossier)} className="btn-dossier">
          {showDossier ? 'Chiudi Dossier' : 'Apri Dossier Testimonianze (16)'}
        </button>
      </header>

      {/* Dossier Testimonianze Dinamico */}
      {showDossier && (
        <div className="dossier-box" style={{ background: '#1e293b', padding: '16px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #334155' }}>
          <h3>Registro Verbali Testimonianze</h3>
          <input 
            type="text" 
            placeholder="Cerca per nome, stanza o parola chiave (es. gatto, porta)..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            style={{ width: '100%', padding: '8px', marginBottom: '12px', borderRadius: '4px', border: '1px solid #475569', background: '#0f172a', color: '#fff' }}
          />
          
          <div className="testimonials-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '12px', maxHeight: '350px', overflowY: 'auto' }}>
            {filteredTestimonials.map((t) => (
              <div key={t.student_id} className="card" style={{ padding: '12px', background: '#0f172a', borderRadius: '6px', border: '1px solid #334155' }}>
                <h4 style={{ margin: '0 0 6px 0', color: '#38bdf8' }}>
                  {t.name} <span style={{ fontSize: '0.8em', color: '#94a3b8' }}>(Stanza {t.room})</span>
                </h4>
                <p style={{ margin: 0, fontSize: '0.88em', color: '#cbd5e1', lineHeight: '1.4' }}>"{t.statement}"</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="dashboard">
        {/* Console SQL */}
        <section className="panel center-panel">
          <h2>💻 Console SQL</h2>
          <textarea 
            value={query} 
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Scrivi qui la tua query SQL... "
            rows={5}
            style={{ fontFamily: 'monospace' }}
          />
          <button onClick={handleRunQuery} className="btn-primary" disabled={loading || !query.trim()}>
            Esegui Query
          </button>

          {error && <div className="error-box">⚠️ {error}</div>}

          <div className="results-container">
            <h3>Risultati:</h3>
            {results && results.length > 0 ? (
              <table>
                <thead>
                  <tr>
                    {results[0].columns.map((col, idx) => (
                      <th key={idx}>{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {results[0].values.map((row, rIdx) => (
                    <tr key={rIdx}>
                      {row.map((val, cIdx) => (
                        <td key={cIdx}>{val}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>Nessun risultato. Inserisci una query ed esegui.</p>
            )}
          </div>
        </section>

        {/* Pannello Accusa */}
        <section className="panel right-panel">
          <h2>⚖️ Formula l'Accusa</h2>
          <form onSubmit={handleAccuse}>
            <label>Chi è il colpevole?</label>
            <select value={suspect} onChange={(e) => setSuspect(e.target.value)}>
              <option value="">-- Seleziona Sospettato --</option>
              {testimonials.map((t) => (
                <option key={t.student_id} value={t.name}>
                  {t.name} (Stanza {t.room})
                </option>
              ))}
            </select>
            <button type="submit" className="btn-danger" style={{ marginTop: '12px' }}>Invia Accusa</button>
          </form>

          {accusationResult && (
            <div className="verdict" style={{ marginTop: '16px', padding: '12px', borderRadius: '6px', background: accusationResult.startsWith('🎉') ? '#065f46' : '#7f1d1d' }}>
              {accusationResult}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default App;