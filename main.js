//@include "libs.js"
var doc = app.activeDocument;
var lay = doc.activeLayer;
var rX = doc.width;
var rY = doc.height;
// stroked, filled
// fillColor, strokeColor
// strokeCap = StrokeCap.ROUNDEDCAP
// setEntirePath, translate, resize
generateParam();
function generateGrid() {
    this.getP = function (uv) {
        var p = new Vec3(uv.x(), uv.y(), 0);
        p.v[2] = p.v[2] + sin(uv.dot(uv) * 4.) * 0.4;
        // p = p.rot(1.4,'y');
        p = p.rot(.3, 'x');
        return p;
    };
    var group = lay.groupItems.add();
    var verts = [];
    var itersi = 40;
    var itersj = 40;
    var stepSz = new Vec(1 / itersi, 1 / itersj);
    for (var i = 0; i < itersi; i++) {
        for (var j = 0; j < itersj; j++) {
            var uv = new Vec(i / itersi * 2. - 1., j / itersj * 2. - 1.);
            var p = this.getP(uv);
            // let nextP = this.getP(uv.add(stepSz));
            // let nextPx = this.getP(uv.add(new Vec(stepSz.x(),0)));
            // let nextPy = this.getP(uv.add(new Vec(0,stepSz.y())));
            var zoffs = 2;
            var zdiv = 0.4;
            p = p.div((p.z() + zoffs) / zdiv);
            p = p.mul(rX * 0.8);
            var c = group.pathItems.add();
            c.stroked = true;
            c.filled = false;
            c.closed = false;
            c.strokeCap = StrokeCap.ROUNDENDCAP;
            c.strokeWidth = 3;
            c.setEntirePath([[p.x(), p.y()], [p.x(), p.y()],]);
            // c.setEntirePath([ 
            //     shapes.cross(
            //         new Vec(p.x(),p.y()), stepSz.x()
            //         )
            //     ]);
            c.translate(rX / 4, rY / 4);
            c.translate(rX / 4, rY / 4);
        }
    }
    //c.setEntirePath(verts);
}
function generateParam() {
    var strokeWidth = 1;
    var orth = false;
    var obj = "cylinder"; // torus, sphere, cylinder
    var itersi = 10;
    var itersj = 10;
    var renderPrimitive = "lines"; // points, lines 
    var smoothLines = true;
    var backFaceCull = true;
    var group = lay.groupItems.add();
    this.getParametricP = function (uv) {
        var p;
        if (obj == "sphere") {
            uv.setY(uv.y() / 2);
            p = new Vec3(sin(uv.x()) * cos(uv.y()), sin(uv.x()) * sin(uv.y()), cos(uv.x()));
        }
        else if (obj == "torus") {
            var a = 0.2;
            var b = 0.6;
            p = new Vec3((b + a * cos(uv.x())) * cos(uv.y()), (b + a * cos(uv.x())) * sin(uv.y()), a * sin(uv.x()));
        }
        else if (obj == "cylinder") {
            var w = 0.2;
            p = new Vec3(cos(uv.x()) * w, uv.y() / tau, sin(uv.x()) * w);
        }
        return p;
    };
    this.transformP = function (p) {
        p = p.rot(0.8, 'y');
        p = p.rot(.3, 'x');
        p = p.rot(1.3, 'z');
        return p;
    };
    this.projectP = function (p) {
        if (orth) {
            p = p.mul(rX * 0.2);
        }
        else {
            var zoffs = 2;
            var zdiv = 0.4;
            p = p.div((p.z() + zoffs) / zdiv);
            p = p.mul(rX * 0.8);
        }
        return p;
    };
    this.getNormal = function (uv, p) {
        var eps = 0.02;
        var xtan = this.getParametricP(uv.add(new Vec(0, eps))).sub(p);
        var ytan = this.getParametricP(uv.add(new Vec(eps, 0))).sub(p);
        var n = xtan.cross(ytan);
        n = n.normalize();
        n = this.transformP(n);
        n = this.projectP(n);
        return n;
    };
    this.getP = function (uv) {
        uv = uv.mul(tau);
        var p = this.getParametricP(uv);
        p = this.transformP(p);
        p = this.projectP(p);
        return p;
    };
    var stepSz = new Vec(1 / itersi, 1 / itersj);
    if (renderPrimitive === "points") {
        for (var i = 0; i < itersi; i++) {
            for (var j = 0; j < itersj; j++) {
                var uv = new Vec(i / itersi, j / itersj);
                var p = this.getP(uv);
                var c = group.pathItems.add();
                c.stroked = true;
                c.filled = false;
                c.closed = false;
                c.strokeCap = StrokeCap.ROUNDENDCAP;
                c.strokeWidth = strokeWidth;
                c.setEntirePath([[p.x(), p.y()], [p.x(), p.y()]]);
                c.translate(rX / 4, rY / 4);
            }
        }
    }
    else if (renderPrimitive == "lines") {
        var rows = [];
        var cols = [];
        var rowNormals = [];
        var colNormals = [];
        // Gen pts
        for (var i = 0; i < itersi; i++) {
            var col = [];
            var normalCol = [];
            for (var j = 0; j < itersj; j++) {
                var uv = new Vec(i / itersi, j / itersj);
                var p = this.getP(uv);
                col.push([p.x(), p.y()]);
                var n = this.getNormal(uv, p);
                normalCol.push([n.x(), n.y(), n.z()]);
            }
            rows.push(col);
            colNormals.push(normalCol);
        }
        for (var j = 0; j < itersj; j++) {
            var row = [];
            var normalRow = [];
            for (var i = 0; i < itersi; i++) {
                var p = rows[i][j];
                row.push(p);
                normalRow.push(colNormals[i][j]);
            }
            cols.push(row);
            rowNormals.push(normalRow);
        }
        // Smooth pts
        for (var arrIdx = 0; arrIdx < 2; arrIdx++) {
            var arr = void 0;
            if (arrIdx === 0)
                arr = rows;
            else if (arrIdx === 1)
                arr = cols;
            for (var i = 0; i < itersi; i++) {
                var row = arr[i];
                var currBand = group.pathItems.add();
                currBand.stroked = true;
                currBand.filled = false;
                currBand.closed = false;
                currBand.strokeCap = StrokeCap.ROUNDENDCAP;
                currBand.strokeWidth = strokeWidth;
                currBand.setEntirePath(row);
                // currBand.closed = true;
                var pts = currBand.pathPoints;
                // p[p.length-1].remove();
                var arrLen = pts.length;
                var ptsToRemove = [];
                if (smoothLines && !(obj === "cylinder" && arrIdx === 0)) {
                    for (var j = 0; j < arrLen; j++) {
                        var normal = rowNormals[i][j];
                        var idxPrev = mod(j - 1, arrLen);
                        var idx = j;
                        var idxNext = mod(j + 1, arrLen);
                        var ptPrev = pts[idxPrev];
                        var ptNext = pts[idxNext];
                        var pt = pts[idx];
                        var ptPath = pts[idx];
                        if (normal[2] > 0) {
                            ptsToRemove.push(pt);
                        }
                        else {
                            var dir = ArrVec.sub(ptNext.anchor, ptPrev.anchor);
                            dir = ArrVec.div(dir, 6);
                            ptPath.rightDirection = [pt.anchor[0] + dir[0], pt.anchor[1] + dir[1]];
                            ptPath.leftDirection = [pt.anchor[0] - dir[0], pt.anchor[1] - dir[1]];
                            ptPath.pointType = PointType.SMOOTH;
                        }
                    }
                }
                if (ptsToRemove.length == arrLen) {
                    currBand.remove();
                }
                else {
                    for (var i_1 = 0; i_1 < ptsToRemove.length; i_1++) {
                        ptsToRemove[i_1].remove();
                    }
                    currBand.translate(rX / 2, rY / 2);
                }
            }
            // Add pts
        }
    }
    //c.setEntirePath(verts);
}
function generateText(text) {
    var textFrame = doc.textFrames.add();
    textFrame.name = "Test Text Frame";
    // .contents to change text
    textFrame.contents = text;
    var textRange = textFrame.textRange;
    // textRange.size = 36;
    // textRange.justification = Justification.CENTER;
    textFrame.position = [doc.width * .5 - textFrame.width * .5, doc.height * .5 + textFrame.width * .5];
}
function generateBackground() {
    var background = doc.pathItems.add();
    background.filled = true;
    var col = new CMYKColor();
    col.black = 0;
    col.cyan = 30.4;
    col.magenta = 32;
    col.yellow = 0;
    background.fillColor = col;
    background.setEntirePath([
        [0, 0],
        [rX, 0],
        [rX, rY],
        [0, rY]
    ]);
}
