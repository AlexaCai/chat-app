//***When the app is started, Start Screen appears to users. When users press the 'Start chatting' button on Start Screen, the app transition to Chat Screen (this file). 

//***Import all necessary components the ensure app's working
import { useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';

//***Defines the React component named ChatScreen that takes two props: route and navigation. 
//***These props are provided by React Navigation to screen components. 'route' allows to access the data passed to this screen during navigation (in this case, from Start Screen), and 'navigation' allows to navigate to other screens.
const ChatScreen = ({ route, navigation }) => {

    //***Extract the 'name' and 'selectedColor' properties from the route.params object. Those two data (user selected name and background color) were passed as parameters from Start Screen to Chat Screen when navigating to Chat Screen (so when users click on 'Start chatting' button on Start Screen).
    const { name, selectedColor } = route.params;

    //***Sets the title of the screen (in the header at the top) to the value of the 'name' parameter using navigation.setOptions({ title: name }) (so the title of the screen is dynamically updated based on the name chosen by users in InputText on Start Screen).
    useEffect(() => {
        navigation.setOptions({ title: name });
        //***Empty array as the second parameter ensures that the code inside useEffect (which sets the screen title) runs only once when the component is mounted, and that it won't be influenced by any state changes in this component (Chat.js).
    }, []);

    return (
        //***Return here what's shown on Chat Screen UI.
        <View style={[styles.container, { backgroundColor: selectedColor }]}>
            <Text>Hello Screen2!</Text>
        </View>
    );
}

//***Styling logics for all elements appearing on Chat Screen.
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default ChatScreen;