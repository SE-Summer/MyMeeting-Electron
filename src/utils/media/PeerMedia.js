import {config} from "../../Constants"

const defaultPeerInfo = {
    id: 'defaultUser_defaultUser',
    avatar: config.unKnownUri,
    displayName: 'defaultUser',
    device: 'defaultDevice'
}

class PeerDetail
{
    _hasAudio = null;
    _hasVideo = null;
    peerInfo = null;
    // consumerId ==> Consumer
    consumers= null;
    // consumerId ==> MediaStreamTrack
    tracks = null;
    constructor()
    {
        this._hasAudio = false;
        this._hasVideo = false;
        this.consumers = new Map();
        this.tracks = new Map();
    }

    setPeerInfo(peerInfo)
    {
        this.peerInfo = peerInfo;
    }

    addConsumerAndTrack(consumer, track)
    {
        this.consumers.set(consumer.id, consumer);
        this.tracks.set(consumer.id, track);

        if (track.kind === 'audio')
            this._hasAudio = true;
        else if (track.kind === 'video')
            this._hasVideo = true;
    }

    deleteConsumerAndTrack(consumerId)
    {
        if (this.consumers.has(consumerId)) {
            if (!this.consumers.get(consumerId).closed) {
                this.consumers.get(consumerId).close();
            }
            this.consumers.delete(consumerId);
        }

        if (this.tracks.has(consumerId)) {
            this.tracks.delete(consumerId);
        }

        this.updateMediaStatus();
    }

    getConsumerIds()
    {
        let consumerIds = [];
        this.consumers.forEach((consumer, consumerId) => {
            consumerIds.push(consumerId);
        })
        return consumerIds;
    }

    getPeerInfo()
    {
        if (this.peerInfo)
            return this.peerInfo;
        else
            return defaultPeerInfo;
    }

    getTracks()
    {
        let tracks = [];
        this.tracks.forEach((track) => {
            tracks.push(track);
        });
        return tracks;
    }

    hasVideo()
    {
        return this._hasVideo;
    }

    hasAudio()
    {
        return this._hasAudio;
    }

    closeConsumers()
    {
        this.consumers.forEach((consumer) => {
            if (!consumer.closed) {
                consumer.close();
            }
        })
    }

    updateMediaStatus()
    {
        this._hasAudio = false;
        this._hasVideo = false;
        this.tracks.forEach((track) => {
            if (track.kind === 'video')
                this._hasVideo = true;
            else if (track.kind === 'audio')
                this._hasAudio = true;
        });
    }
}

export class PeerMedia
{
    // peerId ==> PeerDetail
    peerId2Details = null;
    consumerId2Details = null;

    constructor()
    {
        this.peerId2Details = new Map();
        this.consumerId2Details = new Map();
    }

    addPeerInfo(peerInfo)
    {
        const peerId = peerInfo.id;
        if (!this.peerId2Details.has(peerId)) {
            const peerDetail = new PeerDetail();
            peerDetail.setPeerInfo(peerInfo);
            this.peerId2Details.set(peerId, peerDetail);
        } else {
            this.peerId2Details.get(peerId).setPeerInfo(peerInfo);
        }
    }

    addConsumerAndTrack(peerId, consumer, track)
    {
        if (this.consumerId2Details.has(consumer.id))
            return;

        if (!this.peerId2Details.has(peerId)) {
            const peerDetail = new PeerDetail();
            peerDetail.addConsumerAndTrack(consumer, track);
            this.peerId2Details.set(peerId, peerDetail);
            this.consumerId2Details.set(consumer.id, peerDetail);
        } else {
            const peerDetail = this.peerId2Details.get(peerId);
            peerDetail.addConsumerAndTrack(consumer, track);
            this.consumerId2Details.set(consumer.id, peerDetail);
        }
    }

    deleteConsumerAndTrack(consumerId)
    {
        if (!this.consumerId2Details.has(consumerId))
            return;

        this.consumerId2Details.get(consumerId).deleteConsumerAndTrack(consumerId);
    }

    deletePeer(peerId)
    {
        if (!this.peerId2Details.has(peerId))
            return;

        const peerDetail = this.peerId2Details.get(peerId);

        const consumerIds = peerDetail.getConsumerIds();
        consumerIds.forEach((consumerId) => {
            this.consumerId2Details.delete(consumerId);
        });

        peerDetail.closeConsumers();
        peerDetail.closeConsumers();
        this.peerId2Details.delete(peerId);
    }

    getPeerDetails()
    {
        let peerDetails = [];
        this.peerId2Details.forEach((peerDetail) => {
            peerDetails.push(peerDetail);
        })
        return peerDetails;
    }

    clear()
    {
        this.peerId2Details.forEach((peerDetail) => {
            peerDetail.closeConsumers();
        });
        this.peerId2Details.clear();
        this.consumerId2Details.clear();
    }

    getPeerDetailsByPeerId(peerId)
    {
        return this.peerId2Details.get(peerId);
    }
}
