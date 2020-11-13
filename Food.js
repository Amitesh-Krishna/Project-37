class Food{
	constructor(){
		this.foodS = 0;
		this.lastFed = 0;
		this.image = loadImage("images/Milk.png");
	}

	getFoodStock(){
		return this.foodS;
	}

	updateFoodStock(food){
		this.foodS = food;
		database.ref("/").update({food:this.foodS});
	}

	deductFood(){
		if(this.foodS>0){
			this.foodS--;
			database.ref("/").update({food:this.foodS});
		}
	}

	display(){
		var x = 80,y=100;
		image(this.image,720,220,70,70);

		if(this.foodS!=0){
			for(var i = 0;i<this.foodS;i++){
				if(i%10 == 0){
					x = 80;
					y += 50;
				}
				image(this.image,x,y,50,50);
				x += 30;
			}
		}
	}
}