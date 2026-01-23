import { MapContainer, TileLayer, useMap } from "react-leaflet";
import { useEffect } from "react";
import L from "leaflet";
import DefaultIcon from "../icon";

function LocationMarker() {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    map.whenReady(() => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((pos) => {
          const { latitude, longitude } = pos.coords;

          setTimeout(() => {
            map.setView([latitude, longitude], 13);

            L.marker([latitude, longitude], { icon: DefaultIcon })
              .addTo(map)
              .bindPopup(`
                <div style="text-align: center; padding: 8px;">
                  <strong style="font-size: 1.2rem; color: #3b82f6; display: block; margin-bottom: 8px;">
                    Tu Ubicación Actual
                  </strong>
                  <p style="margin: 0 0 10px 0; color: #64748b; font-size: 0.95rem;">
                    Detectada mediante GPS
                  </p>
                  <div style="
                    display: grid; 
                    grid-template-columns: 1fr 1fr; 
                    gap: 8px; 
                    margin-top: 10px;
                  ">
                    <div style="
                      padding: 8px; 
                      background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); 
                      border-radius: 8px;
                    ">
                      <div style="font-size: 0.75rem; color: #64748b; margin-bottom: 2px;">Latitud</div>
                      <div style="font-size: 0.9rem; color: #1e40af; font-weight: 600;">${latitude.toFixed(5)}</div>
                    </div>
                    <div style="
                      padding: 8px; 
                      background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); 
                      border-radius: 8px;
                    ">
                      <div style="font-size: 0.75rem; color: #64748b; margin-bottom: 2px;">Longitud</div>
                      <div style="font-size: 0.9rem; color: #1e40af; font-weight: 600;">${longitude.toFixed(5)}</div>
                    </div>
                  </div>
                </div>
              `)
              .openPopup();
          }, 100);
        });
      }
    });
  }, [map]);

  return null;
}

export default function Geolocalizacion({ onBack }) {
    return (
        <div style={{ height: "100%", width: "100%", position: "relative" }}>
            <button className="back-button" onClick={onBack}>
                Regresar
            </button>

            <MapContainer 
                center={[20.5888, -100.3899]}
                zoom={13}
                style={{ height: "100%", width: "100%" }}
            >
                <TileLayer 
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="&copy; OpenStreetMap contributors"
                />
                <LocationMarker />
            </MapContainer>
        </div>
    );
}