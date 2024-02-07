import React, { useRef, useEffect } from 'react';
import './Location.scss';

export const Location = () => {
  const mapContainerRef = useRef(null);

  useEffect(() => {
    // Obtiene la referencia al elemento del mapa
    const mapContainer = mapContainerRef.current;

    // Verifica si el elemento del mapa existe
    if (mapContainer) {
      const map = new window.google.maps.Map(mapContainer, {
        center: { lat: -32.1618678, lng: -64.1119261 },
        zoom: 15,
      });

      const marker = new window.google.maps.Marker({
        position: { lat: -32.1618678, lng: -64.1119261 },
        map: map,
        title: 'Grupo Scout 331 Gral. Manuel Nicolas Savio',
      });
    }
  }, []);

  return (
    <div>
      <div ref={mapContainerRef} className="mapContainer"></div>
    </div>
  );
};
