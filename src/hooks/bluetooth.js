import React, {
  createContext,
  useContext,
  useCallback,
  useState,
  useEffect,
} from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';

const BluetoothContext = createContext({});

const BluetoothProvider = ({ children }) => {
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [major, setMajor] = useState('');
  const [minor, setMinor] = useState('');

  useEffect(() => {
    async function loadStoragedData() {
      const id = await AsyncStorage.getItem('deviceId');
      setId(id);
      const name = await AsyncStorage.getItem('deviceName');
      setName(name);
      console.warn('bluetooth name');
      console.warn(name);

      const major = await AsyncStorage.getItem('deviceMajor');
      setMajor(major);
      const minor = await AsyncStorage.getItem('deviceMinor');
      setMinor(minor);
      console.warn('o bluetooth iniciou!!!');
    }
    loadStoragedData();
  }, []);

  const storeId = useCallback(async (deviceId) => {
    setId(deviceId);
    return await AsyncStorage.setItem('deviceId', deviceId);
  }, []);

  const storeName = useCallback(async (deviceName) => {
    setName(deviceName);
    return await AsyncStorage.setItem('deviceName', deviceName);
  }, []);

  const storeMajor = useCallback(async (deviceMajor) => {
    setMajor(deviceMajor);
    return await AsyncStorage.setItem('deviceMajor', deviceMajor);
  }, []);

  const storeMinor = useCallback(async (deviceMinor) => {
    setMinor(deviceMinor);
    return await AsyncStorage.setItem('deviceMinor', deviceMinor);
  }, []);

  return (
    <BluetoothContext.Provider
      value={{
        id: id,
        name: name,
        major: major,
        minor: minor,
        storeId,
        storeName,
        storeMajor,
        storeMinor,
      }}
    >
      {children}
    </BluetoothContext.Provider>
  );
};

function useBluetooth() {
  const context = useContext(BluetoothContext);

  if (!context) {
    throw new Error('useBluetooth must be used within an BluetoothProvider');
  }

  return context;
}

export { BluetoothProvider, useBluetooth };
