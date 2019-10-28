import { RouteConfig } from 'vue-router'

const route: RouteConfig = {
  path: '/card-grid-sample',
  name: 'card-grid-sample',
  meta: { requiresAuth: false },
  component: () => import(/* webpackChunkName: 'card-grid-sample' */ '.').then(m => m.default),
}
export default route
