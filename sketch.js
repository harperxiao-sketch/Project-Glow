// ========================
// GLOBAL
// ========================

let axiom = "F";
let sentence = axiom;
let rules = [];

let len = 80;
let angle;

let leaves = [];
let particles = [];

let lastGrowTime = 0;

function setup(){

createCanvas(window.innerWidth,window.innerHeight);

angle = radians(22);

rules[0] = {
  a: "F",
  b: "FF+[+F-F-F]-[-F+F+F]"
};

}

// ========================
// DRAW LOOP
// ========================

function draw(){

drawGalaxy();

translate(width/2,height*0.9);

drawLSystem();

updateLeaves();
updateParticles();

growTree();

}

// ========================
// L-SYSTEM GROWTH
// ========================

function growTree(){

if(millis() - lastGrowTime > 2000){

let next = "";

for(let i=0;i<sentence.length;i++){

let current = sentence.charAt(i);
let found = false;

for(let j=0;j<rules.length;j++){

if(current === rules[j].a){
next += rules[j].b;
found = true;
break;
}

}

if(!found){
next += current;
}

}

sentence = next;
len *= 0.6;

lastGrowTime = millis();

}

}

// ========================
// DRAW TREE
// ========================

function drawLSystem(){

background(5,6,18);

let stack = [];

stroke(120,200,160);

for(let i=0;i<sentence.length;i++){

let c = sentence.charAt(i);

if(c === "F"){

let wind = noise(i*0.05,frameCount*0.01)*0.3;

let sw = map(len,2,80,1,14);
strokeWeight(sw);

// trunk stays stable (no wind at base)
if(sw > 8){
wind = 0;
}

line(0,0,0,-len);

translate(0,-len);

// spawn leaves gradually
if(len < 10 && random() < 0.3){
leaves.push(new Leaf(0,0));
}

}
else if(c === "+"){
rotate(angle);
}
else if(c === "-"){
rotate(-angle);
}
else if(c === "["){
stack.push({
pos: createVector(0,0),
angle: getRotation()
});
push();
}
else if(c === "]"){
pop();
}

}

}

// ========================
// LEAVES (ANIMATED GROWTH)
// ========================

class Leaf{

constructor(x,y){

this.x=x;
this.y=y;
this.size=0;
this.target=random(6,12);
this.angle=random(TWO_PI);

}

update(){

// grow animation
if(this.size < this.target){
this.size += 0.2;
}

// subtle glow
if(random()<0.01){
particles.push(new Glow(this.x,this.y));
}

}

display(){

push();
translate(this.x,this.y);
rotate(this.angle);

fill(120,255,180);
noStroke();

// leaf shape
beginShape();
vertex(0,0);
bezierVertex(6,-4,10,-8,0,-12);
bezierVertex(-10,-8,-6,-4,0,0);
endShape(CLOSE);

pop();

}

}

// ========================
// PARTICLES (LIGHT)
// ========================

class Glow{

constructor(x,y){

this.x=x;
this.y=y;
this.life=120;
this.vx=random(-0.3,0.3);
this.vy=random(-1,-0.5);

}

update(){

this.x += this.vx;
this.y += this.vy;
this.life--;

}

display(){

noStroke();
fill(150,255,220,this.life);
circle(this.x,this.y,4);

}

}

function updateLeaves(){

for(let l of leaves){
l.update();
l.display();
}

}

function updateParticles(){

for(let i=particles.length-1;i>=0;i--){

particles[i].update();
particles[i].display();

if(particles[i].life<0){
particles.splice(i,1);
}

}

}

// ========================
// GALAXY BACKGROUND
// ========================

function drawGalaxy(){

background(5,6,18);

// rotating galaxy
push();
translate(width/2,height/3);

for(let i=0;i<200;i++){

let a = i * 0.1 + frameCount*0.002;
let r = i * 1.2;

let x = cos(a) * r;
let y = sin(a) * r * 0.5;

fill(100,150,255,80);
noStroke();
circle(x,y,2);

}

pop();

// stars
for(let i=0;i<80;i++){

let x = noise(i)*width;
let y = noise(i+100)*height*0.6;

fill(255,255,255,150);
circle(x,y,1);

}

// moon
fill(240);
noStroke();
circle(width-140,120,80);

}
