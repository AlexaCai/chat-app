//***Import necessary components.
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

//***useNetInfo is used to determine whether a user is online or not.
import { useNetInfo } from '@react-native-community/netinfo';
import { useEffect } from "react";
import { Alert } from "react-native";

//***Create the navigator
const Stack = createNativeStackNavigator();

//***Import necessary components.
import { initializeApp } from "firebase/app";
import { initializeFirestore, disableNetwork, enableNetwork } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// import { getFirestore } from "firebase/firestore";

//***Import the screens.
import StartScreen from './components/Start';
import ChatScreen from './components/Chat';

//***Defines the component App. 
const App = () => {

  //***Used to define a new state that represents the network connectivity status of the user.
  const connectionStatus = useNetInfo();

  //***useEffect() code that display an alert popup if internet connection is lost.
  //***In Android, Firebase keep attempting to reconnect to the Firestore Database.
  useEffect(() => {
    //***To disable Firebase attempts to reconnect to Firestore database when there's no internet, the Firestore function 'disableNetwork(db)' is called when '.isConnected' is 'false'. 
    if (connectionStatus.isConnected === false) {
      Alert.alert("Connection Lost!");
      disableNetwork(db);
      //***To re-enable Firestore database when internet is back, the Firestore function 'enableNetwork(db)' is called when '.isConnected' is 'true'.
    } else if (connectionStatus.isConnected === true) {
      enableNetwork(db);
    }
  }, [connectionStatus.isConnected]);

  //***Configuration keys and all other codes below are taken from Firestore website, and they allow the whole app to connect to the app's Firestore database.
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

  //Initialize Cloud Firestore and get a reference to the service. IMPORTANT: the code below presented some issues. The following piece of code 'const db = initializeFirestore' has been used as an alternative.
  // const db = getFirestore(app);

  //***Initialize Cloud Firestore and get a reference to the service.
  const db = initializeFirestore(app, {
    experimentalForceLongPolling: true
  })

  //***Used to  initialize the storage handler (for storing photos and images).
  const storage = getStorage(app);

  //***'return" defines the structure of the app, specifying how the navigation and screens are organized and connected. When the app is run, this structure is rendered, and users interact with the screens as defined in this block of code.
  return (
    <NavigationContainer>
      <Stack.Navigator
        //***First screen to load upon starting the app (this prop’s value have be the name of one of the Stack.Screens).
        initialRouteName="StartScreen"
      >
        <Stack.Screen
          //***options={{ headerShown: false }} ensure that the name of the screen doesnt appears in the navigation header on the start screen.
          name="StartScreen" options={{ headerShown: false }}
          component={StartScreen}
        />
        <Stack.Screen
          name="ChatScreen"
        >
          {/* The 'connectionStatus.isConnected' is passed as a prop to the ChatScreen so this information (user connected to internet or not) can be used in that screen/file/component. */}
          {/* Passing the 'db' and 'storage' as props to ChatScreen so these props can be accessed in Chat.js. This way of passing props is specific to the React Navigation library (see libary documentation for more info). */}
          {props => <ChatScreen isConnected={connectionStatus.isConnected} db={db} storage={storage} {...props} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;

