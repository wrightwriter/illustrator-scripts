// Coord system fix
if (parseFloat(app.version.substr(0, 2)) >= 15) {
    var saved_coord_system = app.coordinateSystem;
    app.coordinateSystem = CoordinateSystem.ARTBOARDCOORDINATESYSTEM;
    var idx = app.activeDocument.artboards.getActiveArtboardIndex();
    var ab = app.activeDocument.artboards[idx];
    var o = ab.rulerOrigin;
    var r = ab.artboardRect;
    var saved_origin = [o[0], o[1]];
    ab.rulerOrigin = [0, r[1] - r[3]];
}
var pi = Math.PI;
var tau = 2 * pi;
function cos(a) { return Math.cos(a); }
;
function sin(a) { return Math.sin(a); }
;
function acos(a) { return Math.acos(a); }
;
function asin(a) { return Math.asin(a); }
;
function sqrt(a) { return Math.sqrt(a); }
;
// FOR FUCKS SAKE JAVASCRIPT
function mod(n, m) { return ((n % m) + m) % m; }
var ArrVec = /** @class */ (function () {
    function ArrVec() {
    }
    ArrVec.sub = function (arr, val) {
        for (var idxArr = 0; idxArr < arr.length; idxArr++) {
            if (typeof val == "object") {
                arr[idxArr] -= val[idxArr];
            }
            else {
                arr[idxArr] -= val;
            }
        }
        return arr;
    };
    ArrVec.div = function (arr, val) {
        for (var idxArr = 0; idxArr < arr.length; idxArr++) {
            if (typeof val == "object") {
                arr[idxArr] /= val[idxArr];
            }
            else {
                arr[idxArr] /= val;
            }
        }
        return arr;
    };
    ArrVec.mul = function (arr, val) {
        for (var idxArr = 0; idxArr < arr.length; idxArr++) {
            if (typeof val == "object") {
                arr[idxArr] *= val[idxArr];
            }
            else {
                arr[idxArr] *= val;
            }
        }
        return arr;
    };
    ArrVec.add = function (arr, val) {
        for (var idxArr = 0; idxArr < arr.length; idxArr++) {
            if (typeof val == "object") {
                arr[idxArr] += val[idxArr];
            }
            else {
                arr[idxArr] += val;
            }
        }
        return arr;
    };
    return ArrVec;
}());
var Vec = /** @class */ (function () {
    function Vec(a, b) {
        if (a == NaN || b == undefined)
            throw "num error";
        this.v = [];
        this.v[0] = a;
        this.v[1] = b;
    }
    Vec.prototype.setX = function (a) { this.v[0] = a; };
    ;
    Vec.prototype.setY = function (a) { this.v[1] = a; };
    ;
    Vec.prototype.x = function () { return this.v[0]; };
    ;
    Vec.prototype.y = function () { return this.v[1]; };
    ;
    Vec.prototype.mul = function (b) {
        if (typeof b == "object") {
            return new Vec(this.v[0] * b.v[0], this.v[1] * b.v[1]);
        }
        else {
            return new Vec(this.v[0] * b, this.v[1] * b);
        }
    };
    ;
    Vec.prototype.div = function (b) {
        if (typeof b == "object")
            return new Vec(this.v[0] / b.v[0], this.v[1] / b.v[1]);
        else
            return new Vec(this.v[0] / b, this.v[1] / b);
    };
    ;
    Vec.prototype.add = function (b) {
        if (typeof b == "object")
            return new Vec(this.v[0] + b.v[0], this.v[1] + b.v[1]);
        else
            return new Vec(this.v[0] + b, this.v[1] + b);
    };
    ;
    Vec.prototype.sub = function (b) {
        if (typeof b == "object")
            return new Vec(this.v[0] - b.v[0], this.v[1] - b.v[1]);
        else
            return new Vec(this.v[0] - b, this.v[1] - b);
    };
    ;
    Vec.prototype.dot = function (b) {
        if (typeof b == "object")
            return (this.v[0] * b.v[0] + this.v[1] * b.v[1]);
        else
            return (this.v[0] * b + this.v[1] * b);
    };
    ;
    Vec.prototype.fromArr = function (a) { return new Vec(a[0], a[1]); };
    ;
    Vec.prototype.len = function () { return Math.sqrt(this.x() * this.x() + this.y() * this.y()); };
    ;
    Vec.prototype.normalize = function () { return this.div(this.len()); };
    ;
    Vec.prototype.rot = function (angle) {
        var rmat = [
            cos(angle), -sin(angle),
            sin(angle), cos(angle)
        ];
        return new Vec(this.x() * rmat[0] + this.y() * rmat[2], this.x() * rmat[1] + this.y() * rmat[3]);
    };
    return Vec;
}());
// function Vec(a){this.v = [a,a]}
var Vec3 = /** @class */ (function () {
    function Vec3(a, b, c) {
        if (a == NaN || b == undefined)
            throw "num error";
        this.v = [];
        this.v[0] = a;
        this.v[1] = b;
        this.v[2] = c;
    }
    Vec3.prototype.x = function () { return this.v[0]; };
    ;
    Vec3.prototype.y = function () { return this.v[1]; };
    ;
    Vec3.prototype.z = function () { return this.v[2]; };
    ;
    Vec3.prototype.setX = function (a) { this.v[0] = a; };
    ;
    Vec3.prototype.setY = function (a) { this.v[1] = a; };
    ;
    Vec3.prototype.setZ = function (a) { this.v[2] = a; };
    ;
    // function Vec3(a){this.v = [a,a,a]}
    Vec3.prototype.add = function (b) {
        if (typeof b == "object")
            return new Vec3(this.v[0] + b.v[0], this.v[1] + b.v[1], this.v[2] + b.v[2]);
        else
            return new Vec3(this.x() + b, this.y() + b, this.z() + b);
    };
    ;
    Vec3.prototype.mul = function (b) {
        if (typeof b == "object")
            return new Vec3(this.v[0] * b.v[0], this.v[1] * b.v[1], this.v[2] * b.v[2]);
        else
            return new Vec3(this.x() * b, this.y() * b, this.z() * b);
    };
    ;
    Vec3.prototype.div = function (b) {
        if (typeof b == "object")
            return new Vec3(this.v[0] / b.v[0], this.v[1] / b.v[1], this.v[2] / b.v[2]);
        else
            return new Vec3(this.x() / b, this.y() / b, this.z() / b);
    };
    ;
    Vec3.prototype.sub = function (b) {
        if (typeof b == "object")
            return new Vec3(this.v[0] - b.v[0], this.v[1] - b.v[1], this.v[2] - b.v[2]);
        else
            return new Vec3(this.x() - b, this.y() - b, this.z() - b);
    };
    ;
    Vec3.prototype.dot = function (b) {
        if (typeof b == "object")
            return (this.v[0] * b.v[0] + this.v[1] * b.v[1] + this.v[2] * b.v[2]);
        else
            return this.x() * b + this.y() * b, this.z() * b;
    };
    ;
    Vec3.prototype.cross = function (b) {
        var a = this;
        return new Vec3(a.y() * b.z() - a.z() * b.y(), a.z() * b.x() - a.x() * b.z(), a.x() * b.y() - a.y() * b.x());
    };
    ;
    Vec3.prototype.len = function () { return Math.sqrt(this.x() * this.x() + this.y() * this.y() + this.z() * this.z()); };
    ;
    Vec3.prototype.normalize = function () { return this.div(this.len()); };
    ;
    Vec3.prototype.fromArr = function (a) { return new Vec3(a[0], a[1], a[2]); };
    ;
    Vec3.prototype.rot = function (angle, axis) {
        var idxa = 0;
        var idxb = 0;
        if (axis == 'x') {
            idxa = 1;
            idxb = 2;
        }
        else if (axis == 'y') {
            idxa = 0;
            idxb = 2;
        }
        else if (axis == 'z') {
            idxa = 0;
            idxb = 1;
        }
        var rotated = new Vec(this.v[idxa], this.v[idxb]).rot(angle);
        var newVec = new Vec3(this.x(), this.y(), this.z());
        newVec.v[idxa] = rotated.x();
        newVec.v[idxb] = rotated.y();
        return newVec;
    };
    return Vec3;
}());
var Shapes = /** @class */ (function () {
    function Shapes() {
    }
    Shapes.prototype.cross = function (pos, size) {
        return [
            [pos.x() + size, pos.y() + size],
            [pos.x() - size, pos.y() - size],
            [0, 0],
            [pos.x() + size, pos.y() - size],
            [pos.x() - size, pos.y() + size],
        ];
    };
    ;
    return Shapes;
}());
;
