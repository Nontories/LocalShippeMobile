import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';

import SpinnerLoading from '../components/utils/SpinnerLoading';
import BackHeader from '../components/header/BackHeader';
import MapViewDirections from 'react-native-maps-directions';

const WIDTH = Dimensions.get("window").width
const HEIGHT = Dimensions.get("window").height

const GOOGLE_API_KEY = "AIzaSyCopbgTReiAZnDlFGYgyLfKtHpvuEfUkBo"
// const GOOGLE_API_KEY = "AIzaSyA3AH716fnOpcrY6o5-8MFripwEbdKrt7s"


const MyMapView = ({ route, navigation }) => {

  const routeList = route?.params?.routeList
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState(null);
  const [routes, setRoutes] = useState([])

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        // setErrorMsg('Permission to access location was denied');
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      await loadRoute(location)
      setLoading(false)
    })();
  }, [route?.params?.routeList]);

  const loadRoute = async (location) => {
    setLocation(location);
    const locationList = [
      { latitude: location?.coords?.latitude, longitude: location?.coords?.longitude },
      ...routeList
    ]
    setRoutes(locationList)
  }

  return (
    <View style={styles.container}>
      <BackHeader content={"Lộ trình"} navigation={navigation} />
      {loading ?
        <SpinnerLoading />
        :

        <MapView
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          initialRegion={{
            latitude: location?.coords?.latitude,
            longitude: location?.coords?.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          {routes?.map((item, index) => {
              return (
                <Marker
                  coordinate={{ latitude: item?.latitude, longitude: item?.longitude }}
                  title={index + ". " + (item?.name ? item?.name : "bạn")}
                  pinColor={index === 0 ? "blue" : "red"}
                  key={index}
                />
              )
            
          })}

          <MapViewDirections
            origin={routes[0]}
            waypoints={(routes.length > 2) ? routes.slice(1, -1) : undefined}
            destination={routes[routes.length - 1]}
            apikey={GOOGLE_API_KEY}
            strokeWidth={3}
            optimizeWaypoints={true}
            strokeColor="#39A0DC"
          />
        </MapView>

      }
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
  },
  map: {
    width: WIDTH,
    height: HEIGHT * 0.9,
  },
});

export default MyMapView;