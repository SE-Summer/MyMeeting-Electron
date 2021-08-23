/**
 * Created by lycheng on 2019/8/1.
 * edited by shenwhang on 2021/8/23
 */

import CryptoJS from 'crypto-js';
import {TranscodeWorker} from './media/TranscodeWorker';
import {RecognitionResult, RecognitionStatus} from './Types';

const APPID = '2d2edf67'
const API_SECRET = 'Y2I4ZmM1Njk1NzJmN2FhNTkyYTU0ZjJh'
const API_KEY = 'bc15fd1b2d1a690acf24b4264fbe7810'
const url = 'wss://iat-api.xfyun.cn/v2/iat'
const language = 'zh_cn'
const accent = 'mandarin'

const workerBlob = new Blob(['(' + TranscodeWorker + ')()'], {type: "text/javascript"});
const transWorker = new Worker(window.URL.createObjectURL(workerBlob));

const getWebSocketUrl = () => {
    return new Promise((resolve, reject) => {
        const host = 'iat-api.xfyun.cn';
        const apiKey = API_KEY;
        const apiSecret = API_SECRET
        // @ts-ignore
        const date = new Date().toGMTString()
        const algorithm = 'hmac-sha256'
        const headers = 'host date request-line'
        const signatureOrigin = `host: ${host}\ndate: ${date}\nGET /v2/iat HTTP/1.1`
        const signatureSha = CryptoJS.HmacSHA256(signatureOrigin, apiSecret)
        const signature = CryptoJS.enc.Base64.stringify(signatureSha)
        const authorizationOrigin = `api_key="${apiKey}", algorithm="${algorithm}", headers="${headers}", signature="${signature}"`
        const authorization = btoa(authorizationOrigin)
        resolve(`${url}?authorization=${authorization}&date=${date}&host=${host}`)
    })
}

export class IatRecognizer
{
    private status: RecognitionStatus;
    private audioData: any;
    private resultTextTemp: string;
    private resultText: string;
    private webSocket: WebSocket;
    private audioContext: AudioContext;
    private scriptProcessor: ScriptProcessorNode;
    private mediaSource: MediaStreamAudioSourceNode;
    private handlerInterval;

    public onRecognizerResult: (result: RecognitionResult) => void;
    public onRecognizerStop: () => void;
    public onRecognizerError: (error) => void;
    public onWillStatusChange: (oldStatus, status) => void;
    
    constructor() {
        this.status = RecognitionStatus.null
        // 记录音频数据
        this.audioData = []
        // 记录听写结果
        this.resultText = ''
        // wpgs下的听写结果需要中间状态辅助记录
        this.resultTextTemp = ''
        transWorker.onmessage = (event) => {
            this.audioData.push(...event.data)
        }
    }
    // 修改录音听写状态
    private setStatus(status: RecognitionStatus) {
        this.onWillStatusChange && this.status !== status && this.onWillStatusChange(this.status, status)
        this.status = status
    }
    // @ts-ignore
    private setResultText({ resultText, resultTextTemp, isLast } = {}) {
        console.log(resultText, resultTextTemp, isLast)
        resultText !== undefined && (this.resultText = resultText)
        resultTextTemp !== undefined && (this.resultTextTemp = resultTextTemp)
    }
    // 连接websocket
    private connectWebSocket() {
        return getWebSocketUrl().then((url: string) => {
            let iatWS
            if ('WebSocket' in window) {
                iatWS = new WebSocket(url)
            } else if ('MozWebSocket' in window) {
                // @ts-ignore
                iatWS = new MozWebSocket(url)
            } else {
                this.onRecognizerError(new Error('WebSocket not supported'))
                return
            }
            this.webSocket = iatWS
            this.setStatus(RecognitionStatus.initialized)
            iatWS.onopen = e => {
                this.setStatus(RecognitionStatus.processing)
                // 重新开始录音
                setTimeout(() => {
                    this.webSocketSend()
                }, 500)
            }
            iatWS.onmessage = e => {
                this.result(e.data)
            }
            iatWS.onerror = e => {
                this.recorderStop()
            }
            iatWS.onclose = e => {
                this.recorderStop()
                this.onRecognizerStop()
                console.log('closed')
            }
        })
    }
    // 初始化浏览器录音
    private recorderInit() {
        navigator.getUserMedia =
            navigator.getUserMedia ||
            // @ts-ignore
            navigator.webkitGetUserMedia ||
            // @ts-ignore
            navigator.mozGetUserMedia ||
            // @ts-ignore
            navigator.msGetUserMedia

        // 创建音频环境
        try {
            // @ts-ignore
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)()
            this.audioContext.resume()
            if (!this.audioContext) {
                this.onRecognizerError(new Error('WebAudioApi not supported'))
                return
            }
        } catch (e) {
            if (!this.audioContext) {
                this.onRecognizerError(new Error('WebAudioApi not supported'))
                return
            }
        }

        // 获取浏览器录音权限
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices
                .getUserMedia({
                    audio: true,
                    video: false,
                })
                .then(stream => {
                    getMediaSuccess(stream)
                })
                .catch(e => {
                    getMediaFail(e)
                })
        } else if (navigator.getUserMedia) {
            navigator.getUserMedia(
                {
                    audio: true,
                    video: false,
                },
                stream => {
                    getMediaSuccess(stream)
                },
                function(e) {
                    getMediaFail(e)
                }
            )
        } else {
            if (navigator.userAgent.toLowerCase().match(/chrome/) && location.origin.indexOf('https://') < 0) {
                this.onRecognizerError(new Error('Cannot get audio due to security issues'))
            } else {
                this.onRecognizerError(new Error('Cannot get audio due to security issues'))
            }
            this.audioContext && this.audioContext.close()
            return
        }
        // 获取浏览器录音权限成功的回调
        const getMediaSuccess = stream => {
            // 创建一个用于通过JavaScript直接处理音频
            this.scriptProcessor = this.audioContext.createScriptProcessor(0, 1, 1)
            this.scriptProcessor.onaudioprocess = e => {
                // 去处理音频数据
                if (this.status === RecognitionStatus.processing) {
                    transWorker.postMessage(e.inputBuffer.getChannelData(0))
                }
            }
            // 创建一个新的MediaStreamAudioSourceNode 对象，使来自MediaStream的音频可以被播放和操作
            this.mediaSource = this.audioContext.createMediaStreamSource(stream)
            // 连接
            this.mediaSource.connect(this.scriptProcessor)
            this.scriptProcessor.connect(this.audioContext.destination)
            this.connectWebSocket()
        }

        const getMediaFail = (e) => {
            this.audioContext && this.audioContext.close()
            this.audioContext = undefined
            // 关闭websocket
            if (this.webSocket && this.webSocket.readyState === 1) {
                this.handlerInterval && clearInterval(this.handlerInterval)
                this.webSocket.close()
                this.onRecognizerError(new Error('Fail to get audio'))
            } else {
                this.onRecognizerError(e)
            }
        }
    }
    recorderStart() {
        if (!this.audioContext) {
            this.recorderInit()
        } else {
            this.audioContext.resume()
            this.connectWebSocket()
        }
    }
    // 暂停录音
    recorderStop() {
        // safari下suspend后再次resume录音内容将是空白，设置safari下不做suspend
        if (!(/Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent))){
            this.audioContext && this.audioContext.suspend()
        }
        this.setStatus(RecognitionStatus.ended)
    }
    // 处理音频数据
    // transAudioData(audioData) {
    //   audioData = transAudioData.transaction(audioData)
    //   this.audioData.push(...audioData)
    // }
    // 对处理后的音频数据进行base64编码，
    toBase64(buffer) {
        let binary = ''
        const bytes = new Uint8Array(buffer)
        const len = bytes.byteLength
        for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i])
        }
        return window.btoa(binary)
    }
    // 向webSocket发送数据
    webSocketSend() {
        if (this.webSocket.readyState !== 1) {
            return
        }
        let audioData = this.audioData.splice(0, 1280)
        const params = {
            common: {
                app_id: APPID,
            },
            business: {
                language, //小语种可在控制台--语音听写（流式）--方言/语种处添加试用
                domain: 'iat',
                accent, //中文方言可在控制台--语音听写（流式）--方言/语种处添加试用
                vad_eos: 5000,
                dwa: 'wpgs', //为使该功能生效，需到控制台开通动态修正功能（该功能免费）
            },
            data: {
                status: 0,
                format: 'audio/L16;rate=16000',
                encoding: 'raw',
                audio: this.toBase64(audioData),
            },
        }
        this.webSocket.send(JSON.stringify(params))
        this.handlerInterval = setInterval(() => {
            // websocket未连接
            if (this.webSocket.readyState !== 1) {
                console.log('clearinterval 1')
                clearInterval(this.handlerInterval)
                this.audioData = []
                return
            }
            if (this.audioData.length === 0) {
                if (this.status === RecognitionStatus.ended) {
                    this.webSocket.send(
                        JSON.stringify({
                            data: {
                                status: 2,
                                format: 'audio/L16;rate=16000',
                                encoding: 'raw',
                                audio: '',
                            },
                        })
                    )
                    this.audioData = []
                    console.log('clearinterval 2')
                    clearInterval(this.handlerInterval)
                }
                return false
            }
            audioData = this.audioData.splice(0, 1280)
            // 中间帧
            this.webSocket.send(
                JSON.stringify({
                    data: {
                        status: 1,
                        format: 'audio/L16;rate=16000',
                        encoding: 'raw',
                        audio: this.toBase64(audioData),
                    },
                })
            )
        }, 40)
    }
    result(resultData)
    {
        // 识别结束
        const jsonData = JSON.parse(resultData)
        if (jsonData.data && jsonData.data.result) {
            const data = jsonData.data.result
            let str = ''
            const ws = data.ws
            for (let i = 0; i < ws.length; i++) {
                str = str + ws[i].cw[0].w
            }
            const isLast: boolean = jsonData.data.result.ls
            // 开启wpgs会有此字段(前提：在控制台开通动态修正功能)
            // 取值为 "apd"时表示该片结果是追加到前面的最终结果；取值为"rpl" 时表示替换前面的部分结果，替换范围为rg字段
            if (data.pgs) {
                if (data.pgs === 'apd') {
                    // 将resultTextTemp同步给resultText
                    // @ts-ignore
                    this.setResultText({
                        resultText: this.resultTextTemp,
                        isLast
                    })
                }
                // 将结果存储在resultTextTemp中
                // @ts-ignore
                this.setResultText({
                    resultTextTemp: this.resultText + str,
                    isLast
                })
            } else {
                // @ts-ignore
                this.setResultText({
                    resultText: this.resultText + str,
                    isLast
                })
            }
        }
        console.log(jsonData.code, jsonData.data.status)
        if (jsonData.code === 0 && jsonData.data.status === 2) {
            this.webSocket.close()
        }
        if (jsonData.code !== 0) {
            this.webSocket.close()
            this.onRecognizerError(new Error(`Recognition engine error, error code: ${jsonData.code}`))
        }
    }

    public start()
    {
        this.recorderStart()
        // @ts-ignore
        this.setResultText({ resultText: '', resultTextTemp: '' })
    }

    public stop()
    {
        this.recorderStop()
    }
}
