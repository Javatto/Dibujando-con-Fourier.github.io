const USER = 0;
const FOURIER = 1;

let x = [];
let fourierX;
let tiempo = 0;
let ruta = [];
let dibujo = [];
let state = -1;

function mousePressed() {
  state = USER;
  dibujo = [];
  x = [];
  tiempo = 0;
  ruta = [];
}

function mouseReleased() {
  state = FOURIER;
  let skip = 1;
  
  if(dibujo.length > 700 && dibujo.length <= 1000)  
    skip = 2
  else if(dibujo.length > 1000)
    skip = 3

  for (let i = 0; i < dibujo.length; i += skip) {
    x.push(new Complejo(dibujo[i].x, dibujo[i].y));
  }
  fourierX = dft(x);

  fourierX.sort((a, b) => b.amp - a.amp);
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  background('#333');
  fill(255);
  textAlign(CENTER);
  textSize(64);
  text("¡Dibuja algo!", width/2, height/2);
}

function epiciclos(x, y, rotacion, fourier) {
  for (let i = 0; i < fourier.length; i++) {
    let prevx = x;
    let prevy = y;
    let frec = fourier[i].frec;
    let radius = fourier[i].amp;
    let fase = fourier[i].fase;
    x += radius * cos(frec * tiempo + fase + rotacion);
    y += radius * sin(frec * tiempo + fase + rotacion);

    stroke(255, 100);
    noFill();
    ellipse(prevx, prevy, radius * 2);
    stroke(255);
    line(prevx, prevy, x, y);
  }
  return createVector(x, y);
}

function draw() {

  if (state == USER) {
  background('#333');
    let punto = createVector(mouseX - width / 2, mouseY - height / 2);
    
    dibujo.push(punto);
    stroke(255);
    noFill();
    beginShape();
    for (let v of dibujo) {
      vertex(v.x + width / 2, v.y + height / 2);
    }
    endShape();
  } else if (state == FOURIER) {
  background('#333');
    let v = epiciclos(width / 2, height / 2, 0, fourierX);
    ruta.push(v);

    beginShape();
    noFill();
    strokeWeight(2);
    stroke(255, 0, 255);
    for (let i = 0; i < ruta.length; i++) {
      vertex(ruta[i].x, ruta[i].y);
    }
    endShape();

    const dt = TWO_PI / fourierX.length;
    tiempo += dt;

    console.log(fourierX.length);
    
    if (tiempo > TWO_PI) {
      tiempo = 0;
      ruta = [];
      state = -1;
    }
  }

}