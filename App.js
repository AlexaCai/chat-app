//***Import react Navigation
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

//***Import the screens
import StartScreen from './components/Start';
import ChatScreen from './components/Chat';

//***Create the navigator
const Stack = createNativeStackNavigator();

const App = () => {
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
          component={ChatScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;

