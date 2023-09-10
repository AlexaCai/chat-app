//***Import react Navigation
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

//***Create the navigator
const Stack = createNativeStackNavigator();

import { initializeApp } from "firebase/app";
import { initializeFirestore } from "firebase/firestore";
// import { getFirestore } from "firebase/firestore";

//***Import the screens
import StartScreen from './components/Start';
import ChatScreen from './components/Chat';

const App = () => {
//***Configuration keys taken from Firestore website, and that allow the whole app to connect to the app's Firestore database.
  const firebaseConfig = {
    apiKey: "AIzaSyBlOjdblDrLxZJ92Nl2hHM3Nc_uj-V01NQ",
    authDomain: "chat-app-61899.firebaseapp.com",
    projectId: "chat-app-61899",
    storageBucket: "chat-app-61899.appspot.com",
    messagingSenderId: "739804348074",
    appId: "1:739804348074:web:370ab56dfc8ca411cb9ad3"
  };

  //***Initialize Firebase
  const app = initializeApp(firebaseConfig);

  //Initialize Cloud Firestore and get a reference to the service. IMPORTANT: the code below presented some issues. The following piece of code 'const db = initializeFirestore' has been used as an alternative.
  // const db = getFirestore(app);

  //***Initialize Cloud Firestore and get a reference to the service.
  const db = initializeFirestore(app, {
    experimentalForceLongPolling: true
  })

  return (
    <NavigationContainer>
      <Stack.Navigator
        //***First screen to load upon starting the app. This prop’s value should be the name of one of the Stack.Screens.
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
          {props => <ChatScreen db={db} {...props} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;

