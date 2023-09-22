import MUIDataTable from "mui-datatables";
import React, { useEffect, useState } from "react";
import { ThemeProvider } from "@mui/material/styles";
import { createTheme } from "@mui/material/styles";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import axios from "axios"
import BarChart from "./components/BarChart"
import LineChart from "./components/LineChart"
import PieChart from "./components/PieChart"
import { useMediaQuery } from "@mui/material";
import { Grid, Button, Container, Box } from '@mui/material';
import "./App.css"



const muiCache = createCache({
  key: "mui-datatables",
  prepend: true
});

function App() {
  const [responsive, setResponsive] = useState("horizontal");
  const [tableBodyHeight, setTableBodyHeight] = useState("400px");
  const [tableBodyMaxHeight, setTableBodyMaxHeight] = useState("");
  
  const isSmallScreen = useMediaQuery("(max-width:600px)")
  const columns = [
    { name: "Cliente", options: { filterOptions: { fullWidth: true } } },
    "Funcionario",
    "Fecha",
    "Latitud",
    "longitud",
    "Tipo"
  ];
  const [isReadyForInstall, setIsReadyForInstall] = useState(false);

  const options = {
  
    responsive: isSmallScreen ? "stacked" : responsive,
    tableBodyHeight: isSmallScreen ? "auto" : tableBodyHeight,
    tableBodyMaxHeight: isSmallScreen ? "none" : tableBodyMaxHeight,
    onTableChange: (action, state) => {
      console.log(action);
      console.dir(state);
    }
  };

  const [data, setData] = useState([]);
  
  const peticionGet =  async () => {
    try {
      const response = await axios.get("http://localhost:3001/get_reportes");
      const formattedData = response.data.map((item) => ({
        Cliente: item.cliente,
        Funcionario: item.funcionario,
        Fecha: item.fecha,
        Latitud: item.lat,
        Longitud: item.lng,
        Tipo: item.tipo
      }));
      setData(formattedData); 
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
      console.log("👍", "beforeinstallprompt", event);
      // Stash the event so it can be triggered later.
      window.deferredPrompt = event;
      // Remove the 'hidden' class from the install button container.
      setIsReadyForInstall(true);
    });
  }, [])

  async function downloadApp() {
    console.log("👍", "butInstall-clicked");
    const promptEvent = window.deferredPrompt;
    if (!promptEvent) {
      // The deferred prompt isn't available.
      console.log("oops, no prompt event guardado en window");
      return;
    }
    // Show the install prompt.
    promptEvent.prompt();
    // Log the result
    const result = await promptEvent.userChoice;
    console.log("👍", "userChoice", result);
    // Reset the deferred prompt variable, since
    // prompt() can only be called once.
    window.deferredPrompt = null;
    // Hide the install button.
    setIsReadyForInstall(false);
  }
  
  const [showBarChart, setShowBarChart] = useState(false);
  const [showLineChart, setShowLineChart] = useState(false);
  const [showPieChart, setShowPieChart] = useState(false);
  

  return (
    <CacheProvider value={muiCache}>
      <ThemeProvider theme={createTheme()}>
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
                      {showBarChart ? 'Ocultar BarChart' : 'Mostrar BarChart'}
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
                      {showLineChart ? 'Ocultar LineChart' : 'Mostrar LineChart'}
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
                      {showPieChart ? 'Ocultar PieChart' : 'Mostrar PieChart'}
                    </Button>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    {isReadyForInstall && <Button
                      className=""
                      variant="outlined"
                      color="success"
                      fullWidth
                      onClick={downloadApp}
                    >Descargar App
                      
                    </Button>}
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
                {/* Tu tabla MUIDataTable */}
                <MUIDataTable
                  title={'Reporte'}
                  data={data}
                  columns={columns}
                  options={options}
                />
              </Grid>
            </Grid>
          </Box>
        </Container>
      </ThemeProvider>
    </CacheProvider>
  );
}

export default App;

