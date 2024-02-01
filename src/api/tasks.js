import axios from "./axios.js"

export const getTasksRequest = (user) => axios.post("/tarea/get_tareas", user)

export const getAdminTasks = (idgrupo) => {
    return axios.post("/tarea/tareas_admin", {idgrupo: idgrupo})
    
}

export const getTaskRequest = (id) => axios.get(`/tarea/get_tarea/${id}`)

export const createTaskRequest = (task) => axios.post("/tarea/create_tarea", task)

export const updateTaskRequest = (task) => {
    axios.put(`/tarea/actualizar_tarea`, task)
}

export const deleteTaskRequest = (id) => {
    const data = {id: id}
    axios.delete(`/tarea/delete_tarea`, {data})
}

export const setRegistroRequest = (task) => axios.post(`/tarea/set_registro`, task)

export const getRegistroRequest = (id) => {
    const data = {id: id}
    return axios.post(`/tarea/tarea_registro`, data)
} 