<template>
  <div class="task-wrapper">
    <div class="task-view">
      <section v-if="task">
        <UFormGroup label="Name" class="w-full mb-4">
          <UInput type="text" v-model="task.name" />
        </UFormGroup>
        <UFormGroup label="Description" class="w-full mb-4">
          <UTextarea v-model="task.description" />
        </UFormGroup>
        <UButton icon="i-heroicons-trash" color="red" @click="deleteTask"></UButton>
      </section>
      <section v-else>
        Task not found.
      </section>
    </div>
    
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const router = useRouter()
const boardStore = useBoardStore()
const toast = useToast()

const task = computed(() => boardStore.getTask(route.params.id))
const deleteTask = () => {
  toast.add({
    title: 'Task deleted',
    description: `${task.value?.name} has been deleted`,
    icon: 'i-heroicons-trash',
    color: 'red'
  })
  boardStore.deleteTask(route.params.id)
  router.push('/')
}
</script>

<style scoped>

</style>