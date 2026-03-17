// ======================
// GLOBAL
// ======================

let branches = [];
let leaves = [];

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

// ⭐ 每5秒长一层
if(millis() - lastGrowTime > 5000){
growStep();
lastGrowTime = millis();
}

drawTree();
updateLeaves();

}

// ======================
// 🌱 生长（逐层）
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

// 🌿 生成叶子
if(b.depth > 2){
leaves.push(new Leaf(b.endX, b.endY));
}

}

}

growQueue = newQueue;

}

// ======================
// 🌳 BRANCH（动画生长）
// ======================

class Branch{

constructor(x,y,angle,len,depth){

this.x = x;
this.y = y;
this.angle = angle;
this.len = len;
this.depth = depth;

this.progress = 0; // ⭐ 生长进度

this.endX = x + cos(angle)*len;
this.endY = y + sin(angle)*len;

}

update(){

// ⭐ 慢慢长出来
if(this.progress < 1){
this.progress += 0.02;
}

}

display(){

this.update();

// ⭐ 插值（关键）
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
// DRAW TREE
// ======================

function drawTree(){

for(let b of branches){
b.display();
}

}

// ======================
// 🌿 LEAF（原版）
// ======================

class Leaf{

constructor(x,y){
this.x = x;
this.y = y;
this.size = random(6,10);
}

display(){

let d = dist(mouseX, mouseY, this.x, this.y);

if(d < 120){
fill(160,255,200);
}else{
fill(100,200,140);
}

noStroke();
ellipse(this.x, this.y, this.size, this.size*0.6);

}

}

function updateLeaves(){

for(let l of leaves){
l.display();
}

}

// ======================
// 🌙 BACKGROUND（原版）
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
