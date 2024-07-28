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

export const closeDbConnect = async () => {
    if (db) {
        console.log('資料庫關閉中');
        await db.close();
        console.log('資料庫關閉完成');
    }
}

export const getDbConnect = async () => {
    if (db) {
        return db;
    } else {
        await dbInit();
        return db;
    }
}