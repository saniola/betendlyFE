import { createApp } from 'vue';
import '@/style.css';
import App from '@/controllers/App.vue';
import router from '@/router';
import 'mosha-vue-toastify/dist/style.css';
import '@mdi/font/css/materialdesignicons.css';

import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';


const app = createApp(App);
const vuetify = createVuetify({
  components,
  directives,
});

app.use(router).use(vuetify);

app.mount('#app');
