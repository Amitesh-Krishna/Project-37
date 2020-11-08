var dog,dogSpr,happyDog,foodNum,foodRef,database;

function preload()
{
    dog = loadImage("images/dogImg.png");
    happyDog = loadImage("images/dogImg1.png");
}

function setup() {
    createCanvas(500,500);
    dogSpr = createSprite(width-140,height/2);
    dogSpr.scale = 0.2;
    dogSpr.addImage("fed",happyDog);
    dogSpr.addImage("standing",dog);
    dogSpr.changeImage("standing");

    database = firebase.database();

    foodRef = database.ref("/food");
    foodRef.on("value",readFood);
}


function draw() {  
    background(color(46,139,87));
    if(keyWentDown(UP_ARROW)){
        feed();
    }
    drawSprites();
    fill("Red");
    stroke("black");
    textSize(30);
    text("Food Left:"+foodNum,width-220,height/2 - 100);
}

function readFood(data){
    foodNum = data.val();
}

function feed(){
    if(foodNum>0){
        foodNum--;
    }
    if(foodNum!=0){
        database.ref("/").update({food:foodNum});
        dogSpr.changeImage("fed");
    }else{
        database.ref("/").update({food:10});
    }
    
}