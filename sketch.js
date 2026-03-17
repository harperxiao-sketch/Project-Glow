// ======================
// GLOBAL
// ======================

let branches = [];
let leaves = [];
let particles = [];

let growQueue = [];

let lastGrowTime = 0;

// ======================
// SETUP
// ======================

function setup(){

createCanvas(window.innerWidth, window.innerHeight);

let root = new Branch(width/2, height*0.9, -PI/2, 120, 0);
branches.push(root);
growQueue.push(root);

lastGrowTime = millis();

}

// ======================
// DRAW
// ======================

function draw(){

drawBackground();

// ⭐ 自动生长（5秒）
if(millis() - lastGrowTime > 5000){
growStep();
lastGrowTime = millis();
}

drawTree();
updateLeaves();
updateParticles();

}

// ======================
// 🌱 GROWTH
// ======================

function growStep(){

let newQueue = [];

for(let b of growQueue){

if(b.depth < 6){

let angleOffset = random(0.3,0.6);

let left = new Branch(
b.endX,
b.endY,
b.angle - angleOffset,
b.len * 0.7,
b.depth + 1
);

let right = new Branch(
b.endX,
b.endY,
b.angle + angleOffset,
b.len * 0.7,
b.depth + 1
);

branches.push(left);
branches.push(right);

newQueue.push(left);
newQueue.push(right);

// 🌿 叶子
if(b.depth > 2){
leaves.push(new Leaf(b.endX, b.endY));
}

}

}

growQueue = newQueue;

}

// ======================
// 🌳 BRANCH
// ======================

class Branch{

constructor(x,y,angle,len,depth){

this.x = x;
this.y = y;
this.angle = angle;
this.len = len;
this.depth = depth;

this.progress = 0;

this.endX = x + cos(angle)*len;
this.endY = y + sin(angle)*len;

}

update(){

if(this.progress < 1){
this.progress += 0.02;
}

}

display(){

this.update();

let ex = lerp(this.x, this.endX, this.progress);
let ey = lerp(this.y, this.endY, this.progress);

// 树干 vs 树枝
let w;

if(this.depth === 0){
w = 14;
}else{
w = map(this.depth,1,6,6,1);
}

stroke(120,200,160);
strokeWeight(w);

line(this.x, this.y, ex, ey);

}

}

// ======================
// 🌿 LEAF（带交互）
// ======================

class Leaf{

constructor(x,y){
this.x = x;
this.y = y;
this.size = random(6,10);
}

display(){

let d = dist(mouseX, mouseY, this.x, this.y);

// 🖱 靠近发光
if(d < 120){
fill(160,255,200);
}else{
fill(100,200,140);
}

noStroke();
ellipse(this.x, this.y, this.size, this.size*0.6);

// ✨ 自动粒子
if(random()<0.01){
particles.push(new Glow(this.x, this.y));
}

}

}

function updateLeaves(){

for(let l of leaves){
l.display();
}

}

// ======================
// ✨ PARTICLES
// ======================

class Glow{

constructor(x,y){
this.x = x;
this.y = y;
this.life = 100;
this.vx = random(-0.3,0.3);
this.vy = random(-1,-0.5);
}

update(){
this.x += this.vx;
this.y += this.vy;
this.life--;
}

display(){

fill(150,255,220,this.life);
noStroke();
circle(this.x, this.y, 4);

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

// ======================
// 🌙 BACKGROUND（无银河）
// ======================

function drawBackground(){

background(5,8,20);

// ⭐ 星星
for(let i=0;i<80;i++){

let x = noise(i)*width;
let y = noise(i+100)*height*0.6;

fill(255,255,255,150);
noStroke();
circle(x,y,1);

}

// 🌙 月亮
fill(240);
noStroke();
circle(width-140,120,80);

}

// ======================
// 🖱 INTERACTION
// ======================

// 点击 → 立即长一层
function mousePressed(){
growStep();
}

// 拖动 → 粒子
function mouseDragged(){
particles.push(new Glow(mouseX, mouseY));
}
