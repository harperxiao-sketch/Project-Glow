let tree;
let leaves=[];
let particles=[];
let birds=[];
let stars=[];

let windField=[];
let windScale=0.002;

function setup(){
createCanvas(window.innerWidth,window.innerHeight);

tree=new Tree(width/2,height*0.85);

for(let i=0;i<120;i++){
stars.push(new Star());
}

for(let i=0;i<3;i++){
birds.push(new Bird());
}
}

function draw(){

drawNight();

let wind=noise(frameCount*0.01)*0.5;

tree.update();
tree.display(wind);

updateLeaves();
updateParticles();
updateBirds();
updateStars();
}

function drawNight(){

background(4,6,18);

let moonGlow=sin(frameCount*0.01)*20;

noStroke();
fill(240,240,255,220);
circle(width-140,120,80+moonGlow);

for(let s of stars){
s.display();
}

}

class Tree{

constructor(x,y){
this.root=new Branch(x,y,-PI/2,120,0);
this.branches=[this.root];
}

update(){

if(frameCount%100==0 && this.branches.length<120){

let b=random(this.branches);

if(!b.split){

let a=random(0.3,0.7);

let left=new Branch(b.endX,b.endY,b.angle-a,b.len*0.72,b.depth+1);
let right=new Branch(b.endX,b.endY,b.angle+a,b.len*0.72,b.depth+1);

this.branches.push(left);
this.branches.push(right);

b.split=true;

if(b.depth>2){
leaves.push(new Leaf(b.endX,b.endY));
}

}
}

}

display(wind){

for(let b of this.branches){
b.display(wind);
}

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

display(wind){

stroke(120,180,150);
strokeWeight(map(this.depth,0,6,8,1));

let sway=this.depth>0? wind*this.depth*10 :0;

let ex=this.x+cos(this.angle+sway)*this.len;
let ey=this.y+sin(this.angle+sway)*this.len;

line(this.x,this.y,ex,ey);

this.endX=ex;
this.endY=ey;

}

}

class Leaf{

constructor(x,y){
this.x=x;
this.y=y;
this.size=random(6,10);
this.phase=random(TWO_PI);
}

display(){

let glow=sin(frameCount*0.05+this.phase)*2;

noStroke();
fill(120,255,180,200);
ellipse(this.x,this.y,this.size+glow,this.size*0.6+glow);

if(random()<0.01){
particles.push(new Glow(this.x,this.y));
}

}

}

function updateLeaves(){

for(let l of leaves){
l.display();
}

}

class Glow{

constructor(x,y){
this.x=x;
this.y=y;
this.life=120;
this.vx=random(-0.2,0.2);
this.vy=random(-0.5,-1.2);
}

update(){
this.x+=this.vx;
this.y+=this.vy;
this.life--;
}

display(){
noStroke();
fill(150,255,220,this.life);
circle(this.x,this.y,4);
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

class Bird{

constructor(){

this.x=random(width);
this.y=random(120,260);
this.speed=random(1.5,3);

}

update(){

this.x+=this.speed;

if(this.x>width+40){
this.x=-40;
this.y=random(120,260);
}

}

display(){

stroke(220);
strokeWeight(2);
noFill();

arc(this.x,this.y,22,10,PI,TWO_PI);
arc(this.x+20,this.y,22,10,PI,TWO_PI);

}

}

function updateBirds(){

for(let b of birds){
b.update();
b.display();
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

let twinkle=sin(frameCount*0.02+this.phase)*1.5;

noStroke();
fill(255,255,255,180);
circle(this.x,this.y,this.size+twinkle);

}

}

function updateStars(){
for(let s of stars){
s.display();
}
}
