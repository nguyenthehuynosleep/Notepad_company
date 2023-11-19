

var size = 0;
var stringAnswer = [];
var numberTrue = [];
var listCheckAnswer = [];
var results_pair = [];
var isLineChoosen = false;
var ObjSelectedBefore = -1;
var ObjSelectedCur = -1;
var CollumnSelecAfter = -1;
var ColmnSelecBefor = -1;
var checkBefore = 0;
var ObjSelectedCur_left = 0;
var ObjSelectedCur_top = 0;
var ObjSelectedBefore_left = 0;
var ObjSelectedBefore_top = 0;
var checkIdObj = 0;
var slides = null


var canvas = new fabric.Canvas('canvas');


function findTargetPort(object, ports) {
    let points = new Array(4);
    let port;
    if (ports) {
      port = ports;
    } else {
      port = object.__corner;
    }
    switch (port) {

      case 'mt':
        points = [
          object.left + (object.width / 2), object.top,
          object.left + (object.width / 2), object.top
        ];
        break;
      case 'mr':
        points = [
          object.left + object.width, object.top + (object.height / 2),
          object.left + object.width, object.top + (object.height / 2)
        ];
        break;
      case 'mb':
        points = [
          object.left + (object.width / 2), object.top + object.height,
          object.left + (object.width / 2), object.top + object.height
        ];
        break;
      case 'ml':
        points = [
          object.left, object.top + (object.height / 2),
          object.left, object.top + (object.height / 2)
        ];
        break;

      default:
        break;
    }

    return {
      x1: points[0], y1: points[1],
      x2: points[2], y2: points[3]
    };
  }
  function findTargetPortScale(object, ports) {
    let points = new Array(4);
    let port;
    if (ports) {
      port = ports;
    } else {
      port = object.__corner;
    }
    switch (port) {

      case 'mt':
        points = [
          object.left + (object.width * object.scaleX / 2), object.top,
          object.left + (object.width * object.scaleX / 2), object.top
        ];
        break;
      case 'mr':
        points = [
          object.left + object.width * object.scaleX, object.top + (object.height * object.scaleY / 2),
          object.left + object.width * object.scaleX, object.top + (object.height * object.scaleY / 2)
        ];
        break;
      case 'mb':
        points = [
          object.left + (object.width * object.scaleX / 2), object.top + object.height,
          object.left + (object.width * object.scaleX / 2), object.top + object.height
        ];
        break;
      case 'ml':
        points = [
          object.left, object.top + (object.height * object.scaleY / 2),
          object.left, object.top + (object.height * object.scaleY / 2)
        ];
        break;

      default:
        break;
    }

    return {
      x1: points[0], y1: points[1],
      x2: points[2], y2: points[3]
    };
  }

  function addPort(object, canvas, objectID, column) {
    if (object.name === 'p1' || object.name === 'p2' || object.name === 'p0') {
      return;
    }
    let ports;
    if (
      object.type === 'rect' ||
      object.type === 'circle' ||
      object.type === 'ellipse' ||
      object.type === 'polygon' ||
      object.type === 'path' ||
      object.type === 'group' ||
      object.type === 'image'
    ) {
      if (column === 1) {
        ports = ['mr'];
      }
      else {
        ports = ['ml'];
      }
    }
    if (ports && ports.length > 0 && object.type !== 'image' && !object.hasOwnProperty('svgUid')) {
      ports.forEach(port => {
        const point = findTargetPort(object, port);
        var c = new fabric.Circle({
          left: point.x1,
          top: point.y1,
          radius: 1,
          fill: 'red',
          name: 'port',
          port,
          portID: objectID,
          column,
          originX: 'center',
          originY: 'center',
          selectable: false,
          isChosen: false
        });
        canvas.add(c);
      });
    }
    else if (ports && ports.length > 0) {
      ports.forEach(port => {
        const point = findTargetPortScale(object, port);
        var c = new fabric.Circle({
          left: point.x1,
          top: point.y1,
          radius: 1,
          fill: 'red',
          name: 'port',
          port,
          portID: objectID,
          column,
          originX: 'center',
          originY: 'center',
          selectable: false,
          isChosen: false
        });
        canvas.add(c);
      });
    }
  }
  function createCurves(canvas, points, portId1, portId2) {
    canvas.on({
      'object:selected': onObjectSelected,
      // 'object:moving': onObjectMoving, //decrepitated
    });

    (function drawQuadratic(points) {

      var line = new fabric.Path('M 65 0 Q 100, 100, 200, 0',
        { fill: '', stroke: '#ccc', objectCaching: false, isLine: true, linePortId: portId1 });

      line.path[0][1] = points.x1;
      line.path[0][2] = points.y1;

      line.path[1][1] = 200;
      line.path[1][2] = 200;

      line.path[1][3] = points.x2;
      line.path[1][4] = points.y2;

      line.selectable = false;
      canvas.add(line);
      fabric.Polyline.prototype._setPositionDimensions.call(line, {});
      line.setCoords();

      const objects1 = canvas.getObjects().filter(obj =>
        (obj.id && obj.id > 0)
      );
      if (objects1 && objects1.length > 0) {
        objects1.forEach(object => {
          canvas.remove(object);
          canvas.add(object);
        });
      }

      const objects2 = canvas.getObjects().filter(obj =>
        (obj.port === 'ml' || obj.port === 'mr')
      );
      if (objects2 && objects2.length > 0) {
        objects2.forEach(object => {
          canvas.remove(object);
          canvas.add(object);
        });
      }

      /* #region  decrepitated */
      // var p1 = makeCurvePoint(200, 200, null, line, null);
      // p1.name = "p1";
      // p1.port = object.objid;
      // canvas.add(p1);

      // var p0 = makeCurveCircle(points.x1, points.y1, line, p1, null);
      // p0.name = "p0";
      // canvas.add(p0);

      // var p2 = makeCurveCircle(300, 100, null, p1, line);
      // p2.name = "p2";
      // canvas.add(p2);
      /* #endregion */

    })(points);

    /* #region  decrepitated */
    function makeCurveCircle(left, top, line1, line2, line3) {
      var c = new fabric.Circle({
        left,
        top,
        strokeWidth: 5,
        radius: 12,
        fill: '#fff',
        stroke: '#666'
      });

      c.hasBorders = c.hasControls = false;

      c.line1 = line1;
      c.line2 = line2;
      c.line3 = line3;

      return c;
    }

    function makeCurvePoint(left, top, line1, line2, line3) {
      var c = new fabric.Circle({
        left,
        top,
        strokeWidth: 8,
        name: 'linecnt',
        radius: 14,
        fill: '#fff',
        stroke: '#666'
      });

      c.hasBorders = c.hasControls = false;

      c.line1 = line1;
      c.line2 = line2;
      c.line3 = line3;

      return c;
    }
    /* #endregion */

    function onObjectSelected(e) {
      var activeObject = e.target;

      if (activeObject.name === 'p0' || activeObject.name === 'p2') {
        activeObject.line2.animate('opacity', '1', {
          duration: 200,
          onChange: canvas.renderAll.bind(canvas),
        });
        activeObject.line2.selectable = true;
      }
    }

    function onObjectMoving(e) {
      if (e.target.name === 'p0' || e.target.name === 'p2') {
        var p = e.target;

        if (p.line1) {
          p.line1.path[0][1] = p.left;
          p.line1.path[0][2] = p.top;
        }
        else if (p.line3) {
          p.line3.path[1][3] = p.left;
          p.line3.path[1][4] = p.top;
        }
      }
      else if (e.target.name === 'p1') {
        var p = e.target;

        if (p.line2) {
          p.line2.path[1][1] = p.left;
          p.line2.path[1][2] = p.top;
        }
      }
      else if (e.target.name === 'p0' || e.target.name === 'p2') {
        var p = e.target;

        p.line1 && p.line1.set({ x2: p.left, y2: p.top });
        p.line2 && p.line2.set({ x1: p.left, y1: p.top });
        p.line3 && p.line3.set({ x1: p.left, y1: p.top });
        p.line4 && p.line4.set({ x1: p.left, y1: p.top });
      }
    }
  }

  function getPortCenterPoint(object, port) {
    var x1 = 0;
    var y1 = 0;

    switch (port) {

      case 'mt':
        x1 = object.left + (object.width / 2);
        y1 = object.top;
        break;

      case 'mr':
        x1 = object.left + object.width;
        y1 = object.top + (object.height / 2);
        break;

      case 'mb':
        x1 = object.left + (object.width / 2);
        y1 = object.top + object.height;
        break;
      case 'ml':
        x1 = object.left;
        y1 = object.top + (object.height / 2);
        break;

      default:
        break;
    }

    return {
      x1, y1,
      x2: x1, y2: y1
    };
  }
  function getPortOnMoving(object, canvas, objectID, column) {
    if (object.name === 'p1' || object.name === 'p2' || object.name === 'p0') {
      return;
    }
    let ports;
    if (
      object.type === 'rect' ||
      object.type === 'circle' ||
      object.type === 'ellipse' ||
      object.type === 'polygon' ||
      object.type === 'path' ||
      object.type === 'group' ||
      object.type === 'image'
    ) {
      if (column === 1) {
        ports = ['mr'];
      }
      else {
        ports = ['ml'];
      }
    }
    if (ports && ports.length > 0 && object.type !== 'image' && !object.hasOwnProperty('svgUid')) {
      var points = findTargetPort(object, ports[0]);
      return { result: 0, points };
    }
    else if (ports && ports.length > 0) {
      var points = findTargetPortScale(object, ports[0]);
      return { result: 0, points };
    }
    return {
      result: -1, points: {
        x1: 0, y1: 0,
        x2: 0, y2: 0
      }
    };
  }

  function choosePort(canvas, objectID) {
    if (objectID === undefined || objectID == null) {
      return;
    }

    const object = canvas.getObjects().filter(obj =>
      (obj.port === 'ml' || obj.port === 'mr') &&
      obj.portID === objectID
    );
    if (object && object.length > 0) {
      object[0].set({
        isChosen: true,
        radius: 1,
      });
    }
    canvas.renderAll();
  }
  function unchoosePort(canvas) {
    const objects = canvas.getObjects().filter(obj =>
      (obj.port === 'ml' || obj.port === 'mr')
    );
    if (objects && objects.length > 0) {
      objects.forEach(object => {
        object.set({
          isChosen: false,
          radius: 1,
        });
      });
    }
    canvas.renderAll();
  }
  function isPortChoosen(canvas) {
    const objects = canvas.getObjects().filter(obj =>
      (obj.port === 'ml' || obj.port === 'mr') && obj.isChosen === true
    );
    if (objects && objects.length > 0) {
      return true;
    }
    return false;
  }
  function getLine(canvas, portId) {
    var pairIndex = results_pair.findIndex(x => x.id1 === portId || x.id2 === portId);
    if (pairIndex !== -1) {
      var pair = results_pair[pairIndex];
      const objects = canvas.getObjects().filter(obj =>
        obj.linePortId === pair.id1 && obj.isLine
      );
      if (objects && objects.length > 0) {
        return objects[0];
      }
    }
    return -1;
  }
  function chooseLine(canvas, line) {
    const objects = canvas.getObjects().filter(obj =>
      obj.isLine &&
      obj.stroke === 'black'
    );
    if (objects && objects.length > 0) {
      objects.forEach(object => {
        object.set({
          stroke: '#ccc',
          strokeWidth: 1
        });
      });
    }
    line.set({
      stroke: 'black',
      strokeWidth: 2
    });
    canvas.renderAll();
    isLineChoosen = true;
  }
  function unchooseLine(canvas) {
    const objects = canvas.getObjects().filter(obj =>
      obj.isLine &&
      obj.stroke === 'black'
    );
    if (objects && objects.length > 0) {
      objects.forEach(object => {
        object.set({
          stroke: '#ccc',
          strokeWidth: 1
        });
      });
    }
    canvas.renderAll();
    isLineChoosen = false;
  };
  function getOtherPortId(canvas, portId) {
    var pairIndex = results_pair.findIndex(x => x.id1 === portId || x.id2 === portId);
    if (pairIndex !== -1) {
      var pair = results_pair[pairIndex];
      if (pair.id1 === portId) {
        return pair.id2;
      } else {
        return pair.id1;
      }
    }
    return -1;
  }
  function getPortById(canvas, portId) {
    if (portId === undefined || portId == null) {
      return -1;
    }

    const object = canvas.getObjects().filter(obj =>
      (obj.port === 'ml' || obj.port === 'mr') &&
      obj.portID === portId
    );
    return object[0];
  }
var _this = this;
  canvas.on('mouse:up', function (e) {
    if (e.subTargets && e.subTargets.length > 0 && e.subTargets[0].typeRect === 'anchor-content') {
      var item = e.subTargets[0];
      _this.detailNotifytion(item.content);
    }
    else if (e.target !== null) {
      var objectList = e;
      const objId = objectList.target['id'];
      const objCol = objectList.target['Column'];
      ObjSelectedBefore = ObjSelectedCur;
      ObjSelectedCur = objId;

      ColmnSelecBefor = CollumnSelecAfter;
      CollumnSelecAfter = objCol;

      checkIdObj = checkBefore;
      checkBefore++;

      ObjSelectedBefore_left = ObjSelectedCur_left;
      ObjSelectedBefore_top = ObjSelectedCur_top;

      /* #region  get port top left */
      const object = canvas.getObjects().filter(obj =>
        (obj.port === 'ml' || obj.port === 'mr') &&
        obj.portID === objId
      );
      if (object && object.length > 0) {
        ObjSelectedCur_top = object[0].top;
        ObjSelectedCur_left = object[0].left;
      }
      /* #endregion */
      // ObjSelectedCur_top = objectList.target.top;
      // ObjSelectedCur_left = objectList.target.left;

      if ((ColmnSelecBefor === 1 && CollumnSelecAfter === 2 && checkIdObj >= 1)
        || (ColmnSelecBefor === 2 && CollumnSelecAfter === 1 && checkIdObj >= 1)) {
        //console.log("ObjSelectedCur: " + CollumnSelecAfter, "ObjSelectedBefore: " + ColmnSelecBefor);
        checkBefore = 0;

        if (!checkExistId(ObjSelectedCur) && !checkExistId(ObjSelectedBefore)) {
          const connectorLine = {
            x1: ObjSelectedCur_left, y1: ObjSelectedCur_top,
            x2: ObjSelectedBefore_left, y2: ObjSelectedBefore_top
          };

          createCurves(canvas, connectorLine, ObjSelectedBefore, ObjSelectedCur);
          listCheckAnswer.push(ObjSelectedBefore + '-' + ObjSelectedCur);
          results_pair.push({
            id1: ObjSelectedBefore,
            id2: ObjSelectedCur
          });
          unchoosePort(canvas);
          unchooseLine(canvas);
        }
        else {
          unchoosePort(canvas);
          unchooseLine(canvas);
        }
      } else {
        if (isPortChoosen(canvas)) {
          unchoosePort(canvas);
          var targetLine = getLine(canvas, objId);
          if (targetLine !== -1) {
            chooseLine(canvas, targetLine);
          }
        }
        else {
          choosePort(canvas, objId);
          var targetLine = getLine(canvas, objId);
          if (targetLine !== -1) {
            chooseLine(canvas, targetLine);
          }
        }
      }

      // if (e.target.port == "ml" || e.target.port == "mr") {
      //   var targetLine = getLine(canvas, e.target.portID);
      //   if (targetLine !== -1) {
      //     chooseLine(canvas, targetLine)
      //   }
      // } else {
      //   unchooseLine(canvas);
      // }
      if (listCheckAnswer.length === size) {
        //console.log(listCheckAnswer)
        var isCheck = true;
        for (const item of listCheckAnswer) {
          if (stringAnswer.includes(item) === false) {
            isCheck = false;
          } else {
            numberTrue.push(1);
          }
        }
        // if (isCheck === true) {
        //   alert(`Bạn đã làm đúng hoàn toàn`)
        // } else {
        //   alert(`Bạn làm đúng ${numberTrue} / ${size} cặp`)
        // }
      }
    } else {
      unchoosePort(canvas);
      unchooseLine(canvas);
    }
    if (slides) {
        slides.lockSwipes(false);
    }
    else {
        return;
    }
    if (this.isDragging) {
      this.setViewportTransform(this.viewportTransform);
      this.isDragging = false;
      this.selection = true;
    }
  });

const circle = new fabric.Circle({
  radius: 20, fill: 'green', left: 100, top: 100, name: 'p1', port: 'ml', portID: 1, Column: 1
});

const circle2 = new fabric.Circle({
  radius: 20, fill: 'green', left: 300, top: 100, name: 'p2', port: 'mr', portID: 2, Column: 2
});

addPort(circle, canvas, 1, 1);
addPort(circle2, canvas, 2, 2);

canvas.add(circle);

canvas.setHeight(500);
canvas.setWidth(500);
