//***File used to code the (+) button in the text input field to allow user to do more than just sending messages (e.g.: sharing images, location).

import { StyleSheet, TouchableOpacity, View, Text } from "react-native";
import { useActionSheet } from '@expo/react-native-action-sheet';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';


const CustomActions = ({ wrapperStyle, iconTextStyle, onSend, storage, userID }) => {

    //***The function fetches whatever ActionSheet is included inside the wrapper component (in this case, 'Gifted Chat' is the wrapper component and inside it, there’s an ActionSheet component that’s rendered).
    const actionSheet = useActionSheet();

    //***Function to display the different actions users can choose when they first click on the (+) button on the left side of the text input bar.
    const onActionPress = () => {
        const options = ['Choose From Library', 'Take Picture', 'Send Location', 'Cancel'];
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
                    default:
                }
            },
        );
    };

    const uploadAndSendImage = async (imageURI) => {
        //***Creation of a variable that takes the 'generateReference' function output below.
        const uniqueRefString = generateReference(imageURI);
        //***ref() is a function imported from firebase/storage.'storage' passed to ref() is the Firebase Storage handler passed from Chat.jsé
        //***'uniqueRefString' as the second argument uses the output of the function 'generateReference' to associate a unique string/reference to every new image uploaded to the Cloud storage (when users send images in the chat screen).
        const newUploadRef = ref(storage, uniqueRefString);
        const response = await fetch(imageURI);
        const blob = await response.blob();
        //***uploadBytes is the function that's used to upload the images users sent in Cloud storage, as well as rendering it as a message in the chat screen UI at the same time. When users pick an image from their phone's image library, not only it's uploaded to the Firebase Cloud Storage, but it's also sent as a message to the other receiving user can see it.
        uploadBytes(newUploadRef, blob).then(async (snapshot) => {
            //***Get the remote URL of the image users just uploaded. First step to send the images from users as a message so that it gets rendered in a message bubble chat screen inside GiftedChat.
            const imageURL = await getDownloadURL(snapshot.ref)
            //***Call the onSend() prop so the images are sent as a message in the chat UI screen whenever users sent them.
            onSend({ image: imageURL })
        });
    }


    //***Functon allowing users to pick images from phone's library and send them.
    const pickImage = async () => {
        let permissions = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permissions?.granted) {
            let result = await ImagePicker.launchImageLibraryAsync();
            if (!result.canceled) await uploadAndSendImage(result.assets[0].uri);
            else Alert.alert("Permissions haven't been granted.");
        }
    }

        //***Functon allowing users to take photos from phone's camera and send them.
    const takePhoto = async () => {
        let permissions = await ImagePicker.requestCameraPermissionsAsync();
        if (permissions?.granted) {
          let result = await ImagePicker.launchCameraAsync();
          if (!result.canceled) await uploadAndSendImage(result.assets[0].uri);
          else Alert.alert("Permissions haven't been granted.");
        }
      }

    //***Used to generate a unique reference string each time a new file/image is uploaded to the cloud storage, so upload multiple images. Without this function, everytime an image would be send by a user and upload to the Cloud database, it would replace the previous image uploaded.
    //***The function has one argument that represents the picked image’s URI. The function combines multiple strings to produce a string that can be used as a unique reference for the image to be uploaded.
    const generateReference = (uri) => {
        const timeStamp = (new Date()).getTime();
        const imageName = uri.split("/")[uri.split("/").length - 1];
        //***Reference contain userID, the timestamp and the original file name.
        return `${userID}-${timeStamp}-${imageName}`;
    }

    //***This send a message that only contains the location property.
    const getLocation = async () => {
        let permissions = await Location.requestForegroundPermissionsAsync();
        if (permissions?.granted) {
            const location = await Location.getCurrentPositionAsync({});
            if (location) {
                onSend({
                    location: {
                        longitude: location.coords.longitude,
                        latitude: location.coords.latitude,
                    },
                });
            } else Alert.alert("Error occurred while fetching location");
        } else Alert.alert("Permissions haven't been granted.");
    }

    return (
        //***When users click on the button, 'onActionPress' function is called.
        <TouchableOpacity style={styles.container} onPress={onActionPress}>
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