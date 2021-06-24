// Coord system fix

if (
    parseFloat(app.version.substr(0, 2)) >= 15) {
  const saved_coord_system = app.coordinateSystem;
  app.coordinateSystem = CoordinateSystem.ARTBOARDCOORDINATESYSTEM;
  const idx = app.activeDocument.artboards.getActiveArtboardIndex();
  const ab = app.activeDocument.artboards[idx];
  const o = ab.rulerOrigin;
  const r = ab.artboardRect;
  const saved_origin = [o[0], o[1]];
  ab.rulerOrigin = [0, r[1] - r[3]];
}

const pi = Math.PI;
const tau = 2 * pi; 
function cos(a: number): number { return Math.cos(a) }; 
function sin(a: number): number { return Math.sin(a) }; 
function acos(a: number): number { return Math.acos(a) }; 
function asin(a: number): number { return Math.asin(a) }; 
function sqrt(a: number): number { return Math.sqrt(a) };

// FOR FUCKS SAKE JAVASCRIPT
function mod(n: number, m: number) { return ((n % m) + m) % m; }

class ArrVec {
    static sub(arr: Array<number>, val: number | Array<number>) {
        for (let idxArr = 0; idxArr < arr.length; idxArr++) {
            if (typeof val == "object") {
                arr[idxArr] -= val[idxArr];
            } else {
                arr[idxArr] -= val;
            }
        }
        return arr;
    }
    static div(arr: Array<number>, val: number | Array<number>) {
        for (let idxArr = 0; idxArr < arr.length; idxArr++) {
            if (typeof val == "object") {
                arr[idxArr] /= val[idxArr];
            } else {
                arr[idxArr] /= val;
            }
        }
        return arr;
    }
    static mul(arr: Array<number>, val: number | Array<number>) {
        for (let idxArr = 0; idxArr < arr.length; idxArr++) {
            if (typeof val == "object") {
                arr[idxArr] *= val[idxArr];
            } else {
                arr[idxArr] *= val;
            }
        }
        return arr;
    }
    static add(arr: Array<number>, val: number | Array<number>) {
        for (let idxArr = 0; idxArr < arr.length; idxArr++) {
            if (typeof val == "object") {
                arr[idxArr] += val[idxArr];
            } else {
                arr[idxArr] += val;
            }
        }
        return arr;
    }

}

class Vec {
    v: Array<number>;
    constructor(a: number, b: number) {
        if (a == NaN || b == undefined) throw "num error"; this.v = []; this.v[0] = a; this.v[1] = b;
    }
    setX(a: number) { this.v[0] = a; };
    setY(a: number) { this.v[1] = a; };
    x(): number { return this.v[0]; };
    y(): number { return this.v[1]; };
    mul(b: (number | Vec)) {
        if (typeof b == "object") {
            return new Vec(this.v[0] * b.v[0], this.v[1] * b.v[1])
        } else {
            return new Vec(this.v[0] * b, this.v[1] * b);
        }
    };
    div(b: (number | Vec)) {
        if (typeof b == "object")
            return new Vec(this.v[0] / b.v[0], this.v[1] / b.v[1])
        else
            return new Vec(this.v[0] / b, this.v[1] / b);
    };
    add(b: (number | Vec)) {
        if (typeof b == "object") return new Vec(this.v[0] + b.v[0], this.v[1] + b.v[1])
        else return new Vec(this.v[0] + b, this.v[1] + b);
    };
    sub(b: (number | Vec)) {
        if (typeof b == "object") return new Vec(this.v[0] - b.v[0], this.v[1] - b.v[1])
        else return new Vec(this.v[0] - b, this.v[1] - b);
    };
    dot(b: (number | Vec)) {
        if (typeof b == "object") return (this.v[0] * b.v[0] + this.v[1] * b.v[1])
        else return (this.v[0] * b + this.v[1] * b);
    };
    fromArr(a: Array<number>) { return new Vec(a[0], a[1]); };
    len(): number { return Math.sqrt(this.x() * this.x() + this.y() * this.y()); };
    normalize(): Vec { return this.div(this.len()); };
    rot(angle: number): Vec {
        var rmat = [
            cos(angle), -sin(angle),
            sin(angle), cos(angle)
        ];
        return new Vec(
            this.x() * rmat[0] + this.y() * rmat[2],
            this.x() * rmat[1] + this.y() * rmat[3]
        );
    }
}
// function Vec(a){this.v = [a,a]}

class Vec3 {
    v: Array<number>;
    constructor(a: number, b: number, c: number) {
        if (a == NaN || b == undefined) throw "num error";
        this.v = []; this.v[0] = a; this.v[1] = b; this.v[2] = c;
    }
    x(): number { return this.v[0]; };
    y(): number { return this.v[1]; };
    z(): number { return this.v[2]; };
    setX(a: number) { this.v[0] = a; };
    setY(a: number) { this.v[1] = a; };
    setZ(a: number) { this.v[2] = a; };
    // function Vec3(a){this.v = [a,a,a]}
    add(b: (Vec3 | number)) {
        if (typeof b == "object") return new Vec3(this.v[0] + b.v[0], this.v[1] + b.v[1], this.v[2] + b.v[2])
        else return new Vec3(this.x() + b, this.y() + b, this.z() + b);
    };
    mul(b: (Vec3 | number)) {
        if (typeof b == "object") return new Vec3(this.v[0] * b.v[0], this.v[1] * b.v[1], this.v[2] * b.v[2])
        else return new Vec3(this.x() * b, this.y() * b, this.z() * b);
    };
    div(b: (Vec3 | number)) {
        if (typeof b == "object") return new Vec3(this.v[0] / b.v[0], this.v[1] / b.v[1], this.v[2] / b.v[2])
        else return new Vec3(this.x() / b, this.y() / b, this.z() / b);
    };
    sub(b: (Vec3 | number)) {
        if (typeof b == "object") return new Vec3(this.v[0] - b.v[0], this.v[1] - b.v[1], this.v[2] - b.v[2])
        else return new Vec3(this.x() - b, this.y() - b, this.z() - b);
    };
    dot(b: (Vec3 | number)) {
        if (typeof b == "object") return (this.v[0] * b.v[0] + this.v[1] * b.v[1] + this.v[2] * b.v[2])
        else return this.x() * b + this.y() * b, this.z() * b;
    };
    cross(b: Vec3) {
        var a = this;
        return new Vec3(
            a.y() * b.z() - a.z() * b.y(),
            a.z() * b.x() - a.x() * b.z(),
            a.x() * b.y() - a.y() * b.x()
        );
    };
    len(): number { return Math.sqrt(this.x() * this.x() + this.y() * this.y() + this.z() * this.z()); };
    normalize(): Vec3 { return this.div(this.len()); };
    fromArr(a: Array<number>): Vec3 { return new Vec3(a[0], a[1], a[2]); };
    rot(angle: number, axis: string): Vec3 {
        let idxa = 0; let idxb = 0;
        if (axis == 'x') {
            idxa = 1; idxb = 2;
        } else if (axis == 'y') {
            idxa = 0; idxb = 2;
        } else if (axis == 'z') {
            idxa = 0; idxb = 1;
        }
        const rotated = new Vec(this.v[idxa], this.v[idxb]).rot(angle);
        let newVec = new Vec3(this.x(), this.y(), this.z());
        newVec.v[idxa] = rotated.x(); newVec.v[idxb] = rotated.y();
        return newVec;
    }
}

class Shapes {
    cross(pos: Vec3, size: number): Array<Array<number>> {
        return [
            [pos.x() + size, pos.y() + size],
            [pos.x() - size, pos.y() - size],
            [0, 0],
            [pos.x() + size, pos.y() - size],
            [pos.x() - size, pos.y() + size],
        ]
    };

};