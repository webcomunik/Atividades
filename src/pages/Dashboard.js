/* eslint-disable react-native/no-inline-styles */
import React from 'react';

import { Text, View } from 'react-native';
import BackgroundGeo from '../components/BackgroundGeo';
import Bluetooth from '../components/Bluetooth';

import { useBluetooth } from '../hooks/bluetooth';

const Dashboard = () => {
  const bluetooth = useBluetooth();

  let page = <Bluetooth />;
  if (bluetooth.id) {
    page = <BackgroundGeo />;
  }
  return <>{page}</>;
};
export default Dashboard;
