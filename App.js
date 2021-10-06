/* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect, useRef } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  StatusBar,
  Button,
  Text,
  FlatList,
  TouchableOpacity,
  Platform,
  PermissionsAndroid,
  AppState,
} from 'react-native';

import api from './src/services/Api';
import BackgroundGeolocation from 'react-native-background-geolocation';
import { Buffer } from 'buffer';

import { BleManager, Device } from 'react-native-ble-plx';

const manager = new BleManager();

if (Platform.OS === 'android' && Platform.Version >= 23) {
  console.log('will Check Permission to ACCESS_FINE_LOCATION');
  PermissionsAndroid.check(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
  ).then((result) => {
    if (result) {
      console.log('Permission is OK');
    } else {
      PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      ).then((result) => {
        if (result) {
          console.log('User accept');
        } else {
          console.log('User refuse');
        }
      });
    }
  });
}

const App = () => {
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState({});
  const [devicesList, setDevicesList] = useState([]);
  const [deviceConnect, setDeviceConnect] = useState({});
  const [connectedDevice, setConnectedDevice] = useState(false);
  const [major, setMajor] = useState(0);
  const [minor, setMinor] = useState(0);
  const [uuid, setUuid] = useState(0);
  const appState = useRef(AppState.currentState);

  const urlSync = 'https://api.satcompany.com.br/satconnect/';

  useEffect(() => {
    async function loadJobBackground() {
      console.log('INIT BACKGROUND APP...');
    }
    loadJobBackground();
  }, []);

  function onLocation(location) {
    sendmessage('teste' + location);
    console.log('[location -> aqui] --', location);
  }
  function onError(error) {
    console.warn('[location] ERROR -', error);
  }
  function onActivityChange(event) {
    console.log('[activitychange] -', event); // eg: 'on_foot', 'still', 'in_vehicle'
  }
  function onProviderChange(provider) {
    sendmessage('provider' + provider.enabled + '--' + provider.status);
    console.log('[providerchange] -', provider.enabled, provider.status);
  }
  function onMotionChange(event) {
    sendmessage('se movendo' + event.location);
    console.log('[motionchange] -', event.isMoving, event.location);
  }

  function startListen() {
    CONSOLE.WARN('INICIANDO LISTEN APP...')
    // This handler fires whenever bgGeo receives a location update.
    BackgroundGeolocation.onLocation(onLocation, onError);

    // This handler fires when movement states changes (stationary->moving; moving->stationary)
    BackgroundGeolocation.onMotionChange(onMotionChange);

    // This event fires when a change in motion activity is detected
    BackgroundGeolocation.onActivityChange(onActivityChange);

    // This event fires when the user toggles location-services authorization
    BackgroundGeolocation.onProviderChange(onProviderChange);

    BackgroundGeolocation.ready(
      {
        notification: {
          title: 'Monitoramento Ativo',
          text: 'Salvando dados de posicionamento',
        },
        // Geolocation Config
        desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_NAVIGATION,
        distanceFilter: 1,
        // Activity Recognition
        stopTimeout: 1,
        showsBackgroundLocationIndicator: true,
        // Application config
        debug: false, // <-- enable this hear sounds for background-geolocation life-cycle.
        logLevel: BackgroundGeolocation.LOG_LEVEL_ERROR,
        stopOnTerminate: false, // <-- Allow the background-service to continue tracking when user closes the app.
        startOnBoot: true, // <-- Auto start tracking when device is powered-up.
        //sincronismo
        disableAutoSyncOnCellular: false,
        // HTTP / SQLite config
        url: urlSync,
        headers: {
          // <-- Optional HTTP headers
          'Content-Type': 'application/json',
          Authorization:
            'Basic c2F0Y29ubmVjdF91c2VyUmVxdWVzdDpaUGpleUVtQ0hMWlNBblhWRnI2NmNUalZTcnFSbjg1eWNUQ1NORkNL',
        },
        batchSync: false, // <-- [Default: false] Set true to sync locations to server in a single HTTP request.
        autoSync: true, // <-- [Default: true] Set true to sync each location to server as it arrives.
        locationAuthorizationRequest: 'Always',
        locationAuthorizationAlert: {
          titleWhenNotEnabled: 'Seu, serviço de localização está disponível',
          titleWhenOff: 'Seu, serviço de localização está desligado',
          instructions: 'Você precisa deixa-lo sempre ativo.',
          cancelButton: 'Cancel',
          settingsButton: 'Settings',
        },
        backgroundPermissionRationale: {
          title: 'Permitir que o SatConnect monitore sua posições?',
          message:
            'Para rastrear sua atividade em segundo plano, ative a permissão de localização do Satconnect em segundo plano',
          positiveAction: 'Permitir',
          negativeAction: 'Cancelar',
        },
      },
      (state) => {
        setConnectedDevice(state.enabled);
        console.log(
          '- BackgroundGeolocation is configured and ready: ',
          state.enabled
        );
        sendmessage('iniciando em background:' + state.enabled);

        if (!state.enabled) {
          BackgroundGeolocation.start(
            (newState) => {
              sendmessage('iniciado em background!!!' + newState.enabled);
            },
            (error) => {
              sendmessage('erro:' + error);
            }
          );
        }
      }
    );
  }

  function showLog() {
    BackgroundGeolocation.logger.getLog().then((log) => {
      // Warning:  this string could be several megabytes.
      console.log('[log] success: ', log);
    });
  }

  function clearLog() {
    BackgroundGeolocation.logger.destroyLog();
  }

  async function stopListen() {
    console.log('stop Listen');
    try {
      BackgroundGeolocation.stop((sucessStop) => {
        console.log(sucessStop);
        sendmessage('Monitoramento parado - ' + sucessStop.enabled);
      });
    } catch (err) {
      console.log(err);
    }
  }

  function onClickGetCurrentPosition() {
    BackgroundGeolocation.getCurrentPosition(
      {
        persist: true,
        samples: 1,
      },
      (location) => {
        setLocation(location);
        console.log('- getCurrentPosition success: ', location);
      },
      (error) => {
        console.warn('- getCurrentPosition error: ', error);
      }
    );
  }

  function stopScan() {
    manager.stopDeviceScan();
    setLoading(false);
  }

  function sendmessage(message) {
    api.post('/sendMessage', {
      chat_id: '-414868239',
      text: message,
    });
  }

  async function scanAndConnect() {
    console.warn('INICIANDO O SCAN DE TAGS...');
    setLoading(true);
    const list = [];
    manager.startDeviceScan(null, null, (error, device) => {
      console.warn('ERRO INICIANDO O SCAN...');
      console.log(error);
      if (error) {
        // Handle error (scanning will be stopped automatically)
        manager.stopDeviceScan();
        setLoading(false);
        return;
      }

      if (device.name === null) {
        return;
      }
      if (device) {
        list.push(device);
        const unique = list.filter(
          (item, index, self) =>
            index === self.findIndex((t) => t.id === item.id)
        );
      }
    });

    setTimeout(() => {
      manager.stopDeviceScan();
      setLoading(false);
      const unique = list.filter(
        (item, index, self) => index === self.findIndex((t) => t.id === item.id)
      );

      //setDevicesList(unique);
      unique.map((item) => {
        if (item.name === 'Holy-IOT') {
          connectedInDevice(item);
        }
      });
    }, 5000);
  }

  function connectedInDevice(device) {
    manager.stopDeviceScan();
    if (device.name === 'Holy-IOT') {
      const buf = Buffer.from(device.manufacturerData, 'base64');
      const uint16array = new Uint8Array(
        buf.buffer,
        buf.byteOffset,
        buf.length / Uint8Array.BYTES_PER_ELEMENT
      );

      const text = buf.toString('hex');
      setUuid(text.slice(8, 40));

      const majorMult = uint16array[20] * 256;
      const majorSum = parseInt(majorMult) + parseInt(uint16array[21]);
      setMajor(majorSum);

      const minorMult = uint16array[22] * 256;
      const minorSum = parseInt(minorMult) + parseInt(uint16array[23]);
      setMinor(minorSum);

      sendmessage('conectado na tag');
      //startListen();
    }
  }

  function showStatusScan() {
    if (loading) {
      return (
        <View>
          <Text>Buscando...</Text>
        </View>
      );
    }
  }

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <View style={styles.body}>
          <View>
            <Text style={styles.detail}>App em :{appStateVisible}</Text>
          </View>
          <View
            style={{
              margin: 10,
              marginTop: 50,
              flexDirection: 'row',
              justifyContent: 'space-evenly',
            }}
          >
            <Button
              title="Procurar"
              onPress={() => scanAndConnect()}
              style={styles.button}
            />
            {showStatusScan()}
            <Button
              title="Desconectar"
              onPress={() => stopScan()}
              style={styles.button}
            />
          </View>
        </View>
        <View>
          <View
            style={{
              marginTop: 20,
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-evenly',
            }}
          >
            <Button
              title="start"
              onPress={() => startListen()}
              style={styles.button}
            />
            <Button
              title="posição"
              onPress={() => onClickGetCurrentPosition()}
              style={styles.button}
            />
            <Button
              title="stop"
              onPress={() => stopListen()}
              style={styles.button}
            />
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
          >
            <Button
              title="log"
              onPress={() => showLog()}
              style={{
                marginHorizontal: 5,
              }}
            />
            <Button
              title="clearlog"
              onPress={() => clearLog()}
              color="#ff5c5c"
              style={{
                marginHorizontal: 5,
              }}
            />
          </View>
          <View style={styles.tagDetail}>
            <Text style={styles.tagText}>{`Tag:${uuid}`}</Text>
            <Text style={styles.tagText}>{`Major:${major}`}</Text>
            <Text style={styles.tagText}>{`Minor:${minor}`}</Text>
          </View>
          <View style={styles.list}>
            <FlatList
              data={devicesList}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => connectedInDevice(item)}>
                  <View style={styles.item}>
                    <Text style={styles.title}>{item.name}</Text>
                  </View>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item.id}
            />
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
    justifyContent: 'center',
  },
  tagText: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default App;
