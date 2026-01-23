import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import DefaultIcon from "../icon";

const lugares = [
    { 
        nombre: "Café Central", 
        coords: [20.5895, -100.389], 
        categoria: "Gastronomía",
        color: "#f59e0b"
    },
    { 
        nombre: "Biblioteca UTEQ", 
        coords: [20.593, -100.3875], 
        categoria: "Educación",
        color: "#3b82f6"
    },
    { 
        nombre: "Parque Querétaro 2000", 
        coords: [20.6032, -100.3921], 
        categoria: "Recreación",
        color: "#10b981"
    },
    { 
        nombre: "Anterior Casa", 
        coords: [20.561111, -100.382185], 
        categoria: "Residencial",
        color: "#8b5cf6"
    },
];

export default function Marcadores({ onBack }) {
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

                {lugares.map((lugar, idx) => (
                    <Marker key={idx} position={lugar.coords} icon={DefaultIcon}>
                        <Popup>
                            <div style={{ textAlign: 'center', padding: '10px', minWidth: '200px' }}>
                                <div style={{
                                    display: 'inline-block',
                                    padding: '4px 12px',
                                    background: `linear-gradient(135deg, ${lugar.color}20 0%, ${lugar.color}40 100%)`,
                                    borderRadius: '20px',
                                    marginBottom: '10px',
                                    fontSize: '0.8rem',
                                    fontWeight: '600',
                                    color: lugar.color,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px'
                                }}>
                                    {lugar.categoria}
                                </div>
                                <strong style={{ 
                                    fontSize: '1.3rem', 
                                    color: '#1e293b',
                                    display: 'block',
                                    marginBottom: '10px',
                                    fontWeight: '700'
                                }}>
                                    {lugar.nombre}
                                </strong>
                                <div style={{
                                    marginTop: '12px',
                                    padding: '8px',
                                    background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
                                    borderRadius: '8px',
                                    fontSize: '0.85rem',
                                    color: '#64748b'
                                }}>
                                    <div style={{ marginBottom: '4px' }}>
                                        <strong>Lat:</strong> {lugar.coords[0].toFixed(5)}
                                    </div>
                                    <div>
                                        <strong>Lng:</strong> {lugar.coords[1].toFixed(5)}
                                    </div>
                                </div>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
}