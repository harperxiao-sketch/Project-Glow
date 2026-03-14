let branches=[]
let leaves=[]
let particles=[]
let birds=[]
let stars=[]

let growLevel=1

function setup(){

createCanvas(window.innerWidth,window.innerHeight)

generateTree()

for(let i=0;i<120;i++){
stars.push(new Star())
}

for(let i=0;i<2;i++){
birds.push(new Bird())
}

}

function draw(){

background(6,8,20)

drawMoon()

updateStars()

drawTree()

updateLeaves()

updateParticles()

updateBirds()

}

function drawMoon(){

noStroke()
fill(240)
circle(width-140,120,80)

}

function generateTree(){

branches=[]
leaves=[]

let startX=width/2
let startY=height*0.85

branches.push(new Branch(startX,startY,-PI/2,120,0))

for(let i=0;i<growLevel;i++){

let newBranches=[]

for(let b of branches){

if(!b.split){

let a=random(0.3,0.6)

newBranches.push(
new Branch(b.endX,b.endY,b.angle-a,b.len*0.7,b.depth+1)
)

newBranches.push(
new Branch(b.endX,b.endY,b.angle+a,b.len*0.7,b.depth+1)
)

b.split=true

if(b.depth>2){
leaves.push(new Leaf(b.endX,b.endY))
}

}

}

branches=branches.concat(newBranches)

}

}

class Branch{

constructor(x,y,angle,len,depth){

this.x=x
this.y=y
this.angle=angle
this.len=len
this.depth=depth
this.split=false

this.endX=x+cos(angle)*len
this.endY=y+sin(angle)*len

}

display(){

stroke(120,200,160)
strokeWeight(map(this.depth,0,6,8,1))

line(this.x,this.y,this.endX,this.endY)

}

}

function drawTree(){

for(let b of branches){
b.display()
}

}

class Leaf{

constructor(x,y){
this.x=x
this.y=y
this.size=random(8,12)
}

display(){

let d=dist(mouseX,mouseY,this.x,this.y)

if(d<120){
fill(160,255,200)
}else{
fill(100,200,140)
}

noStroke()

ellipse(this.x,this.y,this.size,this.size*0.6)

}

}

function updateLeaves(){

for(let l of leaves){
l.display()

if(random()<0.01){
particles.push(new Glow(l.x,l.y))
}

}

}

class Glow{

constructor(x,y){
this.x=x
this.y=y
this.life=100
this.vy=random(-0.5,-1)
}

update(){
this.y+=this.vy
this.life--
}

display(){

fill(150,255,220,this.life)
noStroke()
circle(this.x,this.y,4)

}

}

function updateParticles(){

for(let i=particles.length-1;i>=0;i--){

particles[i].update()
particles[i].display()

if(particles[i].life<0){
particles.splice(i,1)
}

}

}

class Bird{

constructor(){

this.x=random(width)
this.y=random(120,260)
this.speed=random(2,3)

}

update(){

this.x+=this.speed

if(this.x>width+40){
this.x=-40
}

}

display(){

stroke(220)
strokeWeight(2)
noFill()

arc(this.x,this.y,20,10,PI,TWO_PI)
arc(this.x+20,this.y,20,10,PI,TWO_PI)

}

}

function updateBirds(){

for(let b of birds){
b.update()
b.display()
}

}

class Star{

constructor(){

this.x=random(width)
this.y=random(height*0.6)
this.size=random(1,2)
this.phase=random(TWO_PI)

}

display(){

let t=sin(frameCount*0.02+this.phase)

fill(255,255,255,150+t*100)
noStroke()

circle(this.x,this.y,this.size)

}

}

function updateStars(){

for(let s of stars){
s.display()
}

}

function mousePressed(){

growLevel++
generateTree()

}

function mouseDragged(){

particles.push(new Glow(mouseX,mouseY))

}
