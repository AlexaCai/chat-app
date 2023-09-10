//***When the app is started, Start Screen appears to users (this file). When users press the 'Start chatting' button on Start Screen, the app transition to Chat Screen. 

//***Import all necessary components the ensure app's working.
//***KeyboardAvoidingView and Platform from 'react-native' are used to ensured that when users launch their keyboard to enter any text in the start screen, the keyboard won't hides the name and background color picker form (problem for iOS / Iphone mobile models).
import { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ImageBackground, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { getAuth, signInAnonymously } from "firebase/auth";


const StartScreen = ({ navigation }) => {

    //***Initialize the Firebase authentication handler (needed for signInAnonymously()) at the start of the component).
    const auth = getAuth();

    //***Used to get the name user types in the TextInput and display it on the header of the Chat Screen (via props extraction in Chat.js).
    const [name, setName] = useState('');
    //***Used to get the background user choose on the Start Screen and display it on the Chat Screen background (via props extraction in Chat.js).
    const [selectedColor, setSelectedColor] = useState('');
    //***Used to requiere the background image for the Start Screen (const image used below to display it).
    const image = require('../img/BackgroundImage.png');

    //***Function call when user click 'Start chatting' button on the start screen. This 'const signInUser' allows the user to sign in anonymously.
    const signInUser = () => {
        //***signInAnonymously() returns a promise, with .then() and .catch() to it.
        signInAnonymously(auth)
            //*** 'result' is an information object regarding the temporary user account.
            .then(result => {
                //***Once the user is signed in (by clicking on 'Start chatting' button), the app navigates to the Chat screen while passing result.user.uid (which is assigned to the route parameter userID). This user ID is used to personalize the chat messages users view and add to the Chat screen (users are only able to see the messages that match their user UID).
                navigation.navigate("ChatScreen", {
                    userID: result.user.uid,
                    name: name,
                    selectedColor: selectedColor,
                });
                Alert.alert("Signed in Successfully!");
            })
            .catch((error) => {
                Alert.alert("Unable to sign in, try later again.");
            })
    }

    return (
        //***Initial container for the whole screen.
        <View style={styles.container}>
            {/* Background image inserted here to display it on app's background (source={image} referring to the const image defined above). */}
            <ImageBackground source={image} resizeMode="cover" style={styles.image}>
                <Text style={styles.appTitle}>Chat App</Text>
                {/* View added here to apply stylings to the interaction zone on app's Start Screen (TextInput, color choosing, start chatting button) */}
                <View style={styles.interactionBox}>
                    {/* Input bar for users to enter their name. */}
                    <TextInput
                        style={styles.textInput}
                        //***{name} here refers to the ''const name, setName'' useState above. At first, this is empty like defined ('').
                        value={name}
                        //***Ensure that when user types something, setName is used to update the ''name'' value in 'const name, setName' above.
                        onChangeText={setName}
                        placeholder='Your name'
                    />
                    <Text style={styles.chooseBackGroundColorText}>Choose your chat background color:</Text>
                    {/* View added here to apply stylings to the line presentend the four different background color options on app's Start Screen. */}
                    <View style={styles.chatBackgroundColorContainer}>
                        {/* Button to choose the Chat Screen black background color. */}
                        <TouchableOpacity style={styles.chatBackgroundColorBlackButton}
                            //***When user clicks on this button (onPress), setSelectedColor is used to update the selectedColor value in 'const selectedColor, setSelectedColor' useState above (and this updated value is later used to set up the Chat Screen background color accordingly).
                            onPress={() => {
                                setSelectedColor("#090C08");
                            }}>
                            <View style={styles.chatBackgroundColorButton}></View>
                        </TouchableOpacity>
                        {/* Purple background button: same principle than for the Chat Screen black background color above. */}
                        <TouchableOpacity style={styles.chatBackgroundColorPurpleButton}
                            onPress={() => {
                                setSelectedColor("#474056");
                            }}>
                            <View style={styles.chatBackgroundColorButton}></View>
                        </TouchableOpacity>
                        {/* Gray background button: same principle than for the Chat Screen black background color above. */}
                        <TouchableOpacity style={styles.chatBackgroundColorGrayButton}
                            onPress={() => {
                                setSelectedColor("#8A95A5");
                            }}>
                            <View style={styles.chatBackgroundColorButton}></View>
                        </TouchableOpacity>
                        {/* Green background button: same principle than for the Chat Screen black background color above. */}
                        <TouchableOpacity style={styles.chatBackgroundColorGreenButton}
                            onPress={() => {
                                setSelectedColor("#B9C6AE");
                            }}>
                            <View style={styles.chatBackgroundColorButton}></View>
                        </TouchableOpacity>
                    </View>
                    {/* Button for user to click on and be redirected to Chat Screen. */}
                    <TouchableOpacity
                        style={styles.startChattingButton}
                        //***When user click on the button (onPress), signInUser is called (see above where the function is defined). It also pass some data to the Chat screen along with it (name and background color selected by the user). 'ChatScreen' screen can then access this data using the props passed to it (see Chat.js file).
                        onPress={signInUser}>
                        <Text style={styles.buttonText}>Start chatting</Text>
                    </TouchableOpacity>
                </View>
            </ImageBackground>
            {/* Code logic ensuring that if the platform’s OS used to run the app is iOS, the component KeyboardAvoidingView is added (which will ensure that when users launch their keyboard to enter any text in the start screen, the keyboard won't hides the input field or the background color picker section - problem only occuring with Iphone / iOS mobile models). If OS is not an iOS, logic tells to insert nothing. */}
            {Platform.OS === 'ios' ? <KeyboardAvoidingView behavior="padding" /> : null}
        </View>
    );
}

//***Styling logics for all elements appearing on Start Screen.
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