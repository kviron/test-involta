<script setup lang="ts">
import GridIcon from "~/assets/icons/grid.svg";
import ListIcon from "~/assets/icons/list.svg";
defineProps<{
  view: "list" | "grid";
}>();

const emit = defineEmits<{
  (e: "update:view", view: "list" | "grid"): void;
}>();
</script>

<template>
  <div class="flex items-center gap-2">
    <ListIcon
      class="cursor-pointer"
      :class="view === 'list' ? 'fill-primary-main' : 'fill-secondary-light'"
      @click="emit('update:view', 'list')"
    />
    <GridIcon
      class="cursor-pointer"
      :class="view === 'grid' ? 'fill-primary-main' : 'fill-secondary-light'"
      @click="emit('update:view', 'grid')"
    />
  </div>
</template>
