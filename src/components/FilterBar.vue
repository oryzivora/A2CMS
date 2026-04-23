<template>
  <div class="filter-bar">
    <div class="filter-left">
      <slot name="filters" />
    </div>
    <div class="filter-right">
      <slot name="actions" />
    </div>
  </div>
</template>

<script lang="ts" setup>
</script>

<style scoped>
.filter-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-4);
  flex-wrap: wrap;
  gap: var(--space-3);
  padding: var(--space-4);
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-light);
  box-shadow: var(--shadow-xs);
}

.filter-left,
.filter-right {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  flex-wrap: wrap;
}

@media (max-width: 768px) {
  .filter-bar {
    flex-direction: column;
    align-items: stretch;
    padding: var(--space-3);
  }

  .filter-left,
  .filter-right {
    width: 100%;
  }

  .filter-left {
    justify-content: flex-start;
  }

  .filter-right {
    justify-content: flex-end;
  }
}
</style>
