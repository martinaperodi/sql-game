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
  const [showBriefingModal, setShowBriefingModal] = useState(true);
  const [filterText, setFilterText] = useState('');
  
  // Accusation state
  const [suspect, setSuspect] = useState('');
  const [accusationResult, setAccusationResult] = useState('');

  useEffect(() => {
    initDatabase()
      .then(() => {
        setLoading(false);
      })
      .catch((err) => {
        setError("Database loading error: " + err.message);
        setLoading(false);
      });
  }, []);

  const handleRunQuery = async () => {
    if (loading || !query.trim()) return;
    
    setError(null);
    try {
      const res = await executeQuery(query);
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
        'CASE SOLVED! Sandro confessed under pressure! The badge logs and cross-referenced testimonies prove he was the only one who recorded an entry/exit at the Main Entrance (OUT/IN) between 8:45 PM and 8:47 PM, letting Fulgenzio escape after getting annoyed in the kitchen!'
      );
    } else if (suspect) {
      setAccusationResult(
        `WRONG! ${suspect} has a confirmed alibi supported by badge logs or cross-referenced testimonies. Double check the timestamps between 8:30 PM and 9:00 PM!`
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
      <div style={{ color: '#38bdf8', padding: '40px', fontFamily: 'monospace', textAlign: 'center', fontSize: '1.1rem' }}>
        Loading and initializing SQLite Database...
      </div>
    );
  }

  return (
    <div className="app-container" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', borderBottom: '1px solid #334155' }}>
        <h1 style={{ margin: 0, color: '#f8fafc', fontSize: '1.8rem' }}>Missing Fulgenzio</h1>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button onClick={() => setShowBriefingModal(true)} className="btn-dossier">
            Case & Rules
          </button>
          
          <button onClick={() => setShowSchemaModal(true)} className="btn-dossier">
            DB Schema / ER
          </button>
          
          <button onClick={() => setShowDossier(!showDossier)} className="btn-dossier">
            {showDossier ? 'Close Dossier' : 'Open Testimonial Dossier (16)'}
          </button>
        </div>
      </header>

      {/* BRIEFING / CASE MODAL */}
      {showBriefingModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.9)',
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          zIndex: 1000, padding: '20px'
        }}>
          <div style={{
            background: '#0f172a', border: '1px solid #f59e0b', borderRadius: '12px',
            padding: '24px', maxWidth: '650px', width: '100%', maxHeight: '85vh',
            overflowY: 'auto', color: '#f8fafc', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{ margin: 0, color: '#f59e0b', fontSize: '1.4rem' }}>
                The Fulgenzio Case
              </h2>
              <button 
                onClick={() => setShowBriefingModal(false)}
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', fontSize: '1.2rem', cursor: 'pointer', fontWeight: 'bold' }}
              >
                X
              </button>
            </div>

            {/* Owner Message */}
            <div style={{ background: '#1e293b', padding: '16px', borderRadius: '8px', borderLeft: '4px solid #f59e0b', marginBottom: '20px', lineHeight: '1.5' }}>
              <p style={{ margin: '0 0 10px 0', fontStyle: 'italic', color: '#cbd5e1' }}>
                "Detective, I need your help! My beloved cat <strong>Fulgenzio</strong> went missing from the student dorm last night. Nobody claims to have seen him leave, but someone is clearly lying..."
              </p>
              <p style={{ margin: 0, fontSize: '0.9rem', color: '#94a3b8' }}>
                -- Mr. Amedeo, Dorm Owner
              </p>
            </div>

            {/* Rules for the Player */}
            <h3 style={{ color: '#38bdf8', fontSize: '1.1rem', marginBottom: '10px' }}>How to find the culprit:</h3>
            <ol style={{ paddingLeft: '20px', lineHeight: '1.6', fontSize: '0.95rem', color: '#e2e8f0' }}>
              <li>
                <strong>Examine Testimonies:</strong> Click on <em>"Open Testimonial Dossier"</em> to read statements from all 16 students and note down suspicious times or behaviors.
              </li>
              <li>
                <strong>Study the Database:</strong> Click on <em>"DB Schema / ER"</em> to see how the <code>students</code> and <code>badge_logs</code> tables are structured.
              </li>
              <li>
                <strong>Run SQL Queries:</strong> Use the SQL console to cross-reference badge logs with statements to uncover who has a false alibi.
              </li>
              <li>
                <strong>Make the Accusation:</strong> Once you are confident about who lied, select their name in the right-hand panel and submit your verdict!
              </li>
            </ol>

            <div style={{ marginTop: '24px', textAlign: 'center' }}>
              <button 
                onClick={() => setShowBriefingModal(false)}
                className="btn-primary"
                style={{ padding: '10px 24px', background: '#f59e0b', color: '#0f172a', fontWeight: 'bold', fontSize: '1rem', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
              >
                Begin Investigation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ER SCHEMA / TABLE STRUCTURE MODAL */}
      {showSchemaModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.9)',
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          zIndex: 1000, padding: '20px'
        }}>
          <div style={{
            background: '#0f172a', border: '1px solid #38bdf8', borderRadius: '12px',
            padding: '24px', maxWidth: '700px', width: '100%', maxHeight: '85vh',
            overflowY: 'auto', color: '#f8fafc'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{ margin: 0, color: '#38bdf8', fontSize: '1.4rem' }}>Database Structure & ER Schema</h2>
              <button onClick={() => setShowSchemaModal(false)} style={{ background: 'transparent', border: 'none', color: '#94a3b8', fontSize: '1.2rem', cursor: 'pointer', fontWeight: 'bold' }}>X</button>
            </div>

            <div style={{ background: '#1e293b', padding: '16px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #334155' }}>
              <h3 style={{ margin: '0 0 10px 0', fontSize: '1rem', color: '#e2e8f0' }}>Table Relationship</h3>
              <div style={{ fontFamily: 'monospace', textAlign: 'center', background: '#0f172a', padding: '12px', borderRadius: '6px', color: '#38bdf8' }}>
                <strong>students</strong> (1) ---&lt; (N) <strong>badge_logs</strong>
                <br />
                <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>(students.id = badge_logs.student_id)</span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div style={{ background: '#1e293b', padding: '14px', borderRadius: '8px', border: '1px solid #334155' }}>
                <h4 style={{ margin: '0 0 10px 0', color: '#facc15' }}>students</h4>
                <table style={{ width: '100%', fontSize: '0.85rem', textAlign: 'left', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #475569', color: '#94a3b8' }}>
                      <th style={{ padding: '4px' }}>Column</th>
                      <th style={{ padding: '4px' }}>Type</th>
                      <th style={{ padding: '4px' }}>Notes</th>
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
                <h4 style={{ margin: '0 0 10px 0', color: '#facc15' }}>badge_logs</h4>
                <table style={{ width: '100%', fontSize: '0.85rem', textAlign: 'left', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #475569', color: '#94a3b8' }}>
                      <th style={{ padding: '4px' }}>Column</th>
                      <th style={{ padding: '4px' }}>Type</th>
                      <th style={{ padding: '4px' }}>Notes</th>
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
              <button onClick={() => setShowSchemaModal(false)} className="btn-primary" style={{ padding: '8px 16px', background: '#38bdf8', color: '#0f172a', fontWeight: 'bold', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* DYNAMIC TESTIMONIAL DOSSIER */}
      {showDossier && (
        <div className="dossier-box" style={{ background: '#1e293b', padding: '16px', borderRadius: '8px', margin: '20px', border: '1px solid #334155' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h3 style={{ margin: 0, color: '#f8fafc', fontSize: '1.2rem' }}>Testimonial Statements Log</h3>
            <button 
              onClick={() => setShowDossier(false)} 
              style={{ background: 'transparent', border: 'none', color: '#94a3b8', fontSize: '1.2rem', cursor: 'pointer', fontWeight: 'bold' }}
            >
              X
            </button>
          </div>
          <input 
            type="text" 
            placeholder="Search by name, room, or keyword (e.g., cat, door)..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            style={{ width: '100%', padding: '10px', marginBottom: '12px', borderRadius: '6px', border: '1px solid #475569', background: '#0f172a', color: '#f8fafc', boxSizing: 'border-box' }}
          />
          
          <div className="testimonials-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '12px', maxHeight: '350px', overflowY: 'auto' }}>
            {filteredTestimonials.map((t) => (
              <div key={t.student_id} className="card" style={{ padding: '12px', background: '#0f172a', borderRadius: '6px', border: '1px solid #334155' }}>
                <h4 style={{ margin: '0 0 6px 0', color: '#38bdf8' }}>
                  {t.name} <span style={{ fontSize: '0.85em', color: '#94a3b8' }}>(Room {t.room})</span>
                </h4>
                <p style={{ margin: 0, fontSize: '0.88em', color: '#cbd5e1', lineHeight: '1.4' }}>"{t.statement}"</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="dashboard" style={{ padding: '20px', display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
        {/* SQL CONSOLE */}
        <section className="panel center-panel" style={{ background: '#1e293b', padding: '20px', borderRadius: '8px', border: '1px solid #334155' }}>
          <h2 style={{ margin: '0 0 16px 0', color: '#f8fafc', fontSize: '1.3rem' }}>SQL Console</h2>
          <textarea 
            value={query} 
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Write your SQL query here..."
            rows={5}
            style={{ width: '100%', fontFamily: 'Consolas, Monaco, monospace', background: '#0f172a', color: '#38bdf8', border: '1px solid #475569', borderRadius: '6px', padding: '12px', boxSizing: 'border-box', fontSize: '0.95rem' }}
          />
          <button onClick={handleRunQuery} className="btn-primary" disabled={loading || !query.trim()} style={{ marginTop: '12px', padding: '10px 20px', background: '#38bdf8', color: '#0f172a', fontWeight: 'bold', border: 'none', borderRadius: '6px', cursor: query.trim() ? 'pointer' : 'not-allowed', opacity: query.trim() ? 1 : 0.6 }}>
            Run Query
          </button>

          {error && <div className="error-box" style={{ marginTop: '12px', padding: '12px', background: '#7f1d1d', color: '#fecaca', borderRadius: '6px', fontSize: '0.9rem' }}>Error: {error}</div>}

          <div className="results-container" style={{ marginTop: '20px' }}>
            <h3 style={{ color: '#e2e8f0', fontSize: '1.1rem', marginBottom: '10px' }}>Results:</h3>
            {results && results.length > 0 ? (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem', color: '#cbd5e1' }}>
                  <thead>
                    <tr style={{ background: '#0f172a', textAlign: 'left', color: '#38bdf8' }}>
                      {results[0].columns.map((col, idx) => (
                        <th key={idx} style={{ padding: '8px 12px', borderBottom: '1px solid #475569' }}>{col}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {results[0].values.map((row, rIdx) => (
                      <tr key={rIdx} style={{ borderBottom: '1px solid #334155' }}>
                        {row.map((val, cIdx) => (
                          <td key={cIdx} style={{ padding: '8px 12px' }}>{val}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>No results. Enter a query and run it.</p>
            )}
          </div>
        </section>

        {/* ACCUSATION PANEL */}
        <section className="panel right-panel" style={{ background: '#1e293b', padding: '20px', borderRadius: '8px', border: '1px solid #334155' }}>
          <h2 style={{ margin: '0 0 16px 0', color: '#f8fafc', fontSize: '1.3rem' }}>Make Your Accusation</h2>
          <form onSubmit={handleAccuse}>
            <label style={{ display: 'block', marginBottom: '8px', color: '#cbd5e1', fontSize: '0.95rem' }}>Who is guilty?</label>
            <select 
              value={suspect} 
              onChange={(e) => setSuspect(e.target.value)}
              style={{ width: '100%', padding: '10px', borderRadius: '6px', background: '#0f172a', color: '#f8fafc', border: '1px solid #475569', fontSize: '0.95rem' }}
            >
              <option value="">-- Select Suspect --</option>
              {testimonials.map((t) => (
                <option key={t.student_id} value={t.name}>
                  {t.name} (Room {t.room})
                </option>
              ))}
            </select>
            <button type="submit" className="btn-danger" style={{ marginTop: '16px', width: '100%', padding: '10px', background: '#ef4444', color: '#ffffff', fontWeight: 'bold', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
              Submit Accusation
            </button>
          </form>

          {accusationResult && (
            <div className="verdict" style={{ marginTop: '20px', padding: '14px', borderRadius: '6px', background: accusationResult.includes('CASE SOLVED') ? '#065f46' : '#7f1d1d', color: '#f8fafc', lineHeight: '1.5', fontSize: '0.95rem' }}>
              {accusationResult}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default App;