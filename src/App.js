import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css"
import Reportes from "./pages/Reportes.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import TaskFormPage from "./pages/TaskFormPage.jsx";
import TasksPage from "./pages/TasksPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import { TaskProvider } from "./context/TasksContext.jsx";
import { AuthProvider } from "./context/authContext.jsx";
import Navbar from "./components/Navbar.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";
import 'jquery';
import ManagerPage from "./pages/ManagerPage.jsx";
import { useAuth } from "./context/authContext.jsx";
/* import dotenv from 'dotenv';
dotenv.config();
 */


function App() {
  
  const {managerUser} = useAuth()

  async function downloadApp() {
    console.log("👍", "butInstall-clicked");
    const promptEvent = window.deferredPrompt;
    if (!promptEvent) {
      // The deferred prompt isn't available.
      //console.log("oops, no prompt event guardado en window");
      return;
    }
    // Show the install prompt.
    promptEvent.prompt();
    // Log the result
    const result = await promptEvent.userChoice;
    //console.log("👍", "userChoice", result);
    // Reset the deferred prompt variable, since
    // prompt() can only be called once.
    window.deferredPrompt = null;
    // Hide the install button.
    setIsReadyForInstall(false);
  }

  

  return (

    <AuthProvider>
      <TaskProvider>
        <BrowserRouter>
          <main className="container mx-auto px-8">
            <Navbar />
            <Routes>
              <Route path="/" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              <Route element={<ProtectedRoute />}>
                <Route path="/tasks" element={<TasksPage />} />
                <Route path="/add-task" element={<TaskFormPage />} />
                <Route path="/tasks/:id" element={<TaskFormPage />} />
                <Route path="/reportes" element={<Reportes />} />
              {managerUser ? (
                  <Route path="/admin-tasks" element={<ManagerPage />} />
                ) : null}
              </Route>
            </Routes>
          </main>
        </BrowserRouter>
      </TaskProvider>
    </AuthProvider>
  );
}

export default App;

{/* <Grid item xs={12} sm={4}>
                    {isReadyForInstall && <Button
                      className=""
                      variant="outlined"
                      color="success"
                      fullWidth
                      onClick={downloadApp}
                    >Descargar App
                      
                    </Button>}
                  </Grid> */}