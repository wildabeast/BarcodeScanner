using System;
using System.Threading;
using System.Threading.Tasks;
using Windows.Devices.Enumeration;
using Windows.Foundation;
using Windows.Graphics.Imaging;
using Windows.Media.Capture;
using Windows.Media.MediaProperties;
using Windows.Storage.Streams;
using ZXing;

namespace BarcodeScanner
{
    public sealed class Reader
    {
        private bool barcodeFoundOrCancelled;

        private BarcodeReader barcodeReader;

        private CancellationTokenSource cancelSearch;

        private ImageEncodingProperties encodingProps;

        private InMemoryRandomAccessStream imageStream;

        public event EventHandler<ZXing.Result> BarcodeFoundEvent;

        public DeviceInformationCollection Cameras { get; set; }

        public MediaCapture Capture { get; set; }

        public DeviceInformation CurrentCamera { get; set; }
        public IAsyncOperation<Result> Scan()
        {
            return this.ScanHelper().AsAsyncOperation();
        }

        public IAsyncOperation<MediaCapture> Start()
        {
            return this.StartHelper().AsAsyncOperation();
        }

        public void Stop()
        {
            this.barcodeFoundOrCancelled = true;
            this.cancelSearch.Cancel();
        }

        public IAsyncOperation<MediaCapture> SwitchCamera()
        {
            return this.SwitchCameraHelper().AsAsyncOperation();
        }

        private async Task<ZXing.Result> DecodeStream(System.Threading.CancellationToken cancelToken)
        {
            ZXing.Result result = null;

            try
            {
                await Task.Run(
                    async () =>
                    {
                        imageStream = new InMemoryRandomAccessStream();

                        await Capture.CapturePhotoToStreamAsync(encodingProps, imageStream);
                        await imageStream.FlushAsync();

                        var decoder = await BitmapDecoder.CreateAsync(imageStream);
                        imageStream.Dispose();

                        byte[] pixels =
                            (await
                                decoder.GetPixelDataAsync(BitmapPixelFormat.Rgba8,
                                    BitmapAlphaMode.Ignore,
                                    new BitmapTransform(),
                                    ExifOrientationMode.IgnoreExifOrientation,
                                    ColorManagementMode.DoNotColorManage)).DetachPixelData();

                        const BitmapFormat format = BitmapFormat.RGB32;

                        result = barcodeReader.Decode(pixels, (int)decoder.PixelWidth, (int)decoder.PixelHeight, format);

                        if (result != null)
                        {
                            barcodeFoundOrCancelled = true;
                        }
                    },
                    cancelToken).ConfigureAwait(false);
            }
            catch (TaskCanceledException)
            {
                barcodeFoundOrCancelled = true;
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine(ex.ToString());
            }

            return result;
        }

        private void OnBarcodeFound(ZXing.Result args)
        {
            var completedEvent = BarcodeFoundEvent;
            if (completedEvent != null)
            {
                completedEvent(this, args);
            }
        }

        private async Task<MediaCapture> OpenCamera()
        {
            var settings = new MediaCaptureInitializationSettings();
            settings.StreamingCaptureMode = StreamingCaptureMode.Video;
            settings.VideoDeviceId = CurrentCamera.Id;

            Capture = new MediaCapture();
            await Capture.InitializeAsync(settings);

            encodingProps = ImageEncodingProperties.CreateJpeg();

            return Capture;
        }

        private async Task<Result> ScanHelper()
        {
            barcodeReader = new BarcodeReader();
            barcodeReader.Options.TryHarder = true;
            barcodeReader.AutoRotate = true;
            barcodeFoundOrCancelled = false;

            cancelSearch = new CancellationTokenSource();
            Result result = null;
            while (!barcodeFoundOrCancelled)
            {
                result = await DecodeStream(cancelSearch.Token);
            }

            return result;
        }

        private async Task<MediaCapture> StartHelper()
        {
            Cameras = await DeviceInformation.FindAllAsync(DeviceClass.VideoCapture);
            if (Cameras.Count > 0)
            {
                CurrentCamera = Cameras[0];
                return await OpenCamera();
            }
            else throw new Exception("No Cameras Found");
        }
        private async Task<MediaCapture> SwitchCameraHelper()
        {
            Stop();
            DeviceInformation nextCamera = null;

            for (int i = 0; i < Cameras.Count; i++)
            {
                if (Cameras[i].Id.ToLower() == CurrentCamera.Id.ToLower())
                {
                    if (i == (Cameras.Count - 1)) nextCamera = Cameras[0];
                    else nextCamera = Cameras[i + 1];
                    break;
                }
            }

            if (nextCamera != null)
            {
                CurrentCamera = nextCamera;
                return await OpenCamera();
            }
            else return Capture;
        }
    }
}

/*
 * Copyright (c) Marc LaFleur
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */