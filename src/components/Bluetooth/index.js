import React, { useState, useEffect } from 'react';

import { Text, TouchableOpacity, Linking, View, Button, ActivityIndicator, Alert } from 'react-native';

import {
  Container,
  Title,
  ContainerMain,
  IconDiv,
  SubTitle,
  DivSubtitle,
  DivBluetooth,
  Btn,
  DivBtn,
  TextBtn,
  Fundo,
  Footer,
  FooterTxt,
  FooterSubtitle,
  TextColored,
  Image,
  FooterBluetooth,
  BluetoothText,
  BluetoothSubTitle,
  DivPair,
  TxtPair,
  PairSubTitle,
} from './styles';

import Icon from 'react-native-vector-icons/Feather';
import useBlueToothScan from '../../services/BlueTooth';

const Bluetooth = () => {
  console.warn('init bluetooth...');

  const [scanTag, stopScan, loading] = useBlueToothScan();
  scanTag();
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
        <View>
          <DivSubtitle>
            <SubTitle>
              Com o SAT Connect você pode parear seu app com o veículo via{' '}
              <TextColored>BLUETOOTH</TextColored> e ser notificado quando
              houver qualquer distanciamento.
            </SubTitle>
          </DivSubtitle>
          <Fundo>
            <Image source={require('../../assets/Background/fundo.png')} />
          </Fundo>
          <>
            <DivBtn>
              <Btn>
                <ActivityIndicator color="#fff" size="large"/>
              </Btn>
            </DivBtn>
            <FooterBluetooth>
              <BluetoothText>Procurando...</BluetoothText>
              <BluetoothSubTitle>Aguarde</BluetoothSubTitle>
            </FooterBluetooth>
          </>
        </View>
      </Container>
    </>
  );
};

export default Bluetooth;
