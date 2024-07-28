import { select } from '@inquirer/prompts';
import refreshList from './script/refresh-creator-list-view';
import { browseData, browseCreatorList } from './script/browse-data';
import { closeDbConnect } from './script/connect';
import searchCreatorAndShow from './script/search-creator';
import addNewIdentity from './script/post-creator-identify';

// fix ES2022 method not found
if (!Array.prototype.findLastIndex) {
    Array.prototype.findLastIndex = function<T>(predicate: (value: T, index: number, obj: T[]) => unknown, thisArg?: any): number {
      for (let i = this.length - 1; i >= 0; i--) {
        if (predicate.call(thisArg, this[i], i, this)) {
          return i;
        }
      }
      return -1;
    };
  }

type MenuChoices = {
    name: string;
    value:    'searchCreator'
            | 'createNewIdentity'
            | 'browseCreatorList'
            | 'browseDb'
            | 'rebuild'
            | 'exit'
}

const menu = async () => {

    let choices: MenuChoices[] = [
        { name: '瀏覽創作者列表', value: 'browseCreatorList'},
        { name: '搜尋創作者', value: 'searchCreator'},
        { name: '新增創作者身份', value: 'createNewIdentity'},
        { name: '瀏覽資料庫 (DEBUG)', value: 'browseDb' },
        { name: '刷新創作者列表 (DEBUG)', value: 'rebuild' },
        { name: '退出創作者管理員', value: 'exit' }
    ]

    const question = {
        type: 'list',
        name: 'action',
        message: '創作者管理員 v1.0.0\n請選擇操作',
        choices,
    };

    const answer = await select(question);

    switch (answer) {

        case 'searchCreator':
            await searchCreatorAndShow();
            break;

        case 'createNewIdentity':
            await addNewIdentity();
            break;

        case 'browseCreatorList':
            await browseCreatorList();
            break;

        case 'browseDb':
            await browseData();
            break;

        case 'rebuild':
            console.log('重建中...');
            await refreshList();
            console.log('重建成功');
            break;

        case 'exit':
            await closeDbConnect();
            console.log("退出完成");
            process.exit(0);

        default:
            console.log('無效選項');
    }
};

(async () => {
    try {
        while (true) {
            process.stdout.write('\x1Bc')
            await menu();
        }
    } catch (error) {
        console.log('發生錯誤');
        console.log(error);
        await closeDbConnect();
        process.exit(1);
    }
})();
