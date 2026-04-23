<template>
  <div class="sort-bar">
    <div class="sort-left">
      <slot name="left" />
    </div>
    <div class="sort-right">
      <slot name="right" />
    </div>
  </div>
</template>

<script lang="ts" setup>
</script>

<style scoped>
.sort-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-4);
  flex-wrap: wrap;
  gap: var(--space-3);
  padding: 0 var(--space-2);
}

.sort-left,
.sort-right {
  display: flex;
  align-items: center;
  gap: var(--space-4);
}

@media (max-width: 768px) {
  .sort-bar {
    flex-direction: column;
    align-items: stretch;
  }

  .sort-left,
  .sort-right {
    width: 100%;
    justify-content: space-between;
  }
}
</style>
