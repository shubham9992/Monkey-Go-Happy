var bananaImage, obstacleImage, obstacleGroup, backGround,
  backImage, player_running, player_collided, monkey, invisibleGround, foodGroup;
var score = 0,
  count = 0,
  PLAY = 0,
  END = 1,
  gameState = PLAY;

function preload() {
  backImage = loadImage("jungle.png");
  player_running = loadAnimation("Monkey_01.png", "Monkey_02.png", "Monkey_03.png", "Monkey_04.png", "Monkey_05.png", "Monkey_06.png", "Monkey_07.png", "Monkey_08.png", "Monkey_09.png", "Monkey_10.png");

  player_collided = loadImage("Monkey_08.png");
  bananaImage = loadImage("banana.png");
  obstacleImage = loadImage("stone.png");
}

function setup() {
  createCanvas(400, 400);
  stroke("white");
  textSize(20);
  fill("white");

  backGround = createSprite(400, 250,300,150);
  backGround.addImage("backImage", backImage);
  backGround.x = backGround.width / 2;
  backGround.velocityX = -2;

  invisibleGround = createSprite(200, 375, 400, 5);
  invisibleGround.visible = false;

  monkey = createSprite(100, 340, 20, 50);
  monkey.addAnimation("running", player_running);
  monkey.addAnimation("collided", player_collided);
  monkey.scale = 0.1;
  monkey.setCollider("rectangle", 0, 0, monkey.width / 2, monkey.height);
  monkey.debug = true;

  obstacleGroup = new Group();
  foodGroup = new Group();
}

function draw() {
  background(220);

  // checking state of game  
  if (gameState === PLAY) {

    if (backGround.x < 150) {
      backGround.x = backGround.width / 2;
    }

    if (foodGroup.isTouching(monkey)) {
      score += 2;
      foodGroup.destroyEach();
    }

    switch (score) {
      case 10:
        monkey.scale = 0.12;
        break;
      case 20:
        monkey.scale = 0.14;
        break;
      case 30:
        monkey.scale = 0.16;
        break;
      case 40:
        monkey.scale = 0.18;
        break;
      default:
        break;
    }
    // to jumping the monkey
    if (keyDown("space") && monkey.y > 320) {
      monkey.velocityY = -17;
    }

    // giving gravity for monkey to come down
    monkey.velocityY = monkey.velocityY + 0.8;

    if (obstacleGroup.isTouching(monkey)) {
      monkey.scale = 0.1;
      count += 1;
      if (count == 2) {
        gameState = END;
        monkey.changeAnimation("collided", player_collided);
      }
    }

    spawnObstacles();
    spawnFood();

  } else if (gameState == END) {
    count = 0;
    //score = 0;
    backGround.velocityX = 0;
    monkey.velocityY = 0;

    monkey.addImage("monkey collided", player_collided);
    obstacleGroup.setVelocityXEach(0);
    foodGroup.setVelocityXEach(0);

    //setting lifetime of the game objects
    obstacleGroup.setLifetimeEach(-1);
    foodGroup.setLifetimeEach(-1);

  }
  monkey.collide(invisibleGround);

  drawSprites();
  text("Score :" + score, 200, 20);
}

function spawnObstacles() {
  if (World.frameCount % 300 === 0) {
    var obstacle = createSprite(400, 350, 10, 40);
    obstacle.velocityX = -(6 + 3 * score / 100);

    obstacle.addAnimation("Stone", obstacleImage);

    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.15;
    obstacle.lifetime = 70;
    //add each obstacle to the group
    obstacleGroup.add(obstacle);
  }
}

function spawnFood() {

  if (World.frameCount % 80 === 0) {
    var banana = createSprite(400, 320, 40, 10);
    banana.y = random(120, 200);
    banana.addAnimation("Banana", bananaImage);
    banana.scale = 0.05;
    banana.velocityX = -3;

    //assign lifetime to the variable
    banana.lifetime = 134;

    //adjust the depth
    banana.depth = monkey.depth;
    monkey.depth = monkey.depth + 1;

    //add each banana to the group
    foodGroup.add(banana);
  }

}
