var canvas = new fabric.Canvas('canvas');

// Create an array to store the port objects of the rectangle
var shapes = []
var allPorts = []; // Mảng chứa tất cả các port


var rect = new fabric.Rect({
    left: 100,
    top: 100,
    fill: 'red',
    width: 200,
    height: 200
});
canvas.add(rect);
shapes.push(rect);

var circle = new fabric.Circle({
    radius: 100,
    fill: 'green',
    left: 400,
    top: 100
});

canvas.add(circle);
shapes.push(circle);

var triangle = new fabric.Triangle({
    width: 100,
    height: 100,
    fill: 'blue',
    left: 200,
    top: 400
});

canvas.add(triangle);
shapes.push(triangle);


function findMidpoint(edge) {
    return {
        x: (edge.x1 + edge.x2) / 2,
        y: (edge.y1 + edge.y2) / 2
    };
}

function addPortToEdge(x, y) {
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
        originX: 'center',
        originY: 'center'
    });
    canvas.add(circle);
    allPorts.push(circle); // Thêm port mới vào mảng allPorts

    return circle;
}

function updatePortPositions(shape) {
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
        console.log('moving');
        updatePortPositions(shape);
    });

    shape.on('scaling', function (e) {
        console.log('scaling');
        updatePortPositions(shape);
    });
}


addPortsToRect(rect);
addPortsToRect(circle);
addPortsToRect(triangle);

// Render the Canvas
canvas.renderAll();

function isPointInPort(point) {
    // Kiểm tra nếu điểm nằm trong port
    // var dx = point.x - port.left;
    // var dy = point.y - port.top;
    // var distance = Math.sqrt(dx * dx + dy * dy);
    // return distance <= port.radius;
    for (var i = 0; i < allPorts.length; i++) {
        var port = allPorts[i];
        var dx = point.x - port.left;
        var dy = point.y - port.top;
        var distance = Math.sqrt(dx * dx + dy * dy);
        if (distance <= port.radius) {
            return true;
        }
    }
    return false;
}

canvas.on('mouse:down', function (options) {
    var pointer = canvas.getPointer(options.e);

    // allPorts.forEach(function (port, portIndex) {
    //     if (isPointInPort(pointer, port)) {
    //         console.log('Clicked on Port index: ' + portIndex);
    //     }
    // });
    if (isPointInPort(pointer)) {
        console.log('Clicked on Port');
    }
    else {
        console.log('Clicked on canvas');
    }
});


// Set the height and width of the canvas
canvas.setHeight(500);
canvas.setWidth(500);
