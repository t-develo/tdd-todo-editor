import { shallowMount } from '@vue/test-utils';
import { expect } from '@jest/globals';
import Todo from 'views/Todo.vue';

describe('Todo.vue', () => {
    test('Mount Instance', () => {
        const wrapper = shallowMount(Todo);
        expect(wrapper.vm).toBeTruthy();
    });
});
