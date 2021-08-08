<template>
    <div>
        <h1>TDD todoリスト</h1>
        <div class="todo">
            <div class="todo-list">
                <ul class="unit-todo-list">
                    <li
                        v-for="(unitTodo, unitIndex) in todoList"
                        :key="unitIndex"
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
                                :key="moduleIndex"
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
                <div>
                    <input
                        type="text"
                        v-model="newUnitTodoTitle"
                        id="new-unit-todo-title"
                    />
                    <button @click="addUnitTodo()" id="add-unit-todo">
                        ユニットtodoを追加する
                    </button>
                </div>
                <div>
                    <select v-model="unitTodoIndex">
                        モジュールtodoを追加するユニットtodoを選択する
                        <option
                            v-for="(unitTodo, index) in getUnitTodoList"
                            :key="index"
                            :value="index"
                        >
                            {{ unitTodo }}
                        </option>
                    </select>
                    <div>
                        <span>∟</span>
                        <input
                            type="text"
                            v-model="newModuleTodoTitle"
                            id="new-module-todo-title"
                        />
                        <button @click="addModuleTodo()" id="add-module-todo">
                            モジュールtodoを追加する
                        </button>
                    </div>
                </div>
            </div>
            <div class="todo-markdown">
                <p>Markdown プレビュー</p>
                <button @click="copyToClipboard()">
                    <i class="fas fa-clipboard"></i>
                </button>
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
            newUnitTodoTitle: '',
            newModuleTodoTitle: '',
            unitTodoIndex: null,
        };
    },
    computed: {
        getUnitTodoList: function () {
            return this.todoList.map((todo) => {
                return todo.unit.title;
            });
        },
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
        addUnitTodo: function () {
            const newUnitTodo = {
                unit: {
                    title: this.newUnitTodoTitle,
                    complete: false,
                    module: [],
                },
            };
            this.todoList.push(newUnitTodo);
        },
        addModuleTodo: function () {
            const newModuleTodo = {
                title: this.newModuleTodoTitle,
                complete: false,
            };
            this.todoList[this.unitTodoIndex].unit.module.push(newModuleTodo);
        },
        copyToClipboard: function () {
            const str = this.getTodoMarkdown();
            if (navigator.clipboard) {
                navigator.clipboard.writeText(str);
            }
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
