import { useState } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet-routing-machine";
import DefaultIcon from "../icon";

// Geocoding function
async function geocodeAddress(address) {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data && data.length > 0) {
            return {
                lat: parseFloat(data[0].lat),
                lng: parseFloat(data[0].lon),
                displayName: data[0].display_name
            };
        }
        return null;
    } catch (error) {
        console.error("Error en geocodificación:", error);
        return null;
    }
}

// Routing component with geolocation
function GeoRouting({ destination, destinationName }) {
    const map = useMap();
    const routingRef = useRef(null);
    const markersRef = useRef([]);

    useEffect(() => {
        if (!map || !destination) return;

        let isMounted = true;

        const setupRoute = async () => {
            try {
                const position = await new Promise((resolve, reject) => {
                    navigator.geolocation.getCurrentPosition(resolve, reject);
                });

                if (!isMounted || !map) return;

                const { latitude, longitude } = position.coords;

                // limpiar marcadores anteriores
                markersRef.current.forEach(marker => {
                    if (map.hasLayer(marker)) map.removeLayer(marker);
                });
                markersRef.current = [];

                map.setView([latitude, longitude], 13);

                const userMarker = L.marker([latitude, longitude], { icon: DefaultIcon }).addTo(map);
                markersRef.current.push(userMarker);

                // borrar routing anterior de forma segura
                if (routingRef.current && map._controlCorners) {
                    try {
                        map.removeControl(routingRef.current);
                    } catch { }
                    routingRef.current = null;
                }

                // crear nueva ruta
                const routing = L.Routing.control({
                    waypoints: [
                        L.latLng(latitude, longitude),
                        L.latLng(destination.lat, destination.lng)
                    ],
                    routeWhileDragging: false,
                    addWaypoints: false,
                    draggableWaypoints: false,
                    fitSelectedRoutes: true,
                    showAlternatives: false,
                    lineOptions: {
                        styles: [{ color: "#f63bce", weight: 6, opacity: 0.85 }]
                    },
                    router: L.Routing.osrmv1({
                        serviceUrl: "https://router.project-osrm.org/route/v1",
                        language: "es",
                    }),
                    createMarker: (i, wp) => i === 0 ? null : L.marker(wp.latLng, { icon: DefaultIcon })
                }).addTo(map);

                routingRef.current = routing;

            } catch (err) {
                console.error("Geolocalización falló:", err);
            }
        };

        setupRoute();

        return () => {
            isMounted = false;

            // cleanup SEGURO
            if (routingRef.current && map && map._controlCorners) {
                try {
                    map.removeControl(routingRef.current);
                } catch { }
                routingRef.current = null;
            }

            markersRef.current.forEach(marker => {
                if (map && map.hasLayer(marker)) {
                    map.removeLayer(marker);
                }
            });
            markersRef.current = [];
        };

    }, [map, destination]);


    return null;
}

// Main SearchRoute Component
export default function SearchRoute({ onBack }) {
    const [searchQuery, setSearchQuery] = useState("");
    const [destination, setDestination] = useState(null);
    const [destinationName, setDestinationName] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const [error, setError] = useState("");

    const handleSearch = async () => {
        if (!searchQuery.trim()) {
            setError("Por favor ingresa una ubicación");
            return;
        }

        setIsSearching(true);
        setError("");

        const result = await geocodeAddress(searchQuery);

        if (result) {
            setDestination({ lat: result.lat, lng: result.lng });
            setDestinationName(result.displayName);
            setError("");
        } else {
            setError("No se encontró la ubicación. Intenta con otra búsqueda.");
            setDestination(null);
        }

        setIsSearching(false);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const handleClearSearch = () => {
        setSearchQuery("");
        setDestination(null);
        setDestinationName("");
        setError("");
    };

    return (
        <div style={{ height: "100%", width: "100%", position: "relative" }}>
            {/* Back button */}
            <button className="back-button" onClick={onBack}>
                Regresar
            </button>

            {/* Search bar overlay */}
            <div style={{
                position: "absolute",
                top: "24px",
                right: "80vh",
                zIndex: 1000,
                display: "flex",
                flexDirection: "column",
                gap: "12px",
                maxWidth: "400px",
                width: "calc(100% - 180px)"
            }}>
                {/* Search input */}
                <div style={{
                    display: "flex",
                    gap: "8px",
                    background: "white",
                    borderRadius: "12px",
                    padding: "8px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                    border: "2px solid rgba(139, 92, 246, 0.3)"
                }}>
                    <div style={{ position: "relative", flex: 1 }}>
                        <span style={{
                            position: "absolute",
                            left: "12px",
                            top: "50%",
                            transform: "translateY(-50%)",
                            color: "#8b5cf6",
                            fontSize: "1.2rem"
                        }}>
                        </span>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Ej: Querétaro, México"
                            style={{
                                width: "100%",
                                padding: "10px 36px 10px 40px",
                                border: "none",
                                borderRadius: "8px",
                                fontSize: "0.95rem",
                                outline: "none",
                                background: "#f8f9fa",
                                boxSizing: "border-box"
                            }}
                        />
                        {searchQuery && (
                            <button
                                onClick={handleClearSearch}
                                style={{
                                    position: "absolute",
                                    right: "8px",
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                    background: "none",
                                    border: "none",
                                    cursor: "pointer",
                                    padding: "4px",
                                    display: "flex",
                                    alignItems: "center",
                                    color: "#64748b",
                                    fontSize: "1.2rem"
                                }}
                            >
                                ✕
                            </button>
                        )}
                    </div>

                    <button
                        onClick={handleSearch}
                        disabled={isSearching}
                        style={{
                            padding: "10px 20px",
                            background: isSearching ? "#94a3b8" : "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
                            color: "white",
                            border: "none",
                            borderRadius: "8px",
                            cursor: isSearching ? "not-allowed" : "pointer",
                            fontWeight: "600",
                            fontSize: "0.95rem",
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            transition: "all 0.3s",
                            whiteSpace: "nowrap"
                        }}
                    >
                        {isSearching ? (
                            <>
                                <span className="spinner">⟳</span>
                                Buscando
                            </>
                        ) : (
                            <>
                                <span>🔍</span>
                                Buscar
                            </>
                        )}
                    </button>
                </div>

                {/* Error message */}
                {error && (
                    <div style={{
                        padding: "12px 16px",
                        background: "rgba(239, 68, 68, 0.1)",
                        border: "1px solid rgba(239, 68, 68, 0.3)",
                        borderRadius: "8px",
                        color: "#dc2626",
                        fontSize: "0.9rem",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
                    }}>
                        {error}
                    </div>
                )}

                {/* Success message */}
                {destination && destinationName && (
                    <div style={{
                        padding: "12px 16px",
                        background: "rgba(16, 185, 129, 0.1)",
                        border: "1px solid rgba(16, 185, 129, 0.3)",
                        borderRadius: "8px",
                        color: "#059669",
                        fontSize: "0.9rem",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
                    }}>
                        Ruta calculada hacia: {destinationName.split(',')[0]}
                    </div>
                )}
            </div>

            {/* Map */}
            {destination ? (
                <MapContainer
                    center={[destination.lat, destination.lng]}
                    zoom={13}
                    style={{ height: "100%", width: "100%" }}
                >
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution="&copy; OpenStreetMap contributors"
                    />
                    <GeoRouting destination={destination} destinationName={destinationName} />
                </MapContainer>
            ) : (
                <div style={{
                    height: "100%",
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)"
                }}>
                    <div style={{ textAlign: "center", padding: "2rem", maxWidth: "500px" }}>
                        <div style={{
                            width: "80px",
                            height: "80px",
                            margin: "0 auto 1.5rem",
                            background: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            boxShadow: "0 8px 24px rgba(139, 92, 246, 0.3)",
                            fontSize: "2.5rem"
                        }}>
                            📍
                        </div>
                        <h2 style={{
                            color: "#1e293b",
                            fontSize: "1.8rem",
                            marginBottom: "0.75rem",
                            fontWeight: "800"
                        }}>
                            Busca tu Destino
                        </h2>
                        <p style={{
                            color: "#64748b",
                            fontSize: "1.05rem",
                            lineHeight: "1.6",
                            marginBottom: "1rem"
                        }}>
                            Ingresa una dirección, negocio o lugar en el buscador para calcular la ruta desde tu ubicación actual
                        </p>
                        <div style={{
                            padding: "1rem",
                            background: "rgba(139, 92, 246, 0.1)",
                            borderRadius: "12px",
                            marginTop: "1.5rem"
                        }}>
                            <p style={{
                                color: "#6d28d9",
                                fontSize: "0.9rem",
                                margin: 0,
                                fontWeight: "600"
                            }}>
                                💡 Ejemplos: "Querétaro, México", "Parque Querétaro 2000", "Biblioteca UTEQ"
                            </p>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .spinner {
          display: inline-block;
          animation: spin 1s linear infinite;
        }
      `}</style>
        </div>
    );
}