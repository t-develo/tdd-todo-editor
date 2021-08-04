import { shallowMount, mount } from '@vue/test-utils';
import { expect } from '@jest/globals';
import Counter from '@/components/Counter.vue';

describe('Counter.vue', () => {
    test('increments count when button before click', () => {
        const wrapper = shallowMount(Counter);
        expect(wrapper.find('div').text()).toMatch('0');
    });
    test('increments count when button is clicked', async () => {
        const wrapper = mount(Counter);
        const button = wrapper.find('button');
        await button.trigger('click');
        expect(wrapper.find('div').text()).toMatch('1');
    });
});
