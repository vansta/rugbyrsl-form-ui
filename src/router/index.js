import Registry from '../components/Registry.vue'
import Edit from '../components/Edit.vue'
import VueRouter from 'vue-router'

const routes = [
    {
        path: '/', component: Registry, name: 'Registry'
    },
    {
        path: '/edit', component: Edit, name: 'Edit'
    }
]

const router = new VueRouter({
    routes
})

export default router