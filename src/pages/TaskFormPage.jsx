import { useForm,  } from "react-hook-form"
import { useTasks } from "../context/TasksContext"
import { useNavigate, useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import axios from "axios"

import utc from "dayjs/plugin/utc"
import dayjs from "dayjs"
import { useAuth } from "../context/authContext"
dayjs.extend(utc)

function TaskFormPage() {

  const { register, handleSubmit, setValue } = useForm()
  const {tasks, createTask, getTask, updateTask, setRegistro} = useTasks()
  const navigate = useNavigate()
  const [location, setLocation] = useState(null);
  const [task, setTask] = useState(null)
  const {user} = useAuth()
  const params = useParams()
  const [file, setFile] = useState(null);

  
  const handleFileChange = (selectedFile) => {
    setFile(selectedFile);
  };

  const onSubmit = handleSubmit(async (data) => {
    console.log(data)
        const dataValid = {
          ...data,
          start: data.date ? dayjs.utc(data.date).format() : dayjs.utc().format(), 
          vendedor: user.Email,
          cliente: user.Email,
          id_grupo: user.idgrupo,
          lat: location ? location.latitude : null, // Verificar si location no es nulo
    lng: location ? location.longitude : null, // Verificar si location no es nulo
          tipo: 'Tarea'
        }
        console.log(dataValid)

      
        
      if(params.id){
        const dataToUpdate = {
          ...dataValid,
          id: params.id,
          
        }
          updateTask(dataToUpdate)
          const res = await setRegistro(dataToUpdate)

          if (file) {
            const formData = new FormData();
            formData.append("picture", file);
            
            formData.append('idLinea', '29');
            formData.append('idTipo', 'Tarea'); 
            formData.append('funcionario', user.Email);
            formData.append('idVisita', res.unique_id);
            try {
              const response = await axios.post('https://pd.oportuna.red/uploadF', formData, {
                headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'multipart/form-data', 
                },
              });
              
              console.log('Respuesta del servidor:', response.data);
            } catch (error) {
              console.log("Error uploading file:", error);
            }
          }
          
        }else{
          createTask(dataValid)
          
        }
    navigate("/tasks") 
  })

  useEffect(() => {
    async function loadTask() {
      if (params.id) {
        const task = await getTask(params.id)
        setValue('title', task.title)
        setValue('body', task. body)
        setValue('tarea_estado_id', task.tarea_estado_id)
        setValue('start', dayjs(task.start).utc().format('YYYY/MM/DD'))
        setTask(task.tarea_estado_id)
      }
    }
    loadTask()
  },[])

  useEffect(() => {
    const successCallback = (position) => {
      setLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
    };

    const errorCallback = (error) => {
      console.log("Error retrieving location:", error);
    };

    const options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    };

    navigator.geolocation.getCurrentPosition(successCallback, errorCallback, options);
  }, []);


  return (
    <div className="flex h-[calc(100vh-100px)] items-center justify-center">
      <div className="bg-emerald-500 max-w-md w-full p-10 rounded-md">
          <form onSubmit={onSubmit}>
              <input type="text"
                placeholder="Title"
                {...register("title")}
                autoFocus
                className="w-full bg-emerald-600  text-white px-4 py-2 my-2 rounded-md"
              />
              <textarea rows="3"
                placeholder="Description"
                {...register("body")}
                className="w-full bg-emerald-600  text-white px-4 py-2 my-2 rounded-md"
              ></textarea>
              <select className=" bg-emerald-600  text-white px-4 py-2 my-2 rounded-md"
                {...register('tarea_estado_id')}
              >
                <option value="" className="text-opacity-50">--Estado--</option>
                <option value="1">Planeación</option>
                <option value="3">Progreso</option>
                {task === 3 && (
                  <option value="2">Stop</option>
                )} 
                <option value="4">Realizada</option>
              {/*   <option value="5">Validación</option>
                <option value="6">Aprobación</option> */}
                
              </select>
              <input type="file" onChange={(e) => handleFileChange(e.target.files[0])} />

              <input type="date"
                  {...register("start")}
                  className="w-full bg-emerald-600  text-white px-4 py-2 my-2 rounded-md"
              />

              <button className="bg-emerald-800 px-4 py-1 rounded-sm">Save</button>
          </form>
      </div>
    </div>
      
  )
}
export default TaskFormPage