import Vue from 'vue';
import App from './App.vue';
import router from './router';

import PrimeVue from 'primevue/config';

import Button from 'primevue/button';
import InputText from 'primevue/inputtext';

import 'primevue/resources/themes/saga-blue/theme.css';
import 'primevue/resources/primevue.min.css';
import 'primeicons/primeicons.css';

Vue.config.productionTip = false;

Vue.use(PrimeVue);

Vue.component('Button', Button);
Vue.component('InputText', InputText);

new Vue({
    router,
    render: (h) => h(App),
}).$mount('#app');
