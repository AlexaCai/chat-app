//***When the app is started, StartScreen appears to users. When users press the 'Start chatting' button on Start Screen, the app transition to the ChatScreen (this file). 

//***Import all necessary components the ensure app's working.
//***KeyboardAvoidingView and Platform from 'react-native' are used to ensured that when users launch their keyboard to enter any text in the chat screen, the keyboard won't hides the message input field (problem only occuring in older Android mobile models).
import { useEffect, useState } from 'react';
import { StyleSheet, View, KeyboardAvoidingView, Platform } from 'react-native';
import { GiftedChat, Bubble } from "react-native-gifted-chat";
import { collection, addDoc, onSnapshot, query, orderBy } from "firebase/firestore";


//***Defines the component ChatScreen that takes three props: route, navigation and db. 
//***These props are provided by React Navigation to screen components. 'route' allows to access the data passed to this screen during navigation (in this case, from Start Screen), and 'navigation' allows to navigate to other screens.
const ChatScreen = ({ route, navigation, db }) => {

    //***Extract the 'userUID', 'name' and 'selectedColor' properties from the route.params object. These data were passed as parameters from StartScreen to ChatScreen when navigating to ChatScreen (so when users click on 'Start chatting' button on StartScreen).
    const { userID, name, selectedColor } = route.params;
    //***const used to manage and display chat messages.
    //***'messages' state stores the chat messages that users send and receive during their chat sessions. Each message is represented as an object in the array, and the array holds a history of all chat messages.
    //***'setMessage' is used to update the 'messages' state. When a new message is sent or received, it is appended to the 'messages' array using the 'setMessages' function. This ensures that the chat interface displays the most up-to-date messages.
    const [messages, setMessages] = useState([]);


    //***useEffect called right after the Chat component mounts. 
    useEffect(() => {
        //***Sets the title of the screen (in the header at the top) to the value of the 'name' parameter using navigation.setOptions({ title: name }) (so the title of the screen is dynamically updated based on the name chosen by users in InputText on StartScreen).
        navigation.setOptions({ title: name });

        //***The code sets up a real-time listener for chat messages stored in a Firestore database.
        const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));
        //***'onSnapshot' function continuously watch for changes in the messages collection in Firestore.
        const unsubMessages = onSnapshot(q, (documentsSnapshot) => {
            //***When there's a new chat messages (either sent by the user or received from others), the code processes this message and updates the 'messages' state, which contains all chat messages and is used to display the chat history on the screen.
            let newMessages = [];
            documentsSnapshot.forEach(doc => {
                newMessages.push({
                    id: doc.id, ...doc.data(),
                    createdAt: new Date(doc.data().createdAt.toMillis())
                })
            })
            setMessages(newMessages);
        })

        //***Used to clean up code and stops the real-time message listener when the chat screen is no longer in use to avoid memory leaks (it’s best practice to stop listeners if they’re no longer needed to avoid memory leak - memory leak occurs when data that isn't needed still occupies memory without intending to do so).
        return () => {
            if (unsubMessages) unsubMessages();
        }
    }, []);


    //***Function to save/show sent messages in the Firestore database.
    const onSend = (messages) => {
        //***The append() function provided by GiftedChat appends the new message to the messages array (array which holds the message user just sent), and this message gets appended to the original list of messages from previousMessages, so that all messages (new and older ones) can be displayed in the chat.
        setMessages(previousMessages => GiftedChat.append(previousMessages, messages))
        //***The message to be added in the Firestore dabatase (using addDoc) is the first item in the newMessages array, which is the argument of the onSend function. That's why newMessages[0] is used here as the third argument. This code ensures that chat messages are persisted and can be retrieved from Firestore database.
        addDoc(collection(db, "messages"), messages[0])
    }

    //***Used to change the messages bubble color.
    //***The returned Bubble component is from Gifted Chat’s own package so its necessary to first import it (Bubble package).
    const renderBubble = (props) => {
        return <Bubble
            //***The function starts by inheriting props with the ...props keyword.
            {...props}
            //***new wrapperStyle.
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
                //***Tell GiftedChat what should happen when the user sends a new message / click send (onSend() function is called).
                onSend={messages => onSend(messages)}
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

//***Styling logics for all elements appearing on Chat Screen.
const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
});

export default ChatScreen;