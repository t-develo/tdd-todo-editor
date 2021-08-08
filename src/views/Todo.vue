<template>
    <div>
        <h1>TDD todoリスト</h1>
        <div class="todo">
            <div class="todo-list">
                <ul class="unit-todo-list">
                    <li
                        v-for="(unitTodo, unitIndex) in todoList"
                        :key="unitTodo.unit.title"
                    >
                        <input
                            type="checkbox"
                            v-model="unitTodo.unit.complete"
                            @click="toggleUnitStatus(unitIndex)"
                            :id="'unit-todo-' + unitIndex"
                        />
                        <label :for="'unit-todo-' + unitIndex">{{
                            unitTodo.unit.title
                        }}</label>
                        <ul class="module-todo-list">
                            <li
                                v-for="(moduleTodo, moduleIndex) in unitTodo
                                    .unit.module"
                                :key="moduleTodo.title"
                            >
                                <input
                                    type="checkbox"
                                    v-model="moduleTodo.complete"
                                    @click="
                                        toggleModuleStatus(
                                            unitIndex,
                                            moduleIndex
                                        )
                                    "
                                    :id="
                                        'module-todo-' +
                                        unitIndex +
                                        '-' +
                                        moduleIndex
                                    "
                                />
                                <label
                                    :for="
                                        'module-todo-' +
                                        unitIndex +
                                        '-' +
                                        moduleIndex
                                    "
                                >
                                    {{ moduleTodo.title }}
                                </label>
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
            <div class="todo-markdown">
                <pre>
                <code>
{{ getTodoMarkdown() }}
                </code>
            </pre>
            </div>
        </div>
    </div>
</template>

<script>
import { todoList } from 'components/TodoList.js';

export default {
    name: 'Todo',
    data: function () {
        return {
            todoList: todoList,
        };
    },
    methods: {
        toggleUnitStatus: function (unitIndex) {
            this.todoList[unitIndex].unit.complete =
                !this.todoList[unitIndex].unit.complete;
        },
        toggleModuleStatus: function (unitIndex, moduleIndex) {
            this.todoList[unitIndex].unit.module[moduleIndex].complete =
                !this.todoList[unitIndex].unit.module[moduleIndex].complete;
        },
        getTodoMarkdown: function () {
            const header = '# todo list\r\n\r\n';
            const brankCheck = '- [ ] ';
            const checked = '- [x] ';
            const moduleIndent = '  ';
            const markdownText = this.todoList.map((todo) => {
                const moduleTodoList = todo.unit.module.map((module) => {
                    if (module.complete) {
                        return moduleIndent + checked + module.title + '\r\n';
                    }
                    return moduleIndent + brankCheck + module.title + '\r\n';
                });
                const context =
                    todo.unit.title + '\r\n' + moduleTodoList.join('');
                if (todo.unit.complete) {
                    return checked + context;
                }
                return brankCheck + context;
            });
            return header + markdownText.join('\r\n');
        },
    },
};
</script>

<style>
pre {
    background-color: lightgray;
    font-weight: bold;
    text-align: left;
}

ul,
li {
    list-style: none;
}

.todo {
    display: grid;
    grid-template-columns: 20%;
}

.todo-list {
    text-align: left;
    grid-column: 2/3;
}

.todo-markdown {
    grid-column: 2/3;
}
</style>
