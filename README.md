How I generated this modified ZXING .jar file?
------------------------------------------------
Viewfinder (crop) area can be increased by changing the "MAX_FRAME_WIDTH" and "MAX_FRAME_HEIGHT" in "CameraManager.java" (lines 44 and 45). CameraManager.java can be found in:

yourproject/plugins/com.phonegap.plugins.barcodescanner/src/android/LibraryProject/src/com/google/zxing/client/android/camera/CameraManager.java

After that you have to re-build the library project:

So assuming you have the Android SDK and tools (ie: ant) then what you need to do is go to the directory:

yourpoject\plugins\com.phonegap.plugins.barcodescanner\src\android\LibraryProject

you'll need to put a local.properties file in this folder, or make one, it only needs one line: sdk.dir=path/to/your/android/sdk

then assuming you have all the correct build tools and api packages (i did not, had to open my sdk manager and install build tools 19.1 and api 17) you would just need to run: ant release

which will build the executable jar, which for me showed up as: yourpoject\plugins\com.phonegap.plugins.barcodescanner\src\android\LibraryProject\bin\classes.jar

so rename it to: com.google.zxing.client.android.captureactivity.jar and put it under: yourpoject\plugins\com.phonegap.plugins.barcodescanner\src\android\

also, to avoid removing/re-adding the platform (to redeploy the plugin) i also copied the file to: yourproject\platforms\android\libs\com.google.zxing.client.android.captureactivity.jar

then just built the project.


HOW TO USE?
------------
1. Grab pre-built com.google.zxing.client.android.captureactivity.jar file from dist directory & place it under 2 locations in your projects.
    - yourpoject\plugins\com.phonegap.plugins.barcodescanner\src\android\
    - yourproject\platforms\android\libs\
2. Build your project and you should have barcode scanner with bigger viewfinder.


SOURCE 
--------

Thanks to Original ZXING Project 
      https://github.com/zxing/zxing
and also barcode scanner plugin for cordova (Source of my project)
      https://github.com/wildabeast/BarcodeScanner/#using-the-plugin
