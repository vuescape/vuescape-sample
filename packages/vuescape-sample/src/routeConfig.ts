import { RouteConfig } from 'vue-router'

import CardGridSampleRoute from './components/CardGridSample/route'
import HelloWorldRoute from './components/HelloWorld/route'

import NotFoundRoute from '@vuescape/components/NotFound/route'
import SiteMaintenanceRoute from '@vuescape/components/SiteMaintenance/route'

const routeConfig: Array<RouteConfig> = [
  HelloWorldRoute,
  CardGridSampleRoute,
  SiteMaintenanceRoute,
  NotFoundRoute,
]

export default routeConfig
