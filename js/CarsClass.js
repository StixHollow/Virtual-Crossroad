/************************************************************************************************************************************
    *                                                                                                                                *
    *		Author        = Marti;                                                                                               *
    *		File          = CarsClass.js;                                                                                        *
    *		Description   = Class for use the car;                                                                               *
    *		Version       = 0.1 ALPHA 28.09.2012
    *                           1.0 19.10.2012  OPERATIONNEL                                                                                *
    *                                                                                                                                *
    *                                                                                                                                *
 *************************************************************************************************************************************/

var DistanceFinishedRotation = 80; // Where the car stop the rotation

function Car(ActiveRandom) {	
    
    NumCars += 1; // increase the number of cars
    TotalCars += 1; // increase the number of total car created
                
    this.type = Math.ceil(Math.random()*MAXNUMCARS); // get the type of car (differant sprite)
    this.img = ImgTab['Cars']['img'][this.type];  // get the img
	//alert(ImgTab['Cars']['img'][this.type] + ' = ' + this.type);	
    var dw = 82; // Default width 
    var dh = 82; // Default Height

    var entre = this.Create(dw,dh, ActiveRandom); // create the car
    
    if (entre['d'] == 'LE') {
        var r = 360;
    } else {
        var r = 0;
    }// rotation for car
		
    this.id = TotalCars; // car have a id
    this.x = entre['x'] ; // x of the car
    this.y = entre['y'];  // y of the car
    this.width = dw;      // width of the car
    this.height = dh;     // the height of the car
    this.direction = entre['d']; // direction of the car
    this.numDir = entre['n']; // Convert in number the direction
    this.speed = entre['s'] ;  // Speed of the car
    this.enter = entre['e']; // where is enter the car in the map
    this.rotation = r; // rotation for car
    this.UnderTheLine = true; // if he is befor or after the line for stop

}

/*****************************************************************
		Function      = Create;
		Description   = Generate the basic information about the car
		Return        = Array : Entre
		
 *****************************************************************/
Car.prototype.Create = function(dw,dh, ActiveTheRandom) {
    do {
        // random the enter
        var e = Math.ceil(Math.random()*3);
        var m = TabPoint[e].length -1;
        var h = Math.ceil(Math.random()* m);
    
    } while (TabPoint[e][h]['NbCars'] >= 2); // while he is complete
    
	
    var Entre = { // ini the output var
        'x' : 0,
        'y' : 0 
    }
	
	
    // differant enter place the position of the car	
    if (e == 1) {
        Entre['x'] = TabPoint[e][h]['x'];
        Entre['y'] = Math.floor(TabPoint[e][h]['y'] - (dh / 4));
    }
    if (e == 2) {
        Entre['x'] = Math.floor(TabPoint[e][h]['x']  - (dw / 4));
        Entre['y'] = Math.floor(TabPoint[e][h]['y']);
    }
    if (e == 3) {
        Entre['x'] = Math.floor(TabPoint[e][h]['x'] - dw);
        Math.floor(Entre['y'] = TabPoint[e][h]['y'] - dh / 4);
    }
    
    // get direction
    Entre['d'] = TabPoint[e][h]['Direction'];
    Entre['n'] = h;
    Entre['e'] = e;
	
    
    //Entre['s'] = 30;
    Entre['s'] = Math.floor((Math.random()*10)+(MaxSpeed-10));	// define a random speed
    
    // BUG BUG BUG BUG BUG
    if (TabPoint[e][h]['NbCars'] != 0){
        for (var i = 1; i <= NumCars-1; i++){        
            if ((TabObjectInfo['Cars'][i].direction == Entre['d']) && (TabObjectInfo['Cars'][i].enter == Entre['e'])){
                
                var Dif = Entre['s'] - TabObjectInfo['Cars'][i].speed;
                if (Dif > 0) {   
                    var AddDif = Math.ceil(Math.random()*5);
                    Entre['s'] -= (Dif +AddDif);            
                }
            }
        }
    } 
    
    TabPoint[e][h]['NbCars'] += 1; // add a new car in the enter

    return Entre;

}

/*****************************************************************
		Function      = DrawCar;
		Description   = Draw the car in the map 
		Return        = 
		
 *****************************************************************/
Car.prototype.DrawCar = function() {
    // cut the sprite and draw the img
    if (this.rotation == 0 || this.rotation == 360) {
        CutImg(this.img, this.x, this.y, this.width, this.height, this.enter, 3, 3);
    } else if (this.rotation != 0) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.translate(this.width, this.height);
        ctx.rotate(this.rotation * Math.PI / 180);
        CutImg(this.img, (-this.width), (-this.height), this.width, this.height, this.enter, 3, 3);
        ctx.restore();
    }
}

/*****************************************************************
		Function      = Move;
		Description   = redirect the movement for all car
		Return        = 
		
 *****************************************************************/
Car.prototype.Move = function(PlaceInTheTable) {
    // for every enter it's differant'
    switch(this.enter){
        case 1 : {
            this.MoveEnter1(PlaceInTheTable);  
            break;
        }
        case 2 : {
            this.MoveEnter2(PlaceInTheTable); 
            break;
        }
        case 3 : {
            this.MoveEnter3(PlaceInTheTable);   
            break;
        }
    }
}

/*****************************************************************
		Function      = MoveEnter1;
		Description   = Make movement for the car in the first enter
		Return        = 
		
 *****************************************************************/
Car.prototype.MoveEnter1 = function(PTable) {    
    var DistanceCarTrash = (SecurityLineDistance + this.width)*2; // use a security distance
    //if (this.direction == 'ST') { // if direction is STRAIGHT
    if (this.x <= TOTAL_WIDTH && this.y <= TOTAL_HEIGHT) { // if the car is out of the canvas
        
        // if the light is green OR the car is under the stop line OR over the stop line 
        if (Stat == this.enter && !MiddleLight || this.UnderTheLine == false) {
            // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!! ROTATION
            var valChangeAngle = TabPoint[this.enter]['Line'] + 25; // Distance Where the car start to turn
            
            var AdditionRotation = 2; // How much turn the rotation
            
            // Test if the diretion is "Right" and if at this distance they must turn
            if (this.direction == 'RI' && this.x >= valChangeAngle) { 
                this.speed = 30;
                // If it's must stop turn because he can turn more or if distance is out
                if (this.x >= valChangeAngle + DistanceFinishedRotation && this.rotation >= 90) {
                    this.IncreaseCar(2); // increase the y of car
                } else {
                    
                    
                    this.IncreaseCar(1); // increase the x of car
                    this.IncreaseCar(2); // increase the y of car
                    this.rotation += AdditionRotation; // add to the rotation
                }
            } else {
                this.IncreaseCar(1); // increase the x of car
            }
                            
        // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!! ROTATION
        } else {
            // if it's after the line movement
            if (this.x > (TabPoint[this.enter]['Line'] + SecurityLineDistance - this.width)) {
                this.IncreaseCar(1); //increase the x of car
            } else {
                // if it's before the line'
                if (this.x < (TabPoint[this.enter]['Line'] - SecurityLineDistance - this.width)) {
                    if (TabPoint[this.enter][this.numDir]['NbCars'] == 2 ){ // if enter isent full
                        // move while you can before the line
                        if (this.x < (TabPoint[this.enter]['Line'] -  DistanceCarTrash)) {
                            this.IncreaseCar(1); // increase the x of car 
                        }
                    } else {
                        this.IncreaseCar(1); // increase the x of car
                    }
                }
            }
        }
    } else {
        this.Destroy(PTable); // out of canvas destroy the car
        DrawScreen();   // Draw the object in the screen
    }
            
    //} 
    
    if (this.x > TabPoint[this.enter]['Line'] && this.UnderTheLine) { // if the car is over the stop line the enter have one car less 
        TabPoint[this.enter][this.numDir]['NbCars'] -= 1;
        this.UnderTheLine = false; // the car is over the line
    } // One less car in the enter  
	
}

/*****************************************************************
		Function      = MoveEnter2;
		Description   = Make movement for the car in the 2nd enter
                ** For documentation go to the first enter fonction
		Return        = 
		
 *****************************************************************/
Car.prototype.MoveEnter2 = function(PTable) {
    
    var DistanceCarTrash = (SecurityLineDistance + this.height)*2; // use a security distance
    //if (this.direction == 'ST') { // if direction is STRAIGHT
    if (this.y <= TOTAL_HEIGHT && this.x <= TOTAL_WIDTH && (this.x + this.width*2) >= 0) { // if the car is out of the canvas
        // if the light is green OR the car is under the stop line OR over the stop line 
        if (Stat == this.enter && !MiddleLight || this.UnderTheLine == false ) {
            // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!! ROTATION
            var AddTurn = 0;
            if(this.direction == 'LE') {
                AddTurn = 20;
            }
            var valChangeAngle = TabPoint[this.enter]['Line'] + 120 + AddTurn;
            var DistanceFinishedRotation = 80;
            var AdditionRotation = 3;
            
            if (this.direction == 'RI' && this.y >= valChangeAngle) {
                this.speed = 30;
                if (this.y >= valChangeAngle + DistanceFinishedRotation && this.rotation >= 90) {
                    this.IncreaseCar(3);
                } else {
                    AdditionRotation = 3;
                    this.IncreaseCar(2); // move too 
                    this.IncreaseCar(3);
                    this.rotation += AdditionRotation;
                }
            } else if (this.direction == 'LE' && this.y >= valChangeAngle) {
                this.speed = 30;
                DistanceFinishedRotation = 80;
                if (this.y >= valChangeAngle + DistanceFinishedRotation && this.rotation <= 270) {
                    this.IncreaseCar(1);
                } else {
                    this.IncreaseCar(2); // move too 
                    this.IncreaseCar(1);
                    this.rotation -= AdditionRotation;
                }
            } else {
                this.IncreaseCar(2); // move too 
            }
                            
        // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!! ROTATION
        } else {
            if (this.y > (TabPoint[this.enter]['Line'] + SecurityLineDistance)) {
                this.IncreaseCar(2);
            } else {
                if (this.y < (TabPoint[this.enter]['Line'] - SecurityLineDistance*2)) {
                    if (TabPoint[this.enter][this.numDir]['NbCars'] == 2 ){ // if enter isent full
                        if (this.y < (TabPoint[this.enter]['Line'] -  DistanceCarTrash)) {
                            this.IncreaseCar(2); // MOoooooooooooooooovement
                        }
                    } else {
                        this.IncreaseCar(2);  // move too
                    }
                }
            }
        }
    } else {
        this.Destroy(PTable); // out of canvas destroy the car
        DrawScreen();   // Draw the object in the screen
    }
            
    //} 
    
    if (this.y > TabPoint[this.enter]['Line'] && this.UnderTheLine) { // if the car is over the stop line the enter have one car less 
        TabPoint[this.enter][this.numDir]['NbCars'] -= 1;
        this.UnderTheLine = false; // the car is over the line
    } // One less car in the enter 
}

/*****************************************************************
		Function      = MoveEnter3;
		Description   = Make movement for the car in the 3rd enter
                ** For documentation go to the first enter fonction
		Return        = 
		
 *****************************************************************/
Car.prototype.MoveEnter3 = function(PTable) {
    var DistanceCarTrash = (SecurityLineDistance - this.width)*2; // use a security distance
    //if (this.direction == 'ST') { // if direction is STRAIGHT
    if ((this.x + this.width) >= 0 && this.y <= TOTAL_HEIGHT) { // if the car is out of the canvas
        // if the light is green OR the car is under the stop line OR over the stop line 
        if (Stat == this.enter && !MiddleLight || this.UnderTheLine == false) {
            // !!!!!!!!!!!!!!!!!!!!!!!!!!!! ROTATION
            var valChangeAngle = TabPoint[this.enter]['Line'] - 120; // Distance Where the car start to turn
            var DistanceFinishedRotation = 80; // Where the car stop the rotation
            var AdditionRotation = 1.5; // How much turn the rotation
            
            if (this.direction == 'LE' && this.x <= valChangeAngle) {
                this.speed = 30;
                DistanceFinishedRotation = 80;
                if (this.x <= valChangeAngle - DistanceFinishedRotation && this.rotation <= 270) {
                    this.IncreaseCar(2);
                } else {
                    this.IncreaseCar(3); // move too 
                    this.IncreaseCar(2);
                    this.rotation -= AdditionRotation;
                } 
            } else { 
                this.IncreaseCar(3);
            } // move too      
        // !!!!!!!!!!!!!!!!!!!!!!!!!!!! ROTATION
        } else {
            if (this.x < (TabPoint[this.enter]['Line'] - SecurityLineDistance)) {
                this.IncreaseCar(3);
                               
            } else {
                if (this.x > (TabPoint[this.enter]['Line'] + SecurityLineDistance)) {
                    if (TabPoint[this.enter][this.numDir]['NbCars'] == 2 ){ // if enter isent full
                        if (this.x > (TabPoint[this.enter]['Line'] -  DistanceCarTrash)) {
                            this.IncreaseCar(3);// MOoooooooooooooooovement
                                                    
                        }
                    } else {
                        this.IncreaseCar(3); // move too
                                                 
                    }
                }
            }
        }
    } else {
        this.Destroy(PTable); // out of canvas destroy the car
        DrawScreen();   // Draw the object in the screen
    }
            
    //} 
    
    if (this.x < TabPoint[this.enter]['Line'] && this.UnderTheLine) { // if the car is over the stop line the enter have one car less 
        //alert(this.x + '<' + (TabPoint[this.enter]['Line'] - SecurityLineDistance));
        TabPoint[this.enter][this.numDir]['NbCars'] -= 1;
        this.UnderTheLine = false; // the car is over the line
    } // One less car in the enter 
	
}

/*****************************************************************
		Function      = IncreaseCar;
		Description   = Increase the x or y of the car
		Return        = 
		
 *****************************************************************/
Car.prototype.IncreaseCar = function(D) { 
    
    /*var CalcNewRot = 90 - this.rotation;
    var r = DistanceFinishedRotation /17;          
    var Fx = (r * Math.cos(this.rotation * Math.PI / 180));
    var Fy = (r * Math.sin(this.rotation * Math.PI / 180));
            
    //alert(Fx + ' ' + Fy);
                    
    //this.x += Fx;
    //this.y += Fy;
    
    switch(D){
        case 1 : {
            this.x += Fx;
            break;
        }
        case 2 : {
            this.y += Fy;
            break;
        }
        case 3 : {
            this.x -= Fx;
            break;
        }
        case 4 : {
            this.y -= Fy;
            break;
        }
    }*/
                    
    switch(D){
        case 1 : {
            this.x += this.speed/10;
            break;
        }
        case 2 : {
            this.y += this.speed/10;
            break;
        }
        case 3 : {
            this.x -= this.speed/10;
            break;
        }
        case 4 : {
            this.y -= this.speed/10;
            break;
        }
    }
}

Car.prototype.HavePlace = function() {
    var m = 0; // num of road in the enter
    var c = 0; // couter of free enter
	
    for (var e = 1; e <= 3; e++) {
        m = TabPoint[e].length -1;
        for (var h = 1; h <= m; h++) {
            if (TabPoint[e][h]['NbCars'] < 2) { // if this enter is free
                c++ // increae the counter
            }
        }
    }
		
    //alert(c);
    if (c != 0) { // if at least 1 enter is free
        return true;
    } else {
        return false;
    }
}

/*****************************************************************
		Function      = Destroy;
		Description   = Destroy the car out of the canvas
		Return        = 
		
 *****************************************************************/
Car.prototype.Destroy = function(PTable) {
    TabObjectInfo['Cars'] = UnsetArray( TabObjectInfo['Cars'], PTable) // unset a row
    NumCars -= 1; // removed a car
    if (PTable == SelectedCar) {
        SelectedCar = 0;
    }
}

/*****************************************************************
		Function      = CarDistance;
		Description   = Test if car is too close
		Return        = 
		
 *****************************************************************/
/* UNDER CONSTRUCTION */
Car.prototype.CarDistance = function() {
    for (var i = 1; i <= NumCars; i++) {
        if (i != j) {
            if (this.x < (TabObjectInfo['Cars'][i].x - SecurityLineDistance) && (this.x + this.width) > (TabObjectInfo['Cars'][i].x + SecurityLineDistance)) {
                alert('Hello');
            }
				
				
				
        }
    }
}

/* ---------- RETURN INFO FUNCTION ---------------- 
Car.prototype.getX = function() {
    return this.x;
}

Car.prototype.getY = function() {
    return this.y;
}

Car.prototype.getSpeed = function() {
    return this.speed;
}

Car.prototype.getDirection = function() {
    return this.direction;
}

Car.prototype.getType = function() {
    return this.type;
}

Car.prototype.getEntre = function() {
    return this.entre;
}*/