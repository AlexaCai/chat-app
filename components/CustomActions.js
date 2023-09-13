//***File used to code the (+) button on the left side of the text input field to allow user to do more than just sending messages (e.g.: sharing images or location).

//***Import all necessary components.
import { StyleSheet, TouchableOpacity, View, Text, Alert } from "react-native";
import { useActionSheet } from '@expo/react-native-action-sheet';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';


//***Defines the component CustomActions. This component renders the what users see when they click on the (+) button in the text input field on the chat screen. 
const CustomActions = ({ wrapperStyle, iconTextStyle, onSend, storage, userID }) => {


    //***Used to initialize and create an actionSheet object by calling the useActionSheet hook provided by the @expo/react-native-action-sheet library (actionSheet object is used to display a menu with different action options when the user interacts with the (+) button in the chat interface).
    const actionSheet = useActionSheet();


    //***Function used to display the different actions users can choose when they click on the (+) button on the left side of the text input bar.
    const onActionPress = () => {
        //***Strings representing the different options that the user can choose from when they open the action sheet.
        const options = ['Select an image from library', 'Take a photo', 'Share location', 'Cancel'];
        //***The 'cancelButtonIndex' variable is used to specify which option within the options array above (here 'Cancel') should be treated as the cancel option when displaying the action sheet to the user. In this case, 'options.length' is equal to 4. - 1 subtracts 1 from the total number of options, thus adjusting the index to refer to the last element in the array ('Cancel' which is at position index 3 in the 'options array' - the last one).
        const cancelButtonIndex = options.length - 1;
        //***Displays the action sheet with the specified options.
        actionSheet.showActionSheetWithOptions(
            //***Display the available options and the cancel button in the user interface when the action sheet is shown.
            {
                options,
                cancelButtonIndex,
            },
            //***Function executed when user selects an option from the action sheet. The buttonIndex parameter represents the index of the selected option below.
            async (buttonIndex) => {
                //***'switch' is used to determine which option the user selected based on the buttonIndex. 
                //***Depending on the selected option, one of three functions (pickImage, takePhoto, or getLocation) is called.
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


    //***This function takes an image URI, uploads the image to Firebase Cloud Storage with a unique reference, retrieves the download URL, and sends it as a message in the chat UI.
    const uploadAndSendImage = async (imageURI) => {
        //***Creation of a variable that takes the 'generateReference' function output below.
        const uniqueRefString = generateReference(imageURI);
        //***ref() is a function imported from firebase/storage.'storage' passed to ref() is the Firebase Storage handler passed from Chat.js.
        //***'uniqueRefString' as the second argument uses the output of the function 'generateReference' to associate a unique string/reference to every new image uploaded to the Cloud storage (when users send images in the chat screen).
        const newUploadRef = ref(storage, uniqueRefString);
        //***Fetches the image data from the provided imageURI (downloads the image from the given URL).
        const response = await fetch(imageURI);
        //***Converts the downloaded image data into a binary blob, which is a format suitable for uploading to Firebase Cloud Storage.
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
        //***This displays a prompt to the user UI asking for permission to access the media library.
        let permissions = await ImagePicker.requestMediaLibraryPermissionsAsync();
        //***If users grant access to their device’s gallery, the function returns an object that has many properties - here this is referenced by the 'permissions' variable. To know if users have grant access, the property to check from the returned object is '.granted', which is a boolean (looking for TRUE).
        if (permissions?.granted) {
            //***If users have granted access to their media library (permissions?.granted is TRUE), ImagePicker.launchImageLibraryAsync() is called to let them pick a file.
            let result = await ImagePicker.launchImageLibraryAsync();
            //***ImagePicker.launchImageLibraryAsync() returns an object (referenced as const 'RESULT') containing the .assets property. This is an array referencing all of the users picked media files (referred to as 'assets'). Here, the array is limited to only having one asset [0] (users aren't allowed to pick multiple images).
            //***The asset (image) contains a .uri - a string representing the path to the picked media file, along with its .width, .height, and file type.
            //***The object 'RESULT' also contains the boolean property '.canceled'. This will be true if the user cancels the process and doesn’t pick a file/asset/image (which will close the selecting image screen and go back to the main chat UI screen).
            if (!result.canceled) await uploadAndSendImage(result.assets[0].uri);
            else Alert.alert("Permissions haven't been granted.");
        }
    }


    //***Function allowing users to take photos from phone's camera and send them.
    //***Working the same way as the pickImage function described above.
    const takePhoto = async () => {
        let permissions = await ImagePicker.requestCameraPermissionsAsync();
        if (permissions?.granted) {
            let result = await ImagePicker.launchCameraAsync();
            if (!result.canceled) await uploadAndSendImage(result.assets[0].uri);
            else Alert.alert("Permissions haven't been granted.");
        }
    }


    //***Used to generate a unique reference string each time a new file/image is uploaded to the Cloud storage, to make it possible to upload multiple images. Without this function, everytime an image would be send by a user and upload to the Cloud database, it would replace the previous image uploaded (because of having the same reference string).
    //***The function has one argument that represents the picked image’s URI. The function combines multiple strings to produce a string that can be used as a unique reference for the image to be uploaded.
    const generateReference = (uri) => {
        const timeStamp = (new Date()).getTime();
        const imageName = uri.split("/")[uri.split("/").length - 1];
        //***Reference created for each images stored is based on the userID, the timestamp and the original file name.
        return `${userID}-${timeStamp}-${imageName}`;
    }


    //***Function used to retrieve the device's current location and send it as a message.
    const getLocation = async () => {
        //***Prompt send to users UI to ask for location permission, and store the result in 'permissions' variable.
        let permissions = await Location.requestForegroundPermissionsAsync();
        //***Check if location permission have been granted.
        if (permissions?.granted) {
            //***If permission is granted, retrieve the current device location and store it in 'location'.
            const location = await Location.getCurrentPositionAsync({});
            //***Check if a valid 'location' object was obtained.
            if (location) {
                //***The location coordinates from CustomActions.js are passed to the Chat.js file through the 'onSend' prop. 
                //***'onSend' sends a message that only contains the location property.
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


    return (
        //***When users click on the (+) button on the left side of the text input bar, 'onActionPress' function is called.
        <TouchableOpacity style={styles.container} onPress={onActionPress}>
            <View style={[styles.wrapper, wrapperStyle]}>
                <Text style={[styles.iconText, iconTextStyle]}>+</Text>
            </View>
        </TouchableOpacity>
    );
}


//***Styling logics for all elements in this file.
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