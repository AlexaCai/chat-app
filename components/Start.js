//***When the app is started, StartScreen appears to users (this file). When users press the 'Start chatting' button on StartScreen, the app transition to the ChatScreen. 

import { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ImageBackground, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { getAuth, signInAnonymously } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";


const StartScreen = ({ navigation }) => {


    //***Initialize the Firebase authentication handler (needed for signInAnonymously()) at the start of the component).
    const auth = getAuth();


    const [name, setName] = useState('');
    const [selectedColor, setSelectedColor] = useState('');
    const image = require('../img/BackgroundImage.png');

    //***Function call when user click 'Start chatting' button on the start screen.
    const signInUser = async () => {
        let userId = await AsyncStorage.getItem("userId");

        //***If there's no user ID locally stored on the device (first time user), a new user ID is assigned to the user, and this user ID is stored locally on his device. 
        if (!userId) {
            signInAnonymously(auth)
                .then(result => {
                    userId = result.user.uid;
                    AsyncStorage.setItem("userId", userId)
                        .then(() => {
                            navigation.navigate("ChatScreen", {
                                userID: userId,
                                name: name,
                                selectedColor: selectedColor,
                            });
                        })
                        .catch(error => {
                            console.error("Error storing user ID locally:", error);
                            Alert.alert("Unable to sign in, try again later.");
                        });
                })
                .catch((error) => {
                    console.error("Error signing in anonymously:", error);
                    Alert.alert("Unable to sign in, try again later.");
                });
            //***If user is not at his first visit on the app, he already has his user ID stored locally to sign in. This user ID is used.
        } else {
            navigation.navigate("ChatScreen", {
                userID: userId,
                name: name,
                selectedColor: selectedColor,
            });
        }
    }


    return (
        <View style={styles.container}>
            <ImageBackground source={image} resizeMode="cover" style={styles.image}>
                <Text style={styles.appTitle}>Chat App</Text>
                <View style={styles.interactionBox}>
                    <TextInput
                        style={styles.textInput}
                        value={name}
                        onChangeText={setName}
                        placeholder='Your name'
                    />
                    <Text style={styles.chooseBackGroundColorText}>Choose your chat background color:</Text>
                    <View style={styles.chatBackgroundColorContainer}>
                        <TouchableOpacity style={styles.chatBackgroundColorBlackButton}
                            onPress={() => {
                                setSelectedColor("#090C08");
                            }}>
                            <View style={styles.chatBackgroundColorButton}></View>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.chatBackgroundColorPurpleButton}
                            onPress={() => {
                                setSelectedColor("#474056");
                            }}>
                            <View style={styles.chatBackgroundColorButton}></View>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.chatBackgroundColorGrayButton}
                            onPress={() => {
                                setSelectedColor("#8A95A5");
                            }}>
                            <View style={styles.chatBackgroundColorButton}></View>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.chatBackgroundColorGreenButton}
                            onPress={() => {
                                setSelectedColor("#B9C6AE");
                            }}>
                            <View style={styles.chatBackgroundColorButton}></View>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity
                        style={styles.startChattingButton}
                        onPress={signInUser}>
                        <Text style={styles.buttonText}>Start chatting</Text>
                    </TouchableOpacity>
                </View>
            </ImageBackground>
            {/* Code logic ensuring that if the platform’s OS used to run the app is iOS, the component KeyboardAvoidingView is added (which will ensure that when users launch their keyboard to enter any text, the keyboard won't hides the input field or the background color picker section - problem only occuring with Iphones / iOS mobile models). If OS is not an iOS, logic tells to insert nothing. */}
            {Platform.OS === 'ios' ? <KeyboardAvoidingView behavior="padding" /> : null}
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    image: {
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    appTitle: {
        flex: 0.5,
        fontSize: 45,
        fontWeight: "600",
        color: "#FFFFFF",
        justifyContent: 'center',
        alignItems: 'center',
    },
    interactionBox: {
        backgroundColor: "#FFFFFF",
        width: '90%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    textInput: {
        width: "88%",
        fontSize: 16,
        fontWeight: "300",
        color: "#757083",
        opacity: 0.5,
        padding: 15,
        borderWidth: 2,
        marginTop: '5%',
        marginBottom: '5%',
    },
    chooseBackGroundColorText: {
        textAlign: 'left',
        alignSelf: 'flex-start',
        marginLeft: '7%'
    },
    chatBackgroundColorContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        width: '88%',
        paddingTop: '5%',
        paddingBottom: '7%',
    },
    chatBackgroundColorBlackButton: {
        width: 50,
        height: 50,
        backgroundColor: "#090C08",
        opacity: 1,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: '5%',
    },
    chatBackgroundColorPurpleButton: {
        width: 50,
        height: 50,
        backgroundColor: "#474056",
        opacity: 1,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: '5%',
    },
    chatBackgroundColorGrayButton: {
        width: 50,
        height: 50,
        backgroundColor: "#8A95A5",
        opacity: 1,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: '5%',
    },
    chatBackgroundColorGreenButton: {
        width: 50,
        height: 50,
        backgroundColor: "#B9C6AE",
        opacity: 1,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
    },
    startChattingButton: {
        width: "88%",
        backgroundColor: "#757083",
        padding: 15,
        borderWidth: 1,
        marginTop: '2%',
        marginBottom: '5%'
    },
    buttonText: {
        fontSize: 16,
        fontWeight: "600",
        color: "#FFFFFF",
        textAlign: "center"
    },
});


export default StartScreen;