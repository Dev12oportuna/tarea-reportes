import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale } from "chart.js"
import { useAuth } from '../context/authContext';


ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement
)


const BarChart = () => {
  const [data, setData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Cantidad de Registros por Estudiante',
        data: [],
        backgroundColor: []
      }
    ],
  });

  const [dataLoaded, setDataLoaded] = useState(false)
  const {user} = useAuth()


  useEffect(() => {
    if (!dataLoaded) {
      axios.post("https://sm.oportuna.red/getReportes", {email: user.Email})
        .then((response) => {
          const datos = response.data;
  
          // Contar la cantidad de veces que aparece cada cliente
          const clienteCounts = {};
          datos.forEach((item) => {
            const cliente = item.cliente;
            if (!clienteCounts[cliente]) {
              clienteCounts[cliente] = 0;
            }
            clienteCounts[cliente]++;
          });
  
          // Extraer los clientes únicos y la cantidad de registros
          const clientes = Object.keys(clienteCounts);
          const cantidadRegistros = Object.values(clienteCounts);
  
          const backgroundColors = clientes.map(() => {
            const color = `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 1)`;
            return color;
          });
  
          // Utiliza una función de actualización para setData
          setData((prevData) => ({
            ...prevData,
            labels: clientes,
            datasets: [
              {
                ...prevData.datasets[0],
                data: cantidadRegistros,
                backgroundColor: backgroundColors
              },
            ],
          }));
  
          // Marcar los datos como cargados
          setDataLoaded(true);
        })
        .catch((error) => {
          console.error('Error al obtener los datos del API:', error);
        });
    }
  }, [dataLoaded, setData]);

  const options = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };
  return (
    <div style={{ maxWidth:'700'}}>
      <Bar
      data={data}
      height={300}
      options={options}
      />
    </div>
  )
}



export default BarChart;

