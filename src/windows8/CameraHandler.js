/*global exports, Windows, ZXing, require, console */

/**
 * cordova is available under *either* the terms of the modified BSD license *or* the
 * MIT License (2008). See http://opensource.org/licenses/alphabetical for full text.
 *
 * Copyright (c) Vinicius Linck 2014
 * Copyright (c) 2014, Tlantic
 */

// Using
    var Capture = Windows.Media.Capture,
        previewPanel,
        reader,
        sampler,
        stopped = true,
        memoryBuffer,
        hook;



    // decoding barcode
    function readCode(decoder, pixels, format) {
        var result = reader.decode(pixels, decoder.pixelWidth, decoder.pixelHeight, format);
        
        if (result) {
            dispose();
            hook(result);
        } else {
            window.requestAnimationFrame(render);
        }
    }

    // decode bitmap stream
    function decodeBitmapStream(decoder, rawPixels) {
        var pixels, format, pixelBuffer_U8;

        switch (decoder.bitmapPixelFormat) {

            // RGBA 16
            case Windows.Graphics.Imaging.BitmapPixelFormat.rgba16:

                // allocate a typed array with the raw pixel data
                pixelBuffer_U8 = new Uint8Array(rawPixels);

                // Uint16Array provides a typed view into the raw bit pixel data
                pixels = new Uint16Array(pixelBuffer_U8.buffer);

                // defining image format
                format = (decoder.bitmapAlphaMode === Windows.Graphics.Imaging.BitmapAlphaMode.straight ? ZXing.BitmapFormat.rgba32 : ZXing.BitmapFormat.rgb32);

                // RGBA 8
            case Windows.Graphics.Imaging.BitmapPixelFormat.rgba8:
                // for 8 bit pixel, formats, just use returned pixel array.
                pixels = rawPixels;

                // defining image format
                format = (decoder.bitmapAlphaMode === Windows.Graphics.Imaging.BitmapAlphaMode.straight ? ZXing.BitmapFormat.rgba32 : ZXing.BitmapFormat.rgb32);

                // BGRA 8
            case Windows.Graphics.Imaging.BitmapPixelFormat.bgra8:
                // basically, this is still 8 bits...
                pixels = rawPixels;

                // defining image format
                format = (decoder.bitmapAlphaMode === Windows.Graphics.Imaging.BitmapAlphaMode.straight ? ZXing.BitmapFormat.bgra32 : ZXing.BitmapFormat.bgr32);
        }

        // checking barcode
        readCode(decoder, pixels, format);
    }

    // load stream creating a decoder
    function loadStream() {
        Windows.Graphics.Imaging.BitmapDecoder.createAsync(memoryBuffer).done(function onDone(decoder) {
            if (decoder) {
                decoder.getPixelDataAsync().then(

                    function onSuccess(pixelDataProvider) {
                        decodeBitmapStream(decoder, pixelDataProvider.detachPixelData());
                    },

                    function onError(e) {
                        throw e;
                    }

                );
            } else {
                throw new Error('Unable to load camera image');
            }
        });
    };

    // gets current preview image frame
   function flick() {
       var photoProperties = Windows.Media.MediaProperties.ImageEncodingProperties.createJpeg();
            memoryBuffer = new Windows.Storage.Streams.InMemoryRandomAccessStream();

        sampler.capturePhotoToStreamAsync(photoProperties, memoryBuffer).done(loadStream);
    };

    // triggers camera image gathering process
    function render() {

        if (!stopped) {
            flick();
        }
    };

    // dispose camera element
    function dispose() {
        previewPanel.style.display = 'none';
        previewPanel.pause();
        previewPanel.src = "";
        stopped = true;
    };


    exports.stop = function () {
        dispose();
        hook({ cancelled: true });
    };

    exports.start = function (callback) {
        hook = callback;
        previewPanel.style.display = 'block';
    previewPanel.src = URL.createObjectURL(sampler);
    previewPanel.play();
    stopped = false;
    render();
};
 
exports.createCameraElm = function () {
	'use strict';

	console.log('Creating camera element...');

	var elm = document.createElement('video');
	
	elm.style.display = 'none';
	elm.style.position = 'absolute';
	elm.style.left = '0px';
	elm.style.top = '0px';
	elm.style.zIndex = 2e9;
	elm.style.width = '100%';
	elm.style.height = '100%';

	elm.onclick = this.stop;

	return elm;
};

exports.initCamera = function () {
	'use strict';
	console.log('Configuring image sampler...');

	// preparing camera preview
	reader = new ZXing.BarcodeReader();
	sampler = new Capture.MediaCapture();
	sampler.initializeAsync();

	// adding preview element into DOM tree
	previewPanel = this.createCameraElm();
	document.body.appendChild(previewPanel);
};

 require('cordova/windows8/commandProxy').add('CameraHandler', exports);