import sqlite3 from "sqlite3";
import path from "path";
import { create } from "./querys";

// const userDataPath = app.getPath('userData');
// const dbPath = path.join(userDataPath, 'database.sqlite');

const dbPath = path.join(__dirname, "database.sqlite");

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) console.log("OCURRIO UN ERROR AL CONECTAR A LA DB: ", err.message);
  else {
    Object.keys(create).forEach((key) => db.run(create[key], (r: any, err: any) => {
      if (err) console.log("OCURRIO UN ERROR AL CREAR LA TABLA: ", err.message);
      else console.log("TABLA CREADA: ", key);
      return r;
    }))
  }
});

export default db;
