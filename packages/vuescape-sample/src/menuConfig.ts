import { Guid } from '@vuescape/types/Guid'
import { Menu } from '@vuescape/types/Menu'

import CardGridSampleRoute from './components/CardGridSample/route'
import HelloWorldRoute from './components/HelloWorld/route'

const menuConfig: Array<Menu> = [
  {
    id: Guid.newGuid(),
    title: 'Hello World',
    path: HelloWorldRoute.path,
    ariaLabel: 'Hello World',
    icon: 'home',
  },
  {
    id: Guid.newGuid(),
    title: 'Samples',
    path: '/samples',
    ariaLabel: 'Who is in Reports Menu',
    items: [
      {
        id: Guid.newGuid(),
        title: 'Card Grid Sample Page',
        path: `${CardGridSampleRoute.path}`,
      },
    ],
  },
]

export default menuConfig
