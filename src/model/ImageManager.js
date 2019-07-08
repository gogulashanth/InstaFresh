import RNFS from 'react-native-fs';
import LinkPreview from 'react-native-link-preview';
import sh from 'shorthash';
import ImageResizer from 'react-native-image-resizer';

const defaultImageFolder = `${RNFS.DocumentDirectoryPath}/ItemImages`;

class ImageManagerSingleton {
  constructor() {
    RNFS.mkdir(`${RNFS.DocumentDirectoryPath}/ItemImages`, {
      NSURLIsExcludedFromBackupKey: true,
    });
  }

  saveImageForItem = (async (id, uri) => {
    
    if (uri.startsWith(`file://${RNFS.DocumentDirectoryPath}`)) {
      // copy the file from the cache directory
      const destPath = `${defaultImageFolder}/${id}.jpg`;

      const resizedResponse = await ImageResizer.createResizedImage(
        uri,
        300,
        300,
        'JPEG',
        100,
        0,
        destPath,
      );
      this.deleteImage(uri);
      
      return resizedResponse.path;
    } else if (uri.startsWith('http')) {
      // get image type
      try {
        const imageData = await LinkPreview.getPreview(uri);
        if (imageData.mediaType === 'image') {
          const extension = imageData.contentType.split('/')[1];
          // extension = extension === "jpeg" ? "jpg" : extension;

          const destPath = `${defaultImageFolder}/${sh.unique(uri)}.${extension}`;

          // if image is already present
          if (await RNFS.exists(destPath)) {
            return destPath;
          }
          console.log(`downloading file to: ${destPath}`);


          const downResult = await RNFS.downloadFile({
            fromUrl: uri,
            toFile: destPath,
          }).promise;

          if (downResult.bytesWritten > 0) {
            // resize image
            const croppedResponse = await ImageResizer.createResizedImage(
              destPath,
              300,
              300,
              'JPEG',
              100,
              0,
              destPath,
            );

            return croppedResponse.path;
          }
        }
      } catch (error) {
        console.log(error);
      }
    }

    return uri;
  });

  deleteAllImages = (async () => {
    const imageExists = await RNFS.exists(defaultImageFolder);
    if (imageExists) {
      await RNFS.unlink(defaultImageFolder);
    }
  });

  deleteImage = (async (uri) => {
    const imageExists = await RNFS.exists(uri);
    if (imageExists) {
      await RNFS.unlink(uri);
    }
  });
}

const ImageManager = new ImageManagerSingleton();

export default ImageManager;
