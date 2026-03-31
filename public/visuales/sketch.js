let socket;
let chismes = [];

function setup(){

  createCanvas(600,600);

  socket = io();

  socket.on("connect", () => {
    console.log("conectado al servidor");
  });

  socket.on("historial", function(data){

    console.log("historial recibido:", data);
    chismes = data;

  });

  socket.on("chismeResumido", function(data){

    console.log("nuevo chisme:", data);
    chismes.push(data);

  });

}

function draw(){

  background(240);

  textSize(28);
  textAlign(CENTER);
  text("📖 Libro del Chisme", width/2,50);

  textSize(16);
  textAlign(LEFT);

  for(let i=0;i<chismes.length;i++){

    let y = 100 + i*30;

    text("• " + chismes[i].resumen, 50, y);

  }

}