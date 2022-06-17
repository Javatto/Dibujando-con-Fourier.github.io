/*
* Xk = sum desde n=0 a N-1 de (xn * (cos(2*PI*n*k/N) - i * sen(2*PI*n*k/N)))
*                            señal   [(x1,y1),(x2,y2),(x3,y3)...]
*                                     a+bi --> x1+i*y1
* Xk --> arreglo de números complejos
*/

class Complejo {
  constructor(a, b) {
    this.re = a;
    this.im = b;
  }

  add(c) {
    this.re += c.re;
    this.im += c.im;
  }
  // PEIU (a+bi)(c+di) = (ac-bd) + (ad+bc)i
  // ac + adi + bci - bd
  mult(c) {
    const re = this.re * c.re - this.im * c.im;
    const im = this.re * c.im + this.im * c.re;
    return new Complejo(re, im);
  }
}

// Arreglo de la señal
function dft(x) {
  const X = []; // arreglo de números complejos
  const N = x.length;
  for (let k = 0; k < N; k++) {
    let sum = new Complejo(0, 0);
    for (let n = 0; n < N; n++) {
      const phi = (TWO_PI * k * n) / N;
      const c = new Complejo(cos(phi), -sin(phi));
      sum.add(x[n].mult(c));
    }
    sum.re = sum.re / N;
    sum.im = sum.im / N;

    let frec = k;
    let amp = sqrt(sum.re * sum.re + sum.im * sum.im);
    let fase = atan2(sum.im, sum.re);
    X[k] = { re: sum.re, im: sum.im, frec, amp, fase };
  }
  return X;
}


