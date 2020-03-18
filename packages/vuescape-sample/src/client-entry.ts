import { VuetifyTheme } from 'vuetify'
import Vuex from 'vuex'

import { ApplicationBootstrapper, makeAuthenticatedNavigationGuard, makeRouter } from '@vuescape/infrastructure'
import { rootStoreOptions } from '@vuescape/store/modules/Root'
import { makeStoreModule } from '@vuescape/store/modules/types'

const getStoreModulesToRegister = async () => {
  const menuConfiguration = (await import(/* webpackChunkName: "menuConfig" */ './menuConfig')).default
  const menuConfigurationModule = makeStoreModule(menuConfiguration)

  const headerImgUrl = (await import('./images/vuescape.png')).default
  const theHeaderConfiguration = {
    toolbarStyle: 'box-shadow: 0 0 0 1px #ade3ef, 0 1px 2px 0 rgba(0, 0, 0, 0.05);',
    logoAltText: 'Vuescape',
    shouldDisplayHelp: false,
    logoUrl: headerImgUrl,
    shouldShowHeader: true,
  }
  const theHeaderConfigurationModule = makeStoreModule(theHeaderConfiguration)

  const footerImgUrl = (await import('./images/vuescape.png')).default
  const theFooterConfiguration = {
    copyrightName: 'Vuescape',
    logoAltText: 'Vuescape',
    logoUrl: footerImgUrl,
  }
  const theFooterConfigurationModule = makeStoreModule(theFooterConfiguration)

  const siteMaintenanceConfiguration = {
    siteMaintenanceImageUrl: '',
    maintenanceCompleteImageUrl: '',
  }
  const siteMaintenanceConfigurationModule = makeStoreModule(siteMaintenanceConfiguration)

  const notFoundConfiguration = {
    notFoundImageUrl: '',
    notFoundHtml: '<h1>Sorry!</h1><p>The page you are trying to find does not exist.  :(',
  }
  const notFoundConfigurationModule = makeStoreModule(notFoundConfiguration)

  return {
    'menu/configuration': menuConfigurationModule,
    'theHeader/configuration': theHeaderConfigurationModule,
    'theFooter/configuration': theFooterConfigurationModule,
    'siteMaintenance/configuration': siteMaintenanceConfigurationModule,
    'notFound/configuration': notFoundConfigurationModule,
  }
}

const bootstrapApplication = async () => {
  try {
    // Get root component that hosts app
    const App = (await import(/* webpackChunkName: "root-component-app" */ '@vuescape/components/App')).default
    const routes = (await import(/* webpackChunkName: "routeConfig" */ './routeConfig')).default
    const router = makeRouter(routes, makeAuthenticatedNavigationGuard('/sign-in'))
    const modules = await getStoreModulesToRegister()
    const theme: Partial<VuetifyTheme> = {
      primary: '#16a5c6',
    }
    const vuexStore = new Vuex.Store(rootStoreOptions)

    const boostrapper = new ApplicationBootstrapper()
      .withRouter(router)
      .withStoreModules(modules)
      .withTheme(theme)
      .withVuexStore(vuexStore)
      .withRootComponent('#app', App.name, App)

    await boostrapper.bootstrap()
  } catch (error) {
    console.error(`Error bootstrapping application: ${error}`)
  }
}

bootstrapApplication().then(() => {
  console.info('application bootstrap completed')
})
