import { shallowMount } from '@vue/test-utils';
import { expect } from '@jest/globals';
import Home from '@/views/Home.vue';

describe('Home.vue', () => {
    test('Mount Instance', () => {
        const wrapper = shallowMount(Home);
        expect(wrapper.vm).toBeTruthy();
    });
});
