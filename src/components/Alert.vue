<script setup lang="ts">
import { computed } from 'vue';

type AlertVariant = 'default' | 'destructive';

const props = withDefaults(defineProps<{
  variant?: AlertVariant;
}>(), {
  variant: 'default',
});

// Computed property to dynamically calculate the CSS classes
const alertClasses = computed(() => {
  const baseStyle = 'relative w-full rounded-lg border p-4';

  const variants: Record<AlertVariant, string> = {
    default: 'bg-background text-foreground',
    destructive: 'border-red-500/50 text-red-500 dark:border-red-500 [&>svg]:text-red-500',
  };

  return `${baseStyle} ${variants[props.variant]}`;
});
</script>

<template>
  <div :class="alertClasses" role="alert">
    <slot />
  </div>
</template>
