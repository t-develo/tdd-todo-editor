import { shallowMount } from '@vue/test-utils';
import { expect } from '@jest/globals';
import Todo from 'views/Todo.vue';

describe('Todo.vue', () => {
    test('Mount Instance', () => {
        const wrapper = shallowMount(Todo);
        expect(wrapper.vm).toBeTruthy();
    });
});

describe('todoの表示', () => {
    test('todoが列挙できる', () => {
        // 準備
        const wrapper = shallowMount(Todo);

        // 実行
        const todoList = wrapper.find('li');

        // 検証
        expect(todoList).not.toBeNull();
    });
    test('todoが大項目と中項目にレベル分け出来る', () => {
        // 準備
        const wrapper = shallowMount(Todo);
        const todo = [
            {
                unit: {
                    title: 'todoの表示',
                    module: [
                        {
                            title: 'todoが列挙できる',
                            status: 'complete',
                        },
                        {
                            title: ' 大項目と中項目にレベル分け出来る',
                            status: 'incomplete',
                        },
                    ],
                },
            },
            {
                unit: {
                    title: ' ToDoの管理',
                    module: [
                        {
                            title: 'チェックの付け外し',
                            status: 'incomplete',
                        },
                        {
                            title: ' 状態のをMarkdownフォーマットにして表示出来る',
                            status: 'incomplete',
                        },
                    ],
                },
            },
        ];
        // 実行
        const todoList = wrapper.vm.todoList;

        // 検証
        expect(todoList).toStrictEqual(todo);
    });
});
