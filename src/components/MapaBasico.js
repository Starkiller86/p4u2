import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import DefaultIcon from "../icon";

export default function MapaBasico({ onBack }) {
    return (
        <div style={{ height: "100%", width: "100%", position: "relative" }}>
            <button className="back-button" onClick={onBack}>
                Regresar
            </button>

            <MapContainer 
                center={[20.563726,-100.436368]} 
                zoom={13} 
                style={{ height: "100%", width: "100%" }}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="&copy; OpenStreetMap contributors"
                />

                <Marker position={[20.563726,-100.436368]} icon={DefaultIcon}>
                    <Popup>
                        <div style={{ textAlign: 'center', padding: '8px' }}>
                            <strong style={{ 
                                fontSize: '1.2rem', 
                                color: '#3b82f6',
                                display: 'block',
                                marginBottom: '8px'
                            }}>
                                Puerta Real, Querétaro
                            </strong>
                            <p style={{ 
                                margin: '0', 
                                color: '#64748b',
                                fontSize: '0.95rem',
                                lineHeight: '1.5'
                            }}>
                                Ubicación central de la ciudad
                            </p>
                            <div style={{
                                marginTop: '10px',
                                padding: '6px 12px',
                                background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
                                borderRadius: '8px',
                                fontSize: '0.85rem',
                                color: '#1e40af'
                            }}>
                                Lat: 20.563726 | Lng: -100.436368
                            </div>
                        </div>
                    </Popup>
                </Marker>
            </MapContainer>
        </div>
    );
}