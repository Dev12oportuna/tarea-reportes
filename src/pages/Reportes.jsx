import React, { useEffect, useState, Component } from 'react'
import axios from "axios"
import { useMediaQuery } from "@mui/material";
import MUIDataTable from "mui-datatables";
import createCache from "@emotion/cache";
import { Grid, Button, Container, Box } from '@mui/material';
import { ThemeProvider } from "@mui/material/styles";
import { createTheme } from "@mui/material/styles";
import { CacheProvider } from "@emotion/react";
import BarChart from "../components/BarChart"
import LineChart from "../components/LineChart"
import PieChart from "../components/PieChart"
import LocationDialog from "../components/LocationDialog"; 
import { LoadScript } from "@react-google-maps/api";
import utc from "dayjs/plugin/utc"
import dayjs from "dayjs"
import { useAuth } from "../context/authContext";
import { MyFileBrowser } from '../components/MyFileBrowser';


const muiCache = createCache({
    key: "mui-datatables",
    prepend: true
  });

const Reportes = () => {

  const [showBarChart, setShowBarChart] = useState(false);
  const [showLineChart, setShowLineChart] = useState(false);
  const [showPieChart, setShowPieChart] = useState(false);
  const [responsive, setResponsive] = useState("horizontal");
  const [tableBodyHeight, setTableBodyHeight] = useState("400px");
  const [tableBodyMaxHeight, setTableBodyMaxHeight] = useState("");
  const isSmallScreen = useMediaQuery("(max-width:600px)")
  const [isReadyForInstall, setIsReadyForInstall] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [modalLat, setModalLat] = useState(0);
  const [modalLng, setModalLng] = useState(0);
  const {user} = useAuth()
  const [data, setData] = useState([]);
  const [isMyFileBrowserOpen, setIsMyFileBrowserOpen] = useState(false);
  const [ registroID, setRegistroID] = useState(null)

  
  const [isGoogleMapsLoaded, setIsGoogleMapsLoaded] = useState(false);
  const api_key = process.env.REACT_APP_API_KEY 

  const handleFile = (uniqueId) => {
    setIsMyFileBrowserOpen(true)
    setRegistroID(uniqueId)
  }
  
  
  const columns = [
    { name: "Estudiante", options: { filterOptions: { fullWidth: true } } },
    "Funcionario",
    "Fecha",
    "Tipo",
    "Observa",
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
            <button onClick={() => handleFile(rowData.idUnico)}>
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
  ];
  

  const options = {
    responsive: isSmallScreen ? "stacked" : responsive,
    tableBodyHeight: isSmallScreen ? "auto" : tableBodyHeight,
    tableBodyMaxHeight: isSmallScreen ? "none" : tableBodyMaxHeight,
    /* onTableChange: (action, state) => {
      console.log(action);
      console.dir(state);
    }*/
  }; 

  
  
  const peticionGet =  async () => {
    try {
        const response = await axios.post("https://sm.oportuna.red/getReportes", { email: user.Email});
        const formattedData = response.data.map((item) => ({
          idUnico: item.idUnico,
          Estudiante: item.cliente,
          Funcionario: item.funcionario,
          Fecha: dayjs.utc(item.fecha).format('DD/MM/YYYY'),
          Latitud: item.lat,
          Longitud: item.lng,
          Tipo: item.tipo,
          Observa: item.identificadorTipo
        


      }));
      setData(formattedData); 

      //console.log(formattedData)
    } catch (error) {
      console.error("Error fetching data:", error);
    }
} 

  useEffect(() => {
    peticionGet();
  }, [])

  useEffect(() => {
    window.addEventListener("beforeinstallprompt", (event) => {
      // Prevent the mini-infobar from appearing on mobile.
      event.preventDefault();
      //console.log("👍", "beforeinstallprompt", event);
      // Stash the event so it can be triggered later.
      window.deferredPrompt = event;
      // Remove the 'hidden' class from the install button container.
      setIsReadyForInstall(true);
    });
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
  
  return (
    <CacheProvider value={muiCache}>
      <ThemeProvider theme={createTheme()}>
      <LoadScript googleMapsApiKey={api_key} libraries={["places"]}>
      <Container maxWidth="lg">
          <Box mt={2} mb={2}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                {/* Botones para mostrar/ocultar los gráficos */}
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} sm={4}>
                    <Button
                      className="button-19"
                      variant="outlined"
                      color="primary"
                      fullWidth
                      onClick={() => setShowBarChart(!showBarChart)}
                    >
                      {showBarChart ? 'Ocultar' : 'Grafica De Barras'}
                    </Button>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Button
                      className="button-19"
                      variant="outlined"
                      color="primary"
                      fullWidth
                      onClick={() => setShowLineChart(!showLineChart)}
                    >
                      {showLineChart ? 'Ocultar' : 'Grafica lineal'}
                    </Button>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Button
                      className="button-19"
                      variant="outlined"
                      color="primary"
                      fullWidth
                      onClick={() => setShowPieChart(!showPieChart)}
                    >
                      {showPieChart ? 'Ocultar' : 'Grafica Circular'}
                    </Button>
                  </Grid>
                  
                </Grid>
              </Grid>

              {/* Mostrar el gráfico BarChart si showBarChart es true */}
              {showBarChart && (
                <Grid item xs={12} sm={6} md={4}>
                  <BarChart />
                </Grid>
              )}

              {/* Mostrar el gráfico LineChart si showLineChart es true */}
              {showLineChart && (
                <Grid item xs={12} sm={6} md={4}>
                  <LineChart />
                </Grid>
              )}

              {/* Mostrar el gráfico PieChart si showPieChart es true */}
              {showPieChart && (
                <Grid item xs={12} sm={6} md={4}>
                  <PieChart />
                </Grid>
              )}

              <Grid item xs={12}>
                {/* Tabla MUIDataTable */}
                <MUIDataTable
                  title={'Reporte'}
                  data={data}
                  columns={columns}
                  options={options}
                
                />
              </Grid>

            
            </Grid>
          </Box>
          <LocationDialog
            isOpen={isDialogOpen}
            onClose={() => setIsDialogOpen(false)}
            lat={modalLat}
            lng={modalLng}
            isGoogleMapsLoaded={isGoogleMapsLoaded}

          />
          {isMyFileBrowserOpen && <MyFileBrowser taskId={1} registro={registroID} open ={isMyFileBrowserOpen} onClose={() => setIsMyFileBrowserOpen(false)} />} 
        </Container>
        </LoadScript>
      </ThemeProvider>
    </CacheProvider>
  )
}

export default Reportes