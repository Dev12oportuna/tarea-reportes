import React, {useState, useEffect, useRef} from 'react'
import { useTasks } from '../context/TasksContext'
import { Link } from 'react-router-dom'
import utc from "dayjs/plugin/utc"
import dayjs from "dayjs"
import Deleteicons from '../assets/Deleteicons'
import EditIcon from '../assets/EditIcon'
import DetailIcon from '../assets/DetailIcon'
import "../App.css"
import DetailModal from './DetailModal'
dayjs.extend(utc)

const TasksCard = ({task}) => {

    const [selectedTaskId, setSelectedTaskId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const {updateTask, setRegistro} = useTasks()
    const {deleteTask} = useTasks()

    const handleChangeState = (newState) => {
        try {
            const validData = {
                ...task,
                tarea_estado_id: newState,
                start: new Date(task.start).toISOString(),
                tipo: 'Tarea'
            }
            console.log(validData)
            updateTask(validData)
            setRegistro(validData)
        } catch (error) {
            console.error(error)
        }
    }
    
  return (
    <div className='bg-emerald-500 hover:border-emerald-950 max-w-xs w-full  p-10 border-2 rounded-2xl my-3'>
        <header className='flex justify-between'>
            <h1 className='text-2xl text-white font-bold m-4 py-1'>{task.title}</h1>
            <div className='flex gap-x-2 items-center m-4'>
                <button onClick={() =>{
                    
                    deleteTask(task.id)
                }}
                className='bg-transparent hover:bg-red-600 text-white px-1 py-1 rounded-md'
                title='Delete'
                ><Deleteicons/></button>
                
                <Link to={`/tasks/${task.id}`}
                className='bg-transparent hover:bg-yellow-400 text-white px-1 py-1 rounded-md'
                title='Edit'
                ><EditIcon/></Link> 

                <button onClick={() => {
                    setSelectedTaskId(task.id)
                    setIsModalOpen(true);
                }}
                className='bg-transparent hover:bg-lime-400 text-white px-1 py-1 rounded-md'
                name='deatils'
                title='Details'>
                    <DetailIcon/>
                </button>
                
            </div>
        </header>
        <p className='text-slate-100 '>{task.body}</p>
        <select className="bg-emerald-700 text-white rounded-md my-3" onChange={(e) => handleChangeState(e.target.value)}>
            <option>{task.tarea_estado.estado}</option>
            <option value="1">Planeación</option>
            {task.tarea_estado_id === 3 &&(
                <option value="2">Stop</option>
            )}
            <option value="3">Progreso</option>
            <option value="4">Realizada</option>
        </select>
       {/*  <p>{task.tarea_estado.estado}</p> */}
        <p className='text-xs text-white font-bold'>{dayjs(task.start).utc().format("DD/MM/YYYY")}</p>
        {isModalOpen && (
                <DetailModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    taskid={selectedTaskId}
                />
)}
    </div>
  )
}

export default TasksCard