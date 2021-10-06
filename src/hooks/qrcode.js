import React, {
  createContext,
  useContext,
  useCallback,
  useState,
  useEffect,
  
} from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';

const QrCodeContext = createContext({});

const QrCodeProvider = ({ children }) => {
  const [read, setRead] = useState(false);
  const [device, setDevice] = useState(null);

  useEffect(() => {
    async function loadStoragedData() {
      const readed = await AsyncStorage.getItem('read');
      const deviceStore = await AsyncStorage.getItem('device');
      const jsonDevice = deviceStore == 'null' ? null : deviceStore;
      const jsonReaded = readed == 'true' ? true : false;
      setRead(jsonReaded);
      setDevice(jsonDevice);
    }
    loadStoragedData();
  }, []);

  const storeDevice = useCallback(async (deviceName) => {
    setDevice(deviceName == 'null' ? null : deviceName);
    return await AsyncStorage.setItem('device', deviceName);
  }, []);

  const storeRead = useCallback(async (readed) => {
    setRead(readed == 'true' ? true : false);
    return await AsyncStorage.setItem('read', readed);
  }, []);

  return (
    
    <QrCodeContext.Provider
      value={{ read: read, device: device, storeDevice, storeRead }}
    >      
      {children}

    </QrCodeContext.Provider>
  );
};

function useQrCode() {
  const context = useContext(QrCodeContext);

  if (!context) {
    throw new Error('useTour must be used within an TourProvider');
  }

  return context;
}

export { QrCodeProvider, useQrCode };

