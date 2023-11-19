window.addEventListener('load', (event) => {
    var url = 'https://nodejs.s-work.vn';
    var socket = io(url)
    console.log('page is fully loaded');
    const client = ZoomMtgEmbedded.createClient()
    let meetingSDKElement = document.getElementById('meetingSDKElement')

    client.init({
        debug: true,
        zoomAppRoot: meetingSDKElement,
        language: 'en-US',
        customize: {
            meetingInfo: [
                'topic',
                'host',
                'mn',
                'pwd',
                'telPwd',
                'invite',
                'participant',
                'dc',
                'enctype',
            ],
            toolbar: {
                buttons: [
                    // {
                    //   text: 'Custom Button',
                    //   className: 'CustomButton',
                    //   onClick: () => {
                    //     console.log('custom button')
                    //   }
                    // }
                ]
            }
        }
    })
    console.log('checkSystemRequirements');
    console.log(JSON.stringify(ZoomMtg.checkSystemRequirements()));

    // it's option if you want to change the WebSDK dependency link resources. setZoomJSLib must be run at first
    // if (!china) ZoomMtg.setZoomJSLib('https://source.zoom.us/1.7.2/lib', '/av'); // CDN version default
    // else ZoomMtg.setZoomJSLib('https://jssdk.zoomus.cn/1.7.2/lib', '/av'); // china cdn option 
    // ZoomMtg.setZoomJSLib('http://localhost:9999/node_modules/@zoomus/websdk/dist/lib', '/av'); // Local version default, Angular Project change to use cdn version
    ZoomMtg.preLoadWasm();

    ZoomMtg.prepareJssdk();

    var API_KEY = '_69ffPW_SMuIZfIqo87SAQ';

    /**
     * NEVER PUT YOUR ACTUAL API SECRET IN CLIENT SIDE CODE, THIS IS JUST FOR QUICK PROTOTYPING
     * The below generateSignature should be done server side as not to expose your api secret in public
     * You can find an eaxmple in here: https://marketplace.zoom.us/docs/sdk/native-sdks/web/essential/signature
     */
    var API_SECRET = 'eVxnaFdGkvfIuiU3tX1e7vaSa6XcpkOtY6QS';


    var meetConfig = {
        apiKey: API_KEY,
        apiSecret: API_SECRET,
        meetingNumber: 81083122517,
        userName: 'Kiet Notepad',
        passWord: "306593",
        leaveUrl: "localhost:8801",
        role: 1
    };


    var signature = ZoomMtg.generateSignature({
        meetingNumber: meetConfig.meetingNumber,
        apiKey: meetConfig.apiKey,
        apiSecret: meetConfig.apiSecret,
        role: meetConfig.role,
        success: function (res) {
            console.log('generate successfully', res.result);
        }
    });
    socket.on('generate-signature-to-client', (data) => {
        const signature = "XzY5ZmZQV19TTXVJWmZJcW84N1NBUS44MTA4MzEyMjUxNy4xNjU5MDY3NTA2NDIwLjAuL0RkRXdCa2M0SExKSW9jN0Z2TG5QdEdPTzNNaFZmUVlyazF5VFFROVB3Zz0";
        console.log('signature: ', signature);
        client.join({
            meetingNumber: meetConfig.meetingNumber,
            userName: meetConfig.userName,
            signature: signature,
            sdkKey: meetConfig.apiKey,
            userEmail: 'email@gmail.com',
            password: meetConfig.passWord,
            success: function (res) {
                console.log('join meeting success');
            },
            error: function (res) {
                console.log(res);
            }
        })
    })
    socket.emit('generate-signature', {
        meetingNumber: meetConfig.meetingNumber,
        apiKey: meetConfig.apiKey,
        apiSecret: meetConfig.apiSecret,
        role: meetConfig.role,
    })
});