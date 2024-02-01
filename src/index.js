import React from 'react';
import ReactDOM from 'react-dom/client';
import * as serviceWorkerRegistration from "./serviceWorkerRegistration.js"
import App from './App.js';
import { setChonkyDefaults } from 'chonky';
import { ChonkyIconFA } from 'chonky-icon-fontawesome';
import { AuthProvider } from './context/authContext.jsx';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
//import { Auth0Provider } from '@auth0/auth0-react';

//import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* <Auth0Provider 
    domain="dev-j55wwx3m21kqeokl.us.auth0.com"
    clientId="cRVb3qouLK8bBN3eo6IFwltI9zYlJLSl"
    authorizationParams={{
      redirect_uri: window.location.origin
    }}
    >
      </Auth0Provider> */}
      <AuthProvider>

        <App />
      </AuthProvider>


   
  </React.StrictMode>
);

setChonkyDefaults({ iconComponent: ChonkyIconFA });

serviceWorkerRegistration.register({
  onUpdate: async (registration) => {
    // Corremos este código si hay una nueva versión de nuestra app
    // Detalles en: https://developers.google.com/web/fundamentals/primers/service-workers/lifecycle
    if (registration && registration.waiting) {
      await registration.unregister();
      registration.waiting.postMessage({type: "SKIP_WAITING"});
      // Des-registramos el SW para recargar la página y obtener la nueva versión. Lo cual permite que el navegador descargue lo nuevo y que invalida la cache que tenía previamente.
      window.location.reload();
    }
  },
});

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
//reportWebVitals();
