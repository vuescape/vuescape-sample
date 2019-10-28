<template>
  <card-grid :cards="cardGridData"></card-grid>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'

import ComponentBase from '@vuescape/infrastructure/ComponentBase'

const CardGridData = () =>
  import(/* webpackChunkName: "card-grid-sample-data" */ '../../component-data/CardGridSample/cards').then(
    m => m.cards,
  )

const CardGrid = () => import(/* webpackChunkName: 'card-grid' */ '@vuescape/components/CardGrid').then(m => m.default)

@Component({ components: { CardGrid } })
export default class CardGridSample extends ComponentBase {
  private cardGridData: Array<any> = []

  public async created() {
    const data = await CardGridData()
    this.cardGridData = data
  }
}
</script>
</style>
