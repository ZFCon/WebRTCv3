let chatRoom = document.getElementById('chatRoom')
let callbtn = document.getElementById('callbtn')
let localVideo = document.getElementById('localVideo')
let remoteVideo = document.getElementById('remoteVideo')

let roomNumber, localStream, remoteStream, rtcPeerConnection, isCaller

const iceServers = {
    'iceServer': [
        {'urls':'stun:stun01.sipphone.com'},
        {'urls':'stun:stun.ekiga.net'},
        {'urls':'stun:stun.fwdnet.net'},
        {'urls':'stun:stun.ideasip.com'},
        {'urls':'stun:stun.iptel.org'},
        {'urls':'stun:stun.rixtelecom.se'},
        {'urls':'stun:stun.schlund.de'},
        {'urls':'stun:stun.l.google.com:19302'},
        {'urls':'stun:stun1.l.google.com:19302'},
        {'urls':'stun:stun2.l.google.com:19302'},
        {'urls':'stun:stun3.l.google.com:19302'},
        {'urls':'stun:stun4.l.google.com:19302'},
        {'urls':'stun:stunserver.org'},
        {'urls':'stun:stun.softjoys.com'},
        {'urls':'stun:stun.voiparound.com'},
        {'urls':'stun:stun.voipbuster.com'},
        {'urls':'stun:stun.voipstunt.com'},
        {'urls':'stun:stun.voxgratia.org'},
        {'urls':'stun:stun.xten.com'},
    ]
}

const streamConstrains = {
    // video: true,
    audio: true
}

var socket = io.connect('http://127.0.0.1:4000')

callbtn.onclick = () => {
    roomNumber = chatRoom.value
    socket.emit('create or join', roomNumber)
    isCaller = true
}

socket.on('created', room => {
    navigator.mediaDevices.getUserMedia(streamConstrains).then(stream => {
        localStream = stream
        localVideo.srcObject = stream
        socket.emit('ready', roomNumber)
    })
})


socket.on('ready', () => {
    if(isCaller) {
        rtcPeerConnection = new RTCPeerConnection(iceServers)
        rtcPeerConnection.onicecandidate = onIceCandidate
        rtcPeerConnection.ontrack = onAddStream
        rtcPeerConnection.addTrack(localStream.getTracks()[0], localStream)
        rtcPeerConnection.addTrack(localStream.getTracks()[1], localStream)
        rtcPeerConnection.createOffer().then(sessionDescription => {
            rtcPeerConnection.setLocalDescription(sessionDescription)
            socket.emit('offer', {
                type: 'offer',
                sdp: sessionDescription,
                room: roomNumber
            })
        }).catch(err => {
            console.log(err)
        })


    }
})

socket.on('offer', event => {
    if(!isCaller) {
        rtcPeerConnection = new RTCPeerConnection(iceServers)
        rtcPeerConnection.onicecandidate = onIceCandidate
        rtcPeerConnection.ontrack = onAddStream
        rtcPeerConnection.addTrack(localStream.getTracks()[0], localStream)
        rtcPeerConnection.addTrack(localStream.getTracks()[1], localStream)
        rtcPeerConnection.setRemoteDescription(new RTCSessionDescription(event))
        rtcPeerConnection.createAnswer().then(sessionDescription => {
            rtcPeerConnection.setLocalDescription(sessionDescription)
            socket.emit('answer', {
                type: 'answer',
                sdp: sessionDescription,
                room: roomNumber
            })
        }).catch(err => {
            console.log(err)
        })


    }
})

socket.on('answer', event => {
    rtcPeerConnection.setRemoteDescription(new RTCSessionDescription(event))
})

socket.on('candidate', event => {
    const candidate = new RTCIceCandidate({
        sdpMLineIndex: event.label,
        candidate: event.candidate,
    })
    rtcPeerConnection.addIceCandidate(candidate)
})

function onAddStream(event) {
    remoteVideo.srcObject = event.streams[0]
    remoteStream.srcObject = event.streams[0]
}

function onIceCandidate(event) {
    if(event.candidate) {
        console.log('sending ice candidate', event.candidate)
        socket.emit('candidate', {
            type: 'candidate',
            label: event.candidate.sdpMLineIndox,
            id: event.candidate.sdpMid,
            candidate: event.candidate.candidate,
            room: roomNumber,

        })
    }
}