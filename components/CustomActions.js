//***File used to code the (+) button on the left side of the text input field to allow user to do more than just sending messages (e.g.: sharing images or location).

import { useEffect } from "react";
import { StyleSheet, TouchableOpacity, View, Text, Alert } from "react-native";
import { useActionSheet } from '@expo/react-native-action-sheet';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Audio } from 'expo-av';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';


const CustomActions = ({ wrapperStyle, iconTextStyle, onSend, storage, userID }) => {


    //***Used to initialize and create an actionSheet object.
    const actionSheet = useActionSheet();


    let recordingObject = null;


    //***Function used to display the different actions users can choose when they click on the (+) button on the left side of the text input bar.
    const onActionPress = () => {
        const options = ['Select an image from library', 'Take a photo', 'Share location', 'Record a Sound', 'Cancel'];
        const cancelButtonIndex = options.length - 1;
        actionSheet.showActionSheetWithOptions(
            {
                options,
                cancelButtonIndex,
            },
            async (buttonIndex) => {
                switch (buttonIndex) {
                    case 0:
                        pickImage();
                        return;
                    case 1:
                        takePhoto();
                        return;
                    case 2:
                        getLocation();
                        return;
                    case 3:
                        startRecording();
                        return;
                    default:
                }
            },
        );
    };


    //***Codes below related to phone images library and phone camera actions.


    const uploadAndSendImage = async (imageURI) => {
        const uniqueRefString = generateReference(imageURI);
        const newUploadRef = ref(storage, uniqueRefString);
        const response = await fetch(imageURI);
        const blob = await response.blob();
        //***uploadBytes is the function that's used to upload the images users sent in Cloud storage, as well as rendering it as a message in the chat screen UI at the same time.
        uploadBytes(newUploadRef, blob).then(async (snapshot) => {
            const imageURL = await getDownloadURL(snapshot.ref)
            onSend({ image: imageURL })
        });
    }


    const pickImage = async () => {
        let permissions = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permissions?.granted) {
            let result = await ImagePicker.launchImageLibraryAsync();
            if (!result.canceled) await uploadAndSendImage(result.assets[0].uri);
            else Alert.alert("Permissions haven't been granted.");
        }
    }


    const takePhoto = async () => {
        let permissions = await ImagePicker.requestCameraPermissionsAsync();
        if (permissions?.granted) {
            let result = await ImagePicker.launchCameraAsync();
            if (!result.canceled) await uploadAndSendImage(result.assets[0].uri);
            else Alert.alert("Permissions haven't been granted.");
        }
    }


    //***Used to generate a unique reference string each time a new file/image is uploaded to the Cloud storage, to make it possible to upload multiple images. Without this function, everytime an image would be send by a user and upload to the Cloud database, it would replace the previous image uploaded (because of having the same reference string).
    const generateReference = (uri) => {
        const timeStamp = (new Date()).getTime();
        const imageName = uri.split("/")[uri.split("/").length - 1];
        //***Reference created for each images stored is based on the userID, the timestamp and the original file name.
        return `${userID}-${timeStamp}-${imageName}`;
    }


    //***Codes below related get the users phone location sharing.


    const getLocation = async () => {
        let permissions = await Location.requestForegroundPermissionsAsync();
        if (permissions?.granted) {
            const location = await Location.getCurrentPositionAsync({});
            if (location) {
                onSend({
                    //***The object assigned to the location property sent in 'onSend' contains all the data necessary for 'renderCustomView' function in Chat.js to render the MapView in a message bubble in the chat UI screen.
                    location: {
                        longitude: location.coords.longitude,
                        latitude: location.coords.latitude,
                    },
                });
            } else Alert.alert("Error occurred while fetching location");
        } else Alert.alert("Permissions haven't been granted.");
    }


    //***Codes below related to recording and playing sent / received audios.


    const startRecording = async () => {
        try {
            let permissions = await Audio.requestPermissionsAsync();
            if (permissions?.granted) {
                //***iOS specific config to allow recording on iPhone devices.
                await Audio.setAudioModeAsync({
                    allowsRecordingIOS: true,
                    playsInSilentModeIOS: true
                });
                //***After user accepts permission, this code initiates the recording session.
                Audio.Recording.createAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY)
                    .then(results => {
                        return results.recording;
                    }).then(recording => {
                        recordingObject = recording;
                        Alert.alert('You are recording...', undefined, [
                            { text: 'Cancel', onPress: () => { stopRecording() } },
                            {
                                text: 'Stop and Send', onPress: () => {
                                    sendRecordedSound()
                                }
                            },
                        ],
                            { cancelable: false }
                        );
                    })
            }
        } catch (err) {
            Alert.alert('Failed to record!');
        }
    }


    const stopRecording = async () => {
        await Audio.setAudioModeAsync({
            allowsRecordingIOS: false,
            playsInSilentModeIOS: false
        });
        await recordingObject.stopAndUnloadAsync();
    }


    const sendRecordedSound = async () => {
        await stopRecording()
        const uniqueRefString =
            generateReference(recordingObject.getURI());
        const newUploadRef = ref(storage, uniqueRefString);
        const response = await fetch(recordingObject.getURI());
        const blob = await response.blob();
        uploadBytes(newUploadRef, blob).then(async (snapshot) => {
            const soundURL = await getDownloadURL(snapshot.ref)
            onSend({ audio: soundURL })
        });
    }


    //***useEffect used to to make sure that the recording object gets unloaded from the memory in case the user started a recording session but chose to close the app instead of pressing one of the two Alert buttons ('Cancel' or 'Stop and Send').
    useEffect(() => {
        return () => {
            if (recordingObject) recordingObject.stopAndUnloadAsync();
        }
    }, []);



    return (
        <TouchableOpacity
            style={styles.container}
            accessible={true}
            accessibilityLabel="More options"
            accessibilityHint="Lets you choose to send an image, take a picture, share your geolocation or send an audio."
            accessibilityRole="button"
            onPress={onActionPress}>
            <View style={[styles.wrapper, wrapperStyle]}>
                <Text style={[styles.iconText, iconTextStyle]}>+</Text>
            </View>
        </TouchableOpacity>
    );
}


const styles = StyleSheet.create({
    container: {
        width: 26,
        height: 26,
        marginLeft: 10,
        marginBottom: 10,
    },
    wrapper: {
        borderRadius: 13,
        borderColor: '#b2b2b2',
        borderWidth: 2,
        flex: 1,
    },
    iconText: {
        color: '#b2b2b2',
        fontWeight: 'bold',
        fontSize: 10,
        backgroundColor: 'transparent',
        textAlign: 'center',
    },
});


export default CustomActions;