var canvas = new fabric.Canvas('canvas');
canvas.setHeight(500);
canvas.setWidth(500);

var line = null; // Define line variable
var centerPointSave = null;
var controller1Save = null;
var controller2Save = null;
var textnew = null;

var c1 = new fabric.Circle({
    radius: 20,
    fill: 'red',
    left: 50,
    top: 150,
    selectable: true,
});

var c2 = new fabric.Circle({
    radius: 20,
    fill: 'red',
    left: 200,
    top: 300,
    selectable: true,
});

var c3 = new fabric.Circle({
    radius: 20,
    fill: 'red',
    left: 200,
    top: 300,
    selectable: true,
});

function drawSmallCircle(left, top) {
    var smallCircle = new fabric.Circle({
        radius: 5,
        fill: 'green',
        left: left - 5,
        top: top - 5,
        selectable: true,
    });
    return smallCircle;
}


canvas.add(c1);
canvas.add(c2);

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

function addTextToCanvas(text, left, top) {
    var textObject = new fabric.Text(text, {
        left: left,
        top: top,
        fontSize: 14,
        fill: 'black',
        textAlign: 'center', // Đặt căn giữa theo chiều ngang
        originX: 'center',  // Đặt vị trí nguồn gốc theo chiều ngang là giữa
    });
    textnew = textObject
    canvas.add(textObject);
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
    });
    midX = (point1.x + 2 * controller1Coords.x + 2 * controller2Coords.x + point2.x) / 6;
    midY = (point1.y + 2 * controller1Coords.y + 2 * controller2Coords.y + point2.y) / 6;
    line = quadraticCurve;
    //centerPointSave = centerPoint
    controller1Save = controller1;
    controller2Save = controller2;
    console.log(line.path);
    canvas.add(quadraticCurve);
    // Calculate the center point of the line segment
    // var textLeft = perpendicularPoint.x;
    // var textTop = perpendicularPoint.y;
    var textLeft = midX;
    var textTop = midY;
    // Add text to the canvas at the center of the line
    addTextToCanvas("Your Text Here", textLeft, textTop);


    //canvas.add(centerPoint);
    canvas.add(controller1);
    canvas.add(controller2);
    // centerPoint.on('moving', function () {
    //     console.log('moving');
    //     updateLine(c1, c2, controller1Save, controller2Save);
    // });
    controller1.on('moving', function () {
        console.log('moving');
        updateLineBezier(object1, object2, controller1, controller2);
    });
    controller2.on('moving', function () {
        console.log('moving');
        updateLineBezier(object1, object2, controller1, controller2);
    });

}

// Initial drawing of the line
drawLineBezier(c1, c2);

// Function to update the line based on circle movements
function updateLineBezier(object1, object2, controller1, controller2) {
    var point1 = object1.getCenterPoint()
    var point2 = object2.getCenterPoint();
    var controller1Coords = controller1.getCenterPoint();
    var controller2Coords = controller2.getCenterPoint();
    //var centerPointcoords = getCenterPoint(centerPointSave);
    var perpendicularPoint = calculatePerpendicularPoint(point1, point2, 0);



    //calculate distance based on distance of point1 and point2, distance longer when point1 and point2 are far away
    //distance là điểm trên đường trung trực nằm giữa 2 điểm

    // var perpendicularPoint = calculatePerpendicularPoint(point1, point2, 0);

    // Create a new path string with updated coordinates
    //var newPath = `M ${point1.x} ${point1.y} Q ${perpendicularPoint.x} ${perpendicularPoint.y} ${point2.x} ${point2.y}`;
    var p1 = ["M", point1.x, point1.y];
    //var p2 = ["L", controller1Coords.x, controller1Coords.y];
    //var p3 = ["L", controller2Coords.x, controller2Coords.y];
    var p2 = ["C", controller1Coords.x, controller1Coords.y, controller2Coords.x, controller2Coords.y, point2.x, point2.y];
    // Update the entire path object using line.set()
    line.set({
        path: [p1, p2]
    });
    // Update text position
    var midpoint = calculateMidpoint(point1, point2);
    midX = (point1.x + 2 * controller1Coords.x + 2 * controller2Coords.x + point2.x) / 6;
    midY = (point1.y + 2 * controller1Coords.y + 2 * controller2Coords.y + point2.y) / 6;
    // var textLeft = perpendicularPoint.x
    // var textTop = perpendicularPoint.y
    var textLeft = midX;
    var textTop = midY;
    console.log(textnew)
    textnew.set({
        left: textLeft,
        top: textTop,
    });
    console.log(line.path);

    canvas.renderAll();
}

// Event listeners for circle movements
c1.on('moving', function () {
    updateLineBezier(c1, c2, controller1Save, controller2Save);
});

c2.on('moving', function () {
    updateLineBezier(c1, c2, controller1Save, controller2Save);
});


// Render canvas
canvas.renderAll();
