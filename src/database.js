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
          FOREIGN KEY (student_id) REFERENCES students(id)
        );
      `);

      // Popolamento tabella STUDENTS se vuota
      const checkStudents = db.exec("SELECT COUNT(*) FROM students;");
      if (checkStudents.length === 0 || checkStudents[0].values[0][0] === 0) {
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
      }

      // Popolamento tabella BADGE_LOGS se vuota
      const checkLogs = db.exec("SELECT COUNT(*) FROM badge_logs;");
      if (checkLogs.length === 0 || checkLogs[0].values[0][0] === 0) {
        db.run(`
          INSERT INTO badge_logs (timestamp, student_id, checkpoint, action) VALUES 
          ('2026-04-29 11:15:00', 1, 'Study_Room', 'IN'),
          ('2026-04-29 11:45:00', 1, 'Study_Room', 'OUT'),
          ('2026-04-29 13:10:00', 1, 'Kitchen', 'IN'),
          ('2026-04-29 13:25:00', 1, 'Kitchen', 'OUT'),
          ('2026-04-29 17:40:00', 1, 'Entrance_Door', 'OUT'),
          ('2026-04-29 19:10:00', 1, 'Entrance_Door', 'IN'),
          ('2026-04-29 19:12:00', 1, 'Kitchen', 'IN'),
          ('2026-04-29 20:10:00', 1, 'Kitchen', 'OUT'),
          ('2026-04-29 21:18:00', 1, 'Study_Room', 'IN'),
          ('2026-04-29 22:00:00', 1, 'Study_Room', 'OUT'),
          ('2026-04-29 12:50:00', 2, 'TV_Room', 'IN'),
          ('2026-04-29 13:10:00', 2, 'TV_Room', 'OUT'),
          ('2026-04-29 13:20:00', 2, 'Kitchen', 'IN'),
          ('2026-04-29 13:50:00', 2, 'Kitchen', 'OUT'),
          ('2026-04-29 15:15:00', 2, 'TV_Room', 'IN'),
          ('2026-04-29 17:30:00', 2, 'TV_Room', 'OUT'),
          ('2026-04-29 18:05:00', 2, 'Entrance_Door', 'OUT'),
          ('2026-04-29 19:45:00', 2, 'Entrance_Door', 'IN'),
          ('2026-04-29 21:18:00', 2, 'Study_Room', 'IN'),
          ('2026-04-29 22:00:00', 2, 'Study_Room', 'OUT'),
          ('2026-04-29 12:03:00', 3, 'Kitchen', 'IN'),
          ('2026-04-29 12:12:00', 3, 'Kitchen', 'OUT'),
          ('2026-04-29 14:10:00', 3, 'Kitchen', 'IN'),
          ('2026-04-29 14:18:00', 3, 'Kitchen', 'OUT'),
          ('2026-04-29 17:00:00', 3, 'Entrance_Door', 'OUT'),
          ('2026-04-29 20:30:00', 3, 'Entrance_Door', 'IN'),
          ('2026-04-29 09:03:00', 4, 'Entrance_Door', 'OUT'),
          ('2026-04-29 22:45:00', 4, 'Entrance_Door', 'IN'),
          ('2026-04-29 10:05:00', 5, 'Kitchen', 'IN'),
          ('2026-04-29 10:30:00', 5, 'Kitchen', 'OUT'),
          ('2026-04-29 10:38:00', 5, 'Study_Room', 'IN'),
          ('2026-04-29 11:55:00', 5, 'Study_Room', 'OUT'),
          ('2026-04-29 12:15:00', 5, 'Entrance_Door', 'OUT'),
          ('2026-04-29 12:25:00', 5, 'Entrance_Door', 'IN'),
          ('2026-04-29 12:28:00', 5, 'Study_Room', 'IN'),
          ('2026-04-29 13:30:00', 5, 'Study_Room', 'OUT'),
          ('2026-04-29 13:40:00', 5, 'Kitchen', 'IN'),
          ('2026-04-29 14:02:00', 5, 'Kitchen', 'OUT'),
          ('2026-04-29 14:05:00', 5, 'TV_Room', 'IN'),
          ('2026-04-29 14:29:00', 5, 'TV_Room', 'OUT'),
          ('2026-04-29 14:35:00', 5, 'Study_Room', 'IN'),
          ('2026-04-29 16:50:00', 5, 'Study_Room', 'OUT'),
          ('2026-04-29 17:19:00', 5, 'Kitchen', 'IN'),
          ('2026-04-29 17:56:00', 5, 'Kitchen', 'OUT'),
          ('2026-04-29 19:00:00', 5, 'Study_Room', 'IN'),
          ('2026-04-29 20:43:00', 5, 'Study_Room', 'OUT'),
          ('2026-04-29 20:44:00', 5, 'Kitchen', 'IN'), 
          ('2026-04-29 20:48:00', 5, 'Kitchen', 'OUT'),
          ('2026-04-29 20:49:00', 5, 'Study_Room', 'IN'),
          ('2026-04-29 22:00:00', 5, 'Study_Room', 'OUT'),
          ('2026-04-29 10:05:00', 6, 'Kitchen', 'IN'),
          ('2026-04-29 10:30:00', 6, 'Kitchen', 'OUT'),
          ('2026-04-29 10:38:00', 6, 'Study_Room', 'IN'),
          ('2026-04-29 11:55:00', 6, 'Study_Room', 'OUT'),
          ('2026-04-29 13:40:00', 6, 'Kitchen', 'IN'),
          ('2026-04-29 14:02:00', 6, 'Kitchen', 'OUT'),
          ('2026-04-29 14:05:00', 6, 'TV_Room', 'IN'),
          ('2026-04-29 14:29:00', 6, 'TV_Room', 'OUT'),
          ('2026-04-29 15:30:00', 6, 'Entrance_Door', 'OUT'),
          ('2026-04-29 19:50:00', 6, 'Entrance_Door', 'IN'),
          ('2026-04-29 21:00:00', 6, 'Study_Room', 'IN'),
          ('2026-04-29 21:30:00', 6, 'Study_Room', 'OUT'),
          ('2026-04-29 15:20:00', 7, 'Entrance_Door', 'OUT'),
          ('2026-04-29 21:55:00', 7, 'Entrance_Door', 'IN'),
          ('2026-04-29 22:01:00', 7, 'Kitchen', 'IN'),
          ('2026-04-29 22:06:00', 7, 'Kitchen', 'OUT'),
          ('2026-04-29 11:00:00', 8, 'Study_Room', 'IN'),
          ('2026-04-29 12:30:00', 8, 'Study_Room', 'OUT'),
          ('2026-04-29 13:00:00', 8, 'Kitchen', 'IN'),
          ('2026-04-29 13:15:00', 8, 'Kitchen', 'OUT'),
          ('2026-04-29 17:00:00', 8, 'Entrance_Door', 'OUT'),
          ('2026-04-29 20:30:00', 8, 'Entrance_Door', 'IN'),
          ('2026-04-29 20:32:00', 8, 'TV_Room', 'IN'),
          ('2026-04-29 22:15:00', 8, 'TV_Room', 'OUT'),
          ('2026-04-29 09:10:00', 9, 'Entrance_Door', 'OUT'),
          ('2026-04-29 23:00:00', 9, 'Entrance_Door', 'IN'),
          ('2026-04-29 14:15:00', 10, 'TV_Room', 'IN'),
          ('2026-04-29 15:00:00', 10, 'TV_Room', 'OUT'),
          ('2026-04-29 15:02:00', 10, 'Entrance_Door', 'OUT'),
          ('2026-04-29 15:26:00', 10, 'Entrance_Door', 'IN'),
          ('2026-04-29 17:30:00', 10, 'TV_Room', 'IN'),
          ('2026-04-29 18:45:00', 10, 'TV_Room', 'OUT'),
          ('2026-04-29 20:30:00', 10, 'Kitchen', 'IN'),
          ('2026-04-29 20:44:00', 10, 'Kitchen', 'OUT'),
          ('2026-04-29 20:45:00', 10, 'Entrance_Door', 'OUT'),
          ('2026-04-29 20:47:00', 10, 'Entrance_Door', 'IN'),
          ('2026-04-29 20:48:00', 10, 'TV_Room', 'IN'),
          ('2026-04-29 22:30:00', 10, 'TV_Room', 'OUT'),
          ('2026-04-29 12:43:00', 11, 'Kitchen', 'IN'),
          ('2026-04-29 13:35:00', 11, 'Kitchen', 'OUT'),
          ('2026-04-29 13:36:00', 11, 'TV_Room', 'IN'),
          ('2026-04-29 16:30:00', 11, 'TV_Room', 'OUT'),
          ('2026-04-29 16:54:00', 11, 'Kitchen', 'IN'),
          ('2026-04-29 17:03:00', 11, 'Kitchen', 'OUT'),
          ('2026-04-29 17:04:00', 11, 'Entrance_Door', 'OUT'),
          ('2026-04-29 18:00:00', 11, 'Entrance_Door', 'IN'),
          ('2026-04-29 20:00:00', 11, 'Kitchen', 'IN'),
          ('2026-04-29 20:25:00', 11, 'Kitchen', 'OUT'),
          ('2026-04-29 20:30:00', 11, 'TV_Room', 'IN'),
          ('2026-04-29 22:00:00', 11, 'TV_Room', 'OUT'),
          ('2026-04-29 12:43:00', 12, 'Kitchen', 'IN'),
          ('2026-04-29 13:35:00', 12, 'Kitchen', 'OUT'),
          ('2026-04-29 13:36:00', 12, 'TV_Room', 'IN'),
          ('2026-04-29 14:53:00', 12, 'TV_Room', 'OUT'),
          ('2026-04-29 19:15:00', 12, 'Entrance_Door', 'OUT'),
          ('2026-04-29 22:30:00', 12, 'Entrance_Door', 'IN'),
          ('2026-04-29 11:30:00', 13, 'TV_Room', 'IN'),
          ('2026-04-29 12:20:00', 13, 'TV_Room', 'OUT'),
          ('2026-04-29 12:30:00', 13, 'Kitchen', 'IN'),
          ('2026-04-29 13:30:00', 13, 'Kitchen', 'OUT'),
          ('2026-04-29 13:36:00', 13, 'TV_Room', 'IN'),
          ('2026-04-29 16:00:00', 13, 'TV_Room', 'OUT'),
          ('2026-04-29 20:15:00', 13, 'Kitchen', 'IN'),
          ('2026-04-29 20:28:00', 13, 'Kitchen', 'OUT'),
          ('2026-04-29 20:30:00', 13, 'TV_Room', 'IN'),
          ('2026-04-29 22:00:00', 13, 'TV_Room', 'OUT'),
          ('2026-04-29 12:30:00', 14, 'Kitchen', 'IN'),
          ('2026-04-29 13:30:00', 14, 'Kitchen', 'OUT'),
          ('2026-04-29 16:30:00', 14, 'Study_Room', 'IN'),
          ('2026-04-29 19:00:00', 14, 'Study_Room', 'OUT'),
          ('2026-04-29 19:30:00', 14, 'TV_Room', 'IN'),
          ('2026-04-29 22:00:00', 14, 'TV_Room', 'OUT'),
          ('2026-04-29 12:10:00', 15, 'Kitchen', 'IN'),
          ('2026-04-29 12:30:00', 15, 'Kitchen', 'OUT'),
          ('2026-04-29 15:45:00', 15, 'Kitchen', 'IN'),
          ('2026-04-29 16:00:00', 15, 'Kitchen', 'OUT'),
          ('2026-04-29 19:15:00', 15, 'Kitchen', 'IN'),
          ('2026-04-29 20:10:00', 15, 'Kitchen', 'OUT');
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

// Avvia l'inizializzazione del DB subito al caricamento del modulo
initDatabase();

export async function executeQuery(queryText, params = []) {
  const database = await initDatabase();
  return database.exec(queryText, params);
}

if (typeof window !== 'undefined') {
  window.initDatabase = initDatabase;
  window.executeQuery = executeQuery;
}