import { useState } from 'react';
import { StyleSheet, View, Text, Button, TextInput, TouchableOpacity } from 'react-native';

const StartScreen = ({ navigation }) => {
    const [name, setName] = useState('');

    return (
        <View style={styles.container}>
            <Text>Hello Screen1!</Text>
            <TextInput
                style={styles.textInput}
                value={name}
                onChangeText={setName}
                placeholder='Your name'
            />
            <TouchableOpacity
                style={styles.startChattingButton}
                //***Addition an object { name: name } as a second parameter representing the data to be used in the screen the app is transitioning to (than in screen 2, { name: name } is extracted using prop).
                onPress={() => navigation.navigate('ChatScreen', { name: name })}>
                <Text style={styles.buttonText}>Start chatting</Text>
            </TouchableOpacity>
        </View>
    );
}

//*
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    textInput: {
        width: "88%",
        fontSize: 16,
        fontWeight: "300",
        color: "#757083",
        opacity: 0.5,
        padding: 15,
        borderWidth: 1,
        marginTop: 15,
        marginBottom: 15
    },
    startChattingButton: {
        width: "88%",
        backgroundColor: "#757083",
        padding: 15,
        borderWidth: 1,
        marginTop: 15,
        marginBottom: 15
    },
    buttonText: {
        fontSize: 16,
        fontWeight: "600",
        color: "#FFFFFF",
        textAlign: "center"
    },
});

export default StartScreen;