import * as mediasoupClient from "mediasoup-client";
import * as types from "../utils/Types";
import {
    meetingURL,
    serviceConfig,
    SignalMethod,
    SignalType,
    socketConnectionOptions,
    TransportType
} from "../ServiceConfig";
import {SignalingService} from "./SignalingService";
import {PeerMedia} from "../utils/media/PeerMedia";
import {timeoutCallback} from "../utils/media/MediaUtils";
import * as events from "events"

const moment = require("moment");

export class MediaService
{
    roomToken = null;
    userToken = null;
    meetingURL = null;
    displayName = null;
    deviceName = null;
    avatar = null;

    signaling = null;
    device = null;
    eventEmitter = null;

    sendTransport = null;
    recvTransport = null;

    // track.id ==> MediaStreamTrack
    sendingTracks = null;
    // track.id ==> producer
    producers = null;
    peerMedia = null;

    hostPeerId = null;

    sendTransportOpt = null;
    joined = null;
    permissionUpdated = null;
    allowed = null;

    updatePeerCallbacks = null;
    newMessageCallbacks = null;
    meetingEndCallbacks = null;

    constructor()
    {
        try {
            this.device = new mediasoupClient.Device();

            this.sendingTracks = new Map();
            this.producers = new Map();
            this.peerMedia = new PeerMedia();

            this.eventEmitter = new events.EventEmitter();

            this.joined = false;
            this.permissionUpdated = false;
            this.allowed = false;

            this.updatePeerCallbacks = [];
            this.newMessageCallbacks = [];

        } catch (err) {
            console.error('[Error]  Fail to construct MediaService instance', err);
        }
    }

    registerPeerUpdateListener(updatePeerCallback)
    {
        this.updatePeerCallbacks.push(updatePeerCallback);
    }

    registerNewMessageListener(newMessageCallback)
    {
        this.newMessageCallbacks.push(newMessageCallback);
    }

    // eslint-disable-next-line no-unused-vars
    registerMeetingEndListener(meetingEndCallback)
    {
        // this.
    }

    getPeerDetails()
    {
        return this.peerMedia.getPeerDetails();
    }

    getPeerDetailsByPeerId(peerId)
    {
        return this.peerMedia.getPeerDetailsByPeerId(peerId);
    }


    getHostPeerId()
    {
        return this.hostPeerId;
    }

    waitForAllowed()
    {
        return new Promise((resolve, reject) => {
            console.log('[Log]  Waiting for server to allow the connection...');
            let returned = false;
            this.eventEmitter.once('permissionUpdated', timeoutCallback(() => {
                if (returned)
                    return;

                returned = true;
                if (this.allowed) {
                    console.log('[Log]  Server allowed the connection')
                    resolve();
                } else {
                    reject('[Error]  Server reject the connection');
                }
            }, serviceConfig.mediaTimeout));

            if (!returned && this.permissionUpdated) {
                returned = true;
                if (this.allowed) {
                    console.log('[Log]  Server allowed the connection')
                    resolve();
                } else {
                    reject('[Error]  Server reject the connection');
                }
            }
        })
    }


    // steps for connection:
    // create a signaling client which has a socketio inside, then try to connect to server
    // wait until the connection is built
    // send request to get routerRtpCapabilities from server
    // load the routerRtpCapabilities into device
    //
    async joinMeeting(roomToken, userToken, displayName, deviceName, avatar)
    {
        if (this.joined) {
            console.warn('[Warning]  Already joined a meeting');
            return Promise.reject('Already joined a meeting');
        }

        this.roomToken = roomToken;
        this.userToken = userToken;
        this.meetingURL = meetingURL(roomToken, userToken);
        this.displayName = displayName;
        this.deviceName = deviceName;
        this.avatar = avatar;
        console.log('[Log]  Try to join meeting with roomToken = ' + roomToken);

        try {
            this.signaling = new SignalingService(this.meetingURL, socketConnectionOptions, this.onSignalingDisconnect.bind(this));
            this.registerSignalingListeners();
            await this.signaling.waitForConnection();
            await this.waitForAllowed();

        } catch (err) {
            console.error('[Error]  Fail to connect socket or the server rejected', err);
            await this.signaling.disconnect();
            return Promise.reject('Fail to connect socket or the server rejected');
        }

        try {
            const rtpCapabilities = await this.signaling.sendRequest(SignalMethod.getRouterRtpCapabilities);
            console.log('[Log]  Router RTP Capabilities received');

            if (!this.device.loaded) {
                await this.device.load({routerRtpCapabilities: rtpCapabilities});
            }

            await this.createSendTransport();
            await this.createRecvTransport();

        } catch (err) {
            console.error('[Error]  Fail to prepare device and transports', err);
            await this.leaveMeeting();
            return Promise.reject('Fail to prepare device and transports');
        }

        try {
            const { host, peerInfos } = await this.signaling.sendRequest(SignalMethod.join, {
            // const peerInfos = await this.signaling.sendRequest(SignalMethod.join, {
                displayName: this.displayName,
                avatar: this.avatar,
                joined: this.joined,
                device: this.deviceName,
                rtpCapabilities: this.device.rtpCapabilities,
            })
            // } as types.JoinRequest) as types.PeerInfo[];

            this.hostPeerId = host;

            for (const info of peerInfos) {
                this.peerMedia.addPeerInfo(info);
            }

            this.updatePeerCallbacks.forEach((callback) => {
                callback();
            });

            this.joined = true;

        } catch (err) {
            console.error('[Error]  Fail to join the meeting', err);
            await this.leaveMeeting();
            return Promise.reject('Fail to join the meeting');
        }
    }

    async onSignalingDisconnect()
    {
        if (this.joined) {
            try {
                await this.signaling.waitForReconnection();
                await this.restartIce();
            } catch (err) {
                await this.reenter();
            }
        }
    }

    async restartIce()
    {
        console.log('[Log]  Trying to restartIce...');

        try {
            const sendParam = await this.signaling.sendRequest(SignalMethod.restartIce, { transportId: this.sendTransport.id });
            await this.sendTransport.restartIce({ iceParameters: sendParam.iceParameters });

            const recvParam = await this.signaling.sendRequest(SignalMethod.restartIce, { transportId: this.recvTransport.id });
            await this.recvTransport.restartIce({ iceParameters: recvParam.iceParameters });

            console.log('[Log]  Ice restarted');
        } catch (err) {
            console.error('[Error]  Fail to restart Ice', err);
        }
    }

    async reenter()
    {
        console.log('[Log]  Trying to reenter the meeting...');
        await this.leaveMeeting(true);
        await this.joinMeeting(this.roomToken, this.userToken, this.displayName, this.deviceName, this.avatar);

        let tracks = [];
        this.sendingTracks.forEach((track) => {
            tracks.push(track);
        })
        await this.sendMediaStream(new MediaStream(tracks));
        console.log('[Log]  Reentered');
    }


    async sendMediaStream(stream)
    {
        try {
            const tracks = stream.getTracks();
            let videoTrackCount = 0;
            let audioTrackCount = 0;
            for (const track of tracks) {
                let source = null;
                let params = null;
                if (track.kind === 'video') {
                    source = `Video_from_${this.userToken}_track${++videoTrackCount}`;
                    params = {
                        track,
                        appData: { source },
                        codec: this.device.rtpCapabilities.codecs.find(codec => codec.mimeType === 'video/H264')
                    }
                } else {
                    source = `Audio_from_${this.userToken}_track${++audioTrackCount}`;
                    params = {
                        track,
                        appData: { source },
                    }
                }

                const producer = await this.sendTransport.produce(params);

                producer.on('transportclose', () => {
                    console.log(`[Producer event]  ${source}_transport_close`);
                    if (!producer.closed) {
                        producer.close();
                    }
                    this.producers.delete(track.id);
                });

                producer.on('trackended', () => {
                    console.log(`[Producer event]  ${source}_track_ended`);
                    this.signaling.sendRequest(SignalMethod.closeProducer, {producerId: producer.id});
                    if (!producer.closed) {
                        producer.close();
                    }
                    this.producers.delete(track.id);
                });

                this.producers.set(track.id, producer);

                console.log(`[Log]  Producing ${source}`);
                this.sendingTracks.set(track.id, track);
            }
        } catch (err) {
            console.error('[Error]  Fail to send MediaStream', err);
            return Promise.reject('Fail to send MediaStream');
        }
    }

    // if _toPeerId == null, it means broadcast to everyone in the meetings
    async sendText(_toPeerId, _text)
    {
        try {
            const sendText = {
                toPeerId: _toPeerId,
                text: _text,
                timestamp: moment(),
            };

            await this.signaling.sendRequest(SignalMethod.sendText, sendText);
            console.log('[Log]  Text sent');
        } catch (err) {
            console.error('[Error]  Fail to send text', err);
            return Promise.reject('Fail to send text');
        }
    }

    async sendFile(_fileURL)
    {
        try {
            const sendFile = {
                fileURL: _fileURL,
                timestamp: moment,
            };

            await this.signaling.sendRequest(SignalMethod.sendFile, sendFile);
            console.log('[Log]  New file notice sent');
        } catch (err) {
            console.error('[Error]  Fail to send new file notice', err);
            return Promise.reject('Fail to send new file notice');
        }
    }

    async leaveMeeting(reenter = false)
    {
        this.joined = false;
        this.permissionUpdated = false;
        this.allowed = false;

        if (this.signaling && this.signaling.connected()) {
            try {
                await this.signaling.sendRequest(SignalMethod.close);
            } catch (err) {
                console.error('[Error]  Fail when sending close request', err);
                return Promise.reject('Fail when sending close request');
            }
        }

        if (this.producers)
            this.producers.clear();

        if (this.peerMedia)
            this.peerMedia.clear();

        this.sendTransportOpt = null;
        this.hostPeerId = null;
        this.device = new mediasoupClient.Device();

        if (this.sendTransport && !this.sendTransport.closed) {
            this.sendTransport.close();
        }
        this.sendTransport = null;

        if (this.recvTransport && !this.recvTransport.closed) {
            this.recvTransport.close();
        }
        this.recvTransport = null;

        if (this.sendingTracks && !reenter) {
            this.sendingTracks.clear();
        }
        this.signaling.disconnect();
        this.signaling = null;
    }

    async closeTrack(track)
    {
        const producer = this.producers.get(track.id);
        console.log(`[Log]  Try to close track track.id = ${track.id}`);

        try {
            await this.signaling.sendRequest(SignalMethod.closeProducer, {producerId: producer.id});
        } catch (err) {
            console.error('[Error]  Fail when sending closeProducer request', err);
            return Promise.reject('Fail when sending closeProducer request');
        }

        if (!this.producers.get(track.id).closed) {
            this.producers.get(track.id).close();
        }
        this.producers.delete(track.id);
        this.sendingTracks.delete(track.id);

        console.log(`[Log]  Track closed`);
    }

    // if peerId is not passed, (or = null), it means mute all peers in the room
    // return Promise.reject('Fail to mute peer') if you are not a host or an error occurs
    async mutePeer(peerId = null)
    {
        try {
            await this.signaling.sendRequest(SignalMethod.mute, { mutePeerId: peerId });
        } catch (err) {
            console.error('[Error]  Fail to mute peer peerId = ' + peerId, err);
            return Promise.reject('Fail to mute peer');
        }
    }

    async createSendTransport()
    {
        try {
            this.sendTransportOpt = await this.signaling.sendRequest(SignalMethod.createTransport, {
                transportType: TransportType.producer,
                sctpCapabilities: this.device.sctpCapabilities,
            })
        } catch (err) {
            console.error('[Error]  Fail when sending createTransport (send) request', err);
            return Promise.reject('Fail when sending createTransport (send) request');
        }

        console.log('[Signaling]  sendTransportOptions received');

        this.sendTransport = this.device.createSendTransport(this.sendTransportOpt);

        this.sendTransport.on('connect', async ({dtlsParameters}, done, errBack) => {
            console.log('[Transport event]  event: connect, handled by sendTransport');
            try {
                await this.signaling.sendRequest(
                    SignalMethod.connectTransport, {
                        transportId: this.sendTransport.id,
                        dtlsParameters,
                    });
                done();
            } catch (err) {
                errBack(err);
            }
        });

        this.sendTransport.on('produce', async ({ kind, rtpParameters, appData }, done, errBack) => {
            console.log('[Transport event]  event: produce, handled by sendTransport');
            try {
                // producerId
                const {producerId} = await this.signaling.sendRequest(
                    SignalMethod.produce, {
                        transportId : this.sendTransport.id,
                        kind,
                        rtpParameters,
                        appData
                    });
                done({id: producerId});
            } catch (err) {
                errBack(err);
            }
        });
    }

    async createRecvTransport()
    {
        try {
            this.recvTransport = this.device.createRecvTransport(
                await this.signaling.sendRequest(SignalMethod.createTransport, {
                    transportType: TransportType.consumer,
                    sctpCapabilities: this.device.sctpCapabilities,
                })
            );
        } catch (err) {
            console.error('[Error]  Fail when sending createTransport (recv) request', err);
            return Promise.reject('Fail when sending createTransport (recv) request');
        }

        this.recvTransport.on('connect', async ({dtlsParameters}, done, errBack) => {
            console.log('[Transport event]  event: connect, handled by recvTransport');
            try {
                await this.signaling.sendRequest(
                    SignalMethod.connectTransport, {
                        transportId: this.recvTransport.id,
                        dtlsParameters,
                    });
                done();
            } catch (err) {
                errBack(err);
            }
        });
    }

    registerSignalingListeners()
    {
        this.signaling.registerListener(SignalType.notify, SignalMethod.allowed, ({ allowed }) => {
            console.log(`[Signaling]  Handling allowed notification with allowed = ${allowed} ...`);
            this.permissionUpdated = true;
            this.allowed = allowed;
            this.eventEmitter.emit('permissionUpdated');
        });

        this.signaling.registerListener(SignalType.notify, SignalMethod.newPeer, async (data) => {
            console.log('[Signaling]  Handling newPeer notification...');
            this.peerMedia.addPeerInfo(data);
            console.log(`[Signaling]  Add peerId = ${data.id}`);

            this.updatePeerCallbacks.forEach((callback) => {
                callback();
            });
        });

        this.signaling.registerListener(SignalType.notify, SignalMethod.newConsumer, async (data) => {
            console.log('[Signaling]  Handling newConsumer notification...');
            const consumer = await this.recvTransport.consume({
                id            : data.consumerId,
                producerId    : data.producerId,
                kind          : data.kind,
                rtpParameters : data.rtpParameters
            });
            console.log('[Signaling]  Creating consumer kind = ' + data.kind);
            const { track } = consumer;
            console.log('[Consumer]  Received track', track);
            console.log(`[Signaling]  Add trackId = ${track.id} sent from peerId = ${data.producerPeerId}`);
            this.peerMedia.addConsumerAndTrack(data.producerPeerId, consumer, track);

            this.updatePeerCallbacks.forEach((callback) => {
                callback();
            });
        });

        this.signaling.registerListener(SignalType.notify, SignalMethod.consumerClosed, ({ consumerId }) => {
            console.log('[Signaling]  Handling consumerClosed notification...');
            console.log(`[Signaling]  Delete consumer id = ${consumerId}`);
            this.peerMedia.deleteConsumerAndTrack(consumerId);

            this.updatePeerCallbacks.forEach((callback) => {
                callback();
            });
        });

        this.signaling.registerListener(SignalType.notify, SignalMethod.peerClosed, ({ peerId }) => {
            console.log('[Signaling]  Handling peerClosed notification...');
            console.log(`[Signaling]  Delete peer id = ${peerId}`);
            this.peerMedia.deletePeer(peerId);

            this.updatePeerCallbacks.forEach((callback) => {
                callback();
            });
        });

        this.signaling.registerListener(SignalType.notify, SignalMethod.newText, (recvText) => {
            console.log('[Signaling]  Handling newText notification...');
            console.log(`[Signaling]  Text (${recvText.text}) received from peer (peerId: ${recvText.fromPeerId})`);
            const message = {
                type: types.MessageType.text,
                broadcast: recvText.broadcast,
                fromMyself: false,
                fromPeerId: recvText.fromPeerId,
                text: recvText.text,
                timestamp: recvText.timestamp,
            }

            this.newMessageCallbacks.forEach((callback) => {
                callback(message);
            });
        });

        this.signaling.registerListener(SignalType.notify, SignalMethod.newFile, (recvFile) => {
            console.log('[Signaling]  Handling newFile notification...');
            console.log(`[Signaling]  New File notification (URL: ${recvFile.fileURL}) received from peer (peerId: ${recvFile.fromPeerId})`);
            const message = {
                type: types.MessageType.file,
                broadcast: true,
                fileJobType: types.FileJobType.download,
                fromMyself: false,
                fromPeerId: recvFile.fromPeerId,
                timestamp: recvFile.timestamp,
            }

            this.newMessageCallbacks.forEach((callback) => {
                callback(message);
            });
        });

        this.signaling.registerListener(SignalType.notify, SignalMethod.hostChanged, ({ newHostId }) => {
            console.log(`[Signaling]  Handling hostChanged notification...`);
            console.log(`[Signaling]  Host of the meeting changed from ${this.hostPeerId} to ${newHostId}`);
            this.hostPeerId = newHostId;

            this.updatePeerCallbacks.forEach((callback) => {
                callback();
            });
        });

        this.signaling.registerListener(SignalType.notify, SignalMethod.roomClosed, async () => {
            console.log('[Signaling]  Handling roomClosed notification...');
            this.signaling.stopListeners();
            this.signaling.disconnect();
            await this.leaveMeeting();
            console.warn('[Signaling]  Room closed');
        });
    }
}
