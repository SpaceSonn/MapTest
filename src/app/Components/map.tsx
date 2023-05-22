'use client'
import 'flowbite';
import { Dropdown } from 'flowbite';
import React, { useState, useEffect } from 'react';
import { GoogleMap, useLoadScript, MarkerF } from '@react-google-maps/api';
import { getDistance } from 'geolib';
import axios from 'axios';
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
    googleMapsApiKey: 'AIzaSyDZ6Xy-3qMPCtvqigbxd4kjWsnf2m2tVOg',
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
        <div className='flex-1'>
            <button onClick={() => findCoordinate()}>share location</button>
            <button id="dropdownDefaultButton" data-dropdown-toggle="dropdown" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" type="button">Dropdown button <svg className="w-4 h-4 ml-2" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg></button>
            <div id="dropdown" className="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700">
                <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefaultButton">
                    <li>
                        <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Near me</a>
                    </li>
                    <li>
                        <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Rating</a>
                    </li>
                </ul>
            </div>

        </div>
        
    </div>
  );
}   