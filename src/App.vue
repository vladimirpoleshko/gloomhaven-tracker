<script setup lang="ts">
import AppHeader from './components/AppHeader.vue';
import ScenarioSidebar from './components/ScenarioSidebar.vue';
import MonsterGrid from './components/MonsterGrid.vue';
</script>

<template>
  <div class="app">
    <AppHeader />
    <div class="body">
      <ScenarioSidebar />
      <main class="main">
        <MonsterGrid />
      </main>
    </div>
  </div>
</template>

<style scoped lang="scss">
.app {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.body {
  flex: 1;
  display: flex;
  min-height: 0;
}

.main {
  flex: 1;
  overflow-y: auto;
  background: var(--c-bg);

  &::-webkit-scrollbar {
    width: 8px;
  }
  &::-webkit-scrollbar-track {
    background: var(--c-bg);
  }
  &::-webkit-scrollbar-thumb {
    background: var(--c-border-strong);
    border-radius: 4px;
  }
}
</style>
