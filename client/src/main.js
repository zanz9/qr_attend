import {createApp} from 'vue'
import App from './App.vue'
import router from './router'

import 'vuetify/styles'
import {createVuetify} from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import {mdi} from "vuetify/iconsets/mdi-svg";

import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'

const vuetify = createVuetify({
    theme: {
        defaultTheme: 'light'
    },
    icons: {
        defaultSet: 'mdi',
        sets: {
            mdi,
        }
    },
    components,
    directives,
})

const app = createApp(App)

app.use(vuetify)
app.use(router)
app.component('VueDatePicker', VueDatePicker);

app.mount('#app')
