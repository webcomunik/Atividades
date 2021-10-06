import React, { useState, useEffect } from 'react';

import { useQrCode } from '../../hooks/qrcode';
import QRCodeScanner from 'react-native-qrcode-scanner';

import { Text, TouchableOpacity, View, Button, Alert } from 'react-native';

import {
  Container,
  Title,
  ContainerMain,
  IconDiv,
  SubTitle,
  DivSubtitle,
  Btn,
  DivBtn,
  TextBtn,
  Fundo,
  Footer,
  FooterTxt,
  FooterSubtitle,
  TextColored,
  Image,
} from './styles';


import Icon from 'react-native-vector-icons/Feather';

const QrCode = () => {
  const qrcode = useQrCode();
  const [scan, setScan] = useState(false);
  const [ScanResult, setScanResult] = useState(false);
  let scanner;
  let result = false;


  const onSuccess = async (e) => {
    console.log('SUCESSO SATCONNECT_TAG ON QRCODE');
    if (e.data == 'SATCONNECT_TAG') {
      e.data = 'Satconn-Tag';
    }
    qrcode.storeDevice(e.data);
    setScan(false);
    setScanResult(true);

  };

  const activeQR = () => {
    console.log('ATIVANDO QRCODE');
    setScan(true);
    setScanResult(true);
  };

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
        {!scan && !ScanResult && (
          <View>
            <DivSubtitle>
              <SubTitle>
                Com o SAT Connect você pode parear seu app com o veículo via{' '}
                <TextColored>BLUETOOTH</TextColored> e ser notificado quando
                houver qualquer distanciamento. {result}
              </SubTitle>
            </DivSubtitle>
            <Fundo>
              <Image source={require('../../assets/Background/fundo.png')} />
            </Fundo>
            <DivBtn>
              <Btn onPress={() => activeQR()}>
                <Icon name="camera" size={50} color={'#FFFFFF'} />
              </Btn>
              <TextBtn>Ativar!</TextBtn>
            </DivBtn>
            <Footer>
              <FooterTxt>Ative a Camera</FooterTxt>
              <FooterSubtitle>em seguida aproxime ao QR CODE</FooterSubtitle>
            </Footer>
          </View>
        )}

        {scan && (
          <QRCodeScanner
            reactivate={true}
            showMarker={true}
            ref={(node) => {
              scanner = node;
            }}
            onRead={onSuccess}
            bottomContent={
              <View>
                <TouchableOpacity onPress={() => setScan(false)}>
                  <Text style={{ color: '#9D3CFA' }}>Fechar</Text>
                </TouchableOpacity>
              </View>
            }
          />
        )}
      </Container>
    </>
  );
};

export default QrCode;
