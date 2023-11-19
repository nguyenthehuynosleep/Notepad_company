
var canvas = new fabric.Canvas('canvas'); // Sử dụng fabric.StaticCanvas để tạo canvas tĩnh

var point1 = new fabric.Point(0, 0);
var point2 = new fabric.Point(50, 0);
var point3 = new fabric.Point(50, 100);
var point4 = new fabric.Point(100, 100);

// Tạo chuỗi path dựa vào point1 và point2


function newPath(point1, point2) {
    function pathDataFromTwoPoints(point1, point2) {
        return `M ${point1.x} ${point1.y} L ${point2.x} ${point2.y}`;
    }
    var path = new fabric.Path(pathDataFromTwoPoints(point1, point2), {
        stroke: 'red',
        strokeWidth: 1,
        fill: '', // Đảm bảo rằng không có màu nền
        originX: 'left',
        originY: 'top'
    });
    return path;
}

var path1 = newPath(point1, point3);
canvas.add(path1);

// Tạo một hình tròn
var circle = new fabric.Circle({
    radius: 50,
    fill: 'green',
    left: 0,
    top: 0
});

canvas.add(circle);

function isObjectBetweenPoints(object, point1, point2) {
    console.log('check');
    // Lấy tọa độ của đối tượng
    var objectX = object.left;
    var objectY = object.top;

    // Sắp xếp các điểm theo thứ tự tăng dần
    var minX = Math.min(point1.x, point2.x);
    var maxX = Math.max(point1.x, point2.x);
    var minY = Math.min(point1.y, point2.y);
    var maxY = Math.max(point1.y, point2.y);

    // Kiểm tra xem tọa độ của đối tượng có nằm giữa hai điểm không
    if (objectX >= minX && objectX <= maxX && objectY >= minY && objectY <= maxY) {
        return true;
    }
    return false;
}


circle.on('moving', function() {
    if (isObjectBetweenPoints(circle, point1, point2)) {
        circle.set('fill', 'red');
    } else {
        circle.set('fill', 'green');
    }
});


// Set the height and width of the canvas
canvas.setHeight(500);
canvas.setWidth(500);
