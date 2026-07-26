import initSqlJs from 'sql.js';

let db = null;

export async function initDatabase() {
  if (db) return db;

  // Carica i file WASM di sql.js direttamente da CDN
  const SQL = await initSqlJs({
    locateFile: file => `https://sql.js.org/dist/${file}`
  });

  db = new SQL.Database();

  // 1. Creazione Tabella Studenti
  db.run(`
    CREATE TABLE students (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      room INTEGER NOT NULL
    );
  `);

  // 2. Creazione Tabella Badge Logs
  db.run(`
    CREATE TABLE badge_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      timestamp TEXT NOT NULL,
      student_id INTEGER,
      checkpoint TEXT NOT NULL, 
      action TEXT NOT NULL,
      FOREIGN KEY (student_id) REFERENCES students(id)
    );
  `);

  // 3. Inserimento Studenti
  db.run(`
    INSERT INTO students (id, name, room) VALUES 
    (1, 'Marti', 101), (2, 'Vale', 101),
    (3, 'Jess', 102), (4, 'Dile', 102),
    (5, 'Erika', 103), (6, 'Ilaria', 103),
    (7, 'Marghe', 104), (8, 'Emi', 104),
    (9, 'Gianni', 105), (10, 'Sandro', 105),
    (11, 'Jaco', 106), (12, 'Manuel', 106),
    (13, 'Vince', 107), (14, 'Pietro', 107),
    (15, 'Lori', 108), (16, 'Andrea', 108);
  `);

  // 4. Inserimento Logs di Movimento
  db.run(`
    INSERT INTO badge_logs (timestamp, student_id, checkpoint, action) VALUES 
    ('08:15:00', 9, 'Scala_Camere', 'EXIT'),
    ('08:16:00', 9, 'Porta_Giardino', 'EXIT'),
    ('18:45:00', 1, 'Scala_Camere', 'EXIT'),
    ('18:46:00', 1, 'Sala_TV', 'ENTRY'),
    ('18:50:00', 14, 'Scala_Camere', 'EXIT'),
    ('18:51:00', 14, 'Sala_TV', 'ENTRY'),
    ('19:12:00', 10, 'Scala_Camere', 'EXIT'),
    ('19:15:00', 10, 'Porta_Giardino', 'EXIT'),
    ('19:18:00', 10, 'Porta_Giardino', 'ENTRY'),
    ('19:22:00', 10, 'Scala_Camere', 'ENTRY'),
    ('19:30:00', 5, 'Scala_Camere', 'EXIT'),
    ('19:31:00', 5, 'Cucina', 'ENTRY'),
    ('19:35:00', 7, 'Scala_Camere', 'EXIT'),
    ('19:36:00', 7, 'Cucina', 'ENTRY'),
    ('22:50:00', 9, 'Porta_Giardino', 'ENTRY'),
    ('22:52:00', 9, 'Scala_Camere', 'ENTRY');
  `);

  return db;
}

export function executeQuery(queryText) {
  if (!db) throw new Error("Database non ancora inizializzato!");
  
  // Esegue la query SQL e restituisce i risultati
  const res = db.exec(queryText);
  return res;
}