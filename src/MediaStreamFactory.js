"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.MediaStreamFactory = void 0;
var agora_rtc_sdk_ng_1 = require("agora-rtc-sdk-ng");
var MediaStreamFactory = /** @class */ (function () {
    function MediaStreamFactory() {
        var _this = this;
        this.camDeviceIds = null;
        this.micDeviceId = null;
        this.speakerDeviceId = null;
        this.updateLocalDeviceInfos();
        navigator.mediaDevices.ondevicechange = function (event) {
            _this.updateLocalDeviceInfos();
        };
    }
    MediaStreamFactory.prototype.updateLocalDeviceInfos = function () {
        var _this = this;
        this.camDeviceIds = [];
        this.micDeviceId = null;
        navigator.mediaDevices.enumerateDevices()
            .then(function (devices) {
            devices.forEach(function (device) {
                var deviceId = device.deviceId;
                switch (device.kind) {
                    case "videoinput":
                        _this.camDeviceIds.push(deviceId);
                        break;
                    case "audioinput":
                        if (_this.micDeviceId == null) {
                            _this.micDeviceId = deviceId;
                        }
                        break;
                    case "audiooutput":
                        if (_this.speakerDeviceId == null) {
                            _this.speakerDeviceId = deviceId;
                        }
                        break;
                }
            });
        })["catch"](console.error);
    };
    MediaStreamFactory.prototype.getCamDeviceIds = function () {
        return this.camDeviceIds;
    };
    MediaStreamFactory.prototype.getMicDeviceId = function () {
        return this.micDeviceId;
    };
    MediaStreamFactory.prototype.getSpeakerDeviceId = function () {
        return this.speakerDeviceId;
    };
    MediaStreamFactory.prototype.getCamStream = function (_width, _height, _frameRate) {
        return __awaiter(this, void 0, void 0, function () {
            var stream, iVideoTrack, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        stream = null;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, agora_rtc_sdk_ng_1["default"].createCameraVideoTrack()];
                    case 2:
                        iVideoTrack = _a.sent();
                        return [4 /*yield*/, iVideoTrack.setBeautyEffect(true, {
                                lighteningContrastLevel: 1,
                                lighteningLevel: 0.7,
                                rednessLevel: 0.1,
                                smoothnessLevel: 0.5
                            })];
                    case 3:
                        _a.sent();
                        stream = new MediaStream([iVideoTrack.getMediaStreamTrack()]);
                        return [3 /*break*/, 5];
                    case 4:
                        err_1 = _a.sent();
                        console.error(err_1);
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/, stream];
                }
            });
        });
    };
    MediaStreamFactory.prototype.getMicStream = function () {
        return __awaiter(this, void 0, void 0, function () {
            var stream, constraints, err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        stream = null;
                        constraints = {
                            audio: {
                                deviceId: this.micDeviceId,
                                autoGainControl: true,
                                echoCancellation: true,
                                noiseSuppression: true
                            },
                            video: false
                        };
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, navigator.mediaDevices.getUserMedia(constraints)];
                    case 2:
                        stream = _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        err_2 = _a.sent();
                        console.error(err_2);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/, stream];
                }
            });
        });
    };
    MediaStreamFactory.prototype.getDisplayStream = function (_width, _height, _frameRate) {
        return __awaiter(this, void 0, void 0, function () {
            var stream, source, config, _a, iVideoTrack, iAudioTrack, videoTrack, audioTrack, err_3;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        stream = null;
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, agora_rtc_sdk_ng_1["default"].getElectronScreenSources('screen')];
                    case 2:
                        source = (_b.sent())[0];
                        config = {
                            electronScreenSourceId: source.id
                        };
                        return [4 /*yield*/, agora_rtc_sdk_ng_1["default"].createScreenVideoTrack(config, 'enable')];
                    case 3:
                        _a = _b.sent(), iVideoTrack = _a[0], iAudioTrack = _a[1];
                        console.log('captured');
                        videoTrack = iVideoTrack.getMediaStreamTrack();
                        audioTrack = iAudioTrack.getMediaStreamTrack();
                        stream = new MediaStream([videoTrack, audioTrack]);
                        return [3 /*break*/, 5];
                    case 4:
                        err_3 = _b.sent();
                        console.error(err_3);
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/, stream];
                }
            });
        });
    };
    return MediaStreamFactory;
}());
exports.MediaStreamFactory = MediaStreamFactory;
