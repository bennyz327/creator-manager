import { select } from "@inquirer/prompts";

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const showEndSelection = async () => {
    const answer = await select({
        message: '請選擇操作',
        choices: [
            {
                name: '返回主選單',
                value: 'goBackMenu',
            },
            {
                name: '退出創作者管理員',
                value: 'exit',
            }
        ],
    })
    switch (answer) {
        
        case 'goBackMenu':
            break

        case 'exit':
            process.exit(0)
        
        default:
            break
    }
}