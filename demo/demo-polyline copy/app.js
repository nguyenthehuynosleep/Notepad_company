var canvas = new fabric.Canvas('canvas');
var centerPointSave = null;
canvas.setHeight(500);
canvas.setWidth(500);

var line = null; // Define line variable

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
    top: 150,
    selectable: true,
});

var c3 = new fabric.Circle({
    radius: 20,
    fill: 'red',
    left: 200,
    top: 300,
    selectable: true,
});

function drawSmallCircle (left, top) {
    var smallCircle = new fabric.Circle({
        radius: 5,
        fill: 'green',
        left: left-5,
        top: top-5,
        selectable: true,
    });
    return smallCircle;
}


canvas.add(c1);
canvas.add(c2);

// Function to get the center point of a circle
function getCenterPoint(circle) {
    return {
        x: circle.left + circle.radius,
        y: circle.top + circle.radius,
    };
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
function drawLine(object1, object2) {
    var point1 = getCenterPoint(object1);
    var point2 = getCenterPoint(object2);
    midpoint = calculateMidpoint(point1, point2);
    var perpendicularPoint = calculatePerpendicularPoint(point1, point2, 0);
    var centerPoint = drawSmallCircle(perpendicularPoint.x, perpendicularPoint.y);
    var centerPointcoords = getCenterPoint(centerPoint);
    console.log(centerPointcoords)  ;
    var quadraticCurve = new fabric.Path(`M ${point1.x} ${point1.y} Q ${centerPointcoords.x} ${centerPointcoords.y} ${point2.x} ${point2.y}`, {
        fill: '',
        stroke: 'blue',
        strokeWidth: 2,
        objectCaching: false
    });
    line = quadraticCurve;
    centerPointSave = centerPoint
    console.log(line.path);
    canvas.add(quadraticCurve);
    canvas.add(centerPoint);
    centerPoint.on('moving', function () {
        console.log('moving');
        updateLine(c1, c2, centerPointSave);
    });

}

// Initial drawing of the line
drawLine(c1, c2);

// Function to update the line based on circle movements
function updateLine(c1, c2, centerPointSave) {
    var point1 = getCenterPoint(c1);
    var point2 = getCenterPoint(c2);
    var centerPointcoords = getCenterPoint(centerPointSave);
    //calculate distance based on distance of point1 and point2, distance longer when point1 and point2 are far away
    //distance là điểm trên đường trung trực nằm giữa 2 điểm

    // var perpendicularPoint = calculatePerpendicularPoint(point1, point2, 0);

    // Create a new path string with updated coordinates
    //var newPath = `M ${point1.x} ${point1.y} Q ${perpendicularPoint.x} ${perpendicularPoint.y} ${point2.x} ${point2.y}`;
    var p1 = ["M", point1.x, point1.y];
    var p2 = ["Q", centerPointcoords.x, centerPointcoords.y, point2.x, point2.y];
    // Update the entire path object using line.set()
    line.set({
        path: [p1, p2]
    });
    console.log(line.path);

    canvas.renderAll();
}

// Event listeners for circle movements
c1.on('moving', function () {
    updateLine(c1, c2, centerPointSave);
});

c2.on('moving', function () {
    updateLine(c1, c2, centerPointSave);
});


// Render the canvas
canvas.renderAll();
canvas.setHeight(500);
canvas.setWidth(500);