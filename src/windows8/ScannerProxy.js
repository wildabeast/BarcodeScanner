/**//*global module, require*/
/**
 * cordova is available under *either* the terms of the modified BSD license *or* the
 * MIT License (2008). See http://opensource.org/licenses/alphabetical for full text.
 *
 * Copyright (c) Vinicius Linck 2014
 * Copyright (c) 2014, Tlantic
 */
module.exports = {

    scan:function(win, fail) {
        'use strict';

        console.log(Windows);

        win('0000000000');
    }

};

require('cordova/windows8/commandProxy').add('BarcodeScanner', module.exports);