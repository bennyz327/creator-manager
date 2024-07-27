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
const prompts_1 = require("@inquirer/prompts");
const refresh_creator_list_view_1 = __importDefault(require("./script/refresh-creator-list-view"));
const utils_1 = require("./utils");
const browse_data_1 = __importDefault(require("./script/browse-data"));
const menu = () => __awaiter(void 0, void 0, void 0, function* () {
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
    const answers = yield (0, prompts_1.select)(question);
    if (answers === 'rebuild') {
        console.log('重建中...');
        yield (0, refresh_creator_list_view_1.default)();
        yield (0, utils_1.sleep)(1);
        console.log('重建成功');
    }
    else if (answers === 'browse') {
        yield (0, browse_data_1.default)();
        yield (0, utils_1.sleep)(1);
    }
    else if (answers === 'exit') {
        console.log('退出成功');
        process.exit(0);
    }
});
(() => __awaiter(void 0, void 0, void 0, function* () {
    while (true) {
        yield menu();
    }
}))();
//# sourceMappingURL=index.js.map