# Chatt app documentation

**Content**

- Project description
- User interface
-  User stories
 - Technical aspects 
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

In the chat screen (TO BE COMPLETED).

## User stories and scenarios

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

## Technical aspects

Chat app is built with React Native. Expo and Android Studio have been used for its development. The chat interface and functionalities have been created using the Gifted Chat library.

All chat conversations are stored in Google Firestore Database and locally. The app authenticates users anonymously via Google Firebase authentication.

Chat app allows users to pick and send images from their image library, or take pictures with their device’s camera app, and send them. These images are stored in Firebase Cloud Storage.

The app can also read the user’s location data and sent them via the chat in a map view.

The specific technologies and tools used in this project are the following: 

 - React Native
 - Expo
  - Android Studio
 - Gifted Chat library
 - Google Firestore Database
  - Google Firebase authentication
 - Firebase Cloud Storage

## App dependencies

The following dependencies are required for the Chat app to work:

  - react-navigation/native: ^6.1.7,
 -  react-navigation/native-stack: ^6.9.13,
 -  expo: ~49.0.8
 - expo-status-bar: ~1.6.0
 - react: 18.2.0
  - react-native: 0.72.4,
 -  react-native-screens: ~3.22.0,
 -  react-native-safe-area-context: 4.6.3

 For devDependencies

  - babel/core: ^7.20.0
 