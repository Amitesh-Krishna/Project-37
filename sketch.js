var dogSpr,dog,happyDog;
var allFoods,foodStock = 0;
var addFood,feedDog,feedTime = null;
var database;

function preload()
{
    dog = loadImage("images/dogImg.png");
    happyDog = loadImage("images/dogImg1.png");
}

function setup() {
    createCanvas(1000,500);
    dogSpr = createSprite(width-140,height/2);
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
    
    addFood = createButton("Add Food");
    addFood.position(700,95);
    addFood.mousePressed(addFoods);

    feedDog = createButton("Feed Dog");
    feedDog.position(800,95);
    feedDog.mousePressed(FeedDog);

    allFoods.getFoodStock();
}


function draw() {  
    background(color(46,139,87));
    drawSprites();
    allFoods.display();

    textSize(20);
    fill(255,255,254);
    strokeWeight(1);
    stroke("Black");
    
    if(feedTime>12){
        text("Last fed on " + (feedTime - 12) + "PM",350,30);
    }else if(feedTime == 0){
        text("Last fed on 12AM",350,30);
    }else if(feedTime==null){
        text("Feed it first!",350,30);
    }else{
        text("Last fed on "+feedTime+"AM",350,30);
    }

    if(feedTime!=null){
        database.ref("/").update({FeedTime:feedTime})
    }
}

function addFoods(){
    allFoods.updateFoodStock(allFoods.getFoodStock()+1);
}

function FeedDog(){
    dogSpr.changeImage("fed");
    allFoods.deductFood();feedTime = hour();
}