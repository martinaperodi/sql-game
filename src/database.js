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
          ('2026-04-29 10:12:00', 1, 'Scala_Camere', 'EXIT', 'Esce dal piano camere'),
          ('2026-04-29 12:30:00', 1, 'Cucina', 'ENTRY', 'Entra in cucina'),
          ('2026-04-29 13:15:00', 1, 'Cucina', 'EXIT', 'Esce dalla cucina'),
          ('2026-04-29 13:18:00', 1, 'Porta_Giardino', 'EXIT', 'Esce nel giardino'),
          ('2026-04-29 15:45:00', 1, 'Porta_Giardino', 'ENTRY', 'Rientra dal giardino'),
          ('2026-04-29 15:48:00', 1, 'Scala_Camere', 'ENTRY', 'Sale al piano camere'),
          ('2026-04-29 18:05:00', 1, 'Cucina', 'ENTRY', 'Entra in cucina'),
          ('2026-04-29 18:20:00', 1, 'Cucina', 'EXIT', 'Esce dalla cucina'),
          ('2026-04-29 20:15:00', 1, 'Cucina', 'ENTRY', 'Entra in cucina per cena'),
          ('2026-04-29 21:10:00', 1, 'Cucina', 'EXIT', 'Esce dalla cucina'),
          ('2026-04-29 21:12:00', 1, 'Sala_TV', 'ENTRY', 'Entra in sala TV'),
          ('2026-04-29 22:40:00', 1, 'Sala_TV', 'EXIT', 'Esce dalla sala TV'),
          ('2026-04-29 22:42:00', 1, 'Scala_Camere', 'ENTRY', 'Sale al piano camere'),

          -- Vale (ID 2)
          ('2026-04-29 09:40:00', 2, 'Scala_Camere', 'EXIT', 'Esce dal piano camere'),
          ('2026-04-29 09:42:00', 2, 'Cucina', 'ENTRY', 'Entra in cucina'),
          ('2026-04-29 12:00:00', 2, 'Cucina', 'EXIT', 'Esce dalla cucina'),
          ('2026-04-29 12:05:00', 2, 'Porta_Giardino', 'EXIT', 'Esce nel giardino'),
          ('2026-04-29 13:00:00', 2, 'Porta_Giardino', 'ENTRY', 'Rientra dal giardino'),
          ('2026-04-29 13:02:00', 2, 'Scala_Camere', 'ENTRY', 'Sale al piano camere'),
          ('2026-04-29 15:30:00', 2, 'Porta_Giardino', 'EXIT', 'Esce dalla residenza'),
          ('2026-04-29 18:10:00', 2, 'Porta_Giardino', 'ENTRY', 'Rientra in residenza'),
          ('2026-04-29 18:12:00', 2, 'Scala_Camere', 'ENTRY', 'Sale al piano camere'),
          ('2026-04-29 20:15:00', 2, 'Cucina', 'ENTRY', 'Entra in cucina per cena'),
          ('2026-04-29 21:10:00', 2, 'Cucina', 'EXIT', 'Esce dalla cucina'),

          -- Jess (ID 3)
          ('2026-04-29 11:45:00', 3, 'Scala_Camere', 'EXIT', 'Esce dal piano camere'),
          ('2026-04-29 12:03:00', 3, 'Cucina', 'ENTRY', 'Entra in cucina a prendere il mangiare per il gatto'),
          ('2026-04-29 12:30:00', 3, 'Cucina', 'EXIT', 'Esce dalla cucina'),
          ('2026-04-29 12:32:00', 3, 'Scala_Camere', 'ENTRY', 'Sale al piano camere'),
          ('2026-04-29 13:50:00', 3, 'Cucina', 'ENTRY', 'Entra in cucina per pranzo'),
          ('2026-04-29 14:30:00', 3, 'Cucina', 'EXIT', 'Esce dalla cucina'),
          ('2026-04-29 18:30:00', 3, 'Porta_Giardino', 'EXIT', 'Esce in giardino'),
          ('2026-04-29 19:00:00', 3, 'Porta_Giardino', 'ENTRY', 'Rientra dal giardino'),
          ('2026-04-29 19:05:00', 3, 'Cucina', 'ENTRY', 'Entra in cucina'),
          ('2026-04-29 21:00:00', 3, 'Scala_Camere', 'ENTRY', 'Sale al piano camere'),

          -- Dile (ID 4)
          ('2026-04-29 09:03:00', 4, 'Scala_Camere', 'EXIT', 'Esce dal piano camere'),
          ('2026-04-29 09:04:00', 4, 'Porta_Giardino', 'EXIT', 'Esce dalla residenza'),
          ('2026-04-29 22:45:00', 4, 'Porta_Giardino', 'ENTRY', 'Rientra in residenza'),
          ('2026-04-29 22:48:00', 4, 'Scala_Camere', 'ENTRY', 'Sale al piano camere'),

          -- Erika (ID 5)
          ('2026-04-29 10:05:00', 5, 'Scala_Camere', 'EXIT', 'Esce dal piano camere'),
          ('2026-04-29 10:06:00', 5, 'Cucina', 'ENTRY', 'Entra in cucina'),
          ('2026-04-29 10:38:00', 5, 'Cucina', 'EXIT', 'Esce dalla cucina'),
          ('2026-04-29 12:15:00', 5, 'Porta_Giardino', 'EXIT', 'Esce dalla residenza'),
          ('2026-04-29 12:25:00', 5, 'Porta_Giardino', 'ENTRY', 'Rientra in residenza'),
          ('2026-04-29 13:40:00', 5, 'Cucina', 'ENTRY', 'Entra in cucina'),
          ('2026-04-29 14:04:00', 5, 'Cucina', 'EXIT', 'Esce dalla cucina'),
          ('2026-04-29 14:05:00', 5, 'Sala_TV', 'ENTRY', 'Entra in sala TV'),
          ('2026-04-29 14:29:00', 5, 'Sala_TV', 'EXIT', 'Esce dalla sala TV'),
          ('2026-04-29 17:19:00', 5, 'Cucina', 'ENTRY', 'Entra in cucina per un caffe'),
          ('2026-04-29 17:56:00', 5, 'Cucina', 'EXIT', 'Esce dalla cucina'),
          ('2026-04-29 20:15:00', 5, 'Cucina', 'ENTRY', 'Entra in cucina per cena'),
          ('2026-04-29 22:10:00', 5, 'Scala_Camere', 'ENTRY', 'Sale al piano camere'),

          -- Ilaria (ID 6)
          ('2026-04-29 10:05:00', 6, 'Scala_Camere', 'EXIT', 'Esce dal piano camere'),
          ('2026-04-29 10:06:00', 6, 'Cucina', 'ENTRY', 'Entra in cucina'),
          ('2026-04-29 10:38:00', 6, 'Cucina', 'EXIT', 'Esce dalla cucina'),
          ('2026-04-29 13:40:00', 6, 'Cucina', 'ENTRY', 'Entra in cucina'),
          ('2026-04-29 14:04:00', 6, 'Cucina', 'EXIT', 'Esce dalla cucina'),
          ('2026-04-29 14:05:00', 6, 'Sala_TV', 'ENTRY', 'Entra in sala TV'),
          ('2026-04-29 14:29:00', 6, 'Sala_TV', 'EXIT', 'Esce dalla sala TV'),
          ('2026-04-29 15:30:00', 6, 'Porta_Giardino', 'EXIT', 'Esce dalla residenza'),
          ('2026-04-29 21:30:00', 6, 'Porta_Giardino', 'ENTRY', 'Rientra in residenza'),
          ('2026-04-29 21:32:00', 6, 'Scala_Camere', 'ENTRY', 'Sale al piano camere'),

          -- Margie (ID 7)
          ('2026-04-29 11:30:00', 7, 'Scala_Camere', 'EXIT', 'Esce dal piano camere'),
          ('2026-04-29 12:40:00', 7, 'Cucina', 'ENTRY', 'Entra in cucina'),
          ('2026-04-29 12:55:00', 7, 'Cucina', 'EXIT', 'Esce dalla cucina'),
          ('2026-04-29 12:57:00', 7, 'Scala_Camere', 'ENTRY', 'Sale al piano camere'),
          ('2026-04-29 15:02:00', 7, 'Scala_Camere', 'EXIT', 'Esce dal piano camere'),
          ('2026-04-29 15:05:00', 7, 'Porta_Giardino', 'EXIT', 'Esce dalla residenza'),
          ('2026-04-29 21:55:00', 7, 'Porta_Giardino', 'ENTRY', 'Rientra in residenza'),
          ('2026-04-29 22:01:00', 7, 'Cucina', 'ENTRY', 'Entra in cucina a bere acqua'),
          ('2026-04-29 22:06:00', 7, 'Cucina', 'EXIT', 'Esce dalla cucina'),
          ('2026-04-29 22:07:00', 7, 'Scala_Camere', 'ENTRY', 'Sale al piano camere'),

          -- Emi (ID 8)
          ('2026-04-29 09:15:00', 8, 'Scala_Camere', 'EXIT', 'Esce dal piano camere'),
          ('2026-04-29 09:18:00', 8, 'Porta_Giardino', 'EXIT', 'Esce nel giardino'),
          ('2026-04-29 12:10:00', 8, 'Porta_Giardino', 'ENTRY', 'Rientra dal giardino'),
          ('2026-04-29 12:12:00', 8, 'Scala_Camere', 'ENTRY', 'Sale al piano camere'),
          ('2026-04-29 14:15:00', 8, 'Porta_Giardino', 'EXIT', 'Esce dalla residenza'),
          ('2026-04-29 18:40:00', 8, 'Porta_Giardino', 'ENTRY', 'Rientra in residenza'),
          ('2026-04-29 18:43:00', 8, 'Scala_Camere', 'ENTRY', 'Sale al piano camere'),
          ('2026-04-29 20:00:00', 8, 'Cucina', 'ENTRY', 'Entra in cucina per cena'),
          ('2026-04-29 21:30:00', 8, 'Sala_TV', 'ENTRY', 'Entra in sala TV'),
          ('2026-04-29 23:10:00', 8, 'Scala_Camere', 'ENTRY', 'Sale al piano camere'),

          -- Gian (ID 9)
          ('2026-04-29 09:10:00', 9, 'Scala_Camere', 'EXIT', 'Esce dal piano camere'),
          ('2026-04-29 09:11:00', 9, 'Porta_Giardino', 'EXIT', 'Esce dalla residenza'),
          ('2026-04-29 23:00:00', 9, 'Porta_Giardino', 'ENTRY', 'Rientra in residenza'),
          ('2026-04-29 23:02:00', 9, 'Scala_Camere', 'ENTRY', 'Sale al piano camere'),

          -- Sandro (ID 10)
          ('2026-04-29 11:00:00', 10, 'Scala_Camere', 'EXIT', 'Esce dal piano camere'),
          ('2026-04-29 11:05:00', 10, 'Sala_TV', 'ENTRY', 'Entra in sala TV'),
          ('2026-04-29 14:15:00', 10, 'Sala_TV', 'ENTRY', 'Entra nuovamente in sala TV'),
          ('2026-04-29 15:01:00', 10, 'Sala_TV', 'EXIT', 'Esce dalla sala TV'),
          ('2026-04-29 15:02:00', 10, 'Porta_Giardino', 'EXIT', 'Esce dalla residenza al telefono'),
          ('2026-04-29 15:26:00', 10, 'Porta_Giardino', 'ENTRY', 'Rientra in residenza'),
          ('2026-04-29 15:27:00', 10, 'Scala_Camere', 'ENTRY', 'Sale al piano camere'),
          ('2026-04-29 18:15:00', 10, 'Cucina', 'ENTRY', 'Entra in cucina per uno snack'),
          ('2026-04-29 18:25:00', 10, 'Cucina', 'EXIT', 'Esce dalla cucina'),
          ('2026-04-29 19:30:00', 10, 'Cucina', 'ENTRY', 'Entra in cucina'),
          ('2026-04-29 21:15:00', 10, 'Scala_Camere', 'ENTRY', 'Sale al piano camere'),

          -- Jaco (ID 11)
          ('2026-04-29 11:20:00', 11, 'Scala_Camere', 'EXIT', 'Esce dal piano camere'),
          ('2026-04-29 11:22:00', 11, 'Porta_Giardino', 'EXIT', 'Esce nel giardino'),
          ('2026-04-29 12:43:00', 11, 'Scala_Camere', 'EXIT', 'Scende le scale'),
          ('2026-04-29 12:44:00', 11, 'Cucina', 'ENTRY', 'Entra in cucina'),
          ('2026-04-29 13:36:00', 11, 'Sala_TV', 'ENTRY', 'Entra in sala TV'),
          ('2026-04-29 16:53:00', 11, 'Sala_TV', 'EXIT', 'Esce dalla sala TV'),
          ('2026-04-29 16:54:00', 11, 'Cucina', 'ENTRY', 'Entra in cucina a lavare i piatti'),
          ('2026-04-29 17:03:00', 11, 'Cucina', 'EXIT', 'Esce dalla cucina'),
          ('2026-04-29 17:04:00', 11, 'Porta_Giardino', 'EXIT', 'Esce a fumare in giardino'),
          ('2026-04-29 17:20:00', 11, 'Porta_Giardino', 'ENTRY', 'Rientra dal giardino'),
          ('2026-04-29 20:10:00', 11, 'Cucina', 'ENTRY', 'Entra in cucina'),
          ('2026-04-29 23:00:00', 11, 'Scala_Camere', 'ENTRY', 'Sale al piano camere'),

          -- Manuel (ID 12)
          ('2026-04-29 12:43:00', 12, 'Scala_Camere', 'EXIT', 'Scende le scale'),
          ('2026-04-29 12:44:00', 12, 'Cucina', 'ENTRY', 'Entra in cucina'),
          ('2026-04-29 13:36:00', 12, 'Sala_TV', 'ENTRY', 'Entra in sala TV'),
          ('2026-04-29 14:53:00', 12, 'Sala_TV', 'EXIT', 'Esce dalla sala TV'),
          ('2026-04-29 14:54:00', 12, 'Scala_Camere', 'ENTRY', 'Sale le scale'),
          ('2026-04-29 14:58:00', 12, 'Scala_Camere', 'EXIT', 'Scende le scale'),
          ('2026-04-29 14:59:00', 12, 'Porta_Giardino', 'EXIT', 'Esce dalla residenza'),
          ('2026-04-29 22:50:00', 12, 'Porta_Giardino', 'ENTRY', 'Rientra in residenza'),
          ('2026-04-29 22:53:00', 12, 'Scala_Camere', 'ENTRY', 'Sale al piano camere'),

          -- Vince (ID 13)
          ('2026-04-29 10:45:00', 13, 'Scala_Camere', 'EXIT', 'Esce dal piano camere'),
          ('2026-04-29 10:48:00', 13, 'Cucina', 'ENTRY', 'Entra in cucina'),
          ('2026-04-29 13:00:00', 13, 'Cucina', 'EXIT', 'Esce dalla cucina'),
          ('2026-04-29 13:36:00', 13, 'Sala_TV', 'ENTRY', 'Entra in sala TV'),
          ('2026-04-29 16:10:00', 13, 'Sala_TV', 'EXIT', 'Esce dalla sala TV'),
          ('2026-04-29 16:12:00', 13, 'Porta_Giardino', 'EXIT', 'Esce nel giardino'),
          ('2026-04-29 18:20:00', 13, 'Porta_Giardino', 'ENTRY', 'Rientra dal giardino'),
          ('2026-04-29 18:22:00', 13, 'Scala_Camere', 'ENTRY', 'Sale al piano camere'),
          ('2026-04-29 20:30:00', 13, 'Cucina', 'ENTRY', 'Entra in cucina'),
          ('2026-04-29 21:40:00', 13, 'Cucina', 'EXIT', 'Esce dalla cucina'),
          ('2026-04-29 21:42:00', 13, 'Porta_Giardino', 'EXIT', 'Esce in giardino a fumare'),
          ('2026-04-29 22:15:00', 13, 'Porta_Giardino', 'ENTRY', 'Rientra e sale in camera'),
          ('2026-04-29 22:15:00', 13, 'Scala_Camere', 'ENTRY', 'Sale al piano camere'),

          -- Pietro (ID 14)
          ('2026-04-29 11:10:00', 14, 'Scala_Camere', 'EXIT', 'Esce dal piano camere'),
          ('2026-04-29 13:36:00', 14, 'Sala_TV', 'ENTRY', 'Entra in sala TV'),
          ('2026-04-29 16:10:00', 14, 'Sala_TV', 'EXIT', 'Esce dalla sala TV'),
          ('2026-04-29 16:12:00', 14, 'Porta_Giardino', 'EXIT', 'Esce nel giardino'),
          ('2026-04-29 18:45:00', 14, 'Porta_Giardino', 'ENTRY', 'Rientra in residenza'),
          ('2026-04-29 18:47:00', 14, 'Scala_Camere', 'ENTRY', 'Sale al piano camere'),
          ('2026-04-29 20:30:00', 14, 'Cucina', 'ENTRY', 'Entra in cucina'),
          ('2026-04-29 22:20:00', 14, 'Scala_Camere', 'ENTRY', 'Sale al piano camere'),

          -- Lori (ID 15)
          ('2026-04-29 09:25:00', 15, 'Scala_Camere', 'EXIT', 'Esce dal piano camere'),
          ('2026-04-29 09:28:00', 15, 'Cucina', 'ENTRY', 'Entra in cucina'),
          ('2026-04-29 11:00:00', 15, 'Cucina', 'EXIT', 'Esce dalla cucina'),
          ('2026-04-29 11:02:00', 15, 'Scala_Camere', 'ENTRY', 'Sale al piano camere'),
          ('2026-04-29 13:10:00', 15, 'Cucina', 'ENTRY', 'Entra in cucina'),
          ('2026-04-29 15:00:00', 15, 'Cucina', 'EXIT', 'Esce dalla cucina'),
          ('2026-04-29 18:00:00', 15, 'Porta_Giardino', 'EXIT', 'Esce nel giardino'),
          ('2026-04-29 19:10:00', 15, 'Porta_Giardino', 'ENTRY', 'Rientra dal giardino'),
          ('2026-04-29 19:12:00', 15, 'Scala_Camere', 'ENTRY', 'Sale al piano camere'),
          ('2026-04-29 20:20:00', 15, 'Cucina', 'ENTRY', 'Entra in cucina'),
          ('2026-04-29 22:00:00', 15, 'Scala_Camere', 'ENTRY', 'Sale al piano camere'),

          -- Andrea (ID 16)
          ('2026-04-29 10:30:00', 16, 'Scala_Camere', 'EXIT', 'Esce dal piano camere'),
          ('2026-04-29 10:33:00', 16, 'Porta_Giardino', 'EXIT', 'Esce nel giardino'),
          ('2026-04-29 12:15:00', 16, 'Porta_Giardino', 'ENTRY', 'Rientra dal giardino'),
          ('2026-04-29 12:18:00', 16, 'Scala_Camere', 'ENTRY', 'Sale al piano camere'),
          ('2026-04-29 14:30:00', 16, 'Porta_Giardino', 'EXIT', 'Esce dalla residenza'),
          ('2026-04-29 18:50:00', 16, 'Porta_Giardino', 'ENTRY', 'Rientra in residenza'),
          ('2026-04-29 18:52:00', 16, 'Scala_Camere', 'ENTRY', 'Sale al piano camere'),
          ('2026-04-29 20:20:00', 16, 'Cucina', 'ENTRY', 'Entra in cucina'),
          ('2026-04-29 22:00:00', 16, 'Scala_Camere', 'ENTRY', 'Sale al piano camere');
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