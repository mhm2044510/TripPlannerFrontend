import { useEffect, useMemo } from "react";
import {
  CircleMarker,
  MapContainer,
  Polyline,
  TileLayer,
  Tooltip,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

function FitRoute({ points }) {
  const map = useMap();

  useEffect(() => {
    // fitBounds throws on an empty array, so guard it
    if (!points || points.length < 2) return;
    map.fitBounds(points, { padding: [42, 42] });
  }, [map, points]);

  return null;
}

export default function RouteMap({ route = [], current, pickup, dropoff }) {
  // While the route is still loading, fit to the three stops instead
  const boundsPoints = useMemo(
    () => (route.length > 1 ? route : [current, pickup, dropoff]),
    [route, current, pickup, dropoff],
  );

  const markers = [
    { point: current, label: "Current location", color: "#38bdf8" },
    { point: pickup, label: "Pickup", color: "#fbbf24" },
    { point: dropoff, label: "Drop-off", color: "#a3e635" },
  ];

  return (
    <MapContainer
      attributionControl
      center={current}
      className="h-full min-h-[360px] w-full sm:min-h-[470px]"
      zoom={7}
      zoomControl
    >
      {/* dark basemap to match the dashboard */}
      <TileLayer url="https://tile.openstreetmap.org/{z}/{x}/{y}.png" />

      <FitRoute points={boundsPoints} />

      {route.length > 1 && (
        <Polyline
          pathOptions={{ color: "#a3e635", weight: 5, opacity: 0.9 }}
          positions={route}
        />
      )}

      {markers.map((marker) => (
        <CircleMarker
          center={marker.point}
          fillOpacity={1}
          key={marker.label}
          pathOptions={{ color: "#020617", fillColor: marker.color, weight: 4 }}
          radius={9}
        >
          <Tooltip direction="top" offset={[0, -8]} permanent>
            {marker.label}
          </Tooltip>
        </CircleMarker>
      ))}
    </MapContainer>
  );
}
