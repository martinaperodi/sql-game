import { useState, useEffect } from 'react';
import { initDatabase, executeQuery } from './database';
import './App.css';
import { testimonials } from './testimonials';

function App() {
  const [query, setQuery] = useState(
    "SELECT s.name, b.timestamp, b.checkpoint, b.action, b.description\nFROM badge_logs b\nJOIN students s ON s.id = b.student_id\nWHERE b.checkpoint = 'Porta_Giardino';"
  );
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
        // Esegue la query iniziale in automatico quando il DB è pronto
        try {
          const initialRes = executeQuery(
            "SELECT s.name, b.timestamp, b.checkpoint, b.action, b.description FROM badge_logs b JOIN students s ON s.id = b.student_id WHERE b.checkpoint = 'Porta_Giardino';"
          );
          setResults(initialRes);
        } catch (e) {
          console.log(e);
        }
      })
      .catch((err) => {
        setError("Errore caricamento DB: " + err.message);
        setLoading(false);
      });
  }, []);

  const handleRunQuery = () => {
    if (loading) return;
    
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
    if (suspect === 'Manuel') {
      setAccusationResult(
        '🎉 CASO RISOLTO! Manuel è crollato sotto le prove! I badge log dimostrano che ha usato il tonno per attirare Fulgenzio nella scatola alle 14:44 per il "test con il cane", e ha mentito dicendo di aver chiuso la porta alle 15:10 (non c’è alcun log!). Incastrato!'
      );
    } else if (suspect === 'Sandro') {
      setAccusationResult(
        '❌ Sbagliato! Sandro ha mentito sull’essere sul divano, ma è uscito solo alle 15:02 per cercare le sue chiavi perse. Non è stato lui a far sparire Fulgenzio con la scatola!'
      );
    } else if (suspect) {
      setAccusationResult(
        `❌ Sbagliato! ${suspect} ha un alibi confermato dai log dei badge o dalle testimonianze incrociate. Rivedi le tue query!`
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
        <h1>🔎 Caso Fulgenzio: Chi ha fatto sparire il gatto?</h1>
        <button onClick={() => setShowDossier(!showDossier)} className="btn-dossier">
          {showDossier ? '❌ Chiudi Dossier' : '📄 Apri Dossier Testimonianze (16)'}
        </button>
      </header>

      {/* Dossier Testimonianze Dinamico */}
      {showDossier && (
        <div className="dossier-box" style={{ background: '#1e293b', padding: '16px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #334155' }}>
          <h3>📂 Registro Verbali Testimonianze</h3>
          <input 
            type="text" 
            placeholder="Cerca per nome, stanza o parola chiave (es. tonno, pizza)..."
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
            rows={5}
            style={{ fontFamily: 'monospace' }}
          />
          <button onClick={handleRunQuery} className="btn-primary" disabled={loading}>
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
              {/* Genera automaticamente tutti i 16 studenti nel menu a tendina */}
              {testimonials.map((t) => (
                <option key={t.student_id} value={t.name}>
                  {t.name} (Stanza {t.room})
                </option>
              ))}
            </select>
            <button type="submit" className="btn-danger" style={{ marginTop: '12px' }}>Invia Accusa</button>
          </form>

          {accusationResult && <div className="verdict" style={{ marginTop: '16px', padding: '12px', borderRadius: '6px', background: accusationResult.startsWith('🎉') ? '#065f46' : '#7f1d1d' }}>{accusationResult}</div>}
        </section>
      </div>
    </div>
  );
}

export default App;