import { RouteConfig } from 'vue-router'

const route: RouteConfig = {
  path: '/',
  name: 'hello world',
  meta: { requiresAuth: false },
  component: () => import(/* webpackChunkName: 'hello-world' */ '.').then(m => m.default),
}

export default route
