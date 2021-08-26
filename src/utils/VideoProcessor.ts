import * as bodyPix from '@tensorflow-models/body-pix';
// @ts-ignore
import MyWorker from 'comlink-loader!./media/BodyPixWorker';
import {BackgroundProcessType} from "@/utils/Types";

const defaultWidth = 640;
const defaultHeight = 360;
const defaultFramerate = 30;
const bodyPixWorker = new MyWorker();

export class VideoProcessor
{
    private width: number = null;
    private height: number = null;
    private working: boolean = null;
    private updateInterval: number = null;
    private intervalHandler = null;
    private backgroundImage: HTMLImageElement = null;
    private video: HTMLVideoElement = null;
    private inputStream: MediaStream = null;
    private inputCanvas: HTMLCanvasElement = null;
    private outputCanvas: HTMLCanvasElement = null;
    private inputCtx: CanvasRenderingContext2D = null;
    private outputCtx: CanvasRenderingContext2D = null;

    constructor()
    {
        this.width = defaultWidth;
        this.height = defaultHeight;
        this.working = false;
        this.updateInterval = 1000/defaultFramerate;
        this.backgroundImage = new Image();
        this.backgroundImage.src = 'http://122.112.175.61:4446/static/images/bg_1.jpg';

        this.video = document.createElement('video');
        this.video.autoplay = true;
        this.inputCanvas = document.createElement('canvas');
        this.outputCanvas = document.createElement('canvas');
        this.inputCtx = this.inputCanvas.getContext('2d');
        this.outputCtx = this.outputCanvas.getContext('2d');
        this.inputCanvas.width = this.outputCanvas.width = this.video.width = this.width;
        this.inputCanvas.height = this.outputCanvas.height = this.video.height = this.height;
    }

    public setBackground(imageURL: string)
    {
        this.backgroundImage.src = imageURL;
    }

    public process(mediaStream: MediaStream, backgroundOption: BackgroundProcessType, enableBeautify: boolean)
    {
        this.inputStream = mediaStream;
        this.video.srcObject = mediaStream;
        this.start(backgroundOption, enableBeautify);
        // @ts-ignore
        return this.outputCanvas.captureStream();
    }

    private start(backgroundOption: BackgroundProcessType, enableBeautify: boolean)
    {
        this.working = true;
        this.replaceBackground()
    }

    public stop()
    {
        if (this.working) {
            cancelAnimationFrame(this.intervalHandler);
            const tracks = this.inputStream.getTracks();
            tracks.forEach((track) => {
                track.stop();
            });
            this.working = false;
        }
    }

    private replaceBackground = async () => {
        this.inputCtx.drawImage(this.video, 0, 0, this.width, this.height);
        const frame = this.inputCtx.getImageData(0, 0, this.width, this.height);
        const mask = await bodyPixWorker.getMask(frame);

        const opacity = 0.7;
        const flipHorizontal = false;
        const maskBlurAmount = 0;

        bodyPix.drawMask(
            this.outputCanvas, this.inputCanvas, mask, opacity, maskBlurAmount,
            flipHorizontal);
        // this.outputCtx.putImageData(mask, 0, 0)
        // this.outputCtx.globalCompositeOperation = 'source-in'
        // this.outputCtx.drawImage(this.backgroundImage, 0, 0, this.width, this.height)
        // this.outputCtx.globalCompositeOperation = 'destination-over'
        // this.outputCtx.drawImage(this.video, 0, 0, this.width, this.height)
        // this.outputCtx.globalCompositeOperation = 'source-over'
        this.intervalHandler = requestAnimationFrame(this.replaceBackground);
    }
}
