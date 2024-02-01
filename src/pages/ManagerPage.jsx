import React, { useState, useEffect } from 'react'
import MUIDataTable from "mui-datatables";
import { Grid, Button, Container, Box } from '@mui/material';
import { useAuth } from '../context/authContext';
import { getAdminTasks, getRegistroRequest } from '../api/tasks';
import dayjs from "dayjs";
import { Select, MenuItem } from '@mui/material';
import LocationDialog from "../components/LocationDialog"; 
import { LoadScript } from "@react-google-maps/api";
import { MyFileBrowser } from '../components/MyFileBrowser';
import createCache from "@emotion/cache";
import { useMediaQuery } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { createTheme } from "@mui/material/styles";
import { CacheProvider } from "@emotion/react";
import { useTasks } from '../context/TasksContext';

const muiCache = createCache({
  key: "mui-datatables",
  prepend: true
});


const ManagerPage = () => {

  const {user} = useAuth()
  const [data, setData] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [modalLat, setModalLat] = useState(0);
  const [modalLng, setModalLng] = useState(0);
  const [isMyFileBrowserOpen, setIsMyFileBrowserOpen] = useState(false);
  const [isGoogleMapsLoaded, setIsGoogleMapsLoaded] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [tiempoTotalData, setTiempoTotalData] = useState([]);
  const [responsive, setResponsive] = useState("horizontal");
  const [tableBodyHeight, setTableBodyHeight] = useState("400px");
  const [tableBodyMaxHeight, setTableBodyMaxHeight] = useState("");
  const isSmallScreen = useMediaQuery("(max-width:600px)")
  const {updateTask, setRegistro} = useTasks()
  const [taskRegisters, setTaskRegisters] = useState([])
  const api_key = process.env.REACT_APP_API_KEY 
  
  const columns = [
    {
      name: "ID",
      label: "ID",
      options: {
        filter: true,
        sort: true,
        },
    },
    "Tarea",
    "Desarrollador",
    {
      name: "Estado",
      options: {
        customBodyRender: (value, tableMeta) => {
          const rowIndex = tableMeta.rowIndex;
          const originalValue = data[rowIndex].Estado;
          //console.log(`id: ${rowIndex}`,originalValue)

          // Opciones para el Select
          const options = [
            { value: `${originalValue}`, label: `${originalValue}` },
            { value: 'Validacion', label: 'Validacion' },
            { value: 'Aprobacion', label: 'Aprobacion' },
            // Agrega más opciones según tus necesidades
          ];

          return (
            <Select value={originalValue} onChange={(e) => handleChangeState(e.target.value)}>
              {options.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          );
        },
      },
    },
    "Fecha",
    {
      name: "Tiempo",
      options: {
        customBodyRender: (value, tableMeta) => {
          const rowIndex = tableMeta.rowIndex;
          return tiempoTotalData[rowIndex] || ""; // Mostrar tiempoTotal correspondiente
        },
      },
    },
    {
      name: "Ubicacion",
      options: {
        customBodyRender: (value, tableMeta) => {
          const rowData = data[tableMeta.rowIndex];
          const lat = parseFloat(rowData.Latitud);
          const lng = parseFloat(rowData.Longitud);
          return (
            <button
              onClick={() => handleLocationClick(lat, lng)}
            >
              <img src="https://oportuna.red/torre/assets/img/img/icon-location.png" alt="Ubicación" width="32" height="32" />
            </button>
          );
        },
      },
    },
    {
      name: "Archivo",
      options: {
        customBodyRender: (value, tableMeta) => {
          const rowData = data[tableMeta.rowIndex]; 
          return (
            <button onClick={() => handleFile(rowData.ID)}>
              <img
                src="https://oportuna.red/torre/assets/robotics/img/icon-file.png"
                width="32"
                height="32"
              />
            </button>
          );
        },
      },
    }
  ]

  const peticionGet =  async () => {
    try {
        const response = await getAdminTasks(user.idgrupo)
        console.log(response)
        const formattedData = response.data.map((item) => ({
          ID: item.id,
          Tarea: item.title || "", // handle null or undefined
          Desarrollador: item.cliente || "", // handle null or undefined
          Estado: item.tarea_estado ? item.tarea_estado.estado : "", // handle null or undefined
          Fecha: dayjs.utc(item.start).format("DD/MM/YYYY") || "", 
          Latitud: item.lat,
          Longitud: item.lng,
        }));

      setData(formattedData); 
      
      const tiempoTotalArray = formattedData.map(async (item) => {
        try {
          const registrosResponse = await getRegistroRequest(item.ID);
          const registros = registrosResponse.data;
          setTaskRegisters(registros)

          if (Array.isArray(registros)) {
            let tiempoTotal = 0;
            let ultimaFecha = null;

            registros.forEach((registro) => {
              if (registro.observa === '3' && ultimaFecha === null) {
                ultimaFecha = registro.fechaserver;
              } else if (registro.observa === '2' && ultimaFecha !== null) {
                tiempoTotal += dayjs(registro.fechaserver).diff(dayjs(ultimaFecha), 'minutes');
                ultimaFecha = null;
              }
            });

            return tiempoTotal;
          } else {
            console.error(`Los registros para ID ${item.ID} no son un array.`);
            return 0; // O un valor por defecto si no hay registros
          }
        } catch (error) {
          console.error(`Error fetching registro for ID ${item.ID}:`, error);
          return 0; // O un valor por defecto si hay un error
        }
      });

      // Esperar a que se resuelvan todas las promesas y luego establecer el estado
      const tiempoTotalDataArray = await Promise.all(tiempoTotalArray);
      setTiempoTotalData(tiempoTotalDataArray);


    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }


  useEffect(() => {
    peticionGet();
    
  }, [])

  useEffect(() => {
    const loadGoogleMapsScript = () => {
      if (!window.google || !window.google.maps) {
        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=${api_key}&libraries=places`;
        script.onload = () => {
          setIsGoogleMapsLoaded(true);
        };
        document.head.appendChild(script);
      } else {
        setIsGoogleMapsLoaded(true);
      }
    };

    loadGoogleMapsScript();
  }, []);

  const handleLocationClick = (lat, lng) => {
    
    setModalLat(lat);
    setModalLng(lng);
    setIsDialogOpen(true);
  };

  const handleFile = (id) => {
    setIsMyFileBrowserOpen(true)
    setSelectedTaskId(id)
  }

  const optionsTable = {
    responsive: isSmallScreen ? "stacked" : responsive,
    tableBodyHeight: isSmallScreen ? "auto" : tableBodyHeight,
    tableBodyMaxHeight: isSmallScreen ? "none" : tableBodyMaxHeight,
    /* onTableChange: (action, state) => {
      console.log(action);
      console.dir(state);
    }*/
  }; 
  
  const handleChangeState = (newState) => {
    try {
       /*  const validData = {
            
        } */
        console.log(data)
        /* updateTask(validData)
        setRegistro(validData) */
    } catch (error) {
        console.error(error)
    }
}

  return (
    <section>
      <CacheProvider value={muiCache}>
        <ThemeProvider theme={createTheme()}>
          <LoadScript>

          
      <Container>
        <Grid>
          <MUIDataTable
          title={'Tareas'}
          data={data}
          columns={columns}
          options={optionsTable}
          />
        </Grid>
        <LocationDialog
            isOpen={isDialogOpen}
            onClose={() => setIsDialogOpen(false)}
            lat={modalLat}
            lng={modalLng}
            isGoogleMapsLoaded={isGoogleMapsLoaded}
          />
          {isMyFileBrowserOpen && <MyFileBrowser taskId={selectedTaskId} registro={taskRegisters} open ={isMyFileBrowserOpen} onClose={() => setIsMyFileBrowserOpen(false)} />} 

      </Container>
      </LoadScript>
      </ThemeProvider>
      </CacheProvider>
  </section>
  )
}

export default ManagerPage