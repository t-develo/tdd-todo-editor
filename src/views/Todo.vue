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
import { todoList } from 'components/TodoList.js';

export default {
    name: 'Todo',
    data: function () {
        return {
            todoList: todoList,
        };
    },
};
</script>
