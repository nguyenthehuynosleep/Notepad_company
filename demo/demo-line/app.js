var canvas = new fabric.Canvas('canvas');

var isDrawing = false;
var startPoint = { x: 0, y: 0 };
var line;

canvas.on('mouse:down', function (options) {
    if (!isDrawing) return;
    var pointer = canvas.getPointer(options.e);
    startPoint = pointer;

    if (isDrawing) {
        line = new fabric.Line([startPoint.x, startPoint.y, startPoint.x, startPoint.y], {
            fill: 'red',
            stroke: 'red',
            strokeWidth: 2,
            //dont select new line
            selectable: false
        });
        canvas.add(line); // Thêm đối tượng line vào canvas
    }
});

canvas.on('mouse:move', function (options) {
    if (!isDrawing) return;
    var pointer = canvas.getPointer(options.e);
    if (line) { // Kiểm tra xem đối tượng line đã được khởi tạo chưa
        var pointer = canvas.getPointer(options.e);
        line.set({ x2: pointer.x, y2: pointer.y });
        canvas.renderAll();
    }
    canvas.renderAll();
});

canvas.on('mouse:up', function () {
    line = null;
});

// Ghi đè chức năng mặc định khi chuột phải được nhấn để tránh hiển thị menu ngữ cảnh trình duyệt
canvas.on('contextmenu', function (e) {
    e.e.preventDefault();
});

// Bắt đầu vẽ khi nhấn nút "Bắt đầu vẽ"
document.getElementById('startDrawing').addEventListener('click', function () {
    isDrawing = true;
    document.getElementById('startDrawing').style.display = 'none';
    document.getElementById('stopDrawing').style.display = 'block';
});

// Dừng vẽ khi nhấn nút "Dừng vẽ"
document.getElementById('stopDrawing').addEventListener('click', function () {
    isDrawing = false;
    document.getElementById('startDrawing').style.display = 'block';
    document.getElementById('stopDrawing').style.display = 'none';
});

canvas.setWidth(800); // Set the width to 800
canvas.setHeight(600); // Set the height to 600