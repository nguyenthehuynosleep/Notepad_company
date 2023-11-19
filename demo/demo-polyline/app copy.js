var canvas = new fabric.Canvas('canvas'); // Sử dụng fabric.StaticCanvas để tạo canvas tĩnh

// tạo polyline

var circle = new fabric.Circle({
    radius: 20,
    fill: 'green',
    left: 300,
    top: 100
});

var polyline = new fabric.Polyline([
    { x: 50, y: 50 },
    { x: 200, y: 50 },
    { x: 200, y: 200 },
], {
    fill: '',
    stroke: 'red',
    strokeWidth: 3,
    opacity: 0.5,
    strokeLineCap: 'round',
    strokeLineJoin: 'round',
    strokeDashArray: [10, 5],
});

canvas.add(polyline);
canvas.add(circle);

//is polyline intersect with circle

function isPolylineIntersectWithCircle(polyline, shape) {
    return polyline.intersectsWithObject(shape);
}


circle.on('moving', function() {
    if (isPolylineIntersectWithCircle(polyline, circle)) {
        circle.set('fill', 'red');
        console.log('intersect');
    } else {
        circle.set('fill', 'green');
        console.log('not intersect');
    }
});


// Set the height and width of the canvas
canvas.setHeight(500);
canvas.setWidth(500);
