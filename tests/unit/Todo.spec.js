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
                todoList: mockTodoList,
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
    test('ユニットのチェックの付け外しができる', async () => {
        // 準備
        // 実行
        await wrapper.find('#unit-todo-0').trigger('click');

        // 検証
        expect(wrapper.vm.todoList[0].unit.complete).toBeTruthy();
    });
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
            '# todo list\r\n\r\n- [x] テストToDoの表示\r\n  - [x] todoが列挙できる\r\n  - [x] 大項目と中項目にレベル分け出来る\r\n'
        );
    });
});
