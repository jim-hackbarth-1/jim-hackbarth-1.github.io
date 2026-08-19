
export class ComplexNumber {

    constructor(real, imaginary) {
        this.real = real;
        this.imaginary = imaginary;
    }

    static fromPolar(mod, arg) {
        return new ComplexNumber(mod * Math.cos(arg), mod * Math.sin(arg));
    }

    static removeDuplicates(inputNumbers, maxDifference) {
        const outputNumbers = [];
        let isDuplicate = false;
        for (const input of inputNumbers) {
            isDuplicate = false;
            for (const output of outputNumbers) {
                if (input.isEqual(output, maxDifference)) {
                    isDuplicate = true;
                    break;
                }
            }
            if (!isDuplicate) {
                outputNumbers.push(input);
            }
        }
        return outputNumbers;
    }

    static removeImaginary(inputNumbers, maxImaginary) {
        const outputNumbers = [];
        for (const input of inputNumbers) {
            if (Math.abs(input.imaginary) < maxImaginary) {
                outputNumbers.push(new ComplexNumber(input.real, 0));
            }
        }
        return outputNumbers;
    }

    abs() {
        return Math.sqrt(this.real * this.real + this.imaginary * this.imaginary);
    }

    add(n) {
        if (n instanceof ComplexNumber) {
            return new ComplexNumber(this.real + n.real, this.imaginary + n.imaginary);
        }
        return new ComplexNumber(this.real + n, this.imaginary);
    }

    arg() {
        return Math.atan2(this.imaginary, this.real);
    }

    cubed() {
        const real = this.real * this.real * this.real - 3 * this.real * this.imaginary * this.imaginary;
        const imaginary = 3 * this.real * this.real * this.imaginary - this.imaginary * this.imaginary * this.imaginary;
        return new ComplexNumber(real, imaginary);
    }

    divide(n) {
        if (n instanceof ComplexNumber) {
            const absSquared = new ComplexNumber(n.real, n.imaginary).absSquared();
            const real = (this.real * n.real + this.imaginary * n.imaginary) / absSquared;
            const imaginary = (this.imaginary * n.real - this.real * n.imaginary) / absSquared;
            return new ComplexNumber(real, imaginary);
        }
        return new ComplexNumber(this.real / n, this.imaginary / n);
    }

    exp() {
        const temp1 = Math.exp(this.real);
        const temp2 = Math.cos(this.imaginary);
        return new ComplexNumber(0, 1).multiply(Math.sin(this.imaginary)).add(temp2).multiply(temp1);
    }

    getRoots(rootPower) {
        let roots = [];
        if (rootPower >= 2) {
            const temp1 = Math.atan2(this.imaginary, this.real) / rootPower;
            const temp2 = Math.sqrt(this.real * this.real + this.imaginary * this.imaginary);
            const temp3 = Math.pow(temp2, 1 / rootPower);
            const temp4 = 2 * Math.PI / rootPower;
            for (let i = 0; i < rootPower; i++) {
                roots.push(ComplexNumber.fromPolar(temp3, temp1 + i * temp4));
            }
        }
        return roots;
    }

    isEqual(complexNumber, maxDifference) {
        return Math.abs(this.real - complexNumber.real) < maxDifference
            && Math.abs(this.imaginary - complexNumber.imaginary) < maxDifference;
    }

    isZero(maxDifference) {
        return (Math.abs(this.real) < maxDifference) && (Math.abs(this.imaginary) < maxDifference);
    }

    log() {
        const real = Math.log(this.abs());
        const imaginary = (this.real < 0 && this.imaginary == 0) ? Math.PI : this.arg();
        return new ComplexNumber(real, imaginary);
    }

    multiply(n) {
        if (n instanceof ComplexNumber) {
            const real = this.real * n.real - this.imaginary * n.imaginary;
            const imaginary = this.real * n.imaginary + this.imaginary * n.real;
            return new ComplexNumber(real, imaginary);
        }
        return new ComplexNumber(this.real * n, this.imaginary * n);
    }

    negate() {
        return new ComplexNumber(-this.real, -this.imaginary);
    }

    pow(power) {
        return this.log().multiply(power).exp();
    }

    sqrt() {
        const abs = this.abs();
        const real = Math.sqrt(0.5 * (abs + this.real));
        let imaginary = Math.sqrt(0.5 * (abs - this.real));
        if (this.imaginary < 0) {
            imaginary *= -1;
        }
        return new ComplexNumber(real, imaginary);
    }

    squared() {
        const real = this.real * this.real - this.imaginary * this.imaginary;
        const imaginary = 2 * this.real * this.imaginary;
        return new ComplexNumber(real, imaginary);
    }

    subtract(n) {
        if (n instanceof ComplexNumber) {
            return new ComplexNumber(this.real - n.real, this.imaginary - n.imaginary);
        }
        return new ComplexNumber(this.real - n, this.imaginary);
    }
}
