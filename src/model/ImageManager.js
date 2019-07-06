import RNFS from 'react-native-fs';
import LinkPreview from 'react-native-link-preview';
import sh from 'shorthash';

const defaultImageFolder = `${RNFS.DocumentDirectoryPath}/ItemImages`;

class ImageManagerSingleton {
  constructor() {
    RNFS.mkdir(`${RNFS.DocumentDirectoryPath}/ItemImages`, {
      NSURLIsExcludedFromBackupKey: true,
    });
  }

  saveImageForItem = (async (id, uri) => {
    if (uri.startsWith('file:///var/mobile/Containers/Data/Application/')) {
      // copy the file from the cache directory
      const destPath = `${defaultImageFolder}/${id}.jpg`;
      
      this.deleteImage(destPath);
      RNFS.moveFile(uri, destPath);

      return destPath;
    } else if (uri.startsWith('http')) {
      // get image type
      try {
        const imageData = await LinkPreview.getPreview(uri);
        if (imageData.mediaType === 'image') {
          const extension = imageData.contentType.split('/')[1];
          const destPath = `${defaultImageFolder}/${sh.unique(uri)}.${extension}`;
          
          // if image is already present
          if (RNFS.exists(destPath)) {
            return destPath;
          }

          await RNFS.downloadFile({
            fromUrl: uri,
            toFile: destPath,
          });

          return destPath;
        }
      } catch (error) {
        console.log(error);
      }
    }

    return uri;
  });

  deleteImage = ((uri) => {
    if (RNFS.exists(uri)) {
      RNFS.unlink(uri);
    }
  });
}

const ImageManager = new ImageManagerSingleton();

export default ImageManager;
