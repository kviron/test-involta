<script setup lang="ts">
const props = defineProps<{
  type: "button" | "submit" | "reset";
  disabled: boolean;
}>();

const emit = defineEmits<{
  (e: "click", event: MouseEvent): void;
}>();
</script>

<template>
  <button
    type="button"
    class="p-2 border border-gray-300"
    @click="emit('click', $event)"
  >
    <slot />
  </button>
</template>
