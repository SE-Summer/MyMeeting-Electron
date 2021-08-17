const config = {
    serverIp: '122.112.175.61',
    // serverIp: '192.168.0.106',
    serverPort: 4446,
    serverUseHttps: false,
}

export const SIMULCASTENCODING= [
    {maxBitrate: 100000},
    {maxBitrate: 300000},
    {maxBitrate: 900000}
];

const _serverURL = (config.serverUseHttps ? 'https://' : 'http://') + config.serverIp + ':' + config.serverPort;

export const fileUploadURL = (userToken) => {
    return `${_serverURL}/file?token=${userToken}`;
}

export const meetingURL = (roomToken, userToken, myId) => {
    return `${serviceConfig.serverURL}/room?roomId=${roomToken}&peerId=${myId}&userToken=${userToken}`;
}

export const serviceConfig = {
    requestTimeout: 10000,
    connectTimeout: 20000,
    reconnectTimeout: 60000,
    mediaTimeout: 10000,
    allowTimeout: 10000,
    serverIp: config.serverIp,
    serverPort: config.serverPort,
    serverURL: _serverURL,
}

export const SignalType = {
    request : 'request',
    notify : 'notify'
}

export const MediaKind= {
    video : 'video',
        audio : 'audio'
}

export const TransportType= {
    producer : 'producer',
        consumer : 'consumer'
}

export const SignalMethod= {
    getRouterRtpCapabilities : 'getRouterRtpCapabilities',
        join : 'join',
        createTransport : 'createTransport',
        connectTransport : 'connectTransport',
        produce : 'produce',
        consume : 'consume',
        closeProducer : 'closeProducer',
        pauseProducer : 'pauseProducer',
        resumeProducer : 'resumeProducer',
        pauseConsumer : 'pauseConsumer',
        resumeConsumer : 'resumeConsumer',
        newConsumer : 'newConsumer',
        newPeer : 'newPeer',
        consumerClosed : 'consumerClosed',
        peerClosed : 'peerClosed',
        closeRoom : 'closeRoom',
        sendText : 'sendText',
        newText : 'newText',
        sendFile : 'sendFile',
        newFile : 'newFile',
        hostChanged : 'hostChanged',
        connectMeeting : 'connectMeeting',
        allowed : 'allowed',
        mute : 'mute',
        restartIce : 'restartIce',
        roomClosed : 'roomClosed',
        transferHost : 'transferHost',
        kick : 'kick',
        kicked : 'kicked',
        beMuted : 'beMuted',
}

export const MeetingEndReason= {
    notAllowed : 'notAllowed',
    lostConnection : 'lostConnection',
    roomClosed : 'roomClosed',
    kicked : 'kicked',
}

export const socketConnectionOptions = {
    // timeout: 3000,
    reconnection: true,
    autoConnect: false,
    reconnectionAttempts: Infinity,
    reconnectionDelayMax: 2000,
    // transports: ['websocket'],
}
