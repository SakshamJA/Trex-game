var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score;

//the gameState
var PLAY = 0;
var END = 1;
var gameState = PLAY;

//The restart variables
var restart,gameOver;

//The restart images
var restartImage, gameOverImage;

function preload(){
  trex_running = loadAnimation("Images/Trex/trex1.png","Images/Trex/trex3.png","Images/Trex/trex4.png");
  trex_collided = loadImage("Images/Trex/trex_collided.png");
  
  groundImage = loadImage("Images/ground2.png");
  
  cloudImage = loadImage("Images/cloud.png");
  
  obstacle1 = loadImage("Images/Obstacles/obstacle1.png");
  obstacle2 = loadImage("Images/Obstacles/obstacle2.png");
  obstacle3 = loadImage("Images/Obstacles/obstacle3.png");
  obstacle4 = loadImage("Images/Obstacles/obstacle4.png");
  obstacle5 = loadImage("Images/Obstacles/obstacle5.png");
  obstacle6 = loadImage("Images/Obstacles/obstacle6.png");
  
  restartImage = loadImage('restart.png');
  
  gameOverImage = loadImage('gameOver.png');
}

function setup() {
  createCanvas(600, 200);
  
  trex = createSprite(50,180,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation('collided',trex_collided);
  trex.scale = 0.5;
  
  ground = createSprite(200,180,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  ground.velocityX = -4;
  
  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;
  
  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  
  score = 0;
  
  gameOver = createSprite(300,75,10,10);
  gameOver.addImage('gameOver',gameOverImage);
  gameOver.scale = 0.5;
  gameOver.visible = false;
  
  restart = createSprite(300,110,10,10);
  restart.addImage('restarting',restartImage);
  restart.scale = 0.5;
  restart.visible = false;
}

function draw() {
  background(180);
  
  if(gameState === PLAY) {
    if(keyDown("space") && trex.y > 130) {
    trex.velocityY = -10;
  }
  
  trex.velocityY = trex.velocityY + 0.8
  
  if (ground.x < 0){
    ground.x = ground.width/2;
  }
  
  trex.collide(invisibleGround);
    
    spawnClouds();
  spawnObstacles();
    
    if(obstaclesGroup.isTouching(trex)) {
      gameState = END;
    }
    score = score + Math.round(getFrameRate()/60);
    
    ground.velocityX = -(4 + score/100);
    
    
  }else if (gameState === END) {
    ground.velocityX = 0;
    cloudsGroup.setVelocityXEach (0);
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setLifetimeEach(-1);
    obstaclesGroup.setLifetimeEach(-1);
    trex.velocityY = 0;
    
    trex.changeAnimation('collided',trex_collided);
        
    gameOver.visible = true;
    restart.visible = true;
    
    if(mousePressedOver(restart)) {
      reset();
    }
    
  }
  
  text("Score: "+ score, 500,50);
  
  
  drawSprites();
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(600,120,40,10);
    cloud.y = Math.round(random(80,120));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 200;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
  
}

function spawnObstacles() {
  if(frameCount % 60 === 0) {
    var obstacle = createSprite(600,165,10,40);
    obstacle.velocityX = -(4 + score/100);
    
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

function reset() {
  gameState = PLAY;
  cloudsGroup.destroyEach ();
  obstaclesGroup.destroyEach ();
  
  trex.changeAnimation('running', trex_running);
  
  gameOver.visible = false;
  restart.visible = false;
  
  score = 0;
}