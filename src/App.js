/* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect, useRef } from 'react';

import moment from "moment";

import { StatusBar, 
  Platform,
  PermissionsAndroid,
  AppState,
  Alert , TouchableOpacity, Text, View,
} from 'react-native';

import { QrCodeProvider } from './hooks/qrcode';
import { BluetoothProvider } from './hooks/bluetooth';

import { BackgroundGeoProvider } from './hooks/backgroundGeo';
import BackgroundGeolocation from 'react-native-background-geolocation';
import BackgroundTimer from 'react-native-background-timer';

import Home from './pages/Home';
import api from './services/Api';

import { Buffer } from 'buffer';

import { BleManager, Device } from 'react-native-ble-plx';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { DeviceEventEmitter } from 'react-native';

const manager = new BleManager();




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
  const [currentDate, setCurrentDate] = useState('');

  const urlSync = 'https://api.satcompany.com.br/satconnect/';
  
  function _startDailyTimer() {
    BackgroundTimer.stop();
    this._reduceAutoItems();
    //86400000
    console.log('antes do timer ligado!!!');
    BackgroundTimer.start(3000);
    console.log('timer ligado!!!');
    DeviceEventEmitter.addListener('backgroundTimer', () => {
    this._reduceAutoItems();
    });
}
function _startOffsetTimer() {
AsyncStorage.getItem("Timer").then((value) => {
    if (value === null || value === false) {
        let now = new Date();
        let offset = moment().endOf('day')-now;
        BackgroundTimer.start(offset);
        DeviceEventEmitter.addListener('backgroundTimer', () => {
            //this._startDailyTimer();
            console.log('teste log');
        });
        AsyncStorage.setItem("Timer", true);
        
    }
    console.log(value);
    });
}  
      async function isSavedDevice() {
        const readed = await AsyncStorage.getItem('read');
        const deviceStore = await AsyncStorage.getItem('device');
        console.log(readed);
    
        console.log(deviceStore);
        const jsonDevice = deviceStore == null ? null : deviceStore;
        const jsonReaded = readed == 'true' ? 'true' : 'false';
        setRead(jsonReaded);
        setDevice(jsonDevice);
        return deviceStore !== null;
      }

      async function isSavedDevice() {
        const readed = await AsyncStorage.getItem('read');
        const deviceStore = await AsyncStorage.getItem('device');
        console.log(readed);
    
        console.log(deviceStore);
        const jsonDevice = deviceStore == null ? null : deviceStore;
        const jsonReaded = readed == 'true' ? 'true' : 'false';
        setRead(jsonReaded);
        setDevice(jsonDevice);
        return deviceStore !== null;
      }

      const runTimer = () => {
        console.log('aqui iniciando o background e timer');
        BackgroundTimer.start();
        timerInterval = BackgroundTimer.setInterval(async () => {
          await scanAndConnect();
        }, 1000);
      };
    
      const stopTimer = () => {
        BackgroundTimer.clearTimeout().clearInterval(timerInterval);
        BackgroundTimer.stop();
      };     

      runTimer();

    // Start a timer that runs continuous after X milliseconds
    // const intervalId = BackgroundTimer.setInterval((id) => {
    //   // this will be executed every 200 ms
    //   // even when app is the the background

    //   var date = new Date().getDate(); //Current Date
    //   var month = new Date().getMonth() + 1; //Current Month
    //   var year = new Date().getFullYear(); //Current Year
    //   var hours = new Date().getHours(); //Current Hours
    //   var min = new Date().getMinutes(); //Current Minutes
    //   var sec = new Date().getSeconds(); //Current Seconds
    //   setCurrentDate(
    //     date + '/' + month + '/' + year 
    //     + ' ' + hours + ':' + min + ':' + sec
    //   );      
    //   checkScanDevices();
    //   console.log('tic in ' + date + '/' + month + '/' + year 
    //   + ' ' + hours + ':' + min + ':' + sec);
    // }, 70000);
 
    //     // Cancel the timer when you are done with it
    //    // BackgroundTimer.clearInterval(intervalId);
    //    intervalId;
       
        // Start a timer that runs once after X milliseconds
        // const timeoutId = BackgroundTimer.setTimeout(() => {
        //   // this will be executed once after 10 seconds
        //   // even when app is the the background
        //   console.log('tac');
        // }, 10000);


    useEffect(() => {
        async function loadJobBackground() {
          console.log('INIT BACKGROUND INTERNAL APP...');
        }
        loadJobBackground();

        startListen();
        //--_startDailyTimer();
        //_startOffsetTimer();
        //runTimer;
        
      }, []);

 
  function onLocation(location) {
    sendmessage('teste' + location);
    console.log('[location] --', location);
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


  function checkScanDevices(intervalId) {
    console.warn('CHECKING LISTEN DEVICES TAGS...')
    
    BackgroundTimer.clearInterval(intervalId);

  }
  function startListen() {
    console.warn('INICIANDO LISTEN APP...')
    //scanAndConnect();
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
  const scanTags = (mensagem) =>
  
  Alert.alert(
    "Dispositivos BLE",
    mensagem,
    [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel"
      },
      { text: "OK", onPress: () => console.log("OK Pressed") }
    ]
  );
  async function scanAndConnect() {
    console.warn('INICIANDO O SCAN DE TAGS...');
    if (connectedDevice){
      console.warn('CONECTADO AO DEVICE...');
      return;
    }
    
    setLoading(true);
    const list = [];
    manager.startDeviceScan(null, null, (error, device) => {
      console.warn('ERRO INICIANDO O SCAN...');
  
      if (error) {
        // Handle error (scanning will be stopped automatically)
        scanTags(JSON.stringify(error));
        console.log(error.message);
        manager.stopDeviceScan();
        setLoading(false);
        return;
      }

      if (device.name === null) {
        scanTags('não localizado o dispositivo!');
        return;
      }
      if (device) {
        
        scanTags(device.name);

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
  function getDeviceConected(){
    return deviceConnect ? deviceConnect.name : 'não conectado!';
  }
  function connectedInDevice(device) {
    manager.stopDeviceScan();
    setDeviceConnect(device);

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
      <View>
        <TouchableOpacity onPress={() => scanAndConnect()}>
          <Text style={{ color: '#9D3CFA' }}>{getDeviceConected()}</Text>
        </TouchableOpacity>
      </View>    
      <StatusBar backgroundColor="#3C303E" />
      <QrCodeProvider>
        <BluetoothProvider>
          <BackgroundGeoProvider>
            <Home />
          </BackgroundGeoProvider>
        </BluetoothProvider>
      </QrCodeProvider>
    </>
  );
};

export default App;
