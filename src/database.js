import initSqlJs from 'sql.js/dist/sql-wasm.js';

let db = null;
let initPromise = null;

export async function initDatabase() {
  if (db) return db;
  if (initPromise) return initPromise;

  initPromise = (async () => {
    try {
      // Inizializza puntando al file WASM nella cartella public
      const SQL = await initSqlJs({
        locateFile: () => '/sql-wasm.wasm'
      });

      db = new SQL.Database();

      // Tabella Studenti
      db.run(`
        CREATE TABLE IF NOT EXISTS students (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          room INTEGER NOT NULL
        );
      `);

      // Tabella Log Badge
      db.run(`
        CREATE TABLE IF NOT EXISTS badge_logs (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          timestamp TEXT NOT NULL,
          student_id INTEGER,
          checkpoint TEXT NOT NULL, 
          action TEXT NOT NULL,
          description TEXT,
          FOREIGN KEY (student_id) REFERENCES students(id)
        );
      `);

      // Verifica e popola se il DB è vuoto
      const check = db.exec("SELECT COUNT(*) FROM students;");
      if (check.length === 0 || check[0].values[0][0] === 0) {
        db.run(`
          INSERT INTO students (id, name, room) VALUES 
          (1, 'Nicole', 101), (2, 'Vale', 101),
          (3, 'Jess', 102),   (4, 'Dile', 102),
          (5, 'Erika', 103),  (6, 'Ilaria', 103),
          (7, 'Margie', 104), (8, 'Emi', 104),
          (9, 'Gian', 105),   (10, 'Sandro', 105),
          (11, 'Jaco', 106),  (12, 'Manuel', 106),
          (13, 'Vince', 107), (14, 'Pietro', 107),
          (15, 'Lori', 108),  (16, 'Andrea', 108);
        `);

        db.run(`
          INSERT INTO badge_logs (timestamp, student_id, checkpoint, action, description) VALUES 
          -- Nicole (ID 1)
          ('2026-04-29 11:15:00', 1, 'Sala_Studio', 'IN', 'Entra in sala studio'),
          ('2026-04-29 11:45:00', 1, 'Sala_Studio', 'OUT', 'Esce dalla sala studio'),
          ('2026-04-29 13:10:00', 1, 'Cucina', 'IN', 'Entra in cucina per pranzo'),
          ('2026-04-29 13:25:00', 1, 'Cucina', 'OUT', 'Esce dalla cucina'),
          ('2026-04-29 17:40:00', 1, 'Porta_Ingresso', 'OUT', 'Esce per fare la spesa'),
          ('2026-04-29 19:10:00', 1, 'Porta_Ingresso', 'IN', 'Rientra con la spesa'),
          ('2026-04-29 19:12:00', 1, 'Cucina', 'IN', 'Entra in cucina per preparare la cena'),
          ('2026-04-29 20:10:00', 1, 'Cucina', 'OUT', 'Esce dalla cucina'),
          ('2026-04-29 21:18:00', 1, 'Sala_Studio', 'IN', 'Entra in sala studio a studiare con Vale'),
          ('2026-04-29 22:00:00', 1, 'Sala_Studio', 'OUT', 'Esce dalla sala studio'),

          -- Vale (ID 2)
          ('2026-04-29 12:50:00', 2, 'Sala_TV', 'IN', 'Entra in sala TV'),
          ('2026-04-29 13:10:00', 2, 'Sala_TV', 'OUT', 'Esce dalla sala TV'),
          ('2026-04-29 13:20:00', 2, 'Cucina', 'IN', 'Entra in cucina'),
          ('2026-04-29 13:50:00', 2, 'Cucina', 'OUT', 'Esce dalla cucina'),
          ('2026-04-29 15:15:00', 2, 'Sala_TV', 'IN', 'Entra in sala TV'),
          ('2026-04-29 17:30:00', 2, 'Sala_TV', 'OUT', 'Esce dalla sala TV'),
          ('2026-04-29 18:05:00', 2, 'Porta_Ingresso', 'OUT', 'Esce per andare a correre'),
          ('2026-04-29 19:45:00', 2, 'Porta_Ingresso', 'IN', 'Rientra dalla corsa'),
          ('2026-04-29 21:18:00', 2, 'Sala_Studio', 'IN', 'Entra in sala studio con Nicole'),
          ('2026-04-29 22:00:00', 2, 'Sala_Studio', 'OUT', 'Esce dalla sala studio'),

          -- Jess (ID 3)
          ('2026-04-29 12:03:00', 3, 'Cucina', 'IN', 'Entra in cucina a prendere il mangiare per il gatto'),
          ('2026-04-29 12:12:00', 3, 'Cucina', 'OUT', 'Esce dalla cucina'),
          ('2026-04-29 14:10:00', 3, 'Cucina', 'IN', 'Entra in cucina a prendere un bicchiere d acqua'),
          ('2026-04-29 14:18:00', 3, 'Cucina', 'OUT', 'Esce dalla cucina'),
          ('2026-04-29 17:00:00', 3, 'Porta_Ingresso', 'OUT', 'Esce per lezioni universitarie'),
          ('2026-04-29 20:30:00', 3, 'Porta_Ingresso', 'IN', 'Rientra a casa con il mal di testa'),

          -- Dile (ID 4)
          ('2026-04-29 09:03:00', 4, 'Porta_Ingresso', 'OUT', 'Esce per tirocinio'),
          ('2026-04-29 22:45:00', 4, 'Porta_Ingresso', 'IN', 'Rientra dal tirocinio'),

          -- Erika (ID 5)
          ('2026-04-29 10:05:00', 5, 'Cucina', 'IN', 'Entra in cucina'),
          ('2026-04-29 10:30:00', 5, 'Cucina', 'OUT', 'Esce dalla cucina'),
          ('2026-04-29 10:38:00', 5, 'Sala_Studio', 'IN', 'Entra in sala studio'),
          ('2026-04-29 11:55:00', 5, 'Sala_Studio', 'OUT', 'Esce dalla sala studio'),
          ('2026-04-29 12:15:00', 5, 'Porta_Ingresso', 'OUT', 'Esce un attimo fuori'),
          ('2026-04-29 12:25:00', 5, 'Porta_Ingresso', 'IN', 'Rientra in residenza'),
          ('2026-04-29 12:28:00', 5, 'Sala_Studio', 'IN', 'Rientra in sala studio'),
          ('2026-04-29 13:30:00', 5, 'Sala_Studio', 'OUT', 'Esce dalla sala studio'),
          ('2026-04-29 13:40:00', 5, 'Cucina', 'IN', 'Entra in cucina'),
          ('2026-04-29 14:02:00', 5, 'Cucina', 'OUT', 'Esce dalla cucina'),
          ('2026-04-29 14:05:00', 5, 'Sala_TV', 'IN', 'Entra in sala TV'),
          ('2026-04-29 14:29:00', 5, 'Sala_TV', 'OUT', 'Esce dalla sala TV'),
          ('2026-04-29 14:35:00', 5, 'Sala_Studio', 'IN', 'Entra in sala studio'),
          ('2026-04-29 16:50:00', 5, 'Sala_Studio', 'OUT', 'Esce dalla sala studio'),
          ('2026-04-29 17:19:00', 5, 'Cucina', 'IN', 'Entra in cucina per un caffe'),
          ('2026-04-29 17:56:00', 5, 'Cucina', 'OUT', 'Esce dalla cucina'),
          ('2026-04-29 19:00:00', 5, 'Sala_Studio', 'IN', 'Entra in sala studio'),
          ('2026-04-29 20:43:00', 5, 'Sala_Studio', 'OUT', 'Esce dalla sala studio'),
          ('2026-04-29 20:44:00', 5, 'Cucina', 'IN', 'Entra in cucina per un caffe'), # durante il caffe sandro fa il misfatto
          ('2026-04-29 20:48:00', 5, 'Cucina', 'OUT', 'Esce dalla cucina'),
          ('2026-04-29 20:49:00', 5, 'Sala_Studio', 'IN', 'Entra in sala studio'),
          ('2026-04-29 22:00:00', 5, 'Sala_Studio', 'OUT', 'Esce dalla sala studio'),

          -- Ilaria (ID 6)
          ('2026-04-29 10:05:00', 6, 'Cucina', 'IN', 'Entra in cucina'),
          ('2026-04-29 10:30:00', 6, 'Cucina', 'OUT', 'Esce dalla cucina'),
          ('2026-04-29 10:38:00', 6, 'Sala_Studio', 'IN', 'Entra in sala studio'),
          ('2026-04-29 11:55:00', 6, 'Sala_Studio', 'OUT', 'Esce dalla sala studio'),
          ('2026-04-29 13:40:00', 6, 'Cucina', 'IN', 'Entra in cucina'),
          ('2026-04-29 14:02:00', 6, 'Cucina', 'OUT', 'Esce dalla cucina'),
          ('2026-04-29 14:05:00', 6, 'Sala_TV', 'IN', 'Entra in sala TV'),
          ('2026-04-29 14:29:00', 6, 'Sala_TV', 'OUT', 'Esce dalla sala TV'),
          ('2026-04-29 15:30:00', 6, 'Porta_Ingresso', 'OUT', 'Esce per lezioni in universita'),
          ('2026-04-29 19:50:00', 6, 'Porta_Ingresso', 'IN', 'Rientra'),
          ('2026-04-29 21:00:00', 6, 'Sala_Studio', 'IN', 'Entra in sala studio'),
          ('2026-04-29 21:30:00', 6, 'Sala_Studio', 'OUT', 'Esce dalla sala studio'),

          -- Margie (ID 7)
          ('2026-04-29 15:20:00', 7, 'Porta_Ingresso', 'OUT', 'Esce per aperitivo'),
          ('2026-04-29 21:55:00', 7, 'Porta_Ingresso', 'IN', 'Rientra in residenza'),
          ('2026-04-29 22:01:00', 7, 'Cucina', 'IN', 'Entra in cucina a bere acqua'),
          ('2026-04-29 22:06:00', 7, 'Cucina', 'OUT', 'Esce dalla cucina'),

          -- Emi (ID 8)
          ('2026-04-29 11:00:00', 8, 'Sala_Studio', 'IN', 'Entra in sala studio'),
          ('2026-04-29 12:30:00', 8, 'Sala_Studio', 'OUT', 'Esce dalla sala studio'),
          ('2026-04-29 13:00:00', 8, 'Cucina', 'IN', 'Entra in cucina'),
          ('2026-04-29 13:15:00', 8, 'Cucina', 'OUT', 'Esce dalla cucina'),
          ('2026-04-29 17:00:00', 8, 'Porta_Ingresso', 'OUT', 'Esce di casa'),
          ('2026-04-29 20:30:00', 8, 'Porta_Ingresso', 'IN', 'Rientra a casa'),
          ('2026-04-29 20:32:00', 8, 'Sala_TV', 'IN', 'Entra in sala TV a guardare un film con cuffie'),
          ('2026-04-29 22:15:00', 8, 'Sala_TV', 'OUT', 'Esce dalla sala TV'),

          -- Gian (ID 9)
          ('2026-04-29 09:10:00', 9, 'Porta_Ingresso', 'OUT', 'Esce per gita fuori porta'),
          ('2026-04-29 23:00:00', 9, 'Porta_Ingresso', 'IN', 'Rientra dalla gita'),

          -- Sandro (ID 10) 
          ('2026-04-29 14:15:00', 10, 'Sala_TV', 'IN', 'Entra in sala TV'),
          ('2026-04-29 15:00:00', 10, 'Sala_TV', 'OUT', 'Esce dalla sala TV'),
          ('2026-04-29 15:02:00', 10, 'Porta_Ingresso', 'OUT', 'Esce al telefono a cercare chiavi'),
          ('2026-04-29 15:26:00', 10, 'Porta_Ingresso', 'IN', 'Rientra in residenza'),
          ('2026-04-29 17:30:00', 10, 'Sala_TV', 'IN', 'Entra in sala TV'),
          ('2026-04-29 18:45:00', 10, 'Sala_TV', 'OUT', 'Esce dalla sala TV'),
          ('2026-04-29 20:30:00', 10, 'Cucina', 'IN', 'Entra in cucina per cena e studio'),
          ('2026-04-29 20:44:00', 10, 'Cucina', 'OUT', 'Esce infastidito dalla cucina'),
          ('2026-04-29 20:45:00', 10, 'Porta_Ingresso', 'OUT', 'Apre la porta d ingresso'),
          ('2026-04-29 20:47:00', 10, 'Porta_Ingresso', 'IN', 'Rientra lasciando la porta chiusa'),
          ('2026-04-29 20.48:00', 10, 'Sala_TV', 'IN', 'Entra in sala TV per la partita'),
          ('2026-04-29 22:30:00', 10, 'Sala_TV', 'OUT', 'Esce dalla sala TV'),

          -- Jaco (ID 11)
          ('2026-04-29 12:43:00', 11, 'Cucina', 'IN', 'Entra in cucina'),
          ('2026-04-29 13:35:00', 11, 'Cucina', 'OUT', 'Esce dalla cucina'),
          ('2026-04-29 13:36:00', 11, 'Sala_TV', 'IN', 'Entra in sala TV'),
          ('2026-04-29 16:30:00', 11, 'Sala_TV', 'OUT', 'Esce dalla sala TV'),
          ('2026-04-29 16:54:00', 11, 'Cucina', 'IN', 'Entra in cucina a lavare i piatti'),
          ('2026-04-29 17:03:00', 11, 'Cucina', 'OUT', 'Esce dalla cucina'),
          ('2026-04-29 17:04:00', 11, 'Porta_Ingresso', 'OUT', 'Esce a fumare'),
          ('2026-04-29 18:00:00', 11, 'Porta_Ingresso', 'IN', 'Rientra in casa'),
          ('2026-04-29 20:00:00', 11, 'Cucina', 'IN', 'Entra in cucina (vede Fulgenzio con Sandro)'),
          ('2026-04-29 20:25:00', 11, 'Cucina', 'OUT', 'Esce dalla cucina'),
          ('2026-04-29 20:30:00', 11, 'Sala_TV', 'IN', 'Entra in sala TV a guardare la partita'),
          ('2026-04-29 22:00:00', 11, 'Sala_TV', 'OUT', 'Esce dalla sala TV'),

          -- Manuel (ID 12)
          ('2026-04-29 12:43:00', 12, 'Cucina', 'IN', 'Entra in cucina'),
          ('2026-04-29 13:35:00', 12, 'Cucina', 'OUT', 'Esce dalla cucina'),
          ('2026-04-29 13:36:00', 12, 'Sala_TV', 'IN', 'Entra in sala TV'),
          ('2026-04-29 14:53:00', 12, 'Sala_TV', 'OUT', 'Esce dalla sala TV'),
          ('2026-04-29 19:15:00', 12, 'Porta_Ingresso', 'OUT', 'Esce per cena fuori'),
          ('2026-04-29 22:30:00', 12, 'Porta_Ingresso', 'IN', 'Rientra dalla cena'),

          -- Vince (ID 13)
          ('2026-04-29 11:30:00', 13, 'Sala_TV', 'IN', 'Entra in sala TV'),
          ('2026-04-29 12:20:00', 13, 'Sala_TV', 'OUT', 'Esce dalla sala TV'),
          ('2026-04-29 12:30:00', 13, 'Cucina', 'IN', 'Entra in cucina'),
          ('2026-04-29 13:30:00', 13, 'Cucina', 'OUT', 'Esce dalla cucina'),
          ('2026-04-29 13:36:00', 13, 'Sala_TV', 'IN', 'Entra in sala TV'),
          ('2026-04-29 16:00:00', 13, 'Sala_TV', 'OUT', 'Esce dalla sala TV'),
          ('2026-04-29 20:15:00', 13, 'Cucina', 'IN', 'Entra in cucina'),
          ('2026-04-29 20:28:00', 13, 'Cucina', 'OUT', 'Esce dalla cucina'),
          ('2026-04-29 20:30:00', 13, 'Sala_TV', 'IN', 'Entra in sala TV con Jaco e Pietro'),
          ('2026-04-29 22:00:00', 13, 'Sala_TV', 'OUT', 'Esce dalla sala TV'),

          -- Pietro (ID 14)
          ('2026-04-29 12:30:00', 14, 'Cucina', 'IN', 'Entra in cucina'),
          ('2026-04-29 13:30:00', 14, 'Cucina', 'OUT', 'Esce dalla cucina'),
          ('2026-04-29 16:30:00', 14, 'Sala_Studio', 'IN', 'Entra in sala studio'),
          ('2026-04-29 19:00:00', 14, 'Sala_Studio', 'OUT', 'Esce dalla sala studio'),
          ('2026-04-29 19:30:00', 14, 'Sala_TV', 'IN', 'Entra in sala TV con Jaco e Vince'),
          ('2026-04-29 22:00:00', 14, 'Sala_TV', 'OUT', 'Esce dalla sala TV'),

          -- Lori (ID 15)
          ('2026-04-29 12:10:00', 15, 'Cucina', 'IN', 'Entra in cucina'),
          ('2026-04-29 12:30:00', 15, 'Cucina', 'OUT', 'Esce dalla cucina'),
          ('2026-04-29 15:45:00', 15, 'Cucina', 'IN', 'Entra in cucina'),
          ('2026-04-29 16:00:00', 15, 'Cucina', 'OUT', 'Esce dalla cucina'),
          ('2026-04-29 19:15:00', 15, 'Cucina', 'IN', 'Entra in cucina a cucinare'),
          ('2026-04-29 20:10:00', 15, 'Cucina', 'OUT', 'Esce dalla cucina'),

          -- Andrea (ID 16)
          -- Nessun log registrato durante la giornata (rimasto in stanza a studiare)
        `);
      }

      return db;
    } catch (err) {
      initPromise = null;
      console.error("Errore inizializzazione SQLite:", err);
      throw err;
    }
  })();

  return initPromise;
}

export function executeQuery(queryText) {
  if (!db) {
    throw new Error("Database in caricamento...");
  }
  return db.exec(queryText);
}