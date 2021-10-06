/* eslint-disable react-native/no-inline-styles */
import React from 'react';

import { useQrCode } from '../hooks/qrcode';
import TopBar from '../components/TopBar';
import QrCode from '../components/QrCode';
import Dashboard from './Dashboard';

const Home = () => {
  const qrcode = useQrCode();

  let page = <QrCode />;
  if (qrcode.device) {
    page = <Dashboard />;
  }
  return (
    <>
      <TopBar />
      {page}
    </>
  );
};

export default Home;
