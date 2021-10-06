import React, { useState, useEffect } from 'react';

import {
  Text,
  TouchableOpacity,
  Linking,
  View,
  Button,
  ActivityIndicator,
} from 'react-native';

import {
  Container,
  Title,
  ContainerMain,
  IconDiv,
  SubTitle,
  DivSubtitle,
  Btn,
  DivBtn,
  Fundo,
  TextColored,
  Image,
  FooterBluetooth,
  BluetoothText,
  BluetoothSubTitle,
  ContainerAction,
} from './styles';

import Icon from 'react-native-vector-icons/Feather';

import useBackgroundLocation from '../../services/BackgroundLocation';
import { useBackgroundGeo } from '../../hooks/backgroundGeo';
const BackgroundGeo = () => {
  console.log('INIT USEBACKGROUND GEO...');
  const backgroundLocation = useBackgroundGeo();
  const {
    getCurrentPosition,
    sendmessage,
    configMonitoring,
    startMonitoring,
    stopMonitoring,
    syncTravel,
    statusBackground,
  } = useBackgroundLocation();

  const status = async () => {
    if (
      backgroundLocation.config === false ||
      backgroundLocation.run === false
    ) {
      configMonitoring();
    }
  };

  const statusConfi = backgroundLocation.run === true ? 'Ativa' : 'Inativa!!';
  const moving = backgroundLocation.moving;
  const speed = backgroundLocation.speed;
  status();
  statusBackground();
  configMonitoring();
  return (
    <>
      <Container>
        <ContainerMain>
          <IconDiv>
            <Icon
              name="bluetooth"
              size={30}
              color={'#95989A'}
              style={{ marginTop: 3 }}
            />
          </IconDiv>
          <Title>Sat Connect</Title>
        </ContainerMain>
        <ContainerAction>
          <DivSubtitle>
            <SubTitle>
              Com o SAT Connect você pode parear seu app com o veículo via{' '}
              <TextColored>BLUETOOTH</TextColored> e ser notificado quando
              houver qualquer distanciamento.
            </SubTitle>
            <SubTitle>
              <TextColored>{statusConfi}</TextColored>
            </SubTitle>
          </DivSubtitle>
          <Fundo>
            <Image source={require('../../assets/Background/fundo.png')} />
          </Fundo>
          <DivBtn>
            <Btn>
              <Icon name="bluetooth" size={50} color={'#FFFFFF'} />
            </Btn>
          </DivBtn>
          <FooterBluetooth>
            <BluetoothText>Pareado...</BluetoothText>
            <BluetoothSubTitle>Monitorando!</BluetoothSubTitle>
            <BluetoothSubTitle>{moving}</BluetoothSubTitle>
            <BluetoothSubTitle>{speed}KM/H</BluetoothSubTitle>
          </FooterBluetooth>
        </ContainerAction>
      </Container>
    </>
  );
};

export default BackgroundGeo;
