let port;
let reader;

let brightness = 0;

let growth = 0;

let branches = [];

let birds = [];

let wind = 0;



async function connectArduino(){

port = await navigator.serial.requestPort();

await port.open({ baudRate:9600 });

const decoder = new TextDecoderStream();

port.readable.pipeTo(decoder.writable);

reader = decoder.readable.getReader();

readSerial();

}



async function readSerial(){

while(true){

const { value, done } = await reader.read();

if(done) break;

let val = parseInt(value);

if(!isNaN(val)){

brightness = val;

}

}

}



function setup(){

createCanvas(900,600);

document
.getElementById("connect")
.onclick = connectArduino;

}



function draw(){

background(0);

wind = sin(frameCount * 0.01) * 0.2;

drawGround();

drawTree();

drawBirds();

}



function drawGround(){

stroke(40);

line(0,height-80,width,height-80);

}



function drawTree(){

translate(width/2,height-80);

let target = map(brightness,0,255,20,220);

if(growth < target){

growth += 0.4;

}



stroke(180,255,200);

strokeWeight(4);



drawBranch(0,0,growth,-PI/2,5);

}



function drawBranch(x,y,len,angle,depth){

if(depth <= 0) return;



let sway = wind * depth;

let x2 = x + cos(angle + sway) * len;

let y2 = y + sin(angle + sway) * len;



line(x,y,x2,y2);



if(depth < 3){

drawLeaf(x2,y2);

}



drawBranch(x2,y2,len*0.7,angle + PI/6,depth-1);

drawBranch(x2,y2,len*0.7,angle - PI/6,depth-1);

}



function drawLeaf(x,y){

noStroke();

fill(150,255,200,180);

ellipse(x,y,8,5);

}



function drawBirds(){



if(random() < 0.01){

birds.push({

x:-20,

y:random(100,300),

speed:random(1,2)

});

}



stroke(200);

noFill();



for(let i=birds.length-1;i>=0;i--){

let b = birds[i];



drawBird(b.x,b.y);



b.x += b.speed;



if(b.x > width+20){

birds.splice(i,1);

}

}



}



function drawBird(x,y){

beginShape();

vertex(x,y);

vertex(x+8,y-5);

vertex(x+16,y);

endShape();

}
