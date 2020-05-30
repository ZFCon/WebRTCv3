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
    video: true,
    audio: true
}

callbtn.onclick = () => {
    navigator.mediaDevices.getUserMedia(streamConstrains).then(stream => {
        localVideo.srcObject = stream
    })
}