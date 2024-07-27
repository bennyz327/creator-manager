import { select } from '@inquirer/prompts';
import refreshList from './script/refresh-creator-list-view';
import { sleep } from './utils';
import browseData from './script/browse-data';

const menu = async () => {
    const question = {
        type: 'list',
        name: 'action',
        message: 'Choose an action:',
        choices: [
            { name: '刷新創作者列表', value: 'rebuild' },
            { name: '瀏覽資料庫 (DEBUG)', value: 'browse' },
            { name: '退出', value: 'exit' }
        ]
    };

    const answers = await select(question);

    if (answers === 'rebuild') {
        console.log('重建中...');
        await refreshList();
        await sleep(1);
        console.log('重建成功');
    } else if (answers === 'browse') {
        await browseData();
        await sleep(1);
    } else if (answers === 'exit') {
        console.log('退出成功');
        process.exit(0);
    }
};

(async () => {
    while (true) {
        await menu();
    }
})();
