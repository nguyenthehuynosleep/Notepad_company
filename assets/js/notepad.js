import { addConnectingLinesArray, loadPorts, updateAnswerLines, addAnswerLines, showAllConnectingLines, hideAllConnectingLines, updatePortPositions, addPortsToRect, addPortsToImage, hideText, doTest, checkIfInAnyShape, addShape, checkifInShapes, checkifInPorts, hasConnectingLine, connectShapes, updateConnectingLines, deleteObject } from '../../your-script.js';
var backgroundColorCanvas = "";
window.addEventListener('DOMContentLoaded', (event) => {
  (function ($, window, document, undefined) {
    "use strict";
    var url = "https://socket.metalearn.vn:16013"; //Use when run on publish
    // var nodeServer = 'http://127.0.0.1:3000'; //Use when run on local
    // var url = 'http://localhost:3001';
    // var url = 'http://localhost:3000';
    var plugin_url = "https://notepad.s-work.vn/v3/"; //
    var stanza = 999999;
    var lengthObject = 0;
    var controlpencil = true;
    var controlrubber = false;
    var positionx = "0";
    var positiony = "0";
    var lastEmit = $.now();
    var touchX, touchY;
    var isGroup = false;
    var mousedown = false;
    var shift = false;
    var divrubber = $("#divrubber");
    var lastObject = {};
    var isChoosePort = false;
    var objCover = null;
    var socket = io(url);
    var roomIdMeeting = '';
    var idMeeting = '';
    var listUserMeeting = [];
    var displayName = '';
    var userNameMeeting = '';
    var UserType = 1;
    var roleMeeting = 'user';
    let isCurrentlyDrawingJ = $("#isCurrentlyDrawing");
    let isRequestingDrawingJ = $("#isRequestingDrawing");
    let isNotDrawingJ = $("#isNotDrawing");
    let haveNoDrawingPermissionJ = $("#haveNoDrawingPermission");
    let haveAllDrawingPermissionJ = $("#haveAllDrawingPermission");

    // store objects for ctrl + c/v
    var _clipboard;
    var ctrlDown = false; // check ctrl press

    // A flag for drawing activity
    var drawing = false;
    var isDrawMovingPath = false;
    var cursors = {};
    var isErasing = false;
    var isDraging = false;
    var isSelecting = false;
    var isEditText = false;
    var id;
    var init_position = [0, 0];
    var final_position = [0, 0];
    //  funzione richiesta di nick name
    var username = "";
    var usernameTemp = "";
    var userID = "";
    var pool_data = [];
    var currentLayer = 1;
    var isLoadDataLocal = true;
    var indexMove = -1;
    var index = -1;
    var alignOptions = ["left", "center", "right"];

    var listUsers = [];
    let quizMode = false;
    let listRoom = [];

    // worksheet
    var worksheetType = "";

    // layers
    var layerNum = 1;
    var layerStorage = [
      {
        id: 1,
        canvas: {
          backgroundColor: "#ffffff",
          gridObj: null,
        },
      },
    ];

    var isGrid = false;

    var idtempo;

    var click_event = document.ontouchstart ? "touchstart" : "click";

    var webSyncHandleUrl = "https://websync.3i.com.vn/websync.ashx";
    fm.websync.client.enableMultiple = true;
    var clients = new fm.websync.client(webSyncHandleUrl);
    var testichat = document.getElementById("testichat");
    var cnt = 0;

    // loadChat(username, stanza, clients, testichat);
    // getSubscribe(clients, stanza, testichat);

    // Kiet loadCanvasJsonNew
    var quizTitle = "";
    var countItem = 0;
    var userResult = [];
    var qIndex = -1;

    // svg object device
    let attachFileObj = null;

    // this for draw line with special type
    let isDrawLine = false;
    let isDrawingLine = false;
    let drawLineTimeId = null;
    let drawingLineTimeId = null;
    let drawLine;
    let isDown;
    let lineType = "";
    let lineArray = [];
    var pointArray = [];
    var isCurving = false;
    var isPointToPoint = true;
    var nextPointStart = null;

    let typesOfLinesIter = -1;
    const typesOfLines = [
      // Default: sine
      null,
      // Custom: tangens
      [
        function (x) {
          return Math.max(-10, Math.min(Math.tan(x / 2) / 3, 10));
        },
        4 * Math.PI,
      ],
      // Custom: Triangle function
      [
        function (x) {
          let g = x % 6;
          if (g <= 3) return g * 5;
          if (g > 3) return (6 - g) * 5;
        },
        6,
      ],
      // Custom: Square function
      [
        function (x) {
          let g = x % 6;
          if (g <= 3) return 15;
          if (g > 3) return -15;
        },
        6,
      ],
    ];

    // create canvas
    fabric.Object.prototype.objectCaching = false;
    fabric.Object.prototype.set({
      cornerStyle: "circle",
      cornerSize: 10,
      hasBorders: true,
      hasRotatingPoint: true,
      hasBorders: true,
      transparentCorners: false,
    });
    let canvas = new fabric.Canvas("canvas_draw", {
      id: layerStorage[0].id,
      backgroundColor: "#ffffff",
      preserveObjectStacking: true,
      fireRightClick: true, // <-- enable firing of right click events
      // fireMiddleClick: true, // <-- enable firing of middle click events
      stopContextMenu: true, // <--  prevent context menu from showing
      getScale: () => canvas.viewportTransform[0],
      getLeft: () => canvas.viewportTransform[4],
      getTop: () => canvas.viewportTransform[5],
    });

    let line,
      triangle,
      origX,
      origY,
      isFreeDrawing = false;
    let isRectActive = false,
      isCircleActive = false,
      isArrowActive = false,
      activeColor = "#000000";
    let isLoadedFromJson = false;

    // store custom attributes to save and load json
    const customAttributes = [
      // canvas
      "backgroundColor",
      "typeGrid",
      "layer",

      // object
      "fontSize",
      "textAlign",
      "underline",
      "fontStyle",
      "cellID",

      // group
      "groupID",

      "name",
      "id",
      "port1",
      "port2",
      "idObject1",
      "idObject2",
      "objectID",
      "objectCode",
      "port",
      "lineID",
      "line2",
      "isDrop",
      "isDrag",
      "isBackground",
      "answerId",
      "text",
      "subTargetCheck",

      // 'isChoosePort',
      "colorBorder",
      "widthBorder",
      "curve",
      "hasShadow",
      "shadowObj",
      "fixed",
      "position",

      "isMoving",
      "isRepeat",
      "isDrawingPath",
      "speedMoving",
      "pathObj",
      "soundMoving",
      "nameSoundMoving",

      "blink",
      "lineStyle",
      "lineType",
      "lockMovementX",
      "lockMovementY",
      "customProps",
      "funct",
      "coord_x1",

      "select",
      "status",
      "colorText",
      "colorTextSelected",
      "colorSelected",
      "colorUnselected",
      "soundSelected",
      "nameSoundSelected",
      "soundUnselected",
      "nameSoundUnselected",
      // 'imageContent',
      "nameImageContent",

      "input",
      "soundTyping",
      "nameSoundTyping",

      "snap",
      "soundSnap",
      "nameSoundSnap",

      // device record
      "nameDevice",
      "device",
      "src",
      "countRecord",
      "files",

      //worksheet
      "soundWorksheet",
    ];

    var snap = 20; //Pixels to snap
    let activeObject = null; // get obj was dblclick for config

    // device variables
    let isRecordAudio = false;
    let isRecordVideo = false;
    let audioStream;
    let videoStream;
    let audioRecorder = null;
    let cameraRecorder = null;
    let audioRecorded = $("#micRecorded")[0];
    let cameraRecorded = $("#cameraRecorded")[0];
    let cameraRecording = $("#cameraRecording")[0];
    let screenshotImg = $("#screenshot-img")[0];
    let takephotoImg = $("#takephoto-img")[0];
    let activeDeviceObject = null;

    // play variables
    let isCreateQuiz = false;
    let isCreateAnswer = false;
    let correctAnswers = [];
    let userAnswers = [];
    let isViewAnswer = false;
    let isMakingAnswer = false;
    let isDoQuiz = false;
    let isChecked = false;
    let readyCheck = false;
    let isCreateDoquiz = false;

    let correctAnswerBox;
    let userAnswerBox;

    //demo code
    var selectedCircles = [];
    var selectedShapes = [];
    var connectingLines = []; // Danh sách chứa các đường nối
    var connectingInProgress = false;
    var addConnectOn = false;
    var isDrawing = false;

    var currentLine = null

    var shapes = []; // chứa các hình vẽ
    var selectedPorts = []
    var lastSelectedPort = null;

    var allPorts = [];
    var textVisble = true;

    //multiple-choice
    var objectQuizMutiple = [];

    //videoobject array has object and video
    var videoObject = [];

    var imageUploadButton = document.getElementById('imageUploadButton');
    imageUploadButton.addEventListener('click', function () {
      fileUpload.click(); // Kích hoạt phần tử <input> ẩn
    });
    const fileUpload = document.getElementById('fileUpload');
    fileUpload.addEventListener('change', function () {
      const file = fileUpload.files[0];

      if (file) {
        const reader = new FileReader();

        reader.onload = function (e) {
          const dataURL = e.target.result;

          fabric.Image.fromURL(dataURL, function (img) {
            // Center the image on the canvas
            img.set({
              left: canvas.width / 2,
              top: canvas.height / 2,
              objectCaching: false,
            });
            canvas.add(img);
            shapes.push(img);
            addPortsToImage(img, canvas, connectingLines);
            updatePortPositions(img, canvas)
          });
        };

        reader.readAsDataURL(file);
      }
    });


    // video as object
    var videoUploadButton = document.getElementById('videoUploadButton');
    videoUploadButton.addEventListener('click', function () {
      videoInput.click() // Kích hoạt phần tử <input> ẩn
    })
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
            objectCaching: false,
          });
          canvas.add(fabricImage);
          shapes.push(fabricImage);
          addPortsToRect(fabricImage, canvas, connectingLines);
          updatePortPositions(fabricImage, canvas)
          videoObject.push({
            object: fabricImage,
            video: video
          })
          video.play();
        });
      }
    });

    fabric.util.requestAnimFrame(function render() {
      canvas.renderAll();
      fabric.util.requestAnimFrame(render);
    });
    var answerLines = []; // Danh sách chứa các đường nối
    let doTestConnectPhase = false;
    document.getElementById('doTestConnect').addEventListener('click', function (event) {
      doTestConnectPhase = !doTestConnectPhase
      console.log("do test connect", doTestConnectPhase);
      hideAllConnectingLines(connectingLines, canvas);
    });
    document.getElementById('checkTestConnect').addEventListener('click', function (event) {
      console.log("check test connect");
      var text = new fabric.Text('Check-test', {
        left: 100,
        top: 100,
        fontFamily: 'helvetica',
        fontSize: 50,
        fill: 'red'
      });
      canvas.add(text);
      console.log("answerLines", answerLines);
      //check if connecting lines exist in connectingLines exist all in answerLines
      var isCorrect = true; // Assume all connections are correct initially
      if (answerLines.length !== connectingLines.length) {
        // If the number of connections is not equal, set isCorrect to false
        isCorrect = false;
      }
      else {
        for (var i = 0; i < answerLines.length; i++) {
          var obj1 = answerLines[i].obj1;
          var obj2 = answerLines[i].obj2;

          if (!hasConnectingLine(obj1, obj2, connectingLines)) {
            // If a connection is not found, set isCorrect to false and break the loop
            isCorrect = false;
            break;
          }
        }
      }
      console.log("isCorrect", isCorrect);
      //add text to canvas
      var result = new fabric.Text(`${isCorrect}`, {
        left: 100,
        top: 150,
        fontFamily: 'helvetica',
        fontSize: 50,
        fill: 'red'
      });
      canvas.add(result);
    });

    document.getElementById('saveTestConnect').addEventListener('click', function (event) {
      console.log("save test connect");
      const saveData = {
        canvas: JSON.stringify(canvas.toJSON(customAttributes)),
        connectingLines: JSON.stringify(connectingLines),
        answerLines: JSON.stringify(answerLines)
      }

      var element = document.createElement("a");
      element.setAttribute(
        "href",
        "data:text/plain;charset=utf-8," +
        encodeURIComponent(JSON.stringify(saveData))
      );
      element.setAttribute("download", "quiz-inputObj.json");
      element.style.display = "none";
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);

    });
    var openFileTestConnectButton = document.getElementById('openFileTestConnect');
    var jsonFileUpload = document.getElementById('jsonFileUpload');

    openFileTestConnectButton.addEventListener('click', function (event) {
      jsonFileUpload.click(); // Activate the hidden <input> element
    });
    jsonFileUpload.addEventListener('change', function (event) {
      console.log("open file test connect");
      var file = event.target.files[0];
      if (file) {
        var reader = new FileReader();
        reader.onload = function (e) {
          var dataURL = e.target.result;
          var json = JSON.parse(dataURL);
          console.log("json", json.canvas);

          canvas.loadFromJSON(json.canvas, function () {
            canvas.renderAll();
            canvas.getObjects().forEach(function (obj) {
              if (obj.name == "object") {
                console.log("obj", obj);
                obj.ports = [];
                shapes.push(obj);
                canvas.remove(obj);
              }
              if (obj.type == "path") {
                canvas.remove(obj);
              }
              //4 ky tu dau tien cua obj.name la port

              if (obj.name && obj.name.substring(0, 4) == "port") {
                var portString = obj.name;
                var number = parseInt(portString.replace('port-', ''), 10);
                console.log("number", number);
                canvas.remove(obj);
                //shapes[number].ports.push(obj);
              }
              if (obj.name == "controller") {
                canvas.remove(obj);
              }
              if (obj.name == "textLine") {
                canvas.remove(obj);
              }
            });
            canvas.clear();
            console.log("shapes", shapes);
            loadPorts(shapes, canvas, connectingLines);
            var connectingLinesJson = JSON.parse(json.connectingLines);
            //console.log("connectingLines", connectingLinesJson);
            //console.log('controller', connectingLinesJson[0].port1);
            addConnectingLinesArray(connectingLinesJson, canvas, connectingLines, shapes);
          });
        };
        reader.readAsText(file);
      }
    });




    document.getElementById('deleteObjectButton').addEventListener('click', function (event) {
      var selectedObject = canvas.getActiveObject();

      // Check if the selected object is a video object
      var isVideoObject = videoObject.some(function (item) {
        return item.object === selectedObject;
      });
      if (isVideoObject) {
        // If the deleted object is a video object, pause and clear its source
        videoObject.forEach(function (item, index) {
          if (item.object === selectedObject) {
            item.video.pause();
            item.video.src = '';
            item.video.load();
            // Remove the video object from the videoObject array
            videoObject.splice(index, 1);
          }
        });
      }
      deleteObject(canvas, connectingLines, shapes)
      //if video object delete video and stop video

    });
    document.getElementById("addShapeButton").addEventListener("click", function (event) {
      event.preventDefault(); // Ngăn chặn sự kiện mặc định (ngăn tải lại trang)
      // Lấy phần tử select có id là "shapeSelect"
      var shapeSelect = document.getElementById("shapeSelect");
      // Lấy giá trị của tùy chọn đã chọn
      var selectedOption = shapeSelect.options[shapeSelect.selectedIndex].value;
      // Log giá trị của tùy chọn đã chọn
      console.log("Tùy chọn đã chọn: " + selectedOption);
      addShape(selectedOption, canvas, shapes, connectingLines);
    });

    async function uploadTempFile(url) {
      var requestOptions = {
        method: "POST",
        redirect: "follow",
      };

      var res = await fetch(
        `https://admin.metalearn.vn/MobileLogin/CreateTempFileFromUrl?url=${url}`,
        requestOptions
      );
      var rs = await res.json(); // de y bat dong bo
      return rs.Object;
      // var rs = json.json();
      // return rs.Object;
    }

    async function removeTempFile(url) {
      var requestOptions = {
        method: "POST",
        redirect: "follow",
      };

      var json = await fetch(
        `https://admin.metalearn.vn/MobileLogin/DeleteFileTemp?filePath=${url}`,
        requestOptions
      );
      var rs = json.json();
    }

    function showPopUpMenu(obj) {
      const editForm = $("#edit-form")[0];

      console.log("show popup menu");

      if (editForm.style.visibility === "hidden" || activeObject !== obj) {
        activeObject = obj;

        // fontFamily
        $("#font li").removeClass("active");
        $(`#font li[value="${obj.fontFamily}"]`).addClass("active");

        // textAlign
        $("#align-textbox i:first-child")
          .removeClass()
          .addClass(`fa fa-align-${activeObject.textAlign}`);

        //

        if (activeObject.name === "latex") {
          $(".latex").addClass("hidden");
        } else {
          $(".latex").removeClass("hidden");
        }
        $("#size-textbox li").removeClass("active");
        $(`#size-textbox li[value=${activeObject.fontSize}]`).addClass("active");
        $("#textColor-textbox")[0].value = activeObject.colorText;
        $("#current-size-textbox span:first-child").text(
          activeObject.fontSize | "Auto"
        );
        $("#current-size span:first-child").text(activeObject.fontSize | "Auto");

        $("#soundSelected")[0].nextElementSibling.innerText =
          obj.nameSoundSelected;
        $("#soundUnselected")[0].nextElementSibling.innerText =
          obj.nameSoundUnselected;
        $("#soundTyping")[0].nextElementSibling.innerText = obj.nameSoundTyping;
        $("#soundSnap")[0].nextElementSibling.innerText = obj.nameSoundSnap;
        if (obj.type == "image") {
          var imageContent = obj;
        } else {
          imageContent = findContent(obj);
        }
        $("#objBlink")[0].innerText = obj.blink ? "ON" : "OFF";
        $("#objectCode")[0].value = obj.objectCode ? obj.objectCode : "undefined";
        if (imageContent) {
          $("#replaceImg")[0].disabled = false;
          console.log(imageContent);
          $("#replaceImg")[0].nextElementSibling.innerText =
            imageContent.nameImageContent;
        } else {
          $("#replaceImg")[0].disabled = true;
        }
        $("#lineStyle")[0].value = obj.lineStyle;

        $("#objSelect")[0].checked = obj.select;
        $("#objInput")[0].checked = obj.input;
        $("#objSnap")[0].checked = obj.snap;
        $("#objControl")[0].checked = obj.hasControls;
        $("#textColor")[0].value = obj.colorText;
        $("#borderColor")[0].value = obj.colorBorder;
        $("#fillColor")[0].value = obj.colorFill;
        if (obj.type == "rect") {
          $("#textBoxRadiusText")[0].value = obj.radius;
          if (obj.shadow) {
            $("textBoxShadow")[0].value = "Shadow"
          }
          else {
            $("textBoxShadow")[0].value = "No Shadow"
          }
        }

        $("#borderWidth")[0].value = obj.widthBorder;
        $("#objCurve")[0].value = obj.curve;
        $("#objAngle")[0].value = obj.angle;
        $("#objBring")[0].value = obj.position;
        $("#objShadow")[0].innerText = obj.hasShadow ? "On" : "Off";
        $("#objFixed")[0].innerText = obj.lockMovementX ? "On" : "Off";

        if (obj.pathObj) {
          const value = obj.pathObj.path
            .map((point) => `[${parseInt(point[2])}, ${parseInt(point[1])}]`)
            .join(" ");
          $("#pathObj").val(value);
        } else $("#pathObj").val("Empty");

        if (obj.isMoving) {
          $("#pathMovingMark").css({ left: "33px", background: "#ff0000" });
        } else {
          $("#pathMovingMark").css({ left: "1px", background: "#aaa" });
        }

        $("#pathMovingRepeat")[0].checked = obj.isRepeat;
        $("#pathMovingSpeed")[0].value = obj.speedMoving;
        $("#soundMoving")[0].nextElementSibling.innerText =
          obj.nameSoundMoving != "" ? obj.nameSoundMoving : "Empty";

        const zoom = canvas.getZoom();
        let top = obj.top * zoom + canvas.getTop() - 60;
        let left =
          (obj.left + (obj.width / 2) * obj.scaleX) * zoom +
          canvas.getLeft() -
          180;

        if (obj.lineType == "waving") {
          top =
            Math.cos(obj.angle) * obj.top * zoom +
            canvas.viewportTransform[5] -
            60;
          left =
            Math.cos(obj.angle) *
            (obj.left + (obj.width / 2) * obj.scaleX) *
            zoom +
            canvas.viewportTransform[4] -
            180;
        }

        if (top < 0) top = 20;
        if (left < -50) left = -50;
        if (left > 1010) left = 1010;

        $("#edit-form").css({
          visibility: "visible",
          top: top + "px",
          left: left + "px",
        });

        const hideItems = [
          "lineStyle",
          "textColor",
          "borderColor",
          "borderWidth",
          "curve",
        ];
        if (obj.name === "image") {
          hideItems.forEach((item) => {
            $(`#sub-menu-${item}`).hide();
          });
        } else {
          hideItems.forEach((item) => {
            $(`#sub-menu-${item}`).show();
          });
        }
      } else {
        hidePopupMenu();
      }
    }

    function detectMob() {
      const toMatch = [
        /Android/i,
        /webOS/i,
        /iPhone/i,
        /iPad/i,
        /iPod/i,
        /BlackBerry/i,
        /Windows Phone/i
      ];

      return toMatch.some((toMatchItem) => {
        return navigator.userAgent.match(toMatchItem);
      });
    }

    if (detectMob()) {
      // alert("Mobile / Tablet version");
      $("#curve-line").addClass("hidden");
    }

    function touchPopupMenu(position, callback) {
      var touchStartMenu = setTimeout(() => {
        callback();
        canvas.off("mouse:up", touchEndHandler);
        canvas.off("mouse:move", touchMoveHandler);
      }, 1000);

      const touchEndHandler = () => {
        clearTimeout(touchStartMenu);
        canvas.off("mouse:up", touchEndHandler);
      };

      canvas.on("mouse:up", touchEndHandler);

      const touchMoveHandler = (e) => {
        if (
          Math.abs(e.pointer.x - position.x) > 100 ||
          Math.abs(e.pointer.y - position.y) > 100
        ) {
          clearTimeout(touchStartMenu);
          canvas.off("mouse:move", touchMoveHandler);
        }
      };

      canvas.on("mouse:move", touchMoveHandler);
    }

    function handleMouseUpSvg() {
      var object = this;
      objectMiro = null;
      if (object.clicked) {
        let obj = object.item(1);
        let textForEditing = new fabric.Textbox(obj.text, {
          top: object.top + object.item(0).height * object.item(0).scaleY + 10,
          left: object.left,
          fontSize: obj.fontSize * object.scaleY,
          fontFamily: obj.fontFamily,
          width: object.item(0).width * object.item(0).scaleX,
          textAlign: "center",
          scaleX: obj.scaleX,
          scaleY: obj.scaleY,
          name: "textBoxEditor",
        });

        console.log(textForEditing);
        // hide group inside text
        obj.visible = false;
        // note important, text cannot be hidden without this
        // object.addWithUpdate();

        textForEditing.visible = true;
        // do not give controls, do not allow move/resize/rotation on this
        textForEditing.hasControls = false;

        // now add this temporary obj to canvas
        canvas.add(textForEditing);
        canvas.setActiveObject(textForEditing);
        // make the cursor showing
        textForEditing.enterEditing();
        textForEditing.selectAll();

        // editing:exited means you click outside of the
        textForEditing.on("text:changed", function () {
          console.log(textForEditing.text);
        });
        textForEditing.on("editing:exited", () => {
          let newVal = textForEditing.text;
          let oldVal = obj.text;

          // then we check if text is changed
          obj.set({
            text: newVal,
            visible: true,
            // width: textForEditing.width,
            // left: textForEditing.left,

            // fontSize: textForEditing.fontSize,
            // fontFamily: textForEditing.fontFamily,
            textAlign: "center",
          });
          // comment before, you must call this
          // object.addWithUpdate();

          // we do not need textForEditing anymore
          textForEditing.visible = false;
          canvas.remove(textForEditing);

          // optional, buf for better user experience
          canvas.setActiveObject(object);
          console.log(object);
          updateLocal(
            pool_data,
            object.objectID,
            object.toObject(customAttributes),
            socket
          );
        });
        object.clicked = false;
      } else {
        console.log("here 2");

        // object.set({
        //     width: object.item(0).width,
        //     height: object.item(0).height,
        // })

        canvas.requestRenderAll();

        console.log("obj", object);
        updateLocal(
          pool_data,
          object.objectID,
          object.toObject(customAttributes),
          socket
        );

        objectMiro = object;
        object.clicked = true;
      }
    }

    function loadCanvasObjs(objs, canvas) {
      console.log(objs);
      fabric.util.enlivenObjects(objs, function (enlivenedObjects) {
        enlivenedObjects.forEach(function (obj) {
          console.log("obj", obj);
          var quizType = $("#quiz-type").val();
          if (obj.isDrag === true || obj.isDrop === true) {
            countItem++;
          }

          if (obj.name == "lineConnect") {
            var line = new fabric.Path("M 65 0 Q 100 100 200 0", {
              //  M 65 0 L 73 6 M 65 0 L 62 6 z
              fill: "",
              stroke: "#000",
              objectCaching: false,
              originX: "center",
              originY: "center",
              name: "lineConnect",
              idObject1: obj.idObject1,
              idObject2: obj.idObject2,
              port1: obj.port1,
              port2: obj.port2,
              objectID: obj.objectID,
            });

            line.selectable = false;
            line.path = obj.path;

            canvas.add(line);
          } else if (obj.name == "media") {
            if (obj.nameDevice == "attach-file") {
              attachFileObj = obj;
              startActiveFileObj(obj);
            } else {
              activeDeviceObject = obj;
              obj.on("mouseup", handleMouseUpSvg);
              startActiveMedia(obj);
            }

            // obj.set({
            //     objectID: arr[index].objectID,
            //     userID: arr[index].userID,
            // })
            canvas.add(obj);
          } else if (obj.name == "latex") {
            // obj.set({
            //     objectID: arr[index].objectID,
            //     userID: arr[index].userID,
            // })
            // startActiveTextbox(obj)
            startActiveObject(obj);
            canvas.add(obj);
          } else if (obj.type === "group") {
            if (obj.name == "line-style" && obj.lineType == "curve") {
              obj._objects.forEach((obj) => obj._setPath(obj.path));
            }
            if (obj._objects.length > 0) {
              obj._objects.forEach((child) => {
                if (child.id == "answer-correct-textbox") {
                  correctAnswerBox = child;
                  if (quizType == "quiz-3") {
                    console.log(correctAnswerBox);
                    correctAnswerBox.text = correctAnswerMatch
                      .map((item) => item)
                      .join(", ");
                  }
                  const title = new fabric.Text("User Answer", {
                    top: 0,
                    left: 30,
                    fontSize: 16,
                    fontFamily: "Times New Roman",
                  });

                  userAnswerBox = new fabric.Textbox("", {
                    left: 0,
                    top: 40,
                    width: 200,
                    fontSize: 10,
                    fontFamily: "Times New Roman",
                    id: "answer-correct-textbox",
                  });

                  const group = new fabric.Group([title, userAnswerBox], {
                    top: 150,
                    left: 50,
                    selectable: false,
                  });

                  canvas.add(group);
                  isCreateDoquiz = true;
                } else if (child.type == "textbox") {
                  // startActiveTextbox(obj)
                  startActiveObject(obj);
                }
              });
            }

            if (obj.name == "grid") {
              obj.set({
                evented: false,
                selectable: false,
                renderOnAddRemove: false,
                objectCaching: false,
              });
            }

            // obj.set({
            //     objectID: arr[index].objectID,
            //     userID: arr[index].userID,
            // })

            startActiveObject(obj);
            canvas.add(obj);
          } else if (obj.type === "image") {
            fabric.Image.fromURL(obj.src, function (img) {
              img.set({
                top: obj.top,
                left: obj.left,
                width: obj.width,
                height: obj.height,
                scaleX: obj.scaleX,
                scaleY: obj.scaleY,
                isBackground: obj.isBackground,
              });
              if (quizType == "quiz-3") {
                img.set({
                  name: obj.name,
                  id: obj.id,
                  port1: obj.port1,
                  port2: obj.port2,
                  idObject1: obj.idObject1,
                  idObject2: obj.idObject2,
                  objectID: obj.objectID,
                  port: obj.port,
                  lineID: obj.lineID,
                  hasShadow: obj.hasShadow,
                  shadowObj: obj.shadowObj,
                  pos: obj.pos,
                  snap: obj.snap,
                  readySound: obj.readySound,
                  sound: obj.sound,
                  line2: obj.line2,
                  isDrop: obj.isDrop,
                  isDrag: obj.isDrag,
                  isBackground: obj.isBackground,
                  answerId: obj.answerId,
                });
              }
              startActiveObject(img);
              // img.set({
              //     objectID: arr[index].objectID,
              //     userID: arr[index].userID,
              // })
              canvas.add(img);
              repositionBackground();
            });
          } else if (obj.name == "line-style") {
            if (obj.type == "wavy-line-with-arrow") {
              console.log("obj", obj);
              obj._objects = [];
              obj.objects = [];
              obj.updateInternalPointsData();
            }

            startActiveObject(obj);
            // obj.set({
            //     objectID: arr[index].objectID,
            //     userID: arr[index].userID,
            // })
            canvas.add(obj);
          } else if (obj.type === "textbox") {
            // obj.set({
            //     objectID: arr[index].objectID,
            //     userID: arr[index].userID,
            // })
            // startActiveTextbox(obj)
            startActiveObject(obj);
            canvas.add(obj);
          } else {
            obj.hasBorders = obj.hasControls = false;

            if (obj.name === "curve-point") {
              obj.on("moving", function () {
                const line = canvas
                  .getObjects()
                  .find(
                    (item) => item.type === "path" && item.objectID === obj.lineID
                  );

                if (line) {
                  line.path[1][1] = obj.left;
                  line.path[1][2] = obj.top;
                }
              });
            } else if (obj.type === "path") {
              obj._setPath(obj.path);
              obj.selectable = false;

              if (obj.name == "svg") {
                startActiveObject(obj);
                // obj.set({
                //     objectID: arr[index].objectID,
                //     userID: arr[index].userID,
                // })
              }
            }
            canvas.add(obj);
          }
        });
      });
    }

    function showFileMenu(obj) {
      var check = $(`.attach-file-popup-class`).hasClass("hidden");
      activeObject = obj;
      attachFileObj = obj;

      if (check) {
        // re render list
        $(`.attach-file-popup-class .list`)[0].innerHTML = "";
        obj.files.forEach((file) => addNewAttachFile(file));

        const zoom = canvas.getZoom();
        const left =
          (obj.left + (obj.width / 2) * obj.scaleX) * zoom +
          canvas.viewportTransform[4] -
          150;
        let top = obj.top * zoom + canvas.viewportTransform[5] - 30;

        $(`.attach-file-popup-class`).css({
          top: top + "px",
          left: left + "px",
        });
        $(`.attach-file-popup-class`).removeClass("hidden");
        var name = "file";
        $(`.${name}-popup-class`).css({ top: top + "px", left: left + "px" });
        $(`.${name}-popup-class`).removeClass("hidden");

        $(`#objBlink-${name}`)[0].innerText = obj.blink ? "ON" : "OFF";
        // $(`#lineStyle-${name}`)[0].value = obj.lineStyle;

        $(`#textColor-${name}`)[0].value = obj.colorText;
        $(`#borderColor-${name}`)[0].value = obj.colorBorder;
        // $(`#borderWidth-${name}`)[0].value = obj.widthBorder;
        // $(`#objCurve-${name}`)[0].value = obj.curve;
        // $(`#objAngle-${name}`)[0].value = obj.angle;

        if (obj.pathObj) {
          const value = obj.pathObj.path
            .map((point) => `[${parseInt(point[2])}, ${parseInt(point[1])}]`)
            .join(" ");
          $(`#pathObj-${name}`).val(value);
        } else $(`#pathObj-${name}`).val("Empty");

        if (obj.isMoving) {
          $(`#pathMovingMark-${name}`).css({
            left: "33px",
            background: "#ff0000",
          });
        } else {
          $(`#pathMovingMark-${name}`).css({ left: "1px", background: "#aaa" });
        }

        // $(`#pathMovingRepeat-${name}`)[0].checked = obj.isRepeat;
        // $(`#pathMovingSpeed-${name}`)[0].value = obj.speedMoving;

        if (obj.lineType == "waving") {
          top =
            Math.cos(obj.angle) * obj.top * zoom +
            canvas.viewportTransform[5] -
            60;
          left =
            Math.cos(obj.angle) *
            (obj.left + (obj.width / 2) * obj.scaleX) *
            zoom +
            canvas.viewportTransform[4] -
            180;
        }
      } else {
        $(`.attach-file-popup-class`).addClass("hidden");
      }
    }

    function startActiveFileObj(obj) {
      obj.on("mouseup", handleMouseUpSvg);

      obj.on("moving", function () {
        $(`.attach-file-popup-class`).addClass("hidden");
      });

      obj.startMoving = function () {
        startPathAnimation(obj);
      };

      // start object animation if isMoving
      if (obj.isMoving) svg.startMoving();
      if (obj.blink) blink(obj);

      changeCoordinateConnectLine(obj);

      obj.on("mousedblclick", function () {
        showFileMenu(obj);
      });

      obj.on("mousedown", function (e) {
        activeObject = this;
        attachFileObj = this;

        touchPopupMenu(e.pointer, () => showFileMenu(obj));
      })
    }

    function loadLayerCanvasJsonNew(arr, canvas) {
      console.log(`  ~ arr, canvas`, arr, canvas.id);
      // console.log('load layer canvas', arr, canvas.id);// vuong
      var groups = [];
      for (let index = 0; index < arr.length; index++) {
        if (arr[index].data && arr[index].layer == canvas.id) {
          var jsonObj = arr[index].data;
          if (arr[index].type == "lineConnect") {
            // }
            // if (jsonObj.name === 'custom-group') {
          } else {
            fabric.util.enlivenObjects([jsonObj], function (enlivenedObjects) {
              enlivenedObjects.forEach(function (obj) {
                // console.log(obj);
                // if (obj.groupID) {
                //     const group = groups.find(g => g.id === obj.groupID)
                //     if (group) {
                //         group.objs.push(obj)
                //     }
                //     else {
                //         groups.push({
                //             id: obj.groupID,
                //             objs: [obj]
                //         })
                //     }
                //     return;
                // }
                var quizType = $("#quiz-type").val();
                if (obj.isDrag === true || obj.isDrop === true) {
                  countItem++;
                }
                if (obj?.name === "line-style") {
                  obj.set({
                    selectable: true,
                    hasBorders: true,
                    hasRotatingPoint: true,
                    hasBorders: true,
                    transparentCorners: false,
                  });
                  obj.setControlsVisibility({
                    tl: true,
                    tr: true,
                    bl: true,
                    br: true,
                    mtr: true,
                    mb: true,
                    mt: true,
                    ml: true,
                    mr: true,
                  });
                }

                if (obj.name == "lineConnect") {
                  var line = new fabric.Path("M 65 0 Q 100 100 200 0", {
                    //  M 65 0 L 73 6 M 65 0 L 62 6 z
                    fill: "",
                    stroke: "#000",
                    objectCaching: false,
                    originX: "center",
                    originY: "center",
                    name: "lineConnect",
                    idObject1: obj.idObject1,
                    idObject2: obj.idObject2,
                    port1: obj.port1,
                    port2: obj.port2,
                    objectID: obj.objectID,
                  });

                  line.selectable = false;
                  line.path = obj.path;

                  canvas.add(line);
                } else if (obj.name == "media") {
                  console.log("media", obj);
                  if (obj.nameDevice == "attach-file") {
                    attachFileObj = obj;
                    startActiveFileObj(obj);
                  } else {
                    activeDeviceObject = obj;
                    obj.on("mouseup", handleMouseUpSvg);
                    startActiveMedia(obj);
                  }

                  obj.set({
                    objectID: arr[index].objectID,
                    userID: arr[index].userID,
                  });
                  canvas.add(obj);
                } else if (obj.name == "latex") {
                  obj.set({
                    objectID: arr[index].objectID,
                    userID: arr[index].userID,
                  });
                  // startActiveTextbox(obj)
                  startActiveObject(obj);
                  canvas.add(obj);
                } else if (obj.type === "group") {
                  if (obj.name == "line-style" && obj.lineType == "curve") {
                    obj._objects.forEach((obj) => obj._setPath(obj.path));
                  } else if (obj.name === "quiz-inputObj") {
                    objectSnapAdjacent(obj);
                  }
                  obj._objects.forEach((child) => {
                    if (child.id == "answer-correct-textbox") {
                      correctAnswerBox = child;
                      if (quizType == "quiz-3") {
                        console.log(correctAnswerBox);
                        correctAnswerBox.text = correctAnswerMatch
                          .map((item) => item)
                          .join(", ");
                      }
                      const title = new fabric.Text("User Answer", {
                        top: 0,
                        left: 30,
                        fontSize: 16,
                        fontFamily: "Times New Roman",
                      });

                      userAnswerBox = new fabric.Textbox("", {
                        left: 0,
                        top: 40,
                        width: 200,
                        fontSize: 10,
                        fontFamily: "Times New Roman",
                        id: "answer-correct-textbox",
                      });

                      const group = new fabric.Group([title, userAnswerBox], {
                        top: 150,
                        left: 50,
                        selectable: false,
                      });

                      canvas.add(group);
                      isCreateDoquiz = true;
                    } else if (child.type == "textbox") {
                      // startActiveTextbox(obj)
                      startActiveObject(obj);
                    }
                  });

                  if (obj.name == "grid") {
                    obj.set({
                      evented: false,
                      selectable: false,
                      renderOnAddRemove: false,
                      objectCaching: false,
                    });
                    obj.moveTo(0);
                  }

                  obj.set({
                    objectID: arr[index].objectID,
                    userID: arr[index].userID,
                  });

                  startActiveObject(obj);
                  canvas.add(obj);
                } else if (obj.type === "image") {
                  fabric.util.loadImage(
                    obj.src,
                    function (para) {
                      var img = new fabric.Image(para);
                      img.set({
                        ...obj,
                      });
                      if (quizType == "quiz-3") {
                        img.set({
                          name: obj.name,
                          id: obj.id,
                          port1: obj.port1,
                          port2: obj.port2,
                          idObject1: obj.idObject1,
                          idObject2: obj.idObject2,
                          objectID: obj.objectID,
                          port: obj.port,
                          lineID: obj.lineID,
                          hasShadow: obj.hasShadow,
                          shadowObj: obj.shadowObj,
                          pos: obj.pos,
                          snap: obj.snap,
                          readySound: obj.readySound,
                          sound: obj.sound,
                          line2: obj.line2,
                          isDrop: obj.isDrop,
                          isDrag: obj.isDrag,
                          isBackground: obj.isBackground,
                          answerId: obj.answerId,
                        });
                      }
                      startActiveObject(img);
                      img.set({
                        objectID: arr[index].objectID,
                        userID: arr[index].userID,
                      });
                      console.log("load image", img, obj);
                      canvas.add(img);
                      repositionBackground();
                    },
                    null,
                    { crossOrigin: "anonymous" }
                  );
                } else if (obj.name == "line-style") {
                  if (obj.type == "wavy-line-with-arrow") {
                    console.log("obj", obj);
                    obj._objects = [];
                    obj.objects = [];
                    obj.updateInternalPointsData();
                  }

                  startActiveObject(obj);
                  obj.set({
                    objectID: arr[index].objectID,
                    userID: arr[index].userID,
                  });
                  canvas.add(obj);
                } else if (obj.type === "textbox") {
                  obj.set({
                    objectID: arr[index].objectID,
                    userID: arr[index].userID,
                  });
                  // startActiveTextbox(obj)
                  startActiveObject(obj);
                  canvas.add(obj);
                } else {
                  obj.hasBorders = obj.hasControls = false;

                  if (obj.name === "curve-point") {
                    obj.on("moving", function () {
                      const line = canvas
                        .getObjects()
                        .find(
                          (item) =>
                            item.type === "path" && item.objectID === obj.lineID
                        );

                      if (line) {
                        line.path[1][1] = obj.left;
                        line.path[1][2] = obj.top;
                      }
                    });
                  } else if (obj.type === "path") {
                    obj._setPath(obj.path);

                    if (obj.name == "svg") {
                      startActiveObject(obj);
                      obj.set({
                        objectID: arr[index].objectID,
                        userID: arr[index].userID,
                      });
                    }
                  }
                  canvas.add(obj);
                }
                if (obj.isMoving && obj.startMoving) {
                  obj.startMoving();
                }
              });
            });
          }
        }
      }
      console.log("groups", groups);

      groups.forEach((g) => {
        const grp = pool_data.find((o) => o.objectID === g.id);
        const group = new fabric.Group(g.objs, {
          ...grp?.data,
          name: "custom-group",
          objectID: g.id,
        });
        canvas.add(group);
      });
      canvas.renderAll();
    }

    function makeChildSelectable(obj) {
      obj.subTargetCheck = true;
      var listObject = obj._objects;
      for (let index = 0; index < listObject.length; index++) {
        const element = listObject[index];
        if (element.__eventListeners) {
          element.__eventListeners["mousedblclick"] = [];
        }
        console.log(element);
        if (element.type != "textbox" && element.type != "group") {
          element.on("mousedblclick", handleDbclickChild);
        } else if (element.type != "group") {
          element.on("mouseup", function (e) {
            if (e.button === 1) {
              console.log("left click");
            }
            // if(e.button === 2) {
            //     console.log("middle click");
            // }
            if (e.button === 3) {
              handleTextboxRightclick(this);
            }
          });
        } else {
          makeChildSelectable(element);
        }
      }
    }
    function loadCanvasJsonNew(canvasObj) {
      fabric.util.enlivenObjects(canvasObj.objects, function (enlivenedObjects) {
        enlivenedObjects.forEach(function (obj) {
          var quizType = $("#quiz-type").val();
          if (obj.isDrag === true || obj.isDrop === true) {
            countItem++;
          }

          if (obj.name == "lineConnect") {
            var line = new fabric.Path("M 65 0 Q 100 100 200 0", {
              //  M 65 0 L 73 6 M 65 0 L 62 6 z
              fill: "",
              stroke: "#000",
              objectCaching: false,
              originX: "center",
              originY: "center",
              name: "lineConnect",
              idObject1: obj.idObject1,
              idObject2: obj.idObject2,
              port1: obj.port1,
              port2: obj.port2,
              objectID: obj.objectID,
            });

            line.selectable = false;
            line.path = obj.path;

            canvas.add(line);
          } else if (obj.name == "media") {
            if (obj.nameDevice == "attach-file") {
              attachFileObj = obj;
              startActiveFileObj(obj);
            } else {
              activeDeviceObject = obj;
              obj.on("mouseup", handleMouseUpSvg);
              startActiveMedia(obj);
            }
            console.log("obj", obj);
            canvas.add(obj);
          } else if (obj.type === "group") {
            if (obj.name != "custom-group") {
              if (obj.name == "line-style" && obj.lineType == "curve") {
                obj._objects.forEach((obj) => obj._setPath(obj.path));
              }
              if (obj._objects.length > 0) {
                obj._objects.forEach((child) => {
                  if (child.id == "answer-correct-textbox") {
                    correctAnswerBox = child;
                    if (quizType == "quiz-3") {
                      console.log(correctAnswerBox);
                      correctAnswerBox.text = correctAnswerMatch
                        .map((item) => item)
                        .join(", ");
                    }
                    const title = new fabric.Text("User Answer", {
                      top: 0,
                      left: 30,
                      fontSize: 16,
                      fontFamily: "Times New Roman",
                    });

                    userAnswerBox = new fabric.Textbox("", {
                      left: 0,
                      top: 40,
                      width: 200,
                      fontSize: 10,
                      fontFamily: "Times New Roman",
                      id: "answer-correct-textbox",
                    });

                    const group = new fabric.Group([title, userAnswerBox], {
                      top: 150,
                      left: 50,
                      selectable: false,
                    });

                    canvas.add(group);
                    isCreateDoquiz = true;
                  }
                });
              }

              if (obj.name == "grid") {
                obj.set({
                  evented: false,
                  selectable: false,
                  renderOnAddRemove: false,
                  objectCaching: false,
                });
              }

              startActiveObject(obj);
            } else {
              makeChildSelectable(obj);
            }
            canvas.add(obj);
          } else if (obj.type === "image") {
            fabric.Image.fromURL(obj.src, function (img) {
              console.log("obj", obj);
              img.set({
                top: obj.top,
                left: obj.left,
                width: obj.width,
                height: obj.height,
                scaleX: obj.scaleX,
                scaleY: obj.scaleY,
                isBackground: obj.isBackground,
              });
              if (quizType == "quiz-3") {
                setDefaultAttributes(img);
                img.set({
                  name: obj.name,
                  id: obj.id,
                  port1: obj.port1,
                  port2: obj.port2,
                  idObject1: obj.idObject1,
                  idObject2: obj.idObject2,
                  objectID: obj.objectID,
                  port: obj.port,
                  lineID: obj.lineID,
                  hasShadow: obj.hasShadow,
                  shadowObj: obj.shadowObj,
                  pos: obj.pos,
                  snap: obj.snap,
                  readySound: obj.readySound,
                  sound: obj.sound,
                  line2: obj.line2,
                  isDrop: obj.isDrop,
                  isDrag: obj.isDrag,
                  isBackground: obj.isBackground,
                  answerId: obj.answerId,
                });
              }
              startActiveObject(img);

              canvas.add(img);
              repositionBackground();
            });
          } else if (obj.name == "line-style") {
            if (obj.type == "wavy-line-with-arrow") {
              console.log("obj", obj);
              obj._objects = [];
              obj.objects = [];
              obj.updateInternalPointsData();
            }

            startActiveObject(obj);
            canvas.add(obj);
          } else {
            obj.hasBorders = obj.hasControls = false;

            if (obj.name === "curve-point") {
              obj.on("moving", function () {
                const line = canvas
                  .getObjects()
                  .find(
                    (item) => item.type === "path" && item.objectID === obj.lineID
                  );

                if (line) {
                  line.path[1][1] = obj.left;
                  line.path[1][2] = obj.top;
                }
              });
            } else if (obj.type === "path") {
              obj._setPath(obj.path);
              obj.selectable = false;

              if (obj.name == "svg") {
                startActiveObject(obj);
              }
            }
            canvas.add(obj);
          }
        });
      });

      canvas.setBackgroundColor(
        canvasObj.backgroundColor,
        canvas.renderAll.bind(canvas)
      );

      canvas.renderAll();
    }

    function createCanvasSaveData() {
      var quizType = $("#quiz-type").val();
      const attrs = [
        "name",
        "id",
        "port1",
        "port2",
        "idObject1",
        "idObject2",
        "objectID",
        "port",
        "lineID",
        "line2",
        "isDrop",
        "isDrag",
        "isBackground",
        "answerId",

        "colorBorder",
        "widthBorder",
        "curve",
        "hasShadow",
        "shadowObj",
        "fixed",
        "position",

        "isMoving",
        "isRepeat",
        "isDrawingPath",
        "speedMoving",
        "pathObj",

        "select",
        "status",
        "colorText",
        "colorTextSelected",
        "colorSelected",
        "colorUnselected",
        "soundSelected",
        "nameSoundSelected",
        "soundUnselected",
        "nameSoundUnselected",

        "input",
        "soundTyping",
        "nameSoundTyping",

        "snap",
        "soundSnap",
        "nameSoundSnap",

        // device record
        "nameDevice",
        "device",
        "src",
        "countRecord",
      ];

      if (quizType == "quiz-1") {
        const saveData = {
          canvas: JSON.stringify(canvas.toJSON(attrs)),
          questions,
          correctAnswers: correctAnswers,
          userAnswers: userAnswers,
          setting: quizSetting,
          title: quizTitle,
          gameType: quizType,
        };
      } else {
        var startingCanvas = matchQuizData.canvas;
        const saveData = {
          canvas: startingCanvas,
          questions,
          correctAnswers: correctAnswers,
          userAnswers: userAnswers,
          setting: quizSetting,
          title: quizTitle,
          gameType: quizType,
        };
      }

      return saveData;
    }

    function createMediaID() {
      const today = new Date();
      return `${today.getSeconds()}_${today.getMinutes()}_${today.getHours()}-${today.getDay()}_${today.getMonth()}_${today.getFullYear()}`;
    }

    // Add new record to list
    var listMedia = [];
    function addNewRecord(name, id) {
      let player;
      switch (name) {
        case "mic":
          player = audioRecorded;
          break;
        case "camera":
          player = cameraRecorded;
          break;
        case "takephoto":
          player = takephotoImg;
          break;
        default:
          break;
      }

      const li = document.createElement("li");
      const playButton = document.createElement("button");
      const deleteButton = document.createElement("button");
      const div = document.createElement("div");
      const src = activeDeviceObject.src.find((value) => value.id == id);

      if (!src) return;
      li.innerHTML = `
                <p>${src.name}</p>
            `;
      li.classList.add("device-item");

      if (name == "takephoto") {
        playButton.innerHTML =
          '<i class="fa fa-picture-o" aria-hidden="true"></i>';
      } else {
        playButton.innerHTML = '<i class="fa fa-play" aria-hidden="true"></i>';
      }
      playButton.classList.add("btn", "btn-primary");
      playButton.value = id;

      playButton.onclick = async function () {
        //     var requestOptions = {
        //         method: 'GET'
        //     };
        //     var response = await fetch(src.url, requestOptions);
        //     console.log(response);
        if (name != "takephoto") {
          try {
            player.src = src.url;
            player.load();
            player.play();
          } catch (e) {
            // player.src = URL.createObjectURL(src.blob);
            console.log(e);
            alert(`Get data failed: ${e}`);
          }
        } else {
          player.src = src.url;
        }
      };

      deleteButton.innerHTML = '<i class="fa fa-trash" aria-hidden="true"></i>';
      deleteButton.classList.add("btn", "btn-danger");

      deleteButton.onclick = function () {
        li.remove();
        activeDeviceObject.src = activeDeviceObject.src.filter(
          (item) => item.id != id
        );
        listMedia = listMedia.filter((item) => item.id !== id);
        if (activeDeviceObject.src.length == 0) {
          player.src = "";
          if (name == "takephoto") {
            player.style.display = "none";
          }
        } else if (player.src == src.url) {
          // name == 'takephoto' ?
          player.src = activeDeviceObject.src[0].url;
          // : player.src = activeDeviceObject.src[0].blob
        }
        updateLocal(
          pool_data,
          activeDeviceObject.objectID,
          activeDeviceObject.toObject(customAttributes),
          socket,
          {
            isDeleteRecord: true,
            id,
          }
        );
        // removeTempFile(src.url)
      };

      div.appendChild(playButton);
      div.appendChild(deleteButton);
      li.appendChild(div);

      $(`.${name}-popup-class .list`)[0].appendChild(li);
    }

    // add file to attach file list
    function addNewAttachFile(file, id) {
      const li = document.createElement("li");
      const playButton = document.createElement("button");
      const deleteButton = document.createElement("button");
      const div = document.createElement("div");

      li.innerHTML = `
                <p>${file.name}</p>
            `;
      li.classList.add("device-item");

      playButton.innerHTML = '<i class="fa fa-file-o" aria-hidden="true"></i>';

      playButton.classList.add("btn", "btn-primary");

      playButton.onclick = function () {
        // if (file.type == 'link') {
        //     $('#attach-file-view')[0].src = `https://docs.google.com/gview?url=${file.url}&embedded=true`;
        // } else if (file.type == 'local') {
        //     $('#attach-file-view')[0].src = file.url;
        // }
        // $('#attach-file-container').css({ 'display': 'block' });
        if (file.type == "DRIVER") {
          $(
            "#attach-file-view"
          )[0].src = `https://docs.google.com/document/d/${file.cloudId}/edit`;
        } else if (file.type == "SERVER") {
          var requestOptions = {
            method: "GET",
            redirect: "follow",
          };

          fetch(
            `https://dieuhanh.vatco.vn/MobileLogin/GetItemEdmsFile?Id=${file.catFileId}`,
            requestOptions
          )
            .then((res) => res.json())
            .then((res) => {
              console.log("Open file", res);
              if (file.extension == "docx") {
                window.open("https://dieuhanh.vatco.vn/WordViewer#", "_blank");
              }
              if (file.extension == "xlsx") {
                window.open("https://dieuhanh.vatco.vn/ExcelViewer#", "_blank");
              }
              if (file.extension == "pdf") {
                window.open("https://dieuhanh.vatco.vn/PdfViewer#", "_blank");
              }
            })
            .catch((error) => console.log("error", error));
        } else if (file.type == "EXTERNAL") {
          window.open(file.url, "_blank");
        }
      };

      deleteButton.innerHTML = '<i class="fa fa-trash" aria-hidden="true"></i>';
      deleteButton.classList.add("btn", "btn-danger");

      deleteButton.onclick = function () {
        li.remove();
        attachFileObj.files = attachFileObj.files.filter(
          (item) => item.id != file.id
        );
        updateLocal(
          pool_data,
          attachFileObj.objectID,
          attachFileObj.toObject(customAttributes),
          socket,
          {
            isDeleteRecord: true,
            id: file.id,
          }
        );
      };

      div.appendChild(playButton);

      div.appendChild(deleteButton);
      li.appendChild(div);

      $(`.attach-file-popup-class .list`)[0].appendChild(li);
    }

    // $(".zoom-chat-btn").click(function() {
    //     // var e = $.Event("keypress");
    //     // e.which = 13; //choose the one you want
    //     // e.keyCode = 13;
    //     // console.dir($("#meetingSDKChatElement textarea")[0]);
    //     // $("#meetingSDKChatElement textarea").trigger(e);
    //     // var keyboardEvent = new KeyboardEvent('keydown', {
    //     //     code: 'Enter',
    //     //     key: 'Enter',
    //     //     charKode: 13,
    //     //     keyCode: 13,
    //     //     view: window
    //     // });

    //     // console.log('click', keyboardEvent);

    //     // // $("#meetingSDKChatElement textarea")[0].dispatchEvent(keyboardEvent);
    //     // $("#test-chat")[0].dispatchEvent(keyboardEvent);
    //     // var text = $("#test-chat").val()
    //     // $("#test-chat").val(text + 'a')
    //     var text = $("#meetingSDKChatElement textarea").val()
    //     $("#meetingSDKChatElement textarea").val(text + 'a')

    // })
    var isShowToolbar = false;
    $("#toolbar-expand-btn").click(function () {
      isShowToolbar = !isShowToolbar;
      if (isShowToolbar) {
        $(".block-tool-btn").css({ height: "fit-content" });
        // $('.block-tool-btn').slideDown()
        $("#toolbar-expand-btn").html(
          '<i class="fa fa-angle-double-down" aria-hidden="true">'
        );
      } else {
        $(".block-tool-btn").css({ height: "40px" });
        // $('.block-tool-btn').slideUp()
        $("#toolbar-expand-btn").html(
          '<i class="fa fa-bars" aria-hidden="true"></i>'
        );
      }
    });

    var zoomConfig;
    var isInitZoomClient = false;
    var isZoomFull = false;
    const client = ZoomMtgEmbedded.createClient();

    async function initZoomClient() {
      if (isInitZoomClient) return;
      isInitZoomClient = true;

      let meetingSDKElement = document.querySelector("#meetingSDKElement");
      let meetingSDKChatElement = document.getElementById(
        "meetingSDKChatElement"
      );

      try {
        var rs = await client.init({
          zoomAppRoot: meetingSDKElement,
          language: "en-US",
          customize: {
            video: {
              popper: {
                disableDraggable: true,
              },
            },
            chat: {
              popper: {
                disableDraggable: true,
                anchorElement: meetingSDKChatElement,
                placement: "top",
              },
            },
            // video: {
            //     isResizable: false,
            //     popper: {
            //         disableDraggable: true,
            //     },
            //     // viewSize: {
            //     //     default: {
            //     //         width: 800,
            //     //         height: 500
            //     //     },
            //     //     ribbon: {
            //     //         width: 300,
            //     //         height: 600
            //     //     }
            //     // }
            // },
            // chat: {
            //     popper: {
            //         disableDraggable: true,
            //         anchorElement: meetingSDKChatElement,
            //         placement: 'top'
            //     }
            // },
            // meetingInfo: [
            //     'topic',
            //     'host',
            //     'mn',
            //     'pwd',
            //     'telPwd',
            //     'invite',
            //     'participant',
            //     'dc',
            //     'enctype',
            // ],
            // toolbar: {
            //     buttons: [
            //         {
            //             text: 'Custom Button',
            //             className: 'CustomButton',
            //             onClick: () => {
            //             console.log('custom button')
            //             }
            //         }
            //     ]
            // }
          },
        });
      } catch (error) {
        console.log(error);
        return alert("Error occur");
      }
      console.log(rs);
    }

    function wait1sec() {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve("Ok");
        }, 1000);
      });
    }
    function loadDataSmartwork(data) {
      console.log(`  ~ loadData`);
      layerNum = data.layerNum;
      layerStorage = data.layerStorage;
      pool_data = data.pool_data;

      $(".icon-selector").remove();
      layerStorage.forEach((layer, index) => {
        const li = document.createElement("li");

        li.classList.add("icon-layer", "icon-selector");
        $(li).attr("data-cnt", index + 1);
        $(li).attr("data-id", layer.id);
        console.log(`  ~ layer.id2`, layer.id);
        li.innerHTML = `<img src="assets/images/notepad/layer/layer-${index + 1
          }.png">`;

        $("#layers-body").append(li);
      });
      currentLayer = 1;
      canvas.id = layerStorage[0].id;

      canvas.clear();
      loadLayerCanvasJsonNew(pool_data, canvas);
      console.log(`  ~ loadLayerCanvasJsonNew`, 2);

      updateToolBarStatus();
    }
    let showSidebar = true;
    /**
     * Hanlde popup and display info from zoom sdk
     * @author PhamVanPhuc
     * @date 2022-09-09
     * @param {any} config - Zoom config
     * @returns {void}
     */
    async function handleZoomMeeting(config = zoomConfig) {
      $("#zoom-list").addClass("hidden");

      $("#loading-modal")[0].classList.remove("hidden");
      if (!showSidebar) $("#btn-send")[0].click();

      await initZoomClient();
      console.log("init success");
      try {
        await wait1sec();
        var rs = await client.join({
          sdkKey: config.sdkKey,
          signature: config.signature, // role in SDK Signature needs to be 0
          meetingNumber: config.meetingNumber,
          password: config.password,
          userName: config.username,
        });

        var expiresTimeId = setTimeout(() => {
          client.leaveMeeting();
          alert("Zoom time expired after 40 minutes!");
        }, 39 * 60 * 1000);

        client.on("connection-change", (payload) => {
          console.log("zoom - connection-change:", payload);
          if (payload.state === "Closed") {
            clearTimeout(expiresTimeId);
            console.log("Meeting ended");
            // $('#meetingSDKElement').empty()
            // $('#meetingSDKChatElement').empty()
          }
        });

        console.log("join success", rs);
        $(
          "#meetingSDKElement>div>div>div:nth-child(2)>div:nth-child(5)>button"
        )[0]?.click();
        $("#menu-list-icon-more li:contains('Chat')")[0]?.click();

        $(".zoom-chat-btn").show();

        $("#zoomCameraContainer").slideDown();
        $("#zoomChatContainer").slideDown();

        console.log("Epanding tab...");

        // Hide loadding
        $("#loading-modal")[0].classList.add("hidden");
        $("#zoom-camera-expand").css({ display: "block" });
        $(".zmwebsdk-makeStyles-root-236").css({ height: "135px" });
        console.log('check roomIdMeeting: ', roomIdMeeting);
        if (!roomIdMeeting) {
          console.log('start socket io');
          const userID = $("#username")[0].value;
          const pin = '';
          const roomName = `tutor_schedule_${pin?.trim() ?? ''}_${idMeeting}`;
          socket.emit('initSmartworkRoom', { id: roomName, userId: userID, displayName: displayName, role: roleMeeting });
          socket.emit('joinRoom', { room: `Smart Work tutor_schedule_${pin?.trim() ?? ''}_${idMeeting}`, userID: userID });
          socket.emit('reloadMembers', `Smart Work tutor_schedule_${pin?.trim() ?? ''}_${idMeeting}`);
          socket.emit('fetch-data-request', `Smart Work tutor_schedule_${pin?.trim() ?? ''}_${idMeeting}`);
          socket.on("fetch-data-to-client", (data) => {
            console.log(data);
            loadDataSmartwork({
              layerNum: data.layer,
              layerStorage: data.layerStorage,
              pool_data: data.drawData,
            });
          });
          console.log('end socket io');
          // const room = listRoom.find((item) => item.roomName === roomName);
          // const userCreate = room?.userCreate;
          // console.log("🚀 ~ join room", userCreate, userID, roomName);
          // socket.emit("validateLoginRoom", { room: roomName, userID });
        }
      } catch (error) {
        console.log(error);
        $("#loading-modal")[0].classList.add("hidden");
        return alert("Error occur");
      }
    }
    var isFrom888Tutor = false;
    var meetingId888 = "";
    var scheduleId888 = "";
    var userName888 = "";
    var idRoom888 = "";
    var listUserStatic888 = [];
    // listen to 888tutor message
    function listener888(data) {
      console.log(data);
      isFrom888Tutor = true;
      meetingId888 = data.meetingId;
      scheduleId888 = data.scheduleId;
      userName888 = data.userName;
      document.getElementById("modal-wrapper").style.display = "none";

      const today = new Date();
      const user = {
        userID: randomID(),
        name: userName888,
        password: "888Tutor",
        time:
          today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds(),
        status: "available",
        raiseHand: "false",
      };
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

      var urlencoded = new URLSearchParams();
      urlencoded.append("userName", userName888);

      var requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: urlencoded,
        redirect: "follow",
      };

      fetch(
        "http://localhost:6024/IkTeachHome/LoginNoCheckOnlineNodeJs",
        requestOptions
      )
        .then((response) => response.json())
        .then(async (result) => {
          console.log(result);
          // getListUserOnline();
          if (result.Error == false || result.Object == "LOGGED_IN") {
            socket.emit("joinRoom", { name: user.name, time: user.time, isWeb: true });
            socket.on("getUsers", (data) => {
              var isExistList = data.map((x) => {
                return listUserStatic888.findIndex((y) => x.name == y.UserName);
              });
              var isRemove = data.findIndex((x) => x.time == "") != -1;
              var isNotExist = isExistList.indexOf(-1) != -1;
              if (isNotExist || isRemove) {
                getListUserOnline888();
              }
            });
            socket.emit("fetch-data-request", function () { });
            socket.on("fetch-data-to-client", (data) => {
              console.log(data);
              loadData888({
                layerNum: data.layer,
                layerStorage: data.layerStorage,
                pool_data: data.drawData,
              });
            });
            getListUserOnline888();
            $("#login").addClass("hidden");
            $("#logout").removeClass("hidden");
            $("#nameuser").text(username);

            // loadChat(username, stanza, clients, testichat);
            // getSubscribe(clients, stanza, testichat);
            // var json = await callApiJsonData();
            // renderDataFromApi(canvas, json);

            // await loadWorkSheetData(1, 200)
            jQuery.ajax({
              type: "POST",
              url:
                "http://localhost:6024/IkTeachHome/GetZoomSdkMeetingSchedule?id=" +
                scheduleId888,
              contentType: "application/json",
              dataType: "JSON",
              success: function (rs) {
                if (rs.Error) {
                  alert(rs.Title);
                  // App.toastrError(rs.Title);
                } else {
                  zoomConfig = {
                    sdkKey: rs.Object.SdkKey,
                    sdkSecret: rs.Object.SdkSecret,
                    meetingNumber: rs.Object.MeetingNumber,
                    username: userName888,
                    password: rs.Object.Password,
                    signature: rs.Object.Signature,
                  };
                  const isMaster = (userName === rs.Object.CreatedBy
                    || userName === rs.Object.Teacher || UserType === 10);
                  roleMeeting = isMaster ? 'master' : 'user';
                  if (!isMaster) {
                  }
                  console.log('roleMeeting: ', roleMeeting);
                  updatePermission();
                  handleZoomMeeting();

                  let a = $(".time-class").text().split(":");
                  let current_sec = +a[0] * 60 * 60 + +a[1] * 60 + +a[2];
                  console.log(current_sec /* + time * 60 */);
                  CountdownTime(current_sec /* + time * 60 */);
                }
              },
              failure: function (errMsg) {
                App.toastrSuccess(errMsg);
              },
            });
          } else {
            alert("Login failed");
          }
        })
        .catch((error) => console.log("error", error));
      // …
    }
    // window.addEventListener("message", listener888, false);
    try {
      idRoom888 = new URL(location.href).searchParams.get("roomId");
    } catch (error) {
      console.log(error);
    }
    socket.on("listRoom", (data) => {
      console.log('listRoom', data);
      listRoom = data;
      console.log(`  ~ data.length`, data.length);
      document.getElementById("room").innerHTML = data
        .reverse()
        .map(
          (item) =>
            `<option value="${item.roomName}" user-create="${item.userCreate}">${item.roomName}</option>`
        )
        .join("");
      if (data.length === 0) {
        $("#btn_join_room").addClass("disabled");
      } else {
        $("#btn_join_room").removeClass("disabled");
      }

    });
    socket.on("connect", () => {
      socket.emit("ready888", idRoom888);
    });
    socket.on("exitRoom", (data) => {
      $(".btn-eraser-clear")[0].click();
      $("#change-eraser")[0].click();
      $("#reset")[0].click();

      console.log("exit room", data);
      socket.emit("listRoom", () => { });
      alert("The master room has exited.\nPlease join a another room!");
      $("#create_room").removeClass("hidden");
      $("#login").removeClass("hidden");
      $("#join-room-animation").addClass("hidden");
      $("#room-btn-container").removeClass("hidden");
    })
    socket.on("callbackNotepad", function (data) {
      console.log(data);
      if (data.roomId == idRoom888) {
        listener888(data);
      }
    });
    // if (window && window.opener) {
    //     window.opener.postMessage('Ready!', 'http://localhost:6024');
    //     window.opener.postMessage('Ready!', 'https://888tutor.com');
    // }

    // if (window && window.parent) {
    //     window.parent.postMessage('Ready!', 'http://localhost:6024');
    //     window.parent.postMessage('Ready!', 'https://888tutor.com');
    // }

    function getListUserOnline888() {
      var myHeaders = new Headers();
      var requestOptions = {
        method: "POST",
        headers: myHeaders,
        redirect: "follow",
      };

      fetch(
        "http://localhost:6024/IkTeachHome/GetListUserOnlineNotepad",
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => {
          console.log(result);
          if (result.Error == false) {
            const users = result.Object;
            $("#listUsers")[0].innerHTML = "";
            listUserStatic888 = users;
            for (let i = 0; i < users.length - 1; i++) {
              $("#listUsers")[0].innerHTML += `
                            <li>
                                <div class="user-item">
                                    <div>
                                        <img src="assets/icons/61_Profile_User.png" alt="avatar">
                                        <span>${users[i].UserName}</span>
                                    </div>
                                </div>
                            </li>
                        `;
            }
          }
        })
        .catch((error) => console.log("error", error));
    }

    function loadData888(data) {
      layerNum = data.layerNum;
      layerStorage = data.layerStorage;
      pool_data = data.pool_data;

      $(".icon-selector").remove();
      layerStorage.forEach((layer, index) => {
        const li = document.createElement("li");

        li.classList.add("icon-layer", "icon-selector");
        $(li).attr("data-cnt", index + 1);
        $(li).attr("data-id", layer.id);
        console.log(`  ~ layer.id1`, layer.id);
        li.innerHTML = `<img src="assets/images/notepad/layer/layer-${index + 1
          }.png">`;

        $("#layers-body").append(li);
      });
      currentLayer = 1;
      canvas.id = layerStorage[0].id;

      canvas.clear();
      loadLayerCanvasJsonNew(pool_data, canvas);
      console.log(`  ~ loadLayerCanvasJsonNew`, 1);

      updateToolBarStatus();
    }

    function CountdownTime($time) {
      var $clock = $(".time-class");

      var min = new Date(new Date().valueOf() + $time * 1000);

      $clock.empty().countdown(min, function (event) {
        $(this).html(event.strftime("%H:%M:%S"));

        if (event.type == "finish") {
          $(".block-status-tutor").addClass("off");
          $("body.notepad-on").addClass("none-active");
        }
      });
    }
    // leave meeting click handler
    $("body").click(function (event) {
      var button = $(event.target).closest(
        "button.zmwebsdk-MuiButtonBase-root.zmwebsdk-MuiButton-root"
      );
      if (button.children().html() === "Leave Meeting") {
        $("#userListContainer").slideUp();
        $("#zoomCameraContainer").slideUp();
        $("#zoomChatContainer").slideUp();
        $("body").append($(".zmwebsdk-makeStyles-chatCustomize-3")[0]);
        if (isZoomFull) {
          $("#zoom-camera-expand")[0].click();
        }
      }
    });

    // chat zoom click event handler
    $("body").click(function (event) {
      var closeBtn = $(event.target).closest(
        'ul#menu-list-icon-more li:contains("Chat")'
      );
      if (closeBtn.length > 0) {
        if ($(".zmwebsdk-makeStyles-chatCustomize-3").length > 0) {
          $(".zmwebsdk-makeStyles-chatCustomize-3").css({ "z-index": "-1" });
          $("body").append($(".zmwebsdk-makeStyles-chatCustomize-3")[0]);
          $("#zoomChatContainer").slideUp();
        } else {
          setTimeout(() => {
            $("#meetingSDKChatElement").prepend(
              $(".zmwebsdk-makeStyles-chatCustomize-3")[0]
            );
            if (isZoomFull) {
              $(
                "div#meetingSDKChatElement > div > div > div > div:nth-child(2) > div:first-child"
              )[0]?.setAttribute("style", `height: ${0.6 * height}px !important`);
            } else $("#zoomChatContainer").slideDown();
          }, 100);
        }
      }
    });

    // full screen mode
    $("#zoom-camera-expand").click(function () {
      isZoomFull = !isZoomFull;
      if (!isZoomFull) {
        $("#online-learning").css({ display: "block" });
        $("#meetingSDKElement").css({ position: "relative", width: "100%" });
        $("#meetingSDKElement>div>div>div>div:nth-child(3)").css({ height: "" });
        $("#meetingSDKElement>div>div>div>div:nth-child(3)").css({ height: "" });
        $("#meetingSDKElement>div>div>div>div:nth-child(3)>div:first-child").css({
          height: "",
        });

        $("#suspension-view-tabpanel-thumbnail").css({ height: "auto" });
        // $('#suspension-view-tabpanel-speaker>div:first-child').css({ 'height': '135px' })
        $(".attend-video-list").css({
          position: "relative",
          overflow: "hidden",
          width: "100%",
          height: "fit-content",
          background: "transparent",
        });

        $("#zoomCameraContainer").append($(".attend-video-list")[0]);
        $("#zoomChatContainer").append($("#meetingSDKChatElement")[0]);
        $("#meetingSDKChatElement").css({
          position: "relative",
          top: "0",
          right: "0",
        });
        $(
          "div#meetingSDKChatElement > div > div > div > div:nth-child(2) > div:first-child"
        ).css({ height: "135px" });

        $(this).html('<i class="fa fa-arrows-alt" aria-hidden="true"></i>');

        if ($(".zmwebsdk-makeStyles-chatCustomize-3").length === 0) {
          setTimeout(() => {
            $(
              "#meetingSDKElement>div>div>div:nth-child(2)>div:nth-child(5)>button"
            )[0]?.click();
            $("#menu-list-icon-more li:contains('Chat')")[0]?.click();
          }, 10);
        }
      } else {
        if ($(".zmwebsdk-makeStyles-chatCustomize-3").length > 0) {
          $(
            "#meetingSDKElement>div>div>div:nth-child(2)>div:nth-child(5)>button"
          )[0]?.click();
          $("#menu-list-icon-more li:contains('Chat')")[0]?.click();
        }

        const height = $("body").height();
        $("#online-learning").css({ display: "none" });
        $("#meetingSDKElement").css({ position: "absolute" });
        // $('#suspension-view-tabpanel-speaker>div:first-child').css({ 'height': '90vh' })
        $("#meetingSDKElement>div>div>div>div:nth-child(3)").css({
          height: `${0.9 * height}px`,
        });
        $("#meetingSDKElement>div>div>div>div:nth-child(3)>div:first-child").css({
          height: `${0.9 * height}px`,
        });
        $("#suspension-view-tabpanel-thumbnail").css({
          height: `${0.9 * height}px`,
        });
        $(".attend-video-list").css({
          position: "absolute",
          overflow: "visible",
          top: "0",
          left: "0",
          width: "100%",
          height: "100%",
          background: "#000",
        });

        $("body").append($(".attend-video-list")[0]);
        $("body").append($("#meetingSDKChatElement")[0]);
        $("#meetingSDKChatElement").css({
          position: "absolute",
          top: `${0.2 * height}px`,
          right: "0",
          border: "1px solid #555",
          "border-radius": "10px",
        });
        $(
          "div#meetingSDKChatElement > div > div > div > div:nth-child(2) > div:first-child"
        )[0]?.setAttribute("style", `height: ${0.6 * height}px !important`);

        $(this).html('<i class="fa fa-compress" aria-hidden="true"></i>');
      }
    });

    // add meeting to list meeting
    function addNewMeeting(name, id) {
      const li = document.createElement("li");
      const joinButton = document.createElement("button");
      const div = document.createElement("div");

      li.innerHTML = `
                <p>${name}</p>
            `;
      li.classList.add("device-item");

      joinButton.innerHTML = '<i class="fa fa-play" aria-hidden="true"></i>';
      joinButton.classList.add("btn", "btn-primary");
      joinButton.value = id;

      joinButton.onclick = function () {
        jQuery.ajax({
          type: "POST",
          url:
            "https://admin.metalearn.vn/MobileLogin/GetZoomSdkExamSchedule?id=" +
            id,
          contentType: "application/json",
          dataType: "JSON",
          success: function (rs) {
            if (rs.Error) {
              alert(rs.Title);
              // App.toastrError(rs.Title);
            } else {
              zoomConfig = {
                sdkKey: rs.Object.SdkKey,
                sdkSecret: rs.Object.SdkSecret,
                meetingNumber: rs.Object.MeetingNumber,
                username: $("#username")[0].value,
                password: rs.Object.Password,
                signature: rs.Object.Signature,
              };
              idMeeting = id;
              const isMaster = (zoomConfig.username === rs.Object.CreatedBy
                || UserType === 10);
              roleMeeting = isMaster ? 'master' : 'user';
              if (!isMaster) {
              }
              console.log('roleMeeting: ', roleMeeting);
              updatePermission();
              handleZoomMeeting();
            }
          },
          failure: function (errMsg) {
            App.toastrSuccess(errMsg);
          },
        });
      };

      div.appendChild(joinButton);
      li.appendChild(div);

      $(`.list-tutor-schedule`)[0].appendChild(li);
    }
    // jquery object click hanlder start
    isCurrentlyDrawingJ.on('click', stopDrawing);
    isRequestingDrawingJ.on('click', stopDrawing);
    isNotDrawingJ.on('click', requestDrawing);
    haveAllDrawingPermissionJ.on('click', togglePermissionAllFalse);
    haveNoDrawingPermissionJ.on('click', togglePermissionAllTrue);
    // jquery object click hanlder end
    function updatePermission() {
      if (isCurrentlyDrawing()) {
        isCurrentlyDrawingJ.removeClass('hidden');
        $("#menu-main").removeClass('disabled-element');
      }
      else {
        isCurrentlyDrawingJ.addClass('hidden');
        $("#menu-main").addClass('disabled-element');
      }
      if (isRequestingDrawing()) {
        isRequestingDrawingJ.removeClass('hidden');
      }
      else {
        isRequestingDrawingJ.addClass('hidden');
      }
      if (isNotDrawing()) {
        isNotDrawingJ.removeClass('hidden');
      }
      else {
        isNotDrawingJ.addClass('hidden');
      }
      if (haveAllDrawingPermission()) {
        haveAllDrawingPermissionJ.removeClass('hidden');
        haveNoDrawingPermissionJ.addClass('hidden');
      }
      else {
        haveNoDrawingPermissionJ.removeClass('hidden');
        haveAllDrawingPermissionJ.addClass('hidden');
      }
    }
    function isCurrentlyDrawing() {
      const permissionToDraw = roleMeeting === 'master';
      const indexD = listUserMeeting.findIndex(x => x.username === userNameMeeting) ?? -1;
      if (indexD !== -1) {
        return (listUserMeeting[indexD].isDrawing && (permissionToDraw || listUserMeeting[indexD].haveDrawingPermission));
      }
      else {
        return false;
      }
    }
    function isRequestingDrawing() {
      const permissionToDraw = roleMeeting === 'master';
      const indexD = listUserMeeting.findIndex(x => x.username === userNameMeeting) ?? -1;
      if (indexD !== -1) {
        return (listUserMeeting[indexD].isDrawing && !(permissionToDraw || listUserMeeting[indexD].haveDrawingPermission));
      }
      else {
        return false;
      }
    }
    function isNotDrawing() {
      const indexD = listUserMeeting.findIndex(x => x.username === userNameMeeting) ?? -1;
      if (indexD !== -1) {
        return !listUserMeeting[indexD].isDrawing;
      }
      else {
        return true;
      }
    }
    function haveAllDrawingPermission() {
      return !listUserMeeting.some(x => !x.haveDrawingPermission && !x.isHidden);
    }
    function stopDrawing(event) {
      const indexD = listUserMeeting.findIndex(x => x.username === userNameMeeting);
      if (indexD !== -1) {
        listUserMeeting[indexD].isDrawing = false;
        if (roleMeeting !== 'master') {
          listUserMeeting[indexD].haveDrawingPermission = false;
        }
        const room = listUserMeeting[indexD].roomName;
        socket.emit('updateMember', { room, userID: userNameMeeting, memberChange: listUserMeeting[indexD] });
      }
    }
    function requestDrawing(event) {
      const indexD = listUserMeeting.findIndex(x => x.username === userNameMeeting);
      if (indexD !== -1) {
        listUserMeeting[indexD].isDrawing = true;
        if (roleMeeting === 'master') {
          listUserMeeting[indexD].haveDrawingPermission = true;
        }
        const room = listUserMeeting[indexD].roomName;
        socket.emit('updateMember', { room, userID: userNameMeeting, memberChange: listUserMeeting[indexD] });
      }
    }
    function acceptRequest(e) {
      console.log(e.target.parentElement.value);
      const index = e.target.parentElement.value;
      if (roleMeeting !== 'master') {
        // return this.service.messageErorr(this.translate.instant('DRAWING_CANVAS.TS_NO_PERMISSION'));
        return alert('Bạn không có quyền duyệt yêu cầu');
      }
      const user = listUserMeeting[index];
      user.haveDrawingPermission = !user.haveDrawingPermission;
      const room = user.roomName;
      socket.emit('updateMember', { room, userID: user.username, memberChange: user });
    }
    function togglePermissionAllTrue() {
      const val = true;
      if (roleMeeting !== 'master') {
        // return this.service.messageErorr(this.translate.instant('DRAWING_CANVAS.TS_NO_PERMISSION'));
        return alert('Bạn không có quyền duyệt yêu cầu');
      }
      const room = listUserMeeting[0].roomName;
      socket.emit('togglePermissionAll', { room, value: val });
    }
    function togglePermissionAllFalse() {
      const val = false;
      if (roleMeeting !== 'master') {
        // return this.service.messageErorr(this.translate.instant('DRAWING_CANVAS.TS_NO_PERMISSION'));
        return alert('Bạn không có quyền duyệt yêu cầu');
      }
      const room = listUserMeeting[0].roomName;
      socket.emit('togglePermissionAll', { room, value: val });
    }

    function updateToolBarStatus() {
      console.log(`  ~ updateToolBarStatus`);
      // set layer icon
      $(`.icon-selector`).removeClass("active");
      $(`.icon-selector`)[currentLayer - 1]?.classList.add("active");

      // set grid icon
      var grid = layerStorage[currentLayer - 1].canvas.gridObj;

      $("#grids-body .btn-grid").removeClass("active");
      $(`#grids-body .btn-grid[data-grid="${grid}"]`).addClass("active");

      // set canvas bg color
      var bg = layerStorage[currentLayer - 1].canvas.backgroundColor;
      canvas.setBackgroundColor(`${bg}`, canvas.renderAll.bind(canvas));
      $("#grids-body .btn-color-grid").removeClass("active");
      $(`#grids-body .btn-color-grid[data-color="${bg}"]`).addClass("active");
    }

    function addNewObject(object) {
      const li = document.createElement("li");
      li.classList.add("li-padding");
      li.innerHTML = `
                <a>${object.type} - ${object.objectID}</a>
            `;
      li.onclick = function () {
        var zoom = canvas.getZoom();
        canvas.setZoom(1); // reset zoom so pan actions work as expected
        let vpw = canvas.width / zoom;
        let vph = canvas.height / zoom;
        let x = object.left - vpw / 2; // x is the location where the top left of the viewport should be
        let y = object.top - vph / 2; // y idem
        canvas.absolutePan({ x: x, y: y });
        canvas.setZoom(zoom);
      };
      $(`.list-object`)[0].appendChild(li);
    }
    function resetObjList() {
      $(`.list-object`)[0].innerHTML = "";
      for (const item of canvas._objects) {
        addNewObject(item);
      }
    }

    function showMediaMenu(svg, name) {
      $(`.${name}-popup-class .list`)[0].innerHTML = "";
      svg.src.forEach((item) => addNewRecord(name, item.id));

      const zoom = canvas.getZoom();
      const left =
        (svg.left + (svg.width / 2) * svg.scaleX) * zoom +
        canvas.viewportTransform[4] -
        160;
      let top = svg.top * zoom + canvas.viewportTransform[5] - 100;
      if (name == "takephoto") top += 60;

      if (svg.src.length > 0) {
        if (name == "mic") {
          audioRecorded.src = svg.src[svg.src.length - 1].blob;
          audioRecorded.load();
        } else if (name == "camera") {
          cameraRecorded.src = svg.src[svg.src.length - 1].blob;
          cameraRecorded.load();
        } else if (name == "takephoto") {
          takephotoImg.src = svg.src[svg.src.length - 1].url;
        }
      } else {
        if (name == "mic") {
          audioRecorded.src = "";
        } else if (name == "camera") {
          cameraRecorded.src = "";
        } else if (name == "takephoto") {
          takephotoImg.style.display = "none";
        }
      }

      $(`.${name}-popup-class`).css({ top: top + "px", left: left + "px" });
      $(`.${name}-popup-class`).removeClass("hidden");

      if (name != "takephoto") {
        $(`#objBlink-${name}`)[0].innerText = svg.blink ? "ON" : "OFF";
        $(`#textColor-${name}`)[0].value = svg.colorText;
        $(`#borderColor-${name}`)[0].value = svg.colorBorder;
      }
      // $(`#lineStyle-${name}`)[0].value = svg.lineStyle;

      // $(`#borderWidth-${name}`)[0].value = svg.widthBorder;
      // $(`#objCurve-${name}`)[0].value = svg.curve;
      // $(`#objAngle-${name}`)[0].value = svg.angle;

      if (svg.pathObj) {
        const value = svg.pathObj.path
          .map((point) => `[${parseInt(point[2])}, ${parseInt(point[1])}]`)
          .join(" ");
        $(`#pathObj-${name}`).val(value);
      } else $(`#pathObj-${name}`).val("Empty");

      if (svg.isMoving) {
        $(`#pathMovingMark-${name}`).css({ left: "33px", background: "#ff0000" });
      } else {
        $(`#pathMovingMark-${name}`).css({ left: "1px", background: "#aaa" });
      }

      // $(`#pathMovingRepeat-${name}`)[0].checked = svg.isRepeat;
      // $(`#pathMovingSpeed-${name}`)[0].value = svg.speedMoving;

      if (svg.lineType == "waving") {
        top =
          Math.cos(svg.angle) * svg.top * zoom + canvas.viewportTransform[5] - 60;
        left =
          Math.cos(svg.angle) * (svg.left + (svg.width / 2) * svg.scaleX) * zoom +
          canvas.viewportTransform[4] -
          180;
      }
    }

    function startActiveMedia(svg) {
      const name = svg.nameDevice;

      svg.on("moving", function () {
        $(`.${name}-popup-class`).addClass("hidden");
      });

      svg.startMoving = function () {
        startPathAnimation(svg);
      };

      // start object animation if isMoving
      if (svg.isMoving) svg.startMoving();
      if (svg.blink) blink(svg);

      changeCoordinateConnectLine(svg);

      svg.on("mousedblclick", function () {
        var check = $(`.${name}-popup-class`).hasClass("hidden");
        activeDeviceObject = this;
        activeObject = this;

        if (check) {
          // re render list
          showMediaMenu(svg, name);
        } else {
          $(`.${name}-popup-class`).addClass("hidden");
        }
      });

      svg.on("mousedown", function (e) {
        activeDeviceObject = this;
        activeObject = this;

        touchPopupMenu(e.pointer, () => showMediaMenu(svg, name));
      });
    }

    $("#menuMore-mic").on("click", function (e) {
      const subMenu = $("#sub-menu-mic")[0];
      if (subMenu.style.visibility === "hidden") {
        $("#sub-menu-mic").css({
          visibility: "visible",
          top: 50 + "px",
          left: 0 + "px",
        });
      } else {
        $("#sub-menu-mic").css({ visibility: "hidden" });
      }
    });

    $("#menuMore-camera").on("click", function (e) {
      const subMenu = $("#sub-menu-camera")[0];
      if (subMenu.style.visibility === "hidden") {
        $("#sub-menu-camera").css({
          visibility: "visible",
          top: 50 + "px",
          left: 0 + "px",
        });
      } else {
        $("#sub-menu-camera").css({ visibility: "hidden" });
      }
    });

    $("#menuMore-file").on("click", function (e) {
      const subMenu = $("#sub-menu-file")[0];
      if (subMenu.style.visibility === "hidden") {
        $("#sub-menu-file").css({
          visibility: "visible",
          top: 50 + "px",
          left: 0 + "px",
        });
      } else {
        $("#sub-menu-file").css({ visibility: "hidden" });
      }
    });

    $("#size-mic li").click(function () {
      let font_size = parseInt($(this).attr("value"));
      activeObject.item(1).set({
        fontSize: font_size,
      });
      updateLocal(
        pool_data,
        activeObject.objectID,
        activeObject.toObject(customAttributes),
        socket,
        false
      );

      document.getElementById("current-size-mic").innerHTML =
        font_size + ` <span class="caret">`;
      canvas.requestRenderAll();
    });

    $("#size-camera li").click(function () {
      let font_size = parseInt($(this).attr("value"));
      activeObject.item(1).set({
        fontSize: font_size,
      });
      updateLocal(
        pool_data,
        activeObject.objectID,
        activeObject.toObject(customAttributes),
        socket,
        false
      );

      document.getElementById("current-size-camera").innerHTML =
        font_size + ` <span class="caret">`;
      canvas.requestRenderAll();
    });

    $("#size-file li").click(function () {
      let font_size = parseInt($(this).attr("value"));
      activeObject.item(1).set({
        fontSize: font_size,
      });
      updateLocal(
        pool_data,
        activeObject.objectID,
        activeObject.toObject(customAttributes),
        socket,
        false
      );

      document.getElementById("current-size-file").innerHTML =
        font_size + ` <span class="caret">`;
      canvas.requestRenderAll();
    });

    $("#objBlink-mic").on("click", function () {
      activeObject.blink = !activeObject.blink;
      if (activeObject.blink) {
        this.innerText = "ON";
        blink(activeObject);
      } else {
        this.innerText = "OFF";
      }
      updateLocal(
        pool_data,
        activeObject.objectID,
        activeObject.toObject(customAttributes),
        socket,
        false
      );
    });

    $("#objBlink-camera").on("click", function () {
      activeObject.blink = !activeObject.blink;
      if (activeObject.blink) {
        this.innerText = "ON";
        blink(activeObject);
      } else {
        this.innerText = "OFF";
      }
      updateLocal(
        pool_data,
        activeObject.objectID,
        activeObject.toObject(customAttributes),
        socket,
        false
      );
    });

    $("#objBlink-file").on("click", function () {
      activeObject.blink = !activeObject.blink;
      if (activeObject.blink) {
        this.innerText = "ON";
        blink(activeObject);
      } else {
        this.innerText = "OFF";
      }
      updateLocal(
        pool_data,
        activeObject.objectID,
        activeObject.toObject(customAttributes),
        socket,
        false
      );
    });

    $("#textColor-mic").on("input", function () {
      activeObject.item(1).set({
        fill: this.value,
      });
      activeObject.colorText = this.value;
      canvas.requestRenderAll();
      updateLocal(
        pool_data,
        activeObject.objectID,
        activeObject.toObject(customAttributes),
        socket,
        false
      );
    });

    $("#textColor-camera").on("input", function () {
      activeObject.item(1).set({
        fill: this.value,
      });
      activeObject.colorText = this.value;
      canvas.requestRenderAll();
      updateLocal(
        pool_data,
        activeObject.objectID,
        activeObject.toObject(customAttributes),
        socket,
        false
      );
    });

    $("#textColor-file").on("input", function () {
      activeObject.item(1).set({
        fill: this.value,
      });
      activeObject.colorText = this.value;
      canvas.requestRenderAll();
      updateLocal(
        pool_data,
        activeObject.objectID,
        activeObject.toObject(customAttributes),
        socket,
        false
      );
    });

    $("#borderColor-mic").on("input", function () {
      console.log(activeObject);
      activeObject.item(0).set({
        stroke: this.value,
      });
      activeObject.item(0)._objects.forEach((x) => {
        x.set({
          fill: this.value,
        });
      });
      activeObject.colorBorder = this.value;
      canvas.requestRenderAll();
      updateLocal(
        pool_data,
        activeObject.objectID,
        activeObject.toObject(customAttributes),
        socket,
        false
      );
    });

    $("#borderColor-camera").on("input", function () {
      activeObject.item(0).set({
        stroke: this.value,
      });
      activeObject.item(0)._objects.forEach((x) => {
        x.set({
          fill: this.value,
        });
      });
      activeObject.colorBorder = this.value;
      canvas.requestRenderAll();
      updateLocal(
        pool_data,
        activeObject.objectID,
        activeObject.toObject(customAttributes),
        socket,
        false
      );
    });

    $("#borderColor-file").on("input", function () {
      activeObject.item(0).set({
        stroke: this.value,
      });
      activeObject.item(0)._objects.forEach((x) => {
        x.set({
          fill: this.value,
        });
      });
      activeObject.colorBorder = this.value;
      canvas.requestRenderAll();
      updateLocal(
        pool_data,
        activeObject.objectID,
        activeObject.toObject(customAttributes),
        socket,
        false
      );
    });

    // popup path-menu
    $("#pathMover-mic").on("click", function () {
      const pathMenu = $("#path-menu-mic")[0];
      if (pathMenu.style.visibility === "hidden") {
        $("#path-menu-mic").css({
          visibility: "visible",
          top: 50 + "px",
          left: 0 + "px",
        });

        if (activeObject.isMoving) {
          $(`#pathMovingMark-mic`).css({ left: "33px", background: "#ff0000" });
        } else {
          $(`#pathMovingMark-mic`).css({ left: "1px", background: "#aaa" });
        }
      } else {
        $("#path-menu-mic").css({ visibility: "hidden" });
      }
    });
    $("#pathMover-camera").on("click", function () {
      const pathMenu = $("#path-menu-camera")[0];
      if (pathMenu.style.visibility === "hidden") {
        $("#path-menu-camera").css({
          visibility: "visible",
          top: 50 + "px",
          left: 0 + "px",
        });

        if (activeObject.isMoving) {
          $(`#pathMovingMark-camera`).css({
            left: "33px",
            background: "#ff0000",
          });
        } else {
          $(`#pathMovingMark-camera`).css({ left: "1px", background: "#aaa" });
        }
      } else {
        $("#path-menu-camera").css({ visibility: "hidden" });
      }
    });
    $("#pathMover-file").on("click", function () {
      const pathMenu = $("#path-menu-file")[0];
      if (pathMenu.style.visibility === "hidden") {
        $("#path-menu-file").css({
          visibility: "visible",
          top: 50 + "px",
          left: 0 + "px",
        });

        if (activeObject.isMoving) {
          $(`#pathMovingMark-file`).css({ left: "33px", background: "#ff0000" });
        } else {
          $(`#pathMovingMark-file`).css({ left: "1px", background: "#aaa" });
        }
      } else {
        $("#path-menu-file").css({ visibility: "hidden" });
      }
    });

    // start create path
    $("#pathCreate-mic").on("click", function () {
      hidePopupMenu();
      $("#pathBtns-mic").css({ visibility: "visible" });

      $("#pathToggleDrawing-mic").click();

      $(".pencil-class").addClass("hidden");
    });
    $("#pathCreate-camera").on("click", function () {
      hidePopupMenu();
      $("#pathBtns-camera").css({ visibility: "visible" });

      $("#pathToggleDrawing-camera").click();

      $(".pencil-class").addClass("hidden");
    });
    $("#pathCreate-file").on("click", function () {
      hidePopupMenu();
      $("#pathBtns-file").css({ visibility: "visible" });

      $("#pathToggleDrawing-file").click();

      $(".pencil-class").addClass("hidden");
    });

    // startIdx for check path created for path moving
    // after creating path, get the last path for obj moving
    var startIdxMic;
    $("#pathToggleDrawing-mic").on("click", function () {
      if (activeObject.isDrawingPath) {
        $("#drwToggleDrawMode").click();
        $(".tool-btn").removeClass("active");
        $(".pencil-class").addClass("hidden");

        activeObject.isDrawingPath = false;
        this.innerHTML = '<i class="fa fa-pencil" aria-hidden="true"></i>';

        const pathObj = canvas._objects.splice(
          startIdxMic,
          canvas._objects.length - startIdxMic
        )[0];

        activeObject.pathObj = pathObj.item(0);

        canvas.renderAll();

        const value = activeObject.pathObj.path
          .map((point) => `[${parseInt(point[2])}, ${parseInt(point[1])}]`)
          .join(" ");
        $("#pathObj-mic").val(value);
      } else {
        $("#drwToggleDrawMode").click();
        $(".tool-btn").removeClass("active");
        $(".pencil-class").addClass("hidden");

        activeObject.isDrawingPath = true;
        this.innerHTML = '<i class="fa fa-check" aria-hidden="true"></i>';

        startIdxMic = canvas._objects.length;

        $("#pathObj-mic").val("Empty");
      }
      updateLocal(
        pool_data,
        activeObject.objectID,
        activeObject.toObject(customAttributes),
        socket
      );
    });
    var startIdxCamera;
    $("#pathToggleDrawing-camera").on("click", function () {
      if (activeObject.isDrawingPath) {
        $("#drwToggleDrawMode").click();
        $(".tool-btn").removeClass("active");
        $(".pencil-class").addClass("hidden");

        activeObject.isDrawingPath = false;
        this.innerHTML = '<i class="fa fa-pencil" aria-hidden="true"></i>';

        const pathObj = canvas._objects.splice(
          startIdxCamera,
          canvas._objects.length - startIdxCamera
        )[0];

        activeObject.pathObj = pathObj.item(0);

        canvas.renderAll();

        const value = activeObject.pathObj.path
          .map((point) => `[${parseInt(point[2])}, ${parseInt(point[1])}]`)
          .join(" ");
        $("#pathObj-camera").val(value);
      } else {
        $("#drwToggleDrawMode").click();
        $(".tool-btn").removeClass("active");
        $(".pencil-class").addClass("hidden");

        activeObject.isDrawingPath = true;
        this.innerHTML = '<i class="fa fa-check" aria-hidden="true"></i>';

        startIdxCamera = canvas._objects.length;

        $("#pathObj-camera").val("Empty");
      }
      updateLocal(
        pool_data,
        activeObject.objectID,
        activeObject.toObject(customAttributes),
        socket
      );
    });
    var startIdxFile;
    $("#pathToggleDrawing-file").on("click", function () {
      if (activeObject.isDrawingPath) {
        $("#drwToggleDrawMode").click();
        $(".tool-btn").removeClass("active");
        $(".pencil-class").addClass("hidden");

        activeObject.isDrawingPath = false;
        this.innerHTML = '<i class="fa fa-pencil" aria-hidden="true"></i>';

        const pathObj = canvas._objects.splice(
          startIdxFile,
          canvas._objects.length - startIdxFile
        )[0];

        activeObject.pathObj = pathObj.item(0);

        canvas.renderAll();

        const value = activeObject.pathObj.path
          .map((point) => `[${parseInt(point[2])}, ${parseInt(point[1])}]`)
          .join(" ");
        $("#pathObj-file").val(value);
      } else {
        $("#drwToggleDrawMode").click();
        $(".tool-btn").removeClass("active");
        $(".pencil-class").addClass("hidden");

        activeObject.isDrawingPath = true;
        this.innerHTML = '<i class="fa fa-check" aria-hidden="true"></i>';

        startIdxFile = canvas._objects.length;

        $("#pathObj-file").val("Empty");
      }
      updateLocal(
        pool_data,
        activeObject.objectID,
        activeObject.toObject(customAttributes),
        socket
      );
    });

    $("#closePathDrawMode-camera").on("click", function () {
      activeObject.isDrawingPath = false;
      $("#pathBtns-camera").css({ visibility: "hidden" });

      // $('#edit-form').css({ 'visibility': 'visible' });
      $("#path-menu-camera").css({ visibility: "visible" });
    });
    $("#closePathDrawMode-mic").on("click", function () {
      activeObject.isDrawingPath = false;
      $("#pathBtns-mic").css({ visibility: "hidden" });

      // $('#edit-form').css({ 'visibility': 'visible' });
      $("#path-menu-mic").css({ visibility: "visible" });
    });
    $("#closePathDrawMode-file").on("click", function () {
      activeObject.isDrawingPath = false;
      $("#pathBtns-file").css({ visibility: "hidden" });

      // $('#edit-form').css({ 'visibility': 'visible' });
      $("#path-menu-file").css({ visibility: "visible" });
    });

    $("#pathMovingRepeat-mic").on("change", function () {
      activeObject.isRepeat = !activeObject.isRepeat;
      updateLocal(
        pool_data,
        activeObject.objectID,
        activeObject.toObject(customAttributes),
        socket
      );
    });
    $("#pathMovingRepeat-camera").on("change", function () {
      activeObject.isRepeat = !activeObject.isRepeat;
      updateLocal(
        pool_data,
        activeObject.objectID,
        activeObject.toObject(customAttributes),
        socket
      );
    });
    $("#pathMovingRepeat-file").on("change", function () {
      activeObject.isRepeat = !activeObject.isRepeat;
      updateLocal(
        pool_data,
        activeObject.objectID,
        activeObject.toObject(customAttributes),
        socket
      );
    });

    $("#pathMovingSpeed-mic").on("input", function () {
      activeObject.speedMoving = this.value;
      updateLocal(
        pool_data,
        activeObject.objectID,
        activeObject.toObject(customAttributes),
        socket
      );
    });
    $("#pathMovingSpeed-camera").on("input", function () {
      activeObject.speedMoving = this.value;
      updateLocal(
        pool_data,
        activeObject.objectID,
        activeObject.toObject(customAttributes),
        socket
      );
    });
    $("#pathMovingSpeed-file").on("input", function () {
      activeObject.speedMoving = this.value;
      updateLocal(
        pool_data,
        activeObject.objectID,
        activeObject.toObject(customAttributes),
        socket
      );
    });

    $("#pathMovingMode-mic").on("click", function () {
      if (activeObject.pathObj) {
        activeObject.isMoving = !activeObject.isMoving;
        if (activeObject.isMoving) {
          $("#pathMovingMark-mic").css({ left: "33px", background: "#ff0000" });
          hidePopupMenu();
          activeObject.startMoving();
        } else {
          $("#pathMovingMark-mic").css({ left: "1px", background: "#aaa" });
        }
      }
      socket.emit("pathMoving", {
        objectID: activeObject.objectID,
        moving: activeObject.isMoving,
      });
    });
    $("#pathMovingMode-camera").on("click", function () {
      if (activeObject.pathObj) {
        activeObject.isMoving = !activeObject.isMoving;
        if (activeObject.isMoving) {
          $("#pathMovingMark-camera").css({
            left: "33px",
            background: "#ff0000",
          });
          hidePopupMenu();
          activeObject.startMoving();
        } else {
          $("#pathMovingMark-camera").css({ left: "1px", background: "#aaa" });
        }
        socket.emit("pathMoving", {
          objectID: activeObject.objectID,
          moving: activeObject.isMoving,
        });
      }
    });
    $("#pathMovingMode-file").on("click", function () {
      if (activeObject.pathObj) {
        activeObject.isMoving = !activeObject.isMoving;
        if (activeObject.isMoving) {
          $("#pathMovingMark-file").css({ left: "33px", background: "#ff0000" });
          hidePopupMenu();
          activeObject.startMoving();
        } else {
          $("#pathMovingMark-file").css({ left: "1px", background: "#aaa" });
        }
        socket.emit("pathMoving", {
          objectID: activeObject.objectID,
          moving: activeObject.isMoving,
        });
      }
    });

    $(function () {
      var sidemenu = $(".opacitySideMenu");
      var tray_menu = $(".menu-tray");
      var $task_wrap = $(".taskbar-notepad");

      $task_wrap.find(".tool-btn").on("click", function () {
        var $this = $(this);
        if (
          $(".tool-btn.active").length > 0 &&
          $(".tool-btn.active")[0] != $this[0]
        ) {
          if ($(".tool-btn.active").hasClass("tool-nosubmenu")) {
            $(".tool-btn.active").removeClass("active");
          } else {
            $(".tool-btn.active")[0].click();
          }
        }

        $(".tooltip-wrap").removeClass("show-tt");

        var cnt = getCanvas();
        $("#panel").find(".typing-input").remove();
        $("#add-type-box").removeClass("active");

        if ($this.hasClass("active")) {
          $this.removeClass("active");
          // $this.parent(".tool-submenu").addClass("hidden");
          $(`.tool-submenu.${$this.data('name')}-class`).addClass("hidden");

          tray_menu.removeClass("has-submenutool");
          sidemenu.removeClass("has-submenutool");
        } else {
          $task_wrap.find(".tool-btn").removeClass("active");
          $task_wrap.find(".tool-submenu").addClass("hidden");

          $this.addClass("active");
          // $this.next(".tool-submenu").removeClass("hidden");
          $(`.tool-submenu.${$this.data('name')}-class`).removeClass("hidden");

          tray_menu.addClass("has-submenutool");
          sidemenu.addClass("has-submenutool");
        }
      });

      var timeout;
      $(".tooltip-wrap").on("mouseenter", function () {
        var $thisElement = $(this);

        if (timeout != null) {
          clearTimeout(timeout);
        }

        timeout = setTimeout(function () {
          $(".tooltip-wrap").removeClass("show-tt");
          $thisElement.addClass("show-tt");
        }, 1000);
      });

      $(".tooltip-wrap").on("mouseleave", function () {
        if (timeout != null) {
          clearTimeout(timeout);
          timeout = null;
        }
      });

      $(window).on("mouseover", function () {
        $(".tooltip-wrap").removeClass("show-tt");
      });

      $("#change-eraser").on("click", function () {
        if ($(this).hasClass("active")) {
          $("#erasers-body li").removeClass("active");
          $("#erasers-body li[data-eraser='30']").addClass("active");

          $("#divrubber").css({
            display: "block",
            top: "100px",
            left: "100px",
            width: "30px",
            height: "30px",
            visibility: "visible",
          });
          $("#controlrubber").addClass(`css-cursor-30`);

          canEraser();
        } else {
          $("#divrubber").css({ display: "none" });
        }
      });

      $("#change-size-pencil").on("click", function () {
        $(this).addClass("active");
        var cnt = getCanvas();

        $("#erasers-body li").removeClass("active");
        $("#divrubber").css("display", "none");
        canDraw();

        if (parseInt($(this).attr("data-layer")) === cnt - 3) {
          return;
        }

        $(this).attr("data-layer", cnt - 3);
      });

      $("#btn-send").on("click", function () {
        showSidebar = !showSidebar;
        if (showSidebar) {
          $(".wrap-sidebar-left").css({ right: "0" });
          $(".button-send img").css({ transform: "rotate(0)" });
        } else {
          $(".wrap-sidebar-left").css({
            right: `-${$(".wrap-sidebar-left").width()}px`,
          });
          $(".button-send img").css({ transform: "rotate(180deg)" });
        }
      });

      function loadData(data) {
        console.log(`  ~ loadData`);
        layerNum = data.layerNum;
        layerStorage = data.layerStorage;
        pool_data = data.pool_data;

        $(".icon-selector").remove();
        layerStorage.forEach((layer, index) => {
          const li = document.createElement("li");

          li.classList.add("icon-layer", "icon-selector");
          $(li).attr("data-cnt", index + 1);
          $(li).attr("data-id", layer.id);
          console.log(`  ~ layer.id2`, layer.id);
          li.innerHTML = `<img src="assets/images/notepad/layer/layer-${index + 1
            }.png">`;

          $("#layers-body").append(li);
        });
        currentLayer = 1;
        canvas.id = layerStorage[0].id;

        canvas.clear();
        loadLayerCanvasJsonNew(pool_data, canvas);
        console.log(`  ~ loadLayerCanvasJsonNew`, 2);

        updateToolBarStatus();
      }

      async function callApiJsonData(page, length, sheetName = "") {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

        var urlencoded = new URLSearchParams();
        urlencoded.append("page", page);
        urlencoded.append("length", length);
        urlencoded.append("sheetName", sheetName);

        var requestOptions = {
          method: "POST",
          headers: myHeaders,
          body: urlencoded,
          redirect: "follow",
        };
        var rs = await fetch(
          `https://888tutor.com/IkTeachHome/JTableDictSheet1`,
          requestOptions
        );
        return await rs.json();
      }
      var dataApiQuestion;
      var questionApiObj;
      var qList;
      var idSelect;
      async function saveDataWithApi() {
        if (dataApiQuestion?.question) {
          console.log(questionApiObj);
          dataApiQuestion.question = questionApiObj.toObject(customAttributes);
        }
        if (dataApiQuestion?.q) {
          console.log(qList);
          Object.keys(qList).forEach((q) => {
            qList[q].object = qList[q].object.toObject(customAttributes);
          });
          dataApiQuestion.q = qList;
        }
        dataApiQuestion.more = pool_data.filter((o) => o.isWorkSheet);
        console.log(dataApiQuestion.more);

        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var value = JSON.stringify(dataApiQuestion);

        worksheetList.forEach((sheet) => {
          if (sheet.Id === idSelect) {
            sheet.Questions = value;
          }
        });

        var raw = JSON.stringify({
          id: idSelect,
          value: value,
        });

        var requestOptions = {
          method: "POST",
          headers: myHeaders,
          body: raw,
          redirect: "follow",
        };
        var rs = await fetch(
          `https://888tutor.com/IkTeachHome/SetJsonDictSheet`,
          requestOptions
        );
        return await rs.json();
      }

      $("#icon-save-api").on("click", async function () {
        try {
          var rs = await saveDataWithApi();
          console.log(rs);
        } catch (error) {
          alert(`Saving data error: ${error}`);
        }
      });
      function renderDataFromApi(canvas, data) {
        $(".btn-eraser-clear")[0].click();
        $("#change-eraser")[0].click();
        $("#reset")[0].click();
        var dataQuestions = JSON.parse(data.Questions);
        console.log(dataQuestions);
        if (!dataQuestions) throw "Data emtpy!";
        dataApiQuestion = dataQuestions;
        if (dataQuestions.more) {
          pool_data = dataQuestions.more;
          loadLayerCanvasJsonNew(pool_data, canvas);
          console.log(`  ~ loadLayerCanvasJsonNew`, 3);
          socket.emit("update", pool_data);
        }
        if (dataQuestions.question) {
          worksheetType = "question";
          if (dataQuestions.question.type === "textbox") {
            questionApiObj = createQuestionTextbox(dataQuestions.question, true);
          } else if (typeof dataQuestions.question === "string") {
            questionApiObj = createQuestionTextbox(dataQuestions.question, false);
          } else throw "Invalid question format!";
          if (dataQuestions.q) {
            var q = dataQuestions.q;
            qList = q;
            for (const property in q) {
              if (q[property].image) {
                if (q[property].object) {
                  var soundUrl = q[property].sound
                    ? "https://mwd.s3.amazonaws.com/mathsounds/en/" +
                    q[property].sound
                    : "";
                  imageModeFromObject(
                    canvas,
                    q[property].object,
                    soundUrl,
                    property,
                    q
                  );
                } else {
                  var soundUrl = q[property].sound
                    ? "https://mwd.s3.amazonaws.com/mathsounds/en/" +
                    q[property].sound
                    : "";
                  imageModeFromUrl(
                    canvas,
                    "https://888tutor.com/images/math/en/" + q[property].image,
                    soundUrl,
                    property,
                    q
                  );
                }
              } else {
                throw "Invalid question format";
              }
            }
          }
        } else if (dataQuestions.quiz) {
          worksheetType = "quiz";

          var nextLeft = 200;
          dataQuestions.quiz.forEach((question) => {
            question = createQuestionTextbox(question, false, { left: nextLeft });
            nextLeft += question.width + 10;
          });
        }

        if (!worksheetType) throw "Invalid worksheet format!";
      }

      // create question textbox
      function createQuestionTextbox(question, isObject, options = {}) {
        options = {
          ...options,
          stroke: null,
          // set this for reset
          // left: (canvas.width / 2 + canvas.getLeft()) * canvas.getScale(),
          // top: (50 + canvas.getTop()) * canvas.getScale(),
        };
        if (worksheetType === "quiz")
          options = {
            ...options,
            stroke: 0,
            fontSize: 20,
          };
        if (isObject) {
          var textbox = new fabric.Textbox(question.text, {
            fontSize: question.fontSize,
            fontFamily: question.fontFamily,
            top: question.top,
            left: question.left,
            width: question.width,
            height: question.height,
            scaleX: question.scaleX,
            scaleY: question.scaleY,
            fill: question.fill,
            originX: "center",
            originY: "center",
            textAlign: question.textAlign,
            ...options,
          });
          setDefaultAttributes(textbox);
          startActiveObject(textbox);
          canvas.add(textbox);
          isLoadDataLocal = false;
          emitEvent(false);
          return textbox;
        }
        var textbox = new fabric.Textbox(question, {
          fontSize: 36,
          fontFamily: "Time New Roman",
          left: (canvas.width / 2 + canvas.getLeft()) * canvas.getScale(),
          top: (50 + canvas.getTop()) * canvas.getScale(),
          fill: "#333",
          textAlign: "center",
          originX: "center",
          originY: "center",
          width: question.length * 20,
          ...options,
        });
        canvas.add(textbox);
        setDefaultAttributes(textbox);
        startActiveObject(textbox);
        isLoadDataLocal = false;
        emitEvent(false);

        return textbox;
      }
      // create a img object
      function imageModeFromUrl(canvas, urlImage, urlAudio, property) {
        fabric.util.loadImage(
          urlImage,
          function (para) {
            var img = new fabric.Image(para);
            const maxWidth = 600;
            const maxHeight = 400;

            if (img.width > maxWidth) {
              img.scaleToWidth(maxWidth);
            }

            if (img.height > maxHeight) {
              img.scaleToHeight(maxHeight);
            }

            // console.log(e.target.result.name);

            setDefaultAttributes(img);
            startActiveObject(img);

            img.set({
              left: (canvas.width / 2 + canvas.getLeft()) * canvas.getScale(),
              top: (300 + canvas.getTop()) * canvas.getScale(),
              name: "image",
              originX: "center",
              originY: "center",
              nameImageContent: "",
              soundWorksheet: urlAudio,
              objectID: randomID(),
            });
            console.log(img);
            canvas.add(img);
            img.on("mousedblclick", function () {
              this.playSound("soundWorksheet");
            });
            qList[property].object = img;
            isLoadDataLocal = false;
            emitEvent(false);

            // var grid = canvas._objects.find(obj => obj.name === 'grid')
            // if (grid) {
            //     img.moveTo(1)
            // }
            // else img.moveTo(0)

            canvas.requestRenderAll();
          },
          null,
          {
            crossOrigin: "anonymous",
          }
        );
      }

      function imageModeFromObject(canvas, obj, urlAudio, property, q) {
        fabric.util.loadImage(
          obj.src,
          function (para) {
            var img = new fabric.Image(para);
            img.set({
              // left: (canvas.width / 2 + canvas.getLeft()) * canvas.getScale(),
              // top: (400 + canvas.getTop()) * canvas.getScale(),
              top: obj.top,
              left: obj.left,
              width: obj.width,
              height: obj.height,
              scaleX: obj.scaleX,
              scaleY: obj.scaleY,
              originX: "center",
              originY: "center",
              isBackground: obj.isBackground,
            });
            startActiveObject(img);

            canvas.add(img);
            qList[property].object = img;

            isLoadDataLocal = false;
            emitEvent(false);

            canvas.requestRenderAll();
          },
          null,
          {
            crossOrigin: "anonymous",
          }
        );
      }

      // $(document).ready( function () {
      //     var table = $('#table_id')
      //     console.log(table);
      //     table.DataTable({
      //         data: [
      //             [
      //                 'id1',
      //                 'sheet1',
      //                 'questions'
      //             ]
      //         ]
      //     });

      //     // table.draw();
      // } );
      var pageCurrent = 0;
      function renderWorkSheetPagination(page, pos, val, prev, length, num) {
        // pos += next
        if (pos >= 1 && pos <= 3) {
          $(".page-item").removeClass("active disable");
          $(`.page-item[data-page="${page}"]`).addClass("active");

          if (page === 1 && pos === 1)
            $(`.page-item[data-pos="${0}"]`).addClass("disable");
          if (page === Math.ceil(num / length) && pos === 3)
            $(`.page-item[data-pos="${4}"]`).addClass("disable");
          return;
        }
        if (pos === 0) {
          if (prev === 1) pos = 1;
          else pos = prev - 1;
        } else if (pos === 4) {
          if (prev === 3) pos = 3;
          else pos = prev + 1;
        }

        $("#worksheet-page").html("");

        for (var i = 0; i < 5; i++) {
          var li;
          if (i === 0) {
            li = $(`
                    <li data-next='-1' data-pos=${i} data-page='${page - 1
              }' class="page-item ${pos === 1 && page === 1 ? "disable" : ""}">
                        <a class="page-link" href="#" aria-label="Previous">
                            <span aria-hidden="true">&laquo;</span>
                            <span class="sr-only">Previous</span>
                        </a>
                    </li>
                    `).appendTo("#worksheet-page");
          } else if (i === 4) {
            li = $(`
                    <li data-next='1' data-pos=${i} data-page='${page + 1
              }' class="page-item ${pos === 3 && page === Math.ceil(num / length) ? "disable" : ""
              }">
                        <a class="page-link" href="#" aria-label="Previous">
                            <span aria-hidden="true">&raquo;</span>
                            <span class="sr-only">Next</span>
                        </a>
                    </li>
                    `).appendTo("#worksheet-page");
          } else {
            li = $(`
                    <li data-next='0' data-pos=${i} data-page='${page + i - 1
              }' class="page-item ${pos === i ? "active" : ""}">
                        <a class="page-link" href="#">${page + i - 1}</a>
                    </li>
                    `).appendTo("#worksheet-page");
          }

          li.on("click", function () {
            var pageData = parseInt($(this).data("page"));
            var next = parseInt($(this).data("pos"));
            var prev = parseInt($(this).data("next"));

            if (pageData !== pageCurrent) {
              pageCurrent = pageData;
              console.log(page, pageData, pos);
              loadWorkSheetData(pageData, length, val, next, pos);
            }
          });
          var pageData = parseInt($(this).data("page"));
          var next = parseInt($(this).data("pos"));
          var prev = parseInt($(this).data("next"));
        }
      }

      var worksheetList = null;
      async function loadWorkSheetData(page, length, val, pos = 0, prev = 1) {
        var rs = await callApiJsonData(page, length, val);
        console.log("load worksheet", rs);

        var list = rs?.Object;

        if (list) {
          $("#worksheet").html("");
          worksheetList = list;

          list?.forEach((sheet) => {
            const li = $(`
                        <li>
                            <div class="worksheet-item">
                              <span>${sheet.Index}</span>
                              <span>${sheet.SheetName}</span>
                              (<span>${sheet.GradeName} - ${sheet.GradeType}</span>)
                            </div>
                        </li>
                    `).appendTo("#worksheet");

            $(li).on("click", function () {
              idSelect = sheet.Id;
              console.log({ idSelect });
              try {
                var data = worksheetList.find((sheet) => sheet.Id === idSelect);
                renderDataFromApi(canvas, data);
              } catch (error) {
                alert("Load worksheet error: " + error);
                $(".btn-eraser-clear")[0].click();
                $("#change-eraser")[0].click();
                $("#reset")[0].click();
                console.log(error);
              }
            });
          });

          renderWorkSheetPagination(page, pos, val, prev, length, rs.Code);
        } else {
        }
      }
      $("#worksheet-search").on("keyup", function () {
        var val = $.trim(this.value);
        if (val !== null && val !== undefined && val !== "") {
          loadWorkSheetData(1, 200, val);
        } else {
          loadWorkSheetData(1, 200, "");
        }
      });

      var showPw = false
      $("#show-pw").on("click", function () {
        showPw = !showPw;
        if (showPw) {
          $("#pass")[0].type = "text";
          $("#show-pw").html(`<i class="fa fa-eye" aria-hidden="true"></i>`);
        }
        else {
          $("#pass")[0].type = "password";
          $("#show-pw").html(`<i class="fa fa-eye-slash" aria-hidden="true"></i>`);
        }
      });

      window.jsPDF = window.jspdf.jsPDF;
      $("#icon-export").on("click", function () {
        var imgData = canvas.toDataURL("image/jpeg", 1.0);
        var pdf = new jsPDF();

        pdf.addImage(imgData, 'JPEG', 0, 0);
        pdf.save("canvas.pdf");
      });

      //vuong
      $("#login-form").on("submit", function (e) {
        e.preventDefault();
        if ($("#username")[0].value != "" && $("#pass")[0].value != "") {
          // $('#modal-wrapper').css({ 'display': 'none' });

          const today = new Date();
          const user = {
            userID: randomID(),
            name: $("#username")[0].value,
            password: $("#pass")[0].value,
            time:
              today.getHours() +
              ":" +
              today.getMinutes() +
              ":" +
              today.getSeconds(),
            status: "available",
            raiseHand: "false",
          };
          var username = $("#username")[0].value;
          var myHeaders = new Headers();
          myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

          var urlencoded = new URLSearchParams();
          urlencoded.append("userName", $("#username")[0].value);
          urlencoded.append("password", $("#pass")[0].value);

          var requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: urlencoded,
            redirect: "follow",
          };
          //vuong
          fetch(
            "https://admin.metalearn.vn/MobileLogin/LoginNoCheckOnlineNodeJs",
            requestOptions
          )
            .then((response) => response.json())
            .then(async (result) => {
              console.log(result);
              // getListUserOnline();
              if (result.Error == false || result.Object == "LOGGED_IN") {
                userNameMeeting = $("#username")[0].value;
                displayName = result.Object.GivenName;
                UserType = result.Object.UserType;
                socket.emit("joinRoom", { name: user.name, time: user.time, isWeb: true });
                socket.on("getUsers", (data) => {
                  var isExistList = data.map((x) => {
                    return listUserStatic.findIndex((y) => x.name == y.UserName);
                  });
                  var isRemove = data.findIndex((x) => x.time == "") != -1;
                  var isNotExist = isExistList.indexOf(-1) != -1;
                  if (isNotExist || isRemove) {
                    getListUserOnline();
                  }
                });

                // socket.emit('fetch-data-request', 'public', function () {
                // });
                // socket.on('fetch-data-to-client', (data) => {
                //     console.log(data);
                //     loadData({
                //         layerNum: data.layer,
                //         layerStorage: data.layerStorage,
                //         pool_data: data.drawData
                //     })
                // });

                getListUserOnline();

                socket.emit("listRoom", () => { });

                // $("#login").addClass("hidden");
                $("#login-modal").addClass("hidden");
                $("#create_room").removeClass("hidden");
                $("#logout").removeClass("hidden");
                $("#nameuser").text(username);

                loadChat(username, stanza, clients, testichat);
                getSubscribe(clients, stanza, testichat);
                // var json = await callApiJsonData();
                // renderDataFromApi(canvas, json);

                await loadWorkSheetData(1, 200);
              } else {
                alert("Login failed");
              }
            })
            .catch((error) => {
              alert("Login failed!");
              console.log("error", error);
            });
          // check login from admin.metalearn.vn
          // login()
          // login success, call emit, on, jquery
          // control popup
        } else {
          alert("Username and password cannot be blank!");
        }
      });
      $("#room").on("change", function () {
        $("#btn_join_room").removeClass("disabled");
      })
      const roomId = randomID();
      $("#room-create").on("click", function () {
        const userCreate = $("#username")[0].value;
        const roomName = $("#room-name").val();
        const newRoom = { roomName, userCreate };
        listRoom.push(newRoom);
        // console.log("🚀 ~ newRoom", newRoom)
        $("#room").append(
          `<option selected value="${roomName}">${roomName}</option>`
        );
        socket.emit("createRoom", newRoom);
        socket.emit("joinRoom", { room: roomName, userID: userCreate, isWeb: true });
        $("#create_room").addClass("hidden");
        $("#login").addClass("hidden");
      });

      $("#room-create-cancel").on("click", function () {
        $("#create_room").removeClass("hidden");
        $("#create_room_modal").addClass("hidden");
      });

      $("#btn_create_room").on("click", function () {
        $("#create_room").addClass("hidden");
        $("#create_room_modal").removeClass("hidden");
      });

      $("#btn_join_room").on("click", function () {
        const userID = $("#username")[0].value;
        const roomName = document.getElementById("room").value;
        const room = listRoom.find((item) => item.roomName === roomName);
        const userCreate = room?.userCreate;

        if (userCreate != userID) {
          console.log("🚀 ~ join room", userCreate, userID, roomName);
          socket.emit("validateLoginRoom", { room: roomName, userID });

          $("#join-room-animation").removeClass("hidden");
          $("#room-btn-container").addClass("hidden");
        }
      });

      $("#btn_join_smartwork").on("click", function () {
        $("#join-room-animation").removeClass("hidden");
        $("#room-btn-container").addClass("hidden");
        $('#join_meeting').click();
      });

      socket.on("loginRoom", ({ room, userID, socketIDUser }) => {
        console.log(`  loginRoom`, { room, userID })
        document.getElementById("login_room").classList.remove("hidden");
        document.getElementById("login_room").innerHTML = "";
        //   document.getElementById('login_room').innerHTML=`<p>${userID} join ${room}</p>
        //   <div class="">
        //     <button class="rounded"  id="btn_yes" style="padding: 10px;">Yes</button>
        //     <button class="rounded" id="btn_no" style="padding: 10px;">No</button>
        //   </div>`
        document.getElementById(
          "login_room"
        ).innerHTML = `<div style="display: flex;" class="modal" >
              <div id="validate-room" class="animate" style="padding: 20px 30px; margin: 100px auto auto; border-radius: 8px;">
                <p style="color: #fff;margin-bottom: 20px;font-size: large; text-align: center;">${userID} wants to join this room?</p>
                <div style="display: flex;justify-content: center;">
                  <button class="rounded room-bg text-title btn btn-success"  id="btn_yes" style="border: #000; padding: 10px 30px;">Yes</button>
                  <button class="rounded room-bg text-title btn btn-danger" id="btn_no" style="border: #000; padding: 10px 30px; margin-left: 30px;">No</button>
                </div>
              </div>
            </div>`;

        const handleLoginRoom = (value) => {
          console.log(`  ~ value handleLoginRoom`, value);
          socket.emit("resultJoinRoom", { ...value, socketIDUser, room, userID });
          document.getElementById("login_room").classList.add("hidden");
        };

        $("#btn_yes").on("click", () => handleLoginRoom({ joinRoom: true }));
        $("#btn_no").on("click", () => handleLoginRoom({ joinRoom: false }));
      });
      socket.on('updateMemberSuccess', () => {
        const pin = '';
        socket.emit('reloadMembers', `Smart Work tutor_schedule_${pin?.trim() ?? ''}_${idMeeting}`);
      });

      socket.on("resultJoinRoom", (data) => {
        const { room, joinRoom, userID } = data;
        console.log(`  ~ data resultJoinRoom`, room, data);
        roomIdMeeting = room;
        if (joinRoom) {
          // document.getElementById('create_room').classList.add('hidden')
          socket.emit("joinRoom", { room, userID, isWeb: true });
          // socket.emit("fetch-data-request", room);

          // socket.emit("fetch-data-request", room);
          socket.on("fetch-data-to-client", (data) => {
            console.log("fetch-data-to-client", data);
            loadData({
              layerNum: data.layer,
              layerStorage: data.layerStorage,
              pool_data: data.drawData,
            });
          });
          console.log(`  ~ socket id`, socket.id)
          $("#login").addClass("hidden");
        }
      });

      $("#sub-menu li").on("click", function (e) {
        e.stopPropagation();
      });

      $(".worksheet-dropdown-btn").click(function () {
        $(".worksheet-dropdown").slideToggle();
      });
      $("#logout").on("click", function () {
        var myHeaders = new Headers();

        var requestOptions = {
          method: "POST",
          headers: myHeaders,
          redirect: "follow",
        };

        fetch(
          `https://admin.metalearn.vn/MobileLogin/LogOutNodeJs?userName=${$("#username")[0].value
          }`,
          requestOptions
        )
          .then((response) => response.json())
          .then((result) => {
            //   console.log(result);
            socket.emit("joinRoom", { name: $("#username")[0].value, time: "", isWeb: true });
            window.location.href = window.location.href;
          })
          .catch((error) => console.log("error", error));
      });
      var listUserStatic = [];
      function getListUserOnline() {
        var myHeaders = new Headers();
        var requestOptions = {
          method: "POST",
          headers: myHeaders,
          redirect: "follow",
        };

        fetch(
          "https://admin.metalearn.vn/MobileLogin/GetListUserOnlineNotepad",
          requestOptions
        )
          .then((response) => response.json())
          .then((result) => {
            //   console.log(result);
            if (result.Error == false) {
              const users = result.Object;
              $("#listUsers")[0].innerHTML = "";
              listUserStatic = users;
              for (let i = 0; i < users.length; i++) {
                $("#listUsers")[0].innerHTML += `
                                <li>
                                    <div class="user-item">
                                        <div>
                                            <img src="assets/icons/61_Profile_User.png" alt="avatar">
                                            <span>${users[i].UserName}</span>
                                        </div>
                                    </div>
                                </li>
                            `;
              }
            }
          })
          .catch((error) => console.log("error", error));
      }

      $("#join_meeting").on("click", function () {
        console.log("join meeting");
        var myHeaders = new Headers();
        var requestOptions = {
          method: "POST",
          headers: myHeaders,
          redirect: "follow",
        };
        const today = new Date();
        const yyyy = today.getFullYear();
        let mm = today.getMonth() + 1; // Months start at 0!
        let dd = today.getDate();

        if (dd < 10) dd = "0" + dd;
        if (mm < 10) mm = "0" + mm;

        const formattedToday = dd + "/" + mm + "/" + yyyy;
        const id = roomIdMeeting.split("_").slice(-1)[0] ?? '';
        fetch(
          `https://admin.metalearn.vn/MobileLogin/GetListTutorScheduleNew?userName=${$("#username")[0].value
          }&id=${id}`,
          requestOptions
        )
          .then((response) => response.json())
          .then((result) => {
            $("#login").addClass("hidden");
            $(`#zoom-list`).removeClass("hidden");
            $(`.list-tutor-schedule`)[0].innerHTML = "";
            result.Object.forEach((x) => addNewMeeting(x.Title, x.Id));
          })
          .catch((error) => console.log("error", error));

        // var SDK_KEY = '_69ffPW_SMuIZfIqo87SAQ';
        // var SDK_SECRET = 'eVxnaFdGkvfIuiU3tX1e7vaSa6XcpkOtY6QS';
        // var meetingConfig = {
        //     sdkKey: "SKSO0HsGDi0kIiQom9UWHFuRXrPHOKCkN8tG",
        //     sdkSecret: "g6Idg5RMw3pMuqfrCFKsDgHTWNmGuycoZsEi",
        //     meetingNumber: "82951749289",
        //     signature: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzZGtLZXkiOiJTS1NPMEhzR0RpMGtJaVFvbTlVV0hGdVJYclBIT0tDa044dEciLCJtbiI6IjgyOTUxNzQ5Mjg5Iiwicm9sZSI6IjAiLCJpYXQiOjE2NjI3MTMyOTMsImV4cCI6MTY2MjcxNDQ5MywiYXBwS2V5IjoiU0tTTzBIc0dEaTBrSWlRb205VVdIRnVSWHJQSE9LQ2tOOHRHIiwidG9rZW5FeHAiOjE2NjI3MjA0OTN9.6L40sAT8I6ofQeFRn_J5Tlr4Wp6zO8aO72BD6GS6zR4",
        //     userName: "sigma14",
        //     passWord: "850450",
        //     leaveUrl: "localhost:8801",
        //     role: 0,
        // };

        // let meetingSDKElement = document.getElementById('meetingSDKElement')

        // client.init({
        //     debug: true,
        //     zoomAppRoot: meetingSDKElement,
        //     language: 'en-US',
        //     customize: {
        //         meetingInfo: [
        //             'topic',
        //             'host',
        //             'mn',
        //             'pwd',
        //             'telPwd',
        //             'invite',
        //             'participant',
        //             'dc',
        //             'enctype',
        //         ],
        //         toolbar: {
        //             buttons: [
        //                 {
        //                     text: 'Custom Button',
        //                     className: 'CustomButton',
        //                     onClick: () => {
        //                         console.log('custom button')
        //                     }
        //                 }
        //             ]
        //         }
        //     }
        // })
        // client.join({
        //     sdkKey: meetingConfig.sdkKey,
        //     sdkSecret: meetingConfig.sdkSecret,
        //     signature: meetingConfig.signature, // role in SDK Signature needs to be 0
        //     role: 0,
        //     meetingNumber: meetingConfig.meetingNumber,
        //     password: meetingConfig.passWord,
        //     userName: meetingConfig.userName,

        // });
        // console.log(client);
      });
      $("#zoom_close").on("click", function () {
        $(`#zoom-list`).addClass("hidden");
      });

      // load svg for user device using
      function loadSVG(name, svg, player) {
        fabric.loadSVGFromURL(svg, function (objects, options) {
          const svg = fabric.util.groupSVGElements(objects, options);
          const maxWidth = 50;
          const maxHeight = 50;

          // resize svg if size is too large
          if (svg.width > maxWidth) {
            svg.scaleToWidth(maxWidth);
          }
          if (svg.height > maxHeight) {
            svg.scaleToHeight(maxHeight);
          }
          var size = 50;
          var obj = createTextBoxFooter(svg, size);
          obj.set({
            top: 100,
            left: 100,
            objectID: randomID(),
            name: "media",
            nameDevice: name,
            player: player,
            src: [],
          });
          obj.on("mouseup", handleMouseUpSvg);

          startActiveMedia(obj, name);

          canvas.add(obj);
          isLoadDataLocal = false;
          emitEvent();
        });

        $("#moveObject")[0].click();
      }

      // create svg file canvas
      $("#icon-attach-file").click(function () {
        fabric.loadSVGFromURL("assets/svg/file.svg", function (objects, options) {
          const svg = fabric.util.groupSVGElements(objects, options);
          const maxWidth = 50;
          const maxHeight = 50;

          // resize svg if size is too large
          if (svg.width > maxWidth) {
            svg.scaleToWidth(maxWidth);
          }
          if (svg.height > maxHeight) {
            svg.scaleToHeight(maxHeight);
          }
          var size = 50;
          var obj = createTextBoxFooter(svg, size);

          obj.set({
            top: 100,
            left: 100,
            objectID: randomID(),
            name: "media",
            nameDevice: "attach-file",
            files: [],
          });

          startActiveFileObj(obj);

          canvas.add(obj);
          isLoadDataLocal = false;
          emitEvent();
        });

        $("#moveObject")[0].click();
      });
      $("#attach-file-view-close").click(function () {
        $("#attach-file-container").css({ display: "none" });
      });

      // select file and add to list
      $("#attach-file-input").on("change", function (e) {
        const ext = ["pdf, doc, xlsx"];
        for (let i = 0; i < e.target.files.length; i++) {
          const file = e.target.files[i];
          if (!ext.some(s => file.name.includes(s))) {
            alert("Invalid file's type!");
            continue;
          }
          let check = attachFileObj.files.every((item) => item.name != file.name);

          if (check) {
            const reader = new FileReader();
            reader.onloadend = async function () {
              var formdata = new FormData();
              formdata.append("fileUpload", file, file.name);
              formdata.append("CateRepoSettingId", "2255");
              formdata.append("CreatedBy", "admin");

              var requestOptions = {
                method: "POST",
                body: formdata,
                redirect: "follow",
              };
              var fileExtension = file.name.split(".").slice(-1)[0];
              var response = await fetch(
                "https://admin.metalearn.vn/MobileLogin/InsertFile",
                requestOptions
              );
              var json = await response.json();
              console.log("load file", json);
              if (json.Object) {
                var object = json.Object;
                const data = {
                  id: createMediaID(),
                  type: object.Type,
                  url: object.Url,
                  cloudId: object.CloudId,
                  catFileId: json.ID,
                  extension: fileExtension,
                  name: file.name,
                };
                attachFileObj.files.push(data);
                addNewAttachFile(data);
                updateLocal(
                  pool_data,
                  attachFileObj.objectID,
                  attachFileObj.toObject(customAttributes),
                  socket
                );
              }
            };

            reader.readAsDataURL(file);
          }
        }
        this.value = "";
      });
      $("#attach-file-close").click(function () {
        $(".attach-file-popup-class").addClass("hidden");
      });

      $("#attach-link-file").click(function () {
        $("#link-file-container").toggle();
      });

      $("#link-file-open").click(function () {
        const url = $("#link-file")[0].value;
        if (url != "") {
          const arr = url.split("/");
          const data = {
            id: createMediaID(),
            url: url,
            type: "EXTERNAL",
            name: arr[arr.length - 1],
          };

          attachFileObj.files.push(data);
          addNewAttachFile(data);
          updateLocal(
            pool_data,
            attachFileObj.objectID,
            attachFileObj.toObject(customAttributes),
            socket
          );

          $("#link-file-close")[0].click();
        } else {
          alert("Invalid url file!");
        }
        $("#link-file").val("");
      });

      $("#link-file-close").click(function () {
        $("#link-file-container").css({ display: "none" });
      });

      // add mic svg
      $("#icon-mic").click(function () {
        loadSVG("mic", "assets/svg/microphone.svg");
      });
      // start / stop audio record
      $("#mic-record").click(function () {
        if (!isRecordAudio) {
          navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
            audioStream = stream;
            audioRecorder = new MediaRecorder(stream);

            const audioChunks = [];
            audioRecorder.addEventListener("dataavailable", (event) => {
              audioChunks.pop();
              audioChunks.push(event.data);
            });

            audioRecorder.addEventListener("stop", () => {
              const audioBlob = new Blob(audioChunks, {
                type: "audio/wav",
              });
              const id = createMediaID();
              console.log("audio blob:", audioBlob);
              pushAudio(audioBlob, id, "wav");
            });

            audioRecorder.start();
            activeDeviceObject.blink = true;

            blink(activeDeviceObject);
            this.classList.remove("btn-primary");
            this.classList.add("btn-warning");
            this.innerHTML = '<i class="fa fa-stop" aria-hidden="true"></i>';
          });
        } else {
          audioStream.getTracks().forEach((track) => {
            track.stop();
          });
          audioRecorder.stop();
          activeDeviceObject.blink = false;
          this.classList.remove("btn-warning");
          this.classList.add("btn-primary");
          this.innerHTML = '<i class="fa fa-microphone" aria-hidden="true"></i>';
        }

        isRecordAudio = !isRecordAudio;
      });
      $("#mic-upload").click(function () {
        $("#mic-file").click();
      });
      $("#mic-file").on("change", function (e) {
        var file = e.target.files[0];
        var type = file.name.split(".").slice(-1)[0];
        const id = createMediaID();
        pushAudio(file, id, type);
      });
      async function pushAudio(audioBlob, id, type) {
        var formdata = new FormData();
        formdata.append("fileUpload", audioBlob, `${id}.${type}`);
        formdata.append("CateRepoSettingId", "2255");
        formdata.append("CreatedBy", "admin");

        var requestOptions = {
          method: "POST",
          body: formdata,
          redirect: "follow",
        };
        var response = await fetch(
          "https://admin.metalearn.vn/MobileLogin/InsertFile",
          requestOptions
        );
        var result = await response.json();
        if (!result.Error && result.Object) {
          console.log("Send record data success!", result);

          // const audioUrl = await uploadTempFile(result.Object.Url);
          const audioUrl = result.Object.Url;
          const file = {
            id: id,
            catFileId: result.ID,
            name: `${id}.${type}`,
            url: audioUrl,
            blob: audioBlob,
          };

          listMedia.push({
            id: id,
            name: `${id}.${type}`,
            blob: audioBlob,
            url: audioUrl,
          });

          audioRecorded.src = audioUrl;
          audioRecorded.load();

          // download
          var a = document.createElement("a");
          document.body.appendChild(a);
          a.style = "display: none";
          a.href = audioUrl;
          a.download = file.name;
          // a.click();
          // window.URL.revokeObjectURL(audioUrl);
          document.body.removeChild(a);

          // add new record
          activeDeviceObject.src.push(file);
          addNewRecord("mic", id);

          updateLocal(
            pool_data,
            activeDeviceObject.objectID,
            activeDeviceObject.toObject(customAttributes),
            socket
          );
        } else {
          alert(`Send data failed: ${result.Title}`);
        }
        // try {
        //     let reader = new FileReader();
        //     reader.addEventListener('load', async e => {

        //     });
        //     reader.readAsDataURL(audioBlob);

        // } catch(e) {
        //     console.log(e);
        //     alert(`File ${file.name} did not found in /file folder!`)
        // }
      }
      // close mic form
      $("#mic-close").click(function () {
        audioRecorded.pause();
        $(".mic-popup-class").addClass("hidden");
      });

      // add camera svg
      $("#icon-camera").click(function () {
        loadSVG("camera", "assets/svg/camera.svg");
      });
      // start / stop video record
      $("#camera-record").click(function () {
        if (!isRecordVideo) {
          navigator.mediaDevices
            .getUserMedia({ video: true, audio: true })
            .then((stream) => {
              cameraRecorded.style.display = "none";
              cameraRecording.style.display = "inline-block";

              videoStream = stream;
              cameraRecording.srcObject = stream;
              cameraRecording.play();
              cameraRecorder = new MediaRecorder(stream);

              const videoChunks = [];
              cameraRecorder.addEventListener("dataavailable", (event) => {
                videoChunks.pop();
                videoChunks.push(event.data);
              });

              cameraRecorder.addEventListener("stop", () => {
                const videoBlob = new Blob(videoChunks, {
                  type: "video/mp4",
                });
                const id = createMediaID();
                pushVideo(videoBlob, id, "mp4");
              });

              cameraRecorder.start();
              activeDeviceObject.blink = true;
              $("#camera-mark").css({ display: "block" });

              blink(activeDeviceObject);
              this.classList.remove("btn-primary");
              this.classList.add("btn-warning");
              this.innerHTML = '<i class="fa fa-stop" aria-hidden="true"></i>';
            })
            .catch((error) => {
              console.log(error);
              activeDeviceObject.blink = false;
              this.classList.remove("btn-warning");
              this.classList.add("btn-primary");
              this.innerHTML =
                '<i class="fa fa-video-camera" aria-hidden="true"></i>';
              isRecordVideo = false;
            });
        } else {
          $("#camera-mark").css({ display: "none" });

          videoStream.getTracks().forEach((track) => {
            track.stop();
          });
          cameraRecorder.stop();
          activeDeviceObject.blink = false;
          this.classList.remove("btn-warning");
          this.classList.add("btn-primary");
          this.innerHTML =
            '<i class="fa fa-video-camera" aria-hidden="true"></i>';
        }

        isRecordVideo = !isRecordVideo;
      });
      $("#camera-upload").click(function () {
        $("#camera-file").click();
      });
      $("#camera-file").on("change", function (e) {
        var file = e.target.files[0];
        var type = file.name.split(".").slice(-1)[0];
        const id = createMediaID();
        pushVideo(file, id, type);
      });
      async function pushVideo(videoBlob, id, type) {
        var formdata = new FormData();
        formdata.append("fileUpload", videoBlob, `${id}.${type}`);
        formdata.append("CateRepoSettingId", "2255");
        formdata.append("CreatedBy", "admin");

        var requestOptions = {
          method: "POST",
          body: formdata,
          redirect: "follow",
        };
        var response = await fetch(
          "https://admin.metalearn.vn/MobileLogin/InsertFile",
          requestOptions
        );
        var result = await response.json();
        if (!result.Error && result.Object) {
          console.log("Send record data success!", result);

          const videoUrl = await uploadTempFile(result.Object.Url);
          console.log(videoUrl);
          const file = {
            id: id,
            catFileId: result.ID,
            name: `${id}.${type}`,
            url: "https://admin.metalearn.vn/" + videoUrl,
            blob: videoBlob,
          };

          listMedia.push({
            id: id,
            name: `${id}.${type}`,
            blob: videoBlob,
            url: "https://admin.metalearn.vn/" + videoUrl,
          });

          cameraRecorded.src = "https://admin.metalearn.vn/" + videoUrl;
          cameraRecorded.load();

          cameraRecording.pause();
          cameraRecorded.style.display = "inline-block";
          cameraRecording.style.display = "none";

          // download
          var a = document.createElement("a");
          document.body.appendChild(a);
          a.style = "display: none";
          a.href = "https://admin.metalearn.vn/" + videoUrl;
          a.download = file.name;
          // a.click();
          // window.URL.revokeObjectURL(audioUrl);
          document.body.removeChild(a);

          // add new record
          activeDeviceObject.src.push(file);
          addNewRecord("camera", id);

          updateLocal(
            pool_data,
            activeDeviceObject.objectID,
            activeDeviceObject.toObject(customAttributes),
            socket
          );
        } else {
          alert(`Send data failed: ${result.Title}`);
        }
        // let reader = new FileReader();
        // reader.addEventListener('load', async e => {
        // })
        // reader.readAsDataURL(videoBlob);
      }
      $("#camera-close").click(function () {
        cameraRecorded.pause();
        $(".camera-popup-class").addClass("hidden");
      });

      async function pushTakePhoto(blob, id, type) {
        var formdata = new FormData();
        formdata.append("fileUpload", blob, `${id}.${type}`);
        formdata.append("CateRepoSettingId", "2255");
        formdata.append("CreatedBy", "admin");

        var requestOptions = {
          method: "POST",
          body: formdata,
          redirect: "follow",
        };
        var response = await fetch(
          "https://admin.metalearn.vn/MobileLogin/InsertFile",
          requestOptions
        );
        var result = await response.json();
        console.log("Send record result:", result);
        if (!result.Error && result.Object) {
          const url = await uploadTempFile(result.Object.Url);
          const file = {
            id: id,
            catFileId: result.ID,
            name: `${id}.${type}`,
            url,
            blob,
          };

          listMedia.push({
            id: id,
            name: `${id}.${type}`,
            blob,
            url,
          });

          takephotoImg.src = url;
          takephotoImg.style.display = "block";

          // download
          // var a = document.createElement('a');
          // document.body.appendChild(a);
          // a.style = 'display: none';
          // a.href = audioUrl;
          // a.download = file.name;
          // a.click();
          // window.URL.revokeObjectURL(audioUrl);
          // document.body.removeChild(a);

          // add new record
          activeDeviceObject.src.push(file);
          addNewRecord("takephoto", id);

          updateLocal(
            pool_data,
            activeDeviceObject.objectID,
            activeDeviceObject.toObject(customAttributes),
            socket
          );
        } else {
          alert(`Send data failed: ${result.Title}`);
        }
        // try {
        //     takephotoImg.src = url;
        //     takephotoImg.style.display = 'block';

        //     activeDeviceObject.src.push({
        //         id,
        //         url,
        //         name: `${id}.${type}`
        //     })
        //     addNewRecord('takephoto', id);
        //     updateLocal(pool_data, activeDeviceObject.objectID, activeDeviceObject.toObject(customAttributes), socket)
        // } catch (e) {
        //     console.log(e);
        // }
      }
      // popup takephoto form
      $("#icon-takephoto").click(function () {
        loadSVG("takephoto", "assets/svg/takephoto.svg");
      });
      // take a photo
      $("#takephoto-capture").click(function () {
        navigator.mediaDevices
          .getUserMedia({ video: true, audio: false })
          .then((stream) => {
            var video = $("#takephoto-video")[0];
            var canvas = $("#takephoto-canvas")[0];

            video.srcObject = stream;

            setTimeout(() => {
              canvas
                .getContext("2d")
                .drawImage(video, 0, 0, canvas.width, canvas.height);

              stream.getTracks().forEach((track) => track.stop());
              canvas.toBlob((blob) => {
                console.log("photo blob:", blob);
                const id = createMediaID();
                pushTakePhoto(blob, id, "image/jpeg");
              }, "image/jpeg");

              // pushTakePhoto(canvas.toDataURL('image/jpeg'), id, 'jpeg')
            }, 500);
          })
          .then((blob) => {
            // const id = createMediaID();
            // const file = {
            //     id: id,
            //     name: `${id}.jpg`,
            //     url: `file/media/${id}.jpg`
            // }
            // takephotoImg.src = url;
            // takephotoImg.style.display = 'block';
            // download
            // var a = document.createElement('a');
            // document.body.appendChild(a);
            // a.style = 'display: none';
            // a.href = url;
            // a.download = file.name;
            // a.click();
            // window.URL.revokeObjectURL(url);
            // document.body.removeChild(a);
            // activeDeviceObject.src.push(file);
            // addNewRecord('takephoto', id);
            // try {
            // } catch(e) {
            //     console.log(e);
            //     alert(`File ${file.name} did not found in /file folder!`);
            // }
          });
      });
      // close takephoto form
      $("#takephoto-close").click(function () {
        $(".takephoto-popup-class").addClass("hidden");
        takephotoImg.src = "";
      });

      // popup screenshot form
      $("#icon-screenshot").click(function () {
        var check = $(".screenshot-popup-class").hasClass("hidden");
        if (check) {
          if (screenshotImg.srcset == "") {
            screenshotImg.style.display = "none";
          }
          $(".screenshot-popup-class").css({ top: "40px", left: "530px" });
          $(".screenshot-popup-class").removeClass("hidden");
        } else {
          $(".screenshot-popup-class").addClass("hidden");
          $("#moveObject")[0].click();
        }
      });
      // take a screenshot
      $("#screenshot-capture").click(function () {
        screenshotCapture(screenshotImg);
      });
      // close screenshot form
      $("#screenshot-close").click(function () {
        $(".screenshot-popup-class").addClass("hidden");
        screenshotImg.src = "";
        $("#moveObject")[0].click();
      });

      $("#icon-cover").click(function () {
        isChoosePort = !isChoosePort;
        if (!isChoosePort) {
          canvas.getObjects().forEach((obj) => {
            obj.portMark && canvas.remove(obj.portMark);
          });

          objCover = null;
        }
      });
      dragMediaElement(document.getElementById("mic-popup"));
      dragMediaElement(document.getElementById("camera-popup"));
      // dragMediaElement(document.getElementById("attach-file-popup"));

      function dragMediaElement(elmnt) {
        var pos1 = 0,
          pos2 = 0,
          pos3 = 0,
          pos4 = 0;
        if (document.getElementById(elmnt.id + "header")) {
          // if present, the header is where you move the DIV from:
          document.getElementById(elmnt.id + "header").onmousedown =
            dragMouseDown;
        } else {
          // otherwise, move the DIV from anywhere inside the DIV:
          elmnt.onmousedown = dragMouseDown;
        }

        function dragMouseDown(e) {
          e = e || window.event;
          e.preventDefault();
          // get the mouse cursor position at startup:
          pos3 = e.clientX;
          pos4 = e.clientY;
          document.onmouseup = closeDragElement;
          // call a function whenever the cursor moves:
          document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
          e = e || window.event;
          e.preventDefault();
          // calculate the new cursor position:
          pos1 = pos3 - e.clientX;
          pos2 = pos4 - e.clientY;
          pos3 = e.clientX;
          pos4 = e.clientY;
          // set the element's new position:
          elmnt.style.top = elmnt.offsetTop - pos2 + "px";
          elmnt.style.left = elmnt.offsetLeft - pos1 + "px";
        }

        function closeDragElement() {
          // stop moving when mouse button is released:
          document.onmouseup = null;
          document.onmousemove = null;
        }
      }

      function handleGroup() {
        if (!canvas.getActiveObject()) {
          return;
        }
        if (canvas.getActiveObject().type !== "activeSelection") {
          return;
        }
        const group = canvas.getActiveObject().toGroup();
        const objID = randomID();
        group.set({
          subTargetCheck: false,
          name: "custom-group",
          objectID: objID,
        });

        group._objects.forEach((o) => {
          o.groupID = objID;
          pool_data = pool_data.filter((item) => item.objectID !== o.objectID);
        });
        let data = {
          w: w,
          h: h,
          drawing: drawing,
          color: getColor(),
          id: id,
          userID: userID,
          objectID: objID,
          username: username,
          spessremo: getPencil(),
          room: stanza,
          layer: canvas.id,
          data: group.toObject(customAttributes),
        };
        pool_data.push(data);
        console.log("emit group", pool_data);
        socket.emit("update", pool_data);

        // setDefaultAttributes(group);
        // var listObject = group._objects;
        // for (let index = 0; index < listObject.length; index++) {
        //     const element = listObject[index];
        //     if (element.__eventListeners) {
        //         element.__eventListeners["mousedblclick"] = [];
        //     }
        //     if (element.type != 'textbox') {
        //         element.on('mousedblclick', handleDbclickChild);
        //     }
        //     else {
        //         element.on('mouseup', function (e) {
        //             if (e.button === 1) {
        //                 console.log("left click");
        //             }
        //             // if(e.button === 2) {
        //             //     console.log("middle click");
        //             // }
        //              if (e.button === 3) {
        //                 handleTextboxRightclick(this);
        //             }
        //         });
        //     }
        // }
        // startActiveObject(group);
        canvas.requestRenderAll();
        $("#moveObject")[0].click();

      }

      // group active objects
      $("#icon-group").click(function () {
        if (isGroup) {
          handleGroup()
        }
        isGroup = !isGroup;
      });

      canvas.on("mouse:down", function (opts) {
        // doTest()
        // console.log(shapes)
        var port = checkifInPorts(opts.pointer, shapes, selectedShapes, selectedPorts, lastSelectedPort)
        if (port) {
          //add sound
          var audio = new Audio('assets/connect.wav');
          audio.play()

          var portCenter = port.getCenterPoint();
          if (currentLine) {
            currentLine.set({
              x2: portCenter.x,
              y2: portCenter.y
            });

            // if in doTest phase
            if (doTestConnectPhase) {
              if (hasConnectingLine(selectedShapes[0], selectedShapes[1], answerLines)) {
                updateAnswerLines(selectedShapes[0], selectedShapes[1], selectedPorts[0], selectedPorts[1], answerLines, canvas);
              }
              else if (selectedShapes[0] !== selectedShapes[1] && selectedShapes.length === 2) {
                addAnswerLines(selectedShapes[0], selectedShapes[1], selectedPorts[0], selectedPorts[1], answerLines, canvas)
              }
              selectedPorts = [];
              selectedShapes = [];
              canvas.remove(currentLine);
              canvas.renderAll();
              currentLine = null;
              return;
            }
            //

            if (hasConnectingLine(selectedShapes[0], selectedShapes[1], connectingLines) && selectedShapes.length === 2 && selectedShapes[0] !== selectedShapes[1]) {
              updateConnectingLines(selectedShapes[0], selectedShapes[1], selectedPorts[0], selectedPorts[1], connectingLines, canvas, shapes);
            }
            else if (selectedShapes[0] !== selectedShapes[1] && selectedShapes.length === 2) {
              console.log('currentLine', doTestConnectPhase);
              connectShapes(selectedShapes[0], selectedShapes[1], selectedPorts[0], selectedPorts[1], connectingLines, canvas, shapes)
              // add sound
            }
            selectedPorts = [];
            selectedShapes = [];
            canvas.remove(currentLine);
            canvas.renderAll();
            currentLine = null;
            return;
          }
          else {
            currentLine = new fabric.Line([portCenter.x, portCenter.y, portCenter.x, portCenter.y], {
              fill: 'red',
              stroke: 'red',
              strokeWidth: 2,
              //dont select new line
              selectable: false,
              hasBorders: false,
              hasControls: false,
              lockMovementX: true, // Prevent horizontal movement
              lockMovementY: true, // Prevent vertical movement
            });
            canvas.add(currentLine); // Thêm đối tượng line vào canvas
            return;
          }
        }
        else if (checkifInShapes(opts.pointer, shapes)) {

          var shape = checkifInShapes(opts.pointer, shapes);
          if (selectedPorts.length === 1) {
            port = shape.ports[0]
            if (port) {
              //add sound
              var audio = new Audio('assets/connect.wav');
              audio.play()

              lastSelectedPort = shape.ports[0]
              selectedPorts.push(port);
              selectedShapes.push(shape);
              portCenter = port.getCenterPoint();
              if (currentLine) {
                currentLine.set({
                  x2: portCenter.x,
                  y2: portCenter.y
                });

                // if in doTest phase
                if (doTestConnectPhase) {
                  if (hasConnectingLine(selectedShapes[0], selectedShapes[1], answerLines)) {
                    updateAnswerLines(selectedShapes[0], selectedShapes[1], selectedPorts[0], selectedPorts[1], answerLines, canvas);
                  }
                  else if (selectedShapes[0] !== selectedShapes[1] && selectedShapes.length === 2) {
                    addAnswerLines(selectedShapes[0], selectedShapes[1], selectedPorts[0], selectedPorts[1], answerLines, canvas)
                  }
                  selectedPorts = [];
                  selectedShapes = [];
                  canvas.remove(currentLine);
                  canvas.renderAll();
                  currentLine = null;
                  return;
                }
                //

                if (hasConnectingLine(selectedShapes[0], selectedShapes[1], connectingLines) && selectedShapes.length === 2 && selectedShapes[0] !== selectedShapes[1]) {
                  updateConnectingLines(selectedShapes[0], selectedShapes[1], selectedPorts[0], selectedPorts[1], connectingLines, canvas, shapes);
                }
                else if (selectedShapes[0] !== selectedShapes[1] && selectedShapes.length === 2) {
                  connectShapes(selectedShapes[0], selectedShapes[1], selectedPorts[0], selectedPorts[1], connectingLines, canvas, shapes)
                }
                selectedPorts = [];
                selectedShapes = [];
                canvas.remove(currentLine);
                canvas.renderAll();
                currentLine = null;
                return;
              }
            }
          }
        }
        if (lastSelectedPort) {
          lastSelectedPort.set('fill', '#fff');
        }
        lastSelectedPort = null;
        selectedPorts = [];
        selectedShapes = [];
        if (currentLine) {
          canvas.remove(currentLine);
          canvas.renderAll();
          currentLine = null;
        }
        if ($(".tool-btn.active").length > 0) {
          // if ()
        }

        var target = opts.target;
        var mousePos = canvas.getPointer(opts.e);
        if (target && target.type == "group-extended") {
          var obj = opts.subTargets && opts.subTargets[0];
          if (obj) {
            target._selectedObject = obj;
          } else {
            target._selectedObject = null;
          }
          target._showSelectedBorder();
        }

        if (isChoosePort && target && target.name != "curve-point") {
          if (!objCover) {
            objCover = target;

            const circle = new fabric.Circle({
              top: objCover.top - 20,
              left: objCover.left,
              fill: "red",
              radius: 6,
              selectable: false,
              blink: true,
            });

            canvas.add(circle);
            blink(circle);
            objCover.portMark = circle;

            canvas.discardActiveObject();
          } else if (target !== objCover) {
            canvas.remove(objCover.portMark);
            objCover.portMark = null;

            const point1 = findTargetPort(target, "mt");
            const point2 = findTargetPort(objCover, "mt");

            point1.x2 = point2.x2;
            point1.y2 = point2.y2;
            const line = makeLine(
              canvas,
              point1,
              target.objectID,
              objCover.objectID,
              "mt",
              "mt",
              randomID(),
              userID
            );

            // line.selectable = true;
            // setDefaultAttributes(line);
            // startActiveObject(line);

            objCover = null;
            canvas.discardActiveObject();
          }
        }
      });

      // ungroup selected group
      $("#icon-ungroup").click(function () {
        if (!canvas.getActiveObject()) {
          return;
        }
        if (canvas.getActiveObject().type !== "group") {
          return;
        }
        const group = canvas.getActiveObject();
        pool_data = pool_data.filter((o) => o.objectID !== group.objectID);
        group.forEachObject((i) => {
          group.removeWithUpdate(i);
          canvas.add(i);
          pool_data.push({
            w: w,
            h: h,
            drawing: drawing,
            color: getColor(),
            id: id,
            userID: userID,
            objectID: i.objectID,
            username: username,
            spessremo: getPencil(),
            room: stanza,
            layer: canvas.id,
            data: i.toObject(customAttributes),
          });
        });
        canvas.remove(group);

        console.log("emit ungroup", pool_data);
        socket.emit("update", pool_data);
        canvas.requestRenderAll();
        $("#moveObject")[0].click();
      });

      // Sheet in Notepad
      $("#open-list-sheet").on("click", function () {
        $(".notepad-sheet-search").removeClass("hidden").addClass("active");
      });

      $(".wls-close").on("click", function () {
        $(".notepad-sheet-search").removeClass("active").addClass("hidden");
      });

      $(".wls-open-subject-list").on("click", function () {
        if ($(".wls-subject-list").hasClass("open")) {
          $(".wls-subject-list").removeClass("open");
        } else {
          $(".wls-subject-list").addClass("open");
        }
      });

      $(".wls-type").on("click", function () {
        var $this = $(this);
        var $state = $this.attr("data-state");
        var $img = $this.find("img");

        if ($state === "all") {
          $this.attr("data-state", "1");
          $img.attr(
            "src",
            plugin_url + "/assets/images/worksheet/Search_Type_PRACTICE.png"
          );
        } else if ($state === "1") {
          $this.attr("data-state", "2");
          $img.attr(
            "src",
            plugin_url + "/assets/images/worksheet/Search_Type_TEST.png"
          );
        } else if ($state === "2") {
          $this.attr("data-state", "all");
          $img.attr(
            "src",
            plugin_url + "/assets/images/worksheet/Search_Type_ALL.png"
          );
        }
      });

      $(".wls-subject-list ul li").on("click", function () {
        var $p = $(this).parents(".wls-subject-list");

        $p.find("li").removeClass("active");
        $(this).addClass("active");
        $p.removeClass("open");
      });

      $("body").on(click_event, function () {
        $("#panel")
          .find(".typing-input")
          .each(function () {
            var $this = $(this);
            $(this).focus();

            if ($("#panel").find(".typing-input").length > 1) {
              $this.remove();
            }
          });
      });

      //event close session
      $("#close-session").on("click", function () {
        $(".close-session").removeClass("hidden");
      });

      $(".close-popup-close").click(function () {
        $(".close-class").addClass("hidden");
      });

      $(".hidden-participant-btn").on("click", function () {
        $("#testichat").mCustomScrollbar("destroy");
        $("#testichat").mCustomScrollbar();

        $("#testichat").mCustomScrollbar("scrollTo", "last", {
          moveDragger: true,
          scrollInertia: 0,
        });

        if ($(this).hasClass("active")) {
          $(this).removeClass("active");
          $(".menu-tray").removeClass("hidden-participant");
          $(".hide-participant-line").addClass("hidden");
        } else {
          $(this).addClass("active");
          $(".menu-tray").addClass("hidden-participant");
          $(".hide-participant-line").removeClass("hidden");
        }
      });

      $(".toogle-menu-tray").on("click", function () {
        if ($(".sb-right").hasClass("hidden")) {
          $(".sb-right").removeClass("hidden");
        } else {
          $(".sb-right").addClass("hidden");
        }
      });

      // Event click for button list student
      $(".student_list").on("click", function () {
        var $actionOnRight = $(".menu-tray"),
          $parent = $(".attend-list"),
          $this = $(this);

        if ($actionOnRight.hasClass("show-both")) {
          updateStatus($this, "both", "chat-only", $parent);
        } else if ($actionOnRight.hasClass("student-only")) {
          updateStatus($this, "me", "student-only", $parent);
        } else if ($actionOnRight.hasClass("chat-only")) {
          updateStatus($this, "other", "chat-only", $parent);
          ResizeWhenShowBoth();
        } else {
          updateStatus($this, "remove", "student-only", $parent);
        }
      });

      ResizeWhenShowBoth();

      function updateStatus($el, $status, $class, $parent) {
        var $wrapper = $(".menu-tray");

        if ($status === "remove") {
          $el.addClass("active");
          $wrapper.css("display", "block");
          $parent.css("display", "block");
          $wrapper.addClass($class);

          $(".opactiyPercentage").css("display", "flex");
          $(".editBar").css("display", "block");
          $(".closeSideMenu .hideSideMenu").removeClass("hidden");
          $(".closeSideMenu .showSideMenu").addClass("hidden");
          ShowsideMenu();
        } else if ($status === "me") {
          $el.removeClass("active");
          $wrapper.css("display", "none").removeClass($class);
          $parent.css("display", "none");

          $(".hideSideMenu").addClass("hidden");
          $(".showSideMenu").removeClass("hidden");
          $(".opactiyPercentage").hide();
          $(".editBar").hide();
          $(".showSideMenu").unbind("click");
        } else if ($status === "other") {
          $el.addClass("active");
          $wrapper.css("display", "block");
          $parent.css("display", "block");
          $wrapper.removeClass($class).addClass("show-both");

          $(".opactiyPercentage").css("display", "flex");
          $(".editBar").css("display", "block");
          $(".closeSideMenu .hideSideMenu").removeClass("hidden");
          $(".closeSideMenu .showSideMenu").addClass("hidden");

          ShowsideMenu();
        } else if ($status === "both") {
          $el.removeClass("active");
          $parent.css("display", "none");
          $wrapper.removeClass("show-both").addClass($class);

          ShowsideMenu();
        }
      }

      function ResizeWhenShowBoth() {
        $(".chat_box")
          .resizable({
            minHeight: 300,
            handles: {
              s: ".ui-resizable-n",
            },
            start: function (e, ui) { },
          })
          .on("resize", function (event, ui) {
            var hBottom = ui.size.height,
              ht = $(window).height();
            var hBottom = ui.size.height,
              hTop = $(window).height() - hBottom;
            $("#testichat").css("max-height", ht - 226 - hTop);
            $(".chat_box").height(hBottom);
            $(".attend-list").height(hTop);
            $(window).resize(function () {
              $(".attend-list").height($(window).height() - hBottom);
            });

            $(window).trigger("resize");
          });
      }

      // Event hide/show side menu popup

      $(".hideSideMenu").click(function () {
        $(".menu-tray").hide();
        $(".hideSideMenu").addClass("hidden");
        $(".showSideMenu").removeClass("hidden");
        $(".opactiyPercentage").hide();
        $(".editBar").hide();
      });

      $(".status-selector").click(function () {
        if ($(this).hasClass("active")) {
          $(this).removeClass("active");
          $(".status-selector-bar").show();
          $(".status-selector-bar").addClass("hidden");
        } else {
          $(this).addClass("active");
          $(".status-selector-bar").show();
          $(".status-selector-bar").removeClass("hidden");
        }
      });

      $(".status-selector-bar > ul > li").on("click", function () {
        var $val = $(this).data("type");
        $("#emoji").val($val);

        var image_patch = "assets/images/notepad/emo/";
        var image;

        switch ($val) {
          case "fast":
            image = "Status_TooFast.png";
            break;
          case "confused":
            image = "Status_Confused.png";
            break;
          case "understand":
            image = "Status_Good.png";
            break;
        }

        $(".status-selector img").attr("src", "" + image_patch + image + "");
        $(".status-selector-bar").hide();
        $(".status-selector").removeClass("active");
      });

      $("#file-input").change(function (e) {
        $("#panel").find(".typing-input").remove();
        var file = e.target.files[0],
          imageType = /image.*/;
        if (!file.type.match(imageType)) return;

        var reader = new FileReader();
        reader.onload = fileOnload;
        reader.readAsDataURL(file);

        var cnt = getCanvas();
        var can = document.getElementById("canvas_draw");
        can.addClass("has-image");
      });

      $("#divrubber").draggable();

      $("#icon-video").on("click", function () {
        if ($(".video-popup-class").hasClass("hidden")) {
          $(".video-popup-class").removeClass("hidden");
        } else {
          $(".video-popup-class").addClass("hidden");
          $("#moveObject")[0].click();
        }
      });
      //
      $("#btnclose").on("click", function () {
        $(".video-popup-class").addClass("hidden");
      });

      // $('#yotubeVideo .item-video video').mediaelementplayer();

      $(".video-btn").on("click", function () {
        var $this = $(this);
        var $url = $this.parents(".video-popup-class").find(".video-url").val();
        var cnt = getCanvas();

        var xhr = new XMLHttpRequest();

        xhr.open('GET', 'page.html');
        xhr.onreadystatechange = handler;
        xhr.responseType = 'blob';
        xhr.setRequestHeader('Authorization', 'Bearer ' + token);
        xhr.send();

        function handler() {
          if (this.readyState === this.DONE) {
            if (this.status === 200) {
              // this.response is a Blob, because we set responseType above
              var data_url = URL.createObjectURL(this.response);
              document.querySelector('#output-frame-id').src = data_url;
            } else {
              console.error('no pdf :(');
            }
          }
        }

        $("#yotubeVideo .item-video").addClass("hidden");
        $(".video-popup-class").addClass("hidden");

        if ($url === "") {
          alert(iii_script.empty_video_url);
        } else {
          createVideo($url);
          $(".video-url").val("");
          // if ($('#video-' + cnt).length < 1) {
          //     $('#yotubeVideo').removeClass('hidden');

          // } else if ($('#video-' + cnt).find('source').attr('src') !== $url) {
          //     $('#video-' + cnt).remove();
          //     createVideo($url);
          // }
        }
      });
      // Make the DIV element draggable:

      function createVideo($url) {
        var cnt = getCanvas();
        var url = new URL($url);
        var c = url.searchParams.get("v");
        console.log($url);

        // var $div = $('<div/>', {
        //     class: 'item-video',
        //     id: 'video-' + cnt,
        //     style: "z-index: 100; width: 30%; height: 50%; background: #000; padding: 20px;",
        // }).appendTo('#yotubeVideo');

        // var input = $('<input>', {
        //     type: "button",
        //     value: "X",
        //     style: "color: red; position: absolute; right: 0; top: 0; font-size: 20px;"
        // }).appendTo($div);

        // input[0].addEventListener("click", function (e) {
        //     $(this).parent().remove();
        // })

        // var $iframe = $('<iframe/>', {
        //     id: "new-video",
        //     src: "https://www.youtube.com/embed/" + c,
        // }).appendTo($div);

        var $div = $(".item-video");
        var iframe = $("#ytbIframe");

        // iframe.attr('crossorigin', 'anonymous')
        iframe.attr("src", `https://www.youtube.com/embed/${c}`);
        $div.attr("draggable", true);
        $div.removeClass("hidden");

        console.log($div);

        dragElement($div[0]);
        resizeVideo($div[0]);
      }

      $(".ytb-close-btn").click(function (e) {
        $(".item-video").addClass("hidden");
      });

      async function saveAs(dataToDownload, filename) {
        var a = document.createElement("a");
        var zip = new JSZip();
        for (const iterator of listMedia) {
          zip.file(iterator.name, iterator.blob, {
            binary: true,
            // createFolders: true
          });
          window.URL.revokeObjectURL(iterator.url);
        }
        zip.file(filename + ".json", dataToDownload);
        var content = await zip.generateAsync({
          type: "blob",
          compression: "DEFLATE",
          compressionOptions: {
            level: 9,
          },
        });
        const zipUrl = URL.createObjectURL(content);
        document.body.appendChild(a);
        a.style = "display: none";
        a.href = zipUrl;
        a.download = filename + ".zip";
        a.click();
        window.URL.revokeObjectURL(zipUrl);
        document.body.removeChild(a);
      }

      socket.on("addLayer", function (id) {
        layerNum++;
        const layer = {
          id,
          canvas: {
            backgroundColor: "#ffffff",
            gridObj: null,
          },
        };
        layerStorage.push(layer);

        var len = $("#layers-body .icon-selector").length;
        const li = document.createElement("li");
        li.classList.add("icon-layer", "icon-selector");
        $(li).attr("data-cnt", len + 1);
        $(li).attr("data-id", layer.id);
        console.log(`  ~ layer.id3`, layer.id);
        li.innerHTML = `<img src="assets/images/notepad/layer/layer-${len + 1
          }.png">`;
        $("#layers-body").append(li);

        console.log("add layer", layerStorage);
      });

      socket.on("deleteLayer", function (layer) {
        console.log("delete layer:", layer, canvas.id);
        layerStorage = layerStorage.filter((item) => item.id !== layer.id);

        pool_data = pool_data.filter((item) => item.layer !== layer.id);

        $(".icon-selector").remove();
        layerStorage.forEach((layer, index) => {
          const li = document.createElement("li");

          li.classList.add("icon-layer", "icon-selector");
          $(li).attr("data-cnt", index + 1);
          $(li).attr("data-id", layer.id);
          console.log(`  ~ layer.id4`, layer.id);
          li.innerHTML = `<img src="assets/images/notepad/layer/layer-${index + 1
            }.png">`;

          $("#layers-body").append(li);
        });
        if (layer.id == canvas.id) {
          if (currentLayer > 1) {
            currentLayer--;
          }
          canvas.id = $(`.icon-selector[data-cnt="${currentLayer}"]`).data("id");
          canvas.clear();
          loadLayerCanvasJsonNew(pool_data, canvas);
          console.log(`  ~ loadLayerCanvasJsonNew`, 4);
        }
        updateToolBarStatus();
      });

      socket.on("changeBgColor", function (data) {
        console.log("on change bg color", data);
        layerStorage.some((item) => {
          if (item.id === data.id) {
            item.canvas.backgroundColor = data.backgroundColor;
            canvas.setBackgroundColor(
              `${data.backgroundColor}`,
              canvas.renderAll.bind(canvas)
            );
            $("#grids-body .btn-color-grid").removeClass("active");
            $(
              `#grids-body .btn-color-grid[data-color="${data.backgroundColor}"]`
            ).addClass("active");
            return true;
          }
          return false;
        });
      });

      socket.on("changeGrid", function (data) {
        console.log("on change grid", data);
        layerStorage.some((item) => {
          if (item.id === data.id) {
            item.canvas.gridObj = data.gridObj;
            $("#grids-body .btn-grid").removeClass("active");
            if (data.gridObj) {
              $(`#grids-body .btn-grid[data-grid="${data.gridObj}"]`).addClass(
                "active"
              );
            }

            return true;
          }
          return false;
        });
      });

      socket.on("loadData", function (data) {
        loadData(data);
      });

      socket.on("pathMoving", function (data) {
        console.log("on path moving", data);
        canvas.forEachObject((o) => {
          if (o.objectID === data.objectID) {
            o.isMoving = data.moving;
            console.log(o);
            if (data.moving && o.startMoving) {
              o.startMoving();
            }
          }
        });
      });

      socket.on("update", function (data) {
        console.log("update event", data);
        pool_data = data;
        canvas.clear();
        loadLayerCanvasJsonNew(pool_data, canvas);
        console.log(`  ~ loadLayerCanvasJsonNew`, 5);
      });

      var updateAtributes = [
        'top',
        'left',
        'text',
        'width',
        'height',
        'textAlign',
        'fontSize',
        'fill',
        'stroke',
        'strokeWidth',
        'hasControls',
        'lockMovementX',
        'lockMovementY',
        'fontWeight',
        'fontStyle',
        'underline',
        'angle',
        'scaleX',
        'scaleY',
        'skewX',
        'skewY',
        'flipX',
        'originX',
        'flipY',
        'originY',
        'fillRule',

      ].concat(customAttributes)

      socket.on("updated", function (data) {
        console.log("updated event", { data });
        if (data.isUpdateMedia) {
          listMedia = data.listMedia;
        } else {
          canvas.getObjects().forEach((item) => {
            if (item.objectID == data.objectID) {
              if (data.moving) {
                if (item.name == "quiz-matchObj") {
                  matchOjbMoving(item);
                  // return;
                } else {
                  objectSnapCanvas(item);
                  objectSnapAdjacent(item);

                }
              }
              // console.log("updated", { data });
              updateAtributes.forEach(a => {
                if (a === "fill" && data.dataChange[a] === "rgb(0,0,0)") {
                  return;
                }
                if (data.dataChange[a]) {
                  item[a] = data.dataChange[a]
                }
              })
              if (data.dataChange.objects) {
                item._objects.forEach((o, index) => {
                  const object = data.dataChange.objects[index]
                  updateAtributes.forEach(a => {
                    if (a === "fill" && data.dataChange[a] === "rgb(0,0,0)") {
                      return;
                    }
                    if (object && object[a]) {
                      o[a] = object[a]
                    }
                  })
                  if (o.type === "group") {
                    o._objects.forEach((obj, i) => {
                      updateAtributes.forEach(a => {
                        if (a === "fill" && data.dataChange[a] === "rgb(0,0,0)") {
                          return;
                        }
                        if (object?.objects[a]) {
                          obj[a] = object.objects[a]
                        }
                      })
                    })
                  }
                })
              }
              if (item.blink) blink(item);
              if (item.name === "media") {
                if (item.nameDevice !== "attach-file") {
                  if (item.src.length > 0) {
                    var srcItem = item.src[item.src.length - 1];
                    listMedia.push({
                      id: srcItem.id,
                      name: srcItem.name,
                      blob: srcItem.blob,
                      url: srcItem.url,
                    });
                    addNewRecord(item.nameDevice, srcItem.id);
                  }
                  if (data.options?.isDeleteRecord) {
                    listMedia = listMedia.filter(
                      (item) => item.id !== data.options.id
                    );
                  }
                }
                // else {
                //     addNewAttachFile(item.files[item.length - 1])
                // }
                $(`.${item.nameDevice}-popup-class`).addClass("hidden");
              }
              if (item.name != "lineConnect") {
              }
              if (data.moving) changeCoordinateConnectLine(item);
            }
          });

          updateObjectByID(pool_data, data.dataChange, data.objectID, true);
        }
        canvas.renderAll();
      });

      socket.on("deleteObject", function (data) {
        console.log(data);
        canvas.getObjects().forEach((item) => {
          if (item.objectID == data.objectID) {
            canvas.remove(item);
            return;
          }
        });
        deleteObjInPool(data.objectID, pool_data, data.layer, canvas);
        resetObjList();
      });

      socket.on("setBgImg", function (id) {
        if (id) {
          canvas.forEachObject((o) => {
            if (o.objectID === id) {
              o.set({
                isBackground: true,
                isDrag: false,
                isDrop: false,
                lockMovementX: true,
                lockMovementY: true,
              });
              repositionDragDrop();
              canvas.setBackgroundImage(o, canvas.renderAll.bind(canvas), {
                top: 0,
                left: 0,
                scaleX: canvas.width / o.width,
                scaleY: canvas.height / o.height,
              });
            }
          });
        } else {
          canvas.setBackgroundImage(null, canvas.renderAll.bind(canvas));
        }
      });

      $("#icon-save").on("click", function () {
        const data = {
          layerNum,
          layerStorage,
          pool_data,
        };
        saveAs(JSON.stringify(data), createMediaID());
      });

      async function ReadFilesResult(files) {
        var keys = Object.keys(files);
        var text = "";
        var index = 0;
        while (!text && index < keys.length) {
          var data = files[keys[index]];
          text = await data.async("text");
          if (!!text) return text;
          ++index;
        }
      }

      $("#icon-load-canvas").on("change", function (e) {
        var file = e.target.files[0];
        var ext = file.name.split(".").pop();
        if (ext == "zip") {
          var zip = new JSZip();
          zip.loadAsync(file, { createFolders: true }).then(async function (zip) {
            var text = await ReadFilesResult(zip.files);
            const dataObj = JSON.parse(text);

            console.log("load", dataObj);
            if (
              dataObj?.layerNum &&
              dataObj?.layerStorage &&
              dataObj?.pool_data
            ) {
              loadData(dataObj);
              socket.emit("loadData", dataObj);
            } else {
              loadCanvasJsonNew(dataObj);
              pool_data = dataObj.objects.map((obj) => ({
                w: w,
                h: h,
                drawing: false,
                color: getColor(),
                id: id,
                userID: userID,
                objectID: obj.objectID,
                username: username,
                spessremo: getPencil(),
                room: stanza,
                layer: obj.layer,
                data: obj,
              }));
              socket.emit("update", pool_data);
            }
            return false;

            // if (keys && keys.length && keys.length > 0) {
            //     listMedia = [];
            //     for (let index = 0; index < keys.length; index++) {
            //         if (index == keys.length - 1) {
            //             loadCanvasObjs(canvasObj.objects, canvas);
            //             pool_data = canvasObj.objects.map(obj => ({
            //                 w: w,
            //                 h: h,
            //                 drawing: false,
            //                 color: getColor(),
            //                 id: id,
            //                 userID: userID,
            //                 objectID: obj.objectID,
            //                 username: username,
            //                 spessremo: getPencil(),
            //                 room: stanza,
            //                 layer: obj.layer,
            //                 data: obj
            //             }))
            //             socket.emit('update', pool_data)
            //         }
            //         else {
            //             var mediaBlob = await data.async('blob');
            //             var id = data.name.split('.').slice(0, -1).join('.');
            //             var type = data.name.split('.').slice(-1)[0];
            //             listMedia.push({
            //                 id: id,
            //                 name: `${id}.${type}`,
            //                 blob: mediaBlob,
            //                 url: `${id}.${type}`
            //             });
            //             socket.emit('updated', {
            //                 isUpdateMedia: true,
            //                 listMedia
            //             });
            //         }
            //     }
            // }
          });
        } else {
          console.log(file);
          file.text().then((data) => {
            const canvasObj = JSON.parse(data);
            if (
              dataObj?.layerNum &&
              dataObj?.layerStorage &&
              dataObj?.pool_data
            ) {
              loadData(dataObj);
              socket.emit("loadData", dataObj);
            } else {
              loadCanvasJsonNew(canvasObj);
              pool_data = dataObj.objects.map((obj) => ({
                w: w,
                h: h,
                drawing: false,
                color: getColor(),
                id: id,
                userID: userID,
                objectID: obj.objectID,
                username: username,
                spessremo: getPencil(),
                room: stanza,
                layer: obj.layer,
                data: obj,
              }));
              socket.emit("update", pool_data);
            }
          });
        }
        $("#icon-load-canvas").val("");
      });
      //vuong
      $("#icon-load").on("click", function () {
        let layer_num = $("#layers-body .active").attr("data-cnt");
        document.getElementById("file-layer").onchange = (e) => {
          console.log("change");
          var file = e.target.files[0];
          if (confirm(`Bạn có muốn load layer lưu vào layer ${layer_num}`)) {
            file.text().then((data) => {
              const layerSave = JSON.parse(data);
              for (let i = 0; i < layerSave.length; i++) {
                layerSave[i].layer = layer_num;
                layerSave[i].objectID = randomID();
                pool_data.push(layerSave[i]);
                // socket.emit('drawing',document.getElementById("room").value, layerSave[i]);
                console.log(
                  "🚀 ~ document.getElementById(room).value",
                  document.getElementById("room").value
                );
                socket.join($("#room")[0].value);
                socket.emit("drawing", layerSave[i]);
              }
              loadCanvasJson(pool_data, canvas);
            });
          }
          $("#file-layer").val("");
        };
      });

      $(".full-screen-mode").on("click", function () {
        let $this = $(this);

        if ($this.hasClass("full")) {
          $this.removeClass("full").addClass("min");
          openFullscreen();
        } else if ($this.hasClass("min")) {
          $this.removeClass("min").addClass("full");
          closeFullscreen();
        }
      });

      $("#reveal-icon-left").on("click", function () {
        let bar = $(".block-toolbar");
        let reveal = $(".block-reveal");

        if (bar.get(0).scrollWidth - bar.width() === bar.scrollLeft()) {
          reveal.addClass("end").removeClass("left");
        } else {
          reveal.removeClass("begin").addClass("left");
        }

        bar.animate(
          {
            scrollLeft: "+=55",
          },
          1000
        );
      });

      $("button.close-listIcon").on("click", function () {
        $("#omegaSymbol").removeClass("active");
        $("#svg").removeClass("active");
        // $("#opencv").removeClass("active");

        $("#listOfSymbol").addClass("hidden");
        $("#listIconSVG").addClass("hidden");

      });

      $("#reveal-icon-right").on("click", function () {
        let bar = $(".block-toolbar");
        let reveal = $(".block-reveal");

        if (bar.scrollLeft() == 0) {
          reveal.addClass("begin").removeClass("right");
        } else {
          reveal.addClass("right").removeClass("end");
        }

        bar.animate(
          {
            scrollLeft: "-=55",
          },
          1000
        );
      });

      $(".trigger-action").on("click", function () {
        let divws = $(this).parents(".tutor-ws-div");

        if (divws.hasClass("activate")) {
          divws.removeClass("activate");
        } else {
          divws.addClass("activate");
        }
      });
      createCanvas();
      initDraw();
      initChat();
      activeTab();
      ShowsideMenu();
      hoverMenuShowTooltip();
    });

    function createCanvas() { }

    function hoverMenuShowTooltip() {
      var timeout;
      $(".tooltip-wrap").on("mouseenter", function () {
        var $this = $(this);

        if (timeout != null) {
          clearTimeout(timeout);
        }

        timeout = setTimeout(function () {
          $(".tooltip-wrap").removeClass("show-tt");
          $this.addClass("show-tt");
        }, 1000);
      });

      $(".tooltip-wrap").on("mouseleave", function () {
        if (timeout != null) {
          clearTimeout(timeout);
          timeout = null;
        }
      });
      $(".tooltip-wrap").on("mouseover", function () {
        $(".tooltip-wrap").removeClass("show-tt");
      });

      $(window).on("mouseover", function () {
        $(".tooltip-wrap").removeClass("show-tt");
      });
    }

    function openFullscreen() {
      let elem = document.documentElement;

      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.mozRequestFullScreen) {
        /* Firefox */
        elem.mozRequestFullScreen();
      } else if (elem.webkitRequestFullscreen) {
        /* Chrome, Safari & Opera */
        elem.webkitRequestFullscreen();
      } else if (elem.msRequestFullscreen) {
        /* IE/Edge */
        elem.msRequestFullscreen();
      }
    }

    function closeFullscreen() {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    }

    function ShowsideMenu() {
      $(".showSideMenu").click(function () {
        $(".menu-tray").show();

        $(".hideSideMenu").removeClass("hidden");
        $(".showSideMenu").addClass("hidden");
        $(".opactiyPercentage").show();
        $(".editBar").show();
      });
    }

    function TypingCreatTextarea(e) {
      e.preventDefault();

      var textarea = $("<textarea/>", {
        class: "typing-input",
      }).appendTo("#panel");

      var top = e.clientY - 70;

      textarea.css({
        resize: "both",
        top: top + "px",
        left: e.clientX + "px",
      });
    }

    function initDraw() {
      $(document).on("click", ".icon-selector", function () {
        console.log("canvas backgound", canvas.backgroundColor);

        $("#panel").find(".typing-input").remove();
        $("#add-type-box").removeClass("active");
        if (!$(this).hasClass("active") && !$(this).hasClass("none-visiable")) {
          $("#layers-body li").removeClass("active");
          $(this).addClass("active");
          $("#divrubber").css("visibility", "hidden");
          $("#erasers-body li").removeClass("active");

          $("#yotubeVideo .item-video").addClass("hidden");
          $("#yotubeVideo #video-" + cnt).removeClass("hidden");
          drawVideo();
          // if ($('.icon-layer.btn-grid').hasClass('active')) {
          //     var grid = $('.icon-layer.btn-grid.active').attr('data-grid');
          //     // var cnv = $('#math' + cnt);
          //     // var ctxcan = cnv[0].getContext('2d');
          //     var bg = getBg();
          //     if (bg != '') {
          //         $('#panel').css('background-color', bg);
          //     }

          //     if (grid) {
          //         $('#panel').css('background-image', 'url(' + plugin_url + '/assets/images/notepad/grid/grid-' + grid + '.png)')
          //     }
          // }

          // save current layer
          canvas.getObjects().forEach((obj) => {
            if (obj.isMoving) obj.stopAudio();
          });
          canvas.clear();

          currentLayer = $(this).data("cnt");
          canvas.id = $(this).data("id");
          console.log(`  ~ currentLayer`, currentLayer);
          console.log(`  ~ canvas.id `, canvas.id);

          // load target layer
          // const canvasObj = JSON.parse(layer.canvas);
          // loadCanvasJsonNew(canvasObj);
          loadLayerCanvasJsonNew(pool_data, canvas);

          console.log(`  ~ loadLayerCanvasJsonNew`, 6, {
            pool_data,
            canvas,
            currentLayer,
          }); // vuong

          canvas.setBackgroundColor(
            layerStorage[currentLayer - 1].canvas.backgroundColor,
            canvas.renderAll.bind(canvas)
          );
          // set active to background color icon
          $("#grids-body .btn-color-grid").removeClass("active");
          $(
            `#grids-body .btn-color-grid[data-color='${layerStorage[currentLayer - 1].canvas.backgroundColor
            }']`
          ).addClass("active");
          // set un active to grid icon
          $("#grids-body .btn-grid").removeClass("active");
          if (layerStorage[currentLayer - 1].canvas.gridObj !== null) {
            $(
              `#grids-body .btn-grid[data-grid='${layerStorage[currentLayer - 1].canvas.gridObj
              }']`
            ).addClass("active");
          }
          console.log("change layer", layerStorage); //vuong
        }
      });

      $(document).on("click", ".btn-color", function () {
        var cnt = getCanvas();
        $("#panel").find(".typing-input").remove();
        $("#add-type-box").removeClass("active");
        $("#math" + cnt).unbind(click_event, TypingCreatTextarea);
        // $('#math' + cnt)[0].removeEventListener('touchstart', TypingCreatTextareaTouchDevice);

        if (!$(this).hasClass("active")) {
          $("#colors-body li").removeClass("active");
          $(this).addClass("active");
          $("#divrubber").css("display", "none");
          $("#erasers-body li").removeClass("active");
          //$("#pencils-body li.hr1").addClass('active');
          $("#change-color img").attr(
            "src",
            "assets/images/notepad/color/top/" + $(this).attr("data-image-url")
          );
          canDraw();
        }
      });

      $(document).on("click", ".btn-pencil", function () {
        var cnt = getCanvas();
        $("#panel").find(".typing-input").remove();
        $("#add-type-box").removeClass("active");
        $("#math" + cnt).unbind(click_event, TypingCreatTextarea);
        // $('#math' + cnt)[0].removeEventListener('touchstart', TypingCreatTextareaTouchDevice);

        if (!$(this).hasClass("active")) {
          $("#pencils-body li").removeClass("active");
          $("#erasers-body li").removeClass("active");
          $(this).addClass("active");
          canDraw();
        }
      });

      $(".btn-eraser").on("click", function () {
        var cnt = getCanvas();
        $("#panel").find(".typing-input").remove();
        $("#add-type-box").removeClass("active");
        $("#math" + cnt).unbind(click_event, TypingCreatTextarea);
        // $('#math' + cnt)[0].removeEventListener('touchstart', TypingCreatTextareaTouchDevice);

        var $this = $(this);

        $("#erasers-body li").removeClass("active");
        //$("#pencils-body li").removeClass('active');
        $this.addClass("active");

        var val = $this.attr("data-eraser");

        $("#divrubber").css({
          display: "block",
          width: val + "px",
          height: val + "px",
        });
        $("#controlrubber").removeClass(
          "css-cursor-30 css-cursor-50 css-cursor-70 css-cursor-90 css-cursor-100"
        );
        $("#controlrubber").addClass("css-cursor-" + val);

        canEraser();
      });

      $(".btn-eraser-clear").on("click", function () {
        pool_data = pool_data.filter(
          (obj) => obj.layer !== canvas.id || obj.data.name === "grid"
        );
        // pool_data = []
        socket.emit("update", pool_data);
        canvas.clear();
        loadLayerCanvasJsonNew(pool_data, canvas);
        console.log(`  ~ loadLayerCanvasJsonNew`, 7);
        $("#change-eraser")[0].click();
      });

      var $z;
      $(document).on("click", ".btn-color-grid", function () {
        var bg = $(this).attr("data-color");
        var cnt = getCanvas();
        var can = document.getElementById("canvas_draw");
        var ctxcan = can.getContext("2d");

        $("#panel").find(".typing-input").remove();
        $("#add-type-box").removeClass("active");
        $("#math" + cnt).unbind(click_event, TypingCreatTextarea);

        var $x = $("#grids-body .btn-color-grid.active").length;

        if (!$(this).hasClass("active")) {
          $("#grids-body .btn-color-grid").removeClass("active");
          $(this).addClass("active");
          layerStorage.some((item) => {
            if (item.id === canvas.id) {
              item.canvas.backgroundColor = bg;
              return true;
            }
            return false;
          });
          if ($x === 0) {
            //
          }

          canvas.setBackgroundColor(`${bg}`, canvas.renderAll.bind(canvas));
          console.log("canvas", canvas);
          const data = {
            backgroundColor: bg,
            id: canvas.id,
          };
          socket.emit("changeBgColor", data);

          console.log("change bg color", data);
        }
      });

      var $stepGrid = -1;

      $(".btn-grid")
        .unbind("click")
        .bind("click", function (e) {
          var cnt = getCanvas();
          var cnv = $("#math" + cnt);

          $("#panel").find(".typing-input").remove();
          $("#add-type-box").removeClass("active");
          $("#math" + cnt).unbind(click_event, TypingCreatTextarea);

          var bg = getBg();
          if (bg != "") {
            $("#panel").css("background-color", bg);
          }

          if (!$(this).hasClass("active")) {
            $("#grids-body .btn-grid").removeClass("active");

            let gridObj = canvas._objects.find((item) => item.name === "grid");

            if (gridObj) deleteObjects([gridObj]);
            $(this).addClass("active");

            var grid = $(this).attr("data-grid");

            grid = 50 / grid;

            let groupTogether = [];
            for (var i = 0; i < (canvas.width * 5) / grid; i++) {
              let horizon = new fabric.Line(
                [i * grid, 0, i * grid, canvas.height * 5],
                {
                  stroke: "#ccc",
                  selectable: false,
                  // renderOnAddRemove: false,
                  // objectCaching: false
                }
              );
              groupTogether.push(horizon);
            }
            for (var i = 0; i < (canvas.height * 5) / grid; i++) {
              let vertical = new fabric.Line(
                [0, i * grid, canvas.width * 5, i * grid],
                {
                  stroke: "#ccc",
                  selectable: false,
                  // renderOnAddRemove: false,
                  // objectCaching: false
                }
              );
              groupTogether.push(vertical);
            }
            var alltogetherObj = new fabric.Group(groupTogether, {
              top: 0,
              left: 0,
              // top: -canvas.height,
              // left: -canvas.width,
              originX: "center",
              originY: "center",
              evented: false,
              selectable: false,
              hasControls: false,
              hasRotatingPoint: false,
              hasRotatingPoint: false,
              renderOnAddRemove: false,
              objectCaching: false,
              name: "grid",
            });

            if (grid == 50) {
              alltogetherObj.typeGrid = 1;
            } else if (grid == 25) {
              alltogetherObj.typeGrid = 2;
            }

            canvas.add(alltogetherObj);

            isLoadDataLocal = false;
            emitEvent();

            canvas.sendToBack(alltogetherObj);
            canvas.requestRenderAll();

            e.preventDefault();
            e.stopPropagation();
            layerStorage[currentLayer - 1].canvas.gridObj =
              $(this).attr("data-grid");
          } else {
            isGrid = false;
            $(this).removeClass("active");

            let idx = canvas._objects.findIndex((item) => item.name == "grid");

            // canvas.remove(canvas.item(idx));
            deleteObjects([canvas.item(idx)]);
            layerStorage[currentLayer - 1].canvas.gridObj = null;
          }
          const data = {
            id: canvas.id,
            gridObj: layerStorage[currentLayer - 1].canvas.gridObj,
          };
          socket.emit("changeGrid", data);
          console.log("change grid", data);
        });

      $(document).on("change", "#screenshot-check", function (ev) {
        if (document.getElementById("screenshot-check").checked) {
          $("#select-screenshot").selectBoxIt("disable");
        } else {
          clearInterval(idtempo);
          $("#select-screenshot").selectBoxIt("enable");
        }
      });
    }

    function drawVideo() {
      var mediaSource = "http://www.youtube.com/watch?v=nOEw9iiopwI";

      var muted = true;

      var cnt = getCanvas();
      var can = document.getElementById("canvas_draw");
      var ctx = canvas.getContext("2d");

      var videoContainer;
      var video = $("<video/>", {
        id: "3itest",
      });

      var source = $("<source/>", {
        src: mediaSource,
        type: "video/youtube",
      }).appendTo(video);

      //video.autoPlay  = false;
      // video.loop      = true;
      //video.muted     = muted;

      videoContainer = {
        video: video,
        ready: false,
      };

      video.appendTo($("body"));

      video.oncanplay = readyToPlayVideo;

      function readyToPlayVideo(event) {
        videoContainer.scale = Math.min(4, 3);
        videoContainer.ready = true;

        requestAnimationFrame(updateCanvas);
      }

      function updateCanvas() {
        ctx.clearRect(0, 0, can.width, can.height);

        if (videoContainer !== undefined && videoContainer.ready) {
          // find the top left of the video on the canvas
          video.muted = muted;
          var scale = videoContainer.scale;
          var vidH = videoContainer.video.videoHeight;
          var vidW = videoContainer.video.videoWidth;
          var top = 200;
          var left = 300;

          // now just draw the video the correct size
          ctx.drawImage(
            videoContainer.video,
            left,
            top,
            vidW * scale,
            vidH * scale
          );
          if (videoContainer.video.paused) {
            // if not playing show the paused screen
            drawPayIcon();
          }
        }

        // all done for display
        // request the next frame in 1/60th of a second
        requestAnimationFrame(updateCanvas);
      }

      function drawPayIcon() {
        ctx.fillStyle = "#000";
        ctx.globalAlpha = 0.5;
        ctx.fillRect(0, 0, can.width, can.height);
        ctx.fillStyle = "#DDD";
        ctx.globalAlpha = 0.75;
        ctx.beginPath();
        var size = (can.height / 2) * 0.5;
        ctx.moveTo(can.width / 2 + size / 2, can.height / 2);
        ctx.lineTo(can.width / 2 - size / 2, can.height / 2 + size);
        ctx.lineTo(can.width / 2 - size / 2, can.height / 2 - size);
        ctx.closePath();
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      function playPauseClick() {
        if (videoContainer !== undefined && videoContainer.ready) {
          if (videoContainer.video.paused) {
            videoContainer.video.play();
          } else {
            videoContainer.video.pause();
          }
        }
      }

      can.addEventListener("click", playPauseClick);
    }

    function fileOnload(e) {
      var img = $("<img>", {
        src: e.target.result,
      });

      var can = document.getElementById("canvas_draw");
      var ctxcan = can.getContext("2d");

      img.on("load", function () {
        ctxcan.drawImage(this, positionx, positiony);
      });
    }

    function canDraw(a) {
      console.log(a);

      var ctxcan = canvas.getContext("2d");

      // ctx setup
      ctxcan.lineCap = "round";
      ctxcan.lineJoin = "round";
      ctxcan.lineWidth = getPencil();
      ctxcan.font = "20px Tahoma";

      if (ctxcan) {
        $(window).on("resize", function () {
          resizecanvas(canvas, ctxcan);
        });

        $(window).on("orientationchange", function () {
          resizecanvas(canvas, ctxcan);
        });
      }
    }

    function canEraser() {
      console.log(canvas);

      divrubber.on("mouseup", function (e) {
        drawing = false;
        controlrubber = false;
        isErasing = false;
      });

      divrubber.on("mousemove", function (e) {
        if (isErasing) {
          const deleteObjs = [];

          canvas.getObjects().forEach((obj) => {
            const zoom = canvas.getZoom();
            const points = [
              {
                top: obj.top * zoom + canvas.viewportTransform[5],
                left: obj.left * zoom + canvas.viewportTransform[4],
              },
              {
                top:
                  (obj.top + obj.height) * obj.scaleY * zoom +
                  canvas.viewportTransform[5],
                left: obj.left * zoom + canvas.viewportTransform[4],
              },
              {
                top:
                  (obj.top + obj.height) * obj.scaleY * zoom +
                  canvas.viewportTransform[5],
                left:
                  (obj.left + obj.width) * obj.scaleX * zoom +
                  canvas.viewportTransform[4],
              },
              {
                top: obj.top * zoom + canvas.viewportTransform[5],
                left:
                  (obj.left + obj.width) * obj.scaleX * zoom +
                  canvas.viewportTransform[4],
              },
            ];

            points.some((point) => {
              if (
                Math.abs(point.top - divrubber.position().top) <=
                divrubber.height() &&
                Math.abs(point.left - divrubber.position().left) <=
                divrubber.width()
              ) {
                deleteObjs.push(obj);
                return true;
              }
              return false;
            });
          });

          deleteObjects(deleteObjs);
        }
      });

      divrubber.on("mousedown", function (e) {
        drawing = false;
        isErasing = true;
      });
    }

    function canDraw(a) {
      var ctxcan = canvas.getContext("2d");

      var prev = {};

      // ctx setup
      ctxcan.lineCap = "round";
      ctxcan.lineJoin = "round";
      ctxcan.lineWidth = getPencil();
      ctxcan.font = "20px Tahoma";

      if (ctxcan) {
        $(window).on("resize", function () {
          resizecanvas(canvas, ctxcan);
        });

        $(window).on("orientationchange", function () {
          resizecanvas(canvas, ctxcan);
        });
      }
    }

    function getCanvas() {
      var cnt = $("#layers-body li.active").data("id");
      return cnt;
    }

    function getColor() {
      var color = "#000000";
      $("#colors-body li").each(function (i) {
        if ($(this).hasClass("active")) {
          color = $(this).attr("data-color");
        }
      });
      return color;
    }

    function getPencil() {
      var pencil = "1";
      $("#pencils-body li").each(function (i) {
        if ($(this).hasClass("active")) {
          pencil = $(this).attr("data-pencil");
        }
      });
      return pencil;
    }

    function getEraser() {
      var eraser = 0;
      $("#erasers-body li").each(function (i) {
        if ($(this).hasClass("active")) {
          eraser = parseInt($(this).attr("data-eraser"));
        }
      });
      return eraser;
    }

    function getBg() {
      var bg = "";
      $("#grids-body .btn-color-grid").each(function (i) {
        if ($(this).hasClass("active")) {
          bg = $(this).attr("data-color");
        }
      });
      return bg;
    }

    function getGrid() {
      var grid = "";
      $("#grids-body .btn-grid").each(function (i) {
        if ($(this).hasClass("active")) {
          grid = parseInt($(this).attr("data-grid"));
        }
      });
      return grid;
    }

    function resizecanvas(can, ctxcan) {
      var imgdata = ctxcan.getImageData(0, 0, can.width, can.height);
      can.width = innerWidth;
      can.height = innerHeight + 65;
      ctxcan.putImageData(imgdata, 0, 0);
    }

    $(".btn-add-layer").click(function () {
      $("#panel").find(".typing-input").remove();

      var len = $("#layers-body .icon-selector").length;
      if (len < 6) {
        // update current layer to layerStorage
        canvas.getObjects().forEach((obj) => {
          if (obj.isMoving) obj.stopAudio();
        });

        $(".icon-selector.active").removeClass("active");

        // create new layer
        const layer = {
          id: randomID(),
          canvas: {
            backgroundColor: "#ffffff",
            gridObj: null,
          },
        };
        currentLayer = len + 1;
        canvas.id = layer.id;
        canvas.clear();
        canvas.setBackgroundColor(
          layer.canvas.backgroundColor,
          canvas.renderAll.bind(canvas)
        );

        layerStorage.push(layer);

        socket.emit("addLayer", layer.id);

        const li = document.createElement("li");
        li.classList.add("icon-layer", "icon-selector", "active");
        $(li).attr("data-cnt", len + 1);
        $(li).attr("data-id", layer.id);
        console.log(`  ~ layer.id7`, layer.id);
        li.innerHTML = `<img src="assets/images/notepad/layer/layer-${len + 1
          }.png">`;

        $("#layers-body").append(li);
        updateToolBarStatus();
      }
    });

    $(".btn-delete-layer").click(function () {
      if (layerStorage.length > 1) {
        $("#panel").find(".typing-input").remove();
        canvas.clear();

        const layer = JSON.parse(
          JSON.stringify(layerStorage.find((item) => item.id == canvas.id))
        );

        console.log("delete layer:", layer, currentLayer);
        socket.emit("deleteLayer", layer);

        layerStorage = layerStorage.filter((item) => item.id != canvas.id);
        pool_data = pool_data.filter((obj) => obj.layer !== canvas.id);

        $(".icon-selector").remove();
        layerStorage.forEach((layer, index) => {
          const li = document.createElement("li");

          li.classList.add("icon-layer", "icon-selector");
          $(li).attr("data-cnt", index + 1);
          $(li).attr("data-id", layer.id);
          console.log(`  ~ layer.id8`, layer.id);
          li.innerHTML = `<img src="assets/images/notepad/layer/layer-${index + 1
            }.png">`;

          $("#layers-body").append(li);
        });

        // load next layer
        if (currentLayer > 1) {
          currentLayer--;
        }
        canvas.id = $(`.icon-selector[data-cnt="${currentLayer}"]`).data("id");

        updateToolBarStatus();

        loadLayerCanvasJsonNew(pool_data, canvas);
        console.log(`  ~ loadLayerCanvasJsonNew`, 8);
      }
    });

    // blink object animation
    function blink(obj) {
      if (obj.blink && obj.opacity == 1) {
        obj.animate("opacity", "0.3", {
          duration: 300,
          onChange: canvas.renderAll.bind(canvas),
          onComplete: function () {
            blink(obj);
          },
        });
      } else {
        obj.animate("opacity", "1", {
          duration: 300,
          onChange: canvas.renderAll.bind(canvas),
          onComplete: function () {
            blink(obj);
          },
        });
      }
    }

    // copy active objects when press ctrl + c
    function copyObjects() {
      if (!canvas.getActiveObject()) {
        return;
      }
      canvas.getActiveObject().clone(function (cloned) {
        _clipboard = cloned;
      }, customAttributes);
    }

    // paste copied objects when press ctrl + v
    function pasteObjects() {
      if (_clipboard) {
        _clipboard.clone(function (clonedObj) {
          canvas.discardActiveObject();
          clonedObj.set({
            left: clonedObj.left + 10,
            top: clonedObj.top + 10,
            evented: true,
          });
          // drag drop question special case
          if (clonedObj.answerId) {
            countItem++;
            clonedObj.answerId = countItem;
          }
          // end
          if (clonedObj.type === "activeSelection") {
            // active selection needs a reference to the canvas.
            clonedObj.canvas = canvas;
            clonedObj.forEachObject(function (obj) {
              obj.objectID = randomID();
              if (obj.name == "media") {
                if (obj.nameDevice == "attach-file") {
                  attachFileObj = obj;
                  startActiveFileObj(obj);

                } else {
                  activeDeviceObject = obj;
                  startActiveMedia(obj);
                }
              } else {
                activeDeviceObject = obj;
                startActiveMedia(obj);
              }
              canvas.add(obj);
            });
            // this should solve the unselectability
            clonedObj.setCoords();
          } else {
            clonedObj.objectID = randomID();
            if (clonedObj.name != "custom-group") {
              startActiveObject(clonedObj);
              canvas.add(clonedObj);
            } else {
              var listObject = clonedObj._objects;
              for (let index = 0; index < listObject.length; index++) {
                const element = listObject[index];
                if (element.__eventListeners) {
                  element.__eventListeners["mousedblclick"] = [];
                }
                console.log(element);
                if (element.type != "textbox") {
                  element.on("mousedblclick", handleDbclickChild);
                } else {
                  element.on("mouseup", function (e) {
                    if (e.button === 1) {
                      console.log("left click");
                    }
                    // if(e.button === 2) {
                    //     console.log("middle click");
                    // }
                    if (e.button === 3) {
                      handleTextboxRightclick(this);
                    }
                  });
                }
              }
              canvas.add(clonedObj);
            }
          }
          _clipboard.top += 10;
          _clipboard.left += 10;
          if (isMakingAnswer) {
            objectSnapAdjacent(clonedObj);
          }
          canvas.setActiveObject(clonedObj);
          canvas.requestRenderAll();
          isLoadDataLocal = false;
          emitEvent();
        }, customAttributes);
      }
    }

    //Functions of Chat
    function initChat() {
      var socket = io.connect(url);

      $(".btn-student").dblclick(function () {
        var id = $(this).attr("data-id");
        var tab = getTab();
        var channels = [];

        $("#tab-chat li").each(function (i) {
          var room = $(this).attr("data-room");
          channels.push("/" + room);
        });
        if (id != tab && cnt < 1) {
          cnt = cnt + 1;
          $(".inbox-message").css("display", "none");

          var username = $("#username")[0].value;
          console.log(username);
          var roomid;
          var stanza = (roomid = "private" + id);
          var ul = document.createElement("ul");
          ul.id = "testichat" + id;
          ul.className = "inbox-message style-scrollbar";

          var img = document.createElement("img");
          img.id = "closePrivate" + id;
          img.className = "close-private";
          img.src = plugin_url + "assets/images/notepad/icon_CLOSE.png";
          $("#chat").append(img);
          $("#chat").append(ul);

          var testichats = document.getElementById("testichat" + id);

          loadChat(username, roomid, clients, testichats);
          getSubscribe(clients, roomid, testichats);
          if (channels.length) unSubscribe(clients, channels);

          socket.emit("privatemessage", {
            id: id,
            roomid: roomid,
            studentid: id,
            studentname: username,
            room: stanza,
          });

          $(".all-message").removeClass("active");
          $(".mess-private").removeClass("active");
          $(
            '<li class="item-stt-message mess-private active" data-id="' +
            id +
            '" data-name="' +
            username +
            '" data-room="' +
            roomid +
            '"><p class="text-overfl">' +
            username +
            "</p></li>"
          ).insertAfter(".all-message");
        }
      });

      $(".prev-message").click(function () {
        var $prev = $("#tab-chat .active").prev();
        if ($prev.length) {
          $("#tab-chat").animate(
            {
              scrollLeft: $prev.position().left,
            },
            "slow"
          );
        }
      });

      $(".next-message").click(function () {
        var $next = $("#tab-chat .active").next();
        if ($next.length) {
          $("#tab-chat").animate(
            {
              scrollLeft: $next.position().left,
            },
            "slow"
          );
        }
      });

      socket.on("privatecreate", function (data) {
        var channels = [];

        $("#tab-chat li").each(function (i) {
          var room = $(this).attr("data-room");
          channels.push("/" + room);
        });

        $(".inbox-message").css("display", "none");

        var ul = document.createElement("ul");
        ul.id = "testichat" + data.studentid;
        ul.className = "inbox-message style-scrollbar";
        $("#chat").append(ul);
        stanza = data.roomid;

        var testichats = document.getElementById("testichat" + data.studentid);

        loadChat(username, data.roomid, clients, testichats);
        getSubscribe(clients, data.roomid, testichats);
        if (channels.length) unSubscribe(clients, channels);

        $(".all-message").removeClass("active");
        $(".mess-private").removeClass("active");
        $(
          '<li class="item-stt-message mess-private active" data-id="' +
          data.studentid +
          '" data-name="' +
          data.studentname +
          '" data-room="' +
          data.roomid +
          '"><p class="text-overfl">' +
          data.studentname +
          "</p></li>"
        ).insertAfter(".all-message");
      });
    }

    function activeTab() {
      $(document).on("click", ".item-stt-message", function () {
        var id = $(this).attr("data-id");
        var channels = [];
        $(".item-stt-message").removeClass("active");
        $(".inbox-message").css("display", "none");
        $(this).addClass("active");
        $("#tab-chat li").each(function (i) {
          if (!$(this).hasClass("active")) {
            var room = $(this).attr("data-room");
            channels.push("/" + room);
          }
        });
        if (id == 0) {
          getSubscribe(clients, stanza, testichat);
          if (channels.length) unSubscribe(clients, channels);
          $("#testichat").css("display", "block");
        } else {
          var username = $("#username")[0].value;
          var roomid;
          var stanza = (roomid = $(this).attr("data-room"));
          var testichats = document.getElementById("testichat" + id);
          getSubscribe(clients, roomid, testichats);
          if (channels.length) unSubscribe(clients, channels);
          $("#testichat" + id).css("display", "block");
        }
      });
    }

    function loadChat(username, roomid, client, testichats) {
      var name = username;
      console.log("username: ", username);
      var rooms = roomid;
      var clients = client;
      var testichat = testichats;
      var iconnn = document.getElementById("hihihi");
      var iconnnAC = document.getElementById("hahhhha");

      // fm.util.addOnLoad(function () {

      //     //init object chat between users a room
      //     var chat = {
      //         alias: 'Unknown',
      //         clientId: 0,
      //         channels: {
      //             main: '/' + rooms
      //         },
      //         dom: {
      //             chat: {
      //                 container: document.getElementById('chat'),
      //                 text: document.getElementById('scrivi'),
      //                 // send: document.getElementById('btn-send'),
      //                 send: document.getElementById('scrivi'),
      //                 emoji: document.getElementById('emoji'),
      //                 username: name,
      //                 roomid: rooms
      //             }
      //         },
      //         util: {
      //             start: function () {
      //                 chat.alias = name;
      //                 chat.clientId = rooms;
      //                 //chat.util.hide(chat.dom.prechat.container);
      //                 chat.util.show(chat.dom.chat.container);
      //                 chat.util.scroll();
      //                 chat.dom.chat.text.focus();
      //             },
      //             stopEvent: function (event) {
      //                 if(event.preventDefault) {
      //                     event.preventDefault();
      //                 } else {
      //                     event.returnValue = false;
      //                 }
      //                 if(event.stopPropagation) {
      //                     event.stopPropagation();
      //                 } else {
      //                     event.cancelBubble = true;
      //                 }
      //             },
      //             send: function () {
      //                 if(chat.util.isEmpty(chat.dom.chat.text)) {
      //                     chat.util.setInvalid(chat.dom.chat.text);
      //                 } else {
      //                     clients.publish({
      //                         retries: 0,
      //                         channel: '/' + rooms,
      //                         data: {
      //                             alias: chat.alias,
      //                             text: chat.dom.chat.text.value,
      //                             emoji: chat.dom.chat.emoji.value
      //                         },
      //                         onSuccess: function (args) {
      //                             chat.util.clear(chat.dom.chat.text);
      //                         }
      //                     });
      //                 }
      //             },
      //             show: function (el) {
      //                 el.style.display = '';
      //             },
      //             hide: function (el) {
      //                 el.style.display = 'none';
      //             },
      //             clear: function (el) {
      //                 el.value = '';
      //             },
      //             observe: fm.util.observe,
      //             isEnter: function (e) {
      //                 return (e.keyCode == 13);
      //             },
      //             isEmpty: function (el) {
      //                 return (el.value == '');
      //             },
      //             setInvalid: function (el) {
      //                 el.className = 'invalid';
      //             },
      //             clearLog: function () {
      //                 testichat.innerHTML = '';
      //             },
      //             logMessage: function (alias, text, me) {
      //                 var html = '<li';
      //                 if(me) {
      //                     html += ' class="item-message"';
      //                 } else {
      //                     html += ' class="item-message me"';
      //                 }
      //                 html += '><p class="name-sender">' + alias + ':</p><p class="content-mess">' + text + '</p></li>';
      //                 chat.util.log(html);
      //             },
      //             logSuccess: function (text) {
      //                 chat.util.log('<li class="item-message success"><p class="content-mess">' + text + '</p></li>');
      //             },
      //             logFailure: function (text) {
      //                 chat.util.log('<li class="item-message failure"><p class="content-mess">' + text + '</p></li>');
      //             },
      //             log: function (html) {
      //                 var div = document.createElement('div');
      //                 div.innerHTML = html;
      //                 testichat.appendChild(div);
      //                 chat.util.scroll();
      //             },
      //             scroll: function () {
      //                 testichat.scrollTop = testichat.scrollHeight;
      //             }
      //         }
      //     };

      //     chat.util.observe(chat.dom.chat.send, 'click', function (e) {
      //         chat.util.start();
      //         chat.util.send();
      //     });

      //     chat.util.observe(chat.dom.chat.text, 'keydown', function (e) {
      //         if(chat.util.isEnter(e)) {
      //             chat.util.start();
      //             chat.util.send();
      //             chat.util.stopEvent(e);

      //             iconnn.classList.add("hidden");
      //             iconnn.classList.remove("active");
      //             iconnnAC.classList.remove("active");
      //         }
      //     });

      //     client.setAutoDisconnect({
      //         synchronous: true
      //     });

      //     clients.connect({
      //         onSuccess: function (args) {
      //             chat.clientId = args.clientId;
      //             chat.util.clearLog();
      //             //chat.util.logSuccess('Connected to WebSync.');
      //             //chat.util.show(chat.dom.prechat.container);
      //             chat.util.show(chat.dom.chat.container);
      //         },
      //         onFailure: function (args) {
      //             //var username = args.getData().alias;
      //             //var content = c
      //             //chat.util.logSuccess('Could not connect to WebSync.');
      //         }
      //     });
      // });
    }

    function getSubscribe(clients, roomid, testichat) {
      clients.subscribe({
        channel: "/" + roomid,
        onSuccess: function (args) {
          //chat.util.logSuccess('Content chat.');
          var logs = args.getExtensionValue("logs");
          if (logs != null) {
            for (var i = 0; i < logs.length; i++) {
              logMessage(
                logs[i].alias,
                logs[i].text,
                false,
                testichat,
                logs[i].emoji
              );
            }
          }
        },
        onFailure: function (args) {
          //chat.util.logSuccess('Not connecting.');
        },
        onReceive: function (args) {
          var ch = args.getChannel();
          logMessage(
            args.getData().alias,
            args.getData().text,
            args.getWasSentByMe(),
            testichat,
            args.getData().emoji
          );
        },
      });
    }

    function unSubscribe(clients, channels) {
      clients.unsubscribe({
        channels: channels,
        onFailure: function (args) {
          alert(args.error);
        },
      });
    }

    function logMessage(alias, text, me, testichat, emoji) {
      var html = "<li";
      if (me) {
        html += ' class="item-message"';
      } else {
        html += ' class="item-message me"';
      }
      // <p class="emoji fl">
      //         <img src="assets/images/Icons/54_Status_Good.png" alt="emoji">
      //     </p>
      var image_patch = "assets/images/notepad/emo/";
      var image;

      switch (emoji) {
        case "fast":
          image = "Status_TooFast.png";
          break;
        case "confused":
          image = "Status_Confused.png";
          break;
        case "understand":
          image = "Status_Good.png";
          break;
        case "default":
          image = "Status_Defualt.png";
          break;
      }

      html +=
        '><p class="emoji fl"><img src="' +
        image_patch +
        image +
        '" alt="emoji"></p><p class="name-sender">' +
        alias +
        ':</p><p class="content-mess">' +
        text +
        "</p></li>";
      var div = document.createElement("div");
      div.innerHTML = html;
      testichat.appendChild(div);

      testichat.scrollTop = testichat.scrollHeight;

      $(testichat).mCustomScrollbar("destroy");
      $(testichat).mCustomScrollbar();
      $("#testichat").mCustomScrollbar("scrollTo", "bottom", {
        scrollInertia: 0,
      });
    }

    const selected = document.querySelector(".selected");
    const optionsContainer = document.querySelector(".options-container");

    const optionList = document.querySelectorAll(".option");

    const optionNew = document.querySelector("#newhihi");

    const optionOpen = document.querySelector("#openhihi");

    const optionSave = document.querySelector("#savehihi");

    const optionPre = document.querySelector("#p");

    selected.addEventListener("click", () => {
      optionsContainer.classList.toggle("active");
    });

    optionList.forEach((o) => {
      o.addEventListener("click", () => {
        optionsContainer.classList.remove("active");
      });
    });

    optionNew.addEventListener("click", () => { });

    optionOpen.addEventListener("click", () => {
      navigator.getMedia(
        { video: true },
        function () {
          alert("Camera Working");
        },
        function () {
          alert('Camera don"t work');
        }
      );
    });

    optionSave.addEventListener("click", () => {
      navigator.getMedia(
        { audio: true },
        function () {
          alert("Micro Working");
        },
        function () {
          alert('Micro don"t work');
        }
      );
    });

    optionPre.addEventListener("click", () => {
      $(".notepad-sheet-search").removeClass("hidden").addClass("active");
    });

    $(".sample-close").on("click", function () {
      WS.ClearSimpleData();
    });

    $('input[type="file"]').attr("title", webkitURL ? " " : "");

    //init variables
    let div = $("#panel");
    let hw = $("#wrapper");

    //width and height of canvas's wrapper
    let w, h;
    w = hw.width();
    h = hw.height();
    //set w & h for canvas
    canvas.setHeight(h);
    canvas.setWidth(w);

    function initCanvas(canvas) {
      canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
      canvas.freeDrawingBrush.shadow = new fabric.Shadow({
        blur: 0,
        offsetX: 0,
        offsetY: 0,
        affectStroke: true,
        color: "#ffffff",
      });
      canvas.freeDrawingBrush.color = activeColor;
      canvas.freeDrawingBrush.width = 1;
      canvas.isDrawingMode = false;

      return canvas;
    }

    function setBrush(options) {
      if (options.width !== undefined) {
        canvas.freeDrawingBrush.width = parseInt(options.width, 10);
      }

      if (options.color !== undefined) {
        canvas.freeDrawingBrush.color = options.color;
      }
    }

    function setCanvasSelectableStatus(val) {
      canvas.forEachObject(function (obj) {
        obj.lockMovementX = !val;
        obj.lockMovementY = !val;
        obj.hasControls = val;
        obj.hasBorders = val;
        obj.selectable = val;
      });
      canvas.renderAll();
    }

    function setFreeDrawingMode(val) {
      isFreeDrawing = val;
      disableShapeMode();
    }

    function enableShapeMode() {
      isFreeDrawing = canvas.isDrawingMode;
      canvas.isDrawingMode = false;
      canvas.selection = false;
      setCanvasSelectableStatus(false);
    }

    function disableShapeMode() {
      canvas.isDrawingMode = isFreeDrawing;
      if (isFreeDrawing) {
        $("#drwToggleDrawMode").addClass("active");
      }
      canvas.selection = true;
      isArrowActive = isRectActive = isCircleActive = false;
      setCanvasSelectableStatus(true);
    }

    function getTextForObject(obj, isText) {
      var text = username;
      var fontSize = 10;
      // startActiveTextbox(obj);
      canvas.add(obj);

      isLoadDataLocal = false;
      emitEvent();
    }

    function deleteObjects(objects) {
      if (objects) {
        objects.forEach(function (object) {
          // remove lineConnect + curvePoint
          canvas.getObjects().forEach((item) => {
            if (
              object.name === "curve-point" &&
              item.objectID === object.lineID
            ) {
              deleteObjInPool(item.objectID, pool_data, canvas.id, canvas);
              socket.emit("deleteObject", {
                objectID: item.objectID,
                layer: canvas.id,
              });
              canvas.remove(item);
              resetObjList();
            } else if (
              item.name === "lineConnect" &&
              (item.idObject1 === object.objectID ||
                item.idObject2 === object.objectID)
            ) {
              const curvePoint = canvas
                .getObjects()
                .find((obj) => obj.lineID === item.objectID);
              deleteObjInPool(item.objectID, pool_data, canvas.id, canvas);
              socket.emit("deleteObject", {
                objectID: item.objectID,
                layer: canvas.id,
              });
              canvas.remove(item);
              resetObjList();
              curvePoint && canvas.remove(curvePoint);
            }
          });
          deleteObjInPool(object.objectID, pool_data, canvas.id, canvas);
          socket.emit("deleteObject", {
            objectID: object.objectID,
            layer: canvas.id,
          });
          canvas.remove(object);
          resetObjList();
        });
      }
    }

    function textMode() {
      var textbox = new fabric.Textbox("Init Text", {
        left: 50,
        top: 50,
        width: 100,
        fontSize: 14,
        name: "text",
        textAlign: "center",
        fontFamily: "Times New Roman",
      });

      setDefaultAttributes(textbox);
      startActiveObject(textbox);
      getTextForObject(textbox, true);

      // $('#moveObject')[0].click();
    }

    async function createLatex(
      latex = "Latex",
      options = {
        fontSize: 14,
        top: 100,
        left: 100,
      }
    ) {
      var svg = latexToImg(latex);
      fabric.Image.fromURL(svg, function (img) {
        var text = username;
        var text = new fabric.Textbox(latex, {
          angle: 0,
          fontSize: 5,
          textAlign: "center",
          top: img.top,
          left: img.left,
          visible: false,
        });
        img.set({
          scaleX: (options.fontSize + 16) / 12,
          scaleY: (options.fontSize + 16) / 12,
        });
        var alltogetherObj = new fabric.Group([img, text], {
          top: options.top,
          left: options.left,
          fontSize: options.fontSize,
          originX: "center",
          originY: "center",
          name: "latex",
        });

        // startActiveTextbox(alltogetherObj);
        startActiveObject(alltogetherObj);

        canvas.add(alltogetherObj).setActiveObject(alltogetherObj);

        isLoadDataLocal = false;
        emitEvent();
      });
    }

    // Don't allow objects off the canvas
    function objectSnapCanvas(obj) {
      if (obj.snap) {
        obj.setCoords();

        const width = obj.width * obj.scaleX;
        const height = obj.height * obj.scaleY;

        if (obj.left < snap) {
          obj.left = 0;
        }

        if (obj.top < snap) {
          obj.top = 0;
        }

        if (width + obj.left > canvas.width - snap) {
          obj.left = canvas.width - width;
        }

        if (height + obj.top > canvas.height - snap) {
          obj.top = canvas.height - height;
        }

        canvas.requestRenderAll();
      }
    }

    // find new position for snap adjacent if obj is overlap
    function findNewPos(distX, distY, target, obj) {
      // See whether to focus on X or Y axis
      if (Math.abs(distX) > Math.abs(distY)) {
        if (distX > 0) {
          target.left = obj.left - target.width;
        } else {
          target.left = obj.left + obj.width;
        }
      } else {
        if (distY > 0) {
          target.top = obj.top - target.height;
        } else {
          target.top = obj.top + obj.height;
        }
      }
    }

    // snap object to adjacent position of an object
    function objectSnapAdjacent(object) {
      // Sets corner position coordinates based on current angle, width and height
      object.setCoords();

      // Loop through objects
      canvas.forEachObject(function (obj) {
        if (obj === object || obj.name != "quiz-inputObj") return;

        // If objects intersect
        if (
          object.isContainedWithinObject(obj) ||
          object.intersectsWithObject(obj) ||
          obj.isContainedWithinObject(object)
        ) {
          var distX =
            (obj.left + obj.width) / 2 - (object.left + object.width) / 2;
          var distY =
            (obj.top + obj.height) / 2 - (object.top + object.height) / 2;

          // Set new position
          findNewPos(distX, distY, object, obj);
        }

        // Snap objects to each other horizontally

        // If bottom points are on same Y axis
        if (
          Math.abs(object.top + object.height - (obj.top + obj.height)) < snap
        ) {
          // Snap target BL to object BR
          if (Math.abs(object.left - (obj.left + obj.width)) < snap) {
            object.left = obj.left + obj.width;
            object.top = obj.top + obj.height - object.height;
          }

          // Snap target BR to object BL
          if (Math.abs(object.left + object.width - obj.left) < snap) {
            object.left = obj.left - object.width;
            object.top = obj.top + obj.height - object.height;
          }
        }

        // If top points are on same Y axis
        if (Math.abs(object.top - obj.top) < snap) {
          // Snap target TL to object TR
          if (Math.abs(object.left - (obj.left + obj.width)) < snap) {
            object.left = obj.left + obj.width;
            object.top = obj.top;
          }

          // Snap target TR to object TL
          if (Math.abs(object.left + object.width - obj.left) < snap) {
            object.left = obj.left - object.width;
            object.top = obj.top;
          }
        }

        // Snap objects to each other vertically

        // If right points are on same X axis
        if (
          Math.abs(object.left + object.width - (obj.left + obj.width)) < snap
        ) {
          // Snap target TR to object BR
          if (Math.abs(object.top - (obj.top + obj.height)) < snap) {
            object.left = obj.left + obj.width - object.width;
            object.top = obj.top + obj.height;
          }

          // Snap target BR to object TR
          if (Math.abs(object.top + object.height - obj.top) < snap) {
            object.left = obj.left + obj.width - object.width;
            object.top = obj.top - object.height;
          }
        }

        // If left points are on same X axis
        if (Math.abs(object.left - obj.left) < snap) {
          // Snap target TL to object BL
          if (Math.abs(object.top - (obj.top + obj.height)) < snap) {
            object.left = obj.left;
            object.top = obj.top + obj.height;
          }

          // Snap target BL to object TL
          if (Math.abs(object.top + object.height - obj.top) < snap) {
            object.left = obj.left;
            object.top = obj.top - object.height;
          }
        }
      });

      object.setCoords();

      // If objects still overlap

      var outerAreaLeft = null,
        outerAreaTop = null,
        outerAreaRight = null,
        outerAreaBottom = null;

      canvas.forEachObject(function (obj) {
        if (obj === object || obj.name != "quiz-inputObj") return;

        if (
          object.isContainedWithinObject(obj) ||
          object.intersectsWithObject(obj) ||
          obj.isContainedWithinObject(object)
        ) {
          var intersectLeft = null,
            intersectTop = null,
            intersectWidth = null,
            intersectHeight = null,
            intersectSize = null,
            targetLeft = object.left,
            targetRight = targetLeft + object.width,
            targetTop = object.top,
            targetBottom = targetTop + object.height,
            objectLeft = obj.left,
            objectRight = objectLeft + obj.width,
            objectTop = obj.top,
            objectBottom = objectTop + obj.height;

          // Find intersect information for X axis
          if (targetLeft >= objectLeft && targetLeft <= objectRight) {
            intersectLeft = targetLeft;
            intersectWidth = obj.width - (intersectLeft - objectLeft);
          } else if (objectLeft >= targetLeft && objectLeft <= targetRight) {
            intersectLeft = objectLeft;
            intersectWidth = object.width - (intersectLeft - targetLeft);
          }

          // Find intersect information for Y axis
          if (targetTop >= objectTop && targetTop <= objectBottom) {
            intersectTop = targetTop;
            intersectHeight = obj.height - (intersectTop - objectTop);
          } else if (objectTop >= targetTop && objectTop <= targetBottom) {
            intersectTop = objectTop;
            intersectHeight = object.height - (intersectTop - targetTop);
          }

          // Find intersect size (this will be 0 if objects are touching but not overlapping)
          if (intersectWidth > 0 && intersectHeight > 0) {
            intersectSize = intersectWidth * intersectHeight;
          }

          // Set outer snapping area
          if (obj.left < outerAreaLeft || outerAreaLeft == null) {
            outerAreaLeft = obj.left;
          }

          if (obj.top < outerAreaTop || outerAreaTop == null) {
            outerAreaTop = obj.top;
          }

          if (obj.left + obj.width > outerAreaRight || outerAreaRight == null) {
            outerAreaRight = obj.left + obj.width;
          }

          if (obj.top + obj.height > outerAreaBottom || outerAreaBottom == null) {
            outerAreaBottom = obj.top + obj.height;
          }

          // If objects are intersecting, reposition outside all shapes which touch
          if (intersectSize) {
            var distX = outerAreaRight / 2 - (object.left + object.width) / 2;
            var distY = outerAreaBottom / 2 - (object.top + object.height) / 2;

            // Set new position
            findNewPos(distX, distY, object, obj);
          }
        }
      });
    }

    // hide popup menu
    function hidePopupMenu() {
      $("#edit-form").css({ visibility: "hidden" });
      $("#edit-form-textbox").css({ visibility: "hidden" });
      // $('#sub-menu').slideUp()
      // $('#path-menu').slideUp()
      $("#pathBtns").css({ visibility: "hidden" });
      // $('.device-popup').addClass('hidden');
      $("#sub-menu-mic").css({ visibility: "hidden" });
      $("#sub-menu-camera").css({ visibility: "hidden" });
      $("#sub-menu-file").css({ visibility: "hidden" });
      $("#path-menu-mic").css({ visibility: "hidden" });
      $("#path-menu-camera").css({ visibility: "hidden" });
      $("#path-menu-file").css({ visibility: "hidden" });
      $("#pathBtns-mic").css({ visibility: "hidden" });
      $("#pathBtns-camera").css({ visibility: "hidden" });
      $("#pathBtns-file").css({ visibility: "hidden" });
    }

    // set default attributes object
    function setDefaultAttributes(obj) {
      obj.set({
        // isChoosePort: false,
        // port: [],

        groupID: null,

        colorBorder: "#000",
        widthBorder: 1,
        curve: 0,
        hasShadow: false,
        shadow: null,
        shadowObj: new fabric.Shadow({
          blur: 30,
          color: "#999",
          offsetX: 0,
          offsetY: 0,
        }),
        fixed: false,
        position: "front",

        isMoving: false,
        isRepeat: false,
        isDrawingPath: false,
        speedMoving: 1,
        pathObj: null,
        soundMoving: "",
        nameSoundMoving: "",

        blink: false,
        lineStyle: "solid",
        lockMovementX: false,
        lockMovementY: false,

        select: false,
        status: false,
        colorText: "#000",
        colorTextSelected: "#000",
        colorSelected: "#ccc",
        colorUnselected: "#fff",
        soundSelected: "",
        nameSoundSelected: "",
        soundUnselected: "",
        nameSoundUnselected: "",

        input: false,
        soundTyping: "",
        nameSoundTyping: "",

        snap: false,
        soundSnap: "assets/song/snap.mp3",
        nameSoundSnap: "",
      });
    }

    // quiz-11
    var selectedObject = null;
    // get element id object-viewtable-body
    $("#open-multiple-choose-modal").on("click", function (e) {
      var Rect = new fabric.Rect({
        left: Math.random() * canvas.width,
        top: Math.random() * canvas.height,
        width: 100,
        height: 60,
        radius: 30,
        fill: 'green',
        name: 'quiz-multipleObj',
        objectId: randomID(),
        result: false,
        objectType: "",
      });
      // // Group circle and text together
      // var group = new fabric.Group([circle, text], {
      //   left: circle.left,  // Set the left position based on the circle
      //   top: circle.top,    // Set the top position based on the circle
      //   selectable: true,
      // });
      // // Group circle and text together
      // var group = new fabric.Group([circle, text], {
      //   selectable: true,
      // });
      // objectQuizMutiple.push(group);
      // Create <tr> element with circle data
      addTableRow(Rect);
      // var rowData = [circle.objectId, circle.name, circle.objectType, circle.result];
      // // Create a new table row
      // var tr = document.createElement("tr");
      // // Add cells to the row
      // for (var i = 0; i < rowData.length; i++) {
      //   var td = document.createElement("td");
      //   td.style.border = "1px solid white";
      //   td.style.padding = "7px";
      //   td.style.backgroundColor = "black";
      //   td.style.color = "white";
      //   td.textContent = rowData[i];
      //   tr.appendChild(td);
      // }
      // // Append the row to the table body
      // document.getElementById("object-view-table-body").appendChild(tr);
      // Add the circle with text to the canvas
      startActiveObject(Rect);
      canvas.add(Rect);
      Rect.on("mouseup", function (e) {
        if (e.button === 3) {
          selectedObject = Rect;
          showPopUpMenuQuiz(Rect);
        }
      });
      Rect.on("moving", function (e) {
        //reset obj select

        hidePopupMenu();
      });
      Rect.on("movedown", function (e) {
        hidePopupMenu();
      });
    });
    function addTableRow(object) {
      // Create <tr> element with circle data
      var rowData = [object.objectId, object.name, object.objectType, object.result];
      var tr = document.createElement("tr");
      // Add cells to the row
      for (var i = 0; i < rowData.length; i++) {
        var td = document.createElement("td");
        td.style.border = "1px solid white";
        td.style.padding = "7px";
        td.style.backgroundColor = "black";
        td.style.color = "white";
        td.textContent = rowData[i];
        tr.appendChild(td);
      }
      // Append the row to the table body
      document.getElementById("object-view-table-body").appendChild(tr);
    }
    var fileUploadMultipleImage = $("#fileUploadMultipleImage")[0];
    $("#open-multiple-upload-image").on("click", function (e) {
      console.log("open-multiple-upload-image");
      fileUploadMultipleImage.click();
    });
    fileUploadMultipleImage.addEventListener('change', function () {
      const file = fileUploadMultipleImage.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
          const dataURL = e.target.result;
          fabric.Image.fromURL(dataURL, function (img) {
            // Center the image on the canvas
            img.set({
              name: 'quiz-multipleObj',
              objectId: randomID(),
              result: false,
              objectType: "",
              left: canvas.width / 2,
              top: canvas.height / 2,
              objectCaching: false,
              hasControls: true, // Enable resizing handles
              hasBorders: true, // Enable borders
            });
            addTableRow(img);
            img.on("mouseup", function (e) {
              if (e.button === 3) {
                selectedObject = img;
                showPopUpMenuQuiz(img);
              }
            });
            img.on("moving", function (e) {
              //reset obj select
              hidePopupMenu();
            });
            img.on("movedown", function (e) {
              hidePopupMenu();
            });
            startActiveObject(img);
            canvas.add(img);
          });
        };
        reader.readAsDataURL(file);
      }
    });
    $("#multiple-choose-question").on("click", function(e) {
      // Thiết lập đối tượng làm việc (active object) là đối tượng hình tròn
      canvas.setActiveObject(canvas.item(0));
      // Tạo một đối tượng hình chữ nhật mới
      var rect = new fabric.Rect({
        name: "question-multipleObj",
        width: 100,
        height: 60,
        stroke: "#808080",
        strokeWidth: 1,
        fill: 'yellow',
        originX: "center",
        originY: "center",
        rx: 12,
        ry: 12,
      });
      var oldColor = rect.fill;
  
      const shadow = new fabric.Shadow({
        blur: 12,
        offsetX: 0,
        offsetY: 0,
      });
      rect.set({
        shadow: shadow,
      });
    
      // Thêm sự kiện scaling để thực hiện resize khi scaling
      rect.on("scaling", function() {
        this.set({
          width: this.width * this.scaleX,
          height: this.height * this.scaleY,
          scaleX: 1,
          scaleY: 1,
        });
      })

    });
    $("#multiple-choose-lock-object").on("click", function (e) {
      var rect = new fabric.Rect({
        name: "lock-multipleObj",
        width: 100,
        height: 60,
        stroke: "#808080",
        strokeWidth: 1,
        fill: 'yellow',
        originX: "center",
        originY: "center",
        rx: 12,
        ry: 12,
      });
      var oldColor = rect.fill
      const shadow = new fabric.Shadow({
        blur: 12,
        offsetX: 0,
        offsetY: 0,
      });
      rect.set({
        shadow: shadow,
      })
      getTextForObject(createTextBoxLock(rect));
    });

      $("#open-multiple-add-rect").on("click", function (e) {
        // Tạo một hình chữ nhật
        let objectId_random = randomID();
        var rect = new fabric.Rect({
          left: 50,
          top: 50,
          width: 100,
          height: 100,
          fill: "blue",
          name: `quiz-multipleObj-${objectId_random}`,
          objectId: objectId_random,
          result: false,
          objectType: "",
          stroke: "black",
          strokeWidth: 1,
        });

        // Tạo một hộp văn bản có thể chỉnh sửa
        var textbox = new fabric.Textbox("Init Text", {
          width: 100,
          left: rect.left,
          top: rect.top,
          fontSize: 14,
          name: `quiz-multipleObj-textbox-${objectId_random}`,
          objectId: objectId_random,
          result: false,
          objectType: "",
          textAlign: "center",
          fontFamily: "Times New Roman",
          //selectable: false, // Tắt khả năng di chuyển cho textbox
          hasControls: false, // Tắt hiển thị các điều khiển của textbox
          // hasBorders: false, // Tắt viền textbox
        });
        rect.textbox = textbox;
        console.log("rect", rect);
        // Tắt hiển thị các điều khiển của textbox
        textbox.setControlsVisibility({
          bl: false,
          br: false,
          mb: false,
          ml: false,
          mr: false,
          mt: false,
          tl: false,
          tr: false,
          mtr: false,
        });
        //canvas.bringToFront(textbox);
        startActiveObject(rect);
        addTableRow(rect);
        canvas.add(rect);
        canvas.add(textbox);
        // Sự kiện khi textbox thay đổi
        textbox.on("changed", function (e) {
          console.log("textbox changed");
          // Cập nhật kích thước của rect dựa trên kích thước của textbox
          rect.set({
            width: textbox.width + 20, // 20 là một giả định để tạo ra khoảng trống xung quanh văn bản
            height: textbox.height + 20,
          });

          // Đặt lại vị trí của textbox
          textbox.set({
            left: rect.left + 10,
            top: rect.top,
          });

          // Cập nhật canvas
          canvas.renderAll();
        });

        // Sự kiện khi rect di chuyển
        rect.on("moving", function (e) {
          // Kiểm tra xem có đang chỉnh sửa textbox hay không
          if (!textbox.isEditing) {
            hidePopupMenu();
            // Đặt lại vị trí của textbox khi rect di chuyển
            console.log("rect moving", rect.textBoxPosition);
            if (rect.textBoxPosition) {
              if (rect.textBoxPosition === "top") {
                textbox.set({
                  left: rect.left,
                });
              } else if (rect.textBoxPosition === "bottom") {
                textbox.set({
                  left: rect.left,
                  top: rect.top + rect.height - textbox.height,
                });
              } else if (rect.textBoxPosition === "middle") {
                textbox.set({
                  left: rect.left,
                  top: rect.top + rect.height / 2 - textbox.height / 2,
                });
              }
            }
            else {
              textbox.set({
                left: rect.left,
                top: rect.top,
              });
            }
          }
          // Cập nhật canvas
          canvas.renderAll();
        });

        rect.on("mouseup", function (e) {
          if (e.button === 3) {
            selectedObject = rect;
            showPopUpMenuQuiz(rect);
            //activeObject = rect
            canvas.setActiveObject(rect);
          }
        });
        rect.on("movedown", function (e) {
          hidePopupMenu();
        });

      });

      //remove object in canvas and table
      $("#delete-multiple-choose-object").on("click", function (e) {
        var activeObject = canvas.getActiveObject();
        if (!activeObject) {
          return
        }
        if (!activeObject.textbox) {
          return
        }
        canvas.remove(activeObject.textbox);
        if (activeObject) {
          var deleteObjectId = activeObject.objectId;
          var textbox;
          if (activeObject.textbox) {
            textbox = activeObject.textbox;
          }
          canvas.remove(textbox);
          canvas.remove(activeObject);
          // Remove the object from the table
          var correspondingTableRow = findTableRowByObjectId(deleteObjectId);
          if (correspondingTableRow) {
            correspondingTableRow.remove();
          }
        }
      });

      function findTableRowByObjectId(objectId) {
        var tableRows = document.getElementById("object-view-table-body").getElementsByTagName("tr");
        for (var i = 0; i < tableRows.length; i++) {
          if (tableRows[i].cells[0].textContent === objectId) {
            return tableRows[i];
          }
        }
        return null;
      }
      function findTableRowInResultTableByObjectId(objectId) {
        var tableRows = document.getElementById("result-view-table-body").getElementsByTagName("tr");
        for (var i = 0; i < tableRows.length; i++) {
          if (tableRows[i].cells[0].textContent === objectId) {
            return tableRows[i];
          }
        }
        return null;
      }
      function updateTableRow(objectId, property, value) {
        var tableRow = findTableRowByObjectId(objectId);
        if (tableRow) {
          tableRow.cells[property].textContent = value;
        }
      }
      function showPopUpMenuQuiz(obj) {
        if (selectedObject) {
          var activeObject = canvas.getActiveObject();
          const editForm = $("#edit-form-quiz")[0];
          // Calculate position based on object type
          var popupTop, popupLeft;

          if (obj.type === 'circle') {
            popupTop = obj.top - obj.radius - 5; // Adjust the gap as needed
            popupLeft = obj.left - obj.radius - 5;
          } else if (obj.type === 'image') {
            popupTop = obj.top - 35; // Adjust the gap as needed
            popupLeft = obj.left - obj.width / 2 - 5;
          } else {
            // Handle other types of objects here
            // You may need to adjust the positioning based on the object type
            popupTop = obj.top - 20;
            popupLeft = obj.left - obj.width - 5;
          }

          const zoom = canvas.getZoom();
          let top = popupTop * zoom + canvas.getTop();
          let left = (popupLeft + obj.width / 2 * obj.scaleX) * zoom + canvas.getLeft() - 180;

          // Move the popup to the right by 50 pixels (adjust as needed)
          left += 50;

          // top -50
          top -= 30;
          if (editForm.style.visibility === "hidden" || activeObject !== obj) {
            console.log("Entering if block");
            activeObject = obj;
            editForm.style.visibility = "visible";
            editForm.style.position = "absolute";
            editForm.style.left = left + "px";
            editForm.style.top = top + "px";
            //change object name not finish
            var objectNameInput = document.getElementById("objectNameInput");
            objectNameInput.value = obj.name;
            objectNameInput.placeholder = obj.name;
            var selectObjectType = $("#selectObjectType")[0];
            selectObjectType.value = obj.objectType;
            var selectObjectResult = $("#selectObjectResult")[0];
            selectObjectResult.value = obj.result;
            var textBoxPosition = $("#textBoxPosition")[0];
            textBoxPosition.value = "top";
            var textBoxRadius = $("#textBoxRadius")[0];
            textBoxRadius.value = obj.radius;
            var lineStyleShape = $("#lineStyleShape")[0];
            var textBoxColorObject = $("#textBoxColorObject")[0];
            if (obj.textbox) {
              textBoxColorObject.value = obj.textbox.fill;
            }
            if (obj.fill) {
              var fillObjectColor = $("#fillObjectColor")[0];
              fillObjectColor.value = obj.fill;
            }
            var borderColorShape = $("#borderColorShape")[0];
            borderColorShape.value = obj.stroke;
            if (obj.strokeDashArray) {
              if (obj.strokeDashArray[0] === 5 && obj.strokeDashArray[1] === 5) {
                lineStyleShape.value = "dotted";
              } else if (obj.strokeDashArray[0] === 10 && obj.strokeDashArray[1] === 5) {
                lineStyleShape.value = "dash";
              }
            }
            else {
              lineStyleShape.value = "solid";
            }
            var shadowShape = $("#shadowShape")[0];
            if (obj.shadow) {
              shadowShape.value = "shadow";
            }
            else {
              shadowShape.value = "no shadow";
            }
            var borderWidthShape = $("#borderWidthShape")[0];
            borderWidthShape.value = obj.strokeWidth;
            objectNameInput.onchange = function () {
              console.log("objectNameInput", objectNameInput.value);
              activeObject.name = objectNameInput.value;
              activeObject._objects[1].text = objectNameInput.value;
              updateTableRow(activeObject.objectId, 1, objectNameInput.value);
              canvas.renderAll();
            };

            //change object type
            // fontFamily
            $("#font li").removeClass("active");
            $(`#font li[value="${obj.fontFamily}"]`).addClass("active");
          } else {
            hidePopupMenu();
          }
        }
      }
      $("#textBoxShape").on("change", function (e) {
        var activeObject = canvas.getActiveObject();
        if (activeObject) {
          var selectedValue = $(this).val();
          console.log(selectedValue);
        }
      });
      $("#bgToggleShape").on("click", function (e) {
        var activeObject = canvas.getActiveObject();
        if (activeObject) {
          if (activeObject.isBackground) {
            activeObject.set({
              isBackground: false,
              isDrag: true,
              isDrop: false,
              lockMovementX: false,
              lockMovementY: false,
            });
            this.innerText = "Off";
            canvas.setBackgroundImage(null, canvas.renderAll.bind(canvas));
          } else {
            activeObject.set({
              isBackground: true,
              isDrag: false,
              isDrop: false,
              lockMovementX: true,
              lockMovementY: true,
            });
            repositionDragDrop();
            this.innerText = "On";
            canvas.setBackgroundImage(activeObject, canvas.renderAll.bind(canvas), {
              top: 0,
              left: 0,
              scaleX: canvas.width / activeObject.width,
              scaleY: canvas.height / activeObject.height,
            });
          }
        }
      });

      $("#textBoxRadius").on("change", function (e) {
        var activeObject = canvas.getActiveObject();
        if (activeObject) {
          var selectedValue = $(this).val();
          console.log(parseInt(selectedValue, 10));
          activeObject.set({
            rx: parseInt(selectedValue, 10),
            ry: parseInt(selectedValue, 10),
          });
        }
      });
      $("#borderWidthShape").on("input", function (e) {
        var activeObject = canvas.getActiveObject();
        if (activeObject) {
          var selectedValue = $(this).val();
          activeObject.set({
            strokeWidth: parseInt(selectedValue, 10),
          });
        }
      });

      $("#lineStyleShape").on("change", function (e) {
        var activeObject = canvas.getActiveObject();
        if (activeObject) {
          var selectedValue = $(this).val();
          if (selectedValue === "solid") {
            activeObject.set({
              strokeDashArray: null,
            });
          } else if (selectedValue === "dotted") {
            activeObject.set({
              strokeDashArray: [5, 5],
            });
          } else if (selectedValue === "dash") {
            activeObject.set({
              strokeDashArray: [10, 5],
            });
          }
        }
      });

      $("#alignTextBox").on("click", function (e) {
        var activeObject = canvas.getActiveObject();
        if (activeObject) {
          var target = event.target;
          var textbox = canvas.getObjects().find((obj) => obj.objectId === activeObject.objectId && obj.name === "quiz-multipleObj-textbox");
          if (textbox) {
            if (textbox.textAlign === "left") {
              textbox.set({
                textAlign: "center",
              });
            } else if (textbox.textAlign === "center") {
              textbox.set({
                textAlign: "right",
              });
            } else if (textbox.textAlign === "right") {
              textbox.set({
                textAlign: "left",
              });
            }
          }
        }
      });

      $("#textBoxPosition").on("change", function () {
        var activeObject = canvas.getActiveObject();
        if (activeObject) {
          var selectedValue = $(this).val();
          var textbox = canvas.getObjects().find((obj) => obj.objectId === activeObject.objectId && obj.name === "quiz-multipleObj-textbox");
          if (textbox) {
            if (selectedValue === "top") {
              textbox.set({
                top: activeObject.top,
              });
              activeObject.textBoxPosition = "top";
            } else if (selectedValue === "bottom") {
              textbox.set({
                top: activeObject.top + activeObject.height - textbox.height,
              });
              activeObject.textBoxPosition = "bottom";
            } else if (selectedValue === "middle") {
              textbox.set({
                top: activeObject.top + activeObject.height / 2 - textbox.height / 2,
              });
              activeObject.textBoxPosition = "middle";
            }
          }
        }
      });

      $("#selectObjectType").on("change", function () {
        console.log("selectObjectType");
        var activeObject = canvas.getActiveObject();
        if (activeObject) {
          var selectedValue = $(this).val();
          activeObject.objectType = selectedValue;
          if (activeObject.objectType === "answer") {
            console.log("activeObject.objectType", activeObject);
            if (activeObject.result === "true") {
              var answer = {
                id: activeObject.objectId,
                name: activeObject.name,
                value: activeObject.result
              }
              correctAnswers.push(answer);
              console.log("correctAnswers", correctAnswers);
            }
          } else {
            //remove answer in correctAnswers
            var index = correctAnswers.findIndex(x => x.id === activeObject.objectId);
            if (index !== -1) {
              correctAnswers.splice(index, 1);
            }
            console.log("correctAnswers", correctAnswers);
          }
          updateTableRow(activeObject.objectId, 2, selectedValue);
        }
      });

      $("#selectObjectResult").on("change", function () {
        var activeObject = canvas.getActiveObject();
        if (activeObject) {
          var selectedValue = $(this).val();
          activeObject.result = selectedValue;
          if (activeObject.objectType === "answer") {
            console.log("activeObject.objectType", activeObject);
            if (activeObject.result === "true") {
              var answer = {
                id: activeObject.objectId,
                name: activeObject.name,
                value: activeObject.result
              }
              correctAnswers.push(answer);
              console.log("correctAnswers", correctAnswers);
            }
          }
          else {
            //remove answer in correctAnswers
            var index = correctAnswers.findIndex(x => x.id === activeObject.objectId);
            if (index !== -1) {
              correctAnswers.splice(index, 1);
            }
            console.log("correctAnswers", correctAnswers);
          }
          updateTableRow(activeObject.objectId, 3, selectedValue);
        }
      });
      $("#fillObjectColor").on("input", function (e) {
        var activeObject = canvas.getActiveObject();
        if (activeObject) {
          var selectedValue = $(this).val();
          activeObject.fill = selectedValue;
        }
      });
      $("#textBoxColorObject").on("input", function (e) {
        var activeObject = canvas.getActiveObject();
        if (activeObject) {
          var selectedValue = $(this).val();
          // find texbox in canvas has same objectId
          var textbox = canvas.getObjects().find((obj) => obj.objectId === activeObject.objectId && obj.name === "quiz-multipleObj-textbox");
          textbox.set({
            fill: selectedValue,
          });
        }
      });
      $("#sizeTextBox").on("click", function (e) {
        var activeObject = canvas.getActiveObject();
        if (activeObject) {
          var target = e.target;
          // Check if the clicked element is an <a> tag inside an <li> tag
          if (target.tagName === 'A' && target.parentElement.tagName === 'LI') {
            var selectedValue = target.parentElement.getAttribute('value');
            console.log("Selected size:", selectedValue);
            var textbox = canvas.getObjects().find((obj) => obj.objectId === activeObject.objectId && obj.name === "quiz-multipleObj-textbox");
            // Check if the textbox is found
            if (textbox) {
              // Update the font size of the textbox
              textbox.set({
                fontSize: parseInt(selectedValue, 10), // Convert the string to an integer
              });
              activeObject.set({
                width: textbox.width + 20, // 20 là một giả định để tạo ra khoảng trống xung quanh văn bản
                height: textbox.height + 20,
              });
              // Update the canvas
              canvas.renderAll();
            }
          }
        }
      });
      $("#animeShapeEasing").on("click", function () {
        var activeObject = canvas.getActiveObject();
        if (activeObject) {
          activeObject
          activeObject.animate("left", "+=100", {
            onChange: canvas.renderAll.bind(canvas),
            duration: 1000,
            easing: fabric.util.ease.easeOutBounce,
          });
        }
      });
      // Lắng nghe sự kiện click cho nút in đậm
      $("#boldTextBox").on("click", function () {
        var activeObject = canvas.getActiveObject();
        if (activeObject) {
          var textbox = canvas.getObjects().find((obj) => obj.objectId === activeObject.objectId && obj.name === "quiz-multipleObj-textbox");
          if (textbox) {
            // Đảo ngược trạng thái in đậm của văn bản
            textbox.set("fontWeight", textbox.fontWeight === 'bold' ? 'normal' : 'bold');
            canvas.renderAll();
          }
        }
      });

      $("#borderColorShape").on("input", function () {
        var activeObject = canvas.getActiveObject();
        if (activeObject) {
          var selectedValue = $(this).val();
          activeObject.set({
            stroke: selectedValue,
          });
        }
      });

      $("#shadowShape").on("change", function () {
        var activeObject = canvas.getActiveObject();
        if (activeObject) {
          //shadow set for fabric
          var selectedValue = $(this).val();
          if (selectedValue === "no shadow") {
            activeObject.set({
              shadow: null,
            })
          } else if (selectedValue === "shadow") {
            // Initiate a shadow object
            var shadow = new fabric.Shadow({
              color: activeObject.fill,
              blur: 7,
              offsetX: 20,
              offsetY: 20,
            });
            activeObject.set({
              shadow: shadow,
            })
          }
        }
      });

      // Lắng nghe sự kiện click cho nút in nghiêng
      $("#italicTextBox").on("click", function () {
        var activeObject = canvas.getActiveObject();
        if (activeObject) {
          var textbox = canvas.getObjects().find((obj) => obj.objectId === activeObject.objectId && obj.name === "quiz-multipleObj-textbox");
          if (textbox) {
            // Đảo ngược trạng thái in nghiêng của văn bản
            textbox.set("fontStyle", textbox.fontStyle === 'italic' ? 'normal' : 'italic');
            canvas.renderAll();
          }
        }
      });

      // Lắng nghe sự kiện click cho nút gạch chân
      $("#underlineTextBox").on("click", function () {
        var activeObject = canvas.getActiveObject();
        if (activeObject) {
          var textbox = canvas.getObjects().find((obj) => obj.objectId === activeObject.objectId && obj.name === "quiz-multipleObj-textbox");
          if (textbox) {
            // Đảo ngược trạng thái gạch chân của văn bản
            textbox.set("underline", !textbox.underline);
            canvas.renderAll();
          }
        }
      });

      $("#fontTextBox").on("click", function (e) {
        var activeObject = canvas.getActiveObject();
        if (activeObject) {
          var target = e.target;
          // Check if the clicked element is an <a> tag inside an <li> tag
          if (target.tagName === 'A' && target.parentElement.tagName === 'LI') {
            var selectedFont = target.parentElement.getAttribute('value');
            var textbox = canvas.getObjects().find((obj) => obj.objectId === activeObject.objectId && obj.name === "quiz-multipleObj-textbox");
            // Check if the textbox is found
            if (textbox) {
              console.log("textbox", selectedFont);
              // Update the font family of the textbox
              textbox.set({
                "fontFamily": selectedFont,
              });
              // Update the canvas
              canvas.renderAll();
            }
          }
        }
      });





      function hidePopupMenu() {
        const editForm = $("#edit-form-quiz")[0];
        editForm.style.visibility = "hidden";
      }


      // call this function to create attributes and event for object
      function startActiveObject(obj) {
        // audio object
        const audio = new Audio("");
        obj.playSound = function (name) {
          if (name == "selected") audio.src = obj.soundSelected;
          else if (name == "unselected") audio.src = obj.soundUnselected;
          else if (name == "typing") audio.src = obj.soundTyping;
          else if (name == "snap") audio.src = obj.soundSnap;
          else if (name == "soundWorksheet") audio.src = obj.soundWorksheet;
          else console.error("Invalid sound name:", name);
          console.log("play sound", name, audio.src);
          audio.load();
          audio.play();
        };

        const movingSound = new Audio(soundMoving);
        movingSound.loop = true;

        obj.startMoving = function () {
          startPathAnimation(obj);

          if (obj?.soundMoving != "") {
            movingSound.src = obj.soundMoving;
            movingSound?.load();
            movingSound?.play();
          }
        };

        obj.stopAudio = function () {
          audio.pause();
          movingSound.pause();
        };
        // start object animation if isMoving
        if (obj.isMoving) obj.startMoving();
        if (obj.blink) blink(obj);
        console.log('selected')
        if (obj.name == "quiz-selectObj") {
          selectObjEventHandler(obj);
        } else if (obj.name == "quiz-inputObj") {
          inputObjEventHandler(obj);
        } else if (obj.name == "quiz-matchObj") {
          matchObjEventHandler(obj);
        } else if (obj.name.startsWith("quiz-multipleObj")) {
          multipleObjEventHandler(obj);
        } else {
          console.log("obj", obj);
          obj.on("mouseup", function (e) {
            if (e.button === 3) showPopUpMenu(obj);
          });

          obj.on("mousedown", function (e) {
            touchPopupMenu(e.pointer, () => showPopUpMenu(obj));
          });

          obj.on("moving", function () {
            if (this.snap) {
              const _this = this;
              // options = options.transform;
              // Sets corner position coordinates based on current angle, width and height
              objectSnapCanvas(this);

              const o1 = {
                x: this.top + this.height / 2,
                y: this.left + this.width / 2,
              };

              // Loop through objects
              canvas.forEachObject(function (obj) {
                if (obj === _this || (obj.type == "circle" && obj.name == "port"))
                  return;

                // if (options.target.isContainedWithinObject(obj) ||
                //     options.target.intersectsWithObject(obj) ||
                //     obj.isContainedWithinObject(options.target))
                // {

                // }

                const o2 = {
                  x: obj.top + obj.height / 2,
                  y: obj.left + obj.width / 2,
                };

                if (Math.sqrt((o1.x - o2.x) ** 2 + (o1.y - o2.y) ** 2) < snap) {
                  _this.top = o2.x - _this.height / 2;
                  _this.left = o2.y - _this.width / 2;

                  if (isMakingAnswer) {
                    const check = correctAnswers.find(
                      (item) => item.id == object.objectID
                    );
                    if (!check) {
                      correctAnswers.push({
                        id: object.objectID,
                        name: "input",
                      });
                      console.log("correct answer:", orrectAnswers);
                    }
                  } else if (isDoQuiz) {
                    const check = userAnswers.find(
                      (item) => item.id == object.objectID
                    );
                    if (!check) {
                      userAnswers.push({
                        id: object.objectID,
                        name: "input",
                      });
                      console.log("user answer:", userAnswers);
                    }
                  }

                  _this.playSound("snap");
                } else {
                  if (isMakingAnswer) {
                    correctAnswers = correctAnswers.filter(
                      (item) => item.id != object.objectID
                    );
                    console.log("correct answer:", orrectAnswers);
                  } else if (isDoQuiz) {
                    userAnswers = userAnswers.filter(
                      (item) => item.id != object.objectID
                    );
                    console.log("user answer:", userAnswers);
                  }
                }
              });

              this.setCoords();
            }

            if ($("#edit-form")[0].style.visibility === "visible") {
              hidePopupMenu();
            }
          });

          obj.on("mouseup", function () {
            obj.stopAudio();
          });

          changeCoordinateConnectLine(obj);
        }
      }
      function handleDbclickChild() {
        const editForm = $("#edit-form")[0];

        if (editForm.style.visibility === "hidden" || activeObject !== this) {
          activeObject = this;
          $("#soundSelected")[0].nextElementSibling.innerText =
            this.nameSoundSelected;
          $("#soundUnselected")[0].nextElementSibling.innerText =
            this.nameSoundUnselected;
          $("#soundTyping")[0].nextElementSibling.innerText = this.nameSoundTyping;
          $("#soundSnap")[0].nextElementSibling.innerText = this.nameSoundSnap;
          if (this.type == "image") {
            var imageContent = this;
          } else {
            imageContent = findContent(this);
          }
          $("#objBlink")[0].innerText = this.blink ? "ON" : "OFF";
          $("#objectCode")[0].value = this.objectCode
            ? this.objectCode
            : "undefined";
          if (imageContent) {
            $("#replaceImg")[0].disabled = false;
            console.log(imageContent);
            $("#replaceImg")[0].nextElementSibling.innerText =
              imageContent.nameImageContent;
          } else {
            $("#replaceImg")[0].disabled = true;
          }
          $("#lineStyle")[0].value = this.lineStyle;

          $("#objSelect")[0].checked = this.select;
          $("#objInput")[0].checked = this.input;
          $("#objSnap")[0].checked = this.snap;
          $("#objControl")[0].checked = this.hasControls;
          $("#textColor")[0].value = this.colorText;
          $("#borderColor")[0].value = this.colorBorder;
          $("#fillColor")[0].value = this.fill;
          $("#textBoxRadiusText")[0].value = this.radius;
          $("#borderWidth")[0].value = this.widthBorder;
          $("#objCurve")[0].value = this.curve;
          $("#objAngle")[0].value = this.angle;
          $("#objBring")[0].value = this.position;
          $("#objShadow")[0].innerText = this.hasShadow ? "On" : "Off";
          $("#objFixed")[0].innerText = this.lockMovementX ? "On" : "Off";

          if (this.pathObj) {
            const value = this.pathObj.path
              .map((point) => `[${parseInt(point[2])}, ${parseInt(point[1])}]`)
              .join(" ");
            $("#pathObj").val(value);
          } else $("#pathObj").val("Empty");

          if (this.isMoving) {
            $("#pathMovingMark").css({ left: "33px", background: "#ff0000" });
          } else {
            $("#pathMovingMark").css({ left: "1px", background: "#aaa" });
          }

          $("#pathMovingRepeat")[0].checked = this.isRepeat;
          $("#pathMovingSpeed")[0].value = this.speedMoving;
          $("#soundMoving")[0].nextElementSibling.innerText =
            this.nameSoundMoving != "" ? this.nameSoundMoving : "Empty";

          const zoom = canvas.getZoom();
          let top = this.top * zoom;
          let left = (this.left + (this.width / 2) * this.scaleX) * zoom;
          let groupTop = this.group.top * zoom + canvas.viewportTransform[5] - 60;
          let groupLeft =
            (this.group.left + (this.group.width / 2) * this.group.scaleX) * zoom +
            canvas.viewportTransform[4] -
            180;

          // if (this.lineType == 'waving') {
          //     top = Math.cos(this.angle) * (this.top) * zoom + canvas.viewportTransform[5] - 60;
          //     left = Math.cos(this.angle) * (this.left + (this.width / 2) * this.scaleX) * zoom + canvas.viewportTransform[4] - 180;
          // }

          $("#edit-form").css({
            visibility: "visible",
            top: top + groupTop + "px",
            left: left + groupLeft + "px",
          });
        } else {
          hidePopupMenu();
        }
      }
      function findContent(obj) {
        if (obj._objects) {
          var listObj = obj._objects;
          for (let index = 0; index < listObj.length; index++) {
            const element = listObj[index];
            if (element.type === "image") {
              return element;
            } else {
              var innerElement = findContent(element);
              if (innerElement && innerElement.type == "image") {
                return innerElement;
              }
            }
          }
        }
        return null;
      }

      function selectObjMousedown(obj) {
        console.log("mousedown", { obj });
        if (isCreateQuiz && (isMakingAnswer || isDoQuiz)) {
          obj.select = !obj.select;
          if (obj.select) {
            obj._objects[0]?.set({
              fill: obj.colorSelected,
            });
            obj._objects[1]?.set({
              fill: obj.colorTextSelected,
            });
            obj.playSound("selected");

            var quizType = $("#quiz-type")[0].value;
            console.log("quizType", quizType);

            const answer = {
              id: obj.objectID,
              name: "select-obj-quiz",
              value: obj.text,
            };

            if (isMakingAnswer) {
              correctAnswers.push(answer);
            } else if (isDoQuiz) {
              console.log(userAnswers);
              userAnswers.push(answer);
            }
          } else {
            obj._objects[0]?.set({
              fill: obj.colorUnselected,
            });
            obj._objects[1]?.set({
              fill: obj.colorText,
            });
            obj.playSound("unselected");

            if (isMakingAnswer) {
              correctAnswers = correctAnswers.filter(
                (item) => item.id != obj.objectID
              );
            } else if (isDoQuiz) {
              console.log(userAnswers);
              userAnswers = userAnswers.filter(
                (item) => item.id != obj.objectID
              );
            }
          }

          if (isMakingAnswer) {
            correctAnswerBox.text = correctAnswers
              .map((item) => item.value)
              .join(" ");
          }
          else if (isDoQuiz) {
            userAnswerBox.text = userAnswers.map((item) => item.value).join(" ");
          }

        }
      }

      // handle select obj type
      function selectObjEventHandler(obj) {
        obj.on("mousedown", function () {
          console.log("-mousedown: ", obj);
          selectObjMousedown(obj);
          canvas.requestRenderAll();
          socket.emit("selectObjMousedown", {
            cellID: obj.cellID,
            correctAnswers,
            userAnswers,
          });
        });
      }

      function multipleObjMousedown(obj) {
        console.log("mousedown multi", { obj });
        console.log("isCreateQuiz", isCreateQuiz);
        console.log("isMakingAnswer", isMakingAnswer);
        console.log("isDoQuiz", isDoQuiz);
        if ((isMakingAnswer || isDoQuiz)) {
          obj.select = !obj.select;
          const answer = {
            id: obj.objectId,
            name: "quiz-multipleObj",
            value: obj.result,
          };

          if (obj.select && obj.objectType == 'answer') {
            //fill object color to red
            obj.set({
              fill: "red",
            });
            if (isMakingAnswer) {
              correctAnswers.push(answer);
              console.log("correct answer:", correctAnswers);
              //add answer to result-view-table-body
              var rowData = [obj.objectId, obj.name, obj.objectType, obj.result];
              // Create a new table row
              var tr = document.createElement("tr");
              // Add cells to the row
              for (var i = 0; i < rowData.length; i++) {
                var td = document.createElement("td");
                td.style.border = "1px solid white";
                td.style.padding = "7px";
                td.style.backgroundColor = "black";
                td.style.color = "white";
                td.textContent = rowData[i];
                tr.appendChild(td);
              }
              // Append the row to the table body
              var resultViewTable = $("#result-view-table-body")[0];
              resultViewTable.appendChild(tr);

            } else if (isDoQuiz) {
              userAnswers.push(answer);
              console.log("user answer:", userAnswers);
              //add answer to result-view-table-body
              var rowData = [obj.objectId, obj.name, obj.objectType, obj.result];
              // Create a new table row
              var tr = document.createElement("tr");
              // Add cells to the row
              for (var i = 0; i < rowData.length; i++) {
                var td = document.createElement("td");
                td.style.border = "1px solid white";
                td.style.padding = "7px";
                td.style.backgroundColor = "black";
                td.style.color = "white";
                td.textContent = rowData[i];
                tr.appendChild(td);
              }
              // Append the row to the table body
              var resultViewTable = $("#result-view-table-body")[0];
              resultViewTable.appendChild(tr);
            }
          }
          else {
            //fill object color to blue
            obj.set({
              fill: "blue",
            });
            if (isMakingAnswer) {
              correctAnswers = correctAnswers.filter(
                (item) => item.id != obj.objectId
              );
              var correspondingTableRow = findTableRowInResultTableByObjectId(obj.objectId);
              if (correspondingTableRow) {
                correspondingTableRow.remove();
              }
              console.log("correct answer:", correctAnswers);
            } else if (isDoQuiz) {
              userAnswers = userAnswers.filter(
                (item) => item.id != obj.objectId
              );
              var correspondingTableRow = findTableRowInResultTableByObjectId(obj.objectId);
              if (correspondingTableRow) {
                correspondingTableRow.remove();
              }
              console.log("user answer:", userAnswers);
            }
          }
        }
      }
      // handle select obj type
      function multipleObjEventHandler(obj) {
        obj.on("mousedown", function () {
          multipleObjMousedown(obj);
          //console.log("-mousedown: ", obj);
          canvas.requestRenderAll();
          socket.emit("selectObjMousedown", {
            cellID: obj.cellID,
            correctAnswers,
            userAnswers,
          });
        });
      }

      socket.on("selectObjMousedown", function (data) {
        canvas.forEachObject(o => {
          if (o.name === "quiz") {
            o._objects.forEach(cell => {
              if (cell.cellID === data.cellID) {
                console.log("-mousedown: ", cell);
                selectObjMousedown(cell);
                canvas.requestRenderAll();
              }
            })
          }
        })
      });

      function inputObjEdit(objectID, newVal) {
        if (newVal && newVal != "") {
          const answer = {
            id: objectID,
            name: "input-obj-quiz",
            value: newVal.toUpperCase(),
          };
          if (isMakingAnswer) {
            var indexId = correctAnswers.findIndex(
              (x) => x.id == answer.id
            );
            if (indexId != -1) {
              correctAnswers[indexId].value = newVal;
            } else {
              correctAnswers.push(answer);
            }
          } else if (isDoQuiz) {
            // console.log(userAnswers);
            var indexId = userAnswers.findIndex((x) => x.id == answer.id);
            if (indexId != -1) {
              userAnswers[indexId].value = newVal;
            } else {
              userAnswers.push(answer);
            }
          }
        } else {
          if (isMakingAnswer) {
            correctAnswers = correctAnswers.filter(
              (item) => item.id != objectID
            );
          } else if (isDoQuiz) {
            // console.log(userAnswers);
            userAnswers = userAnswers.filter(
              (item) => item.id != objectID
            );
          }
        }
        // console.log('test', object, obj);
        // comment before, you must call this
        // object.addWithUpdate();


        if (isMakingAnswer) {
          correctAnswerBox.text = correctAnswers
            .map((item) => item.id + " - " + item.value)
            .join(", ");
        } else if (isDoQuiz) {
          // console.log(userAnswerBox);
          userAnswerBox.text = userAnswers
            .map((item) => item.id + " - " + item.value)
            .join(", ");
        }
      }

      // handle input obj type
      function inputObjEventHandler(item) {
        item.set({
          snap: true,
        });

        item.on('mousedblclick', function () {
          activeObject = this;

          const editForm = $('#edit-form')[0];

          if (editForm.style.visibility === 'hidden') {
            $('#soundSelected')[0].nextElementSibling.innerText = this.nameSoundSelected;
            $('#soundUnselected')[0].nextElementSibling.innerText = this.nameSoundUnselected;
            $('#soundTyping')[0].nextElementSibling.innerText = this.nameSoundTyping;
            $('#soundSnap')[0].nextElementSibling.innerText = this.nameSoundSnap;

            $('#objSelect')[0].checked = this.select;
            $('#objInput')[0].checked = this.input;
            $('#objSnap')[0].checked = this.snap;
            $('#objControl')[0].checked = this.hasControls;
            $('#textColor')[0].value = this.colorText;
            $('#borderColor')[0].value = this.colorBorder;
            $('#fillColor')[0].value = this.fill;
            $("#textBoxRadiusText")[0].value = this.radius;
            $('#borderWidth')[0].value = this.widthBorder;
            $('#objCurve')[0].value = this.curve;
            $('#objAngle')[0].value = this.angle;
            $('#objBring')[0].value = this.position;
            $('#objShadow')[0].innerText = this.hasShadow ? 'On' : 'Off';
            $('#objFixed')[0].innerText = this.lockMovementX ? 'On' : 'Off';

            const zoom = canvas.getZoom();
            const top = (this.top) * zoom + canvas.viewportTransform[5] - 60;
            const left = (this.left + (this.width / 2) * this.scaleX) * zoom + canvas.viewportTransform[4] - 180;

            $('#edit-form').css({ 'visibility': 'visible', 'top': top + 'px', 'left': left + 'px' });
          }
          else {
            hidePopupMenu();
          }
        });
        item.on("mouseup", function () {
          const quizType = $("#quiz-type")[0].value;
          console.log(quizType)
          console.log("mouseup");
          console.log(isCreateQuiz, isMakingAnswer, isDoQuiz);
          if (isCreateQuiz && (isMakingAnswer || isDoQuiz)) {
            var object = this;
            objectMiro = null;
            if (object.clicked) {
              // console.log('here 1');

              let obj = object.item(1);
              // console.log(obj.fontSize * object.scaleY);
              let textForEditing = new fabric.Textbox(obj.text, {
                top:
                  object.top +
                  (object.height * object.scaleY) / 2 -
                  (obj.fontSize * object.scaleY) / 2,
                left: object.left,
                fontSize: obj.fontSize * object.scaleY,
                fontFamily: obj.fontFamily,
                width: object.item(0).width * object.scaleX,
                textAlign: "center",
                scaleX: obj.scaleX,
                scaleY: obj.scaleY,
              });

              // console.log(textForEditing);
              // hide group inside text
              obj.visible = false;
              // note important, text cannot be hidden without this
              // object.addWithUpdate();

              textForEditing.visible = true;
              // do not give controls, do not allow move/resize/rotation on this
              textForEditing.hasControls = false;

              // now add this temporary obj to canvas
              canvas.add(textForEditing);
              canvas.setActiveObject(textForEditing);
              // make the cursor showing
              textForEditing.enterEditing();
              textForEditing.selectAll();

              // editing:exited means you click outside of the
              textForEditing.on("text:changed", function () {
                console.log(textForEditing.text);
              });
              textForEditing.on("editing:exited", () => {
                let newVal = textForEditing.text;
                let oldVal = obj.text;
                newVal = newVal[newVal.length - 1].toUpperCase();
                // edit by Hung
                const fullNewVal = textForEditing.text
                if (quizType === "quiz-9") {
                  obj.set({
                    text: fullNewVal,
                    visible: true,
                    textAlign: "center",
                  });
                  inputObjEdit(this.objectID, fullNewVal);
                }
                else {
                  obj.set({
                    text: newVal,
                    visible: true,
                    // width: textForEditing.width,
                    // left: textForEditing.left,

                    // fontSize: textForEditing.fontSize,
                    // fontFamily: textForEditing.fontFamily,
                    textAlign: "center",
                  });
                  inputObjEdit(this.objectID, newVal);
                }
                //

                socket.emit("inputObjEdit", { objectID: this.objectID, value: newVal, userAnswers, correctAnswers });

                // we do not need textForEditing anymore
                textForEditing.visible = false;
                canvas.remove(textForEditing);

                // optional, buf for better user experience
                canvas.setActiveObject(object);
              });


              object.clicked = false;
            } else {
              // console.log('here 2');

              // object.set({
              //     width: object.item(0).width,
              //     height: object.item(0).height,
              // })


              // console.log('obj', object);

              objectMiro = object;
              object.clicked = true;
            }
            canvas.requestRenderAll();
          }
        });
        item.on("moving", function () {
          if (this.snap) {
            objectSnapCanvas(this);
            objectSnapAdjacent(this);
          }

          if ($("#edit-form")[0].style.visibility === "visible") {
            hidePopupMenu();
          }
        });
        changeCoordinateConnectLine(item);
      }

      socket.on("inputObjEdit", function (data) {
        console.log("on inputObjEdit", data);
        canvas.forEachObject(o => {
          if (o.objectID === data.objectID) {
            o.item(1).set({
              text: data.value
            });
          }
        });

        inputObjEdit(data.objectID, data.value);
        canvas.requestRenderAll();
      });

      // handle match obj type
      var correctAnswerMatch = [];

      function matchOjbMoving(obj) {
        const snap = 30;
        if (obj.snap && obj.isDrop != true) {
          const _this = obj;
          // Sets corner position coordinates based on current angle, width and height
          objectSnapCanvas(obj);

          const o1 = {
            x: obj.top + obj.height / 2,
            y: obj.left + obj.width / 2,
          };

          // Loop through objects
          canvas.forEachObject(function (obj) {
            if (obj === _this || (obj.name && obj.name === "port")) return;

            const o2 = {
              x: obj.top + obj.height / 2,
              y: obj.left + obj.width / 2,
            };
            // drag drop quiz handle add - Kiet
            if (Math.sqrt((o1.x - o2.x) ** 2 + (o1.y - o2.y) ** 2) < snap) {
              if (_this.isDrag === true) {
                if (obj.isDrop === true) {
                  // create answer on correct snap
                  if (_this.checked === false) {
                    if (isMakingAnswer) {
                      correctAnswerMatch.push(
                        _this.answerId + "-" + obj.answerId
                      );
                      console.log(correctAnswerMatch);
                    } else if (isDoQuiz) {
                      userResult.push(_this.answerId + "-" + obj.answerId); // write user result
                    }
                    _this.checked = true;
                    _this.linkedId = obj.answerId;
                    _this.top = o2.x - _this.height / 2;
                    _this.left = o2.y - _this.width / 2;

                    _this.playSound("snap");
                  }
                }
              } else if (_this.isDrop === true) {
                // do nothing
              } else {
                _this.top = o2.x - _this.height / 2;
                _this.left = o2.y - _this.width / 2;

                _this.playSound("snap");
              }
            } else {
              if (_this.isDrag === true) {
                if (_this.checked === true) {
                  if (_this.linkedId === obj.answerId) {
                    _this.checked = false;
                    if (isMakingAnswer) {
                      var index = correctAnswerMatch.findIndex(
                        (x) => x === _this.answerId + "-" + _this.linkedId
                      );
                      correctAnswerMatch.splice(index, 1);
                    }
                    if (isDoQuiz) {
                      var index = userResult.findIndex(
                        (x) => x === _this.answerId + "-" + _this.linkedId
                      );
                      userResult.splice(index, 1);
                    }
                    console.log(correctAnswerMatch);
                  }
                }
              }
            }

            if (isMakingAnswer) {
              correctAnswerBox.text = correctAnswerMatch
                .map((item) => item)
                .join(", ");
            } else if (isDoQuiz) {
              userAnswerBox.text = userResult.map((item) => item).join(", ");
            }
          });

          obj.setCoords();
        }

        // console.log("obj moving");

        if ($("#edit-form")[0].style.visibility === "visible") {
          hidePopupMenu();
        }
      }

      function matchObjEventHandler(obj) {
        obj.checked = false;
        obj.checkCorrect = false;
        if (
          obj.isDrop !== true &&
          obj.isDrag !== true &&
          obj.isBackground !== true
        ) {
          obj.pos = "front";
          obj.isBackground = false;
        }
        if (obj.isDrop) {
          repositionDragDrop(obj);
        }
        if (obj.isDrag) {
          obj.snap = true;
        }
        obj.on("mousedblclick", function () {
          activeObject = this;

          const editForm = $("#edit-form")[0];

          if (editForm.style.visibility === "hidden") {
            $("#soundSelected")[0].nextElementSibling.innerText =
              this.nameSoundSelected;
            $("#soundUnselected")[0].nextElementSibling.innerText =
              this.nameSoundUnselected;
            $("#soundTyping")[0].nextElementSibling.innerText =
              this.nameSoundTyping;
            $("#soundSnap")[0].nextElementSibling.innerText = this.nameSoundSnap;

            $("#objSelect")[0].checked = this.select;
            $("#objInput")[0].checked = this.input;
            $("#objSnap")[0].checked = this.snap;
            $("#objControl")[0].checked = this.hasControls;
            $("#textColor")[0].value = this.colorText;
            $("#borderColor")[0].value = this.colorBorder;
            $("#fillColor")[0].value = this.fill;
            $("#textBoxRadiusText")[0].value = this.radius;
            $("#borderWidth")[0].value = this.widthBorder;
            $("#objCurve")[0].value = this.curve;
            $("#objAngle")[0].value = this.angle;
            $("#objBring")[0].value = this.position;
            $("#objShadow")[0].innerText = this.hasShadow ? "On" : "Off";
            $("#objVessel")[0].innerText = this.lockMovementX ? "On" : "Off";
            $("#bgToggle")[0].innerText = this.isBackground === true ? "On" : "Off";

            const zoom = canvas.getZoom();
            let top = this.top * zoom + canvas.viewportTransform[5] - 60;
            let left =
              (this.left + (this.width / 2) * this.scaleX) * zoom +
              canvas.viewportTransform[4] -
              180;

            if (top < 0) top = 20;
            if (left < -50) left = -50;
            if (left > 1010) left = 1010;

            $("#edit-form").css({
              visibility: "visible",
              top: top + "px",
              left: left + "px",
            });
          } else {
            hidePopupMenu();
          }
        });

        obj.on("moving", function () {
          matchOjbMoving(obj);
        });

        changeCoordinateConnectLine(obj);
      }
      // call this function to create attributes and event for textbox
      function startActiveTextbox(obj) {
        obj.on("mouseup", function (e) {
          const editForm = $("#edit-form-textbox")[0];
          // left click
          if (e.button === 1) {
          }
          // if(e.button === 2) {
          //     console.log("middle click");
          // }
          // right click
          if (e.button === 3) {
            if (editForm.style.visibility === "hidden" || activeObject !== this) {
              activeObject = this;
              if (activeObject.name === "latex") {
                $(".latex").addClass("hidden");
              } else {
                $(".latex").removeClass("hidden");
              }
              $("#size-textbox li").removeClass("active");
              $(`#size-textbox li[value=${activeObject.fontSize}]`).addClass(
                "active"
              );
              $("#textColor-textbox")[0].value = activeObject.colorText;
              $("#current-size-textbox span:first-child").text(
                activeObject.fontSize | "Auto"
              );
              const zoom = canvas.getZoom();
              let top = activeObject.top * zoom + canvas.viewportTransform[5] - 60;
              let left =
                (activeObject.left +
                  (activeObject.width / 2) * activeObject.scaleX) *
                zoom +
                canvas.viewportTransform[4] -
                180;

              if (activeObject.lineType == "waving") {
                top =
                  Math.cos(activeObject.angle) * activeObject.top * zoom +
                  canvas.viewportTransform[5] -
                  60;
                left =
                  Math.cos(activeObject.angle) *
                  (activeObject.left +
                    (activeObject.width / 2) * activeObject.scaleX) *
                  zoom +
                  canvas.viewportTransform[4] -
                  180;
              }

              $("#edit-form-textbox").css({
                visibility: "visible",
                top: top + "px",
                left: left + "px",
              });
            } else {
              hidePopupMenu();
            }
          }
        });
      }
      function handleTextboxRightclick(_this) {
        console.log("right click");
        const editForm = $("#edit-form-textbox")[0];
        if (editForm.style.visibility === "hidden" || activeObject !== this) {
          if (this) {
            activeObject = this;
          }
          if (_this) {
            activeObject = _this;
          }
          $("#textColor-textbox")[0].value = activeObject.colorText;
          const zoom = canvas.getZoom();
          let top = activeObject.top * zoom;
          let left =
            (activeObject.left + (activeObject.width / 2) * activeObject.scaleX) *
            zoom;
          let groupTop =
            activeObject.group.top * zoom + canvas.viewportTransform[5] - 60;
          let groupLeft =
            (activeObject.group.left +
              (activeObject.group.width / 2) * activeObject.group.scaleX) *
            zoom +
            canvas.viewportTransform[4] -
            180;

          // if (activeObject.lineType == 'waving') {
          //     top = Math.cos(activeObject.angle) * (activeObject.top) * zoom + canvas.viewportTransform[5] - 60;
          //     left = Math.cos(activeObject.angle) * (activeObject.left + (activeObject.width / 2) * activeObject.scaleX) * zoom + canvas.viewportTransform[4] - 180;
          // }

          $("#edit-form-textbox").css({
            visibility: "visible",
            top: top + groupTop + "px",
            left: left + groupLeft + "px",
          });
        } else {
          hidePopupMenu();
        }
      }

      // obj moving on path animation
      function moveToPoint(object, path, index, pos, reverse) {
        if (object.isMoving && path) {
          if (0 <= index && index < path.length) {
            object.animate(
              "left",
              path[index][pos] - (object.width / 2) * object.scaleX,
              {
                duration: 100 / object.speedMoving,
                onChange: canvas.renderAll.bind(canvas),
              }
            );

            object.animate(
              "top",
              path[index][pos + 1] - (object.height / 2) * object.scaleY,
              {
                duration: 100 / object.speedMoving,
                onChange: canvas.renderAll.bind(canvas),
                onComplete: function () {
                  if (reverse) {
                    if (path[index].length == 5 && pos == 3)
                      moveToPoint(object, path, index, 1, reverse);
                    else if (index > 0 && path[index - 1].length == 5 && pos == 1)
                      moveToPoint(object, path, --index, 3, reverse);
                    else moveToPoint(object, path, --index, 1, reverse);
                  } else {
                    if (path[index].length == 5 && pos == 1)
                      moveToPoint(object, path, index, 3, reverse);
                    else moveToPoint(object, path, ++index, 1, reverse);
                  }
                },
              }
            );
          } else if (object.isRepeat) {
            if (index >= path.length)
              moveToPoint(object, path, path.length - 1, 1, !reverse);
            else moveToPoint(object, path, 0, 1, !reverse);
          } else {
            $("#pathMovingMark").css({ left: "1px", background: "#aaa" });
            activeObject.isMoving = false;
          }
        }
      }

      function startPathAnimation(object) {
        moveToPoint(object, object?.pathObj?.path, 0, 1, false);
      }

      // load sound form input with input, label form html
      function loadSoundInput(target) {
        const file = target.files[0];
        const blob = window.URL || window.webkitURL;
        const label = target.nextElementSibling;
        var fullPath = target.value;
        let name;

        if (fullPath) {
          var startIndex =
            fullPath.indexOf("\\") >= 0
              ? fullPath.lastIndexOf("\\")
              : fullPath.lastIndexOf("/");
          name = fullPath.substring(startIndex);
          if (name.indexOf("\\") === 0 || name.indexOf("/") === 0) {
            name = name.substring(1);
          }
          label.innerHTML = name;
        }

        const src = blob.createObjectURL(file);

        return { name, src };
      }
      // load image from input, get the base64
      function reloadImageSrc(target) {
        const file = target.files[0];
        const blob = window.URL || window.webkitURL;
        const label = target.nextElementSibling;
        var fullPath = target.value;
        let name;

        if (fullPath) {
          var startIndex =
            fullPath.indexOf("\\") >= 0
              ? fullPath.lastIndexOf("\\")
              : fullPath.lastIndexOf("/");
          name = fullPath.substring(startIndex);
          if (name.indexOf("\\") === 0 || name.indexOf("/") === 0) {
            name = name.substring(1);
          }
          label.innerHTML = name;
        }

        const src = blob.createObjectURL(file);

        return { name, src };
      }

      function screenshotCapture(screenshotImg) {
        const context = canvas.getContext("2d");
        const video = document.createElement("video");

        navigator.mediaDevices
          .getDisplayMedia()
          .then((captureStream) => {
            video.srcObject = captureStream;
            context.drawImage(video, 0, 0, window.width, window.height);

            const src = canvas.toDataURL("image/png");

            captureStream.getTracks().forEach((track) => track.stop());
            screenshotImg.src = src;
            screenshotImg.style.height =
              (window.height / window.width) * screenshotImg.width + "px";
            screenshotImg.style.display = "block";

            $(".screenshot-popup-class").css({ left: "230px" });
          })
          .catch((err) => {
            console.error("Screenshot Error: " + err);
          });
      }

      let listOfSymbol = [
        {
          id: 1,
          latex: "\\omega",
          group: "physics",
          type: "symbol",
          svgpath: latexToImg("\\omega"),
        },

        {
          id: 2,
          latex: "\\Omega",
          group: "physics",
          type: "symbol",
          svgpath: latexToImg("\\Omega"),
        },

        {
          id: 3,
          latex: "\\Phi",
          group: "physics",
          type: "symbol",
          svgpath: latexToImg("\\Phi"),
        },

        {
          id: 4,
          latex: "\\Theta",
          group: "physics",
          type: "symbol",
          svgpath: latexToImg("\\Theta"),
        },

        {
          id: 5,
          latex: "\\Lambda",
          group: "physics",
          type: "symbol",
          svgpath: latexToImg("\\Lambda"),
        },

        {
          id: 6,
          latex: "\\Xi",
          group: "physics",
          type: "symbol",
          svgpath: latexToImg("\\Xi"),
        },

        {
          id: 7,
          latex: "\\Pi",
          group: "physics",
          type: "symbol",
          svgpath: latexToImg("\\Pi"),
        },

        {
          id: 8,
          latex: "\\pi",
          group: "physics",
          type: "symbol",
          svgpath: latexToImg("\\pi"),
        },

        {
          id: 9,
          latex: "\\infty",
          group: "math",
          type: "symbol",
          svgpath: latexToImg("\\infty "),
        },

        {
          id: 10,
          latex: "+\\infty",
          group: "math",
          type: "symbol",
          svgpath: latexToImg("+\\infty"),
        },

        {
          id: 11,
          latex: "-\\infty ",
          group: "math",
          type: "symbol",
          svgpath: latexToImg("-\\infty"),
        },

        {
          id: 12,
          latex: "a^b",
          group: "math",
          type: "symbol",
          svgpath: latexToImg("a^b"),
        },

        {
          id: 13,
          latex: "\\frac{a}{b}",
          group: "math",
          type: "symbol",
          svgpath: latexToImg("\\frac{a}{b}"),
        },

        {
          id: 14,
          latex: "\\sum_{i=0}^{n}",
          group: "math",
          type: "symbol",
          svgpath: latexToImg("\\sum_{i=0}^{n}"),
        },

        {
          id: 15,
          latex: "\\sqrt[n]{a}",
          group: "math",
          type: "symbol",
          svgpath: latexToImg("\\sqrt[n]{a}"),
        },

        {
          id: 16,
          latex: "\\int_{a}^{b} x dx",
          group: "math",
          type: "symbol",
          svgpath: latexToImg("\\int_{a}^{b} x dx"),
        },

        {
          id: 17,
          latex: "\\sigma",
          group: "physics",
          type: "symbol",
          svgpath: latexToImg("\\sigma"),
        },

        {
          id: 18,
          latex: "\\vec{a}",
          group: "math",
          type: "symbol",
          svgpath: latexToImg("\\vec{a}"),
        },

        {
          id: 19,
          latex: "\\overline{M}",
          group: "math",
          type: "symbol",
          svgpath: latexToImg("\\overline{M}"),
        },

        {
          id: 20,
          latex: "\\begin{cases} a+b=c \\\\ x+y=z \\end{cases}",
          group: "math",
          type: "symbol",
          svgpath: latexToImg("\\begin{cases} a+b=c \\\\ x+y=z \\end{cases}"),
        },

        {
          id: 21,
          latex: "\\Vert{x}\\Vert",
          group: "math",
          type: "symbol",
          svgpath: latexToImg("\\Vert{x}\\Vert"),
        },

        {
          id: 22,
          latex: "\\vert{x}\\vert",
          group: "math",
          type: "symbol",
          svgpath: latexToImg("\\vert{x}\\vert"),
        },

        {
          id: 23,
          latex: "\\alpha",
          group: "physics",
          type: "symbol",
          svgpath: latexToImg("\\alpha"),
        },

        {
          id: 24,
          latex: "\\le",
          group: "math",
          type: "symbol",
          svgpath: latexToImg("\\le"),
        },

        {
          id: 25,
          latex: "\\ge",
          group: "math",
          type: "symbol",
          svgpath: latexToImg("\\ge"),
        },

        {
          id: 26,
          latex: "\\ll",
          group: "math",
          type: "symbol",
          svgpath: latexToImg("\\ll"),
        },

        {
          id: 27,
          latex: "\\gg",
          group: "math",
          type: "symbol",
          svgpath: latexToImg("\\gg"),
        },

        {
          id: 28,
          latex: "\\sim",
          group: "math",
          type: "symbol",
          svgpath: latexToImg("\\sim"),
        },

        {
          id: 29,
          latex: "\\simeq",
          group: "math",
          type: "symbol",
          svgpath: latexToImg("\\simeq"),
        },

        {
          id: 30,
          latex: "\\approx",
          group: "math",
          type: "symbol",
          svgpath: latexToImg("\\approx"),
        },

        {
          id: 31,
          latex: "\\pm",
          group: "math",
          type: "symbol",
          svgpath: latexToImg("\\pm"),
        },

        {
          id: 32,
          latex: "\\cdot",
          group: "math",
          type: "symbol",
          svgpath: latexToImg("\\cdot"),
        },

        {
          id: 33,
          latex: "\\in",
          group: "math",
          type: "symbol",
          svgpath: latexToImg("\\in"),
        },

        {
          id: 34,
          latex: "\\notin",
          group: "math",
          type: "symbol",
          svgpath: latexToImg("\\notin"),
        },

        {
          id: 35,
          latex: "\\forall",
          group: "math",
          type: "symbol",
          svgpath: latexToImg("\\forall"),
        },

        {
          id: 36,
          latex: "\\exists",
          group: "math",
          type: "symbol",
          svgpath: latexToImg("\\exists"),
        },

        {
          id: 37,
          latex: "\\nexists",
          group: "math",
          type: "symbol",
          svgpath: latexToImg("\\nexists"),
        },

        {
          id: 38,
          latex: "\\varnothing",
          group: "math",
          type: "symbol",
          svgpath: latexToImg("\\varnothing"),
        },

        {
          id: 39,
          latex: "\\perp",
          group: "math",
          type: "symbol",
          svgpath: latexToImg("\\perp"),
        },
        {
          id: 40,
          latex: "\\ce{O - H}",
          group: "chemistry",
          type: "symbol",
          svgpath: latexToImg("{O-H}"),
        },

        {
          id: 41,
          latex: "\\ce{O = H}",
          group: "chemistry",
          type: "symbol",
          svgpath: latexToImg("{O = H}"),
        },

        {
          id: 42,
          latex: "\\ce{O # H}",
          group: "chemistry",
          type: "symbol",
          svgpath: latexToImg("{O = H}"),
        },

        {
          id: 43,
          latex: "\\ce{CO3^{2-}}",
          group: "chemistry",
          type: "symbol",
          svgpath: latexToImg("{CO3^{2-}}"),
        },

        {
          id: 43,
          latex: "\\ce{H^{+}}",
          group: "chemistry",
          type: "symbol",
          svgpath: latexToImg("{H^{+}}"),
        },

        {
          id: 44,
          latex: "\\ce{ ^{227}_{90}Th+ }",
          group: "chemistry",
          type: "symbol",
          svgpath: latexToImg("{ ^{227}_{90}Th+ }"),
        },

        {
          id: 45,
          latex: "\\ce{BaSO4 v}",
          group: "chemistry",
          type: "symbol",
          svgpath: latexToImg("{BaSO4 v}"),
        },

        {
          id: 46,
          latex: "\\ce{NO3 ^}",
          group: "chemistry",
          type: "symbol",
          svgpath: latexToImg("{NO3}"),
        },

        {
          id: 47,
          latex: "\\ce{<=>}",
          group: "chemistry",
          type: "symbol",
          svgpath: latexToImg("{<=>}"),
        },

        {
          id: 48,
          latex: "\\ce{->[{above}][{below}]}",
          group: "chemistry",
          type: "symbol",
          svgpath: latexToImg("{->}"),
        },
      ];

      let math = document.getElementById("math-symbol");
      let physics = document.getElementById("physisc-symbol");
      let chemistry = document.getElementById("chemistry-symbol");
      let biology = document.getElementById("biology-symbol");

      for (let i = 0; i < listOfSymbol.length; i++) {
        let p = document.createElement("p");

        p.className = "tooltip-wrap";
        let img = document.createElement("img");
        img.src = listOfSymbol[i].svgpath;
        p.appendChild(img);
        p.onclick = function (e) {
          createLatex(listOfSymbol[i].latex);
        };
        if (listOfSymbol[i].group == "math") {
          math.appendChild(p);
        } else if (listOfSymbol[i].group == "physics") {
          physics.appendChild(p);
        } else if (listOfSymbol[i].group == "chemistry") {
          chemistry.appendChild(p);
        }
      }

      // Icon svg
      let iconSVG = document.getElementById("iconSVG");
      let listIconImg = [
        "coffee_brand_design_elements_beans_cup_machine_icons_6835690.jpg",
        "construction_design_elements_machines_signboard_sketch_flat_classic_6852449.jpg",
        "construction_work_design_elements_heavy_machines_sketch_6852448.jpg",
        "farm_design_elements_machine_windmill_sty_warehouse_icons_6839790.jpg",
        "future_life_painting_children_modern_machine_cartoon_design_6840694.jpg",
        "heavy_construction_machines_icons_isolated_with_yellow_color_6825965.jpg",
        "sewing_work_design_elements_colored_machine_tools_icons_6839755.jpg",
        "slot_machine_icons_310830.jpg",
        "tailor_design_elements_sewing_machine_ruler_mannequin_icons_6839643.jpg",
        "vintage_painting_flora_bird_sewing_machine_sketch_6843416.jpg",
        "forest.png",
        "cloud.png",
        "babane.png",
        "bg.png",
        "carrot.png",
        "chestnus.png",
        "empty.png",
        "Fish.png",
        "item1.png",
        "item2.png",
        "item3.png",
        "item4.png",
        "item5.png",
        "item6.png",
        "item7.png",
        "item8.jpg",
        "ban-ve.png",
        "3069d8b5a4933c84b89ef1253ad7589a.png",
        "battle.png",
        "blower.png",
        "chemistry.png",
        "chemistry2.png",
        "chemistry3.png",
        "conduit.png",
        "extraction-flask.png",
        "extraction-tube.png",
        "ledaihanh.png",
        "Ly-Thuong-Kiet.png",
        "map.png",
        "pham-ngu-lao.png",
        "PhungHung.png",
        "pick-up-test-tube.png",
        "shake-test-tube.png",
        "sodier.png",
        "sodier2.png",
        "sodier3.png",
        "sodier4.png",
        "sodier5.png",
        "sodier6.png",
        "tranhungdao.png",
        "tranquoc toan.png",
        "tube1.png",
        "tube2.png",
        "tube3.png",
        "tube4.png",
        "tube5.png",
        "tube6.png",
        "tube7.png",
        "tube8.png",
        "tube9.png",
        "tube10.png",
        "tube11.png",
        "tube12.png",
        "tube13.png",
        "tube14.png",
        "tube15.png",
        "tubes.png",
        "tubes2.png",
        "tubes3.png",
        "tubes4.png",
        "warrior1.png",
        "warrior2.png",
        "warrior3.png",
        "warrior4.png",
        "warrior5.png",
        "warrior6.png",
        "warrior7.png",
        "warrior8.png",
        "warrior9.png",
        "warrior10.png",
        "warrior11.png",
        "warrior12.png",
        "warrior13.png",
        "warrior14.png",
        "warrior15.png",
        "warrior16.png",
        "warrior17.png",
        "class-1.png",
        "class-2.png",
        "class-3.png",
        "class-4.png",
        "jungle-1.png",
        "jungle-2.png",
        "jungle-3.png",
      ];

      let listIconSVG = [
        "bird.svg",
        "cloud-computing-svgrepo-com.svg",
        "leaves.svg",
        "leaves2.svg",
        "Peileppe-3-flowers.svg",
        "tree-svgrepo-com.svg",
        "twitter-bird-evandro.svg",
      ];

      function initIcon() {
        for (let i = 0; i < listIconSVG.length; i++) {
          let p = document.createElement("p");

          p.className = "tooltip-wrap";
          let img = document.createElement("img");
          // img.src = `/assets/images/notepad/svg/${listIconImg[ i ]}`;

          img.src = `assets/images/notepad/svg/${listIconSVG[i]}`;
          p.appendChild(img);
          p.onclick = function (e) {
            createSVG(img.src);
          };
          iconSVG.appendChild(p);
        }
        for (let i = 0; i < listIconImg.length; i++) {
          let p = document.createElement("p");

          p.className = "tooltip-wrap";
          let img = document.createElement("img");
          // img.src = `/assets/images/notepad/svg/${listIconImg[ i ]}`;

          img.src = `assets/images/notepad/svg/${listIconImg[i]}`;
          p.appendChild(img);
          p.onclick = function (e) {
            createIcon(img);
          };
          iconSVG.appendChild(p);
        }
      }
      initIcon();

      function createSVG(svg) {
        fabric.loadSVGFromURL(svg, function (objects, options) {
          const svg = fabric.util.groupSVGElements(objects, options);
          const maxWidth = 100;
          const maxHeight = 80;

          // resize svg if size is too large
          if (svg.width > maxWidth) {
            svg.scaleToWidth(maxWidth);
          }
          if (svg.height > maxHeight) {
            svg.scaleToHeight(maxHeight);
          }

          svg.set({
            top: 100,
            left: 100,
            name: "svg",
            fontSize: 14,
            fontFamily: "Time New Roman",
            textAlign: "center",
            fontWeight: "normal",
            fontStyle: "normal",
            underline: false,
          });

          setDefaultAttributes(svg);
          startActiveObject(svg);
          canvas.add(svg);
          isLoadDataLocal = false;
          emitEvent();
        });
      }

      function createIcon(url) {
        let icon = new fabric.Image(url, {
          top: 100,
          left: 100,
          name: "svg",
        });

        const maxWidth = 100;
        const maxHeight = 80;

        // resize svg if size is too large
        if (icon.width > maxWidth) {
          icon.scaleToWidth(maxWidth);
        }
        if (icon.height > maxHeight) {
          icon.scaleToHeight(maxHeight);
        }

        setDefaultAttributes(icon);
        startActiveObject(icon);

        canvas.add(icon);
        isLoadDataLocal = false;
        emitEvent();
      }

      $("#svg-search").on("keyup", function () {
        var val = $.trim(this.value);
        if (val !== null && val !== undefined && val !== "") {
          $("#iconSVG").html("");
          val = val.toLowerCase();
          $.each(listIconSVG, function (_, obj) {
            // console.log(val,obj.name.toLowerCase().indexOf(val),obj)
            if (obj.toLowerCase().indexOf(val) != -1) {
              let p = document.createElement("p");

              p.className = "tooltip-wrap";
              let img = document.createElement("img");
              img.src = `assets/images/notepad/svg/${obj}`;
              p.appendChild(img);
              p.onclick = function (e) {
                createSVG(img.src);
              };
              iconSVG.appendChild(p);
            }
          });
          $.each(listIconImg, function (_, obj) {
            // console.log(val,obj.name.toLowerCase().indexOf(val),obj)
            if (obj.toLowerCase().indexOf(val) != -1) {
              let p = document.createElement("p");

              p.className = "tooltip-wrap";
              let img = document.createElement("img");
              img.src = `assets/images/notepad/svg/${obj}`;
              p.appendChild(img);
              p.onclick = function (e) {
                createIcon(img.src);
              };
              iconSVG.appendChild(p);
            }
          });
        } else {
          initIcon();
        }
        $("#not-found").toggle($("#iconSVG").find("img").length == 0);
      });
      // create a img object
      function imageMode(e) {
        fabric.Image.fromURL(e.target.result, function (img) {
          //i create an extra var for to change some image properties
          const maxWidth = 600;
          const maxHeight = 400;

          if (img.width > maxWidth) {
            img.scaleToWidth(maxWidth);
          }

          if (img.height > maxHeight) {
            img.scaleToHeight(maxHeight);
          }

          // console.log(e.target.result.name);

          img.set({
            top: 100,
            left: 100,
            name: "image",
            nameImageContent: "",
            objectID: randomID(),
          });

          setDefaultAttributes(img);
          startActiveObject(img);

          canvas.add(img);

          isLoadDataLocal = false;
          emitEvent();

          // var grid = canvas._objects.find(obj => obj.name === 'grid')
          // if (grid) {
          //     img.moveTo(1)
          // }
          // else img.moveTo(0)

          canvas.requestRenderAll();
        });
      }

      function imageModeSpecial(e) {
        fabric.Image.fromURL(e.target.result, function (img) {
          //i create an extra var for to change some image properties
          const maxWidth = 600;
          const maxHeight = 400;

          if (img.width > maxWidth) {
            img.scaleToWidth(maxWidth);
          }

          if (img.height > maxHeight) {
            img.scaleToHeight(maxHeight);
          }

          img.set({
            top: 0,
            left: 0,
            name: "image",
            objectID: randomID(),
          });

          // setDefaultAttributes(img);
          // startActiveObject(img);

          // canvas.add(img);
          // canvas.sendToBack(img);

          // let layer_num = $('#layers-body .active').attr('data-cnt');
          // isLoadDataLocal = false;
          // emitEvent(layer_num);

          var txtTop = new fabric.Text("Top", {
            fontSize: 12,
            fontFamily: "Time New Roman",
            originX: "center",
            originY: "top",
            left: img.width / 2,
            top: img.height - 50,
            fill: "black",
            textAlign: "center",
            objectCaching: false,
          });
          //canvas.add(txt6);
          var group = new fabric.Group([img, txtTop], {
            top: 0,
            left: 0,
            //name: imgs.name,
            subTargetCheck: false,
          });
          setDefaultAttributes(group);
          startActiveObject(group);
          canvas.add(group);
          canvas.renderAll();
        });
      }

      function imageQuizMatchMode(url, value, isDrag, id = randomID()) {
        fabric.Image.fromURL(url, function (img) {
          //i create an extra var for to change some image properties
          const maxWidth = 600;
          const maxHeight = 400;

          if (img.width > maxWidth) {
            img.scaleToWidth(maxWidth);
          }

          if (img.height > maxHeight) {
            img.scaleToHeight(maxHeight);
          }

          img.set({
            top: canvas.height / 2 - img.height / 2,
            left: canvas.width / 2 - img.width / 2,
          });
          img.name = "quiz-matchObj";
          img.isDrag = true;
          img.answerId = value;
          img.objectID = id;

          setDefaultAttributes(img);
          startActiveObject(img);

          canvas.add(img);

          // isLoadDataLocal = false;
          // emitEvent(img);

          canvas.sendToBack(img);
          canvas.requestRenderAll();
        });
        return id;
      }

      function createTextBoxFooter(obj, size) {
        var textbox = new fabric.Textbox("Text", {
          fontSize: 12,
          fontFamily: "Time New Roman",
          originX: "center",
          originY: "top",
          left: size / 2,
          top: size + 10,
          fill: "#333",
          textAlign: "center",
        });

        let group = new fabric.Group([obj, textbox], {
          top: 100,
          left: 100,
          name: obj.type,
          subTargetCheck: false,
        });

        setDefaultAttributes(group);
        // startActiveObject(group);

        return group;
      }

      function createTextBox(obj) {
        var textbox = new fabric.Textbox("Text", {
          fontSize: 14,
          fontFamily: "Time New Roman",
          originX: "center",
          originY: "center",
          left: obj.left,
          top: obj.top,
          width: obj.width,
          fill: "#333",
          textAlign: "center",
        });

        let group = new fabric.Group([obj, textbox], {
          top: 100,
          left: 100,
          name: obj.type,
          subTargetCheck: false,
          fontSize: 14,
          fontFamily: "Time New Roman",
          textAlign: "center",
          fontWeight: "normal",
          fontStyle: "normal",
          underline: false,
        });

        var shadow = new fabric.Shadow({
          color: "blue",
          blur: 20,
        });
        var oldColor = textbox.fill;
        var oldColorGroup = group.item(0).fill;
        //hover vào textbox thì textbox color đổi màu
        // group.on("mouseout", function () {
        //   group.item(0).set({
        //     fill: oldColorGroup,
        //     shadow: null,
        //   });
        //   group.item(1).set({
        //     fill: oldColor,
        //     shadow: null,
        //   });
        //   canvas.renderAll();
        // });
        setDefaultAttributes(group);
        startActiveObject(group);
        return group;
      }

      function createTextBoxLock(obj) {
        var textbox = new fabric.Textbox("Text", {
          fontSize: 14,
          fontFamily: "Time New Roman",
          originX: "center",
          originY: "center",
          left: obj.left,
          top: obj.top,
          width: obj.width,
          fill: "#333",
          textAlign: "center",
          editable: false,
          hasControls: false, // Disable individual controls on the textbox
        });
      
        // Apply the shadow to the textbox
        textbox.set({
          shadow: new fabric.Shadow({
            color: "blue",
            blur: 20,
          }),
        });
      
        let group = new fabric.Group([obj, textbox], {
          top: 100,
          left: 100,
          name: obj.type,
          fontSize: 14,
          fontFamily: "Time New Roman",
          textAlign: "center",
          fontWeight: "normal",
          fontStyle: "normal",
          underline: false,
          selectable: false,
        });
      
        // Remove the unnecessary shadow variable
        var oldColor = textbox.fill;
        var oldColorGroup = group.item(0).fill;
        setDefaultAttributes(group);
        startActiveObject(group);
        return group;
      }
        


      //Fabric cho đối tượng hình học (Geometric)
      function iconCricle(e) {
        //Vẽ hình tròn
        var circle = new fabric.Circle({
          radius: 50,
          stroke: "#000",
          strokeWidth: 1,
          fill: "#fff",
          originX: "center",
          originY: "center",
        });

        getTextForObject(createTextBox(circle));
      }

      // Vẽ hình tam giác
      function iconTriange(e) {
        var triangle = new fabric.Triangle({
          width: 100,
          height: 100,
          stroke: "#000",
          strokeWidth: 1,
          fill: "#fff",
          originX: "center",
          originY: "center",
        });
        getTextForObject(createTextBox(triangle));
      }

      //Vẽ hình elip
      function iconElipse(e) {
        var elipse = new fabric.Ellipse({
          rx: 80,
          ry: 40,
          stroke: "#000",
          strokeWidth: 1,
          fill: "#fff",
          originX: "center",
          originY: "center",
        });

        getTextForObject(createTextBox(elipse));
      }

      // Vẽ hình chữ nhật
      function iconRect(e) {
        var rect = new fabric.Rect({
          width: 100,
          height: 100,
          stroke: "#000",
          strokeWidth: 1,
          fill: "#fff",
          originX: "center",
          originY: "center",
          rx: 0,
          ry: 0,
        });

        rect.on("scaling", function () {
          console.log("scaling");
          this.set({
            width: this.width * this.scaleX,
            height: this.height * this.scaleY,
            scaleX: 1,
            scaleY: 1,
          });
        });

        getTextForObject(createTextBox(rect));
      }

      // Vẽ hình chữ nhật
      function iconRoundedRect(e) {
        var roundedRect = new fabric.Rect({
          width: 100,
          height: 100,
          stroke: "#000",
          strokeWidth: 1,
          fill: "#fff",
          originX: "center",
          originY: "center",
          rx: 10,
          ry: 10,
        });

        roundedRect.on("scaling", function () {
          this.set({
            width: this.width * this.scaleX,
            height: this.height * this.scaleY,
            scaleX: 1,
            scaleY: 1,
          });
        });

        getTextForObject(createTextBox(roundedRect));
      }

      //Vẽ hình học
      function icongeometric(e) {
        // var rect = new fabric.Path( 'M 0 0 L 200 100 L 170 200 z');
        // //“M” vẫn là viết tắt của lệnh “di chuyển”
        // //“L” là viết tắt của “line”
        // //“z” yêu cầu bút vẽ đóng đường
        // canvas.add(rect.set({width: 100, height: 150, fill: 'blue', left: 500, top: 200 }));

        var rect = new Fabric.Path(
          "M 121.32,0 L 44.58,0 C 36,67,0,29.5,3.22,24.31,8.41 z",
          {
            originX: "center",
            originY: "center",
          }
        );

        getTextForObject(createTextBox(rect));
      }

      // Vẽ hình lục giác
      function iconPolygon(e) {
        var poly = new fabric.Polygon(
          [
            { x: 850, y: 75 },
            { x: 958, y: 137.5 },
            { x: 958, y: 262.5 },
            { x: 850, y: 325 },
            { x: 742, y: 262.5 },
            { x: 742, y: 137.5 },
          ],
          {
            top: 0,
            left: 0,
            stroke: getColor(),
            strokeWidth: 1,
            fill: "#fff",
            scaleX: 0.5,
            scaleY: 0.5,
            left: -55,
            top: -60,
            originX: "center",
            originY: "center",
          }
        );

        getTextForObject(createTextBox(poly));
      }
      //Right Arrow
      function iconArrowRightArrow(e) {
        var poly = new fabric.Polyline(
          [
            { x: 20, y: 20 },
            { x: 60, y: 20 },
            { x: 60, y: 10 },
            { x: 80, y: 30 },
            { x: 60, y: 50 },
            { x: 60, y: 40 },
            { x: 20, y: 40 },
            { x: 20, y: 20 },
          ],
          {
            width: 300,
            height: 200,
            stroke: getColor(),
            strokeWidth: 1,
            fill: "#fff",
            scaleX: 2,
            scaleY: 2,
            top: -40,
            left: -50,
            originX: "center",
            originY: "center",
          }
        );
        getTextForObject(createTextBox(poly));
      }

      // Left arrow
      function iconTurnLeftArrow(e) {
        var poly = new fabric.Polyline(
          [
            { x: 60, y: 30 },
            { x: 20, y: 30 },
            { x: 20, y: 20 },
            { x: 0, y: 40 },
            { x: 20, y: 60 },
            { x: 20, y: 50 },
            { x: 60, y: 50 },
            { x: 60, y: 30 },
          ],
          {
            // width: 150,
            // height: 200,
            stroke: getColor(),
            strokeWidth: 1,
            fill: "#fff",
            scaleX: 2,
            scaleY: 2,
            top: -40,
            left: -60,
            originX: "center",
            originY: "center",
          }
        );

        getTextForObject(createTextBox(poly));
      }

      // Right left arrow
      function iconTwoWayArrow(e) {
        var poly = new fabric.Polyline(
          [
            { x: 20, y: 20 },
            { x: 60, y: 20 },
            { x: 60, y: 10 },
            { x: 80, y: 30 },
            { x: 60, y: 50 },
            { x: 60, y: 40 },
            { x: 20, y: 40 },
            { x: 20, y: 50 },
            { x: 0, y: 30 },
            { x: 20, y: 10 },
            { x: 20, y: 20 },
          ],
          {
            stroke: getColor(),
            strokeWidth: 1,
            fill: "#fff",
            scaleX: 2,
            scaleY: 2,
            top: -40,
            left: -80,
            originX: "center",
            originY: "center",
          }
        );
        getTextForObject(createTextBox(poly));
      }

      // Hình ngôi sao
      function iconStar(e) {
        var poly = new fabric.Path(
          "M 251 30.5725 C 239.505 33.871 233.143 56.2086 228.247 66 L 192.247 139 C 187.613 148.267 183.524 162.173 176.363 169.682 C 170.726 175.592 151.9 174.914 144 176 L 57 188.729 C 46.5089 190.241 22.8477 189.409 18.0093 201.015 C 12.21 214.927 32.8242 228.824 41 237 L 95 289.83 C 104.569 298.489 120.214 309.405 126.11 321 C 130.001 328.651 123.466 345.797 122.081 354 L 107 442 C 105.042 452.114 99.142 469.478 105.228 478.895 C 109.142 484.95 116.903 484.628 123 482.64 C 137.319 477.973 151.822 468.444 165 461.139 L 232 425.756 C 238.285 422.561 249.81 413.279 257 415.071 C 268.469 417.93 280.613 427.074 291 432.691 L 359 468.258 C 369.618 473.739 386.314 487.437 398.985 483.347 C 413.495 478.664 405.025 453.214 403.25 443 L 388.75 358 C 387.045 348.184 380.847 332.006 383.194 322.285 C 385.381 313.225 403.044 300.467 410 294.424 L 469 237 C 477.267 228.733 493.411 218.004 492.941 205 C 492.398 189.944 465.753 190.478 455 189 L 369 176.421 C 359.569 175.025 343.388 175.914 335.213 170.976 C 328.335 166.822 323.703 151.166 320.576 144 L 289.753 82 L 268.532 39 C 264.58 32.6459 258.751 28.3485 251 30.5725 z",

          {
            stroke: getColor(),
            strokeWidth: 3,
            fill: "#fff",
            scaleX: 0.2,
            scaleY: 0.2,
            top: -50,
            left: -50,
            originX: "center",
            originY: "center",
          }
        );
        getTextForObject(createTextBox(poly));
      }

      // Vẽ hình tứ giác
      function iconPolygen(e) {
        var poly = new fabric.Polygon(
          [
            { x: 20, y: 10 },
            { x: 70, y: 10 },
            { x: 60, y: 50 },
            { x: 10, y: 50 },
            { x: 20, y: 10 },
          ],
          {
            scaleX: 2,
            scaleY: 2,
            stroke: getColor(),
            strokeWidth: 1,
            fill: "#fff",
            top: -40,
            left: -60,
            originX: "center",
            originY: "center",
          }
        );
        getTextForObject(createTextBox(poly));
      }

      //vẽ hướng
      function iconArrowTo(e) {
        var arrow = new fabric.Polygon(
          [
            { x: 10, y: 20 },
            { x: 20, y: 40 },
            { x: 10, y: 60 },
            { x: 40, y: 60 },

            { x: 50, y: 40 },
            { x: 40, y: 20 },
            { x: 10, y: 20 },
          ],
          {
            stroke: getColor(),
            strokeWidth: 1,
            fill: "#fff",
            scaleX: 1.5,
            scaleY: 1.5,
            left: -30,
            top: -30,
            originX: "center",
            originY: "center",
          }
        );
        getTextForObject(createTextBox(arrow));
      }

      function iconTrapezoid(e) {
        var traperzoid = new fabric.Polygon(
          [
            { x: -100, y: -50 },
            { x: 100, y: -50 },
            { x: 150, y: 50 },
            { x: -150, y: 50 },
          ],
          {
            stroke: getColor(),
            strokeWidth: 1,
            fill: "#fff",
            scaleX: 0.5,
            scaleY: 0.5,
            top: -25,
            left: -75,
            originX: "center",
            originY: "center",
          }
        );
        getTextForObject(createTextBox(traperzoid));
      }

      function iconHeart(e) {
        var arrow = new fabric.Path(
          "M10,6 Q10,0 15,0 T20,6 Q20,10 15,14 T10,20 Q10,18 5,14 T0,6 Q0,0 5,0 T10,6 Z",
          {
            stroke: getColor(),
            strokeWidth: 0.2,
            fill: "#fff",
            scaleX: 4.5,
            scaleY: 4.5,
            top: -45,
            left: -45,
            originX: "center",
            originY: "center",
          }
        );
        getTextForObject(createTextBox(arrow));
      }

      var name = $("#display_name ").attr("value");

      //var name = Math.round($.now() * Math.random());
      function emitEvent(isWorkSheetMore = true) {
        if (!isLoadDataLocal) {
          let json = canvas.getObjects();
          const obj = canvas.item(json.length - 1);

          if (obj?.name === "line-style") {
            obj.set({
              selectable: true,
              hasBorders: true,
              hasRotatingPoint: true,
              hasBorders: true,
              transparentCorners: false,
            });
            obj.setControlsVisibility({
              tl: true,
              tr: true,
              bl: true,
              br: true,
              mtr: true,
              mb: true,
              mt: true,
              ml: true,
              mr: true,
            });
          }
          obj?.clone((lastObject) => {
            // lastObject.stroke = getColor();
            // lastObject.strokeWidth = getPencil();
            lastObject.objectID = randomID();
            let data = {
              w: w,
              h: h,
              drawing: drawing,
              color: getColor(),
              id: id,
              userID: userID,
              objectID: lastObject.objectID,
              username: username,
              spessremo: getPencil(),
              room: stanza,
              layer: canvas.id,
              data: lastObject.toObject(customAttributes),
            };
            if (worksheetType && isWorkSheetMore) data.isWorkSheet = true;
            pool_data.push(data);
            addNewObject(lastObject);
            // socket.emit('joinRoom',{room:$("#room")[0].value,userID:$("#username")[0].value})
            // socket.emit('drawing', data);
            socket.emit("drawing", data);
            canvas.item(json.length - 1).set({
              objectID: lastObject.objectID,
              userID: userID,
            });
          }, customAttributes);
          canvas.requestRenderAll();
        }
      }
      //vuong
      socket.on("drawing", function (obj) {
        console.log("on drawing", obj);
        if (obj.data) {
          pool_data.push(obj);
          loadLayerCanvasJsonNew([obj], canvas);
          console.log(`  ~ loadLayerCanvasJsonNew`, 9);
          // isLoadedFromJson = true;
          // var jsonObj = obj.data;
          // fabric.util.enlivenObjects([jsonObj], function (enlivenedObjects) {
          //     enlivenedObjects[0].set({
          //         objectID: obj.objectID,
          //         userID: obj.userID
          //     })
          //     canvas.add(enlivenedObjects[0]);
          //     addNewObject(enlivenedObjects[0]);
          // });
        }
      });

      fabric.Textbox.prototype.onKeyDown = (function (onKeyDown) {
        return function (e) {
          if (e.keyCode == 16) {
            shift = true;
            return;
          } else if (e.keyCode === 17) {
            // remove ctrl key check for ctrl + c/v
            ctrlDown = false;
          } else if (e.keyCode == 13 && !shift) canvas.discardActiveObject();
          onKeyDown.call(this, e);
        };
      })(fabric.Textbox.prototype.onKeyDown);

      fabric.Textbox.prototype.onKeyUp = (function (onKeyUp) {
        return function (e) {
          if (e.keyCode == 16) {
            shift = false;
            return;
          }
          onKeyUp.call(this, e);
        };
      })(fabric.Textbox.prototype.onKeyUp);

      canvas.on({
        "selection:created": onObjectSelected,
        "selection:cleared": onSelectionCleared,
      });

      function onObjectSelected(e) {
        var activeObject = e.target;

        if (activeObject) {
          if (activeObject.name == "p0" || activeObject.name == "p2") {
            activeObject.line2.animate("opacity", "1", {
              duration: 200,
              onChange: canvas.renderAll.bind(canvas),
            });
            activeObject.line2.selectable = true;
          }
        }
      }

      function onSelectionCleared(e) {
        var activeObject = e.target;
        if (activeObject) {
          if (activeObject.name == "p0" || activeObject.name == "p2") {
            activeObject.line2.animate("opacity", "0", {
              duration: 200,
              onChange: canvas.renderAll.bind(canvas),
            });
            activeObject.line2.selectable = false;
          } else if (activeObject.name == "curve-point") {
            activeObject.animate("opacity", "0", {
              duration: 200,
              onChange: canvas.renderAll.bind(canvas),
            });
            activeObject.selectable = false;
          }
        }
      }

      canvas.on("text:changed", function (opt) {
        var t1 = opt.target;
        if (t1.isText) {
          if (t1.text.match(/[\r\n]/)) return;
        }
        if (t1.isText) {
          while (t1._textLines.length > 1) {
            t1.set({
              width: t1.getScaledWidth() + 1,
            });
          }
        }
      });

      //Canvas event with mouse
      function changeCoordinateConnectLine(obj) {
        function updateCoords() {
          let connectors = canvas
            .getObjects()
            .filter(
              (value) =>
                value.name == "lineConnect" &&
                (value.idObject1 === obj.objectID ||
                  value.idObject2 === obj.objectID)
            );

          if (connectors) {
            for (let i = 0; i < connectors.length; i++) {
              if (connectors[i].idObject1 === obj.objectID) {
                obj.__corner = connectors[i].port1;
                let targetPort = findTargetPort(obj);
                connectors[i].path[0][1] = targetPort.x1;
                connectors[i].path[0][2] = targetPort.y1;
                movelinename(
                  canvas,
                  obj.objectID,
                  targetPort.y1,
                  targetPort.x1,
                  connectors[i].port1
                );
              } else {
                obj.__corner = connectors[i].port2;
                let portCenterPoint = findTargetPort(obj);
                connectors[i].path[1][3] = portCenterPoint.x2;
                connectors[i].path[1][4] = portCenterPoint.y2;
                movelinename(
                  canvas,
                  obj.objectID,
                  portCenterPoint.y2,
                  portCenterPoint.x2,
                  connectors[i].port2
                );
              }
            }
          }
        }
        obj.on("moving", updateCoords);
        obj.on("scaling", updateCoords);
      }

      let isMouseDown = false;
      let connectorLineFromPort = null;
      let connectorLine = null;
      let corner = null;
      let objectMiro = null;

      function handleTextEdit(object, textObj) {
        console.log("edit text");
        $("#edit-form-textbox").css({ visibility: "hidden" });

        let textForEditing = new fabric.Textbox(textObj.text, {
          originX: "center",
          originY: "center",

          textAlign: textObj.textAlign,
          fontSize: textObj.fontSize,
          width: object.width,
          fontFamily: textObj.fontFamily,

          left: textObj.left + object.left + object.width / 2,
          top: textObj.top + object.top + object.height / 2,
          scaleX: textObj.scaleX,
          scaleY: textObj.scaleY,
          name: "textBoxEditor",
        });

        if (object.name === "latex") {
          textForEditing.set({
            fontSize: object.fontSize,
          });
        }

        // hide group inside text
        object.visible = false;
        // note important, text cannot be hidden without this
        object.addWithUpdate();
        textForEditing.set({
          visible: true,
          hasBorders: true,
          hasControls: false,
        });

        // now add this temporary obj to canvas
        canvas.add(textForEditing);
        canvas.setActiveObject(textForEditing);
        // make the cursor showing
        textForEditing.enterEditing();
        textForEditing.selectAll();

        // editing:exited means you click outside of the textForEditing
        textForEditing.on("editing:exited", () => {
          let newVal = textForEditing.text;
          let oldVal = textObj.text;

          canvas.remove(textForEditing);
          if (newVal != oldVal) {
            if (object.name === "latex") {
              var options = {
                fontSize: object.fontSize,
                top: object.top,
                left: object.left,
              };
              createLatex(newVal, options);
              deleteObjects([object]);
            } else {
              textObj.set({
                text: newVal,
                // width: textForEditing.width,
                // fontSize: textForEditing.fontSize,
                // fontFamily: textForEditing.fontFamily
              });

              object.set({
                visible: true,
              });
              // comment before, you must call this
              object.addWithUpdate();

              // we do not need textForEditing anymore
              // updateLocal(pool_data, object.objectID, object.toObject(customAttributes), socket);
              // optional, buf for better user experience
              // canvas.setActiveObject(object);
            }
          } else {
            object.set({
              visible: true,
            });
            object.addWithUpdate();
            // canvas.setActiveObject(object);
          }
        });
      }

      function mouseUp(e) {
        let object = e.target;
        objectMiro = null;
        if (
          !isChoosePort &&
          object.type === "group" &&
          object.name !== "quiz" &&
          object.name !== "media"
        ) {
          if (e.button === 3) {
            object.clicked = false;
          }
          if (object.clicked) {
            object._objects.forEach((obj) => {
              if (obj.type == "textbox") {
                handleTextEdit(object, obj);
              }
            });
            object.clicked = false;
          } else object.clicked = true;
        }
      }

      $("#quiz").on("click", function () {
        if (!$(this).hasClass("active")) {
          quizMode = true;

          if (!isCreateQuiz) {
            $("#quiz-create").css({ opacity: "1", "pointer-events": "auto" });
            $("#quizs-body li:nth-child(n+4):nth-child(-n+10)").css({
              opacity: "0.5",
              "pointer-events": "none",
            });
          }
          // play variables
          // isCreateQuiz = false;
          // isCreateAnswer = false;
          // correctAnswers = [];
          // userAnswers = [];
          // isViewAnswer = false;
          // isMakingAnswer = false;
          // isDoQuiz = false;
          // isChecked = false;
          // readyCheck = false;
          // isCreateDoquiz = false;
        } else {
          quizMode = false;
        }
      });

      $("#quiz-create").on("click", function () {
        canvas.clear();

        $("#quiz-create").css({ opacity: "0.5", "pointer-events": "none" });
        let quizType = $("#quiz-type").val();
        if (quizType == "quiz-1") {
          $("#quizs-body li:nth-child(n+4):nth-child(-n+5)").css({
            opacity: "1",
            "pointer-events": "auto",
          });
        } else {
          $("#quizs-body li:nth-child(n+4)").css({
            opacity: "1",
            "pointer-events": "auto",
          });
        }
        // socket.emit("startQuiz", { quizType });
      });

      // socket.on("startQuiz", function(data) {
      //   if (!$("#quiz").hasClass("active")) {
      //     $("#quiz")[0].click();
      //   }
      //   $("#quiz-type").val(data.quizType).change();
      //   $("#quiz-create")[0].click();
      // });

      $("#quiz-save").on("click", function () {
        $("#quiz-create").css({ opacity: "1", "pointer-events": "auto" });
        $("#quizs-body li:nth-child(n+4):nth-child(-n+10)").css({
          opacity: "0.5",
          "pointer-events": "none",
        });
      });

      function changeQuizFunc(quizType) {
        isCreateQuiz = false;
        isCreateAnswer = false;
        correctAnswers = [];
        userAnswers = [];
        isViewAnswer = false;
        isMakingAnswer = false;
        isDoQuiz = false;
        isChecked = false;
        readyCheck = false;
        isCreateDoquiz = false;
        console.log("changeQuizFunc", quizType);
        if (quizType == "quiz-1") {
          $("#open-quiz-modal")[0].style.display = "block";
          $("#create-table-empty")[0].style.display = "none";
          // $("#normal-addimage")[0].style.display = "inline-block";
          $("#quiz-addimage")[0].style.display = "none";
          // $('#sub-menu-background')[ 0 ].style.display = 'none';
          $("#sub-menu-fixed")[0].style.display = "block";
          $("#sub-menu-vessel")[0].style.display = "none";
          $("#open-single-choose-modal")[0].style.display = "none";
          $("#open-multiple-choose-modal")[0].style.display = "none";
          $("#open-multiple-upload-image")[0].style.display = "none";
          $("#multiple-choose-question")[0].style.display = "none";
          $("#open-multiple-add-rect")[0].style.display = "none";
          $("#multiple-choose-lock-object")[0].style.display = "none";

          $("#delete-multiple-choose-object")[0].style.display = "none";

        } else if (quizType == "quiz-2") {
          $("#open-quiz-modal")[0].style.display = "none";
          $("#create-table-empty")[0].style.display = "none";
          // $("#normal-addimage")[0].style.display = "inline-block";
          $("#quiz-addimage")[0].style.display = "none";
          // $('#sub-menu-background')[ 0 ].style.display = 'none';
          $("#sub-menu-fixed")[0].style.display = "block";
          $("#sub-menu-vessel")[0].style.display = "none";
          $("#open-single-choose-modal")[0].style.display = "none";
          $("#open-multiple-choose-modal")[0].style.display = "none";
          $("#delete-multiple-choose-object")[0].style.display = "none";
          $("#open-multiple-upload-image")[0].style.display = "none";
          $("#multiple-choose-question")[0].style.display = "none";
          $("#open-multiple-add-rect")[0].style.display = "none";
          $("#multiple-choose-lock-object")[0].style.display = "none";

          isCreateQuiz = true;
        } else if (quizType == "quiz-3") {
          $("#open-quiz-modal")[0].style.display = "none";
          $("#create-table-empty")[0].style.display = "none";
          // $("#normal-addimage")[0].style.display = "none";
          $("#quiz-addimage")[0].style.display = "inline-block";
          // $('#sub-menu-background')[ 0 ].style.display = 'block';
          $("#sub-menu-fixed")[0].style.display = "none";
          $("#sub-menu-vessel")[0].style.display = "block";
          $("#open-single-choose-modal")[0].style.display = "none";
          $("#open-multiple-choose-modal")[0].style.display = "none";
          $("#open-multiple-upload-image")[0].style.display = "none";
          $("#multiple-choose-question")[0].style.display = "none";
          $("#delete-multiple-choose-object")[0].style.display = "none";
          $("#open-multiple-add-rect")[0].style.display = "none";
          $("#multiple-choose-lock-object")[0].style.display = "none";

          isCreateQuiz = true;

        } else if (quizType == "quiz-9") {
          $("#open-quiz-modal")[0].style.display = "none";
          $("#create-table-empty")[0].style.display = "none";
          $("#open-multiple-upload-image")[0].style.display = "none";
          $("#multiple-choose-question")[0].style.display = "none";
          // $("#normal-addimage")[0].style.display = "inline-block";
          $("#quiz-addimage")[0].style.display = "none";
          // $('#sub-menu-background')[ 0 ].style.display = 'none';
          $("#sub-menu-fixed")[0].style.display = "block";
          $("#sub-menu-vessel")[0].style.display = "none";
          $("#open-single-choose-modal")[0].style.display = "none";
          $("#open-multiple-choose-modal")[0].style.display = "none";
          $("#delete-multiple-choose-object")[0].style.display = "none";
          $("#open-multiple-add-rect")[0].style.display = "none";
          $("#multiple-choose-lock-object")[0].style.display = "none";

          isCreateQuiz = true;
        } else if (quizType == "quiz-10") {
          $("#open-quiz-modal")[0].style.display = "none";
          $("#open-single-choose-modal")[0].style.display = "block";
          $("#open-multiple-choose-modal")[0].style.display = "none";
          $("#open-multiple-upload-image")[0].style.display = "none";
          $("#multiple-choose-question")[0].style.display = "none";
          $("#create-table-empty")[0].style.display = "none";
          // $("#normal-addimage")[0].style.display = "none";
          $("#quiz-addimage")[0].style.display = "none";
          // $('#sub-menu-background')[ 0 ].style.display = 'none';
          $("#sub-menu-fixed")[0].style.display = "none";
          $("#sub-menu-vessel")[0].style.display = "none";
          $("#delete-multiple-choose-object")[0].style.display = "none";
          $("#open-multiple-add-rect")[0].style.display = "none";
          $("#multiple-choose-lock-object")[0].style.display = "none";

        } else if (quizType == "quiz-11") {
          $("#open-quiz-modal")[0].style.display = "none";
          $("#open-single-choose-modal")[0].style.display = "none";
          $("#open-multiple-choose-modal")[0].style.display = "block";
          $("#open-multiple-upload-image")[0].style.display = "block";
          $("#multiple-choose-question")[0].style.display = "block";
          $("#open-multiple-add-rect")[0].style.display = "block";
          $("#delete-multiple-choose-object")[0].style.display = "block";
          $("#create-table-empty")[0].style.display = "none";
          // $("#normal-addimage")[0].style.display = "none";
          $("#quiz-addimage")[0].style.display = "none";
          // $('#sub-menu-background')[ 0 ].style.display = 'none';
          $("#sub-menu-fixed")[0].style.display = "none";
          $("#sub-menu-vessel")[0].style.display = "none";
          $("#multiple-choose-lock-object")[0].style.display = "block";
          isCreateQuiz = true;
        }
        $("#quiz-create").css({ opacity: "1", "pointer-events": "auto" });
        $("#quizs-body li:nth-child(n+4):nth-child(-n+10)").css({
          opacity: "0.5",
          "pointer-events": "none",
        });
      }

      $("#quiz-type").on("change", function () {
        changeQuizFunc(this.value)

        socket.emit("changeQuizType", { quizType: this.value });
      });

      socket.on("changeQuizType", function (data) {
        if (!$("#quiz").hasClass("active")) {
          $("#quiz")[0].click();
        }
        $("#quiz-type").val(data.quizType);
        changeQuizFunc(data.quizType)
      });

      $("#font li").click(function () {
        loadAndUse($(this).attr("value"), activeObject, canvas);
        $("#font li").removeClass("active");
        $(this).addClass("active");
      });

      $("#font-textbox li").click(function () {
        loadAndUse($(this).attr("value"), activeObject, canvas);
        $("#font-textbox li").removeClass("active");
        $(this).addClass("active");
      });

      $("#size li").click(function () {
        $("#size li").removeClass("active");
        $(this).addClass("active");
        let font_size = parseInt($(this).attr("value"));
        $("#current-size span:first-child").text(font_size);

        activeObject.set({
          fontSize: font_size,
        });
        if (activeObject._objects?.length > 0) {
          if (activeObject.name === "latex") {
            activeObject.item(0).set({
              scaleX: (font_size + 16) / 12,
              scaleY: (font_size + 16) / 12,
            });
            // activeObject.item(1).set({
            //     fontSize: font_size
            // })

            activeObject.addWithUpdate();
          } else {
            activeObject._objects.forEach((obj) => {
              if (obj.type == "textbox") {
                obj.set({
                  fontSize: font_size,
                });
              }
            });
          }
        }
        if (activeObject.type === "textbox") {
          activeObject.set({
            width: (font_size + 10) * 4,
          });
        }

        console.log("font size", activeObject);

        updateLocal(
          pool_data,
          activeObject.objectID,
          activeObject.toObject(customAttributes),
          socket,
          false
        );
        canvas.requestRenderAll();
      });

      $("#size-textbox li").click(function () {
        $("#size-textbox li").removeClass("active");
        $(this).addClass("active");
        let font_size = parseInt($(this).attr("value"));
        $("#current-size-textbox span:first-child").text(font_size);

        activeObject.set({
          fontSize: font_size,
        });
        if (activeObject._objects?.length > 0) {
          if (activeObject.name === "latex") {
            activeObject.item(0).set({
              scaleX: (font_size + 16) / 12,
              scaleY: (font_size + 16) / 12,
            });
            // activeObject.item(1).set({
            //     fontSize: font_size
            // })

            activeObject.addWithUpdate();
          } else {
            activeObject._objects.forEach((obj) => {
              if (obj.type == "textbox") {
                obj.set({
                  fontSize: font_size,
                });
              }
            });
          }
        }
        if (activeObject.type === "textbox") {
          activeObject.set({
            width: (font_size + 10) * 4,
          });
        }

        console.log("font size", activeObject);

        updateLocal(
          pool_data,
          activeObject.objectID,
          activeObject.toObject(customAttributes),
          socket,
          false
        );
        canvas.requestRenderAll();
      });

      $("#objBlink").on("click", function () {
        activeObject.blink = !activeObject.blink;
        if (activeObject.blink) {
          this.innerText = "ON";
          blink(activeObject);
        } else {
          this.innerText = "OFF";
        }
        updateLocal(
          pool_data,
          activeObject.objectID,
          activeObject.toObject(customAttributes),
          socket,
          false
        );
      });
      $("#objectCode").on("input", function () {
        activeObject.set({
          objectCode: this.value,
        });
        updateLocal(
          pool_data,
          activeObject.objectID,
          activeObject.toObject(customAttributes),
          socket,
          false
        );
      });

      $("#textColor").on("input", function () {
        if (activeObject._objects?.length > 0) {
          activeObject.forEachObject((o) => {
            if (o.type === "textbox") {
              o.set({
                fill: this.value,
              });
            }
          });
        }
        activeObject.set({
          colorText: this.value,
          fill: this.value,
        });
        updateLocal(
          pool_data,
          activeObject.objectID,
          activeObject.toObject(customAttributes),
          socket,
          false
        );

        canvas.requestRenderAll();
      });

      $("#textColor-textbox").on("input", function () {
        activeObject.set({
          fill: this.value,
        });
        updateLocal(
          pool_data,
          activeObject.objectID,
          activeObject.toObject(customAttributes),
          socket,
          false
        );

        canvas.requestRenderAll();
      });

      // soundMode....
      // activeObject.soundMoving = blob.createObjectURL(file);

      // dropdown submenu
      $("#objSelectDropDown").on("click", function () {
        if ($("#objSelectList")[0].style.display == "none") {
          $("#objSelectList").css({ display: "block" });
          this.innerHTML = '<i class="fa fa-chevron-up" aria-hidden="true"></i>';
        } else {
          $("#objSelectList").css({ display: "none" });
          this.innerHTML = '<i class="fa fa-chevron-down" aria-hidden="true"></i>';
        }
      });
      $("#objInputDropDown").on("click", function () {
        if ($("#objInputList")[0].style.display == "none") {
          $("#objInputList").css({ display: "block" });
          this.innerHTML = '<i class="fa fa-chevron-up" aria-hidden="true"></i>';
        } else {
          $("#objInputList").css({ display: "none" });
          this.innerHTML = '<i class="fa fa-chevron-down" aria-hidden="true"></i>';
        }
      });
      $("#objSnapDropDown").on("click", function () {
        if ($("#objSnapList")[0].style.display == "none") {
          $("#objSnapList").css({ display: "block" });
          this.innerHTML = '<i class="fa fa-chevron-up" aria-hidden="true"></i>';
        } else {
          $("#objSnapList").css({ display: "none" });
          this.innerHTML = '<i class="fa fa-chevron-down" aria-hidden="true"></i>';
        }
      });
      $("#objControlDropDown").on("click", function () {
        if ($("#objControlList")[0].style.display == "none") {
          $("#objControlList").css({ display: "block" });
          this.innerHTML = '<i class="fa fa-chevron-up" aria-hidden="true"></i>';
        } else {
          $("#objControlList").css({ display: "none" });
          this.innerHTML = '<i class="fa fa-chevron-down" aria-hidden="true"></i>';
        }
      });

      // zoom tab
      $("#userListDropDown").on("click", function () {
        if ($("#userListContainer").css("display") === "none") {
          $("#userListDropDown span:nth-child(2)").html(
            '<i class="fa fa-chevron-down" aria-hidden="true"></i>'
          );
        } else {
          $("#userListDropDown span:nth-child(2)").html(
            '<i class="fa fa-chevron-left" aria-hidden="true"></i>'
          );
        }
        $("#userListContainer").slideToggle();
        // if($('#userListContainer')[0].style.display == 'none') {
        //     $('#userListContainer').css({ 'display': 'block' });
        //     this.innerHTML = '<i class="fa fa-chevron-up" aria-hidden="true"></i>';
        // } else {
        //     $('#userListContainer').css({ 'display': 'none' });
        //     this.innerHTML = '<i class="fa fa-chevron-down" aria-hidden="true"></i>';
        // }
      });
      $("#zoomCameraDropDown").on("click", function () {
        if ($("#zoomCameraContainer").css("display") === "none") {
          $("#zoomCameraDropDown span:nth-child(2)").html(
            '<i class="fa fa-chevron-down" aria-hidden="true"></i>'
          );
        } else {
          $("#zoomCameraDropDown span:nth-child(2)").html(
            '<i class="fa fa-chevron-left" aria-hidden="true"></i>'
          );
        }
        $("#zoomCameraContainer").slideToggle();
        // if($('#zoomCameraContainer')[0].style.display == 'none') {
        //     $('#zoomCameraContainer').css({ 'display': 'block' });
        // } else {
        //     $('#zoomCameraContainer').css({ 'display': 'none' });
        //     this.innerHTML = '<i class="fa fa-chevron-down" aria-hidden="true"></i>';
        // }
      });
      $("#zoomChatDropDown").on("click", function () {
        if ($("#zoomChatContainer").css("display") === "none") {
          $("#zoomChatDropDown span:nth-child(2)").html(
            '<i class="fa fa-chevron-down" aria-hidden="true"></i>'
          );
        } else {
          $("#zoomChatDropDown span:nth-child(2)").html(
            '<i class="fa fa-chevron-left" aria-hidden="true"></i>'
          );
        }
        $("#zoomChatContainer").slideToggle();
        // if($('#zoomChatContainer')[0].style.display == 'none') {
        //     $('#zoomChatContainer').css({ 'display': 'block' });
        //     this.innerHTML = '<i class="fa fa-chevron-up" aria-hidden="true"></i>';
        // } else {
        //     $('#zoomChatContainer').css({ 'display': 'none' });
        //     this.innerHTML = '<i class="fa fa-chevron-down" aria-hidden="true"></i>';
        // }
      });

      $("#bgColor").on("input", function () {
        if (activeObject._objects) {
          activeObject.item(0)?.set({
            fill: this.value,
          });
        }
        activeObject.set({
          fill: this.value,
        });
        updateLocal(
          pool_data,
          activeObject.objectID,
          activeObject.toObject(customAttributes),
          socket,
          false
        );
        canvas.requestRenderAll();
      });

      $("#borderColor").on("input", function () {
        if (activeObject._objects) {
          activeObject.item(0)?.set({
            stroke: this.value,
          });
        } else if (activeObject.name !== "text" && activeObject.name !== "latex") {
          activeObject.set({
            stroke: this.value,
          });
        }
        activeObject.set({
          colorBorder: this.value,
        });
        updateLocal(
          pool_data,
          activeObject.objectID,
          activeObject.toObject(customAttributes),
          socket,
          false
        );
        canvas.requestRenderAll();
      });

      $("#fillColor").on("input", function () {
        if (activeObject._objects) {
          activeObject.item(0)?.set({
            fill: this.value,
          });
        } else if (activeObject.name !== "text" && activeObject.name !== "latex") {
          activeObject.set({
            fill: this.value,
          });
        }
        activeObject.set({
          colorFill: this.value,
        });
        updateLocal(
          pool_data,
          activeObject.objectID,
          activeObject.toObject(customAttributes),
          socket,
          false
        );
        canvas.requestRenderAll();
      });

      $("#textBoxShadow").on("change", function () {
        var color;
        if (activeObject._objects) {
          color = activeObject.item(0)?.fill;
        }
        if (!color) {
          color = "#000000"
        }
        else if (activeObject.name !== "text" && activeObject.name !== "latex") {
          color = activeObject.fill;
        }
        var shadow = new fabric.Shadow({
          color: color,
          blur: 25,
        });
        var selectedValue = $(this).val();
        if (activeObject._objects) {
          if (selectedValue === "no shadow") {
            activeObject.item(0)?.set({
              shadow: null,
            });
          }
          else if (selectedValue === "shadow") {
            activeObject.item(0)?.set({
              shadow: shadow,
            });
          }
        } else if (activeObject.name !== "text" && activeObject.name !== "latex") {
          if (selectedValue === "no shadow") {
            activeObject.set({
              shadow: null,
            });
          } else if (selectedValue === "shadow") {
            activeObject.set({
              shadow: shadow,
            });
          }
          activeObject.set({
            shadow: shadow,
          });
          updateLocal(
            pool_data,
            activeObject.objectID,
            activeObject.toObject(customAttributes),
            socket,
            false
          );
        }
      });

      $("#textBoxRadiusText").on("input", function () {
        if (activeObject._objects) {
          activeObject.item(0)?.set({
            rx: this.value,
            ry: this.value,
          });
        } else if (activeObject.name == "rect") {
          activeObject.set({
            rx: this.value,
            ry: this.value,
          });
        }
        activeObject.set({
          radius: this.value,
        });
        updateLocal(
          pool_data,
          activeObject.objectID,
          activeObject.toObject(customAttributes),
          socket,
          false
        );
      });

      $("#lockTextBox").on("change", function (e) {
        console.log("lockTextBox", e);
        var selectedValue = $(this).val();
        if (activeObject._objects) {
          if (selectedValue === "lock") {
            activeObject.item(0)?.set({
              lockMovementX: true,
              lockMovementY: true,
              lockScalingX: true,
              lockScalingY: true,
              lockRotation: true,
              lockUniScaling: true,
              hasControls: false,
              hasBorders: false,
              selectable: false,
            });
          }
          else if (selectedValue === "unlock") {
            activeObject.item(0)?.set({
              lockMovementX: false,
              lockMovementY: false,
              lockScalingX: false,
              lockScalingY: false,
              lockRotation: false,
              lockUniScaling: false,
              hasControls: true,
              hasBorders: true,
              selectable: true,
            });
          }
        } else if (activeObject.name !== "text" && activeObject.name !== "latex") {
          if (selectedValue === "lock") {
            activeObject.set({
              lockMovementX: true,
              lockMovementY: true,
              lockScalingX: true,
              lockScalingY: true,
              lockRotation: true,
              lockUniScaling: true,
              hasControls: false,
              hasBorders: false,
              selectable: false,
            });
          } else if (selectedValue === "unlock") {
            activeObject.set({
              lockMovementX: false,
              lockMovementY: false,
              lockScalingX: false,
              lockScalingY: false,
              lockRotation: false,
              lockUniScaling: false,
              hasControls: true,
              hasBorders: true,
              selectable: true,
            });
          }
          updateLocal(
            pool_data,
            activeObject.objectID,
            activeObject.toObject(customAttributes),
            socket,
            false
          );
        }
      });

      $("#borderWidth").on("input", function () {
        // if (activeObject.name == 'line-style') {
        //     activeObject._objects.forEach(obj => {
        //         obj.set({
        //             stroke: this.value,
        //         })
        //     })
        // }
        if (activeObject._objects) {
          activeObject.item(0)?.set({
            strokeWidth: this.value,
          });
        } else {
          activeObject.set({
            strokeWidth: this.value,
          });
        }
        activeObject.set({
          widthBorder: this.value,
        });
        updateLocal(
          pool_data,
          activeObject.objectID,
          activeObject.toObject(customAttributes),
          socket,
          false
        );
        canvas.requestRenderAll();
      });

      $("#objCurve").on("input", function () {
        if (activeObject.name == "rect") {
          activeObject.item(0).set({
            rx: this.value,
            ry: this.value,
          });
        }
        activeObject.set({
          curve: this.value,
        });
        updateLocal(
          pool_data,
          activeObject.objectID,
          activeObject.toObject(customAttributes),
          socket,
          false
        );
        canvas.requestRenderAll();
      });

      $("#objShadow").on("click", function () {
        if (activeObject.hasShadow) {
          activeObject.hasShadow = false;
          if (activeObject._objects) activeObject.item(0).shadow = null;
          else activeObject.shadow = null;

          this.innerText = "Off";
        } else {
          activeObject.hasShadow = true;
          if (activeObject._objects)
            activeObject.item(0).shadow = activeObject.shadowObj;
          else activeObject.shadow = activeObject.shadowObj;

          this.innerText = "On";
        }
        updateLocal(
          pool_data,
          activeObject.objectID,
          activeObject.toObject(customAttributes),
          socket,
          false
        );
        canvas.requestRenderAll();
      });

      $("#objSelect").on("change", function () {
        activeObject.select = !activeObject.select;
        updateLocal(
          pool_data,
          activeObject.objectID,
          activeObject.toObject(customAttributes),
          socket,
          false
        );
        canvas.requestRenderAll();
      });

      $("#objInput").on("change", function () {
        activeObject.input = !activeObject.input;
        updateLocal(
          pool_data,
          activeObject.objectID,
          activeObject.toObject(customAttributes),
          socket,
          false
        );
        canvas.requestRenderAll();
      });

      $("#objSnap").on("change", function () {
        if (activeObject.snap) {
          activeObject.set({
            snap: false,
          });
          this.innerText = "Off";
        } else {
          activeObject.set({
            snap: true,
          });
          this.innerText = "On";
        }
        updateLocal(
          pool_data,
          activeObject.objectID,
          activeObject.toObject(customAttributes),
          socket,
          false
        );
        canvas.requestRenderAll();
      });
      // Kiet add background and change object type to drop when fixed
      function repositionDragDrop() {
        canvas.forEachObject(function (obj) {
          if (obj.isDrop === true) {
            obj.set({
              pos: "back",
              lockMovementY: true,
              lockMovementX: true,
              selectable: false,
            });
            canvas.sendToBack(obj);
          }
        });
        canvas.forEachObject(function (obj) {
          if (obj.isBackground === true) {
            obj.set({
              pos: "back",
              lockMovementY: true,
              lockMovementX: true,
              selectable: false,
            });
            canvas.sendToBack(obj);
          }
        });
      }
      function repositionBackground() {
        canvas.forEachObject(function (obj) {
          if (obj.isBackground != true) {
            obj.set({
              pos: "front",
            });
            canvas.bringToFront(obj);
          }
        });
        canvas.forEachObject(function (obj) {
          if (obj.isBackground === true) {
            obj.set({
              pos: "back",
              lockMovementY: true,
              lockMovementX: true,
              selectable: false,
            });
            canvas.sendToBack(obj);
          }
        });
      }

      $("#objControl").on("change", function () {
        if (activeObject.hasControls) {
          activeObject.set({
            hasControls: false,
          });
        } else {
          activeObject.set({
            hasControls: true,
          });
        }
        updateLocal(
          pool_data,
          activeObject.objectID,
          activeObject.toObject(customAttributes),
          socket,
          false
        );
        canvas.requestRenderAll();
      });

      $("#objFixed").on("click", function () {
        if (activeObject.lockMovementX) {
          activeObject.set({
            lockMovementX: false,
            lockMovementY: false,
          });
          this.innerText = "Off";
        } else {
          activeObject.set({
            lockMovementX: true,
            lockMovementY: true,
          });
          this.innerText = "On";
        }
        updateLocal(
          pool_data,
          activeObject.objectID,
          activeObject.toObject(customAttributes),
          socket,
          false
        );
        canvas.requestRenderAll();
      });

      $("#objBring").on("click", function () {
        if (activeObject.pos === "back") {
          activeObject.set({
            pos: "front",
          });
          canvas.bringToFront(activeObject);
          this.innerText = "Back";

          const fromIndex = pool_data.findIndex(
            (o) => o.id === activeObject.objectID
          );
          const obj = pool_data.splice(fromIndex, 1)[0];
          pool_data.push(obj);
        } else {
          activeObject.set({
            pos: "back",
          });
          if (layerStorage[currentLayer - 1].canvas.gridObj) {
            activeObject.moveTo(1);

            const fromIndex = pool_data.findIndex(
              (o) => o.id === activeObject.objectID
            );
            const obj = pool_data.splice(fromIndex, 1)[0];
            pool_data.splice(1, 0, obj);
          } else {
            canvas.sendToBack(activeObject);

            const fromIndex = pool_data.findIndex(
              (o) => o.id === activeObject.objectID
            );
            const obj = pool_data.splice(fromIndex, 1)[0];
            pool_data.unshift(obj);
          }
          this.innerText = "Front";
        }
        socket.emit("update", pool_data);
        canvas.requestRenderAll();
      });

      $("#objVessel").on("click", function () {
        if (activeObject.lockMovementX) {
          if (activeObject.isDrop === true) {
            activeObject.set({
              isDrag: true,
              isDrop: false,
            });
          }
          activeObject.set({
            lockMovementX: false,
            lockMovementY: false,
          });
          this.innerText = "Off";
        } else {
          if (activeObject.isDrag === true) {
            activeObject.set({
              isDrag: false,
              isDrop: true,
            });
            repositionDragDrop();
          }
          activeObject.set({
            lockMovementX: true,
            lockMovementY: true,
          });
          this.innerText = "On";
        }
        socket.emit("objVessel", { id: activeObject.objectID, value: activeObject.lockMovementX });
        canvas.requestRenderAll();
      });

      socket.on("objVessel", function (data) {
        canvas.forEachObject(o => {
          if (o.objectID === data.id) {
            if (data.value) {
              if (o.isDrag === true) {
                o.set({
                  isDrag: false,
                  isDrop: true,
                });
                repositionDragDrop();
              }
              o.set({
                lockMovementX: true,
                lockMovementY: true,
              });
            } else {
              if (o.isDrop === true) {
                o.set({
                  isDrag: true,
                  isDrop: false,
                });
              }
              o.set({
                lockMovementX: false,
                lockMovementY: false,
              });
            }
          }
        })
      });

      $("#bgToggle").on("click", function () {
        if (activeObject.isBackground) {
          activeObject.set({
            isBackground: false,
            isDrag: true,
            isDrop: false,
            lockMovementX: false,
            lockMovementY: false,
          });
          this.innerText = "Off";

          canvas.setBackgroundImage(null, canvas.renderAll.bind(canvas));

          socket.emit("setBgImg", null);
        } else {
          activeObject.set({
            isBackground: true,
            isDrag: false,
            isDrop: false,
            lockMovementX: true,
            lockMovementY: true,
          });
          repositionDragDrop();
          this.innerText = "On";

          canvas.setBackgroundImage(activeObject, canvas.renderAll.bind(canvas), {
            top: 0,
            left: 0,
            scaleX: canvas.width / activeObject.width,
            scaleY: canvas.height / activeObject.height,
          });
          socket.emit("setBgImg", activeObject.objectID);
        }
        updateLocal(
          pool_data,
          activeObject.objectID,
          activeObject.toObject(customAttributes),
          socket
        );
        canvas.requestRenderAll();
      });

      $("#align").on("click", function () {
        if (activeObject) {
          var idx = alignOptions.findIndex((o) => o === activeObject.textAlign);
          if (idx !== -1) {
            idx++;
            if (idx === 3) idx = 0;
            $("#align i:first-child").removeClass(
              `fa-align-${activeObject.textAlign}`
            );
            activeObject.textAlign = alignOptions[idx];
            activeObject._objects?.forEach((o) => {
              if (o.type === "textbox") {
                o.textAlign = alignOptions[idx];
              }
            });
            $("#align i:first-child").addClass(
              `fa-align-${activeObject.textAlign}`
            );
          }
          updateLocal(
            pool_data,
            activeObject.objectID,
            activeObject.toObject(customAttributes),
            socket
          );
        }
        canvas.requestRenderAll();
      });

      $("#bold").on("click", function () {
        if (activeObject) {
          var bold = activeObject.fontWeight === "normal" ? "bold" : "normal";
          activeObject.fontWeight = bold;
          activeObject._objects?.forEach((o) => {
            if (o.type === "textbox") {
              o.fontWeight = bold;
            }
          });
          $(this).toggleClass("active");
          updateLocal(
            pool_data,
            activeObject.objectID,
            activeObject.toObject(customAttributes),
            socket
          );
        }
        canvas.requestRenderAll();
      });

      $("#italic").on("click", function () {
        if (activeObject) {
          var italic = activeObject.fontStyle === "normal" ? "italic" : "normal";
          activeObject.fontStyle = italic;
          activeObject._objects?.forEach((o) => {
            if (o.type === "textbox") {
              o.fontStyle = italic;
            }
          });
          $(this).toggleClass("active");
          updateLocal(
            pool_data,
            activeObject.objectID,
            activeObject.toObject(customAttributes),
            socket
          );
        }
        canvas.requestRenderAll();
      });

      $("#underline").on("click", function () {
        if (activeObject) {
          activeObject.underline = !activeObject.underline;
          activeObject._objects?.forEach((o) => {
            if (o.type === "textbox") {
              o.underline = activeObject.underline;
            }
          });
          $(this).toggleClass("active");
          updateLocal(
            pool_data,
            activeObject.objectID,
            activeObject.toObject(customAttributes),
            socket
          );
        }
        canvas.requestRenderAll();
      });

      $("#bold-textbox").on("click", function () {
        if (activeObject) {
          var bold = activeObject.fontWeight === "normal" ? "bold" : "normal";
          activeObject.fontWeight = bold;
          activeObject._objects?.forEach((o) => {
            if (o.type === "textbox") {
              o.fontWeight = bold;
            }
          });
          updateLocal(
            pool_data,
            activeObject.objectID,
            activeObject.toObject(customAttributes),
            socket
          );
        }
        canvas.requestRenderAll();
      });

      $("#italic-textbox").on("click", function () {
        if (activeObject) {
          var italic = activeObject.fontStyle === "normal" ? "italic" : "normal";
          activeObject.fontStyle = italic;
          activeObject._objects?.forEach((o) => {
            if (o.type === "textbox") {
              o.fontStyle = italic;
            }
          });
          updateLocal(
            pool_data,
            activeObject.objectID,
            activeObject.toObject(customAttributes),
            socket
          );
        }
        canvas.requestRenderAll();
      });

      $("#underline-textbox").on("click", function () {
        if (activeObject) {
          activeObject.underline = !activeObject.underline;
          activeObject._objects?.forEach((o) => {
            if (o.type === "textbox") {
              o.underline = !activeObject.underline;
            }
          });
          updateLocal(
            pool_data,
            activeObject.objectID,
            activeObject.toObject(customAttributes),
            socket
          );
        }
        canvas.requestRenderAll();
      });

      $("#align-textbox").on("click", function () {
        if (activeObject) {
          var idx = alignOptions.findIndex((o) => o === activeObject.textAlign);
          if (idx !== -1) {
            idx++;
            if (idx === 2) idx = 0;
            $("#align-textbox i:first-child").removeClass(
              `fa-align-${activeObject.textAlign}`
            );
            activeObject.set({
              textAlign: alignOptions[idx],
            });
            activeObject._objects?.forEach((o) => {
              if (o.type === "textbox") {
                o.textAlign = alignOptions[idx];
              }
            });
            $("#align-textbox i:first-child").addClass(
              `fa-align-${activeObject.textAlign}`
            );
          }
          updateLocal(
            pool_data,
            activeObject.objectID,
            activeObject.toObject(customAttributes),
            socket
          );
        }
        canvas.requestRenderAll();
      });
      socket.on("message", (msg) => {
        console.log(msg);
      });
      //load users
      if ($("#login").hasClass("hidden")) {
        // socket.on("getUsers", (data) => {

      }
      console.log('reloadMembers');
      socket.on("reloadMembers", (data) => {
        const users = data;
        console.log(users);
        listUserMeeting = data;
        $("#listUsers")[0].innerHTML = "";
        for (let i = 0; i <= users.length - 1; i++) {
          if (!users[i].isHidden) {
            const li = document.createElement("li");
            const userItem = document.createElement("div");
            userItem.classList.add("user-item");
            userItem.classList.add("fs20");
            userItem.classList.add("lh35");
            userItem.innerHTML = `
                    <div>
            <img class="img-profile" src="assets/icons/61_Profile_User.png" alt="avatar">
            <span>${users[i].displayName} [${users[i].role}]</span>
                </div>
        `;
            const div = document.createElement("div");
            // div.style['margin-right'] = '30px';
            div.innerHTML = `<div style="margin-right: 30px">${users[i].isDrawing ?
              '<i class="fa-solid fa-hand fs30 color-green" *ngIf="user.isDrawing"></i>' :
              '<i class="fa-regular fa-hand fs30 color-green" *ngIf="!user.isDrawing"></i>'
              }</div>
          `;
            const joinButton = document.createElement("button");
            joinButton.classList.add("btn_openSearch");
            joinButton.style.border = 'none';
            joinButton.style['box-shadow'] = 'none';
            joinButton.innerHTML =
              !users[i].haveDrawingPermission ?
                '<i class="fa-solid fa-square fs30 toggleDrawPerTrue" style="color: #183153;"></i>' :
                '<i class="fa-solid fa-square-check fs30 toggleDrawPerFalse" style="color: #183153;"></i>';
            joinButton.value = i;
            joinButton.onclick = acceptRequest;

            div.appendChild(joinButton);
            userItem.appendChild(div);
            li.appendChild(userItem);
            $("#listUsers")[0].appendChild(li);
          }
        }
        updatePermission();
      });

      // $('#menuMore').on('click', function (e) {
      //     $('#sub-menu').slideToggle()
      // })

      $("#menuMore-textbox").on("click", function (e) {
        const subMenu = $("#sub-menu-textbox")[0];
        if (subMenu.style.visibility === "hidden") {
          $("#sub-menu-textbox").css({
            visibility: "visible",
            top: 50 + "px",
            left: 0 + "px",
          });
        } else {
          $("#sub-menu-textbox").css({ visibility: "hidden" });
        }
      });

      // popup path-menu
      $("#pathMover").on("click", function () {
        $("#path-menu").slideToggle();
      });

      // start create path
      $("#pathCreate").on("click", function () {
        hidePopupMenu();
        $("#pathBtns").css({ visibility: "visible" });

        $("#pathToggleDrawing").click();

        $(".pencil-class").addClass("hidden");
      });

      // startIdx for check path created for path moving
      // after creating path, get the last path for obj moving
      var startIdx;
      $("#pathToggleDrawing").on("click", function () {
        if (activeObject.isDrawingPath) {
          $("#drwToggleDrawMode").click();
          $(".tool-btn").removeClass("active");
          $(".pencil-class").addClass("hidden");

          activeObject.isDrawingPath = false;
          this.innerHTML = '<i class="fa fa-pencil" aria-hidden="true"></i>';

          const pathObj = canvas._objects.splice(
            startIdx,
            canvas._objects.length - startIdx
          )[0];

          activeObject.pathObj = pathObj.item(0);

          canvas.renderAll();

          const value = activeObject.pathObj.path
            .map((point) => `[${parseInt(point[2])}, ${parseInt(point[1])}]`)
            .join(" ");
          $("#pathObj").val(value);
        } else {
          $("#drwToggleDrawMode").click();
          $(".tool-btn").removeClass("active");
          $(".pencil-class").addClass("hidden");

          activeObject.isDrawingPath = true;
          this.innerHTML = '<i class="fa fa-check" aria-hidden="true"></i>';

          startIdx = canvas._objects.length;

          $("#pathObj").val("Empty");
        }
        isDrawMovingPath = activeObject.isDrawingPath;
        updateLocal(
          pool_data,
          activeObject.objectID,
          activeObject.toObject(customAttributes),
          socket
        );
      });

      $("#closePathDrawMode").on("click", function () {
        activeObject.isDrawingPath = false;
        $("#pathBtns").css({ visibility: "hidden" });

        $("#edit-form").css({ visibility: "visible" });
        $("#path-menu").css({ visibility: "visible" });
        updateLocal(
          pool_data,
          activeObject.objectID,
          activeObject.toObject(customAttributes),
          socket
        );
      });

      $("#pathMovingRepeat").on("change", function () {
        activeObject.isRepeat = !activeObject.isRepeat;
        updateLocal(
          pool_data,
          activeObject.objectID,
          activeObject.toObject(customAttributes),
          socket
        );
      });

      $("#pathMovingSpeed").on("input", function () {
        activeObject.speedMoving = this.value;
        updateLocal(
          pool_data,
          activeObject.objectID,
          activeObject.toObject(customAttributes),
          socket
        );
      });

      $("#soundMoving").change(function (e) {
        const sound = loadSoundInput(e.target);

        activeObject.set({
          nameSoundMoving: sound.name,
          soundMoving: sound.src,
        });
        this.value = "";
        updateLocal(
          pool_data,
          activeObject.objectID,
          activeObject.toObject(customAttributes),
          socket,
          false
        );
      });

      $("#pathMovingMode").on("click", function () {
        if (activeObject.pathObj) {
          activeObject.isMoving = !activeObject.isMoving;
          if (activeObject.isMoving) {
            $("#pathMovingMark").css({ left: "33px", background: "#ff0000" });
            hidePopupMenu();
            activeObject.startMoving();
          } else {
            $("#pathMovingMark").css({ left: "1px", background: "#aaa" });
          }
          socket.emit("pathMoving", {
            objectID: activeObject.objectID,
            moving: activeObject.isMoving,
          });
        }
      });

      $("#toggleObjStatus").on("click", function () {
        if (activeObject.select) {
          if (activeObject.status) {
            this.innerHTML = '<i class="fa fa-times" aria-hidden="true"></i>';
            $("#toggleObjStatus").removeClass("btn-success");
            $("#toggleObjStatus").addClass("btn-danger");

            // remove
            if (isMakingAnswer) {
              correctAnswers = correctAnswers.filter(
                (item) => item.id != activeObject.objectID
              );
              console.log("correct answer:", orrectAnswers);
            } else if (isDoQuiz) {
              userAnswers = userAnswers.filter(
                (item) => item.id != activeObject.objectID
              );
              console.log("user answer:", userAnswers);
            }
          } else {
            this.innerHTML = '<i class="fa fa-check" aria-hidden="true"></i>';
            $("#toggleObjStatus").removeClass("btn-danger");
            $("#toggleObjStatus").addClass("btn-success");

            // add
            if (isMakingAnswer) {
              correctAnswers.push({
                id: activeObject.objectID,
                name: select,
              });
              console.log("correct answer:", orrectAnswers);
            } else if (isDoQuiz) {
              userAnswers.push({
                id: activeObject.objectID,
                name: select,
              });
              console.log("user answer:", userAnswers);
            }
          }
          activeObject.status = !activeObject.status;
        }
      });

      $("#colorSelected").on("input", function () {
        activeObject.colorSelected = this.value;
        updateLocal(
          pool_data,
          activeObject.objectID,
          activeObject.toObject(customAttributes),
          socket,
          false
        );
      });

      $("#colorUnselected").on("input", function () {
        activeObject.colorUnselected = this.value;
        updateLocal(
          pool_data,
          activeObject.objectID,
          activeObject.toObject(customAttributes),
          socket,
          false
        );
      });

      $("#close-editor").on("click", function () {
        $("#edit-form").css({ visibility: "hidden" });
        // $('#sub-menu').slideUp()
        // $('#path-menu').slideUp()
      });

      $("#close-editor-textbox").on("click", function () {
        $("#edit-form-textbox").css({ visibility: "hidden" });
        $("#sub-menu-textbox").css({ visibility: "hidden" });
        // $('#path-menu').css({ 'visibility': 'hidden' })
      });

      $("#replaceImg").on("input", function (e) {
        const image = reloadImageSrc(e.target);

        activeObject.set({
          nameImageContent: image.name,
          // imageContent: image.src
        });
        activeObject.setSrc(image.src, function () {
          activeObject.setCoords();
          canvas.requestRenderAll();
        });
        this.value = "";
        updateLocal(
          pool_data,
          activeObject.objectID,
          activeObject.toObject(customAttributes),
          socket,
          false
        );
      });

      $("#soundSelected").on("input", function (e) {
        const sound = loadSoundInput(e.target);

        activeObject.set({
          nameSoundSelected: sound.name,
          soundSelected: sound.src,
        });
        this.value = "";
        updateLocal(
          pool_data,
          activeObject.objectID,
          activeObject.toObject(customAttributes),
          socket,
          false
        );
      });

      $("#soundUnselected").on("input", function (e) {
        const sound = loadSoundInput(e.target);

        activeObject.set({
          nameSoundUnselected: sound.name,
          soundUnselected: sound.src,
        });
        this.value = "";
        updateLocal(
          pool_data,
          activeObject.objectID,
          activeObject.toObject(customAttributes),
          socket,
          false
        );
      });

      $("#soundTyping").on("input", function (e) {
        const sound = loadSoundInput(e.target);

        activeObject.set({
          nameSoundTyping: sound.name,
          soundTyping: sound.src,
        });
        this.value = "";
        updateLocal(
          pool_data,
          activeObject.objectID,
          activeObject.toObject(customAttributes),
          socket,
          false
        );
      });

      $("#soundSnap").on("input", function (e) {
        const sound = loadSoundInput(e.target);

        activeObject.set({
          nameSoundSnap: sound.name,
          soundSnap: sound.src,
        });
        this.value = "";
        updateLocal(
          pool_data,
          activeObject.objectID,
          activeObject.toObject(customAttributes),
          socket,
          false
        );
      });

      $("#objAngle").on("input", function () {
        activeObject.angle = this.value;
        console.log(activeObject);
        canvas.renderAll();
        updateLocal(
          pool_data,
          activeObject.objectID,
          activeObject.toObject(customAttributes),
          socket,
          false
        );
      });

      canvas.on("mouse:up", function (e) {
        if (
          e.target != null &&
          e.target.type != "image" &&
          e.target.name != "quiz-inputObj" &&
          e.target.name != "line-style" &&
          e.target.name != "custom-group" &&
          !isDrawLine &&
          !isChoosePort
        ) {
          if (e.target._objects && e.target._objects.length > 0) {
            if (findTargetPort(e.target).x1) {
            } else {
              mouseUp(e);
            }
          } else {
            mouseUp(e);
          }
        } else {
          if (e.target) {
            console.log(e.target);
          }
        }
      });

      var isMoving = false;
      canvas.on("object:moving", function (e) {
        isMoving = true;
        isLoadDataLocal = true;

        if (e.target && e.target.portMark) {
          const circle = e.target.portMark;
          circle.set({
            top: e.target.top - 20,
            left: e.target.left,
          });

          canvas.requestRenderAll();
        }

        hidePopupMenu();

        updateLocal(
          pool_data,
          e.target.objectID,
          {
            left: e.target.left,
            top: e.target.top,
          },
          socket,
          true
        );
      });

      var isScaling = false;
      canvas.on("object:scaling", function (e) {
        isScaling = true;
        // onChange(e);
      });

      let isRotating = false;
      canvas.on("object:rotating", function (e) {
        isRotating = true;
      });

      canvas.on("object:modified", function (e) {
        e.target.clicked = false;
        if (e.target && !isMakingAnswer && !isDoQuiz) {
          updateLocal(
            pool_data,
            e.target.objectID,
            {
              left: e.target.left,
              top: e.target.top,
            },
            socket,
            true
          );
        }
      });

      canvas.on("mouse:over", function (obj) {
        if (!isErasing && !isSelecting && !isDrawLine && !isMakingAnswer && !isDoQuiz) {
          if (obj.target && !obj.target.isBackground) {
            // if (obj.target.name != 'curve-point' &&
            //     // obj.target.name != 'lineConnect' &&
            //     obj.target.name != 'grid' &&
            //     !isDrawLine && !quizMode
            //     && obj.target.name != 'textBoxEditor'
            // ) {
            //     obj.target.setControlsVisibility({
            //         tl: true,
            //         tr: true,
            //         bl: true,
            //         br: true,
            //         mtr: true,
            //         mb: true,
            //         mt: true,
            //         ml: true,
            //         mr: true
            //     });

            // } else {
            //     obj.target.setControlsVisibility({
            //         tl: false,
            //         tr: false,
            //         bl: false,
            //         br: false,
            //         mtr: false,
            //         mb: false,
            //         mt: false,
            //         ml: false,
            //         mr: false
            //     });
            // }
            if (obj.target.name === "quiz") {
              obj.target.setControlsVisibility({
                tl: false,
                tr: false,
                bl: false,
                br: false,
                mtr: false,
                mb: false,
                mt: false,
                ml: false,
                mr: false
              });
            }
            //canvas.setActiveObject(obj.target);
          }
          canvas.renderAll();
        }
      });

      canvas.on("mouse:out", function (obj) {
        // if (obj.target && obj.target.name == 'line-style') {
        //     obj.target["cornerStyle"] = "rect"
        //     obj.target["cornerSize"] = 15
        //     obj.target.set("active", true)
        //     obj.target.set("hasRotatingPoint", true)
        //     obj.target.set("hasBorders", true)
        //     obj.target.set("transparentCorners", true)
        //     obj.target.setControlsVisibility({
        //         tl: true,
        //         tr: true,
        //         bl: true,
        //         br: true,
        //         mt: true,
        //         mb: true,
        //         mtr: true,
        //         ml: true,
        //         mr: true
        //     })
        // }
        // //obj.target.item(0).set("fill", "white")
        // else if (obj.target !== null &&
        //     obj.target._objects /* &&
        //         obj.target._objects.length > 2 && obj.target._objects[0].type !== "image" */) {
        //     isHoverObj = false;
        //     obj.target["cornerStyle"] = "rect"
        //     obj.target["cornerSize"] = 15
        //     obj.target.set("active", false)
        //     obj.target.set("hasRotatingPoint", true)
        //     obj.target.set("hasBorders", true)
        //     obj.target.set("transparentCorners", true)
        //     obj.target.setControlsVisibility({
        //         tl: false,
        //         tr: false,
        //         bl: false,
        //         br: false,
        //         mt: false,
        //         mb: false,
        //         mtr: false,
        //         ml: false,
        //         mr: false
        //     })
        //     canvas.discardActiveObject(obj.target);
        // }
        // canvas.renderAll();
      });

      canvas.on("mouse:up", function (e) {
        isScaling = false;
        isMoving = false;
        isRotating = false;

        if (canvas.getActiveObject() && !isMakingAnswer && !isDoQuiz) {
          // console.log(canvas.getActiveObject());
          var object = canvas.getActiveObject();
          updateLocal(
            pool_data,
            object.objectID,
            object.toObject(customAttributes),
            socket
          );
        }
        // console.log('Event mouse:up Triggered');
      });

      canvas.on("mouse:down", function (obj) {
        if (!isErasing && !isSelecting && !isDrawLine && !isMakingAnswer && !isDoQuiz) {
          if (obj.target && !obj.target.isBackground) {
            if (obj.target.name === "quiz") {
              obj.target.setControlsVisibility({
                tl: false,
                tr: false,
                bl: false,
                br: false,
                mtr: false,
                mb: false,
                mt: false,
                ml: false,
                mr: false
              });
            }
          }
          canvas.renderAll();
        }
        if (isMoving) {
          drawimg = false;
          isLoadDataLocal = true;
          return;
        }

        if (isScaling) {
          drawing = false;
        } else {
          isLoadDataLocal = false;
        }
        if (drawing) {
          mousedown = true;
        }
        if (canvas.getActiveObject()) {
          //console.log(canvas.getActiveObject())
        }
      });

      var lastTimeout = undefined;
      canvas.on("mouse:wheel", function (opt) {
        hidePopupMenu();

        const ZOOM_MAX = 2;
        const ZOOM_MIN = 0.5;
        var delta = opt.e.deltaY;
        var zoom = canvas.getZoom();

        $("#zoom-status").removeClass("hidden");
        $("#zoom-status").text(`${Math.round(zoom * 100) / 100}x`);
        clearTimeout(lastTimeout);
        lastTimeout = setTimeout(() => {
          $("#zoom-status").addClass("hidden");
        }, 3000);

        zoom = zoom * 0.999 ** delta;
        if (zoom > ZOOM_MAX) zoom = ZOOM_MAX;
        if (zoom < ZOOM_MIN) zoom = ZOOM_MIN;

        canvas.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);
        $(".c-zoom").each(function (index) {
          $(this).text(`Current zoom: ${(100 * canvas.getZoom()).toFixed(0)}%`);
        });
        console.log("zoom ", canvas);
        opt.e.preventDefault();
        opt.e.stopPropagation();
      });

      canvas.on("before:path:created", function (opt) {
        var path = opt.path;
        var text = username;
        var fontSize = 10;
        var text = new fabric.Text(text, {
          angle: 0,
          fontSize: fontSize,
          top: path.top - 10,
          left: path.left - 10,
          fill: getColor(),
        });
        var objs = [path, text];
        var alltogetherObj = new fabric.Group(objs, {
          originX: "center",
          originY: "center",
        });
        canvas.add(alltogetherObj);
        lastObject = alltogetherObj;
        if (!isDrawMovingPath) {
          setDefaultAttributes(alltogetherObj);
          startActiveObject(alltogetherObj);
          emitEvent();
        }
      });

      canvas.on("path:created", function (opt) {
        canvas.remove(opt.path);
      });

      // canvas.on('before:render', function () {

      // })

      canvas.on("object:added", function (obj) {
        if (obj.target && !obj.target.isBackground) {
          if (obj.target.name === undefined) {
            return
          }
          if (obj.target.name.startsWith("quiz-multipleObj") || obj.target.name === "question-multipleObj") {
            obj.target.setControlsVisibility({
              tl: true,
              tr: true,
              bl: true,
              br: true,
              mtr: true,
              mb: true,
              mt: true,
              ml: true,
              mr: true,
            });
          }
          else if (
            obj.target.name != "curve-point" &&
            // obj.target.name != 'lineConnect' &&
            obj.target.name != "grid" &&
            !isDrawLine &&
            !quizMode &&
            obj.target.name != "textBoxEditor" &&
            obj.target.name !== "line-style"
          ) {
            obj.target.setControlsVisibility({
              tl: true,
              tr: true,
              bl: true,
              br: true,
              mtr: true,
              mb: true,
              mt: true,
              ml: true,
              mr: true,
            });
          } else {
            obj.target.setControlsVisibility({
              tl: false,
              tr: false,
              bl: false,
              br: false,
              mtr: false,
              mb: false,
              mt: false,
              ml: false,
              mr: false,
            });
          }
        }
      });

      function onChange(p) {
        if (p.target._objects.length > 2) {
          if (p.target.scaleX < 1)
            p.target._objects[2].scaleX = 1 + (1 - p.target.scaleX);
          else p.target._objects[2].scaleX = 1 / p.target.scaleX;
          if (p.target.scaleY < 1)
            p.target._objects[2].scaleY = 1 + (1 - p.target.scaleY);
          else p.target._objects[2].scaleY = 1 / p.target.scaleY;
        } else {
          if (p.target.scaleX < 1)
            p.target._objects[1].scaleX = 1 + (1 - p.target.scaleX);
          else p.target._objects[1].scaleX = 1 / p.target.scaleX;
          if (p.target.scaleY < 1)
            p.target._objects[1].scaleY = 1 + (1 - p.target.scaleY);
          else p.target._objects[1].scaleY = 1 / p.target.scaleY;
        }

        canvas.renderAll();
      }

      canvas.on("mouse:down", function (e) {
        if (e.button === 1) {
          if (!drawing) {
            isDraging = true;
            init_position[0] = e.pointer.x;
            init_position[1] = e.pointer.y;
          }
        }
        // if(e.button === 2) {
        //     console.log("middle click");
        // }
        if (e.button === 3) {
        }
      });

      canvas.on("mouse:up", function (e) {
        isDraging = false;
        isSelecting = false;
      });

      canvas.on("mouse:move", function (options) {
        var pointer = canvas.getPointer(options.e);
        if (currentLine) {
          currentLine.set({ x2: pointer.x, y2: pointer.y });
          canvas.renderAll();
          return
        }
        canvas.renderAll();

        if (
          isDraging &&
          !drawing &&
          !isMoving &&
          !isScaling &&
          !isRotating &&
          !options.target &&
          !isSelecting &&
          !isDrawLine &&
          !isGroup
        ) {
          const x = options.pointer.x - init_position[0];
          const y = options.pointer.y - init_position[1];
          // const delX = (canvas.getLeft() * canvas.getScale() + x) / (canvas.width * canvas.getScale())
          // const delY = (canvas.getTop() * canvas.getScale() + y) / (canvas.height * canvas.getScale())
          // console.log('x, y, dx, dy', x, y, delX, delY, canvas.getScale());

          // if (delX < 2.25 && delX > -1.25
          //     && delY < 2.25 && delY > -1.25
          // ) {
          hidePopupMenu();

          let delta = new fabric.Point(x, y);
          canvas.relativePan(delta);

          init_position[0] = options.pointer.x;
          init_position[1] = options.pointer.y;
          // }
        }
      });

      $(function () {
        $("#goRight").click(function () {
          var units = 10;
          var delta = new fabric.Point(units, 0);
          canvas.relativePan(delta);
        });

        $("#goLeft").click(function () {
          var units = 10;
          var delta = new fabric.Point(-units, 0);
          canvas.relativePan(delta);
        });

        $("#goUp").click(function () {
          var units = 10;
          var delta = new fabric.Point(0, -units);
          canvas.relativePan(delta);
        });

        $("#goDown").click(function () {
          var units = 10;
          var delta = new fabric.Point(0, units);
          canvas.relativePan(delta);
        });

        initCanvas(canvas).renderAll();

        // canvas.on('after:render', function () {

        // });

        canvas.on("mouse:up", function () {
          if (drawing && mousedown && !isDrawMovingPath) {
            mousedown = false;
            // emitEvent()
          }

          // this for draw line
          // if (isDrawLine) {
          //     isDown = false;
          //     drawLine.setCoords();
          //     canvas.setActiveObject(drawLine).renderAll();
          // }
        });

        //dynamically resize the canvas on window resize
        $(window)
          .on("resize", function () {
            w = div.width();
            h = div.height();
            canvas.setHeight(h);
            canvas.setWidth(w);
          })
          .on("keydown", function (e) {
            if (e.keyCode === 46) {
              //delete key
              if (!$(".text-edit").hasClass("hidden")) {
                $(".text-edit").addClass("hidden");
              }
              $("#edit-form").css({ visibility: "hidden" });
              // $('#sub-menu').slideUp()
              // $('#path-menu').slideUp()

              deleteObjects(canvas.getActiveObjects());
            }
            if (e.keyCode === 16) {
              // shift key
              isSelecting = true;
            }

            if (e.keyCode === 40) {
              //move up
              var units = 10;
              var delta = new fabric.Point(0, -units);
              canvas.relativePan(delta);
            }

            if (e.keyCode === 38) {
              //move down
              var units = 10;
              var delta = new fabric.Point(0, units);
              canvas.relativePan(delta);
            }

            if (e.keyCode === 37) {
              //move right
              var units = 10;
              var delta = new fabric.Point(units, 0);
              canvas.relativePan(delta);
            }

            if (e.keyCode === 39) {
              //move left
              var units = 10;
              var delta = new fabric.Point(-units, 0);
              canvas.relativePan(delta);
            }

            if (e.keyCode === 17) {
              // ctrl key check for ctrl + c/v
              ctrlDown = true;
            }

            if (!isEditText && ctrlDown && e.keyCode === 67) {
              // ctrl + c
              console.log(isEditText);
              copyObjects();
            }

            if (!isEditText && ctrlDown && e.keyCode === 86) {
              // ctrl + v
              console.log(isEditText);
              pasteObjects();
            }
          })
          .on("keyup", function (e) {
            if (e.keyCode === 17) {
              // remove checking ctrl + c/v
              ctrlDown = false;
            }
          });

        //Set Brush Size
        $(".btn-pencil").on("click", function () {
          $(".btn-pencil").removeClass("active");
          $(this).addClass("active");
          let val = $(this).attr("data-pencil");
          // console.log(val);
          setBrush({ width: val });
        });

        //Set brush color
        $(".btn-color").on("click", function () {
          let val = $(this).attr("data-color");
          console.log(val);
          activeColor = val;
          $("#brushColor").val(val);
          setBrush({ color: val });
        });

        $("#brushColor").on("change", function () {
          let val = $(this).val();
          activeColor = val;
          setBrush({ color: val });
        });

        $("#omegaSymbol").on("click", function () {
          if ($(this).hasClass("active")) {
            $("#listOfSymbol").removeClass("hidden");
          } else {
            $("#listOfSymbol").addClass("hidden");
          }
        });

        $("#svg").on("click", function () {
          if ($(this).hasClass("active")) {
            $("#listIconSVG").removeClass("hidden");
          } else {
            $("#listIconSVG").addClass("hidden");
          }
        });
        // $("#opencv").on("click", function () {
        //   if ($(this).hasClass("active")) {
        //     $("#listIconOpencv").removeClass("hidden");
        //   } else {
        //     $("#listIconOpencv").addClass("hidden");
        //   }
        // });

        $("#zoomIn").on("click", function () {
          canvas.setZoom(canvas.getZoom() * 1.1);
          $(".c-zoom").each(function (index) {
            $(this).text(`Current zoom: ${(100 * canvas.getZoom()).toFixed(0)}%`);
          });
        });

        $("#zoomOut").on("click", function () {
          canvas.setZoom(canvas.getZoom() / 1.1);
          $(".c-zoom").each(function (index) {
            $(this).text(`Current zoom: ${(100 * canvas.getZoom()).toFixed(0)}%`);
          });
        });

        // function event for draw line
        function addDrawLineListener() {
          canvas.on("mouse:up", onDrawLineMouseUp);
          canvas.on("mouse:down", onDrawLineMouseDown);
          canvas.on("mouse:dblclick", onDrawLineDblClick);
          canvas.on("mouse:move", onDrawLineMouseMove);
        }

        function removeDrawLineListener() {
          canvas.off("mouse:up", onDrawLineMouseUp);
          canvas.off("mouse:down", onDrawLineMouseDown);
          canvas.off("mouse:dblclick", onDrawLineDblClick);
          canvas.off("mouse:move", onDrawLineMouseMove);
        }

        function setSelectDrawLine(value) {
          canvas.forEachObject(function (object) {
            object.selectable = value;
            object.setCoords();
          });
          canvas.selection = value;
          // if (lineType == 'multiple' || lineType == 'dash') {

          // }
          canvas.renderAll();
        }

        function onDrawLineMouseUp(options) {
          isCurving = false;
          if (lineType == "waving" || lineType == "simple") {
            isDown = false;
            drawLine.setCoords();
            setDefaultAttributes(drawLine);
            startActiveObject(drawLine);
            drawLine.set({
              name: "line-style",
              lineType,
            });

            canvas.setActiveObject(drawLine).renderAll();
            drawLine = null;
            isLoadDataLocal = false;
            emitEvent();

            $("#lines").click();
          }
          else if (lineType == "curve") {
            const pointer = canvas.getPointer(options.e);

            drawLine = new fabric.Path("M 0 0 Q 100 100 200 0", {
              stroke: "black",
              hasControls: false,
              hasBorders: false,
              strokeWidth: 1,
              fill: "",
            });

            drawLine.path[0] = ["M", pointer.x, pointer.y];
            drawLine.path[1] = ["Q", pointer.x, pointer.y, pointer.x, pointer.y];

            if (nextPointStart) {
              drawLine.path[0] = ["M", nextPointStart.x, nextPointStart.y];
              drawLine.path[1] = [
                "Q",
                nextPointStart.x,
                nextPointStart.y,
                nextPointStart.x,
                nextPointStart.y,
              ];
            }
            lineArray.push(drawLine);
            canvas.add(drawLine);
            canvas.renderAll();
          }

          var time = 500;

          if (lineType === "dot") {
            time = 1000;
          }
          drawLineTimeId = setTimeout(() => {
            onDrawLineDblClick()
          }, time);
        }

        function onDrawLineMouseDown(options) {
          // fake double click event for ipad,...
          if (isDrawingLine) {
            onDrawLineDblClick();
            isDrawingLine = false;
          } else {
            isDrawingLine = true;
            drawingLineTimeId = setTimeout(() => {
              isDrawingLine = false;
            }, 500);
          }

          if (drawLineTimeId) {
            clearTimeout(drawLineTimeId);
            drawLineTimeId = null;
          }

          isDown = true;
          const pointer = canvas.getPointer(options.e);
          const points = [pointer.x, pointer.y, pointer.x, pointer.y];

          if (lineType == "multiple") {
            drawLine = new fabric.Line(points, {
              stroke: "black",
              hasControls: false,
              hasBorders: false,
              lockMovementX: false,
              lockMovementY: false,
              hoverCursor: "default",
              selectable: false,
            });

            lineArray.push(drawLine);
            canvas.add(drawLine);
            // isLoadDataLocal = false;
            // emitEvent();
          } else if (lineType == "dash") {
            drawLine = new fabric.Line(points, {
              stroke: "black",
              hasControls: false,
              hasBorders: false,
              lockMovementX: false,
              lockMovementY: false,
              hoverCursor: "default",
              strokeDashArray: [5, 5],
              selectable: false,
            });

            lineArray.push(drawLine);
            canvas.add(drawLine);
            isLoadDataLocal = false;
            emitEvent();
          } else if (lineType == "simple") {
            drawLine = new fabric.LineWithArrow(points, {
              strokeWidth: 1,
              stroke: "#000",
            });

            canvas.add(drawLine);
          } else if (lineType == "waving") {
            ++typesOfLinesIter;
            typesOfLinesIter %= typesOfLines.length;

            drawLine = new fabric.WavyLineWithArrow(points, {
              strokeWidth: 1,
              stroke: "#000",
              funct: typesOfLines[typesOfLinesIter],
            });

            canvas.add(drawLine);
          } else if (
            lineType == "dot" &&
            (!options.target ||
              (options.target && options.target.name != "dot-line"))
          ) {
            var point = new fabric.Circle({
              left: pointer.x,
              top: pointer.y,
              radius: 8,
              fill: "green",
              originX: "center",
              originY: "center",
              hasControls: false,
              name: "dot-line",
            });

            lineArray.push(point);
            canvas.add(point);
            pointArray.push(point);

            const length = pointArray.length;
            if (length > 1) {
              const line = new fabric.Line(
                [
                  pointArray[length - 2].left,
                  pointArray[length - 2].top,
                  pointArray[length - 1].left,
                  pointArray[length - 1].top,
                ],
                {
                  strokeWidth: 2,
                  fill: "black",
                  stroke: "black",
                  originX: "center",
                  originY: "center",
                  selectable: false,
                }
              );

              pointArray[length - 2].line2 = line;
              pointArray[length - 1].line1 = line;

              lineArray.unshift(line);
              canvas.add(line);
              canvas.sendToBack(line);
            }

            point.on("moving", function () {
              if (point.line1) {
                point.line1.set({
                  x2: point.left,
                  y2: point.top,
                });
              }
              if (point.line2) {
                point.line2.set({
                  x1: point.left,
                  y1: point.top,
                });
              }
            });
          } else if (lineType == "curve") {
            nextPointStart = pointer;
            isCurving = true;
          }
          canvas.requestRenderAll();
        }

        function onDrawLineDblClick() {
          if (drawingLineTimeId) {
            clearTimeout(drawingLineTimeId);
            drawingLineTimeId = null;
          }

          if (drawLineTimeId) {
            clearTimeout(drawLineTimeId);
            drawLineTimeId = null;
          }

          if (
            lineType == "multiple" ||
            lineType == "dash" ||
            lineType == "curve" ||
            lineType == "dot"
          ) {
            if (drawLine) drawLine.setCoords();
            isDown = false;
            isDrawingLine = false;
            drawLine = null;
            if (lineArray.length > 0) {
              lineArray.forEach((line) => canvas.remove(line));

              let lines;
              if (lineType == "curve") {
                lines = new fabric.Path("M 0 0", {
                  fill: null,
                  selectable: true,
                  stroke: "#000",
                  strokeWidth: 1,
                });

                const path = [];

                lineArray.forEach((line, index) => {
                  if (index == 0) path.push(line.path[0]);

                  path.push(line.path[1]);

                  // if(index == lineArray.length - 1) lines.path.push([ 'L', line.path[ 1 ][ 3 ], line.path[ 1 ][ 4 ] ]);
                });

                lines._setPath(path);
              } else {
                lines = new fabric.Group(lineArray, {
                  objectID: randomID(),
                  name: "line-style",
                  lineType,
                });
              }
              if (lineType == "dash") lines.lineStyle = "dash";

              setDefaultAttributes(lines);
              startActiveObject(lines);
              canvas.add(lines);
              isLoadDataLocal = false;
              emitEvent();

              lineArray = [];
            }

            if (pointArray.length > 0) pointArray = [];
            canvas.requestRenderAll();

            $("#lines").click();
          }
        }

        function onDrawLineMouseMove(o) {
          if (drawLineTimeId) {
            clearTimeout(drawLineTimeId);
            drawLineTimeId = null;
          }

          if (!isDown) return;
          var pointer = canvas.getPointer(o.e);
          if (drawLine && lineType == "curve") {
            if (isCurving) {
              drawLine.path[1][1] = pointer.x;
              drawLine.path[1][2] = pointer.y;
            } else {
              drawLine.path[1][3] = pointer.x;
              drawLine.path[1][4] = pointer.y;
            }
          } else if (lineType == "dot" && o.target) {
            // if (o.target.name == 'dot-line') {
            //     const obj = o.target;
            //     obj.line1.set({
            //         x2: obj.
            //         y2:
            //     })
            // }
          } else if (
            // lineType == 'multiple' || lineType == 'waving' || lineType == 'dash' &&
            drawLine
          ) {
            drawLine.set({
              x2: pointer.x,
              y2: pointer.y,
            });
          }
          canvas.requestRenderAll();
        } //end mouse:move

        $("#simple-line").on("click", function () {
          if ($(this).hasClass("active")) {
            lineType = "";
            $(this).removeClass("active");
          } else {
            $(".draw-line.active").removeClass("active");
            $(this).addClass("active");
            lineType = "simple";
          }
        });

        $("#waving-line").on("click", function () {
          if ($(this).hasClass("active")) {
            lineType = "";
            $(this).removeClass("active");
          } else {
            $(".draw-line.active").removeClass("active");
            $(this).addClass("active");
            lineType = "waving";
          }
        });

        $("#multiple-line").on("click", function () {
          if ($(this).hasClass("active")) {
            lineType = "";
            $(this).removeClass("active");
          } else {
            $(".draw-line.active").removeClass("active");
            $(this).addClass("active");
            lineType = "multiple";
          }
        });

        $("#dash-line").on("click", function () {
          if ($(this).hasClass("active")) {
            lineType = "";
            $(this).removeClass("active");
          } else {
            $(".draw-line.active").removeClass("active");
            $(this).addClass("active");
            lineType = "dash";
          }
        });

        $("#curve-line").on("click", function () {
          if ($(this).hasClass("active")) {
            lineType = "";
            $(this).removeClass("active");
          } else {
            $(".draw-line.active").removeClass("active");
            $(this).addClass("active");
            lineType = "curve";
          }
        });

        $("#dot-line").on("click", function () {
          if ($(this).hasClass("active")) {
            lineType = "";
            $(this).removeClass("active");

            if (lineArray.length > 0) {
              lineArray.forEach((line) => canvas.remove(line));

              const lines = new fabric.Group(lineArray, {
                objectID: randomID(),
                name: "line-style",
              });

              setDefaultAttributes(lines);
              startActiveObject(lines);
              canvas.add(lines);
              isLoadDataLocal = false;
              emitEvent();

              lineArray = [];
            }

            if (pointArray.length > 0) pointArray = [];
            canvas.requestRenderAll();
          } else {
            $(".draw-line.active").removeClass("active");
            $(this).addClass("active");
            lineType = "dot";
          }
        });

        $(".draw-line").on("click", function (e) {
          if ($(".draw-line.active").length > 0 && !isDrawLine) {
            isDrawLine = true;

            addDrawLineListener();
            setSelectDrawLine(false);

            hidePopupMenu();
          } else if ($(".draw-line.active").length == 0 && isDrawLine) {
            isDrawLine = false;

            removeDrawLineListener();
            setSelectDrawLine(true);

            if (
              (lineType == "multiple" ||
                lineType == "dash" ||
                lineType == "curve") &&
              drawLine
            ) {
              var canvas_objects = canvas._objects;
              var sel = canvas_objects[canvas_objects.length - 1]; //Get last object
              canvas.remove(sel);
            }
          }
          // console.log(canvas);
        });

        $("#lines").on("click", function () {
          if (!$("#lines").hasClass("active")) {
            if ($(".draw-line.active").length > 0)
              $(".draw-line.active")[0].click();
          }
        });

        $("#reset").on("click", function () {
          canvas.setZoom(1);
          $(".c-zoom").each(function (index) {
            $(this).text(`Current zoom: ${(100 * canvas.getZoom()).toFixed(0)}%`);
          });
          canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
        });

        $("#lineStyle").on("change", function () {
          if (activeObject.name == "line-style" || activeObject.type === "path") {
            if (this.value == "solid" || this.value == "dash") {
              activeObject.lineStyle = this.value;
              let strokeArr = [0, 0];
              if (this.value == "dash") strokeArr = [5, 5];

              if (activeObject._objects) {
                activeObject._objects?.forEach((obj) => {
                  if (obj.type == "line" || obj.type == "path") {
                    obj.strokeDashArray = strokeArr;
                    obj.stroke = "#000";
                  }
                });
              } else {
                activeObject.strokeDashArray = strokeArr;
                activeObject.stroke = "#000";
              }
              activeObject.shadow = null;
            } else if (this.value == "shadow") {
              const shadow = new fabric.Shadow({
                blur: 5,
                color: "#000",
                offsetX: 0,
                offsetY: 0,
              });

              activeObject.set({
                shadow: shadow,
              });
              if (activeObject._objects) {
                activeObject._objects.forEach((obj) => {
                  if (obj.type == "line" || obj.type == "path") {
                    obj.stroke = "#ddd";
                    obj.strokeDashArray = [0, 0];
                  }
                });
              } else {
                activeObject.stroke = "#ddd";
                activeObject.strokeDashArray = [0, 0];
              }
            }
            updateLocal(
              pool_data,
              activeObject.objectID,
              activeObject.toObject(customAttributes),
              socket,
              false
            );
            canvas.requestRenderAll();
          }
        });

        // quiz variables
        let size;
        const grid = 40;
        const inset = 20;

        const viewColor = "#71eb7f";
        const successColor = "#66f079";
        const wrongColor = "#ff7070";

        const answerQuiz = $("#quiz-answer")[0];
        const viewAnswerQuiz = $("#quiz-view-answer")[0];
        const doQuiz = $("#quiz-doquiz")[0];
        const checkQuiz = $("#quiz-check")[0];
        const quizInputFile = $("#quiz-input-file")[0];
        const dndItem = $("#dndItem")[0];

        let quiz = [];
        let table;

        // setting
        let quizSetting = {
          textColor: "#000000",
          bgColor: "#ffffff",
          bgSelectColor: "#cccccc",
          textSelectColor: "#000000",
          selectSound: "assets/song/keypress.mp3",
          correctSound: "assets/song/correct.mp3",
          incorrectSound: "assets/song/incorrect.mp3",
        };

        let questions = [];

        function createTableObject(questionValue) {
          const questionArr = questionValue.split("\n");
          const table = [];

          size = questionArr.length;

          for (var i = 0; i < size; i++) {
            table.push(
              new fabric.Text(String(i), {
                left: inset / 2 + (i + 0.5) * grid,
                top: 0,
                fontSize: 14,
                name: "quiz-index",
                selectable: false,
              })
            );

            table.push(
              new fabric.Text(String(i), {
                left: 0,
                top: inset / 2 + (i + 0.5) * grid,
                fontSize: 14,
                textAlign: "right",
                name: "quiz-index",
                selectable: false,
              })
            );
          }

          questionArr.map((question, index) => {
            for (let i = 0; i < question.length && i < 15; i++) {
              const newCell = createCell(i, index, question[i]);

              setDefaultAttributes(newCell);
              startActiveObject(newCell);
              newCell.set({
                cellID: `${i}-${index}`,
                colorSelected: quizSetting.bgSelectColor,
                colorUnselected: quizSetting.bgColor,
                soundSelected: quizSetting.selectSound,
                soundUnselected: quizSetting.selectSound,
              });

              table.push(newCell);
            }
          });

          return table;
        }

        function createCell(idX, idY, character) {
          const rect = new fabric.Rect({
            left: idX * grid + inset,
            top: idY * grid + inset,
            width: grid,
            height: grid,
            fill: quizSetting.bgColor,
            stroke: "#333",
            strokeWidth: 2,
            originX: "left",
            originY: "top",
            centeredRotation: true,
          });

          const textbox = new fabric.Text(character, {
            fontSize: 16,
            fontFamily: "Time New Roman",
            fontStyle: "normal",
            originX: "center",
            originY: "center",
            fill: quizSetting.textColor,
            left: rect.left + rect.width / 2,
            top: rect.top + rect.height / 2,
            textAlign: "center",
          });

          const cell = new fabric.Group([rect, textbox], {
            top: rect.top,
            left: rect.left,
            selectable: false,
            text: character,
            objectID: randomID(),
            name: "quiz-selectObj",
          });

          return cell;
        }

        function createTableEmpty(size) {
          const table = [];
          for (var i = 0; i < size; i++) {
            table.push(
              new fabric.Text(String(i), {
                left: inset / 2 + (i + 0.5) * grid,
                top: 0,
                fontSize: 14,
                name: "quiz-index",
                selectable: false,
              })
            );

            table.push(
              new fabric.Text(String(i), {
                left: 0,
                top: inset / 2 + (i + 0.5) * grid,
                fontSize: 14,
                textAlign: "right",
                name: "quiz-index",
                selectable: false,
              })
            );
          }

          var questionArr = Array.from(Array(size), () => new Array(size));

          questionArr.map((question, index) => {
            for (let i = 0; i < question.length && i < 15; i++) {
              const newCell = createCellEmpty(i, index, question[i]);

              setDefaultAttributes(newCell);
              startActiveObject(newCell);
              newCell.set({
                colorSelected: quizSetting.bgSelectColor,
                colorUnselected: quizSetting.bgColor,
                soundSelected: quizSetting.selectSound,
                soundUnselected: quizSetting.selectSound,
              });

              table.push(newCell);
            }
          });

          return table;
        }

        function createCellEmpty(idX, idY, character) {
          const rect = new fabric.Rect({
            left: idX * grid + inset,
            top: idY * grid + inset,
            width: grid,
            height: grid,
            fill: quizSetting.bgColor,
            stroke: "#333",
            strokeWidth: 2,
            originX: "left",
            originY: "top",
            centeredRotation: true,
          });

          const textbox = new fabric.Textbox("", {
            fontSize: 16,
            fontFamily: "Time New Roman",
            fontStyle: "normal",
            originX: "center",
            originY: "center",
            fill: quizSetting.textColor,
            left: rect.left + rect.width / 2,
            top: rect.top + rect.height / 2,
            textAlign: "center",
          });

          const cell = new fabric.Group([rect, textbox], {
            top: rect.top,
            left: rect.left,
            subTargetCheck: false,
            text: character,
            objectID: randomID(),
            name: "quiz-inputObj",
          });

          return cell;
        }

        function createTable(objs) {
          table = new fabric.Group(objs, {
            top: 50,
            left: 250,
            name: "quiz",
            selectable: true,
            subTargetCheck: true,
            selectSound: new Audio(quizSetting.selectSound),
            correctSound: new Audio(quizSetting.correctSound),
            incorrectSound: new Audio(quizSetting.incorrectSound),
          });

          table.selectSound.volume = 0.6;
          table.correctSound.volume = 0.6;
          table.incorrectSound.volume = 0.6;

          return table;
        }

        function createAnswerTextBox(obj) {
          var textbox = new fabric.Textbox("", {
            fontSize: 24,
            fontFamily: "Time New Roman",
            originX: "center",
            originY: "center",
            left: obj.left,
            top: obj.top,
            fill: "#333",
            textAlign: "center",
          });

          let group = new fabric.Group([obj, textbox], {
            objectID: randomID(),
            top: 150,
            left: 250,
            name: "quiz-inputObj",
            subTargetCheck: false,
          });

          setDefaultAttributes(group);
          startActiveObject(group);

          canvas.add(group);
          return group;
        }

        function answerRect(e) {
          var rect = new fabric.Rect({
            width: 40,
            height: 40,
            stroke: "#000",
            strokeWidth: 1,
            fill: "#fff",
            originX: "center",
            originY: "center",
            rx: 0,
            ry: 0,
          });

          rect.on("scaling", function () {
            this.set({
              width: this.width * this.scaleX,
              height: this.height * this.scaleY,
              scaleX: 1,
              scaleY: 1,
            });
          });

          return createAnswerTextBox(rect);
        }

        function loadQuiz(data) {
          questions = data.questions;
          correctAnswers = data.correctAnswers;
          quizSetting = data.setting;

          isCreateQuiz = true;
          isCreateAnswer = true;

          var quizType = data.gameType;
          // $("#quiz-type").val(data.gameType);
          var quizTypeCurrent = $("#quiz-type").val();
          if (quizType != quizTypeCurrent) {
            alert("Invalid Quiz game type!");
          }

          const canvasObj = JSON.parse(data.canvas);

          if (quizType == "quiz-11") {
            const correctAnswers = data.correctAnswers;
            console.log("correctAnswers", correctAnswers);
            canvas.loadFromJSON(canvasObj, function () {
              isCreateAnswer = false
              canvas.renderAll();
              canvas.getObjects().forEach(function (obj) {
                //console.log("obj name", obj.name);
                // checkif obj.name in correctAnswers
                const found = correctAnswers.find((item) => item.name == obj.name);
                if (found) {
                  console.log("found", found);
                  obj.set({
                    result: found.value,
                    objectType: "answer"
                  });
                }
                startActiveObject(obj);
                obj.on("mouseup", function (e) {
                  if (e.button === 3) {
                    selectedObject = obj;
                    showPopUpMenuQuiz(obj);
                    //activeObject = rect
                    canvas.setActiveObject(obj);
                  }
                });
                obj.on("movedown", function (e) {
                  hidePopupMenu();
                });
              });
            })
          }
          else if (quizType == "quiz-4") {
            const tableObjs = [];
            const tableObj = canvasObj.objects[0];
            if (data.canvas && data.questions && data.correctAnswers) {
              fabric.util.enlivenObjects(
                tableObj.objects,
                function (enlivenedObjects) {
                  enlivenedObjects.forEach(function (obj) {
                    if (obj.name == "quiz-selectObj") {
                      startActiveObject(obj);
                      obj.set({
                        fixed: true,
                        soundSelected: quizSetting.selectSound,
                        soundUnselected: quizSetting.selectSound,
                      });
                      obj._objects[0].set({
                        fill: obj.colorUnselected,
                      });
                      obj._objects[1].set({
                        fill: obj.colorText,
                      });

                      tableObjs.push(obj);
                    } else if (obj.name == "quiz-index") {
                      tableObjs.push(obj);
                    }
                  });
                }
              );

              const title = new fabric.Text("Answer Correct", {
                top: 0,
                left: 30,
                fontSize: 16,
                fontFamily: "Times New Roman",
              });

              const text = correctAnswers.map((item) => item.value).join(" ");

              correctAnswerBox = new fabric.Textbox(text, {
                left: 0,
                top: 40,
                width: 200,
                fontSize: 10,
                fontFamily: "Times New Roman",
                id: "answer-correct-textbox",
              });

              const group = new fabric.Group([title, correctAnswerBox], {
                top: 50,
                left: 50,
                selectable: false,
              });

              canvas.add(group);

              table = createTable(tableObjs);
              canvas.add(table);

              canvas.renderAll();
            } else {
              alert("Invalid Quiz file input!");
            }
          }
          else if (quizType == "quiz-1") {
            const tableObjs = [];
            //const tableObj = canvasObj.objects[0];
            // found index of objectthat has name is "quiz"
            const items = canvasObj.objects;
            const foundIndex = items.findIndex(obj => obj.name === "quiz");
            let index
            if (foundIndex > -1) {
              index = foundIndex
            }
            const tableObj = canvasObj.objects[index];

            if (data.canvas && data.questions && data.correctAnswers) {


              fabric.util.enlivenObjects(
                tableObj.objects,
                function (enlivenedObjects) {
                  enlivenedObjects.forEach(function (obj) {
                    console.log("obj name", obj.name);
                    if (obj.name == "quiz-selectObj") {
                      startActiveObject(obj);
                      obj.set({
                        fixed: true,
                        soundSelected: quizSetting.selectSound,
                        soundUnselected: quizSetting.selectSound,
                      });
                      obj._objects[0].set({
                        fill: obj.colorUnselected,
                      });
                      obj._objects[1].set({
                        fill: obj.colorText,
                      });

                      tableObjs.push(obj);
                    } else if (obj.name == "quiz-index") {
                      tableObjs.push(obj);
                    }
                  });
                }
              );

              const title = new fabric.Text("Answer Correct", {
                top: 0,
                left: 30,
                fontSize: 16,
                fontFamily: "Times New Roman",
              });

              const text = correctAnswers.map((item) => item.value).join(" ");

              correctAnswerBox = new fabric.Textbox(text, {
                left: 0,
                top: 40,
                width: 200,
                fontSize: 10,
                fontFamily: "Times New Roman",
                id: "answer-correct-textbox",
              });

              const group = new fabric.Group([title, correctAnswerBox], {
                top: 50,
                left: 50,
                selectable: false,
              });

              canvas.add(group);

              table = createTable(tableObjs);
              canvas.add(table);

              fabric.util.enlivenObjects(
                canvasObj.objects,
                function (enlivenedObjects) {
                  enlivenedObjects.forEach(function (obj) {
                    var quizType = $("#quiz-type").val();
                    if (obj.isDrag === true || obj.isDrop === true) {
                      countItem++;
                    }
                    else if (obj.type === "image") {
                      fabric.Image.fromURL(obj.src, function (img) {
                        console.log("obj.isBackground", obj.isBackground);
                        console.log("obj pos", obj.pos);
                        img.set({
                          top: obj.top,
                          left: obj.left,
                          width: obj.width,
                          height: obj.height,
                          scaleX: obj.scaleX,
                          scaleY: obj.scaleY,
                        });
                        if (quizType == "quiz-1") {
                          img.set({
                            name: obj.name,
                            id: obj.id,
                            port1: obj.port1,
                            port2: obj.port2,
                            idObject1: obj.idObject1,
                            idObject2: obj.idObject2,
                            objectID: obj.objectID,
                            port: obj.port,
                            lineID: obj.lineID,
                            hasShadow: obj.hasShadow,
                            shadowObj: obj.shadowObj,
                            pos: obj.pos,
                            snap: obj.snap,
                            readySound: obj.readySound,
                            sound: obj.sound,
                            line2: obj.line2,
                            isDrop: obj.isDrop,
                            isDrag: obj.isDrag,
                            isBackground: obj.isBackground,
                            answerId: obj.answerId,
                            top: obj.top,
                          });
                        }

                        startActiveObject(img);
                        //canvas.sendToBack(img);
                        canvas.add(img);
                        img.sendToBack();
                      });
                    } else {
                      obj.hasBorders = obj.hasControls = false;

                      if (obj.name === "curve-point") {
                        obj.on("moving", function () {
                          const line = canvas
                            .getObjects()
                            .find(
                              (item) =>
                                item.type === "path" &&
                                item.objectID === obj.lineID
                            );

                          if (line) {
                            line.path[1][1] = obj.left;
                            line.path[1][2] = obj.top;
                          }
                        });
                        canvas.add(obj);
                      } else if (obj.type === "path") {
                        obj._setPath(obj.path);
                        obj.selectable = false;
                        canvas.add(obj);
                      }
                      //
                      else if (obj.name === "quiz-selectObj") {
                        console.log("quiz-index")
                      }
                      // 
                      else if (obj.name === "quiz-index") {
                        console.log("quiz-index")
                      }
                      else if (obj.name === "quiz") {
                        console.log("quiz222")
                      }
                      else if (obj.type === "image") {
                        console.log("name")
                      }
                      //}
                      else {
                        //canvas.add(obj);
                      }
                    }
                  });
                }
              )


              canvas.renderAll();
              console.log("canvas hien thi", canvas)
            } else {
              alert("Invalid Quiz file input!");
            }
          } else if (quizType == "quiz-2") {
            if (data.canvas && data.questions && data.correctAnswers) {
              fabric.util.enlivenObjects(
                canvasObj.objects,
                function (enlivenedObjects) {
                  enlivenedObjects.forEach(function (obj) {
                    if (obj.name == "quiz-inputObj") {
                      startActiveObject(obj);
                      obj.set({
                        fixed: true,
                      });

                      canvas.add(obj);
                    }
                  });
                }
              );

              const title = new fabric.Text("Answer Correct", {
                top: 0,
                left: 30,
                fontSize: 16,
                fontFamily: "Times New Roman",
              });

              const text = correctAnswers
                .map((item) => `${item.id} - ${item.value}`)
                .join(", ");

              correctAnswerBox = new fabric.Textbox(text, {
                left: 0,
                top: 40,
                width: 200,
                fontSize: 10,
                fontFamily: "Times New Roman",
                id: "answer-correct-textbox",
              });

              const group = new fabric.Group([title, correctAnswerBox], {
                top: 50,
                left: 50,
                selectable: false,
              });

              canvas.add(group);

              table = createTable([]);
              canvas.add(table);

              canvas.renderAll();
            } else {
              alert("Invalid Quiz file input!");
            }
          } else if (quizType == "quiz-3") {
            if (
              data.canvas &&
              data.startingCanvas &&
              data.questions &&
              data.correctAnswers
            ) {
              fabric.util.enlivenObjects(
                canvasObj.objects,
                function (enlivenedObjects) {
                  enlivenedObjects.forEach(function (obj) {
                    console.log("obj", obj);
                    var quizType = $("#quiz-type").val();
                    if (obj.isDrag === true || obj.isDrop === true) {
                      countItem++;
                    }
                    if (obj.type === "group") {
                      if (obj._objects.length > 0) {
                        function createQuizTextBox(
                          obj,
                          isAnswerCorrect,
                          isUserResult
                        ) {
                          if (isAnswerCorrect) {
                            obj._objects.forEach((child) => {
                              if (child.id == "answer-correct-textbox") {
                                correctAnswerBox = child;
                                if (quizType == "quiz-3") {
                                  console.log(correctAnswerBox);
                                  correctAnswerMatch =
                                    correctAnswerBox.text.split(", ");
                                }
                              }
                            });
                          }
                          if (isUserResult) {
                            obj._objects.forEach((child) => {
                              if (child.id == "answer-correct-textbox") {
                                userAnswerBox = child;
                                if (quizType == "quiz-3") {
                                  console.log(correctAnswerBox);
                                  userResult = userAnswerBox.text.split(", ");
                                }
                              }
                            });
                          }
                        }
                        obj._objects.forEach((child) => {
                          if (child.text == "Answer Correct") {
                            createQuizTextBox(obj, true, false);
                          }
                          // if(child.text == "User Answer") {
                          //   createQuizTextBox(obj, false, true);
                          // }
                        });
                      }
                      startActiveObject(obj);
                      canvas.add(obj);
                    } else if (obj.type === "image") {
                      fabric.Image.fromURL(obj.src, function (img) {
                        img.set({
                          top: obj.top,
                          left: obj.left,
                          width: obj.width,
                          height: obj.height,
                          scaleX: obj.scaleX,
                          scaleY: obj.scaleY,
                        });
                        if (quizType == "quiz-3") {
                          img.set({
                            name: obj.name,
                            id: obj.id,
                            port1: obj.port1,
                            port2: obj.port2,
                            idObject1: obj.idObject1,
                            idObject2: obj.idObject2,
                            objectID: obj.objectID,
                            port: obj.port,
                            lineID: obj.lineID,
                            hasShadow: obj.hasShadow,
                            shadowObj: obj.shadowObj,
                            pos: obj.pos,
                            snap: obj.snap,
                            readySound: obj.readySound,
                            sound: obj.sound,
                            line2: obj.line2,
                            isDrop: obj.isDrop,
                            isDrag: obj.isDrag,
                            isBackground: obj.isBackground,
                            answerId: obj.answerId,
                          });
                        }

                        startActiveObject(img);

                        canvas.add(img);

                      });
                    } else {
                      obj.hasBorders = obj.hasControls = false;

                      if (obj.name === "curve-point") {
                        obj.on("moving", function () {
                          const line = canvas
                            .getObjects()
                            .find(
                              (item) =>
                                item.type === "path" &&
                                item.objectID === obj.lineID
                            );

                          if (line) {
                            line.path[1][1] = obj.left;
                            line.path[1][2] = obj.top;
                          }
                        });
                      } else if (obj.type === "path") {
                        obj._setPath(obj.path);
                        obj.selectable = false;
                      }
                      canvas.add(obj);
                    }
                  });
                }
              );

              matchQuizData = {
                canvas: data.startingCanvas,
                title: "",
                gameType: quizType,
              };

              isCreateQuiz = true;
              isCreateAnswer = true;
              console.log("canvas quiz3", canvas);
              canvas.renderAll();
            } else {
              alert("Invalid Quiz file input!");
            }
          }
        }

        // load quiz - Kiet edit
        quizInputFile.onchange = function (e) {
          $("#quizs-body li:nth-child(n+4):nth-child(-n+5)").css({
            opacity: "0.5",
            "pointer-events": "none",
          });
          $("#quizs-body li:nth-child(n+7)").css({
            opacity: "1",
            "pointer-events": "auto",
          });

          let reader = new FileReader();

          reader.onload = function (e) {
            // $(".btn-eraser-clear")[0].click();
            // $("#change-eraser")[0].click();
            // $("#reset")[0].click();
            pool_data = pool_data.filter(
              (obj) => obj.layer !== canvas.id || obj.data.name === "grid"
            );
            pool_data = []
            socket.emit("update", pool_data);
            canvas.clear();
            loadLayerCanvasJsonNew(pool_data, canvas);

            const data = JSON.parse(e.target.result);

            socket.emit("loadQuiz", data);
            // $("#quiz")[0].click();
            loadQuiz(data);
          };

          reader.readAsText(e.target.files[0]);
          this.value = "";
        };

        socket.on("loadQuiz", function (data) {
          // $("#quiz")[0].click();
          loadQuiz(data);
          $("#quiz-create").css({ opacity: "0.5", "pointer-events": "none" });
          $("#quizs-body li:nth-child(n+4):nth-child(-n+5)").css({
            opacity: "0.5",
            "pointer-events": "none",
          });
          $("#quizs-body li:nth-child(n+7)").css({
            opacity: "1",
            "pointer-events": "auto",
          });
        })

        dndItem.onchange = function (e) {
          var files = e.target.files,
            imageType = /image.*/;
          const promises = [];
          for (const file of files) {
            let filePromise = new Promise(resolve => {
              if (!file.type.match(imageType)) return;

              countItem++;
              var value = countItem;
              var reader = new FileReader();
              reader.onload = (e) => {
                const id = imageQuizMatchMode(e.target.result, value, true);
                return resolve({ id, value, url: e.target.result });
              };
              reader.readAsDataURL(file);
            });
            promises.push(filePromise);
          }

          Promise.all(promises).then(data => {
            console.log("emit dndItem", data);
            socket.emit("dndItem", data);
          });

          e.target.value = "";
          isCreateQuiz = true;
        };

        socket.on("dndItem", function (data) {
          console.log("on dndItem", { data });
          data.forEach(item => {
            imageQuizMatchMode(item.url, item.value, true, item.id);
          })
          isCreateQuiz = true;
        });

        $("#create-table-empty").on("click", function (e) {
          if (questions.length > 0) questions = [];
          if (correctAnswers.length > 0) correctAnswers = [];

          let tableOld;
          canvas.forEachObject(function (obj) {
            if (obj.name == "quiz") {
              tableOld = obj;
            }
          });
          canvas.remove(tableOld);

          table = createTable(createTableEmpty(15));

          console.log(canvas);
          canvas.add(table);

          isCreateQuiz = true;

          canvas.renderAll();
        });

        $(".close-quiz-modal").on("click", function (e) {
          $("#quiz-modal")[0].style.display = "none";
        });

        $("#open-quiz-modal").on("click", function (e) {
          $("#quiz-modal").css({ display: "block" });
          $("#quizs-body li:nth-child(n+4):nth-child(-n+5)").css({
            opacity: "0.5",
            "pointer-events": "none",
          });
          $("#quizs-body li:nth-child(n+6)").css({
            opacity: "1",
            "pointer-events": "auto",
          });
        });

        $(".close-single-choose-modal").on("click", function (e) {
          $("#single-choose-modal")[0].style.display = "none";
        });

        $("#open-single-choose-modal").on("click", function (e) {
          $("#single-choose-modal").css({ display: "block" });
          $("#quizs-body li:nth-child(n+4):nth-child(-n+5)").css({
            opacity: "0.5",
            "pointer-events": "none",
          });
          $("#quizs-body li:nth-child(n+6)").css({
            opacity: "1",
            "pointer-events": "auto",
          });
        });







        // Function to generate a unique ID
        function generateUniqueId() {
          return 'circle' + new Date().getTime();
        }


        $("#add-option-single-choose").on("click", function (e) {
          console.log("add-option-single-choose");

          const optionsContainer = document.getElementById('answer-options-single-choose-container');

          var newOptionContainer = document.createElement('div');
          newOptionContainer.className = 'answer-option-container';

          var newOptionText = document.createElement('input');
          newOptionText.type = 'text';
          //newOptionText.className = 'form-control';
          newOptionContainer.appendChild(newOptionText);

          var newOptionCheckbox = document.createElement('input');
          newOptionCheckbox.type = 'checkbox';
          newOptionContainer.appendChild(newOptionCheckbox);

          optionsContainer.appendChild(newOptionContainer);
          // Update the correct answer dropdown
          updateCorrectAnswerDropdown();
        });

        function updateCorrectAnswerDropdown() {

        }

        function createQuiz(questionValue) {
          if (questions.length > 0) questions = [];
          if (correctAnswers.length > 0) correctAnswers = [];

          table = createTable(createTableObject(questionValue));

          console.log(canvas);
          canvas.add(table);

          isCreateQuiz = true;

          canvas.renderAll()
        }

        $("#question-submit").on("click", function () {
          // $(".btn-eraser-clear")[0].click();
          // $("#change-eraser")[0].click();
          // $("#reset")[0].click();
          $("#quiz-modal")[0].style.display = "none";

          let questionValue = $("#question-input").val();
          createQuiz(questionValue);
          socket.emit("createQuiz", questionValue);
        });

        socket.on("createQuiz", function (data) {
          createQuiz(data);
          if (!$("#quiz").hasClass("active")) {
            $("#quiz")[0].click();
          }
        });

        function answerQuizFunc(id) {
          var quizType = $("#quiz-type").val();
          console.log(id, isCreateQuiz, isCreateAnswer);
          if (isCreateQuiz && !isCreateAnswer) {
            const title = new fabric.Text("Answer Correct", {
              top: 0,
              left: 30,
              fontSize: 16,
              fontFamily: "Times New Roman",
            });

            correctAnswerBox = new fabric.Textbox("", {
              left: 0,
              top: 40,
              width: 200,
              fontSize: 10,
              fontFamily: "Times New Roman",
              id: "answer-correct-textbox",
            });

            const group = new fabric.Group([title, correctAnswerBox], {
              top: 50,
              left: 50,
              selectable: false,
              objectID: randomID()
            });

            canvas.add(group);

            if (quizType == "quiz-2" || quizType === "quiz-3" || quizType === "quiz-9") {
              table = createTable([]);
            }
          }

          var object;

          if (
            !isChecked &&
            !isDoQuiz &&
            !readyCheck &&
            !isViewAnswer
          ) {
            if (quizType === "quiz-1") {
              console.log("quiz 1");
              if (isMakingAnswer) {
                correctAnswers = [];
                correctAnswerBox.text = "";
                table._objects.forEach((obj) => {
                  if (obj.name == "quiz-selectObj") {
                    obj.select = false;
                    obj.item(0).fill = obj.colorUnselected;
                  }
                });
              } else {
                table._objects.forEach((obj) => {
                  if (obj.name == "quiz-selectObj") {
                    obj.select = false;
                    obj._objects[0].set({
                      fill: obj.colorUnselected,
                    });
                    obj._objects[1].set({
                      fill: obj.colorText,
                    });
                  }
                });
              }
            }
            else if (quizType === "quiz-2") {
              if (isMakingAnswer) {
                correctAnswers = [];
                if (correctAnswerBox) correctAnswerBox.text = "";
                canvas._objects = canvas._objects.filter(
                  (obj) => obj.name != "quiz-inputObj"
                );

                object = answerRect();
                if (id) {
                  object.set({
                    objectID: id
                  });
                }
              } else {
                canvas._objects.forEach((obj) => {
                  if (obj.name == "quiz-inputObj") {
                    obj.fixed = true;
                    obj.item(1).text = "";
                  }
                });
                $("#quizs-body li:nth-child(n+4)").css({
                  opacity: "1",
                  "pointer-events": "auto",
                });
              }
            }
            else if (quizType === "quiz-3") {
              if (isMakingAnswer) {
                correctAnswerMatch = [];
                correctAnswerBox.text = "";

                const saveData = {
                  canvas: JSON.stringify(canvas.toJSON(customAttributes)),
                  title: quizTitle,
                  gameType: quizType,
                };
                matchQuizData = saveData;
              } else {
              }
            }
            else if (quizType === "quiz-9") {
              if (isMakingAnswer) {
                correctAnswers = [];
                if (correctAnswerBox) correctAnswerBox.text = "";
                canvas._objects = canvas._objects.filter(
                  (obj) => obj.name != "quiz-inputObj"
                );

                object = answerRect();
                if (id) {
                  object.set({
                    objectID: id
                  });
                }
              } else {
                canvas._objects.forEach((obj) => {
                  if (obj.name == "quiz-inputObj") {
                    obj.fixed = true;
                    obj.item(1).text = "";
                  }
                });
                $("#quizs-body li:nth-child(n+4)").css({
                  opacity: "1",
                  "pointer-events": "auto",
                });
              }
            }
          }
          if (isMakingAnswer) {
            answerQuiz.innerHTML = `
                      <img src="assets/images/notepad/save.png" />
                      <span class="hidden tooltip-icon">
                      <span class="h">Save Answer</span>
                      </span>
                      `;
          } else {
            answerQuiz.innerHTML = `
                          <img src="assets/images/notepad/create-answer.png" />
                          <span class="hidden tooltip-icon">
                              <span class="h">Answer</span>
                          </span>
                      `;
          }

          return object;
        }

        var matchQuizData;
        answerQuiz.onclick = function () {
          isMakingAnswer = !isMakingAnswer;
          const object = answerQuizFunc();
          isCreateAnswer = true;

          console.log("emit event: answerQuiz");
          socket.emit("answerQuiz", { isCreateAnswer, isMakingAnswer, id: object?.objectID });
          canvas.requestRenderAll();
        };

        socket.on("answerQuiz", function (data) {
          console.log("on event: answerQuiz", data);
          if (!$("#quiz").hasClass("active")) {
            $("#quiz")[0].click();
          }


          isMakingAnswer = data.isMakingAnswer;
          if ($("#quiz-type").val() === "quiz-2") {
            $("#quiz-create").css({ opacity: "0.5", "pointer-events": "none" });
            $("#quizs-body li:nth-child(n+4):nth-child(-n+10)").css({
              opacity: "1",
              "pointer-events": "auto",
            });
            isCreateQuiz = true;
            answerQuizFunc(data.id);
          } else {
            answerQuizFunc();
          }
          canvas.requestRenderAll();
          isCreateAnswer = true;
        });

        function viewAnswerFunc() {
          var quizType = $("#quiz-type").val();
          if (
            correctAnswers.length > 0 &&
            !isMakingAnswer &&
            !isDoQuiz &&
            !isChecked &&
            !isCreateDoquiz
          ) {
            if (quizType == "quiz-1") {
              if (isViewAnswer) {
                table._objects.forEach((obj) => {
                  if (obj.name == "quiz-selectObj") {
                    obj._objects[0].set({
                      fill: obj.colorUnselected,
                    });
                    obj._objects[1].set({
                      fill: obj.colorText,
                    });
                  }
                });
              } else {
                correctAnswers.forEach((item) => {
                  const obj = table._objects.find(
                    (object) => item.id == object.objectID
                  );

                  obj._objects[0].set({
                    fill: obj.colorSelected,
                  });
                  obj._objects[1].set({
                    fill: obj.colorTextSelected,
                  });
                });
              }
              canvas.requestRenderAll();
            } else if (quizType == "quiz-2") {
              if (isViewAnswer) {
                canvas._objects.forEach((obj) => {
                  if (obj.name == "quiz-inputObj") {
                    var textBox = obj.item(1);
                    textBox.text = "";
                  }
                });
              } else {
                correctAnswers.forEach((item) => {
                  const obj = canvas._objects.find(
                    (object) => item.id == object.objectID
                  );

                  var textBox = obj.item(1);
                  textBox.text = item.value;
                });
              }
              canvas.requestRenderAll();
            }
          }

          if (isViewAnswer) {
            viewAnswerQuiz.innerHTML =
              `
              <img src="assets/images/notepad/unview-answer.png" />
              <span class="hidden tooltip-icon">
                  <span class="h">View Answer</span>
              </span>
            `;
          } else {
            viewAnswerQuiz.innerHTML =
              `
              <img src="assets/images/notepad/view-answer.png" />
              <span class="hidden tooltip-icon">
                  <span class="h">Unview Answer</span>
              </span>
            `;
          }
          isViewAnswer = !isViewAnswer;
        }

        viewAnswerQuiz.onclick = function () {
          viewAnswerFunc();
          console.log("emit event: viewAnswerQuiz");
          socket.emit("viewAnswerQuiz", { isViewAnswer });
        };

        socket.on("viewAnswerQuiz", function (data) {
          console.log("on event: viewAnswerQuiz", data);
          viewAnswerFunc();
        });

        function doQuizFunc() {
          var quizType = $("#quiz-type").val();
          if (isCreateAnswer && !isCreateDoquiz) {
            const title = new fabric.Text("User Answer", {
              top: 0,
              left: 30,
              fontSize: 16,
              fontFamily: "Times New Roman",
            });

            userAnswerBox = new fabric.Textbox("", {
              left: 0,
              top: 40,
              width: 200,
              fontSize: 10,
              fontFamily: "Times New Roman",
              id: "answer-correct-textbox",
            });

            const correctForm = canvas._objects.find(
              (obj) => obj._objects && obj.item(1) == correctAnswerBox
            );

            const group = new fabric.Group([title, userAnswerBox], {
              top: correctForm.top + correctForm.height + 100,
              left: 50,
              selectable: false,
            });

            canvas.add(group);
          }

          isDoQuiz = !isDoQuiz;
          if (
            !isChecked &&
            !isMakingAnswer &&
            !isViewAnswer
          ) {
            if (quizType == "quiz-1") {
              if (isDoQuiz) {
                userAnswers = [];

                userAnswerBox.text = "";
                table._objects.forEach((obj) => {
                  if (obj.name == "quiz-inputObj") {
                    obj.select = false;
                    obj.item(0).fill = obj.colorUnselected;
                  }
                });
              } else {
                table._objects.forEach((obj) => {
                  if (obj.name == "quiz-inputObj") {
                    obj._objects[0].set({
                      fill: obj.colorUnselected,
                    });
                    obj._objects[1].set({
                      fill: obj.colorText,
                    });
                  }
                });
              }
            } else if (quizType == "quiz-2") {
              if (isDoQuiz) {
                userAnswers = [];

                userAnswerBox.text = "";
                canvas._objects.forEach((obj) => {
                  if (obj.name == "quiz-inputObj") {
                    obj.item(1).text = "";
                  }
                });

                // correctAnswers.forEach(item => {
                //     const obj = canvas._objects.find(object => item.id == object.objectID);

                //     obj.visible = true;
                // });

              } else {
                // canvas._objects.forEach(obj => {
                //     if (obj.name == 'quiz-inputObj') {
                //         obj.visible = true;
                //         var textBox = obj.item(1);
                //         textBox.text = obj.value;
                //     }
                // });


                canvas.discardActiveObject();
              }
            } else if (quizType == "quiz-3") {
              if (isDoQuiz) {
                userResult = [];
                userAnswerBox.text = "";
                var startingCanvas = JSON.parse(matchQuizData.canvas);
                canvas.clear();
                countItem = 0;
                loadCanvasJsonNew(startingCanvas);
                console.log(correctAnswerMatch);
              }
            } else if (quizType == "quiz-9") {
              if (isDoQuiz) {
                userAnswers = [];

                userAnswerBox.text = "";
                canvas._objects.forEach((obj) => {
                  if (obj.name == "quiz-inputObj") {
                    obj.item(1).text = "";
                  }
                });
              } else {
                canvas.discardActiveObject();
              }
            } else if (quizType == "quiz-11") {
              console.log("quiz-11");
              //lock all object in canvas cant select
              if (isDoQuiz) {
                canvas.forEachObject(function (obj) {
                  obj.selectable = false;
                  obj.hasBorders = false;
                  obj.hasControls = false;
                });
              }
            }
          }


          if (isDoQuiz) {
            doQuiz.innerHTML =
              `
            <img src="assets/images/notepad/save.png" />
            <span class="hidden tooltip-icon">
            <span class="h">Save Answer</span>
            </span>
          `;
            readyCheck = false;
          } else {
            doQuiz.innerHTML =
              `
            <img src="assets/images/notepad/edit.png" />
            <span class="hidden tooltip-icon">
                <span class="h">Answer</span>
            </span>
          `;
            readyCheck = true;
          }
          canvas.requestRenderAll();
        }

        doQuiz.onclick = function (e) {
          doQuizFunc();
          isCreateDoquiz = true;
          console.log("emit event: doQuiz");
          socket.emit("doQuiz", { isCreateDoquiz, isDoQuiz, readyCheck });
        };

        socket.on("doQuiz", function (data) {
          console.log("on event: doQuiz", data);
          doQuizFunc();
          isCreateDoquiz = true;
        });

        function answerCmp(a, b) {
          if (a.id < b.id) {
            return -1;
          }
          if (a.id > b.id) {
            return 1;
          }
          return 0;
        }

        function checkAnswer() {
          if (correctAnswers.length != userAnswers.length) {
            return false;
          }

          correctAnswers.sort(answerCmp);
          userAnswers.sort(answerCmp);

          return correctAnswers.every((correctAnswer, index) => {
            const userAnswer = userAnswers[index];
            if (correctAnswer.id != userAnswer.id) return false;
            return true;
          });
        }

        function checkAnswerInput() {
          if (correctAnswers.length != userAnswers.length) {
            return false;
          }

          correctAnswers.sort(answerCmp);
          userAnswers.sort(answerCmp);

          return correctAnswers.every((correctAnswer, index) => {
            const userAnswer = userAnswers[index];
            if (correctAnswer.id != userAnswer.id) return false;
            if (correctAnswer.value != userAnswer.value) return false;
            return true;
          });
        }

        function checkAnswerMatch() {
          if (correctAnswerMatch.length != userResult.length) {
            return false;
          }

          correctAnswerMatch.sort();
          userResult.sort(function (a, b) {
            try {
              aFirst = parseInt(a.split("-")[0]);
              bFirst = parseInt(b.split("-")[0]);
              return aFirst - bFirst;
            } catch (error) {
              console.log(error);
              return false;
            }
          });

          return correctAnswerMatch != userResult;
        }

        function checkArrays(A, B) {
          return A.every(item_A => B.some(item_B => item_A.id === item_B.id));
        }

        function checkQuizFunc() {
          var quizType = $("#quiz-type").val();
          if (readyCheck && !isChecked) {

            if (quizType == "quiz-11") {
              let resultText

              console.log('quiz-11', correctAnswers, userAnswers);
              // check if userAnswers item.id has all correctAnswers item.id
              if (checkArrays(correctAnswers, userAnswers)) {
                console.log('true');
                resultText = "True";
                var audio = new Audio('assets/connect.wav');
                audio.play();
              }
              else {
                console.log('false');
                resultText = "False";
              }
              const title = new fabric.Text("Result", {
                top: 0,
                left: 30,
                fontSize: 30,
                fontFamily: "Times New Roman",
              });
              const content = new fabric.Textbox(resultText, {
                left: 30,
                top: 40,
                width: 50,
                fontSize: 25,
                fontFamily: "Times New Roman",
              });
              //group title and content and add to canvas
              var group = new fabric.Group([title, content], {
                top: 50,
                left: 50,
                selectable: false,
              });
              canvas.add(group);
            }
            else {
              const title = new fabric.Text("Result", {
                top: 0,
                left: 30,
                fontSize: 16,
                fontFamily: "Times New Roman",
              });

              const content = new fabric.Textbox("", {
                left: 30,
                top: 40,
                width: 50,
                fontSize: 14,
                fontFamily: "Times New Roman",
                id: "answer-correct-textbox",
              });

              const correctForm = canvas._objects.find(
                (obj) => obj._objects && obj.item(1) == userAnswerBox
              );

              var group = new fabric.Group([title, content], {
                top: correctForm.top + correctForm.height + 100,
                left: 50,
                selectable: false,
              });


              if (quizType == "quiz-1") {
                correctAnswers.forEach((item) => {
                  const obj = table._objects.find(
                    (object) => item.id == object.objectID
                  );

                  obj._objects[0].set({
                    fill: wrongColor,
                  });
                });

                userAnswers.forEach((item) => {
                  const obj = table._objects.find(
                    (object) => item.id == object.objectID
                  );

                  if (obj.item(0).fill == wrongColor) {
                    obj.item(0).fill = successColor;
                  } else {
                    obj.item(0).fill = obj.colorSelected;
                  }
                });

                if (checkAnswer()) {
                  content.text = "True";
                  table.correctSound.play();
                } else {
                  content.text = "False";
                  table.incorrectSound.play();
                }
              } else if (quizType == "quiz-2") {
                correctAnswers.forEach((item) => {
                  const obj = canvas._objects.find(
                    (object) => item.id == object.objectID
                  );

                  var textBox = obj.item(1);
                  textBox.text = item.value;

                  obj._objects[0].set({
                    fill: wrongColor,
                  });
                });

                userAnswers.forEach((item) => {
                  const obj = canvas._objects.find(
                    (object) => item.id == object.objectID
                  );
                  const correctAnswer = correctAnswers.find(
                    (x) => x.id == obj.objectID
                  );

                  if (correctAnswer && item.value == correctAnswer.value) {
                    obj.item(0).fill = successColor;
                  } else {
                    obj.item(0).fill = "#ffff00";
                  }

                  var textBox = obj.item(1);
                  textBox.text = item.value;
                });

                if (checkAnswerInput()) {
                  content.text = "True";
                  table.correctSound.play();
                } else {
                  content.text = "False";
                  table.incorrectSound.play();
                }
              } else if (quizType == "quiz-3") {
                if (checkAnswerMatch()) {
                  content.text = "True";
                  table.correctSound.play();
                } else {
                  content.text = "False";
                  table.incorrectSound.play();
                }
              }
              //quiz-9
              else if (quizType == "quiz-9") {
                correctAnswers.forEach((item) => {
                  const obj = canvas._objects.find(
                    (object) => item.id == object.objectID
                  );

                  var textBox = obj.item(1);
                  textBox.text = item.value;

                  obj._objects[0].set({
                    fill: wrongColor,
                  });
                });
                userAnswers.forEach((item) => {
                  const obj = canvas._objects.find(
                    (object) => item.id == object.objectID
                  );
                  const correctAnswer = correctAnswers.find(
                    (x) => x.id == obj.objectID
                  );

                  if (correctAnswer && item.value == correctAnswer.value) {
                    console.log("correctAnswer", correctAnswer);
                    console.log("item", item);
                    obj.item(0).fill = successColor;
                  } else {
                    obj.item(0).fill = "#ffff00";
                  }

                  var textBox = obj.item(1);
                  textBox.text = item.value;
                });

                if (checkAnswerInput()) {
                  content.text = "True";
                  table.correctSound.play();
                } else {
                  content.text = "False";
                  table.incorrectSound.play();
                }
              }
              else {
                console.log("quiz-else");
              }

              canvas.add(group);
            }
          }
          canvas.requestRenderAll();
        }

        checkQuiz.onclick = function () {
          checkQuizFunc();
          isChecked = true;
          console.log("emit event: checkQuiz");
          socket.emit("checkQuiz", { isChecked });
        };

        socket.on("checkQuiz", function (data) {
          console.log("on event: checkQuiz", data);
          checkQuizFunc();
          isChecked = true;
        });

        $("#quiz-save-image").on("click", function () {
          const dataURL = canvas.toDataURL();
          var random = Math.random();
          var nameImage = 'imagecanvas' + random + '.png';

          var link = document.createElement('a');
          link.download = nameImage;
          link.href = dataURL;

          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        });


        // quiz save - Kiet edit
        $("#quiz-save").on("click", function () {
          var quizType = $("#quiz-type").val();
          if (isCreateQuiz) {
            if (quizType == "quiz-1") {
              const saveData = {
                canvas: JSON.stringify(canvas.toJSON(customAttributes)),
                // startingCanvas: matchQuizData.canvas,
                questions,
                correctAnswers: correctAnswers,
                // userAnswers: userAnswers,
                setting: quizSetting,
                gameType: quizType,
              };

              var element = document.createElement("a");

              element.setAttribute(
                "href",
                "data:text/plain;charset=utf-8," +
                encodeURIComponent(JSON.stringify(saveData))
              );
              element.setAttribute("download", "quiz-selectObj.json");
              element.style.display = "none";
              document.body.appendChild(element);
              element.click();
              document.body.removeChild(element);
            } else if (quizType == "quiz-2") {
              const saveData = {
                canvas: JSON.stringify(canvas.toJSON(customAttributes)),
                questions,
                correctAnswers: correctAnswers,
                // userAnswers: userAnswers,
                setting: quizSetting,
                gameType: quizType,
              };

              var element = document.createElement("a");

              element.setAttribute(
                "href",
                "data:text/plain;charset=utf-8," +
                encodeURIComponent(JSON.stringify(saveData))
              );
              element.setAttribute("download", "quiz-inputObj.json");
              element.style.display = "none";
              document.body.appendChild(element);
              element.click();
              document.body.removeChild(element);
            } else if (quizType == "quiz-3")
              try {
                const saveData = {
                  canvas: JSON.stringify(canvas.toJSON(customAttributes)),
                  startingCanvas: matchQuizData.canvas,
                  questions,
                  correctAnswers: correctAnswers,
                  // userAnswers: userAnswers,
                  setting: quizSetting,
                  gameType: quizType,
                };

                var element = document.createElement("a");

                element.setAttribute(
                  "href",
                  "data:text/plain;charset=utf-8," +
                  encodeURIComponent(JSON.stringify(saveData))
                );
                element.setAttribute("download", "quiz-matchObj.json");
                element.style.display = "none";
                document.body.appendChild(element);
                element.click();
                document.body.removeChild(element);
              } catch (error) {
                console.log(error);
                const saveData = {
                  canvas: JSON.stringify(canvas.toJSON(customAttributes)),
                  questions,
                  correctAnswers: correctAnswerMatch,
                  userAnswers: userResult,
                  setting: quizSetting,
                  gameType: quizType,
                };

                var element = document.createElement("a");

                element.setAttribute(
                  "href",
                  "data:text/plain;charset=utf-8," +
                  encodeURIComponent(JSON.stringify(saveData))
                );
                element.setAttribute("download", "quiz-inputObj.json");
                element.style.display = "none";
                document.body.appendChild(element);
                element.click();
                document.body.removeChild(element);
              } else if (quizType == "quiz-11") {
                console.log("quiz-11");
                try {
                  const saveData = {
                    canvas: JSON.stringify(canvas.toJSON(customAttributes)),
                    correctAnswers: correctAnswers,
                    setting: quizSetting,
                    gameType: quizType,
                  }
                  var element = document.createElement("a");
                  element.setAttribute(
                    "href",
                    "data:text/plain;charset=utf-8," +
                    encodeURIComponent(JSON.stringify(saveData))
                  );
                  element.setAttribute("download", "quiz-mutipleObj.json");
                  element.style.display = "none";
                  document.body.appendChild(element);
                  element.click();
                  document.body.removeChild(element);

                }
                catch (error) {
                  console.log(error);
                }
              }
          }
        });

        $("#quiz-textColor").on("change", function () {
          console.log("textCOlor");
          quizSetting.textColor = this.value;
        });

        $("#quiz-bgColor").on("change", function () {
          quizSetting.bgColor = this.value;
        });

        $("#quiz-bgSelectColor").on("change", function () {
          quizSetting.bgSelectColor = this.value;
        });

        $("#quiz-textSelectColor").on("change", function () {
          quizSetting.textSelectColor = this.value;
        });

        $("#quiz-soundSelected").on("input", function (e) {
          const sound = loadSoundInput(e.target);
          quizSetting.selectSound = sound.src;
        });

        $("#quiz-soundCheck").on("input", function (e) {
          const sound = loadSoundInput(e.target);
          quizSetting.checkSound = sound.src;
        });

        socket.on("fetch-quiz", function (quiz) {
          quiz?.data && loadQuiz(quiz.data)
          quiz?.question && createQuiz(quiz.question)
        });

        //Toggle between drawing tools
        $("#drwToggleDrawMode").on("click", function () {
          $("#toolbox button").removeClass("active");
          if (canvas.isDrawingMode) {
            setFreeDrawingMode(false);
            $(this).removeClass("active");
            drawing = false;
          } else {
            setFreeDrawingMode(true);
            $(this).addClass("active");
            drawing = true;

            //set default drawing line
            if (canvas.freeDrawingBrush.getPatternSrc) {
              canvas.freeDrawingBrush.source =
                canvas.freeDrawingBrush.getPatternSrc.call(canvas.freeDrawingBrush);
            }
            canvas.freeDrawingBrush.shadow = new fabric.Shadow({
              blur: 0,
              offsetX: 0,
              offsetY: 0,
              affectStroke: true,
              color: "#ffffff",
            });
          }
        });
        fabric.Object.prototype.transparentCorners = false;

        let drawingLineWidthEl = $("#drawing-line-width"); //Select width of drawing line
        let drawingColorEl = $("#drawing-color"); //Select color of drawing line

        //Create type pen (IMPORTANT)
        if (fabric.PatternBrush) {
          var vLinePatternBrush = new fabric.PatternBrush(canvas);

          vLinePatternBrush.getPatternSrc = function () {
            var patternCanvas = fabric.document.createElement("canvas");
            patternCanvas.width = patternCanvas.height = 10;
            var ctx = patternCanvas.getContext("2d");

            ctx.strokeStyle = this.color;
            ctx.lineWidth = 5;
            ctx.beginPath();
            ctx.moveTo(0, 5);
            ctx.lineTo(10, 5);
            ctx.closePath();
            ctx.stroke();

            return patternCanvas;
          };

          var hLinePatternBrush = new fabric.PatternBrush(canvas);
          hLinePatternBrush.getPatternSrc = function () {
            var patternCanvas = fabric.document.createElement("canvas");
            patternCanvas.width = patternCanvas.height = 10;
            var ctx = patternCanvas.getContext("2d");

            ctx.strokeStyle = this.color;
            ctx.lineWidth = 5;
            ctx.beginPath();
            ctx.moveTo(5, 0);
            ctx.lineTo(5, 10);
            ctx.closePath();
            ctx.stroke();

            return patternCanvas;
          };

          var squarePatternBrush = new fabric.PatternBrush(canvas);
          squarePatternBrush.getPatternSrc = function () {
            var squareWidth = 10,
              squareDistance = 2;

            var patternCanvas = fabric.document.createElement("canvas");
            patternCanvas.width = patternCanvas.height =
              squareWidth + squareDistance;
            var ctx = patternCanvas.getContext("2d");

            ctx.fillStyle = this.color;
            ctx.fillRect(0, 0, squareWidth, squareWidth);

            return patternCanvas;
          };

          var diamondPatternBrush = new fabric.PatternBrush(canvas);
          diamondPatternBrush.getPatternSrc = function () {
            var squareWidth = 10,
              squareDistance = 5;
            var patternCanvas = fabric.document.createElement("canvas");
            var rect = new fabric.Rect({
              width: squareWidth,
              height: squareWidth,
              angle: 45,
              fill: this.color,
            });

            var canvasWidth = rect.getBoundingRect().width;

            patternCanvas.width = patternCanvas.height =
              canvasWidth + squareDistance;
            rect.set({ left: canvasWidth / 2, top: canvasWidth / 2 });

            var ctx = patternCanvas.getContext("2d");
            rect.render(ctx);

            return patternCanvas;
          };
        }

        //Catch type pen
        $(".drawing-mode-selector").on("click", function () {
          $(".drawing-mode-selector").removeClass("active");
          $(this).addClass("active");
          let val = $(this).attr("data-pencil");

          let oldWidth = canvas.freeDrawingBrush.width;
          let oldColor = canvas.freeDrawingBrush.color;
          if (val === "Hline") {
            canvas.freeDrawingBrush = vLinePatternBrush;
          } else if (val === "Vline") {
            canvas.freeDrawingBrush = hLinePatternBrush;
          } else if (val === "Square") {
            canvas.freeDrawingBrush = squarePatternBrush;
          } else if (val === "Diamond") {
            canvas.freeDrawingBrush = diamondPatternBrush;
          } else {
            canvas.freeDrawingBrush = new fabric[val + "Brush"](canvas);
          }

          if (canvas.freeDrawingBrush) {
            canvas.freeDrawingBrush.color = oldColor;
            canvas.freeDrawingBrush.width = oldWidth;
            if (canvas.freeDrawingBrush.getPatternSrc) {
              canvas.freeDrawingBrush.source =
                canvas.freeDrawingBrush.getPatternSrc.call(canvas.freeDrawingBrush);
            }
            canvas.freeDrawingBrush.shadow = new fabric.Shadow({
              blur: 0,
              offsetX: 0,
              offsetY: 0,
              affectStroke: true,
              color: "#ffffff",
            });
          }
        });

        //Catch wdith pen
        drawingLineWidthEl.on("change", function () {
          canvas.freeDrawingBrush.width = parseInt(this.value);
          let percent = ((this.value / 60) * 100).toFixed(2);
          $("#drawing-line-width-label").text(percent + "%");
        });

        //Catch color pen
        drawingColorEl.on("change", function () {
          canvas.freeDrawingBrush.color = this.value;

          if (canvas.freeDrawingBrush.getPatternSrc) {
            canvas.freeDrawingBrush.source =
              canvas.freeDrawingBrush.getPatternSrc.call(canvas.freeDrawingBrush);
          }
        });

        $("#moveObject").on("click", function () {
          $("#toolbox button").removeClass("active");
          if (canvas.isDrawingMode) {
            setFreeDrawingMode(false);
            $(this).removeClass("active");
            drawing = false;
          }
          $(this).addClass("active");
        });

        $("#drwClearCanvas").on("click", function () {
          canvas.clear();
        });

        $("#textMode").on("click", function () {
          textMode("Init Text");
        });

        $("#createLatex").on("click", function () {
          createLatex();
        });

        // $('#omegaSymbol').on('click', function () { omegaSymbol(); });

        //Thêm đối tượng
        $("#icongeometric").on("click", function () {
          icongeometric();
        });

        $("#iconTriange").on("click", function () {
          iconTriange();
        });

        $("#iconCricle").on("click", function () {
          iconCricle();
        });

        $("#iconElipse").on("click", function () {
          iconElipse();
        });

        $("#iconRect").on("click", function () {
          iconRect();
        });

        $("#iconRoundedRect").on("click", function () {
          iconRoundedRect();
        });

        $("#iconPolygon").on("click", function () {
          iconPolygon();
        });

        $("#iconArrowRightArrow").on("click", function () {
          iconArrowRightArrow();
        });

        $("#iconTurnLeftArrow").on("click", function () {
          iconTurnLeftArrow();
        });

        $("#iconTwoWayArrow").on("click", function () {
          iconTwoWayArrow();
        });

        $("#iconStar").on("click", function () {
          iconStar();
        });

        $("#iconTrapezoid").on("click", function () {
          iconTrapezoid();
        });

        $("#iconPolygen").on("click", function () {
          iconPolygen();
        });

        $("#iconArrowTo").on("click", function () {
          iconArrowTo();
        });

        $("#iconHeart").on("click", function () {
          iconHeart();
        });

        $("#imageMode").change(function (e) {
          var files = e.target.files,
            imageType = /image.*/;
          for (const file of files) {
            if (!file.type.match(imageType)) return;
            var reader = new FileReader();
            reader.onload = imageMode;
            reader.readAsDataURL(file);
          }

          e.target.value = "";
        });

        $("#shapeArrow").on("click", function () {
          if (!isArrowActive || isRectActive || isCircleActive) {
            disableShapeMode();
            $("#toolbox button").removeClass("active");
            $(this).addClass("active");
            isArrowActive = true;
            enableShapeMode();
            let arrow = new Arrow(canvas);
          } else {
            disableShapeMode();
            isArrowActive = false;
            $(this).removeClass("active");
          }
        });

        $("#shapeCircle").on("click", function () {
          if (!isCircleActive || isRectActive || isArrowActive) {
            disableShapeMode();
            $("#toolbox button").removeClass("active");
            $(this).addClass("active");
            isCircleActive = true;
            enableShapeMode();
            let circle = new Circle(canvas);
          } else {
            disableShapeMode();
            isCircleActive = false;
            $(this).removeClass("active");
          }
        });

        $("#shapeRect").on("click", function () {
          if (!isRectActive || isArrowActive || isCircleActive) {
            disableShapeMode();
            isRectActive = true;
            $("#toolbox button").removeClass("active");
            $(this).addClass("active");
            enableShapeMode();
            let squrect = new Rectangle(canvas);
          } else {
            isRectActive = false;
            disableShapeMode();
            $(this).removeClass("active");
          }
        });

        canvas.renderAll();
      });

      // it's need to run
      $("#zmmtg-root, .meeting-app, .meeting-client").addClass("nonew");

      function loadAndUse(font, object, canvas) {
        if (font == "Time New Roman") {
          object.set({
            fontFamily: font,
          });
          object._objects?.forEach((o) => {
            if (o.type === "textbox") {
              o.set("fontFamily", font);
            }
          });
          updateLocal(
            pool_data,
            object.objectID,
            object.toObject(customAttributes),
            socket
          );
          canvas.requestRenderAll();
        } else {
          WebFont.load({
            google: {
              families: [font],
            },

            loading: function () { },

            active: function () {
              object.set({
                fontFamily: font,
              });
              object._objects?.forEach((o) => {
                if (o.type === "textbox") {
                  o.set("fontFamily", font);
                }
              });
              updateLocal(
                pool_data,
                object.objectID,
                object.toObject(customAttributes),
                socket
              );
              canvas.requestRenderAll();
            },
          });
        }
      }
    })(jQuery, window, document);
  });


  function filterIdSame(dataDraw) {
    var id = dataDraw[0].id;
    var array = [];
    array.push(dataDraw[0]);
    for (let i = 1; i < dataDraw.length; i++) {
      if (id == dataDraw[i].id) {
        console.log(i);
      } else {
        id = dataDraw[i].id;
        array.push(dataDraw[0]);
      }
    }
    return array;
  }

  function randomID() {
    return "_" + Math.random().toString(36).substr(2, 9);
  }

  function generateID(type) {
    var date = new Date();
    return (
      type +
      date.getDate() +
      date.getMonth() +
      date.getFullYear() +
      date.getHours() +
      date.getMinutes() +
      date.getSeconds()
    );
  }

  function loadCanvasJson(arr, canvas) {
    console.log(arr);
    for (let index = 0; index < arr.length; index++) {
      if (arr[index].data && arr[index].layer == canvas.id) {
        var jsonObj = arr[index].data;
        if (arr[index].name == "lineConnect") {
        } else {
          fabric.util.enlivenObjects([jsonObj], function (enlivenedObjects) {
            enlivenedObjects[0].set({
              objectID: arr[index].objectID,
              userID: arr[index].userID,
              idObject1: arr[index].idObject1,
              idObject2: arr[index].idObject2,
              port1: arr[index].port1,
              port2: arr[index].port2,
            });
            canvas.add(enlivenedObjects[0]);
            if (
              enlivenedObjects[0]._objects &&
              enlivenedObjects[0]._objects.length > 2 &&
              enlivenedObjects[0]._objects[0].type != "image"
            ) {
              addPort(enlivenedObjects[0], canvas, arr[index].objectID);
            }
          });
        }
      }
    }
    canvas.renderAll();
    canvas.setBackgroundColor(
      backgroundColorCanvas,
      canvas.renderAll.bind(canvas)
    );
  }

  function deleteObjInPool(data, pool_data, layer, canvas) {
    const indexDelete = pool_data.findIndex(
      (item) => item.objectID === data && item.layer == layer
    );
    if (indexDelete >= 0) {
      pool_data.splice(indexDelete, 1);
    }
  }

  function dragElement(elmnt) {
    if ($(".mover").length > 0) return;
    var mover = document.createElement("div");
    mover.className = "mover";
    mover.style.width = "20px";
    mover.style.height = "20px";
    mover.style.background = "red";
    mover.style.position = "absolute";
    mover.style.top = 0;
    mover.style.left = 0;
    mover.style.cursor = "move";
    elmnt.appendChild(mover);

    var pos1 = 0,
      pos2 = 0,
      pos3 = 0,
      pos4 = 0;

    // otherwise, move the DIV from anywhere inside the DIV:
    mover.onmousedown = dragMouseDown;

    function dragMouseDown(e) {
      e = e || window.event;
      e.preventDefault();
      // get the mouse cursor position at startup:
      pos3 = e.clientX;
      pos4 = e.clientY;
      document.onmouseup = closeDragElement;
      // call a function whenever the cursor moves:
      document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
      e = e || window.event;
      e.preventDefault();
      // calculate the new cursor position:
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;
      // set the element's new position:
      elmnt.style.top = pos4 - 80 + "px";
      elmnt.style.left = pos3 + "px";
      // elmnt.style.top = pos2 + "px";
      // elmnt.style.left = pos1 + "px";
    }

    function closeDragElement() {
      // stop moving when mouse button is released:
      document.onmouseup = null;
      document.onmousemove = null;
    }
  }

  function resizeVideo(element) {
    if ($(".resizer").length > 0) return;
    var resizer = document.createElement("div");
    resizer.className = "resizer";
    resizer.style.width = "20px";
    resizer.style.height = "20px";
    resizer.style.background = "red";
    resizer.style.position = "absolute";
    resizer.style.right = 0;
    resizer.style.bottom = 0;
    resizer.style.cursor = "se-resize";
    element.appendChild(resizer);

    resizer.addEventListener("mousedown", initResize, false);

    function initResize(e) {
      window.addEventListener("mousemove", Resize, false);
      window.addEventListener("mouseup", stopResize, false);
    }

    function Resize(e) {
      element.style.width = e.clientX - element.offsetLeft + 5 + "px";
      element.style.height = e.clientY - element.offsetTop - 80 + "px";
    }

    function stopResize(e) {
      e.preventDefault();
      window.removeEventListener("mousemove", Resize, false);
    }
  }

  function loadAndUseTextbox(font, objectID, canvas) {
    if (font == "Time New Roman") {
      canvas.getObjects().forEach((item) => {
        if (item.objectID == objectID) {
          item.set("fontFamily", font);

          canvas.requestRenderAll();
          return;
        }
      });
    } else {
      WebFont.load({
        google: {
          families: [font],
        },

        loading: function () { },

        active: function () {
          canvas.getObjects().forEach((item) => {
            if (item.objectID == objectID) {
              item.set("fontFamily", font);

              canvas.requestRenderAll();
              return;
            }
          });
        },
      });
    }
  }

  function updateObjectByID(pool_data, dataChange, objectID, moving) {
    var index = pool_data.findIndex((item) => item.objectID == objectID);
    if (index >= 0) {
      if (moving) {
        if (pool_data[index].name != "lineConnect") {
          Object.keys(dataChange).forEach((key) => {
            pool_data[index].data[key] = dataChange[key];
          });
        }
      } else {
        pool_data[index].data = dataChange;
      }
    }
  }

  function updateLocal(pool_data, objectID, dataChange, socket, moving, options) {
    var index = pool_data.findIndex((item) => item.objectID == objectID);
    if (index >= 0) {
      if (moving) {
        if (pool_data[index].type != "lineConnect") {
          Object.keys(dataChange).forEach((key) => {
            pool_data[index].data[key] = dataChange[key];
          });
        }
      } else {
        pool_data[index].data = dataChange;
      }
    } else {

    }
    socket.emit("updated", {
      objectID: objectID,
      dataChange: dataChange,
      moving,
      options,
    });
  }

  function turnOnOffUsernamePoolData(userID, pool_data, name) {
    for (let i = 0; i < pool_data.length; i++) {
      if (pool_data[i].userID == userID) {
        if (pool_data[i].data._objects) {
          if (pool_data[i].data._objects.length > 2) {
            pool_data[i].data._objects[2].text = name;
          } else {
            pool_data[i].data._objects[1].text = name;
          }
        } else {
          if (pool_data[i].data.objects.length > 2) {
            pool_data[i].data.objects[2].text = name;
          } else {
            pool_data[i].data.objects[1].text = name;
          }
        }
      }
    }
  }

  function turnOnOffUsernameCanvas(userID, canvas, name) {
    canvas.getObjects().forEach((item) => {
      if (item.userID == userID) {
        if (item._objects.length > 2) {
          item.item(2).set({
            text: name,
          });
        } else {
          item.item(1).set({
            text: name,
          });
        }
      }
    });
    canvas.requestRenderAll();
  }

  function latexToImg(formula) {
    let wrapper = MathJax.tex2svg(formula, {
      em: 10,
      ex: 5,
      display: true,
    });
    let fin = btoa(
      unescape(encodeURIComponent(wrapper.querySelector("svg").outerHTML))
    );
    let svg = "data:image/svg+xml;base64," + fin;
    return svg;
  }

  function findTargetPort(object, ports) {
    let points = new Array(4);
    let port;
    if (ports) {
      port = ports;
    } else {
      port = object.__corner;
    }
    switch (port) {
      case "mt":
        points = [
          object.left + (object.width * object.scaleX) / 2,
          object.top,
          object.left + (object.width * object.scaleX) / 2,
          object.top,
        ];
        break;
      case "mr":
        points = [
          object.left + object.width * object.scaleX,
          object.top + (object.height * object.scaleY) / 2,
          object.left + object.width * object.scaleX,
          object.top + (object.height * object.scaleY) / 2,
        ];
        break;
      case "mb":
        points = [
          object.left + (object.width * object.scaleX) / 2,
          object.top + object.height * object.scaleY,
          object.left + (object.width * object.scaleX) / 2,
          object.top + object.height * object.scaleY,
        ];
        break;
      case "ml":
        points = [
          object.left,
          object.top + (object.height * object.scaleY) / 2,
          object.left,
          object.top + (object.height * object.scaleY) / 2,
        ];
        break;

      default:
        break;
    }

    return {
      x1: points[0],
      y1: points[1],
      x2: points[2],
      y2: points[3],
    };
  }

  function choosePort(port, canvas, objectID) {
    console.log("choosePort");
  }

  function disablePort(port, object) {
    switch (port) {
      case "mt":
        object.setControlsVisibility({
          mt: false,
        });
        break;
      case "mr":
        object.setControlsVisibility({
          mr: false,
        });
        break;
      case "mb":
        object.setControlsVisibility({
          mb: false,
        });
        break;
      case "ml":
        object.setControlsVisibility({
          ml: false,
        });
        break;
      default:
        break;
    }
  }

  function makeLine(
    canvas,
    point,
    idObject1,
    idObject2,
    corner1,
    corner2,
    objectID,
    text
  ) {
    var line = new fabric.Path("M 65 0 Q 100 100 200 0", {
      //  M 65 0 L 73 6 M 65 0 L 62 6 z
      fill: "",
      stroke: "#000",
      // objectCaching: false,
      originX: "center",
      originY: "center",
      name: "lineConnect",
      idObject1: idObject1,
      idObject2: idObject2,
      port1: corner1,
      port2: corner2,
      objectID: objectID,
    });

    line.path[0][1] = point.x1;
    line.path[0][2] = point.y1;

    line.path[1][1] = point.x1 + 100;
    line.path[1][2] = point.y1 + 100;

    line.path[1][3] = point.x2;
    line.path[1][4] = point.y2;

    // var text;
    // if(point.x1 < point.x2) {
    //     text = new fabric.Text(text, {
    //         fontSize: 10,
    //         top: point.y1,
    //         left: point.x1,
    //         objectCaching: false,
    //         name: "lineusername1",
    //         lineID: objectID,
    //         corner: corner1
    //     });
    // } else {
    //     text = new fabric.Text(text, {
    //         fontSize: 10,
    //         top: point.y2,
    //         left: point.x2,
    //         objectCaching: false,
    //         name: "lineusername",
    //         lineID: objectID,
    //         corner: corner2
    //     });
    // }
    // canvas.add(text);

    canvas.add(line);

    var p1 = makeCurvePoint(
      canvas,
      objectID,
      point.x1 + 100,
      point.y1 + 100,
      line
    );
    canvas.add(p1);

    return line;
  }

  function makeCurvePoint(canvas, objectID, left, top, line) {
    var c = new fabric.Circle({
      left: left,
      top: top,
      strokeWidth: 4,
      radius: 8,
      fill: "#fff",
      stroke: "#666",
      originX: "center",
      originY: "center",
      lineID: objectID,
      name: "curve-point",
    });

    c.hasBorders = c.hasControls = false;

    c.on("moving", function () {
      if (line) {
        line.path[1][1] = c.left;
        line.path[1][2] = c.top;
      }
    });

    return c;
  }

  function movelinename(canvas, objectID, top, left, corner) {
    canvas.getObjects().forEach((item) => {
      if (
        item.name == "lineusername" &&
        item.lineID == objectID &&
        item.corner == corner
      ) {
        item.set({
          top: top,
          left: left,
        });
      }
    });
  }

// function addPort(object, canvas, objectID) {
//     let port = [ 'mt', 'mr', 'mb', 'ml' ];

//     let point = findTargetPort(object, port);
//     var c = new fabric.Circle({
//         left: point.x1,
//         top: point.y1,
//         radius: 0,
//         fill: '#37e226',
//         name: "port",
//         port: port,
//         portID: objectID,
//         originX: 'center',
//         originY: 'center'
//     });

//     canvas.add(c);
// }
