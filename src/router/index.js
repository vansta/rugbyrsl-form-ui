import Registry from '../components/Registry.vue'
import VueRouter from 'vue-router'

const routes = [
    {
        path: '/', 
        component: Registry, 
        name: 'Registry'
    },
    {
        path: '/edit', 
        component: () => import('../components/Edit.vue'), 
        name: 'Edit'
    }
]

const router = new VueRouter({
    routes
})

export default router