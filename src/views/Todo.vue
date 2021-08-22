<template>
    <div>
        <h1>TDD todoリスト</h1>
        <Button
            label="ファイルを開く"
            class="p-mr-2 p-button p-component"
            @click="invokeFileOpenProcess()"
        />
        <Button
            label="ファイルを保存する"
            class="p-mr-2 p-button p-component"
            @click="invokeWriteMarkdownProcess()"
        />

        <div class="todo">
            <div class="todo-list">
                <p>todoリスト</p>
                <Tree
                    :value="convertedTodoList"
                    selectionMode="checkbox"
                    :selectionKeys.sync="selectedKeys"
                />
                {{ selectedKeys }}
                <ul class="unit-todo-list">
                    <li
                        v-for="(unitTodo, unitIndex) in todoList"
                        :key="unitIndex"
                    >
                        <i
                            v-if="unitTodo.unit.complete"
                            class="pi pi-check"
                        ></i>
                        <i v-else class="pi pi-times"></i>
                        <span>
                            {{ unitTodo.unit.title }}
                        </span>
                        <Button
                            label="削除"
                            class="p-button delete-button"
                            @click="deleteUnitTodo(unitIndex)"
                        />
                        <ul class="module-todo-list">
                            <li
                                v-for="(moduleTodo, moduleIndex) in unitTodo
                                    .unit.module"
                                :key="moduleIndex"
                            >
                                <i
                                    v-if="moduleTodo.complete"
                                    class="pi pi-check"
                                ></i>
                                <i v-else class="pi pi-times"></i>
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
                                <Button
                                    label="削除"
                                    class="p-button delete-button"
                                    @click="
                                        deleteModuleTodo(unitIndex, moduleIndex)
                                    "
                                />
                            </li>
                        </ul>
                    </li>
                </ul>
                <div class="separator"></div>
                <div>
                    <p>ユニットtodoを追加する</p>
                    <InputText
                        class="p-inputtext p-component"
                        type="text"
                        v-model="newUnitTodoTitle"
                        id="new-unit-todo-title"
                    />
                    <Button
                        class="p-button"
                        @click="addUnitTodo()"
                        id="add-unit-todo"
                    >
                        ユニットtodoを追加する
                    </Button>
                    <pre>
                        <code>
{{ publishUnitTodoTestCode(newUnitTodoTitle) }}
                        </code>
                    </pre>
                </div>
                <div>
                    <p>モジュールtodoを追加する</p>
                    <Dropdown
                        v-model="unitTodoIndex"
                        :options="getUnitTodoList"
                        optionLabel="title"
                        optionValue="index"
                    />
                    <div>
                        <span>∟</span>
                        <InputText
                            class="p-inputtext p-component"
                            type="text"
                            v-model="newModuleTodoTitle"
                            id="new-module-todo-title"
                        />
                        <Button
                            class="p-button"
                            @click="addModuleTodo()"
                            id="add-module-todo"
                        >
                            モジュールtodoを追加する
                        </Button>
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
                <Button class="p-button" @click="copyToClipboard()">
                    <i class="pi pi-copy"></i>
                </Button>
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
            selectedKeys: [],
            convertedTodoList: [],
        };
    },
    computed: {
        getUnitTodoList: function () {
            if (this.todoList.length === 0) {
                return [{ title: '', index: 0 }];
            }
            return this.todoList.map((todo, index) => {
                return { title: todo.unit.title, index: index };
            });
        },
    },
    methods: {
        convertedPrimeTreeFormatTodo: function () {
            this.convertedTodoList = this.todoList.map((todo, index) => {
                const arrayIndex = index;
                return {
                    key: index + '',
                    label: todo.unit.title,
                    icon: 'pi pi-fw pi-inbox',
                    complete: todo.unit.complete,
                    children: todo.unit.module.map((module, index) => {
                        return {
                            key: arrayIndex + '-' + index,
                            label: module.title,
                            icon: 'pi pi-fw pi-cog',
                            complete: module.complete,
                        };
                    }),
                };
            });
        },
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
            return `test('${moduleTodoTitle}', () => {\r\n    // 準備\r\n    // 実行\r\n    // 検証\r\n    expect(false).toBeTruthy();\r\n});`;
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
    watch: {
        todoList: function () {
            this.convertedPrimeTreeFormatTodo();
        },
        convertedTodoList: function () {
            this.convertedTodoList.forEach((todo) => {
                todo.children.forEach((children) => {
                    if (children.complete) {
                        this.selectedKeys[children.key] = { checked: true };
                    }
                });
                if (todo.complete) {
                    this.selectedKeys[todo.key] = {
                        checked: true,
                    };
                }
            });
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

.pi-times {
    color: red;
}

.pi-check {
    color: lightgreen;
}

.module-todo {
    cursor: pointer;
}

.separator {
    border: lightgray dashed 2px;
}

.delete-button {
    float: right;
}
</style>
