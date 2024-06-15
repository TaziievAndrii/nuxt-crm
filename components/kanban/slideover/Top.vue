<template>
  <div class="border-border bg-black/20 rounded p-3">
    <div class="uppercase bold text-xl mb-4">On the deal</div>
    <KanbanSlideoverLabel label-text="Appellation">
      <h2>{{store.card?.name}}</h2>
    </KanbanSlideoverLabel>
    <KanbanSlideoverLabel label-text="Amount">
      {{convertCurrency(store.card?.price || 0)}}
    </KanbanSlideoverLabel>
    <KanbanSlideoverLabel label-text="Status">
      <UiBadge variant="outline">{{store.card?.status}}</UiBadge>
    </KanbanSlideoverLabel>
    <KanbanSlideoverLabel label-text="Client">
      {{store.card?.companyName}}
    </KanbanSlideoverLabel>
    <KanbanSlideoverLabel label-text="Date of creation">
      {{dayjs(store.card?.$createdAt).format('DD MM YYYY')}}
    </KanbanSlideoverLabel>
  </div>
</template>

<script setup lang="ts">
import dayjs from "dayjs";

import {useDealSlideStore} from "~/store/deal-slide.store";

const store = useDealSlideStore()
</script>

<style scoped>

</style>