import Vue from 'vue';
import App from './App.vue';
import router from './router';

import PrimeVue from 'primevue/config';

import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Dropdown from 'primevue/dropdown';
import Tree from 'primevue/tree';

import 'primevue/resources/themes/saga-blue/theme.css';
import 'primevue/resources/primevue.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';

Vue.config.productionTip = false;

Vue.use(PrimeVue);

Vue.component('Button', Button);
Vue.component('InputText', InputText);
Vue.component('Dropdown', Dropdown);
Vue.component('Tree', Tree);

new Vue({
    router,
    render: (h) => h(App),
}).$mount('#app');
