import { MapContainer, TileLayer, useMap } from "react-leaflet";
import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet-routing-machine";
import DefaultIcon from "../icon";

function Routing({ from, to }) {
    const map = useMap();
    const routingRef = useRef(null);

    useEffect(() => {
        if(!map) return;

        if(!routingRef.current){
            routingRef.current = L.Routing.control({
                waypoints: [L.latLng(from[0], from[1]), L.latLng(to[0], to[1])],
                routeWhileDragging: true,
                showAlternatives: false,
                lineOptions: { 
                    styles: [{ 
                        color: "#f63ba2", 
                        weight: 6,
                        opacity: 0.85
                    }] 
                },
                router: L.Routing.osrmv1({
                    serviceUrl: "https://router.project-osrm.org/route/v1",
                    language: "es",
                }),
                createMarker: function (i, wp) {
                    const isStart = i === 0;
                    const popupContent = `
                        <div style="text-align: center; padding: 10px;">
                            <div style="
                                display: inline-block;
                                padding: 6px 14px;
                                background: linear-gradient(135deg, ${isStart ? '#10b981' : '#ef4444'}20 0%, ${isStart ? '#10b981' : '#ef4444'}40 100%);
                                borderRadius: 20px;
                                marginBottom: 8px;
                                fontSize: 0.75rem;
                                fontWeight: 600;
                                color: ${isStart ? '#10b981' : '#ef4444'};
                                textTransform: uppercase;
                                letterSpacing: 0.5px;
                            ">
                                ${isStart ? 'Punto de Inicio' : 'Destino Final'}
                            </div>
                            <strong style="display: block; fontSize: 1.2rem; color: #1e293b; marginTop: 6px; fontWeight: 700;">
                                ${isStart ? 'Biblioteca UTEQ' : 'Parque Querétaro 2000'}
                            </strong>
                            <div style="
                                marginTop: 10px;
                                padding: 8px;
                                background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
                                borderRadius: 8px;
                                fontSize: 0.8rem;
                                color: #64748b;
                            ">
                                Lat: ${wp.latLng.lat.toFixed(5)}<br/>
                                Lng: ${wp.latLng.lng.toFixed(5)}
                            </div>
                        </div>
                    `;
                    
                    return L.marker(wp.latLng, {
                        icon: DefaultIcon,
                    }).bindPopup(popupContent);
                },
            }).addTo(map);
        } else {
            routingRef.current.setWaypoints([
                L.latLng(from[0], from[1]),
                L.latLng(to[0], to[1]),
            ]);
        }
    }, [map, from, to]);

    return null;
}

export default function Ruta({ onBack }) {
    return (
        <div style={{ height: "100%", width: "100%", position: "relative" }}>
            <button className="back-button" onClick={onBack}>
                Regresar
            </button>

            <MapContainer
                center={[20.5981, -100.3898]}
                zoom={13}
                style={{ height: "100%", width: "100%" }}
            >
                <TileLayer 
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" 
                    attribution="&copy; OpenStreetMap contributors"
                />

                <Routing from={[20.593, -100.3875]} to={[20.6032, -100.3921]}/>
            </MapContainer>
        </div>
    );
}