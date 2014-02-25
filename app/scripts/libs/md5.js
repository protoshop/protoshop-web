/**
 * Namespace for hashing and other cryptographic functions
 * Copyright (c) Andrew Valums
 * Licensed under the MIT license, http://valums.com/mit-license/
 */

var V = V || {};
V.Security = V.Security || {};

(function() {
  // for faster access
  var S = V.Security;

  /**
   * The highest integer value a number can go to without losing precision.
   */
  S.maxExactInt = Math.pow(2, 53);

  /**
   * Converts string from internal UTF-16 to UTF-8
   * and saves it using array of numbers (bytes), 0-255 per cell
   * @param {String} str
   * @return {Array}
   */
  S.toUtf8ByteArr = function(str) {
    var arr = [],
      code;

    for (var i = 0; i < str.length; i++) {
      code = str.charCodeAt(i);

      /*
       Note that charCodeAt will always return a value that is less than 65,536.
       This is because the higher code points are represented by a pair of (lower valued)
       "surrogate" pseudo-characters which are used to comprise the real character.
       Because of this, in order to examine or reproduce the full character for
       individual characters of value 65,536 and above, for such characters,
       it is necessary to retrieve not only charCodeAt(0), but also charCodeAt(1). 
       */
      if (0xD800 <= code && code <= 0xDBFF) {
        // UTF-16 high surrogate 
        var hi = code,
          low = str.charCodeAt(i + 1);

        code = ((hi - 0xD800) * 0x400) + (low - 0xDC00) + 0x10000;

        i++;
      }

      if (code <= 127) {
        arr[arr.length] = code;
      } else if (code <= 2047) {
        arr[arr.length] = (code >>> 6) + 0xC0;
        arr[arr.length] = code & 0x3F | 0x80;
      } else if (code <= 65535) {
        arr[arr.length] = (code >>> 12) + 0xE0;
        arr[arr.length] = (code >>> 6 & 0x3F) | 0x80;
        arr[arr.length] = (code & 0x3F) | 0x80;
      } else if (code <= 1114111) {
        arr[arr.length] = (code >>> 18) + 0xF0;
        arr[arr.length] = (code >>> 12 & 0x3F) | 0x80;
        arr[arr.length] = (code >>> 6 & 0x3F) | 0x80;
        arr[arr.length] = (code & 0x3F) | 0x80;
      } else {
        throw 'Unicode standart supports code points up-to U+10FFFF';
      }
    }

    return arr;
  };

  /**
   * Outputs 32 integer bits of a number in hex format.
   * Preserves leading zeros.
   * @param {Number} num
   */
  S.toHex32 = function(num) {
    // if negative
    if (num & 0x80000000) {
      // convert to positive number
      num = num & (~0x80000000);
      num += Math.pow(2, 31);
    }

    var str = num.toString(16);

    while (str.length < 8) {
      str = '0' + str;
    }

    return str;
  };

  /**
   * Changes the order of 4 bytes in integer representation of number.
   * From 1234 to 4321.
   * @param {Number} num Only 32 int bits are used.
   */
  S.reverseBytes = function(num) {
    var res = 0;
    res += ((num >>> 24) & 0xff);
    res += ((num >>> 16) & 0xff) << 8;
    res += ((num >>> 8) & 0xff) << 16;
    res += (num & 0xff) << 24;
    return res;
  };

  S.leftRotate = function(x, c) {
    return (x << c) | (x >>> (32 - c));
  };

  /**
   * RSA Data Security, Inc. MD5 Message-Digest Algorithm
   * http://tools.ietf.org/html/rfc1321
   * http://en.wikipedia.org/wiki/MD5
   * @param {String} message
   */
  S.md5 = function(message) {
    // r specifies the per-round shift amounts
    var r = [7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21];

    // Use binary integer part of the sines of integers (Radians) as constants:
    var k = [];
    for (var i = 0; i <= 63; i++) {
      k[i] = (Math.abs(Math.sin(i + 1)) * Math.pow(2, 32)) << 0;
    }

    var h0 = 0x67452301,
      h1 = 0xEFCDAB89,
      h2 = 0x98BADCFE,
      h3 = 0x10325476,
      bytes, unpadded;

    //Pre-processing:   
    bytes = S.toUtf8ByteArr(message);
    message = null;
    unpadded = bytes.length;

    //append "1" bit to message
    //append "0" bits until message length in bits ≡ 448 (mod 512)    
    bytes.push(0x80);
    var zeroBytes = Math.abs(448 - (bytes.length * 8) % 512) / 8;

    while (zeroBytes--) {
      bytes.push(0);
    }

    //append bit length of unpadded message as 64-bit little-endian integer to message          
    bytes.push(unpadded * 8 & 0xff, unpadded * 8 >> 8 & 0xff, unpadded * 8 >> 16 & 0xff, unpadded * 8 >> 24 & 0xff);

    var i = 4;
    while (i--) {
      bytes.push(0);
    }

    var leftRotate = S.leftRotate;

    //Process the message in successive 512-bit chunks:
    var i = 0,
      w = [];
    while (i < bytes.length) {

      //break chunk into sixteen 32-bit words w[i], 0 ≤ i ≤ 15
      for (var j = 0; j <= 15; j++) {
        w[j] = (bytes[i + 4 * j] << 0) + (bytes[i + 4 * j + 1] << 8) + (bytes[i + 4 * j + 2] << 16) + (bytes[i + 4 * j + 3] << 24);
      }

      //Initialize hash value for this chunk:
      var a = h0,
        b = h1,
        c = h2,
        d = h3,
        f, g;

      //Main loop:
      for (var j = 0; j <= 63; j++) {

        if (j <= 15) {
          f = (b & c) | ((~b) & d);
          g = j;
        } else if (j <= 31) {
          f = (d & b) | ((~d) & c);
          g = (5 * j + 1) % 16;
        } else if (j <= 47) {
          f = b ^ c ^ d;
          g = (3 * j + 5) % 16;
        } else {
          f = c ^ (b | (~d));
          g = (7 * j) % 16;
        }

        var temp = d;

        d = c;
        c = b;
        b = b + leftRotate((a + f + k[j] + w[g]), r[j]);
        a = temp;
      }

      //Add this chunk's hash to result so far:
      h0 = (h0 + a) << 0;
      h1 = (h1 + b) << 0;
      h2 = (h2 + c) << 0;
      h3 = (h3 + d) << 0;

      i += 512 / 8;
    }

    // fix when starting with 0                 
    var res = out(h0) + out(h1) + out(h2) + out(h3);

    function out(h) {
      return S.toHex32(S.reverseBytes(h));
    }

    return res;
  };
})();