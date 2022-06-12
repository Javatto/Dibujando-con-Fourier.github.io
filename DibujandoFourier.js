const USER = 0;
const FOURIER = 1;

// almacenamos los datos del eje x y el eje y de nuestro dibujo
let x = [];
// sacaremos la transformada para cada eje
let fourierX;
// variable que incrementara con el tiempo
let time = 0;
//vectores de cada punto de nuestro dibujo 
let path = [];
//dibujo del usuario y estado
let drawing = [];
let state = -1;

//Funcion que se lanza cuando se presiona el mouse
function mousePressed() {
	state = USER;
	drawing = [];
	x = [];
	time = 0;
	path = [];
}

//Funcion que se lanza cuando se suelta el mouse 
function mouseReleased() {
	state = FOURIER;
	// aqui aplicamos una diezmacion en 8 para eliminar elementos de nuestra funcion
	for (let i = 0; i < drawing.length; i += 1) {
		//Volvemos a nuestra funcion un arreglo de imaginarios 
		x.push(new Complex(drawing[i].x, drawing[i].y));
	}
	//Obtenemos la transformada de fourier discreta
	fourierX = dft(x);
	fourierX.sort((a, b) => b.amp - a.amp);
}

// funcion que carga el mundo
function setup() {
	createCanvas(windowWidth, windowHeight);
	background(0);
	fill(255);
	textAlign(CENTER);
	textSize(64);
	text("Dibuja algo!", width/2, height/2);
}

//Dibujamos el circulo y la linea
function epiCycles(x, y, rotation, fourier){

	let prevx,prevy,radius;
	for (let i = 0; i < fourier.length; i++) {
		prevx = x;	// se almacena el valor anterior a x . y 
		prevy = y;		
		radius = fourier[i].amp;

		x += radius * cos(fourier[i].freq * time + fourier[i].phase + rotation);		//valor de x para la Serie de fourier cuadrada
		y += radius * sin(fourier[i].freq * time + fourier[i].phase + rotation);		//valor de y para la Serie de fourier cuadrada

		stroke(255, 100);
   		noFill();
    	ellipse(prevx, prevy, radius * 2);
    	stroke(255);
    	line(prevx, prevy, x, y);
	}

	// Con los ultimos valores de x y y creamos un vector y lo retornamos
	return createVector(x, y);
}

//funcion que dibuja
function draw() {

	if (state == USER) {
		background(0);
		let point = createVector(mouseX - width / 2, mouseY - height / 2);
		drawing.push(point);
		stroke(255);
		noFill();
		beginShape();
		for (let v of drawing) {
			vertex(v.x + width / 2, v.y + height / 2);
		}
		endShape();
	}else if(state == FOURIER){
		background(0);
		//Una vez tengamos la figura cibujamos los circulos
		let v = epiCycles(width / 2, height / 2, 0, fourierX);
		path.unshift(v);

		// Iniciamos una forma con los puntos de X y Y que nos devolvio el dibujo
		beginShape();
		noFill();
		strokeWeight(2);
		stroke(255, 0, 255);
		for (let i = 0; i < path.length; i++) {
			vertex(path[i].x, path[i].y);
		}
		endShape();

		// Incrementamos el tiempo en 2pi/longitud
		const dt = TWO_PI / fourierX.length;
		time += dt;

		//limpiamos para no llenar la memoria
		if (time > TWO_PI) {
		time = 0;
		path = [];
		}
	} 
}
