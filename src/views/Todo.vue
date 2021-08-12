<template>
    <div>
        <h1>TDD todoリスト</h1>
        <button @click="invokeFileOpenProcess()">ファイルを開く</button>
        <button @click="invokeWriteMarkdownProcess()">
            ファイルを保存する
        </button>
        <div class="todo">
            <div class="todo-list">
                <p>todoリスト</p>
                <ul class="unit-todo-list">
                    <li
                        v-for="(unitTodo, unitIndex) in todoList"
                        :key="unitIndex"
                    >
                        <i
                            v-if="unitTodo.unit.complete"
                            class="fas fa-check"
                        ></i>
                        <i v-else class="fas fa-times"></i>
                        {{ unitTodo.unit.title }}
                        <button @click="deleteUnitTodo(unitIndex)">
                            このユニットtodoを削除する
                        </button>
                        <ul class="module-todo-list">
                            <li
                                v-for="(moduleTodo, moduleIndex) in unitTodo
                                    .unit.module"
                                :key="moduleIndex"
                            >
                                <i
                                    v-if="moduleTodo.complete"
                                    class="fas fa-check"
                                ></i>
                                <i v-else class="fas fa-times"></i>
                                <span
                                    @click="
                                        toggleModuleStatus(
                                            unitIndex,
                                            moduleIndex
                                        ),
                                            checkUnitStatus(unitIndex)
                                    "
                                    class="module-todo"
                                    :id="
                                        'module-todo-' +
                                        unitIndex +
                                        '-' +
                                        moduleIndex
                                    "
                                    >{{ moduleTodo.title }}</span
                                >
                                <button
                                    @click="
                                        deleteModuleTodo(unitIndex, moduleIndex)
                                    "
                                >
                                    このモジュールtodoを削除する
                                </button>
                            </li>
                        </ul>
                    </li>
                </ul>
                <div class="separator"></div>
                <div>
                    <p>ユニットtodoを追加する</p>
                    <input
                        type="text"
                        v-model="newUnitTodoTitle"
                        id="new-unit-todo-title"
                    />
                    <button @click="addUnitTodo()" id="add-unit-todo">
                        ユニットtodoを追加する
                    </button>
                    <pre>
                        <code>
{{ publishUnitTodoTestCode(newUnitTodoTitle) }}
                        </code>
                    </pre>
                </div>
                <div>
                    <p>モジュールtodoを追加する</p>
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
                        <pre>
                        <code>
{{ publishModuleTodoTestCode(newModuleTodoTitle) }}
                        </code>
                    </pre>
                    </div>
                </div>
            </div>
            <div class="todo-markdown">
                <span>Markdown プレビュー</span>
                <button @click="copyToClipboard()">
                    <i class="fas fa-copy"></i>
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
import { ipcRenderer } from 'electron';

export default {
    name: 'Todo',
    data: function () {
        return {
            todoList: [],
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
        deleteUnitTodo: function (unitTodoIndex) {
            this.todoList.splice(unitTodoIndex, 1);
        },
        deleteModuleTodo: function (unitTodoIndex, moduleTodoIndex) {
            this.todoList[unitTodoIndex].unit.module.splice(moduleTodoIndex, 1);
        },
        checkUnitStatus: function (unitIndex) {
            const moduleLength = this.todoList[unitIndex].unit.module.length;
            if (moduleLength === 0) {
                this.todoList[unitIndex].unit.complete = false;
            }
            const completeLength = this.todoList[unitIndex].unit.module.filter(
                (module) => module.complete === true
            ).length;

            if (moduleLength === completeLength) {
                this.todoList[unitIndex].unit.complete = true;
            } else {
                this.todoList[unitIndex].unit.complete = false;
            }
        },
        publishUnitTodoTestCode: function (unitTodoTitle) {
            return `describe('${unitTodoTitle}', () => {\r\n    \r\n});\r\n`;
        },
        publishModuleTodoTestCode: function (moduleTodoTitle) {
            return `test('${moduleTodoTitle}', () => {\r\n    // 準備\r\n    // 実行\r\n    // 検証\r\n    expect(true).toBeTruthy();\r\n});`;
        },
        invokeFileOpenProcess: function () {
            ipcRenderer.invoke('file-open').then((data) => {
                if (data.status) this.importData(data.text);
            });
        },
        importData: function (markdownText) {
            this.todoList = this.readMarkdown(markdownText);
        },
        invokeWriteMarkdownProcess: function () {
            const str = this.getTodoMarkdown();
            ipcRenderer.invoke('write-file', str).then((data) => {
                console.log(data);
            });
        },
        readMarkdown: function (markdown) {
            const strList = markdown.split('\r\n');
            const todo = [];
            const inCompleteUnitReg = new RegExp(/^(\- \[ \] )/);
            const completeUnitReg = new RegExp(/^(\- \[x\] )/);
            const inCompleteModuleReg = new RegExp(/(  )+(\- \[ \] )/);
            const completeModuleReg = new RegExp(/(  )+(\- \[x\] )/);
            strList.forEach((str) => {
                if (inCompleteUnitReg.test(str)) {
                    todo.push({
                        unit: {
                            title: str.replace(inCompleteUnitReg, ''),
                            complete: false,
                            module: [],
                        },
                    });
                } else if (completeUnitReg.test(str)) {
                    todo.push({
                        unit: {
                            title: str.replace(completeUnitReg, ''),
                            complete: true,
                            module: [],
                        },
                    });
                } else if (inCompleteModuleReg.test(str)) {
                    todo[todo.length - 1].unit.module.push({
                        title: str.replace(inCompleteModuleReg, ''),
                        complete: false,
                    });
                } else if (completeModuleReg.test(str)) {
                    todo[todo.length - 1].unit.module.push({
                        title: str.replace(completeModuleReg, ''),
                        complete: true,
                    });
                }
            });
            return todo;
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

.fas {
    height: 16px;
    min-width: 16px;
}

.todo {
    display: grid;
    grid-template-columns: 10% 80% 10%;
}

.todo-list {
    grid-row: 1/2;
    text-align: left;
    grid-column: 2/3;
}

.todo-markdown {
    grid-column: 2/3;
    margin-top: 5%;
}

.fa-times {
    color: red;
}

.fa-check {
    color: lightgreen;
}

.module-todo {
    cursor: pointer;
}

.separator {
    border: lightgray dashed 2px;
}
</style>
