import {IatRecognizer} from "./IatRecognizer"
import {SpeechText} from "./Types";
// @ts-ignore
import moment from "moment";
import * as events from "events";


const me = '我';

export class SpeechRecognition
{
    private recognizer;
    // private recognizerEventEmitter = new NativeEventEmitter(Recognizer);
    // private working: boolean = null;
    // private sentenceEnded: boolean = null;
    // private currentSpeechTimestamp: moment = null;
    // private speechCallbacks: Map<string, (text: string) => void> = null;
    // private speechTextStorage: SpeechText[] = null;
    // fromPeerId ==> SpeechText
    // private speakingSpeechTexts: Map<string, SpeechText> = null;

    constructor(sendSpeechText: (speechText: SpeechText) => void)
    {
        // @ts-ignore
        this.recognizer = new IatRecognizer()
        this.recognizer.onRecognizerResult = (text) => {
            console.log(text);
        }
        this.recognizer.onRecognizerStop = () => {
            this.recognizer.start();
        }
        this.recognizer.start();
        // this.speechCallbacks = new Map<string, (text: string) => void>();
        // this.speechTextStorage = [];
        // this.speakingSpeechTexts = new Map<string, SpeechText>();
        // this.recognizerEventEmitter.addListener('onRecognizerResult', this.onRecognizerResult);
        // this.recognizerEventEmitter.addListener('onRecognizerError', (err) => {console.error(err)});
        // this.working = false;
        // this.sentenceEnded = true;
    }

    public registerSpeechListener(key: string, recognizedCallback: (speechTexts: SpeechText[]) => void)
    {
        // this.speechCallbacks.set(key, recognizedCallback);
    }

    public deleteSpeechListener(key: string)
    {
        // this.speechCallbacks.delete(key);
    }

    private onRecognizerResult = (recognized) => {
        console.log(recognized);
        // const pendingText = recognized.text.trim();
        // if (pendingText.length === 0)
        //     return;
        //
        // console.log(`[Recognizer]  Recognized speech: ${pendingText}`);
        //
        // const updateTime = moment();
        // if (this.sentenceEnded) {
        //     this.currentSpeechTimestamp = updateTime;
        // }
        // const speechText: SpeechText = {
        //     fromPeerId: config_key.userId.toString(),
        //     displayName: MeetingVariable.myName,
        //     fromMyself: true,
        //     newSentence: this.sentenceEnded,
        //     sentenceEnded: recognized.isLast,
        //     text: recognized.result,
        //     startTime: this.currentSpeechTimestamp,
        //     updateTime: updateTime,
        // }
        // this.sentenceEnded = recognized.isLast;
        //
        // SpeechRecognition.sendSpeechText(speechText);
        // this.newSpeechText(speechText);
        //
        // if (recognized.isLast) {
        //     console.log('[Recognizer]  Sentence ended');
        //     if (this.working) {
        //         Recognizer.start();
        //     }
        // }
    }

    private sendSpeechText(text: SpeechText)
    {
        // MeetingVariable.mediaService.sendSpeechText(text);
    }

    public recvPeerSpeech(speechText: SpeechText)
    {
        // if (speechText.fromPeerId !== config_key.userId.toString()) {
        //     speechText.fromMyself = false;
        //     this.newSpeechText(speechText);
        // }
    }

    private newSpeechText(speechText: SpeechText)
    {
        // if (speechText.newSentence) {
        //     if (this.speakingSpeechTexts.has(speechText.fromPeerId)) {
        //         const previous = this.speakingSpeechTexts.get(speechText.fromPeerId);
        //         this.speechTextStorage.push(previous);
        //     }
        // }
        // this.speakingSpeechTexts.set(speechText.fromPeerId, speechText);
        // if (speechText.sentenceEnded) {
        //     setTimeout(() => {
        //         if (this.speakingSpeechTexts.has(speechText.fromPeerId)
        //             && this.speakingSpeechTexts.get(speechText.fromPeerId).startTime === speechText.startTime) {
        //             const previous = this.speakingSpeechTexts.get(speechText.fromPeerId);
        //             this.speechTextStorage.push(previous);
        //             this.speakingSpeechTexts.delete(speechText.fromPeerId);
        //
        //             const displayText = this.generateDisplayText();
        //             this.speechCallbacks.forEach((callback) => {
        //                 callback(displayText);
        //             });
        //         }
        //     }, 2000);
        // }
        //
        // const displayText = this.generateDisplayText();
        // this.speechCallbacks.forEach((callback) => {
        //     callback(displayText);
        // });
    }

    private generateDisplayText()
    {
        // let displayText = '';
        // const currentTime = moment();
        // this.speakingSpeechTexts.forEach((speechText) => {
        //     if (currentTime.diff(speechText.updateTime) <= 6000) {
        //         displayText += `${speechText.fromMyself ? me : speechText.displayName}: ${speechText.text}\n`;
        //     }
        // });
        // console.log('[Recognizer]  Subtitles updated:\n' + displayText);
        // return displayText;
    }

    public exportMeme()
    {
        // const speechTexts: SpeechText[] = [];
        // let meme = '';
        // this.speechTextStorage.forEach((speechText) => {
        //     speechTexts.push(speechText);
        // });
        // this.speakingSpeechTexts.forEach((speechText) => {
        //     speechTexts.push(speechText);
        // });
        // speechTexts.sort((a, b) => {
        //     return a.startTime.diff(b.startTime);
        // });
        // speechTexts.forEach((speechText) => {
        //     meme += `${speechText.startTime.format('hh:mm:ss a')}  ${speechText.displayName}: ${speechText.text}\n`;
        // });
        // return meme;
    }

    public start()
    {
        // this.working = true;
        console.log('try to start');
        this.recognizer.start();
        // console.log('[Recognizer]  Started');
    }

    public stop()
    {
        // this.working = false;
        // Recognizer.stop();
        // console.log('[Recognizer]  Stopped');
    }
}
