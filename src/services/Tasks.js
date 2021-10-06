/* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect, useRef } from 'react';

import BackgroundFetch from 'react-native-background-fetch';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

import useBluetooth from './BlueTooth';
import useBackgroundLocation from './BackgroundLocation';

export async function initBackgroundFetch() {


  useEffect(() => {
    async function loadTaskBackground() {
      console.log('INIT TASK BACKGROUND...');
    }
    loadTaskBackground();
    
  }, []);

  // BackgroundFetch event handler.
  const onEvent = async (taskId) => {
    console.log('[BackgroundFetch] task: ', taskId);
    if (taskId == 'checkTag') {
      await checkToTravel();
    }
    // IMPORTANT:  You must signal to the OS that your task is complete.
    BackgroundFetch.finish(taskId);
  };

  const onTimeout = async (taskId) => {
    console.warn('[BackgroundFetch] TIMEOUT task: ', taskId);
    BackgroundFetch.finish(taskId);
  };

  // Initialize BackgroundFetch only once when component mounts.
  await BackgroundFetch.configure(
    {
      minimumFetchInterval: 1,
      forceAlarmManager: true,
      startOnBoot: true,
      stopOnTerminate: false,
      enableHeadless: true,
    },
    onEvent,
    onTimeout
  );

  BackgroundFetch.status((status) => {
    switch (status) {
      case BackgroundFetch.STATUS_RESTRICTED:
        console.log('BackgroundFetch restricted');
        break;
      case BackgroundFetch.STATUS_DENIED:
        console.log('BackgroundFetch denied');
        break;
      case BackgroundFetch.STATUS_AVAILABLE:
        console.log('BackgroundFetch is enabled');
        break;
    }
  });
}

export async function createTask() {
  return await BackgroundFetch.scheduleTask({
    taskId: 'checkTag',
    delay: 15000, // milliseconds
    forceAlarmManager: false,
    periodic: true,
  });
}

async function checkToTravel() {
  const [scanTag] = useBluetooth();
  const [startMonitoring, stopMonitoring, sendmessage] =
    useBackgroundLocation();
  const uuid = scanTag();
  const travel = uuidv4();
  if (uuid) {
    startMonitoring(travel, uuid);
    sendmessage('start monitoring');
  }
  if (uuid == null) {
    stopMonitoring();
    sendmessage('stop monitoring');
  }
  return true;
}
