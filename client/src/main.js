import {createApp} from 'vue'
import App from './App.vue'
import router from './router'

import 'vuetify/styles'
import {createVuetify} from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import {mdi} from "vuetify/iconsets/mdi-svg";

const vuetify = createVuetify({
    theme: {
        defaultTheme: 'dark'
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

app.mount('#app')
