package com.sappad;

import android.app.Application;

import com.facebook.react.ReactApplication;
import fr.bamlab.rnimageresizer.ImageResizerPackage;
import com.reactnativecommunity.imageeditor.ImageEditorPackage;
import com.dieam.reactnativepushnotification.ReactNativePushNotificationPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.reactlibrary.TfliteReactNativePackage;
import com.reactnativecommunity.webview.RNCWebViewPackage;
import com.RNFetchBlob.RNFetchBlobPackage;
import com.rnfs.RNFSPackage;
import io.invertase.firebase.RNFirebasePackage;
import io.invertase.firebase.storage.ReactNativeFirebaseStoragePackage;
import io.invertase.firebase.ReactNativeFirebaseAppPackage;
import com.horcrux.svg.SvgPackage;
import com.imagepicker.ImagePickerPackage;
import com.beefe.picker.PickerViewPackage;
import com.reactnativecommunity.asyncstorage.AsyncStoragePackage;
import com.cmcewen.blurview.BlurViewPackage;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new ImageResizerPackage(),
            new ImageEditorPackage(),
            new ReactNativePushNotificationPackage(),
            new VectorIconsPackage(),
            new TfliteReactNativePackage(),
            new RNCWebViewPackage(),
            new RNFetchBlobPackage(),
            new RNFSPackage(),
            new RNFirebasePackage(),
            new ReactNativeFirebaseStoragePackage(),
            new ReactNativeFirebaseAppPackage(),
            new SvgPackage(),
            new ImagePickerPackage(),
            new PickerViewPackage(),
            new AsyncStoragePackage(),
            new BlurViewPackage(),
            new RNGestureHandlerPackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
