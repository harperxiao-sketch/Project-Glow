let brightness = 0;

let growLevel = 1;

let prevBrightness = 0;
let goingUp = false;
let breathCount = 0;

let branches = [];
let leaves = [];
let fireflies = [];
let stars = [];

function setup(){

createCanvas(window.innerWidth,window.innerHeight);

generateTree();

for(let i=0;i<200;i++){
stars.push(new Star());
}

for(let i=0;i<30;i++){
fireflies.push(new Firefly());
}

}

function draw(){

drawGalaxy();

drawTree();
updateLeaves();
updateFireflies();

}

function drawGalaxy(){

background(5,6,18);

// 银河渐变
for(let i=0;i<height;i+=2){

let n = noise(i*0.01,frameCount*0.002);

stroke(10+40*n,10+20*n,30+60*n,80);
line(0,i,width,i);

}

// 星星
for(let s of stars){
s.display();
}

// 月亮
noStroke();
fill(240);
circle(width-140,120,80);

}

function generateTree(){

branches=[];
leaves=[];

let x=width/2;
let y=height*0.85;

branches.push(new Branch(x,y,-PI/2,120,0));

for(let i=0;i<growLevel;i++){

let newBranches=[];

for(let b of branches){

if(!b.split){

let a=random(0.3,0.6);

newBranches.push(
new Branch(b.endX,b.endY,b.angle-a,b.len*0.7,b.depth+1)
);

newBranches.push(
new Branch(b.endX,b.endY,b.angle+a,b.len*0.7,b.depth+1)
);

b.split=true;

if(b.depth>2){
leaves.push(new Leaf(b.endX,b.endY));
}

}

}

branches=branches.concat(newBranches);

}

}

class Branch{

constructor(x,y,angle,len,depth){

this.x=x;
this.y=y;
this.angle=angle;
this.len=len;
this.depth=depth;
this.split=false;

this.endX=x+cos(angle)*len;
this.endY=y+sin(angle)*len;

}

display(){

let w = this.depth===0 ? 16 : map(this.depth,1,6,6,1);

strokeWeight(w);

// 🌳 树皮纹理
for(let i=0;i<3;i++){

stroke(80+random(-10,10),120,90);
line(
this.x+random(-1,1),
this.y,
this.endX+random(-1,1),
this.endY
);

}

}

}

function drawTree(){

for(let b of branches){
b.display();
}

}

class Leaf{

constructor(x,y){
this.x=x;
this.y=y;
this.size=random(6,10);
this.angle=random(TWO_PI);
}

display(){

let d=dist(mouseX,mouseY,this.x,this.y);

if(d<120){
fill(160,255,200);
}else{
fill(90,200,130);
}

noStroke();

// 🌿 真实叶子形状
push();
translate(this.x,this.y);
rotate(this.angle);

beginShape();
vertex(0,0);
bezierVertex(6,-4,10,-8,0,-12);
bezierVertex(-10,-8,-6,-4,0,0);
endShape(CLOSE);

pop();

}

}

function updateLeaves(){

for(let l of leaves){
l.display();
}

}

class Firefly{

constructor(){
this.x=random(width);
this.y=random(height);
this.vx=random(-1,1);
this.vy=random(-1,1);
this.phase=random(TWO_PI);
}

update(){

// 群体行为（轻微聚集）
let centerX=width/2;
let centerY=height/2;

this.vx += (centerX-this.x)*0.00001;
this.vy += (centerY-this.y)*0.00001;

this.x+=this.vx;
this.y+=this.vy;

}

display(){

let glow = sin(frameCount*0.05+this.phase)*120;

fill(150,255,200,glow);
noStroke();
circle(this.x,this.y,4);

}

}

function updateFireflies(){

for(let f of fireflies){
f.update();
f.display();
}

}

class Star{

constructor(){

this.x=random(width);
this.y=random(height*0.6);
this.size=random(1,2);
this.phase=random(TWO_PI);

}

display(){

let t=sin(frameCount*0.02+this.phase);

fill(255,255,255,150+t*100);
noStroke();

circle(this.x,this.y,this.size);

}

}

// 🌱 呼吸控制生长
async function readSerial(){

while(true){

const { value, done } = await reader.read();

if(done) break;

let val = parseInt(value);

if(!isNaN(val)){

brightness = val;

if(brightness > prevBrightness){
goingUp = true;
}

if(goingUp && brightness < prevBrightness){

breathCount++;
goingUp = false;

if(breathCount % 3 === 0){

growLevel++;
generateTree();

}

}

prevBrightness = brightness;

}

}

}

// 🖱 交互
function mousePressed(){
growLevel++;
generateTree();
}

function mouseDragged(){
fireflies.push(new Firefly());
}
