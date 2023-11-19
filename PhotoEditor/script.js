var canvas = new fabric.Canvas("canvas");
let imgInput = document.getElementById("input_img");
let imgOutput = document.getElementById("output_img");
let fileInput = document.getElementById("file_input");
let addTextButton = document.getElementById("addTextButton");
let zoomInButton = document.getElementById("zoomInButton");
let zoomOutButton = document.getElementById("zoomOutButton");
let textInput = document.getElementById("text_input");
let textColorPicker = document.getElementById("textColorPicker");
let addTextColor = document.getElementById("addTextColor");
let fontSizeSelect = document.getElementById("fontSizeSelect");
let fontSelect = document.getElementById("fontSelect");
// Save image


let saveButton = document.getElementById("saveButton");
saveButton.addEventListener("click", saveImage);
let currentCanvas = canvas;
let lastCanvas = document.createElement("canvas");
let lastContext = lastCanvas.getContext("2d");
fileInput.addEventListener("change", (e) => {
  imgInput.src = URL.createObjectURL(e.target.files[0]);
});
function saveImage() {
  let dataURL = canvas.toDataURL("image/png");
  let a = document.createElement("a");
  a.href = dataURL;
  a.download = "saved_image.png";
  a.click();
}





imgInput.onload = function () {
  canvas.setBackgroundImage(imgInput.src, canvas.renderAll.bind(canvas));
  canvas.setWidth(imgInput.width);
  canvas.setHeight(imgInput.height);
  canvas.requestRenderAll();

  imgOutput.width = imgInput.width;
  imgOutput.height = imgInput.height;
  var ctx = imgOutput.getContext("2d");
  console.log(imgInput.width, imgInput.height);
  ctx.drawImage(imgInput, 0, 0, imgInput.width, imgInput.height);
};
let texts = [];
addTextButton.addEventListener("click", function () {
  let text = textInput.value;
  let textColor = textColorPicker.value;
  // let selectedFont = fontSelect.value;
  if (text) {
    let fabricText = new fabric.Text(text, {
      left: canvas.width / 2,
      top: canvas.height / 2,
      fill: `${textColor}`,
      fontSize: 20,
      fontFamily: "Arial",
    });
    canvas.add(fabricText);
    texts.push(fabricText);
    // console.log(texts);
  }
});


let images = [];
document.getElementById("addImageButton")
.addEventListener("click", function () {
    let fileInput = document.getElementById("imageInput");
    let file = fileInput.files[0];

    if (file) {
      let reader = new FileReader();

      reader.onload = function (e) {
        fabric.Image.fromURL(e.target.result, function (img) {
          img.set({
            left: canvas.width / 20,
            top: canvas.height / 20,
          });
          canvas.add(img);
          images.push(img);

          // Di chuyển hình ảnh mới thêm vào trên cùng
          canvas.moveTo(img, canvas.getObjects().length - 1);
        });
      };

      reader.readAsDataURL(file);
    }
  });




addTextColor.addEventListener("click", function () {
  let selectedObject = canvas.getActiveObject();
  let textColor = textColorPicker.value;
  let size = fontSizeSelect.value;
  let font = fontSelect.value;
  selectedObject.set({
    fontSize: size,
    fill: `${textColor}`,
    fontFamily: `${font}`,
  });
  canvas.renderAll();
});
function swapColorButtonHandler() {
  // let OldCanvas = document.getElementById("output_img");
  let src = cv.imread(imgOutput);
  //let src = cv.imread(imgInput);
  let dst = new cv.Mat();
  cv.cvtColor(src, dst, cv.COLOR_RGBA2GRAY);
  // Display the result in the output image element
  cv.imshow(imgOutput, dst);
  //get src of canvas
  let srcCanvas = document.getElementById("output_img");
  let newSrc = srcCanvas.toDataURL("image/png");
  canvas.setBackgroundImage(newSrc, canvas.renderAll.bind(canvas));
  // Release the src and dst matrices
  src.delete();
  dst.delete();
}




canvas.on('mouse:dblclick', function(event) {
  let target = event.target;
  if (target && target.type === 'text') {
      let newText = prompt('Edit text:', target.text);
      if (newText !== null) {
          target.set('text', newText);
          canvas.renderAll();
      }
  }
});

removeTextButton.addEventListener('click', function() {
  if (activeObject && activeObject.type === 'text') {
    // Xóa văn bản khỏi mảng
    let index = texts.indexOf(activeObject);
    if (index !== -1) {
        texts.splice(index, 1);
    }
    // Xóa đối tượng từ canvas
    canvas.remove(activeObject);

    canvas.renderAll();
  }
});
// Sự kiện khi click vào canvas để lấy đối tượng đang được chọn
canvas.on('mouse:down', function(event) {
    activeObject = event.target;
});










//Blur
function applyBlur() {
  // let OldCanvas = document.getElementById("output_img");
  let src = cv.imread(imgOutput);
  let dst = new cv.Mat();
  // Áp dụng hiệu ứng làm mờ Gaussian
  cv.GaussianBlur(src, dst, new cv.Size(15, 15), 0, 0, cv.BORDER_DEFAULT);
  cv.imshow(imgOutput, dst);
  let srcCanvas = document.getElementById("output_img");
  let newSrc = srcCanvas.toDataURL("image/png");
  canvas.setBackgroundImage(newSrc, canvas.renderAll.bind(canvas));
  // Giải phóng bộ nhớ
  src.delete();
  dst.delete();
}
//rotatetion
let rotationAngle = 90; // Initial rotation angle
function rotateImage() {
  let src = cv.imread(imgOutput);
  let dst = new cv.Mat();
  let dsize = new cv.Size(src.cols, src.rows);
  let center = new cv.Point(src.cols / 2, src.rows / 2);
  let M = cv.getRotationMatrix2D(center, rotationAngle, 1);
  cv.warpAffine(
    src,
    dst,
    M,
    dsize,
    cv.INTER_LINEAR,
    cv.BORDER_CONSTANT,
    new cv.Scalar()
  );
  // Chuyển đổi ma trận kết quả thành hình ảnh Fabric.js
  let imageData = new ImageData(
    new Uint8ClampedArray(dst.data),
    dst.cols,
    dst.rows
  );
  cv.imshow(imgOutput, dst);
  let srcCanvas = document.getElementById("output_img");
  let newSrc = srcCanvas.toDataURL("image/png");
  canvas.setBackgroundImage(newSrc, canvas.renderAll.bind(canvas));
  // Giải phóng bộ nhớ
  M.delete();
  src.delete();
  dst.delete();
  // Increment the rotation angle for the next click
  rotationAngle += 90;
}
//zoomIn
function zoomInImage() {
  let src = cv.imread(imgOutput);
  let dst = new cv.Mat();
  // You can try more different parameters
  cv.pyrUp(src, dst, new cv.Size(0, 0), cv.BORDER_DEFAULT);
  cv.imshow(imgOutput, dst);
  let srcCanvas = document.getElementById("output_img");
  let newSrc = srcCanvas.toDataURL("image/png");
  canvas.setBackgroundImage(newSrc, canvas.renderAll.bind(canvas));
  src.delete();
  dst.delete();
}
// zoomOut
function zoomOutImage() {
  let src = cv.imread(imgOutput);
  let dst = new cv.Mat();
  // You can try more different parameters
  cv.pyrDown(src, dst, new cv.Size(0, 0), cv.BORDER_DEFAULT);
  cv.imshow(imgOutput, dst);
  let srcCanvas = document.getElementById("output_img");
  let newSrc = srcCanvas.toDataURL("image/png");
  canvas.setBackgroundImage(newSrc, canvas.renderAll.bind(canvas));
  src.delete();
  dst.delete();
}

//sharpness
let imgMat, sharpMat;
function applySharpness() {
  if (!src) {
    console.log("Chưa có ảnh để xử lý.");
    return;
  }
  let src = cv.imread(imgOutput);
  let dst = new cv.size(5, 5);
  sharpMat = src.clone();
  // Tăng sắc nét bằng cách sử dụng GaussianBlur
  // let ksize = new cv.Size(5, 5); // Kích thước của kernel
  let sigmaX = 1.5; // Độ lệch chuẩn theo trục X
  let sigmaY = 1.5; // Độ lệch chuẩn theo trục Y (nếu có)
  // Áp dụng GaussianBlur để tăng sắc nét
  cv.GaussianBlur(src, src, dst, sigmaX, sigmaY, cv.BORDER_DEFAULT);
  // Hiển thị ảnh với sắc nét đã được áp dụng lên canvas
  cv.imshow(imgOutput, dst);
  let srcCanvas = document.getElementById("output_img");
  let newSrc = srcCanvas.toDataURL("image/png");
  canvas.setBackgroundImage(newSrc, canvas.renderAll.bind(canvas));
  // Release the src and dst matrices
  src.delete();
  dst.delete();
}
// Swap color
let swapColorButton = document.getElementById("swapColorButton");
swapColorButton.addEventListener("click", swapColorButtonHandler);
// BLur
let blurButton = document.getElementById("blurButton");
blurButton.addEventListener("click", applyBlur);
let rotationButton = document.getElementById("rotationButton");
rotationButton.addEventListener("click", rotateImage);
zoomInButton.addEventListener("click", zoomInImage);
zoomOutButton.addEventListener("click", zoomOutImage);
let filtersButton = document.getElementById("filtersButton");
// blurButton.addEventListener("click", filtersImage);
document.getElementById("sharpnessButton").addEventListener("click", applySharpness);
document.getElementById("applyBrightness").addEventListener("click", applyBrightness);

filtersButton.addEventListener("click", filtersImage);



//Quay về ban đầu
function filtersImage() {
  let src = cv.imread(imgInput);
  let dst = new cv.Mat();
  cv.cvtColor(src, src, cv.COLOR_RGBA2RGB, 0);
  cv.bilateralFilter(src, dst, 5, 1000, 1000, cv.BORDER_DEFAULT);
  cv.imshow(imgOutput, dst);
  let srcCanvas = document.getElementById("output_img");
  let newSrc = srcCanvas.toDataURL("image/png");
  canvas.setBackgroundImage(newSrc, canvas.renderAll.bind(canvas));
  src.delete();
  dst.delete();
}


let target = event.target;
if (target && target.type === 'text') {
    let newText = prompt('Edit text:', target.text);
    if (newText !== null) {
        target.set('text', newText);
        canvas.renderAll();
    }
}



// Độ Sáng (Chưa Hoạt Động)
function applyBrightness() {
  let src = cv.imread(imgOutput);
  let dst = new cv.Mat();
  let gaussianBlur = new cv.Mat();
  cv.GaussianBlur(src, gaussianBlur, new cv.Size(0, 0), 2, 2, cv.BORDER_DEFAULT);
  let sharpened = new cv.Mat();
  cv.subtract(src, gaussianBlur, sharpened);
  cv.addWeighted(src, 1.5, sharpened, -0.5, 0, dst);
  cv.imshow(imgOutput, dst);
  let srcCanvas = document.getElementById("output_img");
  let newSrc = srcCanvas.toDataURL("image/png");
  canvas.setBackgroundImage(newSrc, canvas.renderAll.bind(canvas));
  // Release the matrices
  src.delete();
  dst.delete();
  kernel.delete();
  src.delete();
  dst.delete();
  gaussianBlur.delete();
  sharpened.delete();
}
document.getElementById('applyBrightness').addEventListener('click', applyBrightness);





// Độ Nét (Hoạt Động Tốt)
function applySharpness() {
  let src = cv.imread(imgOutput);
  let dst = new cv.Mat();
  // Create a kernel for increasing contrast (sharpening)
  let kernel = new cv.Mat(3, 3, cv.CV_32F);
  kernel.data32F.set([0, -1, 0, -1, 5, -1, 0, -1, 0]);
  // Apply the filter
  cv.filter2D(src, dst, -1, kernel, new cv.Point(-1, -1), 0, cv.BORDER_DEFAULT);
  // Display the sharpened image
  cv.imshow(imgOutput, dst);
  // Convert the result to a data URL for fabric.js canvas
  let srcCanvas = document.getElementById("output_img");
  let newSrc = srcCanvas.toDataURL("image/png");
  canvas.setBackgroundImage(newSrc, canvas.renderAll.bind(canvas));
  // Release the matrices and kernel
  src.delete();
  dst.delete();
  kernel.delete();
}
document.getElementById('sharpnessButton').addEventListener('click', applySharpness);


