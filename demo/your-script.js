var canvas = new fabric.Canvas('canvas');
// Button click event to add circles
document.getElementById('unSelectButton').addEventListener('click', unSelect);
document.getElementById("addShapeButton").addEventListener("click", function (event) {
    event.preventDefault(); // Ngăn chặn sự kiện mặc định (ngăn tải lại trang)
    // Lấy phần tử select có id là "shapeSelect"
    var shapeSelect = document.getElementById("shapeSelect");
    // Lấy giá trị của tùy chọn đã chọn
    var selectedOption = shapeSelect.options[shapeSelect.selectedIndex].value;
    // Log giá trị của tùy chọn đã chọn
    console.log("Tùy chọn đã chọn: " + selectedOption);
    addShape(selectedOption);

});

document.getElementById('addCircleButton').addEventListener('click', addCircle);
document.getElementById('deleteObjectButton').addEventListener('click', deleteObject);
document.getElementById('showTextButton').addEventListener('click', hideText);
canvas.setWidth(800); // Set the width to 800
canvas.setHeight(600); // Set the height to 600

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
var visableText = true;

function addShape(shapeType) {
    if (shapeType === 'rectangle') {
        var rect = new fabric.Rect({
            left: Math.random() * canvas.width,
            top: Math.random() * canvas.height,
            width: 100,
            height: 50,
            fill: 'blue',
            selectable: true
        });
        canvas.add(rect);
        shapes.push(rect);
        addPortsToRect(rect);

    }
    else if (shapeType === 'circle') {
        var circle = new fabric.Circle({
            left: Math.random() * canvas.width,
            top: Math.random() * canvas.height,
            radius: 25,
            fill: 'blue',
            selectable: true
        });
        canvas.add(circle);
        shapes.push(circle);
        addPortsToRect(circle);
    }
    else if (shapeType === 'square') {
        var square = new fabric.Rect({
            left: Math.random() * canvas.width,
            top: Math.random() * canvas.height,
            width: 50,
            height: 50,
            fill: 'blue',
            selectable: true
        });
        canvas.add(square);
        shapes.push(square);
        addPortsToRect(square);
    }
    else if (shapeType === 'triangle') {
        var triangle = new fabric.Triangle({
            left: Math.random() * canvas.width,
            top: Math.random() * canvas.height,
            width: 100,
            height: 100,
            fill: 'blue',
            selectable: true
        });
        canvas.add(triangle);
        shapes.push(triangle);
        addPortsToRect(triangle);
    }
}

// video as object
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
            addPortsToRect(fabricImage)
            video.play();
        });
    }
});

fabric.util.requestAnimFrame(function render() {
    canvas.renderAll();
    fabric.util.requestAnimFrame(render);
});


// image as object
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
                addPortsToImage(img);
            });
        };

        reader.readAsDataURL(file);
    }
});

//Function to check if coordinates are inside any objects in canvas
function getObjectAtPosition(x, y) {
    var targetObject = null;
    canvas.forEachObject(function (obj) {
        if (obj.containsPoint({ x: x, y: y })) {
            targetObject = obj;
            // Thoát khỏi vòng lặp vì đã tìm thấy đối tượng
            return false;
        }
    });
    return targetObject;
}


// Function to check if a connecting line already exists
function hasConnectingLine(obj1, obj2) {
    for (var i = 0; i < connectingLines.length; i++) {
        var line = connectingLines[i];
        if (
            (line.obj1 === obj1 && line.obj2 === obj2) ||
            (line.obj1 === obj2 && line.obj2 === obj1)
        ) {
            return true;
        }
    }
    return false;
}

function isPointInPort(point, port) {
    var dx = point.x - port.left;
    var dy = point.y - port.top;
    var distance = Math.sqrt(dx * dx + dy * dy);
    if (distance <= port.radius) {
        return true;
    }
    return false;
}

// function to check if pointer inside a port in connectingLines
function checkPointerInPortInConnectionLine(pointer) {
    for (var i = 0; i < connectingLines.length; i++) {
        var line = connectingLines[i];
        port1 = line.port1;
        port2 = line.port2;
        if (isPointInPort(pointer, port1) || isPointInPort(pointer, port2)) {
            return true;
        }
    }
    return false;
}
// function to update connectingLines
function updateConnectingLines(shape1, shape2, port1, port2) {
    //remove old line
    for (var i = 0; i < connectingLines.length; i++) {
        var line = connectingLines[i];
        if (line.obj1 === shape1 && line.obj2 === shape2 || line.obj1 === shape2 && line.obj2 === shape1) {
            canvas.remove(line.line);
            canvas.remove(line.line.controllers[0]);
            canvas.remove(line.line.controllers[1]);
            connectingLines.splice(i, 1);
            break;
        }
    }
    //add new line
    connectShapes(shape1, shape2, port1, port2);
}

// Function to check if object exists in connectingLines
function checkObjectInConnectingLines(obj) {
    for (var i = 0; i < connectingLines.length; i++) {
        var line = connectingLines[i];
        if (line.obj1 === obj || line.obj2 === obj) {
            return true;
        }
    }
    return false;
}
//Function return other object in connectingLines
function getOtherObjectInConnectingLines(obj) {
    for (var i = 0; i < connectingLines.length; i++) {
        var line = connectingLines[i];
        if (line.obj1 === obj) {
            return line.obj2;
        }
        else if (line.obj2 === obj) {
            return line.obj1;
        }
    }
}
//fucntion check port in connectingLines
function checkPortInConnectingLines(port) {
    for (var i = 0; i < connectingLines.length; i++) {
        var line = connectingLines[i];
        if (line.port1 === port || line.port2 === port) {
            return true;
        }
    }
    return false;
}


// Function to calculate the center point of a circle
function getCircleCenter(circle) {
    if (!circle.left || !circle.top || !circle.radius) {
        return
    }
    return {
        left: circle.left + circle.radius,
        top: circle.top + circle.radius
    };
}

function getObjectCenter(obj) {
    if (!obj.left || !obj.top) {
        return
    }
    return {
        left: obj.left + obj.width / 2,
        top: obj.top + obj.height / 2
    };
}

function checkOverlap(obj1, obj2) {
    if (obj2) {
        const isOverlapping = obj1.intersectsWithObject(obj2);
        obj1.set('fill', isOverlapping ? 'green' : 'blue');
        return isOverlapping;
    }
    return
}

// Function to create a line between the centers of two circles
function connectCircles(circle1, circle2) {
    try {
        console.log(circle1, circle2)
        if (hasConnectingLine(circle1, circle2)) {
            return;
        }
        var center1 = getCircleCenter(circle1);
        var center2 = getCircleCenter(circle2);
        var line = new fabric.Line([center1.left, center1.top, center2.left, center2.top], {
            fill: 'red',
            stroke: 'red',
            strokeWidth: 5,
            selectable: false,
            hoverCursor: "default",
            evented: false
        });
        connectingLines.push({
            obj1: circle1,
            obj2: circle2,
            line: line,
        });
        canvas.add(line);
        circle1.on('moving', function () {
            updateLine(line, circle1, '1');
        });
        circle2.on('moving', function () {
            updateLine(line, circle2, '2');
        });
        circle1.on('scaling', function () {
            updateLine(line, circle1, '1');
        });
        circle2.on('scaling', function () {
            updateLine(line, circle2, '2');
        });
    }
    catch (error) {
        console.log(error)
    }
}


//connect 2 shapes
function connectShapes(shape1, shape2, port1, port2) {
    if (hasConnectingLine(shape1, shape2)) {
        return;
    }
    var port1Point = port1.getCenterPoint();
    var port2Point = port2.getCenterPoint();
    // var line = new fabric.Line([port1Point.x, port1Point.y, port2Point.x, port2Point.y], {
    //     fill: 'red',
    //     stroke: 'red',
    //     strokeWidth: 2,
    //     selectable: false,
    //     hoverCursor: 'default',
    //     evented: false
    // });
    // connectingLines.push({
    //     obj1: shape1,
    //     obj2: shape2,`
    //     line: line,
    //     port1: port1,
    //     port2: port2
    // });
    //canvas.add(line);
    var line = drawLineBezier(port1, port2);
    connectingLines.push({
        obj1: shape1,
        obj2: shape2,
        line: line,
        port1: port1,
        port2: port2
    });
    console.log('connectingLines', connectingLines)
    if (checkifCrossShapes(line, shape1, shape2)) {
        console.log('cross')
    }
    shape1.on('moving', function () {
        //updateLine(line, port1, '1');
        updateLineBezier(line, port1, port2)
        console.log('moving')
    });
    shape2.on('moving', function () {
        //updateLine(line, port2, '2');
        //checkifCrossShapes(line, shape1, shape2);
        updateLineBezier(line, port1, port2)
    });
    shape1.on('scaling', function () {
        //updateLine(line, port1, '1');
        updateLineBezier(line, port1, port2)
    });
    shape2.on('scaling', function () {
        //updateLine(line, port2, '2');
        updateLineBezier(line, port1, port2)
    });
}

function updateLine(line, port, point) {
    const centerPoint = port.getCenterPoint();
    if (point === '1') {
        line.set({
            x1: centerPoint.x,
            y1: centerPoint.y
        });
    } else {
        line.set({
            x2: centerPoint.x,
            y2: centerPoint.y
        });
    }
    canvas.renderAll(); // Cập nhật lại canvas
}


// Event handler when a circle is clicked
canvas.on('mouse:down', function (options) {
    var port = checkifInPorts(options.pointer);
    console.log('port', port)
    if (port) {
        portCenter = port.getCenterPoint();
        if (currentLine) {
            currentLine.set({
                x2: portCenter.x,
                y2: portCenter.y
            });

            if (hasConnectingLine(selectedShapes[0], selectedShapes[1]) && selectedShapes.length === 2 && selectedShapes[0] !== selectedShapes[1]) {
                console.log('hasConnectingLine')
                updateConnectingLines(selectedShapes[0], selectedShapes[1], selectedPorts[0], selectedPorts[1]);
            }
            else if (selectedShapes[0] !== selectedShapes[1] && selectedShapes.length === 2) {
                connectShapes(selectedShapes[0], selectedShapes[1], selectedPorts[0], selectedPorts[1])
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
                selectable: false
            });
            canvas.add(currentLine); // Thêm đối tượng line vào canvas
            return;
        }
    }
    else if (checkifInShapes(options.pointer)) {
        var shape = checkifInShapes(options.pointer);
        if (selectedPorts.length === 1) {
            port = shape.ports[0]
            if (port) {
                lastSelectedPort = shape.ports[0]
                selectedPorts.push(port);
                selectedShapes.push(shape);
                portCenter = port.getCenterPoint();
                if (currentLine) {
                    currentLine.set({
                        x2: portCenter.x,
                        y2: portCenter.y
                    });

                    if (hasConnectingLine(selectedShapes[0], selectedShapes[1]) && selectedShapes.length === 2 && selectedShapes[0] !== selectedShapes[1]) {
                        console.log('hasConnectingLine')
                        updateConnectingLines(selectedShapes[0], selectedShapes[1], selectedPorts[0], selectedPorts[1]);
                    }
                    else if (selectedShapes[0] !== selectedShapes[1] && selectedShapes.length === 2) {
                        connectShapes(selectedShapes[0], selectedShapes[1], selectedPorts[0], selectedPorts[1])
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
    else {
        //change last port color
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
        return
    }
});

canvas.on('mouse:move', function (options) {
    var pointer = canvas.getPointer(options.e);
    // if (!isDrawing) return;
    // var pointer = canvas.getPointer(options.e);
    // if (line) { // Kiểm tra xem đối tượng line đã được khởi tạo chưa
    //     var pointer = canvas.getPointer(options.e);
    //     line.set({ x2: pointer.x, y2: pointer.y });
    //     canvas.renderAll();
    // }
    if (currentLine) {
        currentLine.set({ x2: pointer.x, y2: pointer.y });
        canvas.renderAll();
    }
    canvas.renderAll();
});

// canvas.on('object:moving', function (e) {

// });

canvas.on('mouse:up', function (event) {
    //the line is draw check the last coordinate if its inside any object
    // if (isDrawing) {
    //     const lastCoordinate = canvas.getPointer(event.e);
    //     const obj = getObjectAtPosition(lastCoordinate.x, lastCoordinate.y);
    //     console.log('objlast', obj)
    //     if (obj && selectedCircles.length === 1) {
    //         selectedCircles.push(obj);
    //     }
    //     if (selectedCircles.length === 2) {
    //         connectCircles(selectedCircles[0], selectedCircles[1]);
    //     }
    //     //remove line from canvas
    //     selectedCircles = [];
    //     canvas.remove(line);
    //     line = null;
    //     canvas.renderAll();
    // }
});

// Ghi đè chức năng mặc định khi chuột phải được nhấn để tránh hiển thị menu ngữ cảnh trình duyệt
canvas.on('contextmenu', function (e) {
    e.e.preventDefault();
});

canvas.on('object:over', function (e) {

});


// Function to add a circle to the canvas
function addCircle() {
    var circle = new fabric.Circle({
        left: Math.random() * canvas.width,
        top: Math.random() * canvas.height,
        radius: 30,
        fill: 'blue',
        selectable: true
    });
    canvas.add(circle);
    shapes.push(circle);
    addPortsToRect(circle);
}


function unSelect() {
    canvas.discardActiveObject();
    canvas.requestRenderAll();
}

function addConnect() {
    addConnectOn = !addConnectOn;
}

function deleteObject() {
    var activeObject = canvas.getActiveObject();
    if (activeObject.ports) {
        for (var j = 0; j < activeObject.ports.length; j++) {
            canvas.remove(activeObject.ports[j]);
        }
    }

    if (checkObjectInConnectingLines(activeObject)) {
        console.log('in connectingLines', connectingLines);
        var i = 0;
        while (i < connectingLines.length) {
            var line = connectingLines[i];
            if (line.obj1 === activeObject || line.obj2 === activeObject) {
                console.log('have line');
                canvas.remove(line.line);
                canvas.remove(line.line.controllers[0]);
                canvas.remove(line.line.controllers[1]);
                canvas.remove(line.line.text);
                connectingLines.splice(i, 1); // Remove the line
            } else {
                i++; // Only increment the index when not removing a line
            }
        }
        console.log('connectingLines', connectingLines);
    } else {
        console.log('not in connectingLines');
    }

    canvas.remove(activeObject);
    shapes.splice(shapes.indexOf(activeObject), 1);
    canvas.renderAll();
}




//demo-port-code
function findMidpoint(edge) {
    return {
        x: (edge.x1 + edge.x2) / 2,
        y: (edge.y1 + edge.y2) / 2
    };
}

function addPortToEdge(x, y) {
    canvas.selection = false;

    var circle = new fabric.Circle({
        radius: 5,
        fill: '#fff',
        stroke: '#666',
        strokeWidth: 1,
        left: x,
        top: y,
        selectable: false,
        hasBorders: false,
        hasControls: false,
        hoverCursor: 'default',
        originX: 'center',
        originY: 'center',
    });
    canvas.add(circle);
    allPorts.push(circle);
    return circle;
}

function updatePortPositions(shape) {
    var lastports = shape.ports;
    var newLeft = shape.left;
    var newTop = shape.top;
    var newWidth = shape.width * shape.scaleX;
    var newHeight = shape.height * shape.scaleY;
    var topMidpoint = findMidpoint({ x1: newLeft, y1: newTop, x2: newLeft + newWidth, y2: newTop });
    var bottomMidpoint = findMidpoint({ x1: newLeft, y1: newTop + newHeight, x2: newLeft + newWidth, y2: newTop + newHeight });
    var leftMidpoint = findMidpoint({ x1: newLeft, y1: newTop, x2: newLeft, y2: newTop + newHeight });
    var rightMidpoint = findMidpoint({ x1: newLeft + newWidth, y1: newTop, x2: newLeft + newWidth, y2: newTop + newHeight });

    shape.ports[0].set({ left: topMidpoint.x, top: topMidpoint.y });
    shape.ports[1].set({ left: bottomMidpoint.x, top: bottomMidpoint.y });
    shape.ports[2].set({ left: leftMidpoint.x, top: leftMidpoint.y });
    shape.ports[3].set({ left: rightMidpoint.x, top: rightMidpoint.y });

    canvas.renderAll();

}

function addPortsToRect(shape) {
    var shapeBounds = shape.getBoundingRect();
    var topMidpoint = findMidpoint({ x1: shapeBounds.left, y1: shapeBounds.top, x2: shapeBounds.left + shapeBounds.width, y2: shapeBounds.top });
    var bottomMidpoint = findMidpoint({ x1: shapeBounds.left, y1: shapeBounds.top + shapeBounds.height, x2: shapeBounds.left + shapeBounds.width, y2: shapeBounds.top + shapeBounds.height });
    var leftMidpoint = findMidpoint({ x1: shapeBounds.left, y1: shapeBounds.top, x2: shapeBounds.left, y2: shapeBounds.top + shapeBounds.height });
    var rightMidpoint = findMidpoint({ x1: shapeBounds.left + shapeBounds.width, y1: shapeBounds.top, x2: shapeBounds.left + shapeBounds.width, y2: shapeBounds.top + shapeBounds.height });

    // Tạo và lưu trữ các port trong mảng của hình vẽ này
    var ports = [
        addPortToEdge(topMidpoint.x, topMidpoint.y),
        addPortToEdge(bottomMidpoint.x, bottomMidpoint.y),
        addPortToEdge(leftMidpoint.x, leftMidpoint.y),
        addPortToEdge(rightMidpoint.x, rightMidpoint.y)
    ];


    shape.ports = ports;

    shape.on('moving', function (e) {
        updatePortPositions(shape);
        isOverlapping = checkOverlap(shape, getOtherObjectInConnectingLines(shape));
    });

    shape.on('mousedown', function (e) {
        updatePortPositions(shape);
    });

    shape.on('mouseup', function (e) {
        updatePortPositions(shape);
    });

    shape.on('scaling', function (e) {
        updatePortPositions(shape);
    });
}

function addPortsToImage(shape) {
    var distance = 400
    var imageBounds = shape.getBoundingRect();

    // Tính toán các port ở các điểm trung tâm của các cạnh hình ảnh với khoảng cách distance
    var topMidpoint = findMidpoint({ x1: imageBounds.left, y1: imageBounds.top - distance, x2: imageBounds.left + imageBounds.width, y2: imageBounds.top - distance });
    var bottomMidpoint = findMidpoint({ x1: imageBounds.left, y1: imageBounds.top + imageBounds.height + distance, x2: imageBounds.left + imageBounds.width, y2: imageBounds.top + imageBounds.height + distance });
    var leftMidpoint = findMidpoint({ x1: imageBounds.left - distance, y1: imageBounds.top, x2: imageBounds.left - distance, y2: imageBounds.top + imageBounds.height });
    var rightMidpoint = findMidpoint({ x1: imageBounds.left + imageBounds.width + distance, y1: imageBounds.top, x2: imageBounds.left + imageBounds.width + distance, y2: imageBounds.top + imageBounds.height });

    // Tạo và lưu trữ các port trong mảng của hình ảnh này
    var ports = [
        addPortToEdge(topMidpoint.x, topMidpoint.y),
        addPortToEdge(bottomMidpoint.x, bottomMidpoint.y),
        addPortToEdge(leftMidpoint.x, leftMidpoint.y),
        addPortToEdge(rightMidpoint.x, rightMidpoint.y)
    ];

    shape.ports = ports;

    shape.on('moving', function (e) {
        updatePortPositions(shape, distance);
        isOverlapping = checkOverlap(shape, getOtherObjectInConnectingLines(shape));
    });

    shape.on('mousedown', function (e) {
        updatePortPositions(shape, distance);
    });

    shape.on('mouseup', function (e) {
        updatePortPositions(shape, distance);
    });

    shape.on('scaling', function (e) {
        updatePortPositions(shape, distance);
    });
}

//add Text To canvas
function addTextToLine(text, line, left, top) {
    var textObject = new fabric.Text(text, {
        left: left,
        top: top,
        fontSize: 14,
        fill: 'black',
        textAlign: 'center', // Đặt căn giữa theo chiều ngang
        originX: 'center',  // Đặt vị trí nguồn gốc theo chiều ngang là giữa
        visible: hideText
    });
    line.text = textObject;
    return textObject;
}

//hide text in all line
function hideText() {
    hideText = !hideText;
    for (var i = 0; i < connectingLines.length; i++) {
        var line = connectingLines[i];
        line.line.text.set('visible', hideText);
    }
    canvas.renderAll();
}


//check if the point in any selected shapes
function checkifInShapes(point) {
    for (var i = 0; i < shapes.length; i++) {
        var shape = shapes[i];
        if (shape.containsPoint(point)) {
            return shape;
        }
        //check in area 50px around shape
        else if (point.x >= shape.left - 50 && point.x <= shape.left + shape.width + 50 && point.y >= shape.top - 50 && point.y <= shape.top + shape.height + 50) {
            return shape;
        }
    }
    return null;
}

//check if the point in any ports
function checkifInPorts(point) {
    for (var i = 0; i < shapes.length; i++) {
        var shape = shapes[i];
        for (var j = 0; j < shape.ports.length; j++) {
            var port = shape.ports[j];
            var dx = point.x - port.left;
            var dy = point.y - port.top;
            var distance = Math.sqrt(dx * dx + dy * dy);
            if (distance <= port.radius) {
                if (lastSelectedPort) {
                    lastSelectedPort.set('fill', '#fff');
                }
                port.set('fill', 'green');
                selectedShapes.push(shape);
                selectedPorts.push(port);
                lastSelectedPort = port;
                return port;
            }
        }
    }
    //check point in any ports
    // for (var i = 0; i < allPorts.length; i++) {
    //     var port = allPorts[i];
    //     console.log('port', port)
    //     if (port.containsPoint(point)) {
    //         //đổi màu port
    //         if (lastSelectedPort) {
    //             lastSelectedPort.set('fill', '#fff');
    //         }
    //         port.set('fill', 'green');
    //         lastSelectedPort = port;
    //         return port;
    //     }
    // }
    return null;
    // console.log('checked')
    // //check if in any shapes
    // for (var i = 0; i < shapes.length; i++) {
    //     var shape = shapes[i];
    //     if (shape.containsPoint(point)) {
    //         console.log('inside')
    //         return
    //     }
    // }
    // console.log('outside')
}

//check if line cross any shapes
function checkifCrossShapes(line, shape1, shape2) {
    for (var i = 0; i < shapes.length; i++) {
        var shape = shapes[i];
        if (shape.intersectsWithObject(line) && shape !== shape1 && shape !== shape2) {
            return true;
        }
    }
    return false;
}



//bezier curve connect
function drawSmallCircle(left, top) {
    var smallCircle = new fabric.Circle({
        radius: 5,
        fill: 'green',
        left: left - 5,
        top: top - 5,
        selectable: true,
        hoverCursor: 'move', // Change the cursor to the "move" cursor on hover
        lockScalingX: true,   // Prevent horizontal scaling
        lockScalingY: true,   // Prevent vertical scaling
        hasControls: false,  // Hide selection controls
        hasBorders: false,   // Hide selection borders
    });
    return smallCircle;
}

// Function to calculate the midpoint between two points
function calculateMidpoint(point1, point2) {
    var x = (point1.x + point2.x) / 2;
    var y = (point1.y + point2.y) / 2;
    return { x: x, y: y };
}

// Calculate a point perpendicular to a line segment with a specified distance
function calculatePerpendicularPoint(point1, point2, distance) {
    // Step 1: Calculate the midpoint
    var midpoint = calculateMidpoint(point1, point2);

    // Step 2: Calculate the direction vector from point1 to point2
    var directionVector = {
        x: point2.x - point1.x,
        y: point2.y - point1.y,
    };

    // Step 3: Calculate a unit vector perpendicular to the direction vector
    var perpendicularVector = {
        x: -directionVector.y,
        y: directionVector.x,
    };

    // Calculate the length of the perpendicular vector
    var length = Math.sqrt(perpendicularVector.x * perpendicularVector.x + perpendicularVector.y * perpendicularVector.y);

    // Normalize the perpendicular vector to get a unit vector
    perpendicularVector.x /= length;
    perpendicularVector.y /= length;

    // Step 4: Scale the unit vector by the given distance
    var scaledVector = {
        x: perpendicularVector.x * distance,
        y: perpendicularVector.y * distance,
    };

    // Step 5: Add the scaled vector to the midpoint to get the final point
    var resultPoint = {
        x: midpoint.x + scaledVector.x,
        y: midpoint.y + scaledVector.y,
    };

    return resultPoint;
}

// Function to draw the initial line
function drawLineBezier(object1, object2) {
    var point1 = object1.getCenterPoint();
    var point2 = object2.getCenterPoint();
    midpoint = calculateMidpoint(point1, point2);
    var perpendicularPoint = calculatePerpendicularPoint(point1, point2, 0);

    controller1Coords = calculatePerpendicularPoint(point1, perpendicularPoint, 0);
    controller2Coords = calculatePerpendicularPoint(point2, perpendicularPoint, 0);
    //var centerPoint = drawSmallCircle(perpendicularPoint.x, perpendicularPoint.y);
    var controller1 = drawSmallCircle(controller1Coords.x, controller1Coords.y);
    var controller2 = drawSmallCircle(controller2Coords.x, controller2Coords.y);
    //var centerPointcoords = getCenterPoint(centerPoint);
    //var quadraticCurve = new fabric.Path(`M ${point1.x} ${point1.y} L ${controller1Coords.x} ${controller1Coords.y} ${controller2Coords.x} ${controller2Coords.y} Q ${centerPointcoords.x} ${centerPointcoords.y} ${point2.x} ${point2.y}`, {
    var quadraticCurve = new fabric.Path(`M ${point1.x} ${point1.y} C  ${controller1Coords.x} ${controller1Coords.y} ${controller2Coords.x} ${controller2Coords.y} ${point2.x} ${point2.y}`, {
        fill: '',
        stroke: 'blue',
        strokeWidth: 2,
        objectCaching: false,
        selectable: false,
        lockScalingX: true,   // Prevent horizontal scaling
        lockScalingY: true,   // Prevent vertical scaling
        hasControls: false,  // Hide selection controls
        hasBorders: false,   // Hide selection borders
    });
    var line = quadraticCurve;
    //centerPointSave = centerPoint
    //controller1Save = controller1;
    //controller2Save = controller2;
    line.controllers = [controller1, controller2];

    midX = (point1.x + 2*controller1Coords.x + 2*controller2Coords.x + point2.x)/6;
    midY = (point1.y + 2*controller1Coords.y + 2*controller2Coords.y + point2.y)/6;
    var textLine = addTextToLine('text', line, midX, midY);
    canvas.add(textLine);

    canvas.add(quadraticCurve);
    //canvas.add(quadraticCurve);
    canvas.add(controller1);
    canvas.add(controller2);
    controller1.on('moving', function () {
        updateLineBezier(line, object1, object2);
    });
    controller2.on('moving', function () {
        updateLineBezier(line, object1, object2);
    });
    return line;
}

// Function to update the line based on circle movements
function updateLineBezier(line, object1, object2) {
    controller1 = line.controllers[0];
    controller2 = line.controllers[1];
    var point1 = object1.getCenterPoint()
    var point2 = object2.getCenterPoint();
    var controller1Coords = controller1.getCenterPoint();
    var controller2Coords = controller2.getCenterPoint();
    var p1 = ["M", point1.x, point1.y];
    var p2 = ["C", controller1Coords.x, controller1Coords.y, controller2Coords.x, controller2Coords.y, point2.x, point2.y];

    midX = (point1.x + 2*controller1Coords.x + 2*controller2Coords.x + point2.x)/6;
    midY = (point1.y + 2*controller1Coords.y + 2*controller2Coords.y + point2.y)/6;
    line.text.set({ left: midX, top: midY });
    line.set({
        path: [p1, p2]
    });
    canvas.renderAll();
}