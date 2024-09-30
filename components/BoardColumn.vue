<template>
  <UContainer 
    class="column" 
    draggable="true" 
    @dragstart.self="pickupColumn($event, columnIndex)"
    @dragenter.prevent 
    @dragover.prevent 
    @drop.stop="dropItem($event, { 
      toColumnIndex: columnIndex
    })"
  >
    <div class="column-header mb-4">
      <UInput v-if="editNameState" type="text" v-model="column.name"/>
      <h2 v-else>{{ column.name }}</h2>
    </div>
    <div>
      <UButton icon="i-heroicons-pencil-square" class="mr-2" @click="editNameState = !editNameState"/>
      <UButton icon="i-heroicons-trash" color="red" @click="deleteColumn(columnIndex)"/>
    </div>
    <ul>
      <li v-for="(task, taskIndex) in column.tasks" :key="task.id">
        <UCard 
          class="mb-4" 
          @click="goToTask(task.id)" 
          draggable="true" 
          @dragstart="pickupTask($event, {
            fromColumnIndex: columnIndex,
            fromTaskIndex: taskIndex
          })"
          @drop.stop="dropItem($event, { 
            toColumnIndex: columnIndex,
            toTaskIndex: taskIndex
          })"
        >
          <strong>{{ task.name }}</strong>
          <p>{{ task.description }}</p>
        </UCard>
      </li>
    </ul>
    <UInput 
      v-model="newTaskName"
      type="text" 
      placeholder="Create new task" 
      icon="i-heroicons-plus-circle-solid" 
      @keyup.enter="addTask"
    />
  </UContainer>
</template>

<script setup lang="ts">
const props = defineProps({
  column:  { type: Object, required: true },
  columnIndex: { type: Number, required: true }
})

const editNameState = ref(false)
const boardStore = useBoardStore()
const router = useRouter()

const deleteColumn = (columnIndex: number) => {
  boardStore.deleteColumn(columnIndex)
}
const newTaskName = ref('')
const addTask = () => {
  boardStore.addTask({
    columnIndex: props.columnIndex, 
    taskName: newTaskName.value
  })
  newTaskName.value = ''
}
const goToTask = (taskId: string) => {
  router.push(`/tasks/${taskId}`)
}

// Drag / drop
const pickupTask = (event: DragEvent, { fromColumnIndex, fromTaskIndex }) => {
  console.log(`drag-start:task`, event, { fromColumnIndex, fromTaskIndex})
  event.dataTransfer.effectAllowed = 'move'
  event.dataTransfer.dropEffect = 'move'
  event.dataTransfer?.setData('type', 'task')
  event.dataTransfer?.setData('from-column-index', fromColumnIndex)
  event.dataTransfer?.setData('from-task-index', fromTaskIndex)
}
const dropItem = (event: DragEvent, { toColumnIndex, toTaskIndex }) => {
  const type = event.dataTransfer?.getData('type')
  const fromColumnIndex = event.dataTransfer?.getData('from-column-index')
  

  if (type === 'task') {  
    const fromTaskIndex = event.dataTransfer?.getData('from-task-index')
    console.log(`drop-task`, event, {fromColumnIndex, fromTaskIndex, toColumnIndex, toTaskIndex})
    
    boardStore.moveTask({
      fromTaskIndex,
      toTaskIndex,
      fromColumnIndex,
      toColumnIndex,
    })
  } else if (type === 'column') {
    console.log(`drop-task`, event, {fromColumnIndex, toColumnIndex, toTaskIndex})
    boardStore.moveColumn({
      fromColumnIndex,
      toColumnIndex,
    })
  }
}

const pickupColumn = (event: DragEvent, fromColumnIndex) => {
  console.log(`drag-start:column`, event/* , { fromColumnIndex, fromTaskIndex} */)
  event.dataTransfer.effectAllowed = 'move'
  event.dataTransfer.dropEffect = 'move'
  event.dataTransfer?.setData('type', 'column')
  event.dataTransfer?.setData('from-column-index', fromColumnIndex)
}
</script>

<style scoped>

</style>