//***When the app is started, Screen1 appears with the defined text and button. When user presses the button, the app transition to Screen2. There’s no need to add a button to navigate back to Screen1 here because the Stack.Navigator adds navigation to the top of the screen automatically.

import { useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';

//***''route'' is a prop and was set to all screen components listed under Stack.Navigator when defined in App.js file.
const ChatScreen = ({ route, navigation }) => {

    const { name, selectedColor } = route.params;

    useEffect(() => {
        navigation.setOptions({ title: name });
        //***Empty array as the second parameter to ensure it doesn't rely on any state changes of that component (the code inside useEffect will be called only once, right after the component is mounted).
    }, []);

    return (
        <View style={[styles.container, { backgroundColor: selectedColor }]}>
            <Text>Hello Screen2!</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default ChatScreen;