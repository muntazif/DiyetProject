import React from 'react';
import {View, Image, TouchableOpacity} from 'react-native';
import styles from './ProImage.style';
import {launchImageLibrary} from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const ProImage = ({data}) => {
  const [imgUrl, setImgUrl] = React.useState(data);
  const handleSelectImage = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      presentationStyle: 'formSheet',
      maxWidth: 300,
      maxHeight: 300,
    });
    if(!result.didCancel) {
      const reference = storage().ref(`user/${auth().currentUser.uid}.png`);
      const pathToFile = result.assets[0].uri;
  
      await reference.putFile(pathToFile);
  
      const url = await storage()
        .ref(`user/${auth().currentUser.uid}.png`)
        .getDownloadURL();
      var object = {
        imageUrl: url,
      };
      firestore().collection('user').doc(auth().currentUser.uid).update(object);
      setImgUrl(url);
    }
  };
  return (
    <TouchableOpacity style={styles.container} onPress={handleSelectImage}>
      <Image
        style={styles.image}
        source={{
          uri:  imgUrl 
        }}
      />
    </TouchableOpacity>
  );
};

export default ProImage;
