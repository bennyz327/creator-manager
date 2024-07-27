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
const constrant_1 = __importDefault(require("../constrant"));
const query = `
SELECT 
    ci.creator_id,
    ci.display_name,
    ci.scoped_id,
    ci.scoped_name,
    c.start_at,
    c.end_at
FROM 
    creator_identities ci
JOIN 
    creators c
ON 
    ci.creator_id = c.id;
`;
const refreshList = () => __awaiter(void 0, void 0, void 0, function* () {
    const db = yield (0, sqlite_1.open)({
        filename: constrant_1.default.DB_NAME,
        driver: sqlite3_1.default.Database
    });
    const rows = yield db.all(query);
    const aggregatedData = {};
    rows.forEach(row => {
        const { creator_id, display_name, scoped_id, scoped_name, start_at, end_at } = row;
        const key = `${creator_id}_${start_at}_${end_at}`;
        if (!aggregatedData[key]) {
            aggregatedData[key] = {
                creator_id,
                start_at,
                end_at,
                scoped: {}
            };
        }
        if (!aggregatedData[key].scoped[scoped_name]) {
            aggregatedData[key].scoped[scoped_name] = {
                scoped_id,
                display_names: []
            };
        }
        aggregatedData[key].scoped[scoped_name].display_names.push(display_name);
    });
    const result = [];
    const allColumns = new Set(['creator_id', 'start_at', 'end_at']);
    for (const key in aggregatedData) {
        const { creator_id, start_at, end_at, scoped } = aggregatedData[key];
        const row = {
            creator_id,
            start_at,
            end_at
        };
        for (const scoped_name in scoped) {
            let scoped_id_column_name = `${scoped_name}_id`;
            let scoped_name_column_name = `${scoped_name}_name`;
            const { scoped_id, display_names } = scoped[scoped_name];
            row[scoped_id_column_name] = `${scoped_id}`;
            row[scoped_name_column_name] = `${display_names.join('\n')}`;
            allColumns.add(scoped_id_column_name);
            allColumns.add(scoped_name_column_name);
        }
        result.push(row);
    }
    const allColumnsArray = Array.from(allColumns);
    //重新創建VIEW
    const cleanViewSQL = `
    DROP VIEW IF EXISTS creator_details;
    `;
    yield db.exec(cleanViewSQL);
    const createViewSQL = `
    CREATE VIEW IF NOT EXISTS creator_details AS
    SELECT 
        ${allColumnsArray.map(col => `json_extract(value, '$.${col}') AS ${col}`).join(', ')}
    FROM 
        json_each('[${result.map(row => JSON.stringify(row)).join(',')}]');
    `;
    yield db.exec(createViewSQL);
    yield db.close();
    return;
});
exports.default = refreshList;
//# sourceMappingURL=refresh-creator-list-view.js.map