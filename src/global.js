
export default {
    userInfo : {
        token : "",
        nickname: "",
        password: "",
        portrait: "",
        email: "",
        id: 0
    },
    email : "",
    password : "",
    token : "",
    roomInfo : {
        topic : "",
        id : "",
        token : "",
        password : "",
        host : 0,
        end_time : "",
        start_time: ""
    },
    baseURL : "http://122.112.175.61:4446",
    defaultPortrait: "http://122.112.175.61:4446/static/portraits/default.png",
    openCameraWhenEnter : false,
    openMicrophoneWhenEnter : false,
    videoConstraint : {
        width : {min : 800, ideal : 1000, max:1200},
        height : {min : 480, ideal : 560, max: 700}
    }
}
