import React, { useEffect, useState } from 'react'
//import { useTasks } from '../context/TasksContext';
import { getRegistroRequest } from '../api/tasks';
import dayjs from 'dayjs';
import { MyFileBrowser } from './MyFileBrowser';

const DetailModal = ({ isOpen, onClose, taskid }) => {
  //const {getRegistros} = useTasks()
  const [registro, setRegistro] = useState([])
  const [isMyFileBrowserOpen, setIsMyFileBrowserOpen] = useState(false);
  const [ registroID, setRegistroID] = useState(null)

  const handleFile = (uniqueId) => {
    setIsMyFileBrowserOpen(true)
    setRegistroID(uniqueId)
  }

  useEffect(() => {
    async function fetchData() {
      const res = await getRegistroRequest(taskid);
      console.log(res.data);
      setRegistro(res.data); 
      
    }
    fetchData();
  }, [isOpen, taskid]);

  const observaMappings = {
    1: 'Planificacion',
    2: 'Stop',
    3: 'Progreso',
    4: 'Realizada',
    5: 'Validacion',
    6: 'Aprobacion',
  };

  return (
    <div>
    <div className="modal-overlay w-fit hover:border-emerald-950 border-2 rounded-2xl mr-4">
      <div className="modal">
        <div className="flex justify-between p-2 modal-header">
          <h2>Detalles</h2>
          <button onClick={onClose} className="modal-close-btn  hover:bg-red-600 text-white px-0.2 py-0.2 rounded-full">
            &times;
          </button>
        </div>
        <div className="modal-content p-2">
          <table className="table-auto justify-between">
            <thead>
              <tr>
                <th className="border border-gray-300">Estado</th>
                <th className="border border-gray-300">Hora</th>
                <th className="border border-gray-300">Archivo</th>
              </tr>
            </thead>
            <tbody>
            {registro ? ( // Check if registro is defined
                registro.map((item) => (
                  <tr key={item.unique_id}>
                    <td className="border border-gray-300 p-2">{observaMappings[item.observa]}</td>
                    <td className="border border-gray-300 p-2">{dayjs(item.fechaserver).utc().format("DD/MM/YY H:mm")}</td>
                    <td className="border border-gray-300 pl-4"><button name="archivo" onClick={() => handleFile(item.unique_id)}>
                          <img
                            src="https://oportuna.red/torre/assets/robotics/img/icon-file.png"
                            alt="ElFinder"
                            width="25"
                            height="25"
                          /> 
                        </button>
                    </td>
                  </tr>
                  
                  ))
                  ) : (
                    <tr>
                  <td colSpan="2">No data available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    {isMyFileBrowserOpen && <MyFileBrowser taskId={taskid} registro={registroID} open ={isMyFileBrowserOpen} onClose={() => setIsMyFileBrowserOpen(false)} />} 
    </div>
  );
};
export default DetailModal