let socket;
let recognition;

let escuchando = false;
let texto = "";

function setup(){

  createCanvas(400,200);

  socket = io();

  recognition = new webkitSpeechRecognition();
  recognition.lang = "es-ES";
  recognition.continuous = false;
  recognition.interimResults = false;

  recognition.onresult = function(event){

    texto = event.results[0][0].transcript;

    socket.emit("nuevoChisme", texto);

  };

}

function draw(){

  background(20);

  fill(255);
  textSize(16);
  textAlign(CENTER);

  text("Haz click para chismear", width/2,50);

  if(escuchando){
    text("🎤 escuchando...", width/2,100);
  }else{
    text("🎤 listo", width/2,100);
  }

  text(texto, width/2,150);

}

function mousePressed(){

  escuchando = true;
  recognition.start();

}
