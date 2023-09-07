//***When the app is started, Start Screen appears to users. When users press the 'Start chatting' button on Start Screen, the app transition to Chat Screen (this file). 

//***Import all necessary components the ensure app's working.
//***KeyboardAvoidingView and Platform from 'react-native' are used to ensured that when users launch their keyboard to enter any text in the chat screen, the keyboard won't hides the message input field (problem only occuring in older Android mobile models).
import { useEffect, useState } from 'react';
import { StyleSheet, View, Text, KeyboardAvoidingView, Platform } from 'react-native';
import { GiftedChat, Bubble } from "react-native-gifted-chat";

//***Defines the React component named ChatScreen that takes two props: route and navigation. 
//***These props are provided by React Navigation to screen components. 'route' allows to access the data passed to this screen during navigation (in this case, from Start Screen), and 'navigation' allows to navigate to other screens.
const ChatScreen = ({ route, navigation }) => {

    //***Extract the 'name' and 'selectedColor' properties from the route.params object. Those two data (user selected name and background color) were passed as parameters from Start Screen to Chat Screen when navigating to Chat Screen (so when users click on 'Start chatting' button on Start Screen).
    const { name, selectedColor } = route.params;
    //***Code the messages state initialization using useState().
    const [messages, setMessages] = useState([]);

    //***Called right after the Chat component mounts. Set the state with a static message so that it's possible to see each element of the UI displayed on the screen right away.
    useEffect(() => {
        //***Sets the title of the screen (in the header at the top) to the value of the 'name' parameter using navigation.setOptions({ title: name }) (so the title of the screen is dynamically updated based on the name chosen by users in InputText on Start Screen).
        navigation.setOptions({ title: name });
        //***Messages must follow a certain format to work with the Gifted Chat library. Each message requires an ID, a creation date, and a user object (and the user object requires a user ID, name, and avatar).
        setMessages([
            {
                _id: 1,
                text: "Hello developer",
                createdAt: new Date(),
                user: {
                    _id: 2,
                    name: "React Native",
                    avatar: "https://placeimg.com/140/140/any",
                },
            },
            //***Code to implement a system message(messages aren’t sent by any chat participants - they are automatic messages used to alert the participants about activity in the chat).
            {
                _id: 2,
                text: 'This is a system message',
                createdAt: new Date(),
                system: true,
            },
        ]);
    }, []);

    
    //***'messages state’s'setter function setMessage() is called (when users click on 'send' button with a callback function passed into it. This logic allow to access the latest state value of 'messages'.  In this way, the setter function can accept a callback function where its first parameter represents a variable that refers to the latest value of the state (here being 'previousMessages').
    const onSend = (newMessages) => {
        //***The append() function provided by GiftedChat appends the new message to the newMessages array (array which holds the message user just sent), and this message gets appended to the original list of messages from previousMessages, so that all messages (new and older ones) can be displayed in the chat.
        setMessages(previousMessages => GiftedChat.append(previousMessages, newMessages))
    }


    //***Used to change the messages bubble color.
    const renderBubble = (props) => {
        return <Bubble
            //***The function starts by inheriting props with the ...props keyword.
            {...props}
            //***new wrapperStyle
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
        <View style={styles.container}>
            <GiftedChat
                //***Provide GiftedChat with the messages.
                messages={messages}
                //***Used to change the messages bubble color.
                renderBubble={renderBubble}
                //***Tell GiftedChat what should happen when the user sends a new message / click send (onSend() function is called).
                onSend={messages => onSend(messages)}
                //***Provide GitedChat the information about the sender.
                user={{
                    _id: 1
                }}
            />
            {/* Code logic ensuring that if the platform’s OS used to run the app is Android, the component KeyboardAvoidingView is added (which will ensure that when users launch their keyboard to enter any text in the chat screen, the keyboard won't hides the message input field - problem only occuring in older Android mobile models). If OS is not an Android, logic tells to insert nothing. */}
            {Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null}
        </View>
    )
}

//***Styling logics for all elements appearing on Chat Screen.
const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
});

export default ChatScreen;