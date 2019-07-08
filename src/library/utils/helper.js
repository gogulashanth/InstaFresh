/* eslint-disable import/prefer-default-export */
import { Image } from 'react-native';
import ImageEditor from "@react-native-community/image-editor";

export function getImageSize(uri) {
  return new Promise((resolve, reject) => {
    Image.getSize(uri, (width, height) => {
      resolve({ width, height });
    });
  });
}

export function cropImage(uri, cropData) {
  return ImageEditor.cropImage(
    uri,
    cropData,
  );
}
