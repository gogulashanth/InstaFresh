/* eslint-disable import/prefer-default-export */
import { Image, ImageEditor } from 'react-native';

export function getImageSize(uri) {
  return new Promise((resolve, reject) => {
    Image.getSize(uri, (width, height) => {
      resolve({ width, height });
    });
  });
}

export function cropImage(uri, cropData) {
  return new Promise((resolve, reject) => {
    ImageEditor.cropImage(
      uri,
      cropData,
      croppedURI => resolve(croppedURI),
      () => reject('cannot crop image'),
    );
  });
}
