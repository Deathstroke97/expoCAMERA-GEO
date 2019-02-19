import React, { Component } from 'react'
import { ImagePicker, FileSystem, Permissions, Location, Constants } from 'expo'
import { View,  Button, Image, Platform, Text, StyleSheet, Alert, ScrollView } from 'react-native'

export default class HomeScreen extends Component {
    state = {
        images: []
    }
    
    takePhoto = async () => {
      
        const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL, Permissions.CAMERA, Permissions.LOCATION);
        console.log('status: ', status)
        if (status !== 'granted') {
            Alert.alert('Разрешения не предоставлены', 'Пожалуйста, предоставьте все разрешиния', [{text: 'Ok', onPress: () => console.log('Pressed Ok')}])
        }
        let isAvailable = await Location.hasServicesEnabledAsync()
        if (!isAvailable) {
          Alert.alert('GPS не включен', 'Пожалуйста включите GPS на телефоне')
          return;
        }
        
        let location = await Location.getCurrentPositionAsync({});
       
        console.log('location: ', location)
       

        const pickerResult = await ImagePicker.launchCameraAsync({
            allowEditing: false,
            exif: true
        });

        if (!pickerResult.cancelled) {
            console.log('pickerResult')
            const image = {
                source: {uri: pickerResult.uri},
                latitude: location.coords.latitude,
                longitude: location.coords.longitude
            }
            const newState = {...this.state}
            newState.images = this.state.images.concat(image)
            this.setState({ images: newState.images });
        }
    }
    
    
    render() {
        let images;
        if (this.state.images.length !== 0) {
          images = this.state.images.map((img, index) => {
            console.log('image: ', img.source)
            return <ScrollView key={index}>
                  <Image source={img.source} style={{width: 250, height: 250}} />
                  <Text>{img.latitude}</Text>
                  <Text>{img.longitude}</Text>
                </ScrollView>
              
          })
        }
        return( 
            <View style={styles.container}>
                <ScrollView>
                    {images}
                </ScrollView>
                <Button 
                    onPress={this.takePhoto}
                    title={'Take a photo'}
                />
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1, 
        justifyContent: 'center', 
        paddingHorizontal: 50, 
        
    },
    paragraph: {
        margin: 24,
        fontSize: 18,
        textAlign: 'center',
    },
});
