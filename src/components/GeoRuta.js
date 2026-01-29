import { MapContainer, TileLayer, useMap } from "react-leaflet";
import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet-routing-machine";
import DefaultIcon from "../icon";

function GeoRouting({ destination }) {
    const map = useMap();
    const routingRef = useRef(null);

    useEffect(() => {
        if (!map) return;

        map.whenReady(() => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition((pos) => {
                    const { latitude, longitude } = pos.coords;

                    // Centrar el mapa en la ubicación del usuario
                    map.setView([latitude, longitude], 13);

                    // Crear marcador de ubicación actual
                    L.marker([latitude, longitude], { icon: DefaultIcon })
                        .addTo(map)
                        .bindPopup(`
                            <div style="text-align: center; padding: 10px;">
                                <div style="
                                    display: inline-block;
                                    padding: 6px 14px;
                                    background: linear-gradient(135deg, #10b98120 0%, #10b98140 100%);
                                    borderRadius: 20px;
                                    marginBottom: 8px;
                                    fontSize: 0.75rem;
                                    fontWeight: 600;
                                    color: #10b981;
                                    textTransform: uppercase;
                                    letterSpacing: 0.5px;
                                ">
                                    Tu Ubicación Actual
                                </div>
                                <strong style="display: block; fontSize: 1.2rem; color: #1e293b; marginTop: 6px; fontWeight: 700;">
                                    Punto de Partida
                                </strong>
                                <div style="
                                    marginTop: 10px;
                                    padding: 8px;
                                    background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
                                    borderRadius: 8px;
                                    fontSize: 0.8rem;
                                    color: #64748b;
                                ">
                                    Lat: ${latitude.toFixed(5)}<br/>
                                    Lng: ${longitude.toFixed(5)}
                                </div>
                            </div>
                        `);

                    // Crear la ruta
                    if (!routingRef.current) {
                        routingRef.current = L.Routing.control({
                            waypoints: [
                                L.latLng(latitude, longitude),
                                L.latLng(destination[0], destination[1])
                            ],
                            routeWhileDragging: true,
                            showAlternatives: false,
                            lineOptions: { 
                                styles: [{ 
                                    color: "#f63bce", 
                                    weight: 6,
                                    opacity: 0.85
                                }] 
                            },
                            router: L.Routing.osrmv1({
                                serviceUrl: "https://router.project-osrm.org/route/v1",
                                language: "es",
                            }),
                            createMarker: function (i, wp) {
                                if (i === 0) {
                                    return null;
                                }
                                
                                // Marcador de destino
                                const popupContent = `
                                    <div style="text-align: center; padding: 10px;">
                                        <div style="
                                            display: inline-block;
                                            padding: 6px 14px;
                                            background: linear-gradient(135deg, #ef444420 0%, #ef444440 100%);
                                            borderRadius: 20px;
                                            marginBottom: 8px;
                                            fontSize: 0.75rem;
                                            fontWeight: 600;
                                            color: #ef44d2;
                                            textTransform: uppercase;
                                            letterSpacing: 0.5px;
                                        ">
                                            Destino Final
                                        </div>
                                        <strong style="display: block; fontSize: 1.2rem; color: #1e293b; marginTop: 6px; fontWeight: 700;">
                                            Parque Querétaro 2000
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
                    }
                });
            }
        });
    }, [map, destination]);

    return null;
}

export default function GeoRuta({ onBack }) {
    const destinoFijo = [20.6032, -100.3921]; // Parque Querétaro 2000

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

                <GeoRouting destination={destinoFijo} />
            </MapContainer>
        </div>
    );
}