var canvas = new fabric.Canvas('canvas');
canvas.setHeight(500);
canvas.setWidth(500);

var videoInput = document.getElementById('videoInput');

videoInput.addEventListener('change', function (event) {
  var file = event.target.files[0];

  if (file) {
    var video = document.createElement('video');
    // video width is 400, height adjust as width
    video.width = 400;
    //video height adjust from width radio 16:9
    video.height = 225;
    var fileURL = URL.createObjectURL(file);
    video.src = fileURL;


    video.addEventListener('canplay', function () {
      var fabricImage = new fabric.Image(video, {
        left: 200,
        top: 300,
        width: 200,
        height: 200,
        angle: -15,
        originX: 'center',
        originY: 'center',
        objectCaching: false,
      });
      canvas.clear();
      canvas.add(fabricImage);
      video.play();
    });
  }
});

fabric.util.requestAnimFrame(function render() {
    canvas.renderAll();
    fabric.util.requestAnimFrame(render);
  });