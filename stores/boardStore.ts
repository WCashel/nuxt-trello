import { defineStore } from "pinia"
import {v4 as uuid } from "uuid"
import { useStorage } from "@vueuse/core"
import boardData from "~/data/board.json"

export const useBoardStore = defineStore("boardStore", () => {
  const board = useStorage('board', boardData)
  const addColumn = (columnName: string) => {
    board.value.columns.push({
      name: columnName,
      tasks: []
    })
  }
  const deleteColumn = (columnIndex: number) => {
    board.value.columns.splice(columnIndex, 1)
  }

  interface TaskParams {
    columnIndex: number;
    taskName: string;
  }
  const addTask = ({ columnIndex, taskName }: TaskParams) => {
    board.value.columns[columnIndex].tasks.push({
      id: uuid(),
      name: taskName,
      description: ''
    })
  }
  const deleteTask = (taskId :string) => {
    for (const column of board.value.columns) {
      const taskIndex = column.tasks.findIndex(task => task.id === taskId)
      if (taskIndex !== -1) {
        column.tasks.splice(taskIndex, 1)
        return;
      }
    }
  }

  const getTask = computed(() => {
    return taskId => {
      for (const column of board.value.columns) {
        const task = column.tasks.find(task => task.id === taskId)
        if (task) return task
      }
    }
  })

  interface moveArgs {
    fromTaskIndex?: number;
    toTaskIndex?: number;
    fromColumnIndex?: string;
    toColumnIndex: number;
  }
  const moveTask = ({ fromTaskIndex, toTaskIndex, fromColumnIndex, toColumnIndex } : moveArgs) => {
    
    const task = board.value.columns?.[fromColumnIndex].tasks.splice(fromTaskIndex, 1)[0]
    board.value.columns?.[toColumnIndex].tasks.splice(toTaskIndex, 0, task)
  }
  const moveColumn = ({ fromColumnIndex, toColumnIndex }: moveArgs) => {
    const column = board.value.columns.splice(fromColumnIndex, 1)[0]
    board.value.columns.splice(toColumnIndex, 0, column)
  }

  return {
    board,
    addColumn,
    deleteColumn,
    addTask,
    deleteTask,
    getTask,
    moveTask,
    moveColumn,
  }
})