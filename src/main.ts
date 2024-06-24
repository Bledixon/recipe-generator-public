import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import { getDatabase, ref as dbRef } from 'firebase/database'
import { initializeApp } from 'firebase/app'
import { useDatabaseList } from 'vuefire'
import { createVfm } from 'vue-final-modal'
import 'vue-final-modal/style.css'
import router from './router';
import App from './App.vue'

const firebase = initializeApp({ databaseURL: 'https://recipe-generator-d89d0-default-rtdb.europe-west1.firebasedatabase.app/' })
const db = getDatabase(firebase);

const app = createApp(App, {
    // setup the reactive todos property
    setup() {
        const todosRef = dbRef(db, 'todos')
        const todos = useDatabaseList(todosRef)
        
        return { todos }
    },
});

const pinia = createPinia();
app.use(pinia);

const vfm = createVfm()
app.use(vfm);

app.use(router);

app.mount('#app');
