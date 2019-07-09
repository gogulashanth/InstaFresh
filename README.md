# InstaFresh
An app to track food expiry dates built with react-native

You can download the app from app store. Android version is WIP. 

### File Structure

#### src

  -> **library**: contains reusable components and helper functions

  -> **model**: contains the data structures and backend service manager classes

  -> **res**: contains resources for the app (such as images, fonts, etc)

  -> **screens**: contains the various screen components used in the app

### Features

1. Uses TensoFlow Lite to detect food items for easy add.
2. Uses Pexels and Edamam API for finding relevant images and recipes of food items.
3. Uses a backend database (specifically, Google Firebase Cloud Firestore) to store 
newly entered barcode data and to retreive info such as nutrition data, shelf life, etc.
4. Tracks food waste
5. Notifies when food is about to expire
6. Supports information lookup from barcode scanning
