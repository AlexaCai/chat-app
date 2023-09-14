//***When the app is started, StartScreen appears to users. When users press the 'Start chatting' button on StartScreen, the app transition to the ChatScreen (this file). 

//***Import all necessary components.
import { useEffect, useState } from 'react';
import { StyleSheet, View, KeyboardAvoidingView, Platform, TouchableOpacity, Text } from 'react-native';
import { GiftedChat, Bubble, InputToolbar } from "react-native-gifted-chat";
import { collection, addDoc, onSnapshot, query, orderBy } from "firebase/firestore";
import { Audio } from "expo-av";
import CustomActions from './CustomActions';
import MapView from 'react-native-maps';
import AsyncStorage from "@react-native-async-storage/async-storage";

//***Defines the component ChatScreen with several props.
const ChatScreen = ({ route, navigation, db, isConnected, storage }) => {

    //***Extract the 'userUID', 'name' and 'selectedColor' properties from the route.params object. These data were passed as parameters from StartScreen to ChatScreen when navigating to ChatScreen (so when users click on 'Start chatting' button on StartScreen).
    const { userID, name, selectedColor } = route.params;
    //***const used to manage and display chat messages.
    //***'messages' state stores the chat messages that users send and receive during their chat sessions. Each message is represented as an object in the array, and the array holds a history of all chat messages.
    //***'setMessage' is used to update the 'messages' state. When a new message is sent or received, it is appended to the 'messages' array using the 'setMessages' function. This ensures that the chat interface displays the most up-to-date messages.
    const [messages, setMessages] = useState([]);


    //***Reference the currently playing sound. This is used (in pair with renderAudioBubble function below) ensures that the sound file doesn’t keep playing in the background if users close the app.
    let soundObject = null;


    //***Variable is used to keep a reference to the unsubscribe function returned by the onSnapshot listener from Firebase Firestore.
    let unsubMessages;

    //***useEffect called right after the ChatScreen component mounts. 
    useEffect(() => {
        //***Sets the title of the screen (in the header at the top) to the value of the 'name' parameter using navigation.setOptions({ title: name }) (so the title of the screen is dynamically updated based on the name chosen by users in InputText on StartScreen).
        navigation.setOptions({ title: name });

        //***Fetch messages from the Firestore Database only if there’s a network connection - otherwise, call loadCachedLists().
        if (isConnected === true) {
            //***Whenever the connection status is switched off and then back on again, new onSnapshot() listeners are created. To avoid this, onSnapshot’s unsubscribe function is called and his reference is sets to null before calling onSnapshot().
            if (unsubMessages) unsubMessages();
            unsubMessages = null;
            //***The code below sets up a real-time listener for chat messages stored in a Firestore database.
            const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));
            //***'onSnapshot' function continuously watch for changes in the messages collection in Firestore.
            unsubMessages = onSnapshot(q, (documentsSnapshot) => {
                //***When there's a new chat messages (either sent by the user or received from others), the code processes this message and updates the 'messages' state, which contains all chat messages and is used to display the chat history on the screen.
                let newMessages = [];
                documentsSnapshot.forEach(doc => {
                    newMessages.push({
                        id: doc.id, ...doc.data(),
                        createdAt: new Date(doc.data().createdAt.toMillis())
                    });
                });
                //***cacheMessages stores new chat messages locally, and setMessages updates the state of the ChatScreen component to display the new chat messages retrieved from Firestore. 
                //***These two functions work together to ensure that updated chat messages are both cached for offline use and displayed in real-time when there is an internet connection.
                cacheMessages(newMessages);
                setMessages(newMessages);
            });
            //***Fetch messages from the cache to display on users UI only if there’s no network connection.
        } else loadCachedMessages();

        //***Used to clean up code and stops the real-time message listener when the chat screen is no longer in use to avoid memory leaks (it’s best practice to stop listeners if they’re no longer needed to avoid memory leak - memory leak occurs when data that isn't needed still occupies memory without intending to do so).
        return () => {
            if (unsubMessages) unsubMessages();
            if (soundObject) soundObject.unloadAsync();
        }
        //***'isConnected' prop as a dependency allows the component to call useEffect whenever the 'isConnected' value change (so whenever user lost / retrieve internet connection). Then the code can decide in real time whether to fetch data from AsyncStorage or the Firestore Database.
    }, [isConnected]);


    //***Asyn function is called/used if the 'isConnected' prop (passed from App.js) is FALSE. This load cached elements (messages) from AsyncStorage.getItem("messages").
    const loadCachedMessages = async () => {
        //*** || [] (equal to OR) in the code below assign an empty array to cachedLists in case AsyncStorage.getItem("messages") fails when the messages item hasn’t been set yet in AsyncStorage.
        const cachedMessages = await AsyncStorage.getItem("messages") || [];
        setMessages(JSON.parse(cachedMessages));
    }


    //***Function called inside onSnapshot()’s callback. Whenever 'query(collection(db, "shoppinglists"), orderBy("createdAt", "desc"));' is changed by an add, remove, or update query, the onSnapshot() callback cacheMessages is called. This means the cache will be kept up to date as long as there’s an internet connection.
    const cacheMessages = async (MessagesToCache) => {
        try {
            await AsyncStorage.setItem('messages', JSON.stringify(MessagesToCache));
        } catch (error) {
            console.log(error.message);
        }
    }


    //***Function to save/show sent messages in the Firestore database.
    const onSend = (messages) => {
        //***The append() function provided by GiftedChat appends the new message to the messages array (array which holds the message users just sent), and this message gets appended to the original list of messages from previousMessages, so that all messages (new and older ones) can be displayed in the chat.
        setMessages(previousMessages => GiftedChat.append(previousMessages, messages))
        //***The message to be added in the Firestore dabatase (using addDoc) is the first item in the newMessages array, which is the argument of the onSend function. That's why newMessages[0] is used here as the third argument. This code ensures that chat messages are persisted and can be retrieved from Firestore database.
        addDoc(collection(db, "messages"), messages[0])
    }


    //***renderCustomActions function is responsible for creating the circle button (+) in the input bar on which users can click to do more actions such as share images, take photos or share location.
    const renderCustomActions = (props) => {
        //***Returning the 'CustomActions' component with all necessary props.
        return <CustomActions storage={storage} {...props} />;
    };


    //***'renderCustomView' function is where 'currentMessage' is check to see if it contains location data. If the answer is yes, it returns a MapView in the chat UI.
    const renderCustomView = (props) => {
        const { currentMessage } = props;
        if (currentMessage.location) {
            return (
                <MapView
                    style={{
                        width: 150,
                        height: 100,
                        borderRadius: 13,
                        margin: 3
                    }}
                    region={{
                        latitude: currentMessage.location.latitude,
                        longitude: currentMessage.location.longitude,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }}
                />
            );
        }
        return null;
    }


    //***Function used to prevent Gifted Chat from rendering the InputToolbar (which contains the input field and the "Send" button) when offline / no internet, so users can’t compose new messages.
    //***Similar to renderBubble, to change Gifted Chat’s InputToolbar, this code override the default prop renderInputToolbar={...} of the <GiftedChat …/> component with the new logic wanted.
    const renderInputToolbar = (props) => {
        if (isConnected)
            return <InputToolbar
                {...props} />;
        else return null;
    }


    //***Function used to render a message bubble that contains a button to PLAY the sound whenever there’s a message with an audio-file URL (returns a view containing a button that plays the sound file when it’s pressed).
    const renderAudioBubble = (props) => {
        return <View {...props}>
            <TouchableOpacity
                style={{
                    backgroundColor: "#FF0", borderRadius: 10, margin: 5
                }}
                onPress={async () => {
                    //***if (soundObject) soundObject.unloadAsync() is needed right before creating the sound object because this unloads the previous sound object from the memory if the user tries to play another audio message.
                    if (soundObject) soundObject.unloadAsync();
                    const { sound } = await Audio.Sound.createAsync({
                        uri:
                            props.currentMessage.audio
                    });
                    soundObject = sound;
                    await sound.playAsync();
                }}>
                <Text style={{
                    textAlign: "center", color: 'black', padding:
                        5
                }}>Play Sound</Text>
            </TouchableOpacity>
        </View>
    }


    //***Used to change the messages bubble color.
    //***The returned 'Bubble' component is from Gifted Chat’s own package so its necessary to first import it (the Bubble package).
    const renderBubble = (props) => {
        return <Bubble
            //***The function starts by inheriting props with the ...props keyword.
            {...props}
            //***The right and left speech bubbles are targeted by 'right' and 'left' respectively. The 'right' speech bubbles (those from the sender) have been given a backgroundColor of #000, which is the color black, while the 'left' speech bubbles have been given the backgroundColor of #FFF (white).
            wrapperStyle={{
                right: {
                    backgroundColor: "#000"
                },
                left: {
                    backgroundColor: "#FFF"
                }
            }}
        />
    }


    //***Code rendering the chat interface. Gifted Chat provides its own component, GiftedChat, that comes with its own props. 
    return (
        <View style={[styles.container, { backgroundColor: selectedColor }]}>
            <GiftedChat
                //***Provide GiftedChat with the messages from the 'messages' state.
                messages={messages}
                //***Used to change the messages bubble color (linked to the 'const renderBublle' above).
                renderBubble={renderBubble}
                //***Used to hide the input bar / send button when there's not connection, and render it when there's connection (linked to the 'const renderInputToolbar' above).
                renderInputToolbar={renderInputToolbar}
                //***Tell GiftedChat what should happen when the user sends a new message / click send (onSend() function is called).
                onSend={messages => onSend(messages)}
                //***Used to render the circle button (+) on the left side of the input bar on which users can click to do more actions such as share images, take images or share location.
                renderActions={renderCustomActions}
                //***Used to display map location in the chat screen UI.
                renderCustomView={renderCustomView}
                //***Used to display in the chat screen UI a button in audio messages that plays the sound file when it’s pressed.
                renderMessageAudio={renderAudioBubble}
                //***Provide GitedChat the information about the sender.
                user={{
                    _id: userID,
                    name
                }}
            />
            {/* Code logic ensuring that if the platform’s OS used to run the app is Android, the component KeyboardAvoidingView is added (which will ensure that when users launch their keyboard to enter any text in the chat screen, the keyboard won't hides the message input field - problem only occuring in older Android mobile models). If OS is not an Android, logic tells to insert nothing. */}
            {Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null}
        </View>
    )
}


//***Styling logics for all elements in this file.
const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
});


export default ChatScreen;