import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { initializeApp } from "firebase/app";
import { initializeFirestore, disableNetwork, enableNetwork } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { useNetInfo } from '@react-native-community/netinfo';
import { useEffect } from "react";
import { Alert } from "react-native";
// import { getFirestore } from "firebase/firestore";


const Stack = createNativeStackNavigator();


import StartScreen from './components/Start';
import ChatScreen from './components/Chat';


const App = () => {


  const connectionStatus = useNetInfo();


  //***useEffect() display an alert pop up if internet connection is lost.
  useEffect(() => {
    if (connectionStatus.isConnected === false) {
      Alert.alert("Connection Lost!");
      disableNetwork(db);
    } else if (connectionStatus.isConnected === true) {
      enableNetwork(db);
    }
  }, [connectionStatus.isConnected]);


  //***Configuration for the Firebase taken from Firestore website to allow the whole app to connect to the app's Firestore database.
  const firebaseConfig = {
    apiKey: "AIzaSyBlOjdblDrLxZJ92Nl2hHM3Nc_uj-V01NQ",
    authDomain: "chat-app-61899.firebaseapp.com",
    projectId: "chat-app-61899",
    storageBucket: "chat-app-61899.appspot.com",
    messagingSenderId: "739804348074",
    appId: "1:739804348074:web:370ab56dfc8ca411cb9ad3"
  };


  //***Initialize Firebase.
  const app = initializeApp(firebaseConfig);


  //***Initialize Cloud Firestore and get a reference to the service. 
  //***IMPORTANT: the code below presented some issues. The following piece of code 'const db = initializeFirestore' has been used as an alternative.
  // const db = getFirestore(app);


  //***Initialize Cloud Firestore and get a reference to the service.
  const db = initializeFirestore(app, {
    experimentalForceLongPolling: true
  })


  //***Used to initialize the storage handler (for storing photos and images in Cloud storage).
  const storage = getStorage(app);


  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="StartScreen"
      >
        <Stack.Screen
          name="StartScreen" options={{ headerShown: false }}
          component={StartScreen}
        />
        <Stack.Screen
          name="ChatScreen"
        >
          {props => <ChatScreen isConnected={connectionStatus.isConnected} db={db} storage={storage} {...props} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}


export default App;

