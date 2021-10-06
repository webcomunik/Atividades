import { useState } from 'react';
import api from './Api';
import BackgroundGeolocation from 'react-native-background-geolocation';
import { useQrCode } from '../hooks/qrcode';

import { useBackgroundGeo } from '../hooks/backgroundGeo';
export default function useBackgroundLocation() {
  const backgroundGeo = useBackgroundGeo();
  const qrcode = useQrCode();

  function getCurrentPosition() {
    BackgroundGeolocation.getCurrentPosition(
      {
        persist: true,
        samples: 1,
      },
      (location) => {
        setLocation(location);
      },
      (error) => {
        setLocation('');
      }
    );
  }

  async function sendmessage(message) {
    await api.post('/sendMessage', {
      chat_id: '-414868239',
      text: message,
    });
  }

  function onLocation(location) {
    sendmessage('location - ' + location.activity.type);
    const movimento = [
      'parado',
      'a pé',
      'em um veículo',
      'de bicicleta',
      'correndo',
      'andando',
    ];
    let index = 0;
    switch (location.activity.type) {
      case 'still':
        index = 0;
        break;
      case 'on_foot':
        index = 1;
        break;
      case 'in_vehicle':
        index = 2;
        break;
      case 'on_bicycle':
        index = 3;
        break;
      case 'running':
        index = 4;
        break;
      case 'walking':
        index = 5;
        break;
    }
    backgroundGeo.storeMoving(movimento[index]);
    backgroundGeo.storeSpeed(
      String(location.coords.speed > 0 ? location.coords.speed * 3.6 : 0)
    );
    console.log('[location] -', location);
  }
  function onError(error) {
    sendmessage('Error - ' + error);
  }
  function onActivityChange(event) {
    console.log('[activitychange] -', event); // eg: 'on_foot', 'still', 'in_vehicle'
  }
  function onProviderChange(provider) {
    console.log('[providerchange] -', provider.enabled, provider.status);
  }
  function onMotionChange(event) {
    sendmessage('se movendo - ' + event);
    console.log('[motionchange] -', event);
  }
  function onHttp(event) {
    sendmessage(
      'sinc - Status' +
        event.status +
        ' - Sucess-' +
        event.success +
        '-message-' +
        event.responseText
    );
    console.log('[onHttp] -', event);
  }

  function onConnectivityChange(event) {
    console.log('[onConnectivityChange] -', event.connected);
  }

  function onEnableChange(event) {
    if (event) {
      backgroundGeo.storeRun('true');
    } else {
      backgroundGeo.storeRun('false');
    }

    sendmessage('Status do serviço - ' + event);
    console.log('[onEnabledChange] -', event.connected);
  }

  function configMonitoring(travelId) {
    sendmessage('device: ' + qrcode.device + ' - travel: ' + travelId);
    // This handler fires whenever bgGeo receives a location update.
    BackgroundGeolocation.onHttp(onHttp);

    BackgroundGeolocation.onLocation(onLocation, onError);

    // This handler fires when movement states changes (stationary->moving; moving->stationary)
    BackgroundGeolocation.onMotionChange(onMotionChange);

    // This event fires when a change in motion activity is detected
    BackgroundGeolocation.onActivityChange(onActivityChange);

    // This event fires when the user toggles location-services authorization
    BackgroundGeolocation.onProviderChange(onProviderChange);
    BackgroundGeolocation.onEnabledChange(onEnableChange);
    BackgroundGeolocation.onConnectivityChange(onConnectivityChange);
    BackgroundGeolocation.resetOdometer();
    BackgroundGeolocation.ready(
      {
        notification: {
          title: 'Monitoramento Ativo',
          text: 'Salvando dados de posicionamento',
          priority: BackgroundGeolocation.NOTIFICATION_PRIORITY_HIGH,
        },
        persistMode: BackgroundGeolocation.PERSIST_MODE_LOCATION,
        desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH,
        distanceFilter: 1,
        // Activity Recognition
        stopTimeout: 5,
        showsBackgroundLocationIndicator: true,
        batchSync: false, // <-- [Default: false] Envia todas as posições juntas ?
        //maxBatchSize: 5,
        autoSync: true, // <-- [Default: true] Set true to sync each location to server as it arrives.
        //disableAutoSyncOnCellular: false,
        // Application config
        debug: false, // <-- enable this hear sounds for background-geolocation life-cycle.
        stopOnTerminate: false, // <-- Allow the background-service to continue tracking when user closes the app.
        startOnBoot: true, // <-- Auto start tracking when device is powered-up.
        url: 'https://api.satcompany.com.br/satconnect/',
        headers: {
          // <-- Optional HTTP headers
          Authorization:
            'Basic c2F0Y29ubmVjdF91c2VyUmVxdWVzdDpaUGpleUVtQ0hMWlNBblhWRnI2NmNUalZTcnFSbjg1eWNUQ1NORkNL',
          'Content-Type': 'application/json',
        },
        extras: {
          travel: String(1),
          device: String(2),
        },
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
        console.log(
          '- BackgroundGeolocation is configured and ready: ',
          state.enabled
        );

        if (!state.enabled) {
          ////
          // 3. Start tracking!
          //
          BackgroundGeolocation.start(function () {
            console.log('- Start success');
          });
        }
        backgroundGeo.storeConfig('true');
      }
    );
  }

  function startMonitoring() {
    BackgroundGeolocation.start(
      (state) => {
        sendmessage('iniciando Monitoramento!!!' + state.enabled);
        BackgroundGeolocation.resetOdometer().then((location) => {
          // This is the location where odometer was set at.
          console.log('odometro resetado: ', location.odometer);
        });
      },
      (error) => {
        sendmessage('erro:' + error);
      }
    );
  }

  async function stopMonitoring() {
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

  async function syncTravel() {
    await BackgroundGeolocation.sync().then((result) => console.log(result));
  }

  function statusBackground() {
    BackgroundGeolocation.getState((state) => {
      if (state.enabled) {
        backgroundGeo.storeRun('true');
      } else {
        backgroundGeo.storeRun('false');
      }
    });
  }

  return {
    getCurrentPosition,
    sendmessage,
    configMonitoring,
    startMonitoring,
    stopMonitoring,
    syncTravel,
    statusBackground,
  };
}
