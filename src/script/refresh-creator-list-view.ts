import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import constrant from '../constrant';

export interface Row {
    creator_id: number;
    display_name: string;
    scoped_id: number;
    scoped_name: string;
    start_at: string;
    end_at: string;
}

export interface AggregatedData {
    creator_id: number;
    start_at: string;
    end_at: string;
    scoped: { [key: string]: { scoped_id: number, display_names: string[] } };
}

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

const refreshList = async () => {
    const db = await open({
        filename: constrant.DB_NAME,
        driver: sqlite3.Database
    });

    const rows: Row[] = await db.all(query);

    const aggregatedData: { [key: string]: AggregatedData } = {};

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

    const result: { [key: string]: string | number }[] = [];
    const allColumns: Set<string> = new Set(['creator_id', 'start_at', 'end_at']);
    
    for (const key in aggregatedData) {
        const { creator_id, start_at, end_at, scoped } = aggregatedData[key];
        const row: { [key: string]: string | number } = {
            creator_id,
            start_at,
            end_at
        };

        for (const scoped_name in scoped) {
            let scoped_id_column_name = `${scoped_name}_id`
            let scoped_name_column_name = `${scoped_name}_name`

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
    `
    await db.exec(cleanViewSQL);

    const createViewSQL = `
    CREATE VIEW IF NOT EXISTS creator_details AS
    SELECT 
        ${allColumnsArray.map(col => `json_extract(value, '$.${col}') AS ${col}`).join(', ')}
    FROM 
        json_each('[${result.map(row => JSON.stringify(row)).join(',')}]');
    `
    await db.exec(createViewSQL);
    await db.close();
    return
}

export default refreshList