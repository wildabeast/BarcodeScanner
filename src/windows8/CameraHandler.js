/*global exports, Windows, ZXing */

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
	sampler;
 
exports.createCameraElm = function () {
	'use strict';

	var elm = document.createElement('video');
	
	elm.style.position = 'absolute';
	elm.style.left = '0px';
	elm.style.top = '0px';
	elm.style.zIndex = 2e9;
	elm.style.width = '100%';
	elm.style.height = '100%';

	return elm;
};

exports.initCamera = function () {
	'use strict';

	// preparing camera preview
	reader = new ZXing.BarcodeReader();
	sampler = new Capture.MediaCapture();

	// adding preview element into DOM tree
	previewPanel = this.createCameraElm();
	document.body.append(previewPanel);
};