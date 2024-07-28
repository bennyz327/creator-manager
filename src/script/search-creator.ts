import { input, select } from "@inquirer/prompts"
import { getDbConnect } from "./connect"
import { printTable } from "console-table-printer";
import { SCHEMA_creator_identities, SCHEMA_creators_list } from "./types";
import { showEndSelection } from "../common/utils";

/**
 * 由於 VIEW 是變動的，所以總欄位不固定，但是一定會有 SCHEMA_creators 內涵的屬性
 */
export const getCreatorByInput = async () => {

    let db = await getDbConnect();

    const keyword = await input({
        message: '請輸入關鍵字或ID',
        required: true,
        validate: (value) => {
            if (isNaN(Number(value)) && value.length < 3) {
                return '查詢名稱關鍵字過短'
            }
            return true
        }
    })

    const scopedIdQuery = `
    SELECT creator_id, display_name, scoped_id, scoped_name
    FROM creator_identities
    WHERE scoped_id = ?
    `

    const displayNameQuery = `
    SELECT creator_id, display_name, scoped_id, scoped_name
    FROM creator_identities
    WHERE display_name
    LIKE ?
    `

    let results: SCHEMA_creator_identities[] = await db.all(scopedIdQuery, keyword);

    if (results.length === 0) {
        results = await db.all(displayNameQuery, `%${keyword}%`);
    }

    type MergedResult = SCHEMA_creator_identities & { display_names: string[]}

    const mergedResults = results.reduce((acc, result) => {
        const key = `${result.scoped_id}_${result.scoped_name}`;
        if (!acc[key]) {
            acc[key] = {
                creator_id: result.creator_id,
                scoped_id: result.scoped_id,
                scoped_name: result.scoped_name,
                display_names: [result.display_name]
            };
        } else {
            acc[key].display_names.push(result.display_name);
        }
        return acc;
    }, {}) as MergedResult[];
    
    const choices = Object.values(mergedResults).map((result: MergedResult) => ({
        name: `scoped_id: ${result.scoped_id}, scoped_name: ${result.scoped_name}, display_names: (${result.display_names.join(', ')})`,
        value: {
            id: result.creator_id,
            scoped: result.scoped_name,
            scoped_id: result.scoped_id,
        }
    }));

    // 查到多個還沒測試
    let target: { id: number, scoped: string, scoped_id: number }[] = [];
    if (choices.length > 1) {
        const selected = await select({
            message: '找到多個結果，請選擇一個:',
            choices,
        })
        target.push(selected)
    } else if (choices.length == 1) {
        target.push(choices[0].value)
    }

    if (target.length == 1) {
        const creatorViewQuery =`
        SELECT *
        FROM creator_details
        WHERE creator_id = ?
        ` 
        const targetDetail = await db.all(creatorViewQuery, target[0].id)
        return targetDetail as SCHEMA_creators_list[]
    } else {
        return []
    }
}

const searchCreatorAndShow = async () => {
    const creatorDetail = await getCreatorByInput()
    if (creatorDetail.length > 0 ) {
        console.log(`你查詢的使用者資料如下:`)
        printTable(creatorDetail)
        await showEndSelection()
    } else {
        console.log('查無資料')
        await showEndSelection()
    }
}

export default searchCreatorAndShow