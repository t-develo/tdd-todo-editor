import { shallowMount } from '@vue/test-utils';
import { expect } from '@jest/globals';
import Todo from 'views/Todo.vue';

let wrapper = null;
const mockTodoList = [
    {
        unit: {
            title: 'テストToDoの表示',
            complete: false,
            module: [
                {
                    title: 'todoが列挙できる',
                    complete: true,
                },
                {
                    title: '大項目と中項目にレベル分け出来る',
                    complete: false,
                },
            ],
        },
    },
];

// 各テスト実行前に実行されるセットアップ
beforeEach(() => {
    wrapper = shallowMount(Todo, {
        data: function () {
            return {
                todoList: JSON.parse(JSON.stringify(mockTodoList)),
            };
        },
    });
});

describe('Todo.vue', () => {
    test('Mount Instance', () => {
        expect(wrapper.vm).toBeTruthy();
    });
});

describe('todoの表示', () => {
    test('todoが列挙できる', () => {
        // 準備
        // 実行
        const todoList = wrapper.find('li');

        // 検証
        expect(todoList).not.toBeNull();
    });
    test('todoが大項目と中項目にレベル分け出来る', () => {
        // 準備
        // 実行
        const unitTodo = wrapper.find('#unit-todo-0');
        const moduleTodo = wrapper.find('#module-todo-0-1');

        // 検証
        expect(unitTodo).not.toBeNull();
        expect(moduleTodo).not.toBeNull();
    });
});

describe('ToDoの管理', () => {
    test('モジュールのチェックの付け外しができる', async () => {
        // 準備
        // 実行
        await wrapper.find('#module-todo-0-1').trigger('click');

        // 検証
        expect(wrapper.vm.todoList[0].unit.module[1].complete).toBeTruthy();
    });
    test('状態のをMarkdownフォーマットにして表示出来る', async () => {
        // 準備
        // 実行
        const todoMarkdown = await wrapper.vm.getTodoMarkdown();

        // 検証
        expect(todoMarkdown).toBe(
            '# todo list\r\n\r\n- [ ] テストToDoの表示\r\n  - [x] todoが列挙できる\r\n  - [ ] 大項目と中項目にレベル分け出来る\r\n'
        );
    });
    test('ユニットのtodoを画面から追加できる', async () => {
        // 準備
        wrapper.vm.newUnitTodoTitle = 'ユニットtodoの追加';

        // 実行
        await wrapper.find('#add-unit-todo').trigger('click');

        // 検証
        expect(wrapper.vm.todoList[1].unit.title).toBe('ユニットtodoの追加');
        expect(wrapper.vm.todoList[1].unit.complete).toBeFalsy();
    });
    test('モジュールのtodoを画面から追加できる', () => {
        // 準備
        wrapper.vm.unitTodoIndex = 0;
        wrapper.vm.newModuleTodoTitle = 'モジュールtodoの追加';

        // 実行
        wrapper.vm.addModuleTodo();

        // 検証
        expect(wrapper.vm.todoList[0].unit.module[2].title).toBe(
            'モジュールtodoの追加'
        );
    });
    test('選択したユニットのtodoを画面から削除できる', () => {
        // 準備
        const beforeAction = wrapper.vm.todoList.length;

        // 実行
        wrapper.vm.deleteUnitTodo(0);

        // 検証
        expect(wrapper.vm.todoList.length).toBe(beforeAction - 1);
    });
    test('選択したモジュールのtodoを画面から削除できる', () => {
        // 準備
        const beforeAction = wrapper.vm.todoList[0].unit.module.length;

        // 実行
        wrapper.vm.deleteModuleTodo(0, 0);

        // 検証
        expect(wrapper.vm.todoList[0].unit.module.length).toBe(
            beforeAction - 1
        );
    });
    test('モジュールtodoがすべてチェックされたら自動でユニットtodoがチェックされる', () => {
        // 準備
        // 実行
        wrapper.vm.todoList[0].unit.module[0].complete = true;
        wrapper.vm.todoList[0].unit.module[1].complete = true;
        wrapper.vm.checkUnitStatus(0);

        // 検証
        expect(wrapper.vm.todoList[0].unit.complete).toBeTruthy();
    });
});

describe('テスト駆動をサポートする', () => {
    test('大項目を作った時にテンプレのテストコードを発行する(jest)', () => {
        // 準備
        const newUnitTodo = '新しいユニットtodo';

        // 実行
        const publishUnitTestCode =
            wrapper.vm.publishUnitTodoTestCode(newUnitTodo);

        // 検証
        expect(publishUnitTestCode).toBe(
            `describe('${newUnitTodo}', () => {\r\n    \r\n});\r\n`
        );
    });
    test('中項目を作った時に必ず結果がTRUEとなるような非同期なセットアップテストコードを発行する(jest)', () => {
        // 準備
        const newModuleTodo = '新しいモジュールtodo';

        // 実行
        const publishModuleTestCode =
            wrapper.vm.publishModuleTodoTestCode(newModuleTodo);

        // 検証
        expect(publishModuleTestCode).toBe(
            `test('${newModuleTodo}', () => {\r\n    // 準備\r\n    // 実行\r\n    // 検証\r\n    expect(true).toBeTruthy();\r\n});`
        );
    });
});

describe('結果の保存と読み込み(electron)', () => {
    test('json形式のtodoを読み込んで表示する', () => {
        // 準備
        const testJsonData = JSON.parse(JSON.stringify(mockTodoList));

        // 実行
        wrapper.vm.importData(testJsonData);

        // 検証
        expect(wrapper.vm.todoList).toEqual(testJsonData);
    });
});
