import React, { useEffect, useState } from "react";
import { useTasks } from "../context/TasksContext";
import TasksCard from "../components/TaskCard";
import { useAuth } from "../context/authContext";
import { Data } from "@react-google-maps/api";
import DetailModal from '../components/DetailModal';


function TasksPage() {

    const [selectedTaskId, setSelectedTaskId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const {getTasks, tasks} = useTasks()
    const {user} = useAuth()
    
   



    

    useEffect(() => {
        const data = {
            cliente: user.Email
        }
        getTasks(data)
        
    },[])

    
    if (!tasks || tasks.length === 0) {
        return <div>No hay tareas</div>;
    }

    const columns = {
        Planeacion: [],
        Progreso: [],
        Stop: [],
        Realizada: [],
        Validacion: [],
        Aprobacion: [],
    };

    tasks.forEach((task) => {
        switch (task.tarea_estado_id) {
            case 1:
                columns.Planeacion.push(task);
                break;

            case 2:
                columns.Stop.push(task);
                break;

            case 3:
                columns.Progreso.push(task);
                break;
            case 4:
                columns.Realizada.push(task);
                break;
            case 5:
                columns.Validacion.push(task);
                break;
            case 6:
                columns.Aprobacion.push(task);
                break;
            default:
                break;
        }
    });

    return (
        <section className="flex flex-wrap justify-between">
            {Object.entries(columns).map(([column, tasks]) => {
                     // Calcular la altura total de las tareas en la columna
                const columnHeight = tasks.reduce((totalHeight, task) => totalHeight + task.height, 0);

                    // Verificar si la columna tiene tareas antes de renderizarla
                    if (tasks.length > 0) {
                        return (
                            <div className="bg-emerald-700 grid-cols-1 max-w-fit justify-items-center p-3 my-2 border-b-2 rounded-2xl shadow-lg" 
                            key={column}
                            style={{ minHeight: `${columnHeight}px` }}
                            >

                                <h2 className="text-emerald-950 text-2xl font-extrabold">{column}</h2>
                                {tasks.map((task) => {
                                    return (
                                        <TasksCard
                                            task={task}
                                            key={task.id}
                                            onClick={() => {
                                                setSelectedTaskId(task.id);
                                                setIsModalOpen(true);
                                            }}
                                        />
                                    );
                                })}
                            </div>
                        );
                    }
                    return null; // No renderizar la columna si no tiene tareas
                })}
        </section>
        
    );
}
export default TasksPage;