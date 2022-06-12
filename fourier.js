class Complex{
    constructor(a,b){
        this.re = a;
        this.im = b;
    }

    add(c){
        this.re += c.re;
        this.im += c.im;
    }

    mult(c){
        const re = this.re * c.re - this.im * c.im;
        const im = this.re * c.im + this.im * c.re;
        return new Complex(re,im);  
    }
}


//usamos el algoritmo de la transformada discreta ya que al estar trabajando en una computadora
//no podemos integrar hasta el infinito y trabajamos en el plano discreto
    // x minuscula es nuestra funcion y es un arreglo de complejos
function dft(x) {
    //X mayuscula sera la transformada discreta de fourier
    const X = [];
    //N numero de elementos en nuestra funcion
    const N = x.length;

    //iteramos para cada valor de haremos la suma de cada uno
    for (let k = 0; k < N; k++) {
        //Creamos complejo donde se almacena la suma 
        let sum = new Complex(0,0);
        // Hacemos la sumatoria
        for (let n = 0; n < N; n++) {
            const phi = (TWO_PI * k * n) / N;
            const c = new Complex(cos(phi), -sin(phi));
            //hacemos la multiplicacion de nuestro elemento en la funcion por cos(phi) y sin(phi)
            //una vez hecha la sumamos a sum
            sum.add(x[n].mult(c)); 
        }
        
        sum.re = sum.re / N;
        sum.im = sum.im / N;

        //definimos la amplitud, frecuencia y fase para dibujar los circulos con respecto a los valores obtenidos
        let freq = k;
        let amp = sqrt(sum.re * sum.re + sum.im * sum.im);
        let phase = atan2(sum.im, sum.re);
        X[k] = { re: sum.re, im: sum.im, freq, amp, phase };
    }
    //retornamos la transformada
    return X;
}