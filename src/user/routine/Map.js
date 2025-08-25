import React, { useState, useEffect, useRef, useCallback } from "react";
import { GoogleMap, useJsApiLoader, Circle } from "@react-google-maps/api";
import RoutineData from "./RoutineData";

const containerStyle = {
  width: "100%",
  height: "50vh",
};

function MyMap({ onReady }) {
  const mapRef = useRef(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    version: "weekly",
  });

  const [center, setCenter] = useState(null);
  const [routineLocation, setRoutineLocation] = useState({
    lat: 37.5665,
    lng: 126.978,
  });
  const circleRef = useRef(null);

  const onCircleLoad = useCallback((circle) => {
    circleRef.current = circle;
  }, []);

  const onCircleUnmount = useCallback(() => {
    circleRef.current = null;
  }, []);

  // 드래그가 끝났을 때(원 이동) 중심 좌표를 상태에 반영
  const handleDragEnd = useCallback(() => {
    if (!circleRef.current) return;
    const pos = circleRef.current.getCenter().toJSON(); // { lat, lng }
    setRoutineLocation(pos);
  }, []);

  useEffect(() => {
    console.log(routineLocation);
    onReady(routineLocation);
  }, [routineLocation]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCenter({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
        },
        (err) => {
          console.error("위치 가져오기 실패:", err);
          // 실패하면 fallback으로 서울 시청
          setCenter({ lat: 37.5665, lng: 126.978 });
        }
      );
    } else {
      // geolocation 지원 안 하면 fallback
      setCenter({ lat: 37.5665, lng: 126.978 });
    }
  }, []);

  if (!isLoaded || !center) return <div>Loading...</div>;

  return (
    <>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={16}
        onLoad={(map) => (mapRef.current = map)}
      >
        <Circle
          onLoad={onCircleLoad}
          onUnmount={onCircleUnmount}
          center={center}
          radius={45}
          draggable // 중심 드래그로 이동
          onDragEnd={handleDragEnd}
          options={{
            strokeWeight: 2,
            fillOpacity: 0.15,
            strokeColor: "#1d4ed8",
            fillColor: "#3b82f6",
          }}
        />
      </GoogleMap>
      <div style={{ display: "none" }}>
        <RoutineData routineLoc={routineLocation} />
      </div>
    </>
  );
}

export default MyMap;
