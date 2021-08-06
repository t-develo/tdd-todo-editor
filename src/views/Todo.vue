<template>
    <div class="todo">
        <h1>TDD todoリスト</h1>
        <div>
            <ul class="unit-todo-list">
                <li v-for="unitTodo in todoList" :key="unitTodo.unit.title">
                    {{ unitTodo.unit.title }}
                    <ul class="module-todo-list">
                        <li
                            v-for="moduleTodo in unitTodo.unit.module"
                            :key="moduleTodo.title"
                        >
                            {{ moduleTodo.title }}
                        </li>
                    </ul>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Todo',
    data: function () {
        return {
            todoList: [
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
            ],
        };
    },
};
</script>
