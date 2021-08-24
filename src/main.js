import Vue from 'vue';
import App from './App.vue';
import router from './router';

import 'primevue/resources/themes/saga-blue/theme.css';
import 'primevue/resources/primevue.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';

import PrimeVue from 'primevue/config';
import ToastService from 'primevue/toastservice';

Vue.use(PrimeVue);
Vue.use(ToastService);

import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Dropdown from 'primevue/dropdown';
import Tree from 'primevue/tree';
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import Toast from 'primevue/toast';

Vue.component('Button', Button);
Vue.component('InputText', InputText);
Vue.component('Dropdown', Dropdown);
Vue.component('Tree', Tree);
Vue.component('TabView', TabView);
Vue.component('TabPanel', TabPanel);
Vue.component('Toast', Toast);

Vue.config.productionTip = false;

new Vue({
    router,
    render: (h) => h(App),
}).$mount('#app');
