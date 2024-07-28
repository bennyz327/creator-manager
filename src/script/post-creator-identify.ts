/*
> 查詢作者 > 查到 > 新增身分
> 查詢作者 > 查不到 > 是否新增身分 > 新稱作者 > 新增身分
*/

import { input, select } from "@inquirer/prompts"
import { getCreatorByInput } from "./search-creator"
import { getDbConnect } from "./connect"
import refreshList from "./refresh-creator-list-view"

const addNewIdentity = async () => {
    const searchResult = await getCreatorByInput()
    let creatorId: number
    if (searchResult.length != 1) {
        const answer = await select({
            message: '查詢失敗，是否要視為全新的創作者?',
            choices: [
                {
                    name: '好',
                    value: true,
                },
                {
                    name: '取消新增',
                    value: false,
                }
            ],
        })
        // 資料庫新增 creator 資料並傳回 id 設定到 creatorId 上
    } else {

        creatorId = searchResult[0].creator_id

        const insertCreatorIdentitiesQuery = `
        INSERT INTO creator_identities (creator_id, display_name, scoped_id, scoped_name)
        VALUES (?, ?, ?, ?);
        `

        const newDisplayName = await input({
            message: '請輸入該創作者新身份的名稱',
            required: true,
        })

        // 要改用選的 並要避免新增同網站且同ID的身份
        const newScopedName = await input({
            message: '新身份用於哪個網站?',
            required: true,
        })

        const newScopedId = await input({
            message: '新身份在網站上唯一ID是?',
            required: true,
        })

        await getDbConnect()
        try {
            await (await getDbConnect()).run(insertCreatorIdentitiesQuery, creatorId, newDisplayName, newScopedId, newScopedName)
            console.log('新身份已成功新增')
        } catch (error) {
            console.log(error)
            if (error && error.code === 'SQLITE_CONSTRAINT') {
                console.log('身份重複新增，不做任何更動')
            } else {
                console.log(error)
            }
        }
        await refreshList()
        
    }
}

export default addNewIdentity