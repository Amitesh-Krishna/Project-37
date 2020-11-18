var dogSpr,dog,happyDog;
var allFoods,foodStock = 0;
var addFood,feedDog,feedTime = null;
var gameState,databaseRef;
var bedImg,gardenImg,toiletImg;
var bgImg = null;
var database;

function preload()
{
    dog = loadImage("images/dogImg.png");
    happyDog = loadImage("images/dogImg1.png");
    bedImg = loadImage("images/Bed Room.png");
    gardenImg = loadImage("images/Garden.png");
    toiletImg = loadImage("images/Wash Room.png");
}

function setup() {
    createCanvas(500,500);
    dogSpr = createSprite(width-80,height/2);
    dogSpr.scale = 0.2;
    dogSpr.addImage("fed",happyDog);
    dogSpr.addImage("standing",dog);
    dogSpr.changeImage("standing");

    database = firebase.database();

    allFoods = new Food();

    var foodRef = database.ref("food");
    foodRef.on("value",(data)=>{
        allFoods.updateFoodStock(data.val());
    });
    
    var feedTimeRef = database.ref("FeedTime");
    feedTimeRef.once("value",(data)=>{
        feedTime = data.val();
    });

    database.ref("gameState").once("value",(data)=>{
        gameState = data.val();
    });

    databaseRef = database.ref("/");

    addFood = createButton("Add Food");
    addFood.position(500,95);
    addFood.mousePressed(addFoods);

    feedDog = createButton("Feed Dog");
    feedDog.position(600,95);
    feedDog.mousePressed(FeedDog);

    allFoods.getFoodStock();
}


function draw() { 
    if(bgImg != null){
        background(bgImg);
    }else{
        background(color(46,139,87));
    }
    drawSprites();

    if(feedTime == hour()){
        dogSpr.changeImage("fed");
    }

    if(gameState != "hungry"){
        addFood.hide();
        feedDog.hide();
    }else{
        addFood.show();
        feedDog.show();
    }

    if(hour() == feedTime+1){
        Garden();
        gameState = "playing";
        databaseRef.update({gameState:"playing"});
    }else if(hour() == feedTime+2){
        bedRoom();
        gameState = "sleeping";
        databaseRef.update({gameState:"sleeping"});
    }else if(hour() == feedTime+3||hour() == feedTime+4){
        WashRoom();
        gameState = "bathing";
        databaseRef.update({gameState:"bathing"});
    }else{
        gameState = "hungry";
        databaseRef.update({gameState:"hungry"});
        allFoods.display();
        dogSpr.visible = true;
        bgImg = null
    }

    // Last feeding time checking
    textSize(20);
    fill(255,255,254);
    strokeWeight(1);
    stroke("Black");
    if(feedTime>12){
        text("Last fed on " + (feedTime - 12) + "PM",150,30);
    }else if(feedTime == 0){
        text("Last fed on 12AM",150,30);
    }else{
        text("Last fed on "+feedTime+"AM",150,30);
    }
}

function addFoods(){
    allFoods.updateFoodStock(allFoods.getFoodStock()+1);
}

function FeedDog(){
    dogSpr.changeImage("fed");
    allFoods.deductFood();
    feedTime = hour();
    databaseRef.update({FeedTime:feedTime});
}

function bedRoom(){
    bgImg = bedImg;
    dogSpr.visible = false;
}

function Garden(){
    bgImg = gardenImg;
    dogSpr.visible = false;
}

function WashRoom(){
    bgImg = toiletImg;
    dogSpr.visible = false;
}