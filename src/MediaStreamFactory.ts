import AgoraRTC from 'agora-rtc-sdk-ng';


export class MediaStreamFactory
{
    private camDeviceIds: string[] = null;
    private micDeviceId: string = null;
    private speakerDeviceId: string = null;

    constructor()
    {
        this.updateLocalDeviceInfos();
        navigator.mediaDevices.ondevicechange = (event) => {
            this.updateLocalDeviceInfos();
        }
    }

    private updateLocalDeviceInfos()
    {
        this.camDeviceIds = [];
        this.micDeviceId = null;
        navigator.mediaDevices.enumerateDevices()
            .then((devices) => {
                devices.forEach((device) => {
                    let deviceId = device.deviceId;
                    switch (device.kind) {
                        case "videoinput":
                            this.camDeviceIds.push(deviceId)
                            break;
                        case "audioinput":
                            if (this.micDeviceId == null) {
                                this.micDeviceId = deviceId
                            }
                            break;
                        case "audiooutput":
                            if (this.speakerDeviceId == null) {
                                this.speakerDeviceId = deviceId
                            }
                            break;
                    }
                });
            })
            .catch(console.error);
    }

    public getCamDeviceIds()
    {
        return this.camDeviceIds;
    }

    public getMicDeviceId()
    {
        return this.micDeviceId;
    }

    public getSpeakerDeviceId()
    {
        return this.speakerDeviceId;
    }

    public async getCamStream(_width: number, _height: number, _frameRate: number)
    {
        let stream = null;

        try {
          const iVideoTrack = await AgoraRTC.createCameraVideoTrack();
          await iVideoTrack.setBeautyEffect(true, {
            lighteningContrastLevel: 1,
            lighteningLevel: 0.7,
            rednessLevel: 0.1,
            smoothnessLevel: 0.5
          });
            stream = new MediaStream([iVideoTrack.getMediaStreamTrack()]);
        } catch (err) {
            console.error(err);
        }
        return stream;
    }

    public async getMicStream()
    {
        let stream = null;
        let constraints = {
            audio: {
                deviceId: this.micDeviceId,
                autoGainControl: true,
                echoCancellation: true,
                noiseSuppression: true,
            },
            video: false,
        };

        try {
            stream = await navigator.mediaDevices.getUserMedia(constraints)
        } catch (err) {
            console.error(err);
        }

        return stream;
    }

    public async getDisplayStream(_width: number, _height: number, _frameRate: number)
    {
        let stream = null;
        try {
          const [source] = await AgoraRTC.getElectronScreenSources('screen');
          let config = {
            electronScreenSourceId: source.id,
          };
          const [iVideoTrack, iAudioTrack] = await AgoraRTC.createScreenVideoTrack(config, 'enable');

          console.log('captured');
          const videoTrack = iVideoTrack.getMediaStreamTrack();
          const audioTrack = iAudioTrack.getMediaStreamTrack();
          stream = new MediaStream([videoTrack, audioTrack]);
        } catch (err) {
            console.error(err);
        }

        return stream;
    }
}
