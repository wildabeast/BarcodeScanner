/*global module, require, console*/
/**
 * cordova is available under *either* the terms of the modified BSD license *or* the
 * MIT License (2008). See http://opensource.org/licenses/alphabetical for full text.
 *
 * Copyright (c) Vinicius Linck 2014
 * Copyright (c) 2014, Tlantic
 */

var scanner = require('com.phonegap.plugins.barcodescanner.CameraHandler'),
	initialized = false;

try {
	scanner.initCamera();
	initialized = true;
} catch (e) {
	console.log('Failure initializing camre device: ', e);
}


 module.exports = {
	scan:function(win, fail) {
		'use strict';

	    try {
	        scanner.start(win);
		} catch(e) {
			fail(e);
		}
	}

 };

 require('cordova/windows8/commandProxy').add('BarcodeScanner', module.exports);
