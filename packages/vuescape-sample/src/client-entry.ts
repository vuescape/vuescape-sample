import Vue from 'vue'
import { NavigationGuard } from 'vue-router'

import { applicationBootstrapper, makeRouter } from '@vuescape/infrastructure'
import { store } from '@vuescape/store'
import { makeStoreModule } from '@vuescape/store/modules/types'
import { AppOptions, VuescapeConfiguration } from '@vuescape/types'

const routerNavigationGuard: NavigationGuard<Vue> = (to, from, next) => {
  const doesRouteRequireAuthentication = to.matched.some(record => record.meta.requiresAuth)
  const doesRouteRequireAuthorization = to.matched.some(record => record.meta.roles)
  const isAuthenticated = store.state.isAuthenticated

  if (doesRouteRequireAuthentication && !isAuthenticated) {
    console.warn('User is not authenticated.  Need to authenticate.')
    // Sign in route is not defined in this sample
    next({ path: '/sign-in', query: { redirect: to.fullPath } })
  } else if (
    doesRouteRequireAuthorization // && some other authorization checks
  ) {
    console.warn('User is not authorized.')
    next(false)
  } else {
    next()
  }
}

const getStoreModulesToRegister = async () => {
  const vuescapeConfiguration: VuescapeConfiguration = {
    vuetifyTheme: {
      primary: '#16a5c6',
    },
  }

  const vuescapeConfigurationModule = makeStoreModule(vuescapeConfiguration)

  const menuConfiguration = (await import(/* webpackChunkName: "menuConfig" */ './menuConfig')).default
  const menuConfigurationModule = makeStoreModule(menuConfiguration)

  const headerImgUrl = (await import('./component-data/CardGridSample/microsoft_logo.png')).default
  const theHeaderProperties = {
    toolbarStyle: 'box-shadow: 0 0 0 1px #ade3ef, 0 1px 2px 0 rgba(0, 0, 0, 0.05);',
    logoAltText: 'CoMetrics',
    shouldDisplayHelp: false,
    logoUrl: headerImgUrl,
    shouldShowHeader: true,
  }
  const theHeaderModule = makeStoreModule(theHeaderProperties)

  const footerImgUrl = (await import('./component-data/CardGridSample/microsoft_logo.png')).default
  const theFooterProperties = {
    copyrightName: 'Vuescape',
    logoAltText: 'Vuescape',
    logoUrl: footerImgUrl,
  }
  const theFooterModule = makeStoreModule(theFooterProperties)

  const siteMaintenanceProperties = {
    siteMaintenanceImageUrl: '',
    maintenanceCompleteImageUrl: '',
  }
  const siteMaintenanceModule = makeStoreModule(siteMaintenanceProperties)

  const notFoundProperties = {
    notFoundImageUrl: '',
    notFoundHtml: '<h1>Sorry!</h1><p>The page you are trying to find does not exist.  :(',
  }
  const notFoundModule = makeStoreModule(notFoundProperties)

  return {
    vuescapeConfiguration: vuescapeConfigurationModule,
    menuConfiguration: menuConfigurationModule,
    theHeader: theHeaderModule,
    theFooter: theFooterModule,
    siteMaintenance: siteMaintenanceModule,
    notFound: notFoundModule,
  }
}

const bootstrapApplication = async () => {
  try {
    // Get root component that hosts app
    const App = (await import(/* webpackChunkName: "root-component-app" */ '@vuescape/components/App')).default
    const routes = (await import(/* webpackChunkName: "routeConfig" */ './routeConfig')).default

    const router = makeRouter(routes, routerNavigationGuard)
    const appOptions: AppOptions = {
      store,
      router,
      el: '#app',
      componentName: App.name,
      rootComponent: App,
      storeModulesToRegister: await getStoreModulesToRegister(),
    }

    await applicationBootstrapper(appOptions)
  } catch (error) {
    console.error(`Error bootstrapping application: ${error}`)
    return {} as AppOptions
  }
}

bootstrapApplication().then(() => {
  console.info('application bootstrap completed')
})
