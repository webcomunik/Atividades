/**
 * @format
 */
import { AppRegistry } from 'react-native';
import App from './src/App';
import { name as appName } from './app.json';
import BackgroundFetch from "react-native-background-fetch";

let MyHeadlessTask = async (event) => {
    console.warn('[BackgroundFetch HeadlessTask] start');
   
    // Perform an example HTTP request.
    // Important:  await asychronous tasks when using HeadlessJS.
    
    let response = await fetch('https://facebook.github.io/react-native/movies.json');
    let responseJson = await response.json();
    console.warn('[BackgroundFetch HeadlessTask response: ', responseJson);
   
    // Required:  Signal to native code that your task is complete.
    // If you don't do this, your app could be terminated and/or assigned
    // battery-blame for consuming too much time in background.
    BackgroundFetch.finish();
  };
BackgroundFetch.registerHeadlessTask(MyHeadlessTask);
AppRegistry.registerComponent(appName, () => App);
