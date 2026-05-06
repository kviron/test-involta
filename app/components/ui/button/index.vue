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
    :type="props.type"
    :disabled="props.disabled"
    class="p-2"
    @click="emit('click', $event)"
  >
    <slot />
  </button>
</template>
