//@include "libs.js"


const doc = app.activeDocument;
const lay = doc.activeLayer;

const rX = doc.width;
const rY = doc.height;

// stroked, filled
// fillColor, strokeColor
// strokeCap = StrokeCap.ROUNDEDCAP
// setEntirePath, translate, resize



generateParam();


function generateGrid() {
    this.getP = function (uv: Vec): Vec3 {
        let p = new Vec3(uv.x(), uv.y(), 0);
        p.v[2] = p.v[2] + sin(uv.dot(uv) * 4.) * 0.4;
        // p = p.rot(1.4,'y');
        p = p.rot(.3, 'x');
        return p;
    }
    const group = lay.groupItems.add();
    let verts = [];
    const itersi = 40;
    const itersj = 40;
    const stepSz = new Vec(1 / itersi, 1 / itersj);
    for (let i = 0; i < itersi; i++) {
        for (let j = 0; j < itersj; j++) {

            const uv = new Vec(i / itersi * 2. - 1., j / itersj * 2. - 1.);
            let p = this.getP(uv);
            // let nextP = this.getP(uv.add(stepSz));
            // let nextPx = this.getP(uv.add(new Vec(stepSz.x(),0)));
            // let nextPy = this.getP(uv.add(new Vec(0,stepSz.y())));

            let zoffs = 2;
            let zdiv = 0.4;
            p = p.div((p.z() + zoffs) / zdiv);
            p = p.mul(rX * 0.8);

            let c = group.pathItems.add();
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
    const strokeWidth: number = 1;
    const orth: boolean = false;
    const obj: string = "cylinder"; // torus, sphere, cylinder
    const itersi: number = 10;
    const itersj: number = 10;
    const renderPrimitive: string = "lines"; // points, lines 
    const smoothLines: boolean = true;
    const backFaceCull: boolean = true;

    let group = lay.groupItems.add();
    this.getParametricP = function (uv: Vec): Vec3 {
        let p: Vec3;
        if (obj == "sphere") {
            uv.setY(uv.y() / 2);
            p = new Vec3(
                sin(uv.x()) * cos(uv.y()),
                sin(uv.x()) * sin(uv.y()),
                cos(uv.x())
            );
        } else if (obj == "torus") {
            let a = 0.2;
            let b = 0.6;
            p = new Vec3(
                (b + a * cos(uv.x())) * cos(uv.y()),
                (b + a * cos(uv.x())) * sin(uv.y()),
                a * sin(uv.x())
            );

        } else if (obj == "cylinder") {
            let w = 0.2;
            p = new Vec3(
                cos(uv.x()) * w,
                uv.y() / tau,
                sin(uv.x()) * w
            );

        }
        return p;
    }
    this.transformP = function (p: Vec3): Vec3 {
        p = p.rot(0.8, 'y');
        p = p.rot(.3, 'x');
        p = p.rot(1.3, 'z');
        return p;
    }
    this.projectP = function (p: Vec3): Vec3 {
        if (orth) {
            p = p.mul(rX * 0.2);
        } else {
            const zoffs = 2;
            const zdiv = 0.4;

            p = p.div((p.z() + zoffs) / zdiv);
            p = p.mul(rX * 0.8);
        }
        return p;
    }
    this.getNormal = function (uv: Vec, p: Vec3) {
        const eps: number = 0.02;
        const xtan: Vec3 = this.getParametricP(uv.add(new Vec(0, eps))).sub(p);
        const ytan: Vec3 = this.getParametricP(uv.add(new Vec(eps, 0))).sub(p);
        let n: Vec3 = xtan.cross(ytan);
        n = n.normalize();
        n = this.transformP(n);
        n = this.projectP(n);
        return n;
    }
    this.getP = function (uv: Vec) {
        uv = uv.mul(tau);
        let p = this.getParametricP(uv);
        p = this.transformP(p);
        p = this.projectP(p);

        return p;
    }

    const stepSz = new Vec(1 / itersi, 1 / itersj);

    if (renderPrimitive === "points") {
        for (let i = 0; i < itersi; i++) {
            for (let j = 0; j < itersj; j++) {
                const uv: Vec = new Vec(i / itersi, j / itersj);
                const p: Vec3 = this.getP(uv);
                const c = group.pathItems.add();
                c.stroked = true;
                c.filled = false;
                c.closed = false;
                c.strokeCap = StrokeCap.ROUNDENDCAP;
                c.strokeWidth = strokeWidth;
                c.setEntirePath([[p.x(), p.y()], [p.x(), p.y()]]);
                c.translate(rX / 4, rY / 4);
            }
        }
    } else if (renderPrimitive == "lines") {
        let rows: [number,number][][] = [];
        let cols: [number,number][][] = [];
        let rowNormals: [number,number,number][][] = [];
        let colNormals: [number,number,number][][] = [];
            
        // Gen pts
        for (let i = 0; i < itersi; i++) {
            let col: [number,number][] = [];
            let normalCol: [number,number,number][] = [];
            for (let j = 0; j < itersj; j++) {
                const uv = new Vec(i / itersi, j / itersj);
                const p = this.getP(uv);
                col.push([p.x(), p.y()]);
                const n = this.getNormal(uv, p);
                normalCol.push([n.x(), n.y(), n.z()]);
            }
            rows.push(col);
            colNormals.push(normalCol);
        }
        for (let j = 0; j < itersj; j++) {
            let row: [number,number][] = [];
            let normalRow: [number,number,number][] = [];
            for (let i = 0; i < itersi; i++) {
                const p = rows[i][j];
                row.push(p);
                normalRow.push(colNormals[i][j]);
            }
            cols.push(row);
            rowNormals.push(normalRow);
        }


        // Smooth pts
        for (let arrIdx = 0; arrIdx < 2; arrIdx++) {
            let arr: [number,number][][];
            if (arrIdx === 0)
                arr = rows;
            else if (arrIdx === 1)
                arr = cols;

            for (let i = 0; i < itersi; i++) {
                const row = arr[i];
                const currBand = group.pathItems.add();
                currBand.stroked = true;
                currBand.filled = false;
                currBand.closed = false;
                currBand.strokeCap = StrokeCap.ROUNDENDCAP;
                currBand.strokeWidth = strokeWidth;
                currBand.setEntirePath(row);
                // currBand.closed = true;
                const pts = currBand.pathPoints;
                // p[p.length-1].remove();
                const arrLen = pts.length;
                const ptsToRemove: Array<PathPoint> = [];
                if (smoothLines && !(obj === "cylinder" && arrIdx === 0)) {
                    for (let j = 0; j < arrLen; j++) {
                        const normal = rowNormals[i][j];
                        const idxPrev = mod(j - 1, arrLen);
                        const idx = j;
                        const idxNext = mod(j + 1, arrLen);

                        const ptPrev = pts[idxPrev];
                        const ptNext = pts[idxNext];
                        const pt = pts[idx];
                        let ptPath = pts[idx];
                        
                        if(normal[2] > 0){
                            ptsToRemove.push(pt);
                        } else {
                            let dir = ArrVec.sub(ptNext.anchor, ptPrev.anchor);
                            dir = ArrVec.div(dir, 6);
                            ptPath.rightDirection = [pt.anchor[0] + dir[0], pt.anchor[1] + dir[1]];
                            ptPath.leftDirection = [pt.anchor[0] - dir[0], pt.anchor[1] - dir[1]];

                            ptPath.pointType = PointType.SMOOTH;

                        }

                    }
                }
                
                if (ptsToRemove.length == arrLen){
                    currBand.remove();
                } else {
                    for(let i = 0; i < ptsToRemove.length; i++){
                        ptsToRemove[i].remove();
                    }
                }
                currBand.translate(rX / 2, rY / 2);
            }

            // Add pts

        }

    }
    //c.setEntirePath(verts);
}


function generateText(text: string) {
    let textFrame = doc.textFrames.add();
    textFrame.name = "Test Text Frame";
    // .contents to change text
    textFrame.contents = text;
    let textRange = textFrame.textRange;
    // textRange.size = 36;
    // textRange.justification = Justification.CENTER;
    textFrame.position = [doc.width * .5 - textFrame.width * .5, doc.height * .5 + textFrame.width * .5];
}
function generateBackground() {
    let background = doc.pathItems.add();
    background.filled = true;
    let col = new CMYKColor();
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