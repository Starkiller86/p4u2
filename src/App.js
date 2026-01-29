import { useState } from "react";
import MapaBasico from "./components/MapaBasico.js";
import Geolocalizacion from "./components/Geolocalizacion.js";
import Marcadores from "./components/Marcadores.js";
import Ruta from "./components/Ruta.js";
import GeoRuta from "./components/GeoRuta.js";
import SearchRoute from "./components/SearchRoute.js"; // NEW IMPORT

export default function App() {
  const [vista, setVista] = useState(null);

  const handleBack = () => setVista(null);

  return (
    <div className="app-container">
      {/* Header con título y botones */}
      <div className="app-header">
        <h1 className="app-title">OpenStreetMap React Demo</h1>
        <div className="button-container">
          <button className="nav-button" onClick={() => setVista("basico")}>
            Mapa Básico
          </button>
          <button className="nav-button" onClick={() => setVista("geo")}>
            Geolocalización
          </button>
          <button className="nav-button" onClick={() => setVista("marcadores")}>
            Marcadores
          </button>
          <button className="nav-button" onClick={() => setVista("ruta")}>
            Navegación
          </button>
          <button className="nav-button" onClick={() => setVista("georuta")}>
            Geo + Ruta
          </button>
          <button className="nav-button" onClick={() => setVista("search")}>
            Buscador
          </button>
        </div>
      </div>

      {/* Contenedor del mapa */}
      <div className="map-container">
        {vista === "basico" && <MapaBasico onBack={handleBack} />}
        {vista === "geo" && <Geolocalizacion onBack={handleBack} />}
        {vista === "marcadores" && <Marcadores onBack={handleBack} />}
        {vista === "ruta" && <Ruta onBack={handleBack} />}
        {vista === "georuta" && <GeoRuta onBack={handleBack} />}
        {vista === "search" && <SearchRoute onBack={handleBack} />}

        {!vista && (
          <div className="welcome-message">
            <h2 className="welcome-title">Bienvenido al Demo Interactivo</h2>
            <p className="welcome-subtitle">
              Selecciona una opción del menú superior para explorar las diferentes funcionalidades de OpenStreetMap con React
            </p>
          </div>
        )}
      </div>
    </div>
  );
}