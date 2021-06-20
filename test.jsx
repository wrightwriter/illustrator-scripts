#include "libs.jsx"
var shapes = Shapes();

var doc = app.activeDocument;
var lay = activeDocument.activeLayer;

var rX = doc.width;
var rY = doc.height;

// stroked, filled
// fillColor, strokeColor
// strokeCap = StrokeCap.ROUNDEDCAP
// setEntirePath, translate, resize

// generatePerspGrid();
generateGrid();


function generateText(text) {
    var textFrame = doc.textFrames.add();
    textFrame.name = "Test Text Frame";
    // .contents to change text
    textFrame.contents = text;
    var textRange = textFrame.textRange;
    textRange.size = 36;
    textRange.justification = Justification.CENTER;
    textFrame.position = [doc.width*.5-textFrame.width*.5, doc.height*.5+textFrame.width*.5];
}
function generateCircle(rad) {
    var verts = [];
    var c = lay.pathItems.add();
    c.stroked = true;
    c.filled = false;
    c.closed = false;
    c.strokeWidth = 1;
    var iters = 20;
    for(i = 0; i < iters + 1; i++){
        var p = new Vec(sin(i/pi),cos(i/pi));
        verts.push([p.v[0],p.v[1]]);
    }
    c.setEntirePath(verts);
    c.resize(rX*40,rX*40);
    c.translate(activeDocument.width / 2, activeDocument.height / 2);
}
function generateGrid() {
    this.getP = function(uv){
        var p = new Vec3( uv.x(), uv.y(), 0);
        p.v[2] = p.v[2] + sin(uv.dot(uv)*4.)*0.4;
        // p = p.rot(1.4,'y');
        p = p.rot(.3,'x');            
        return p;
    }
    const group = lay.groupItems.add();
    var verts = [];
    const itersi = 40;
    const itersj = 40;
    const stepSz = new Vec(1/itersi, 1/itersj);
    for(i = 0; i < itersi; i++){
        for(j = 0; j < itersj; j++){ 
            
            var uv = new Vec(i/itersi*2. - 1., j/itersj*2. - 1.);
            var p = this.getP(uv);
            // var nextP = this.getP(uv.add(stepSz));
            // var nextPx = this.getP(uv.add(new Vec(stepSz.x(),0)));
            // var nextPy = this.getP(uv.add(new Vec(0,stepSz.y())));

            var zoffs = 2;
            var zdiv = 0.4;
            p = p.div( (p.z() + zoffs)/zdiv);
            p = p.mul(rX*0.8);
                        
            var c = group.pathItems.add();
            c.stroked = true;
            c.filled = false;
            c.closed = false;
            c.strokeCap = StrokeCap.ROUNDENDCAP;
            c.strokeWidth = 3;
                
            // c.setEntirePath([ [p.x(),p.y()], [p.x(),p.y()], ]);
            c.setEntirePath([ 
                ...shapes.cross(
                    new Vec(p.x(),p.y()), stepSz.x()
                    )
                ]);
            c.translate(rX / 4, rY / 4);
            c.translate(rX / 4, rY / 4);
            
        }
    }
    //c.setEntirePath(verts);
}


function generatePerspGrid() {
    this.getP = function(uv){
        var p = new Vec3( uv.x(), 0, uv.y());
        p.v[1] = p.v[1] + sin(uv.dot(uv)*4.)*0.4;

        p = p.rot(1.4,'y');
        p = p.rot(.3,'x');            
        return p;
    }
    const group = lay.groupItems.add();
    var verts = [];
    const itersi = 40;
    const itersj = 40;
    const stepSz = new Vec(1/itersi, 1/itersj);
    for(i = 0; i < itersi; i++){
        for(j = 0; j < itersj; j++){ 
            
            var uv = new Vec(i/itersi*2. - 1., j/itersj*2. - 1.);
            var p = this.getP(uv);
            // var nextP = this.getP(uv.add(stepSz));
            // var nextPx = this.getP(uv.add(new Vec(stepSz.x(),0)));
            // var nextPy = this.getP(uv.add(new Vec(0,stepSz.y())));

            const zoffs = 2;
            const zdiv = 0.4;
            p = p.div( (p.z() + zoffs)/zdiv);

            p = p.mul(rX*0.8);
                        
            var c = group.pathItems.add();
            c.stroked = true;
            c.filled = false;
            c.closed = false;
            c.strokeCap = StrokeCap.ROUNDENDCAP;
            
            c.strokeWidth = 3;
                
            // c.setEntirePath([[p.x(),p.y()],[p.x(),p.y()]]);
            c.setEntirePath([
                [p.x(),p.y()],
                [p.x(),p.y()],
                // [nextPx.x(),nextPx.y()],
                ]);
            c.translate(rX / 4, rY / 4);
            c.translate(rX / 4, rY / 4);
            
        }
    }
    //c.setEntirePath(verts);
}
function generateSphere(rad) {
    var group = lay.groupItems.add();
    var verts = [];
    var itersi = 40;
    var itersj = 5;
    for(i = -1.; i < itersi; i++){
        for(j = -1.; j < itersj; j++){ 
            var theta = i/itersi*pi*2; var phi = j/itersj*pi;
            
            var p = new Vec3(
                sin(theta)*cos(phi),
                sin(theta)*sin(phi),
                cos(theta)
            );
            p = p.mul(new Vec3(rX*0.25,rX*0.25,rX*0.25));
            p = p.rot(0.8,'y');
            p = p.rot(.3,'x');            
            p = p.rot(1.3,'z');
                        
            var c = group.pathItems.add();
            c.stroked = true;
            c.filled = false;
            c.closed = false;
            c.strokeCap = StrokeCap.ROUNDENDCAP;
            
            c.strokeWidth = 5;
                
            c.setEntirePath([[p.x(),p.y()],[p.x(),p.y()]]);
            c.translate(rX / 4, rY / 4);
            c.translate(rX / 4, rY / 4);
            
        }
    }
    //c.setEntirePath(verts);
}


function generateTriangle() {
    var triangle = doc.pathItems.add();
    triangle.stroked = true;
    triangle.setEntirePath([[doc.width/2, 25], [25, doc.height-25], [doc.width-25, doc.height-25], [doc.width/2, 25]]);
 }
function generateBackground(){
    var background = doc.pathItems.add();
    background.filled=true;
    var col = new CMYKColor();
    col.black = 0;
    col.cyan = 30.4;
    col.magenta = 32;
    col.yellow = 0;
    background.fillColor = col;
    background.setEntirePath([
        [0,0],
        [rX,0],
        [rX,rY],
        [0,rY]
    ]);
}