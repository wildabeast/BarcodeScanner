/* * Copyright (c) Microsoft Open Technologies, Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */

module.exports = {
    /**
     * Scans image via device camera and retrieves barcode from it.
     * @param  {function} success Success callback
     * @param  {function} fail    Error callback
     * @param  {array} args       Arguments array
     */
    scan: function (success, fail, args) {
        var reader,
            capturePreview,
            captureContainer,
            capturePreviewAlignmentMark,
            captureCancelButton,
            captureCameraButton,
            cancelCapture = false,
            baseButtonStyle = "border-width: 0px; display: block; margin: 20px; font-weight:bold; height: 40px; width:100px; border-radius: 10px; color:#666666; background-color:#f9f9f9;",
            hoverButtonStyle = "border-width: 0px; display: block; margin: 20px; font-weight:bold; height: 40px; width:100px; border-radius: 10px; color:#666666; background-color:#e9e9e9;";

        /**
        * Stops scanning/preview (does not destroy UI objects)
        */
        function cancelPreview() {
            // Cancel the capture process
            cancelCapture = true;

            // Stop displaying the video stream
            capturePreview.pause();
            capturePreview.src = null;
        }

        /**
        * Creates the video preview UI including cancelation and camera switching options
        */
        function createPreview() {
            // Overlay a DIV to hold all the preview content
            captureContainer = document.createElement("div");
            captureContainer.style.cssText = "position: absolute; left: 0; top: 0; width: 100%; height: 100%; background: black; text-align: center; vertical-align: middle;";

            // Video Preview control
            capturePreview = document.createElement("video");
            capturePreview.style.cssText = "position: absolute;  left: 0; top: 0; width: 100%; height: 100%; ";

            // Overlay an alignment mark to provide visual queue
            capturePreviewAlignmentMark = document.createElement('div');
            capturePreviewAlignmentMark.style.cssText = "position: absolute; left: 0; top: 50%; width: 100%; height: 3px; background: blue";

            // Add Cancel Button
            captureCancelButton = document.createElement("button");
            captureCancelButton.innerText = "Cancel";
            captureCancelButton.style.cssText = "position: absolute; right: 0; bottom: 0; " + baseButtonStyle;

            // Add Switch Camera Button
            captureCameraButton = document.createElement("button");
            captureCameraButton.innerText = "Camera";
            captureCameraButton.style.cssText = captureCameraButton.style.cssText = "position: absolute; left: 0; bottom: 0; " + baseButtonStyle;

            // Add click events for Cancel and Switch Camera
            captureCancelButton.addEventListener('click', cancelPreview, false);
            captureCameraButton.addEventListener('click', switchCamera, false);

            // Add mouse over events to comply with Modern UI validation requirements
            captureCancelButton.addEventListener('mouseenter', function () { captureCancelButton.style.cssText = "position: absolute; right: 0; bottom: 0; " + hoverButtonStyle; }, false);
            captureCancelButton.addEventListener('mouseleave', function () { captureCancelButton.style.cssText = "position: absolute; right: 0; bottom: 0; " + baseButtonStyle; }, false);
            captureCameraButton.addEventListener('mouseenter', function () { captureCameraButton.style.cssText = "position: absolute; left: 0; bottom: 0; " + hoverButtonStyle; }, false);
            captureCameraButton.addEventListener('mouseleave', function () { captureCameraButton.style.cssText = "position: absolute; left: 0; bottom: 0; " + baseButtonStyle; }, false);

            // Add the preview content to the current document
            document.body.appendChild(captureContainer);
            captureContainer.appendChild(capturePreview);
            captureContainer.appendChild(capturePreviewAlignmentMark);
            captureContainer.appendChild(captureCancelButton);
            captureContainer.appendChild(captureCameraButton);
        }

        /**
        * Start preview/scanning using the device's default camera
        */
        function defaultCamera() {
            reader.start().done(function (mediaCapture) {
                capturePreview.src = URL.createObjectURL(mediaCapture);
                capturePreview.play();
                reader.scan().done(function (res) {
                    capturePreview.pause();
                    capturePreview.src = null;
                    if (res) {
                        success({ text: res && res.text, format: res && res.barcodeFormat, cancelled: !res });
                        cancelPreview();
                    }
                });
            });
        };

        /**
        * Stops scanning/preview and destroys the preview UI
        */
        function destroyPreview() {
            // Cancel the capture process
            cancelCapture = true;

            // Stop displaying the video stream
            capturePreview.pause();
            capturePreview.src = null;

            // Remove the preview controls from the document
            document.body.removeChild(captureContainer);
        }

        /**
        * Cycles to the next available camera and resumes preview/scanning
        */
        function switchCamera() {
            reader.switchCamera().done(function (mediaCapture) {
                capturePreview.src = URL.createObjectURL(mediaCapture);
                capturePreview.play();
                reader.scan().done(function (res) {
                    capturePreview.pause();
                    capturePreview.src = null;
                    if (res) {
                        success({ text: res && res.text, format: res && res.barcodeFormat, cancelled: !res });
                        cancelPreview();
                    }
                });
            });
        };

        try {
            // Create reader control
            reader = new BarcodeScanner.Reader();

            // Add the preview UI
            createPreview();

            // Start scanning with the default camera
            defaultCamera();
        }
        catch (ex) {
            fail(ex);
        }
    },

    /**
     * Encodes specified data into barcode
     * @param  {function} success Success callback
     * @param  {function} fail    Error callback
     * @param  {array} args       Arguments array
     */
    encode: function (success, fail, args) {
        fail("Not implemented yet");
    }
};

require("cordova/exec/proxy").add("BarcodeScanner", module.exports);