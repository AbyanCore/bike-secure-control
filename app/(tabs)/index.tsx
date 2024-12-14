import { View, StyleSheet, ScrollView, Image, Text, Alert, TouchableOpacity } from 'react-native';
import { useState, useRef, useEffect } from 'react';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { ActionButtons } from '@/components/ActionButtons';
import { RawDataLog } from '@/components/RawDataLog';

import * as Location from 'expo-location';
import useWebsocket from '@/hooks/useWebsocket';

const ACTION_DELAY = 2000; // 2 seconds delay

export default function MainPage() {
  const mapRef = useRef<MapView | null>(null);
  
  const [logs, setLogs] = useState<string[]>([]);
  const [location, setLocation] = useState({
    latitude: -7.6948602,
    longitude: 110.5900204,
  });
  
  const [iotLocation, setIotLocation] = useState({
    latitude: -7.6955,
    longitude: 110.591,
  });

  const ws = useWebsocket('ws://192.168.137.50:81', (msg) => {
    setLogs((prevLogs) => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prevLogs]);
  })

  async function getCurrentLocation() {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setLogs((prevLogs) => [...prevLogs, 'Permission to access location was denied']);
      return;
    }

    let location = await Location.getCurrentPositionAsync({});

    return location;
  }

  useEffect(() => {
    const locationUpdateInterval = setInterval(() => {
      getCurrentLocation().then((location) => {
        if (location) {
          setLocation({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude, 
          });
        }
      });
    }, 10000);

    return () => clearInterval(locationUpdateInterval);
  }, []);

  function zoomToLocation(targetLocation: { latitude: number; longitude: number; }) {
    if (mapRef.current) {
      mapRef.current.animateToRegion(
        {
          ...targetLocation,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        },
        1000
      );
    }
  }

  // [location, iotLocation]
  function calculateDistance(loc1: { latitude: number; longitude: number; }, loc2: { latitude: number; longitude: number; }) {
    const toRad = (value: number) => (value * Math.PI) / 180;
    const R = 6371e3; // metres
    const φ1 = toRad(loc1.latitude);
    const φ2 = toRad(loc2.latitude);
    const Δφ = toRad(loc2.latitude - loc1.latitude);
    const Δλ = toRad(loc2.longitude - loc1.longitude);

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) *
      Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = R * c; // in metres
    return distance;
  }

  useEffect(() => {
    const distance = calculateDistance(location, iotLocation);
    if (distance > 10) {
      ws.sendMessage(JSON.stringify({
        "type": "secure",
        "command": "lock"
      }));
    }
  }, [location, iotLocation]);

  const getDirections = () => {
    setLogs((prevLogs) => [...prevLogs, `Getting directions from ${JSON.stringify(location)} to ${JSON.stringify(iotLocation)}`]);
    Alert.alert('Directions', `Navigating from your location to IoT location!`);
    zoomToLocation(iotLocation); // Placeholder for direction functionality
  };

  const handleActionWithDelay = (action: () => void) => {
    setTimeout(action, ACTION_DELAY);
  };

  return (
    <ScrollView style={styles.container}>
    <View style={[styles.connectionStatus, { backgroundColor: ws.isConnected.current ? 'green' : ws.isReconnecting.current ? 'orange' : 'red' }]}>
      <Text style={styles.connectionText}>
        {ws.isConnected.current ? "Connected" : ws.isReconnecting.current ? "Reconnecting..." : "Disconnect" }
      </Text>
    </View>
      <ActionButtons actions={[
          { name: 'Lock', icon: 'lock-closed', color: '#FF3B30', handle: () => handleActionWithDelay(() => {
              ws.sendMessage(JSON.stringify({
                "type": "secure",
                "command": "lock"
              }))
          }) },
          { name: 'Unlock', icon: 'lock-open', color: '#34C759', handle: () => handleActionWithDelay(() => {
              ws.sendMessage(JSON.stringify({
                "type": "secure",
                "command": "unlock"
              }))
          }) },
          { name: 'Signal', icon: 'radio', color: '#007AFF', handle: () => handleActionWithDelay(() => {
              ws.sendMessage(JSON.stringify({
                "type": "signal",
                "command": "signal 2s"
              }))
          }) },
          { name: 'Track', icon: 'location', color: '#FF9500', handle: () => handleActionWithDelay(() => {
              getCurrentLocation().then((location) => {
                if (location) {
                  setIotLocation({
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                  });
                }
              });
          })},
        ]}
      />

      <View style={styles.mapContainer}>
        <MapView
          key={`${location.latitude}-${location.longitude}-${iotLocation.latitude}-${iotLocation.longitude}`}
          ref={mapRef}
          style={styles.map}
          initialRegion={{
            ...location,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
        >
          {/* Marker for My Location */}
          <Marker coordinate={location} title="My Location">
            <View style={styles.customMarker}>
              <Image source={require('../../assets/images/user_icon.png')} style={styles.markerImage} />
            </View>
          </Marker>

          {/* Marker for IoT Location */}
          <Marker coordinate={iotLocation} title="BiSS Location">
            <View style={styles.customMarker}>
              <Image source={require('../../assets/images/bike_icon.png')} style={styles.markerImage} />
            </View>
          </Marker>

          {/* Polyline for route (as a placeholder for directions) */}
          <Polyline
            coordinates={[location, iotLocation]}
            strokeColor="#0000FF" // Blue
            strokeWidth={3}
          />
        </MapView>
      </View>

      <View style={styles.buttonContainer}>
        {/* Button to zoom to My Location */}
        <TouchableOpacity
          style={styles.buttonActionMap}
          onPress={() => zoomToLocation(location)}
          >
            <Text style={styles.buttonActionText}>My Location</Text>
          </TouchableOpacity>

        {/* Button to zoom to IoT Location */}
        <TouchableOpacity
          style={styles.buttonActionMap}
          onPress={() => zoomToLocation(iotLocation)}
          >
            <Text style={styles.buttonActionText}>BiSS Location</Text>
          </TouchableOpacity>

        {/* Button to get directions */}
        <TouchableOpacity
          style={styles.buttonActionMap}
          onPress={getDirections}
        >
          <Text style={styles.buttonActionText}>Get Direction</Text>
        </TouchableOpacity>
      </View>
      <RawDataLog logs={logs} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  customMarker: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapContainer: {
    height: 400,
    margin: 10,
    borderRadius: 10,
    overflow: 'hidden',
  },
  map: {
    flex: 1,
  },
  markerImage: {
    width: 30,
    height: 30,
  },
  buttonActionMap: {
    width: '48%',
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#007AFF',
  },
  buttonActionText: {
    color: '#fff',
    marginTop: 5,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'space-around',
    margin: 10,
  },
  connectionStatus: {
    padding: 10,
    margin: 10,
    borderRadius: 10,
  },
  connectionText: {
    color: 'white',
    textAlign: 'center',
  },
});
