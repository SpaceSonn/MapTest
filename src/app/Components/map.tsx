'use client'
import 'flowbite';
import React, { useState, useEffect } from 'react';
import { GoogleMap, useLoadScript, MarkerF } from '@react-google-maps/api';
import { getDistance } from 'geolib';
import { InfoWindowF } from '@react-google-maps/api';
import Script from 'next/script';

const center = {
  lat: 47.92123,
  lng: 106.918556,
};
const containerStyle = {
    height: '100vh',
    width: '100%',
  };


export default function Map() {
  <Script src="http://maps.googleapis.com/maps/api/js?sensor=false"></Script>;
  const [userLoc, setUserLoc] = useState<any>(null);
  const [markerLoc, setMarkerLoc] = useState<any>({});
  const [lists, setLists] = useState<any>([]);
  const [positions, setPositions] = useState<any>({});
  const [selectedElement, setSelectedElement] = useState<any>(null);
  const [activeMarker, setActiveMarker] = useState<any>(null);
  const [visible, setVisible] = useState<string>();

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_MAP_TOKEN || "",
  });

  useEffect(() => {
  }, []);
  if (!isLoaded) return <div>Loading...</div>;
  function findCoordinate() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((positions) => {
        console.log(positions.coords);
        setUserLoc({
          lat: positions.coords.latitude,
          lng: positions.coords.longitude,
        });
      });
    } else {
      alert('ERROR');
    }
  }
  function handleClick(list: any) {
    setSelectedElement(list);
    setVisible(list._id);
    console.log(visible);
  }

  return (
    <div className="flex-1 bg-indigo-500">
        <div>
        {/* <GoogleMap zoom={12} center={center} mapContainerStyle={containerStyle}> */}
        <GoogleMap zoom={12} center={center} mapContainerStyle={containerStyle}>
            {lists.map((list: any) => (
            <>
                <MarkerF
                key={list.name}
                onClick={() => handleClick(list)}
                position={
                    new google.maps.LatLng(
                    list.address.location.coordinates[0],
                    list.address.location.coordinates[1]
                    )
                }
                icon={{
                    path: google.maps.SymbolPath.CIRCLE,
                    scale: 7,
                }}
                />

                {visible === list._id ? (
                <InfoWindowF
                    position={
                    new google.maps.LatLng(
                        list.address.location.coordinates[0],
                        list.address.location.coordinates[1]
                    )
                    }
                    onCloseClick={() => {
                    setSelectedElement(null);
                    }}
                >
                    <div>
                    <h1>{list.name}</h1>
                    {userLoc !== null ? (
                        getDistance(
                        { latitude: userLoc.lat, longitude: userLoc.lng },
                        {
                            latitude: list.address.location.coordinates[0],
                            longitude: list.address.location.coordinates[1],
                        }
                        )
                    ) : (
                        <h1>Share your location! </h1>
                    )}
                    </div>
                </InfoWindowF>
                ) : null}
            </>
            ))}{' '}
            <MarkerF
            position={userLoc}
            icon=
            {{
                path: google.maps.SymbolPath.CIRCLE,
                scale: 7,
            }}
            draggable={true}
            onDrag={(center: any) =>
                setUserLoc({
                lat: center.latLng?.lat(),
                lng: center.latLng?.lng(),
                })
            }
            ></MarkerF>
        </GoogleMap>
        </div>
        <button onClick={() => findCoordinate()}>share location</button>
     
        
    </div>
  );
}   