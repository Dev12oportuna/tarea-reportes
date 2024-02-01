import { createContext, useContext, useState } from "react";
import { createTaskRequest, getTasksRequest, deleteTaskRequest, getTaskRequest, updateTaskRequest, setRegistroRequest, getRegistroRequest }from "../api/tasks"


const TaskContext = createContext()

export const useTasks = () => {
    const context = useContext(TaskContext)
    if (!context) {
        throw new Error("UseTasks must be used within a TaskProvider")
    }
    return context
}

export function TaskProvider({children}) {

    const [tasks, setTasks] = useState([])



    const createTask = async (task) => {
    const res = await createTaskRequest(task)

      console.log('res', res);
      setRegistro(res.data.tarea)
    }

    const getTasks = async (user) => {
      try {
        const res = await getTasksRequest(user)
        
        setTasks(res.data)
      } catch (error) {
        console.error(error)
      }
    }

    const deleteTask= async (id) => {
      try {
        const res = await deleteTaskRequest(id)
        console.log(res)
        if (res?.status === 204) {
          setTasks(tasks.filter(task => task.id != id))
        }  
      } catch (error) {
        console.error(error)
      }
      
    }

    const getTask = async (id) => {
      try {
        const res = await getTaskRequest(id)
        return res.data
      } catch (error) {
        console.error(error)
      }
    }

    const updateTask = async (task)=>{
      try {
        await updateTaskRequest(task)
      } catch (error) {
        console.error(error)
      }
    }

    const setRegistro = async (task)=>{
      try {
        const res = await setRegistroRequest(task)
        console.log("setregistro",res)
        return res.data
      } catch (error) {
        console.log(error)
      }
    } 

    const getRegistros = async (id) => {
      try {
        const res = await getRegistroRequest(id)
        console.log('res', res )
      } catch (error) {
        console.log(error)
      }
    }

    return (
        <TaskContext.Provider value={{
          tasks,
          createTask,
          getTasks, 
          deleteTask,
          getTask,
          updateTask,
          setRegistro,
          getRegistros,
        }}>
            {children}
        </TaskContext.Provider>
    )
}