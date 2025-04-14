import { createApp } from 'vue'
import App from './App.vue'
import "vuetify/styles";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import 'vuetify/dist/vuetify.min.css';
const vuetify = createVuetify({
    components,
    directives,
  })
const app=createApp(App);
app.config.globalProperties.$themeColor='#8CC7B5';
export const globalProperties=app.config.globalProperties;
app.use(vuetify)
.mount('#app');