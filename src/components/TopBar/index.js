import React from 'react';
import { View, Text, Image } from 'react-native';

import {
    Container,
    ContainerLeft,
    ContainerCenter,
    LogoCenter,
    ContainerRight,
  } from './styles';

import LogoTopBar from '../../assets/logos/logo_top.svg';

const TopBar = () => {
    return(
        <>
         <Container style={{ zIndex: 1, elevation: 1 }}>
        <ContainerLeft></ContainerLeft>
        <ContainerCenter>
          <LogoCenter>
           <LogoTopBar></LogoTopBar>
          </LogoCenter>
        </ContainerCenter>
        <ContainerRight >
          
        </ContainerRight>
      </Container>
        </>
    )
}

export default TopBar;