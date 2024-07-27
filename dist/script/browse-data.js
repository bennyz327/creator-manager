"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sqlite3_1 = __importDefault(require("sqlite3"));
const sqlite_1 = require("sqlite");
const prompts_1 = require("@inquirer/prompts");
const constrant_1 = __importDefault(require("../constrant"));
const console_table_printer_1 = require("console-table-printer");
const dbPromise = (0, sqlite_1.open)({
    filename: constrant_1.default.DB_NAME,
    driver: sqlite3_1.default.Database
});
const pageSize = 10;
const listTables = (db) => __awaiter(void 0, void 0, void 0, function* () {
    const query = "SELECT name FROM sqlite_master WHERE type='table'";
    const tables = yield db.all(query);
    return tables.map((table) => {
        return {
            name: table.name,
            value: table.name,
            description: `View ${table.name}`
        };
    });
});
const viewTableData = (db, tableName) => __awaiter(void 0, void 0, void 0, function* () {
    let offset = 0;
    let hasNextPage = true;
    while (hasNextPage) {
        const query = `SELECT * FROM ${tableName} LIMIT ${pageSize} OFFSET ${offset}`;
        const rows = yield db.all(query);
        console.table(rows);
        // const choices = ['Next Page', 'Previous Page', 'Exit'];
        // const questions = [
        //     {
        //         type: 'list',
        //         name: 'action',
        //         message: 'Choose an action:',
        //         choices: choices
        //     }
        // ];
        // const answers = await inquirer.prompt(questions);
        // if (answers.action === 'Next Page') {
        //     offset += pageSize;
        // } else if (answers.action === 'Previous Page' && offset > 0) {
        //     offset -= pageSize;
        // } else {
        //     hasNextPage = false;
        // }
    }
});
const viewCreatorData = (db) => __awaiter(void 0, void 0, void 0, function* () {
    let offset = 0;
    let hasNextPage = true;
    while (hasNextPage) {
        hasNextPage = false;
        const query = `SELECT * FROM creator_details LIMIT ${pageSize} OFFSET ${offset}`;
        const rows = yield db.all(query);
        (0, console_table_printer_1.printTable)(rows);
        // const choices = ['Next Page', 'Previous Page', 'Exit'];
        // const answers = await inquirer.prompt([
        //     {
        //         type: 'list',
        //         name: 'action',
        //         message: 'Choose an action:',
        //         choices: choices
        //     }
        // ]);
        // if (answers.action === 'Next Page') {
        //     offset += pageSize;
        // } else if (answers.action === 'Previous Page' && offset > 0) {
        //     offset -= pageSize;
        // } else {
        //     hasNextPage = false;
        // }
    }
});
const browseData = () => __awaiter(void 0, void 0, void 0, function* () {
    const db = yield dbPromise;
    const choices = yield listTables(db);
    choices.push({
        name: 'creator_list',
        value: 'creator_details',
        description: 'View lsit'
    });
    const tableChoice = yield (0, prompts_1.select)({
        message: 'Choose a table to view:',
        choices,
    });
    if (tableChoice === 'creator_details') {
        yield viewCreatorData(db);
    }
    else {
        yield viewTableData(db, tableChoice);
    }
    yield db.close();
});
exports.default = browseData;
//# sourceMappingURL=browse-data.js.map