/* eslint-disable react-native/no-inline-styles */
import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  StatusBar,
  Button,
  Text,
} from 'react-native';
import BackgroundFetch from 'react-native-background-fetch';
import useBluetooth from './src/services/BlueTooth';

import useBackgroundLocation from './src/services/BackgroundLocation';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

const App = () => {
  const [background, setBackground] = useState(false);
  const [scanTag, stopScan, loading, major, minor, uuid] = useBluetooth();
  const [
    getCurrentPosition,
    sendmessage,
    configMonitoring,
    startMonitoring,
    stopMonitoring,
    syncTravel,
    location,
    odometer,
    typeMotion,
    speed,
  ] = useBackgroundLocation();

  if (!background) {
    configMonitoring(123123, 99900);
    setBackground(true);
  }

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <View>
          <View
            style={{
              marginTop: 80,
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-evenly',
            }}
          >
            <Button
              title="monitorar"
              onPress={() => {
                const travel = uuidv4();
                startMonitoring(travel, 123);
              }}
              color="#1bc91b"
            />
            <Button
              title="stop"
              onPress={() => stopMonitoring()}
              color="#e80e0e"
            />
          </View>
          <View
            style={{
              margin: 10,
              marginTop: 20,
              alignItems: 'center',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <Text>Odometro:{odometer}</Text>
            <Text>Deslocamento: {typeMotion}</Text>
            <Text>Velocidade em KM/H: {speed}</Text>
          </View>
          <View
            style={{
              margin: 10,
              marginTop: 20,
              alignItems: 'center',
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}
          >
            <Text style={styles.detail}>Lat:{location?.coords?.latitude}</Text>
            <Text style={styles.detail}>
              Long:{location?.coords?.longitude}
            </Text>

            <Text style={styles.detail}>
              Em movimento:{location?.is_moving ? 'sim' : 'não'}
            </Text>
            <Text style={styles.detail}>
              velocidade:{location?.coords?.speed}
            </Text>
          </View>
          <View
            style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}
          ></View>
          <View style={styles.tagDetail}>
            <Text style={styles.tagText}>{`Tag:${uuid}`}</Text>
            <Text style={styles.tagText}>{`Major:${major}`}</Text>
            <Text style={styles.tagText}>{`Minor:${minor}`}</Text>
          </View>
          <View style={styles.list}>
            <View style={{ marginVertical: 20 }}>
              <Button
                title="scanDevices"
                onPress={() => scanTag()}
                color="#94006f"
                style={{
                  marginHorizontal: 5,
                  marginTop: 16,
                }}
              />
            </View>
            <View style={{ marginVertical: 20 }}>
              <Button
                title="Posição Atual"
                style={{
                  paddingVertical: 5,
                  marginTop: 16,
                  colors: ['#ffffff', 'blue', 'grey'],
                }}
                onPress={() => getCurrentPosition()}
              />
            </View>
            <View style={{ marginVertical: 20 }}>
              <Button
                title="Sincronizar"
                style={{
                  paddingVertical: 5,
                  color: '#000',
                }}
                color="#e18700"
                onPress={() => syncTravel()}
              />
            </View>
          </View>
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  body: {
    paddingTop: 0,
    color: '#000000',
  },
  item: {
    marginTop: 16,
    paddingVertical: 8,
    borderWidth: 4,
    borderColor: '#20232a',
    borderRadius: 6,
    backgroundColor: '#61dafb',
    color: '#20232a',
    fontSize: 30,
    fontWeight: 'bold',
  },
  title: {
    textAlign: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
  },
  button: {
    marginHorizontal: 5,
    padding: 20,

    height: 40,
    width: 160,
    borderRadius: 10,
  },
  detail: {
    marginHorizontal: 10,
  },
  list: {
    paddingHorizontal: 60,
    justifyContent: 'center',
  },
  tagDetail: {
    paddingTop: 10,
    paddingHorizontal: 30,
    justifyContent: 'flex-start',
  },
  tagText: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default App;
