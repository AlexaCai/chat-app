//***When the app is started, StartScreen appears to users. When users press the 'Start chatting' button on StartScreen, the app transition to the ChatScreen (this file). 

import { useEffect, useState } from 'react';
import { StyleSheet, View, KeyboardAvoidingView, Platform, TouchableOpacity, Text } from 'react-native';
import { GiftedChat, Bubble, InputToolbar } from "react-native-gifted-chat";
import { collection, addDoc, onSnapshot, query, orderBy } from "firebase/firestore";
import { Audio } from "expo-av";
import CustomActions from './CustomActions';
import MapView from 'react-native-maps';
import AsyncStorage from "@react-native-async-storage/async-storage";

const ChatScreen = ({ route, navigation, db, isConnected, storage }) => {

    const { userID, name, selectedColor } = route.params;
    const [messages, setMessages] = useState([]);


    //***Reference the currently playing sound. 
    let soundObject = null;


    //***Variable is used to keep a reference to the unsubscribe function returned by the onSnapshot listener from Firebase Firestore.
    let unsubMessages;

    useEffect(() => {
        navigation.setOptions({ title: name });
        if (isConnected === true) {
            if (unsubMessages) unsubMessages();
            unsubMessages = null;
            const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));
            //***'onSnapshot' function continuously watch for changes in the messages collection in Firestore.
            unsubMessages = onSnapshot(q, (documentsSnapshot) => {
                let newMessages = [];
                documentsSnapshot.forEach(doc => {
                    newMessages.push({
                        id: doc.id, ...doc.data(),
                        createdAt: new Date(doc.data().createdAt.toMillis())
                    });
                });
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
    }, [isConnected]);


    const loadCachedMessages = async () => {
        const cachedMessages = await AsyncStorage.getItem("messages") || [];
        setMessages(JSON.parse(cachedMessages));
    }


    const cacheMessages = async (MessagesToCache) => {
        try {
            await AsyncStorage.setItem('messages', JSON.stringify(MessagesToCache));
        } catch (error) {
            console.log(error.message);
        }
    }


    //***Function to save/show sent messages in the Firestore database.
    const onSend = (messages) => {
        setMessages(previousMessages => GiftedChat.append(previousMessages, messages))
        addDoc(collection(db, "messages"), messages[0])
    }


    const renderCustomActions = (props) => {
        return <CustomActions storage={storage} {...props} />;
    };


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


    const renderInputToolbar = (props) => {
        if (isConnected)
            return <InputToolbar
                {...props} />;
        else return null;
    }


    const renderAudioBubble = (props) => {
        return <View {...props}>
            <TouchableOpacity
                style={{
                    backgroundColor: "#FF0", borderRadius: 10, margin: 5
                }}
                onPress={async () => {
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


    const renderBubble = (props) => {
        return <Bubble
            {...props}
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


    return (
        <View style={[styles.container, { backgroundColor: selectedColor }]}>
            <GiftedChat
                messages={messages}
                renderBubble={renderBubble}
                renderInputToolbar={renderInputToolbar}
                onSend={messages => onSend(messages)}
                renderActions={renderCustomActions}
                renderCustomView={renderCustomView}
                renderMessageAudio={renderAudioBubble}
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


const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
});


export default ChatScreen;