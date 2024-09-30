<template>
  <div class="board-wrapper">
    <main class="board">
      <BoardColumn v-for="(column, columnIndex) in boardStore.board.columns" :key="column.id" 
      :column="column"
      :columnIndex="columnIndex"
      />
      <UContainer class="column">
        <UInput 
          v-model="newColumnName"
          type="text" 
          placeholder="Create new column" 
          icon="i-heroicons-plus-circle-solid" 
          @keyup.enter="addColumn"
        />
      </UContainer>
      <!-- <pre>{{ boardStore.board.name }}</pre> -->
    </main>
    <div v-show="isModalOpen" class="task-bg" @click.self="closeModal">
      <NuxtPage :key="route.fullPath" />
    </div>
  </div>
</template>

<script setup lang="ts">

const boardStore = useBoardStore()
const route = useRoute()
const router = useRouter()

const isModalOpen = computed(() => route.name === 'index-tasks-id')
const closeModal = () => {
  router.push('/')
}

const newColumnName = ref('')
const addColumn = () => {
  boardStore.addColumn(newColumnName.value)
  newColumnName.value = ''
}
//const board = boardStore.board
</script>

<style scoped>

</style>