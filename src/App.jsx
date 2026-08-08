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
  const [showSchemaModal, setShowSchemaModal] = useState(false);
  const [showBriefingModal, setShowBriefingModal] = useState(true); // Aperto di default all'avvio!
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

  // const handleRunQuery = () => {
  //   if (loading || !query.trim()) return;
    
  //   setError(null);
  //   try {
  //     const res = executeQuery(query);
  //     setResults(res);
  //   } catch (err) {
  //     setError(err.message);
  //     setResults(null);
  //   }
  // };

    // 📍 Sostituisci la tua handleRunQuery attuale con questa:
  const handleRunQuery = async () => {
    if (loading || !query.trim()) return;
    
    setError(null);
    try {
      const res = await executeQuery(query); // <-- 'async' in alto e 'await' qui
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
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {/* Bottone evidenziato per il Briefing */}
          <button 
            onClick={() => setShowBriefingModal(true)} 
            className="btn-primary" 
            style={{ background: '#f59e0b', color: '#0f172a', fontWeight: 'bold' }}
          >
            Caso & Regole
          </button>
          
          <button onClick={() => setShowSchemaModal(true)} className="btn-dossier" style={{ background: '#334155' }}>
            Struttura DB / ER
          </button>
          
          <button onClick={() => setShowDossier(!showDossier)} className="btn-dossier">
            {showDossier ? 'Chiudi Dossier' : 'Apri Dossier Testimonianze (16)'}
          </button>
        </div>
      </header>

      {/* MODALE BRIEFING / CASO DEL PROPRIETARIO */}
      {showBriefingModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.85)',
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          zIndex: 1000, padding: '20px'
        }}>
          <div style={{
            background: '#0f172a', border: '2px solid #f59e0b', borderRadius: '12px',
            padding: '24px', maxWidth: '650px', width: '100%', maxHeight: '85vh',
            overflowY: 'auto', color: '#f8fafc', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{ margin: 0, color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '8px' }}>
                Il Caso Fulgenzio
              </h2>
              <button 
                onClick={() => setShowBriefingModal(false)}
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', fontSize: '1.5rem', cursor: 'pointer' }}
              >
                ✖
              </button>
            </div>

            {/* Messaggio del Proprietario */}
            <div style={{ background: '#1e293b', padding: '16px', borderRadius: '8px', borderLeft: '4px solid #f59e0b', marginBottom: '20px', lineHeight: '1.5' }}>
              <p style={{ margin: '0 0 10px 0', fontStyle: 'italic', color: '#cbd5e1' }}>
                "Investigatore, ho bisogno del tuo aiuto! Il mio amato gatto <strong>Fulgenzio</strong> è sparito dallo studentato ieri sera. Nessuno dice di averlo visto uscire, ma qualcuno sta chiaramente mentendo..."
              </p>
              <p style={{ margin: 0, fontSize: '0.9rem', color: '#94a3b8' }}>
                — Signor Amedeo, Proprietario dello Studentato
              </p>
            </div>

            {/* Regole per il Giocatore */}
            <h3 style={{ color: '#38bdf8', fontSize: '1.1rem', marginBottom: '10px' }}>Come trovare il colpevole:</h3>
            <ol style={{ paddingLeft: '20px', lineHeight: '1.6', fontSize: '0.95rem', color: '#e2e8f0' }}>
              <li>
                <strong>Esamina le Testimonianze:</strong> Clicca su <em>"Apri Dossier Testimonianze"</em> per leggere le dichiarazioni dei 16 studenti e annotate orari o comportamenti sospetti.
              </li>
              <li>
                <strong>Studia il Database:</strong> Clicca su <em>"Struttura DB / ER"</em> per vedere come sono organizzate le tabelle <code>students</code> e <code>badge_logs</code>.
              </li>
              <li>
                <strong>Esegui Query SQL:</strong> Usa la console SQL per incrociare i badge con le testimonianze e scoprire chi ha un falso alibi.
              </li>
              <li>
                <strong>Formula l'Accusa:</strong> Quando sei sicuro di chi ha mentito, seleziona il nome nel pannello di destra e invia l'accusa!
              </li>
            </ol>

            <div style={{ marginTop: '24px', textAlign: 'center' }}>
              <button 
                onClick={() => setShowBriefingModal(false)}
                className="btn-primary"
                style={{ padding: '10px 24px', background: '#f59e0b', color: '#0f172a', fontWeight: 'bold', fontSize: '1rem', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
              >
                Inizia l'Indagine 🔍
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODALE SCHEMA ER / STRUTTURA TABELLE */}
      {showSchemaModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          zIndex: 1000, padding: '20px'
        }}>
          <div style={{
            background: '#0f172a', border: '1px solid #38bdf8', borderRadius: '12px',
            padding: '24px', maxWidth: '700px', width: '100%', maxHeight: '85vh',
            overflowY: 'auto', color: '#f8fafc'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{ margin: 0, color: '#38bdf8' }}>📂 Struttura Database & Schema ER</h2>
              <button onClick={() => setShowSchemaModal(false)} style={{ background: 'transparent', border: 'none', color: '#94a3b8', fontSize: '1.5rem', cursor: 'pointer' }}>✖</button>
            </div>

            <div style={{ background: '#1e293b', padding: '16px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #334155' }}>
              <h3 style={{ margin: '0 0 10px 0', fontSize: '1rem', color: '#e2e8f0' }}>🔗 Relazione Tra le Tabelle</h3>
              <div style={{ fontFamily: 'monospace', textAlign: 'center', background: '#0f172a', padding: '12px', borderRadius: '6px', color: '#38bdf8' }}>
                <strong>students</strong> (1) ───&lt; (N) <strong>badge_logs</strong>
                <br />
                <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>(students.id = badge_logs.student_id)</span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div style={{ background: '#1e293b', padding: '14px', borderRadius: '8px', border: '1px solid #334155' }}>
                <h4 style={{ margin: '0 0 10px 0', color: '#facc15' }}>📊 students</h4>
                <table style={{ width: '100%', fontSize: '0.85rem', textAlign: 'left', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #475569', color: '#94a3b8' }}>
                      <th style={{ padding: '4px' }}>Colonna</th>
                      <th style={{ padding: '4px' }}>Tipo</th>
                      <th style={{ padding: '4px' }}>Note</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr><td style={{ padding: '4px' }}><code>id</code></td><td style={{ padding: '4px', color: '#38bdf8' }}>INTEGER</td><td style={{ padding: '4px', color: '#facc15' }}>PK</td></tr>
                    <tr><td style={{ padding: '4px' }}><code>name</code></td><td style={{ padding: '4px', color: '#38bdf8' }}>TEXT</td><td style={{ padding: '4px' }}>-</td></tr>
                    <tr><td style={{ padding: '4px' }}><code>room</code></td><td style={{ padding: '4px', color: '#38bdf8' }}>INTEGER</td><td style={{ padding: '4px' }}>-</td></tr>
                  </tbody>
                </table>
              </div>

              <div style={{ background: '#1e293b', padding: '14px', borderRadius: '8px', border: '1px solid #334155' }}>
                <h4 style={{ margin: '0 0 10px 0', color: '#facc15' }}>📊 badge_logs</h4>
                <table style={{ width: '100%', fontSize: '0.85rem', textAlign: 'left', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #475569', color: '#94a3b8' }}>
                      <th style={{ padding: '4px' }}>Colonna</th>
                      <th style={{ padding: '4px' }}>Tipo</th>
                      <th style={{ padding: '4px' }}>Note</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr><td style={{ padding: '4px' }}><code>id</code></td><td style={{ padding: '4px', color: '#38bdf8' }}>INTEGER</td><td style={{ padding: '4px', color: '#facc15' }}>PK</td></tr>
                    <tr><td style={{ padding: '4px' }}><code>student_id</code></td><td style={{ padding: '4px', color: '#38bdf8' }}>INTEGER</td><td style={{ padding: '4px', color: '#4ade80' }}>FK</td></tr>
                    <tr><td style={{ padding: '4px' }}><code>timestamp</code></td><td style={{ padding: '4px', color: '#38bdf8' }}>TEXT</td><td style={{ padding: '4px' }}>-</td></tr>
                    <tr><td style={{ padding: '4px' }}><code>checkpoint</code></td><td style={{ padding: '4px', color: '#38bdf8' }}>TEXT</td><td style={{ padding: '4px' }}>-</td></tr>
                    <tr><td style={{ padding: '4px' }}><code>action</code></td><td style={{ padding: '4px', color: '#38bdf8' }}>TEXT</td><td style={{ padding: '4px' }}>-</td></tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div style={{ marginTop: '20px', textAlign: 'right' }}>
              <button onClick={() => setShowSchemaModal(false)} className="btn-primary" style={{ padding: '8px 16px' }}>Chiudi</button>
            </div>
          </div>
        </div>
      )}

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
          <h2>Console SQL</h2>
          <textarea 
            value={query} 
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Scrivi qui la tua query SQL... "
            rows={5}
            style={{ fontFamily: 'monospace' }}
          />
          <button onClick={handleRunQuery} className="btn-primary" disabled={loading || !query.trim()} style={{ marginTop: '10px' }}>
            ▶ Esegui Query
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
          <h2>Formula l'Accusa</h2>
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
            <div className="verdict" style={{ marginTop: '16px', padding: '12px', borderRadius: '6px', background: accusationResult.includes('🎉') ? '#065f46' : '#7f1d1d' }}>
              {accusationResult}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default App;