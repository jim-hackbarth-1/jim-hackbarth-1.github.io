
export class EllipseCoefficients {

    constructor(a, b, c, d, e, f) {
        this.a = a;
        this.b = b;
        this.c = c;
        this.d = d;
        this.e = e;
        this.f = f;
    }

    static fromEllipse(center, radii, rotationAngle) {
        const radians = -rotationAngle * Math.PI / 180;
        const cos = Math.cos(radians);
        const sin = Math.sin(radians);
        const cx = center.x;
        const cy = center.y;
        const xr2 = radii.x ** 2;
        const yr2 = radii.y ** 2;
        const temp1 = cos * cos / xr2 + sin * sin / yr2;
        const temp2 = -2 * cos * sin / xr2 + 2 * cos * sin / yr2;
        const temp3 = sin * sin / xr2 + cos * cos / yr2;
        const a = temp1;
        const b = temp2;
        const c = temp3;
        const d = -(2 * temp1 * cx + temp2 * cy);
        const e = -(temp2 * cx + 2 * temp3 * cy);
        const f = temp1 * cx * cx + temp2 * cx * cy + temp3 * cy * cy - 1;
        return new EllipseCoefficients(a, b, c, d, e, f);
    }

    static elliminateTerm(ellipseCoefficients1, ellipseCoefficients2, coefficient) {
        const coefficient1 = ellipseCoefficients1[coefficient];
        const coefficient2 = ellipseCoefficients2[coefficient];
        if (Number.isFinite(coefficient1) && Number.isFinite(coefficient2)) {
            const tempCoefficients1 = ellipseCoefficients1.#multiply(coefficient2);
            const tempCoefficients2 = ellipseCoefficients2.#multiply(coefficient1);
            return tempCoefficients1.#subtract(tempCoefficients2);
        }
        return null;
    }

    #multiply(n) {
        if (Number.isFinite(n)) {
            return new EllipseCoefficients(this.a * n, this.b * n, this.c * n, this.d * n, this.e * n, this.f * n);
        }
        return new EllipseCoefficients(this.a, this.b, this.c, this.d, this.e, this.f);
    }

    #subtract(n) {
        if (n) {
            return new EllipseCoefficients(this.a - n.a, this.b - n.b, this.c - n.c, this.d - n.d, this.e - n.e, this.f - n.f);
        }
        return new EllipseCoefficients(this.a, this.b, this.c, this.d, this.e, this.f);
    }
}
