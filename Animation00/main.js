// Initialize Fabric.js canvas
var canvas = new fabric.Canvas("c");
var minionImg;
var isAnimating = false;

fabric.Image.fromURL(
  "minion.png",
  function (img) {
    minionImg = img;
    minionImg.set({
      width: 200,
      height: 200,
      left: 200,
      top: 200,
    });
    canvas.add(minionImg);
  },
  { crossOrigin: "anonymous" }
);


document.getElementById("animateButton").addEventListener("click", function () {
  if (!isAnimating && minionImg) {
    isAnimating = true;
    animateObject();
  }
});


function animateObject() {
  minionImg.animate("left", "+=100", {
    onChange: canvas.renderAll.bind(canvas),
    duration: 2000,
    easing: fabric.util.ease[document.getElementById("easing").value],
    onComplete: function () {
      minionImg.getElement().classList.add("fade-out");
      minionImg.animate("left", "-=100", {
        onChange: canvas.renderAll.bind(canvas),
        duration: 2000,
        easing: fabric.util.ease[document.getElementById("easing").value],
        onComplete: function () {
          minionImg.getElement().classList.remove("fade-out");
          if (isAnimating) {
            setTimeout(animateObject, 0);
          }
        },
      });
    },
  });
}
document
  .getElementById("animateAngleButton")
  .addEventListener("click", function () {
    if (!isAnimating && minionImg) {
      isAnimating = true;
      animateAngleObject();
    }
  });
function animateAngleObject() {
  minionImg.animate("angle", "+=50", {
    onChange: canvas.renderAll.bind(canvas),
    duration: 2000,
    easing: fabric.util.ease.easeInOutQuad,
    onComplete: function () {
      minionImg.getElement().classList.add("fade-out");
      minionImg.animate("angle", "-=50", {
        onChange: canvas.renderAll.bind(canvas),
        duration: 2000,
        easing: fabric.util.ease.easeInOutQuad,
        onComplete: function () {
          minionImg.getElement().classList.remove("fade-out");
          if (isAnimating) {
            setTimeout(animateAngleObject, 0);
          }
        },
      });
    },
  });
}
document
  .getElementById("animateTopButton")
  .addEventListener("click", function () {
    if (!isAnimating && minionImg) {
      isAnimating = true;
      animateTopObject();
    }
  });
function animateTopObject() {
  minionImg.animate("top", "-=100", {
    onChange: canvas.renderAll.bind(canvas),
    duration: 2000,
    easing: fabric.util.ease[document.getElementById("easing").value],
    onComplete: function () {
      minionImg.getElement().classList.add("fade-out");
      minionImg.animate("top", "+=100", {
        onChange: canvas.renderAll.bind(canvas),
        duration: 2000,
        easing: fabric.util.ease[document.getElementById("easing").value],
        onComplete: function () {
          minionImg.getElement().classList.remove("fade-out");
          if (isAnimating) {
            setTimeout(animateTopObject, 0);
          }
        },
      });
    },
  });
}
