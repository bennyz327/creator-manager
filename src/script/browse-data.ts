import { type Database } from 'sqlite';
import { select } from '@inquirer/prompts';
import { printTable } from 'console-table-printer';
import { getDbConnect } from './connect';
import constrant from '../common/constrant';
import { showEndSelection } from '../common/utils';

const listTables = async (db: Database) => {
    const query = "SELECT name FROM sqlite_master WHERE type='table'";
    const tables = await db.all<{name: string}[]>(query);
    return tables.map((table) => {
        return {
            name: table.name,
            value: table.name,
            description: `View ${table.name}`
        }
    });
};

const viewTableData = async (db: Database, tableName: string) => {
    let offset = 0;
    let hasNextPage = true;

    while (hasNextPage) {
        hasNextPage = false
        const query = `SELECT * FROM ${tableName} LIMIT ${constrant.DB_PAGE_SIZE} OFFSET ${offset}`;
        const rows = await db.all(query);

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
};

const viewCreatorData = async (db: Database) => {
    let offset = 0;
    let hasNextPage = true;

    while (hasNextPage) {
        hasNextPage = false
        const query = `SELECT * FROM creator_details LIMIT ${constrant.DB_PAGE_SIZE} OFFSET ${offset}`;
        const rows = await db.all(query);

        printTable(rows);

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
};

export const browseData = async () => {
    let db = await getDbConnect();

    const choices = await listTables(db);
    choices.push({
        name: 'creator_list',
        value: 'creator_details',
        description: 'View lsit'
    })

    const tableChoice = await select({
        message: 'Choose a table to view:',
        choices,
    })

    if (tableChoice === 'creator_details') {
        await viewCreatorData(db);
    } else {
        await viewTableData(db, tableChoice);
    }
    await showEndSelection();
}

export const browseCreatorList = async () => {
    let db = await getDbConnect()
    await viewCreatorData(db)
    await showEndSelection()
}