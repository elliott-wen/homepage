/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/code/EncryptDecrypt.ts":
/*!************************************!*\
  !*** ./src/code/EncryptDecrypt.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.cyrb53 = exports.javaHashCode = exports.murmurhash3_32_gc = void 0;
// @ts-nocheck 
// https://github.com/artem0/canvas-fingerprinting/blob/master/hash/murmurhash3.js
// output - 3705295134 a hashed number of the string.
// https://en.wikipedia.org/wiki/MurmurHash
function murmurhash3_32_gc(key, seed) {
    var remainder, bytes, h1, h1b, c1, c2, k1, i;
    remainder = key.length & 3; // key.length % 4
    bytes = key.length - remainder;
    h1 = seed;
    c1 = 0xcc9e2d51;
    c2 = 0x1b873593;
    i = 0;
    while (i < bytes) {
        k1 =
            ((key.charCodeAt(i) & 0xff)) |
                ((key.charCodeAt(++i) & 0xff) << 8) |
                ((key.charCodeAt(++i) & 0xff) << 16) |
                ((key.charCodeAt(++i) & 0xff) << 24);
        ++i;
        k1 = ((((k1 & 0xffff) * c1) + ((((k1 >>> 16) * c1) & 0xffff) << 16))) & 0xffffffff;
        k1 = (k1 << 15) | (k1 >>> 17);
        k1 = ((((k1 & 0xffff) * c2) + ((((k1 >>> 16) * c2) & 0xffff) << 16))) & 0xffffffff;
        h1 ^= k1;
        h1 = (h1 << 13) | (h1 >>> 19);
        h1b = ((((h1 & 0xffff) * 5) + ((((h1 >>> 16) * 5) & 0xffff) << 16))) & 0xffffffff;
        h1 = (((h1b & 0xffff) + 0x6b64) + ((((h1b >>> 16) + 0xe654) & 0xffff) << 16));
    }
    k1 = 0;
    switch (remainder) {
        case 3:
            k1 ^= (key.charCodeAt(i + 2) & 0xff) << 16;
            break;
        case 2:
            k1 ^= (key.charCodeAt(i + 1) & 0xff) << 8;
            break;
        case 1:
            k1 ^= (key.charCodeAt(i) & 0xff);
            k1 = (((k1 & 0xffff) * c1) + ((((k1 >>> 16) * c1) & 0xffff) << 16)) & 0xffffffff;
            k1 = (k1 << 15) | (k1 >>> 17);
            k1 = (((k1 & 0xffff) * c2) + ((((k1 >>> 16) * c2) & 0xffff) << 16)) & 0xffffffff;
            h1 ^= k1;
            break;
        default:
            return 0;
    }
    h1 ^= key.length;
    h1 ^= h1 >>> 16;
    h1 = (((h1 & 0xffff) * 0x85ebca6b) + ((((h1 >>> 16) * 0x85ebca6b) & 0xffff) << 16)) & 0xffffffff;
    h1 ^= h1 >>> 13;
    h1 = ((((h1 & 0xffff) * 0xc2b2ae35) + ((((h1 >>> 16) * 0xc2b2ae35) & 0xffff) << 16))) & 0xffffffff;
    h1 ^= h1 >>> 16;
    return h1 >>> 0;
}
exports.murmurhash3_32_gc = murmurhash3_32_gc;
// taken from same above repo
const javaHashCode = (string, K) => {
    var hash = 0;
    if (string.length === 0) {
        return hash;
    }
    let char;
    for (var i = 0; i < string.length; i++) {
        char = string.charCodeAt(i);
        hash = K * ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return hash;
};
exports.javaHashCode = javaHashCode;
// reference - https://stackoverflow.com/questions/7616461/generate-a-hash-from-string-in-javascript#answer-52171480
// output - 6533356943844037
const cyrb53 = function (str, seed = 0) {
    let h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed;
    for (let i = 0, ch; i < str.length; i++) {
        ch = str.charCodeAt(i);
        h1 = Math.imul(h1 ^ ch, 2654435761);
        h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
    return 4294967296 * (2097151 & h2) + (h1 >>> 0);
};
exports.cyrb53 = cyrb53;


/***/ }),

/***/ "./src/code/GenerateCanvasFingerprint.ts":
/*!***********************************************!*\
  !*** ./src/code/GenerateCanvasFingerprint.ts ***!
  \***********************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getCanvasFingerprint = exports.isCanvasSupported = void 0;
const isCanvasSupported = () => {
    var elem = document.createElement('canvas');
    return !!(elem.getContext && elem.getContext('2d'));
};
exports.isCanvasSupported = isCanvasSupported;
// this working code snippet is taken from - https://github.com/artem0/canvas-fingerprinting/blob/master/fingerprinting/fingerprint.js
const getCanvasFingerprint = () => {
    // If canvas is not supported simply return a static string
    if (!(0, exports.isCanvasSupported)())
        return "broprint.js";
    // draw a canvas of given text and return its data uri
    // different browser generates different dataUri based on their hardware configs
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    // https://www.browserleaks.com/canvas#how-does-it-work
    var txt = 'BroPrint.65@345876';
    ctx.textBaseline = "top";
    ctx.font = "14px 'Arial'";
    ctx.textBaseline = "alphabetic";
    ctx.fillStyle = "#f60";
    ctx.fillRect(125, 1, 62, 20);
    ctx.fillStyle = "#069";
    ctx.fillText(txt, 2, 15);
    ctx.fillStyle = "rgba(102, 204, 0, 0.7)";
    ctx.fillText(txt, 4, 17);
    return canvas.toDataURL();
};
exports.getCanvasFingerprint = getCanvasFingerprint;


/***/ }),

/***/ "./src/code/generateTheAudioPrints.ts":
/*!********************************************!*\
  !*** ./src/code/generateTheAudioPrints.ts ***!
  \********************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.generateTheAudioFingerPrint = void 0;
//  ref = https://github.com/rickmacgillis/audio-fingerprint/blob/master/audio-fingerprinting.js
// @ts-nocheck
exports.generateTheAudioFingerPrint = (function () {
    var context = null;
    var currentTime = null;
    var oscillator = null;
    var compressor = null;
    var fingerprint = null;
    var callback = null;
    function run(cb, debug = false) {
        callback = cb;
        try {
            setup();
            oscillator.connect(compressor);
            compressor.connect(context.destination);
            oscillator.start(0);
            context.startRendering();
            context.oncomplete = onComplete;
        }
        catch (e) {
            if (debug) {
                throw e;
            }
        }
    }
    function setup() {
        setContext();
        currentTime = context.currentTime;
        setOscillator();
        setCompressor();
    }
    function setContext() {
        var audioContext = window.OfflineAudioContext || window.webkitOfflineAudioContext;
        context = new audioContext(1, 44100, 44100);
    }
    function setOscillator() {
        oscillator = context.createOscillator();
        oscillator.type = "triangle";
        oscillator.frequency.setValueAtTime(10000, currentTime);
    }
    function setCompressor() {
        compressor = context.createDynamicsCompressor();
        setCompressorValueIfDefined('threshold', -50);
        setCompressorValueIfDefined('knee', 40);
        setCompressorValueIfDefined('ratio', 12);
        setCompressorValueIfDefined('reduction', -20);
        setCompressorValueIfDefined('attack', 0);
        setCompressorValueIfDefined('release', .25);
    }
    function setCompressorValueIfDefined(item, value) {
        if (compressor[item] !== undefined && typeof compressor[item].setValueAtTime === 'function') {
            compressor[item].setValueAtTime(value, context.currentTime);
        }
    }
    function onComplete(event) {
        generateFingerprints(event);
        compressor.disconnect();
    }
    function generateFingerprints(event) {
        var output = null;
        for (var i = 4500; 5e3 > i; i++) {
            var channelData = event.renderedBuffer.getChannelData(0)[i];
            output += Math.abs(channelData);
        }
        fingerprint = output.toString();
        if (typeof callback === 'function') {
            return callback(fingerprint);
        }
    }
    return {
        run: run
    };
})();


/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getCurrentBrowserFingerPrint = void 0;
const EncryptDecrypt_1 = __webpack_require__(/*! ./code/EncryptDecrypt */ "./src/code/EncryptDecrypt.ts");
const GenerateCanvasFingerprint_1 = __webpack_require__(/*! ./code/GenerateCanvasFingerprint */ "./src/code/GenerateCanvasFingerprint.ts");
const generateTheAudioPrints_1 = __webpack_require__(/*! ./code/generateTheAudioPrints */ "./src/code/generateTheAudioPrints.ts");
/**
 * This functions working
 * @Param {null}
 * @return {Promise<string>} - resolve(string)
 */
const getCurrentBrowserFingerPrint = () => {
    /**
     * @return {Promise} - a frequency number 120.256896523
     * @reference - https://fingerprintjs.com/blog/audio-fingerprinting/
     */
    const getTheAudioPrints = new Promise((resolve, reject) => {
        generateTheAudioPrints_1.generateTheAudioFingerPrint.run(function (fingerprint) {
            resolve(fingerprint);
        });
    });
    /**
     *
     * @param {null}
     * @return {Promise<string>} - and sha512 hashed string
     */
    const DevicePrints = new Promise((resolve, reject) => {
        getTheAudioPrints.then((audioChannelResult) => __awaiter(void 0, void 0, void 0, function* () {
            let fingerprint = "";
            // @todo - make fingerprint unique in brave browser
            if ((navigator.brave && (yield navigator.brave.isBrave()) || false))
                fingerprint = window.btoa(audioChannelResult) + (0, GenerateCanvasFingerprint_1.getCanvasFingerprint)();
            else
                fingerprint = window.btoa(audioChannelResult) + (0, GenerateCanvasFingerprint_1.getCanvasFingerprint)();
            // using btoa to hash the values to looks better readable
            resolve((0, EncryptDecrypt_1.cyrb53)(fingerprint, 0));
        })).catch(() => {
            try {
                // if failed with audio fingerprint then resolve only with canvas fingerprint
                resolve((0, EncryptDecrypt_1.cyrb53)((0, GenerateCanvasFingerprint_1.getCanvasFingerprint)()).toString());
            }
            catch (error) {
                reject("Failed to generate the finger print of this browser");
            }
        });
    });
    return DevicePrints;
};
exports.getCurrentBrowserFingerPrint = getCurrentBrowserFingerPrint;


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.ts");
/******/ 	window.dmg = __webpack_exports__;
/******/ 	
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1QsS0FBSztBQUNMO0FBQ0E7QUFDQSxvQ0FBb0M7Ozs7Ozs7VUN6RHBDO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7VUV0QkE7VUFDQTtVQUNBO1VBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9kbWcvLi9zcmMvY29kZS9FbmNyeXB0RGVjcnlwdC50cyIsIndlYnBhY2s6Ly9kbWcvLi9zcmMvY29kZS9HZW5lcmF0ZUNhbnZhc0ZpbmdlcnByaW50LnRzIiwid2VicGFjazovL2RtZy8uL3NyYy9jb2RlL2dlbmVyYXRlVGhlQXVkaW9QcmludHMudHMiLCJ3ZWJwYWNrOi8vZG1nLy4vc3JjL2luZGV4LnRzIiwid2VicGFjazovL2RtZy93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9kbWcvd2VicGFjay9iZWZvcmUtc3RhcnR1cCIsIndlYnBhY2s6Ly9kbWcvd2VicGFjay9zdGFydHVwIiwid2VicGFjazovL2RtZy93ZWJwYWNrL2FmdGVyLXN0YXJ0dXAiXSwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmN5cmI1MyA9IGV4cG9ydHMuamF2YUhhc2hDb2RlID0gZXhwb3J0cy5tdXJtdXJoYXNoM18zMl9nYyA9IHZvaWQgMDtcbi8vIEB0cy1ub2NoZWNrIFxuLy8gaHR0cHM6Ly9naXRodWIuY29tL2FydGVtMC9jYW52YXMtZmluZ2VycHJpbnRpbmcvYmxvYi9tYXN0ZXIvaGFzaC9tdXJtdXJoYXNoMy5qc1xuLy8gb3V0cHV0IC0gMzcwNTI5NTEzNCBhIGhhc2hlZCBudW1iZXIgb2YgdGhlIHN0cmluZy5cbi8vIGh0dHBzOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL011cm11ckhhc2hcbmZ1bmN0aW9uIG11cm11cmhhc2gzXzMyX2djKGtleSwgc2VlZCkge1xuICAgIHZhciByZW1haW5kZXIsIGJ5dGVzLCBoMSwgaDFiLCBjMSwgYzIsIGsxLCBpO1xuICAgIHJlbWFpbmRlciA9IGtleS5sZW5ndGggJiAzOyAvLyBrZXkubGVuZ3RoICUgNFxuICAgIGJ5dGVzID0ga2V5Lmxlbmd0aCAtIHJlbWFpbmRlcjtcbiAgICBoMSA9IHNlZWQ7XG4gICAgYzEgPSAweGNjOWUyZDUxO1xuICAgIGMyID0gMHgxYjg3MzU5MztcbiAgICBpID0gMDtcbiAgICB3aGlsZSAoaSA8IGJ5dGVzKSB7XG4gICAgICAgIGsxID1cbiAgICAgICAgICAgICgoa2V5LmNoYXJDb2RlQXQoaSkgJiAweGZmKSkgfFxuICAgICAgICAgICAgICAgICgoa2V5LmNoYXJDb2RlQXQoKytpKSAmIDB4ZmYpIDw8IDgpIHxcbiAgICAgICAgICAgICAgICAoKGtleS5jaGFyQ29kZUF0KCsraSkgJiAweGZmKSA8PCAxNikgfFxuICAgICAgICAgICAgICAgICgoa2V5LmNoYXJDb2RlQXQoKytpKSAmIDB4ZmYpIDw8IDI0KTtcbiAgICAgICAgKytpO1xuICAgICAgICBrMSA9ICgoKChrMSAmIDB4ZmZmZikgKiBjMSkgKyAoKCgoazEgPj4+IDE2KSAqIGMxKSAmIDB4ZmZmZikgPDwgMTYpKSkgJiAweGZmZmZmZmZmO1xuICAgICAgICBrMSA9IChrMSA8PCAxNSkgfCAoazEgPj4+IDE3KTtcbiAgICAgICAgazEgPSAoKCgoazEgJiAweGZmZmYpICogYzIpICsgKCgoKGsxID4+PiAxNikgKiBjMikgJiAweGZmZmYpIDw8IDE2KSkpICYgMHhmZmZmZmZmZjtcbiAgICAgICAgaDEgXj0gazE7XG4gICAgICAgIGgxID0gKGgxIDw8IDEzKSB8IChoMSA+Pj4gMTkpO1xuICAgICAgICBoMWIgPSAoKCgoaDEgJiAweGZmZmYpICogNSkgKyAoKCgoaDEgPj4+IDE2KSAqIDUpICYgMHhmZmZmKSA8PCAxNikpKSAmIDB4ZmZmZmZmZmY7XG4gICAgICAgIGgxID0gKCgoaDFiICYgMHhmZmZmKSArIDB4NmI2NCkgKyAoKCgoaDFiID4+PiAxNikgKyAweGU2NTQpICYgMHhmZmZmKSA8PCAxNikpO1xuICAgIH1cbiAgICBrMSA9IDA7XG4gICAgc3dpdGNoIChyZW1haW5kZXIpIHtcbiAgICAgICAgY2FzZSAzOlxuICAgICAgICAgICAgazEgXj0gKGtleS5jaGFyQ29kZUF0KGkgKyAyKSAmIDB4ZmYpIDw8IDE2O1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgIGsxIF49IChrZXkuY2hhckNvZGVBdChpICsgMSkgJiAweGZmKSA8PCA4O1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgIGsxIF49IChrZXkuY2hhckNvZGVBdChpKSAmIDB4ZmYpO1xuICAgICAgICAgICAgazEgPSAoKChrMSAmIDB4ZmZmZikgKiBjMSkgKyAoKCgoazEgPj4+IDE2KSAqIGMxKSAmIDB4ZmZmZikgPDwgMTYpKSAmIDB4ZmZmZmZmZmY7XG4gICAgICAgICAgICBrMSA9IChrMSA8PCAxNSkgfCAoazEgPj4+IDE3KTtcbiAgICAgICAgICAgIGsxID0gKCgoazEgJiAweGZmZmYpICogYzIpICsgKCgoKGsxID4+PiAxNikgKiBjMikgJiAweGZmZmYpIDw8IDE2KSkgJiAweGZmZmZmZmZmO1xuICAgICAgICAgICAgaDEgXj0gazE7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIHJldHVybiAwO1xuICAgIH1cbiAgICBoMSBePSBrZXkubGVuZ3RoO1xuICAgIGgxIF49IGgxID4+PiAxNjtcbiAgICBoMSA9ICgoKGgxICYgMHhmZmZmKSAqIDB4ODVlYmNhNmIpICsgKCgoKGgxID4+PiAxNikgKiAweDg1ZWJjYTZiKSAmIDB4ZmZmZikgPDwgMTYpKSAmIDB4ZmZmZmZmZmY7XG4gICAgaDEgXj0gaDEgPj4+IDEzO1xuICAgIGgxID0gKCgoKGgxICYgMHhmZmZmKSAqIDB4YzJiMmFlMzUpICsgKCgoKGgxID4+PiAxNikgKiAweGMyYjJhZTM1KSAmIDB4ZmZmZikgPDwgMTYpKSkgJiAweGZmZmZmZmZmO1xuICAgIGgxIF49IGgxID4+PiAxNjtcbiAgICByZXR1cm4gaDEgPj4+IDA7XG59XG5leHBvcnRzLm11cm11cmhhc2gzXzMyX2djID0gbXVybXVyaGFzaDNfMzJfZ2M7XG4vLyB0YWtlbiBmcm9tIHNhbWUgYWJvdmUgcmVwb1xuY29uc3QgamF2YUhhc2hDb2RlID0gKHN0cmluZywgSykgPT4ge1xuICAgIHZhciBoYXNoID0gMDtcbiAgICBpZiAoc3RyaW5nLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICByZXR1cm4gaGFzaDtcbiAgICB9XG4gICAgbGV0IGNoYXI7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdHJpbmcubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgY2hhciA9IHN0cmluZy5jaGFyQ29kZUF0KGkpO1xuICAgICAgICBoYXNoID0gSyAqICgoaGFzaCA8PCA1KSAtIGhhc2gpICsgY2hhcjtcbiAgICAgICAgaGFzaCA9IGhhc2ggJiBoYXNoO1xuICAgIH1cbiAgICByZXR1cm4gaGFzaDtcbn07XG5leHBvcnRzLmphdmFIYXNoQ29kZSA9IGphdmFIYXNoQ29kZTtcbi8vIHJlZmVyZW5jZSAtIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzc2MTY0NjEvZ2VuZXJhdGUtYS1oYXNoLWZyb20tc3RyaW5nLWluLWphdmFzY3JpcHQjYW5zd2VyLTUyMTcxNDgwXG4vLyBvdXRwdXQgLSA2NTMzMzU2OTQzODQ0MDM3XG5jb25zdCBjeXJiNTMgPSBmdW5jdGlvbiAoc3RyLCBzZWVkID0gMCkge1xuICAgIGxldCBoMSA9IDB4ZGVhZGJlZWYgXiBzZWVkLCBoMiA9IDB4NDFjNmNlNTcgXiBzZWVkO1xuICAgIGZvciAobGV0IGkgPSAwLCBjaDsgaSA8IHN0ci5sZW5ndGg7IGkrKykge1xuICAgICAgICBjaCA9IHN0ci5jaGFyQ29kZUF0KGkpO1xuICAgICAgICBoMSA9IE1hdGguaW11bChoMSBeIGNoLCAyNjU0NDM1NzYxKTtcbiAgICAgICAgaDIgPSBNYXRoLmltdWwoaDIgXiBjaCwgMTU5NzMzNDY3Nyk7XG4gICAgfVxuICAgIGgxID0gTWF0aC5pbXVsKGgxIF4gKGgxID4+PiAxNiksIDIyNDY4MjI1MDcpIF4gTWF0aC5pbXVsKGgyIF4gKGgyID4+PiAxMyksIDMyNjY0ODk5MDkpO1xuICAgIGgyID0gTWF0aC5pbXVsKGgyIF4gKGgyID4+PiAxNiksIDIyNDY4MjI1MDcpIF4gTWF0aC5pbXVsKGgxIF4gKGgxID4+PiAxMyksIDMyNjY0ODk5MDkpO1xuICAgIHJldHVybiA0Mjk0OTY3Mjk2ICogKDIwOTcxNTEgJiBoMikgKyAoaDEgPj4+IDApO1xufTtcbmV4cG9ydHMuY3lyYjUzID0gY3lyYjUzO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmdldENhbnZhc0ZpbmdlcnByaW50ID0gZXhwb3J0cy5pc0NhbnZhc1N1cHBvcnRlZCA9IHZvaWQgMDtcbmNvbnN0IGlzQ2FudmFzU3VwcG9ydGVkID0gKCkgPT4ge1xuICAgIHZhciBlbGVtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XG4gICAgcmV0dXJuICEhKGVsZW0uZ2V0Q29udGV4dCAmJiBlbGVtLmdldENvbnRleHQoJzJkJykpO1xufTtcbmV4cG9ydHMuaXNDYW52YXNTdXBwb3J0ZWQgPSBpc0NhbnZhc1N1cHBvcnRlZDtcbi8vIHRoaXMgd29ya2luZyBjb2RlIHNuaXBwZXQgaXMgdGFrZW4gZnJvbSAtIGh0dHBzOi8vZ2l0aHViLmNvbS9hcnRlbTAvY2FudmFzLWZpbmdlcnByaW50aW5nL2Jsb2IvbWFzdGVyL2ZpbmdlcnByaW50aW5nL2ZpbmdlcnByaW50LmpzXG5jb25zdCBnZXRDYW52YXNGaW5nZXJwcmludCA9ICgpID0+IHtcbiAgICAvLyBJZiBjYW52YXMgaXMgbm90IHN1cHBvcnRlZCBzaW1wbHkgcmV0dXJuIGEgc3RhdGljIHN0cmluZ1xuICAgIGlmICghKDAsIGV4cG9ydHMuaXNDYW52YXNTdXBwb3J0ZWQpKCkpXG4gICAgICAgIHJldHVybiBcImJyb3ByaW50LmpzXCI7XG4gICAgLy8gZHJhdyBhIGNhbnZhcyBvZiBnaXZlbiB0ZXh0IGFuZCByZXR1cm4gaXRzIGRhdGEgdXJpXG4gICAgLy8gZGlmZmVyZW50IGJyb3dzZXIgZ2VuZXJhdGVzIGRpZmZlcmVudCBkYXRhVXJpIGJhc2VkIG9uIHRoZWlyIGhhcmR3YXJlIGNvbmZpZ3NcbiAgICB2YXIgY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XG4gICAgdmFyIGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuICAgIC8vIGh0dHBzOi8vd3d3LmJyb3dzZXJsZWFrcy5jb20vY2FudmFzI2hvdy1kb2VzLWl0LXdvcmtcbiAgICB2YXIgdHh0ID0gJ0Jyb1ByaW50LjY1QDM0NTg3Nic7XG4gICAgY3R4LnRleHRCYXNlbGluZSA9IFwidG9wXCI7XG4gICAgY3R4LmZvbnQgPSBcIjE0cHggJ0FyaWFsJ1wiO1xuICAgIGN0eC50ZXh0QmFzZWxpbmUgPSBcImFscGhhYmV0aWNcIjtcbiAgICBjdHguZmlsbFN0eWxlID0gXCIjZjYwXCI7XG4gICAgY3R4LmZpbGxSZWN0KDEyNSwgMSwgNjIsIDIwKTtcbiAgICBjdHguZmlsbFN0eWxlID0gXCIjMDY5XCI7XG4gICAgY3R4LmZpbGxUZXh0KHR4dCwgMiwgMTUpO1xuICAgIGN0eC5maWxsU3R5bGUgPSBcInJnYmEoMTAyLCAyMDQsIDAsIDAuNylcIjtcbiAgICBjdHguZmlsbFRleHQodHh0LCA0LCAxNyk7XG4gICAgcmV0dXJuIGNhbnZhcy50b0RhdGFVUkwoKTtcbn07XG5leHBvcnRzLmdldENhbnZhc0ZpbmdlcnByaW50ID0gZ2V0Q2FudmFzRmluZ2VycHJpbnQ7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuZ2VuZXJhdGVUaGVBdWRpb0ZpbmdlclByaW50ID0gdm9pZCAwO1xuLy8gIHJlZiA9IGh0dHBzOi8vZ2l0aHViLmNvbS9yaWNrbWFjZ2lsbGlzL2F1ZGlvLWZpbmdlcnByaW50L2Jsb2IvbWFzdGVyL2F1ZGlvLWZpbmdlcnByaW50aW5nLmpzXG4vLyBAdHMtbm9jaGVja1xuZXhwb3J0cy5nZW5lcmF0ZVRoZUF1ZGlvRmluZ2VyUHJpbnQgPSAoZnVuY3Rpb24gKCkge1xuICAgIHZhciBjb250ZXh0ID0gbnVsbDtcbiAgICB2YXIgY3VycmVudFRpbWUgPSBudWxsO1xuICAgIHZhciBvc2NpbGxhdG9yID0gbnVsbDtcbiAgICB2YXIgY29tcHJlc3NvciA9IG51bGw7XG4gICAgdmFyIGZpbmdlcnByaW50ID0gbnVsbDtcbiAgICB2YXIgY2FsbGJhY2sgPSBudWxsO1xuICAgIGZ1bmN0aW9uIHJ1bihjYiwgZGVidWcgPSBmYWxzZSkge1xuICAgICAgICBjYWxsYmFjayA9IGNiO1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgc2V0dXAoKTtcbiAgICAgICAgICAgIG9zY2lsbGF0b3IuY29ubmVjdChjb21wcmVzc29yKTtcbiAgICAgICAgICAgIGNvbXByZXNzb3IuY29ubmVjdChjb250ZXh0LmRlc3RpbmF0aW9uKTtcbiAgICAgICAgICAgIG9zY2lsbGF0b3Iuc3RhcnQoMCk7XG4gICAgICAgICAgICBjb250ZXh0LnN0YXJ0UmVuZGVyaW5nKCk7XG4gICAgICAgICAgICBjb250ZXh0Lm9uY29tcGxldGUgPSBvbkNvbXBsZXRlO1xuICAgICAgICB9XG4gICAgICAgIGNhdGNoIChlKSB7XG4gICAgICAgICAgICBpZiAoZGVidWcpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIGZ1bmN0aW9uIHNldHVwKCkge1xuICAgICAgICBzZXRDb250ZXh0KCk7XG4gICAgICAgIGN1cnJlbnRUaW1lID0gY29udGV4dC5jdXJyZW50VGltZTtcbiAgICAgICAgc2V0T3NjaWxsYXRvcigpO1xuICAgICAgICBzZXRDb21wcmVzc29yKCk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIHNldENvbnRleHQoKSB7XG4gICAgICAgIHZhciBhdWRpb0NvbnRleHQgPSB3aW5kb3cuT2ZmbGluZUF1ZGlvQ29udGV4dCB8fCB3aW5kb3cud2Via2l0T2ZmbGluZUF1ZGlvQ29udGV4dDtcbiAgICAgICAgY29udGV4dCA9IG5ldyBhdWRpb0NvbnRleHQoMSwgNDQxMDAsIDQ0MTAwKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gc2V0T3NjaWxsYXRvcigpIHtcbiAgICAgICAgb3NjaWxsYXRvciA9IGNvbnRleHQuY3JlYXRlT3NjaWxsYXRvcigpO1xuICAgICAgICBvc2NpbGxhdG9yLnR5cGUgPSBcInRyaWFuZ2xlXCI7XG4gICAgICAgIG9zY2lsbGF0b3IuZnJlcXVlbmN5LnNldFZhbHVlQXRUaW1lKDEwMDAwLCBjdXJyZW50VGltZSk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIHNldENvbXByZXNzb3IoKSB7XG4gICAgICAgIGNvbXByZXNzb3IgPSBjb250ZXh0LmNyZWF0ZUR5bmFtaWNzQ29tcHJlc3NvcigpO1xuICAgICAgICBzZXRDb21wcmVzc29yVmFsdWVJZkRlZmluZWQoJ3RocmVzaG9sZCcsIC01MCk7XG4gICAgICAgIHNldENvbXByZXNzb3JWYWx1ZUlmRGVmaW5lZCgna25lZScsIDQwKTtcbiAgICAgICAgc2V0Q29tcHJlc3NvclZhbHVlSWZEZWZpbmVkKCdyYXRpbycsIDEyKTtcbiAgICAgICAgc2V0Q29tcHJlc3NvclZhbHVlSWZEZWZpbmVkKCdyZWR1Y3Rpb24nLCAtMjApO1xuICAgICAgICBzZXRDb21wcmVzc29yVmFsdWVJZkRlZmluZWQoJ2F0dGFjaycsIDApO1xuICAgICAgICBzZXRDb21wcmVzc29yVmFsdWVJZkRlZmluZWQoJ3JlbGVhc2UnLCAuMjUpO1xuICAgIH1cbiAgICBmdW5jdGlvbiBzZXRDb21wcmVzc29yVmFsdWVJZkRlZmluZWQoaXRlbSwgdmFsdWUpIHtcbiAgICAgICAgaWYgKGNvbXByZXNzb3JbaXRlbV0gIT09IHVuZGVmaW5lZCAmJiB0eXBlb2YgY29tcHJlc3NvcltpdGVtXS5zZXRWYWx1ZUF0VGltZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgY29tcHJlc3NvcltpdGVtXS5zZXRWYWx1ZUF0VGltZSh2YWx1ZSwgY29udGV4dC5jdXJyZW50VGltZSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZnVuY3Rpb24gb25Db21wbGV0ZShldmVudCkge1xuICAgICAgICBnZW5lcmF0ZUZpbmdlcnByaW50cyhldmVudCk7XG4gICAgICAgIGNvbXByZXNzb3IuZGlzY29ubmVjdCgpO1xuICAgIH1cbiAgICBmdW5jdGlvbiBnZW5lcmF0ZUZpbmdlcnByaW50cyhldmVudCkge1xuICAgICAgICB2YXIgb3V0cHV0ID0gbnVsbDtcbiAgICAgICAgZm9yICh2YXIgaSA9IDQ1MDA7IDVlMyA+IGk7IGkrKykge1xuICAgICAgICAgICAgdmFyIGNoYW5uZWxEYXRhID0gZXZlbnQucmVuZGVyZWRCdWZmZXIuZ2V0Q2hhbm5lbERhdGEoMClbaV07XG4gICAgICAgICAgICBvdXRwdXQgKz0gTWF0aC5hYnMoY2hhbm5lbERhdGEpO1xuICAgICAgICB9XG4gICAgICAgIGZpbmdlcnByaW50ID0gb3V0cHV0LnRvU3RyaW5nKCk7XG4gICAgICAgIGlmICh0eXBlb2YgY2FsbGJhY2sgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIHJldHVybiBjYWxsYmFjayhmaW5nZXJwcmludCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHtcbiAgICAgICAgcnVuOiBydW5cbiAgICB9O1xufSkoKTtcbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9fYXdhaXRlciA9ICh0aGlzICYmIHRoaXMuX19hd2FpdGVyKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XG4gICAgZnVuY3Rpb24gYWRvcHQodmFsdWUpIHsgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgUCA/IHZhbHVlIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZSh2YWx1ZSk7IH0pOyB9XG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogYWRvcHQocmVzdWx0LnZhbHVlKS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcbiAgICB9KTtcbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmdldEN1cnJlbnRCcm93c2VyRmluZ2VyUHJpbnQgPSB2b2lkIDA7XG5jb25zdCBFbmNyeXB0RGVjcnlwdF8xID0gcmVxdWlyZShcIi4vY29kZS9FbmNyeXB0RGVjcnlwdFwiKTtcbmNvbnN0IEdlbmVyYXRlQ2FudmFzRmluZ2VycHJpbnRfMSA9IHJlcXVpcmUoXCIuL2NvZGUvR2VuZXJhdGVDYW52YXNGaW5nZXJwcmludFwiKTtcbmNvbnN0IGdlbmVyYXRlVGhlQXVkaW9QcmludHNfMSA9IHJlcXVpcmUoXCIuL2NvZGUvZ2VuZXJhdGVUaGVBdWRpb1ByaW50c1wiKTtcbi8qKlxuICogVGhpcyBmdW5jdGlvbnMgd29ya2luZ1xuICogQFBhcmFtIHtudWxsfVxuICogQHJldHVybiB7UHJvbWlzZTxzdHJpbmc+fSAtIHJlc29sdmUoc3RyaW5nKVxuICovXG5jb25zdCBnZXRDdXJyZW50QnJvd3NlckZpbmdlclByaW50ID0gKCkgPT4ge1xuICAgIC8qKlxuICAgICAqIEByZXR1cm4ge1Byb21pc2V9IC0gYSBmcmVxdWVuY3kgbnVtYmVyIDEyMC4yNTY4OTY1MjNcbiAgICAgKiBAcmVmZXJlbmNlIC0gaHR0cHM6Ly9maW5nZXJwcmludGpzLmNvbS9ibG9nL2F1ZGlvLWZpbmdlcnByaW50aW5nL1xuICAgICAqL1xuICAgIGNvbnN0IGdldFRoZUF1ZGlvUHJpbnRzID0gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICBnZW5lcmF0ZVRoZUF1ZGlvUHJpbnRzXzEuZ2VuZXJhdGVUaGVBdWRpb0ZpbmdlclByaW50LnJ1bihmdW5jdGlvbiAoZmluZ2VycHJpbnQpIHtcbiAgICAgICAgICAgIHJlc29sdmUoZmluZ2VycHJpbnQpO1xuICAgICAgICB9KTtcbiAgICB9KTtcbiAgICAvKipcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7bnVsbH1cbiAgICAgKiBAcmV0dXJuIHtQcm9taXNlPHN0cmluZz59IC0gYW5kIHNoYTUxMiBoYXNoZWQgc3RyaW5nXG4gICAgICovXG4gICAgY29uc3QgRGV2aWNlUHJpbnRzID0gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICBnZXRUaGVBdWRpb1ByaW50cy50aGVuKChhdWRpb0NoYW5uZWxSZXN1bHQpID0+IF9fYXdhaXRlcih2b2lkIDAsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICAgICAgbGV0IGZpbmdlcnByaW50ID0gXCJcIjtcbiAgICAgICAgICAgIC8vIEB0b2RvIC0gbWFrZSBmaW5nZXJwcmludCB1bmlxdWUgaW4gYnJhdmUgYnJvd3NlclxuICAgICAgICAgICAgaWYgKChuYXZpZ2F0b3IuYnJhdmUgJiYgKHlpZWxkIG5hdmlnYXRvci5icmF2ZS5pc0JyYXZlKCkpIHx8IGZhbHNlKSlcbiAgICAgICAgICAgICAgICBmaW5nZXJwcmludCA9IHdpbmRvdy5idG9hKGF1ZGlvQ2hhbm5lbFJlc3VsdCkgKyAoMCwgR2VuZXJhdGVDYW52YXNGaW5nZXJwcmludF8xLmdldENhbnZhc0ZpbmdlcnByaW50KSgpO1xuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIGZpbmdlcnByaW50ID0gd2luZG93LmJ0b2EoYXVkaW9DaGFubmVsUmVzdWx0KSArICgwLCBHZW5lcmF0ZUNhbnZhc0ZpbmdlcnByaW50XzEuZ2V0Q2FudmFzRmluZ2VycHJpbnQpKCk7XG4gICAgICAgICAgICAvLyB1c2luZyBidG9hIHRvIGhhc2ggdGhlIHZhbHVlcyB0byBsb29rcyBiZXR0ZXIgcmVhZGFibGVcbiAgICAgICAgICAgIHJlc29sdmUoKDAsIEVuY3J5cHREZWNyeXB0XzEuY3lyYjUzKShmaW5nZXJwcmludCwgMCkpO1xuICAgICAgICB9KSkuY2F0Y2goKCkgPT4ge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAvLyBpZiBmYWlsZWQgd2l0aCBhdWRpbyBmaW5nZXJwcmludCB0aGVuIHJlc29sdmUgb25seSB3aXRoIGNhbnZhcyBmaW5nZXJwcmludFxuICAgICAgICAgICAgICAgIHJlc29sdmUoKDAsIEVuY3J5cHREZWNyeXB0XzEuY3lyYjUzKSgoMCwgR2VuZXJhdGVDYW52YXNGaW5nZXJwcmludF8xLmdldENhbnZhc0ZpbmdlcnByaW50KSgpKS50b1N0cmluZygpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgICAgIHJlamVjdChcIkZhaWxlZCB0byBnZW5lcmF0ZSB0aGUgZmluZ2VyIHByaW50IG9mIHRoaXMgYnJvd3NlclwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIERldmljZVByaW50cztcbn07XG5leHBvcnRzLmdldEN1cnJlbnRCcm93c2VyRmluZ2VyUHJpbnQgPSBnZXRDdXJyZW50QnJvd3NlckZpbmdlclByaW50O1xuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIiIsIi8vIHN0YXJ0dXBcbi8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuLy8gVGhpcyBlbnRyeSBtb2R1bGUgaXMgcmVmZXJlbmNlZCBieSBvdGhlciBtb2R1bGVzIHNvIGl0IGNhbid0IGJlIGlubGluZWRcbnZhciBfX3dlYnBhY2tfZXhwb3J0c19fID0gX193ZWJwYWNrX3JlcXVpcmVfXyhcIi4vc3JjL2luZGV4LnRzXCIpO1xuIiwiIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9