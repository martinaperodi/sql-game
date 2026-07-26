import { useState, useEffect } from 'react';
import { initDatabase, executeQuery } from './database';
import './App.css';

function App() {
  const [query, setQuery] = useState("SELECT * FROM badge_logs WHERE checkpoint = 'Porta_Giardino';");
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDossier, setShowDossier] = useState(false);
  
  // Modulo accusa
  const [suspect, setSuspect] = useState('');
  const [accusationResult, setAccusationResult] = useState('');

  useEffect(() => {
    initDatabase().then(() => {
      setLoading(false);
    }).catch(err => {
      setError("Errore nel caricamento del DB: " + err.message);
      setLoading(false);
    });
  }, []);

  const handleRunQuery = () => {
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
      setAccusationResult('🎉 CORRETTO! Sandro è crollato: ha ammesso di aver messo Fulgenzio in giardino perché non ne poteva più del suo miagolio!');
    } else if (suspect) {
      setAccusationResult(`❌ Sbagliato! ${suspect} ha un alibi di ferro verified dai badge_logs. Rivedi le tue query!`);
    }
  };

  if (loading) return <div style={{ color: 'white', padding: 20 }}>Caricamento Database Detective...</div>;

  return (
    <div className="app-container">
      <header>
        <h1>🔎 Caso Fulgenzio: Chi ha chiuso il gatto fuori?</h1>
        <button onClick={() => setShowDossier(!showDossier)} className="btn-dossier">
          {showDossier ? 'Nascondi Dossier' : '📄 Apri Dossier Testimonianze'}
        </button>
      </header>

      {showDossier && (
        <div className="dossier-box">
          <h3>📂 Testimonianze Chiave</h3>
          <p><strong>Marti (101):</strong> "In Sala TV alle 18:45 Fulgenzio era DENTRO che miagolava come un ossesso!"</p>
          <p><strong>Sandro (105):</strong> "Io verso cena sono sceso SOLO in cucina a farmi la pasta, poi sono tornato in camera."</p>
          <p><strong>Gianni (105):</strong> "Sono rientrato a notte fonda, fuori c'era una macchia pelosa al freddo..."</p>
        </div>
      )}

      <div className="dashboard">
        {/* Console SQL */}
        <section className="panel center-panel">
          <h2>💻 Console SQL</h2>
          <textarea 
            value={query} 
            onChange={(e) => setQuery(e.target.value)}
            rows={4}
          />
          <button onClick={handleRunQuery} className="btn-primary">Esegui Query</button>

          {error && <div className="error-box">⚠️ {error}</div>}

          <div className="results-container">
            <h3>Risultati:</h3>
            {results && results.length > 0 ? (
              <table>
                <thead>
                  <tr>
                    {results[0].columns.map((col, idx) => <th key={idx}>{col}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {results[0].values.map((row, rIdx) => (
                    <tr key={rIdx}>
                      {row.map((val, cIdx) => <td key={cIdx}>{val}</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>Nessun risultato da mostrare.</p>
            )}
          </div>
        </section>

        {/* Pannello Accusa */}
        <section className="panel right-panel">
          <h2>⚖️ Formula l'Accusa</h2>
          <form onSubmit={handleAccuse}>
            <label>Chi è il colpevole?</label>
            <select value={suspect} onChange={(e) => setSuspect(e.target.value)}>
              <option value="">-- Seleziona --</option>
              <option value="Sandro">Sandro (Stanza 105)</option>
              <option value="Gianni">Gianni (Stanza 105)</option>
              <option value="Marti">Marti (Stanza 101)</option>
              <option value="Pietro">Pietro (Stanza 107)</option>
            </select>
            <button type="submit" className="btn-danger">Invia Accusa</button>
          </form>

          {accusationResult && <div className="verdict">{accusationResult}</div>}
        </section>
      </div>
    </div>
  );
}

export default App;