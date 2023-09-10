//***Import necessary components.
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

//***Create the navigator
const Stack = createNativeStackNavigator();

//***Import necessary components.
import { initializeApp } from "firebase/app";
import { initializeFirestore } from "firebase/firestore";
// import { getFirestore } from "firebase/firestore";

//***Import the screens.
import StartScreen from './components/Start';
import ChatScreen from './components/Chat';

const App = () => {
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
          {/* Passing the 'db' as a prop to ChatScreen so the db prop variable can be accessed in Chat.js. This way of passing prop is specific to the React Navigation library (see libary documentation for more info). */}
          {props => <ChatScreen db={db} {...props} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;

