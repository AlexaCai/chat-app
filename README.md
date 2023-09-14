# Chat app documentation

**Content**

- Project description
- User interface
-  User stories
 - Technical aspects (overview)
  - Technical aspects (development)
 - App dependencies

 
## Project description

Chat app was created to serve as a chatting app for mobile devices using React Native. Users can go on Chat app and exchange with other users using the same app. Chat app includes functionalities and UIs to allow users to send messages, images and their location.

Chat app can be broken down in the five following points:

 - **Who** — For any users who want to use a chat mobile app.
 - **What** — A native chat app built with React Native.
 - **When** — Whenever users want to communicate with each other.
 - **Where** — The app is optimized for both Android and iOS devices. 
Expo has been used to develop the app and Google Firestore to store the chat messages.
 - **Why** — Mobile chat apps are among the most commonly downloaded and used apps
in the world. Building one and knowing how it works, especially using React Native, is therefore an indispensable skill.


## User interface

When users land on Chat app, the initial page allows them to enter their name, as well as selecting the background color they would like to have as a background on the chat screen. Once these elements are specified, users can click on a button to be redirected to the chat screen.

In the chat screen users can use a text input field at the bottom of the screen to send messages. All messages sent are displayed on the right, and all messages receveided are displayed on the left. On the left side of the text input bar, users can click on a (+) button, allowing them to do more actions:

 - Send image from their phone's library;
 - Take a picture with their phone's camera and send it;
  - Share their location in a Google map view;
 - Record an vocal message (audio).

 Finally, when users go offline, they can still access their messages. When offline, the text input field is hidden since users can't send messages without internet, and as this give more space to show messages from the conversation. When internet connection is back, the text input field is automatically render and users can user it again.


## User stories

For the app's development phase, the following user stories have been used:

### User story 1

> As a new **user**,   
> I want to be able to **easily enter a chat room**,  
> So that I can **quickly start talking to my friends and family**.

### User story 2

> As a **user**,   
> I want to be able to **send messages to my friends and family members**,  
> So that **I can exchange the latest news**.

### User story 3

> As  a **user**,  
> I want to **send images to my friends**,  
> So that **I can show them what I’m currently doing**.

### User story 4

> As  a **user**,  
> I want to **share my location with my friends**,  
> So that **I can show them where I am**.

### User story 5

> As a **user**,   
> I want to be able to **read my messages offline**,  
> So that **I can reread conversations at any time**.

### User story 6

> As a **with a visual impairment**,   
> I want to use a chat app that is **compatible with a screen reader**,  
> So that **I can engage with a chat interface**.

## Technical aspects (overview)

Chat app has been built with React Native. The application Expo Go and Android Studio have been used as tools for its development. 

The chat interface and functionalities have been created using the Gifted Chat library.

All chat messages are stored in a Google Firestore Database and locally. Images and audios sent on Chat app are also stored in a storage space created on Firebase and the app authenticates users anonymously via Google Firebase authentication.

The specific technologies and tools used in this project are the following: 

 - React Native
 - Expo
  - Android Studio
 - Gifted Chat library
 - Google Firestore Database
  - Google Firebase authentication
 - Firebase Cloud Storage

 ## Technical aspects (development)

 **Setting up the development environment:** To ensure the project is properly initalized and able to run, the following are requiered before starting any work:

-   If necessary, downgrading *Node.js* to a version not newer than `16.19.0` (at the time of this writing, *Expo* only supports *Node* 16 at max - it is however possible that this might not still be the case at the time of reading);
    
-   Setting up [*Expo*](https://expo.dev/) and *Expo* CLI, as this is the platform use to build the app;
    
-   Setting up [*Expo Go* app](https://play.google.com/store/apps/details?id=host.exp.exponent&hl=en_US&pli=1) on a physical device to allow testing the project on a physical mobile device.
    
- Setting up Android Emulator (Android's virtual device simulation tool) using [*Android Studio*](https://developer.android.com/studio) to allow testing the project on a different device.

Installing *Expo Go* on a physical device and setting up Android Emulator via *Android Studio* in pair is useful to simulate messages exhanges, images sending, location sharing and more between two users.

**Starting the project and developing:** Once the development is correctly set up, the project is launched using the command *npx create-expo-app chat-app --template* in the terminal, allowing the create automatically the project basic structure and main files. The different components can then be created from this structure, adding new folders and other elements when necessary.

In parallel, the project also needs to be created on the official **[*Firebase* website](https://firebase.google.com/)**. For the Chat app, *Firebase* functionnalities are used to create:

 - 1- A database that stores the messages sent by users
 - 2- A storage space that stores the images and audio sent by users 
 - 3- The authentication method for the users

**1- Database**: to ensure the messages sent by users are stored somewhere and accessible in real-time whenever needed, a ***Firestore Database*** needs to be set up by going to *Build* > *Firestore database* (on the *Firebase* website).

This database is then linked/connected to Chat app by inserting (in App.js file) the credentials provided on the *Firebase website* > *Project overview* > *Project settings* > *General settings* > *Web application* > *SDK instalation and configuration*. Here's an exemple of the code available on *Firebase* and inserted into App.js file to make the connection:

// Web app's *Firebase* configuration

    > const firebaseConfig = { 
    apiKey:  "ABC", 
    authDomain:  "ABC",
    projectId:  "ABC", 
    storageBucket:  "ABC", 
    messagingSenderId:  "ABC",
    appId:  "ABC" 
    };

// Initialize *Firebase*

    > const app = initializeApp(firebaseConfig);

*The following code also also needs to be added after importing *getFirestore* in App.js to initialize *Cloud Firestore*

    const db = getFirestore(app);

**2- Storage space for medias:** The same principle apply for the storage space that needs to be created to stored images and audio file sent by users. The storage space is create on *Firebase* website, by going to *Build* > *Storage*.

**3- Authentication method:** The same principle apply for the authentication method. The authentication method  is create on *Firebase* website, by going to *Build* > *Authentication*. For Chat app, the anonymous authentication provided by *Firebase* is used.

## App dependencies

Since Chat app is build with React Native and integrate several functionnalities (sharing location, sending audios, storage logics, etc.) the following dependencies needs to be installed for the app to work:

  - react-navigation/native: ^6.1.7,
 -  react-navigation/native-stack: ^6.9.13,
 -  expo: ~49.0.8
 - expo-status-bar: ~1.6.0
  - firebase: ^9.13.0
 - react: 18.2.0
  - react-native: 0.72.4
  - react-native-gifted-chat: ^2.4.0
 -  react-native-safe-area-context: 4.6.3
  - react-native-screens: ~3.22.0
  - react-native-async-storage/async-storage: 1.18.2
  - react-native-community/netinfo: 9.3.10
  - expo-location: ~16.1.0
  - expo-image-picker: ~14.3.2
  - react-native-maps: 1.7.1
  - expo-av: ~13.4.1

 For devDependencies

  - babel/core: ^7.20.0
 