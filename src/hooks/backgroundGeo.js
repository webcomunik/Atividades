import React, {
  createContext,
  useContext,
  useCallback,
  useState,
  useEffect,
} from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';

const BackgroundGeoContext = createContext({});

const BackgroundGeoProvider = ({ children }) => {
  const [config, setConfig] = useState(false);
  const [run, setRun] = useState(false);
  const [moving, setMoving] = useState('Parado');
  const [speed, setSpeed] = useState('0');

  useEffect(() => {
    async function loadStoragedData() {
      console.log('INIT LOADSTORAGE...');
      const configured = await AsyncStorage.getItem('config');
      console.log('configured is ' + configured);
      const jsonConfig = configured == 'true' ? 'true' : 'false';
      storeConfig(jsonConfig);
      const running = await AsyncStorage.getItem('backgroundRun');
      console.log('running is ' + running);
      const jsonRunning = running == 'true' ? 'true' : 'false';
      storeRun(jsonRunning);
      const moving = await AsyncStorage.getItem('backgroundMoving');
      const jsonMoving = moving == 'true' ? 'true' : 'false';
      storeMoving(jsonMoving);
      const speed = await AsyncStorage.getItem('backgroundSpeed');
      const jsonSpeed = speed == 'true' ? 'true' : 'false';
      storeSpeed(jsonSpeed);
    }
    loadStoragedData();
  }, []);

  const storeConfig = async (config) => {
    try {
        await AsyncStorage.setItem('config', config);
        setConfig(config);
        console.warn(`Finalizou salvar ${config}`);
      } catch (error) {
        console.warn('Não foi possível salvar config');
        console.log(error);
      }
    };
   
    const storeRun = async (run) => {
      try {
        await AsyncStorage.setItem('backgroundRun', run);
        setRun(run);
        console.warn(`Finalizou salvar ${run}`);
      } catch (error) {
        console.warn('Não foi possível salvar run');
        console.log(error);
      }
    };

      // const storeConfig = useCallback(async (config) => {
  //   setConfig(config == 'true' ? true : false);
  //   try {
  //     return await AsyncStorage.setItem('@config', config)
  //   } catch (e) {
  //     // saving error
  //     console.log('Erro gravando config');
  //     console.log(e);
  //     return ;
  //   }      

  //   //return await AsyncStorage.setItem('config', config);
  // }, []);

  // const storeRun = useCallback(async (run) => {
  //   setRun(run == 'true' ? true : false);
  //   return await AsyncStorage.setItem('backgroundRun', run);
  // }, []);

  const storeMoving = async (moving) => {
    try {
      await AsyncStorage.setItem('backgroundMoving', moving);
      setMoving(moving);
      console.warn(`Finalizou salvar ${moving}`);
    } catch (error) {
      console.warn('Não foi possível salvar moving');
      console.log(error);
    }
  };

  // const storeMoving = useCallback(async (moving) => {
  //   setRun(moving);
  //   return await AsyncStorage.setItem('backgroundMoving', moving);
  // }, []);
  // const storeSpeed = useCallback(async (speed) => {
  //   setRun(speed);
  //   return await AsyncStorage.setItem('backgroundSpeed', speed);
  // }, []);
  const storeSpeed = async (speed) => {
    try {
      await AsyncStorage.setItem('backgroundSpeed', speed);
      setSpeed(speed);
      console.warn(`Finalizou salvar ${speed}`);
    } catch (error) {
      console.warn('Não foi possível salvar speed');
      console.log(error);
    }
  };


  return (
    <BackgroundGeoContext.Provider
      value={{
        config: config,
        run: run,
        moving: moving,
        speed: speed,
        storeConfig,
        storeRun,
        storeMoving,
        storeSpeed,
      }}
    >
      {children}
    </BackgroundGeoContext.Provider>
  );
};

function useBackgroundGeo() {
  console.log('INIT useBackgroundGeo...2');
  const context = useContext(BackgroundGeoContext);

  if (!context) {
    throw new Error(
      'useBackgroundGeo must be used within an BackgroundGeoProvider'
    );
  }

  return context;
}

export { BackgroundGeoProvider, useBackgroundGeo };
