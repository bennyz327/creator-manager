import sqlite3 from 'sqlite3';
import { open, type Database } from "sqlite";
import constrant from "../common/constrant";

let db: Database;

const dbInit = async () => {
    let config = {
        filename: constrant.DB_NAME,
        driver: sqlite3.Database,
    }
    db = await open(config);
}

const dbClose = async () => {
    await db.close();
}

export const getDbConnect = async () => {
    if (db) {
        return db;
    } else {
        await dbInit();
        return db;
    }
}