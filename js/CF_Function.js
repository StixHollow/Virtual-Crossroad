/*******************************************************************************
 *                                                                             *
 *		Author        = Marti;                                         *
 *		File          = CF_Function.js;                                *
 *		Description   = Libraries of function for the crossroad;       *
 *		Version       = 0.1 ALPHA 14.09.2012                           *
 *                              0.5 BETA  21.09.2012                           *
 *                              1.0       19.10.2012  OPERATIONNEL             *
 *                                                                             *       
 ******************************************************************************/

/*****************************************************************
		Author        = Marti;
		Function      = Movement;
		Description   = Make all change in the page;
		Return        = /
 *****************************************************************/
 
function Movement(){
    var date = new Date;
    var s = date.getSeconds(); // catch the sceond whit date object
	
    if (s != LastTime){      // every second (script call evers 10 millisecond)
        if (PlayCar) {	
            DrawTimer();
            if (TBCES < CES) { // Check tim between create a new car
                TBCES++;      // If it's not time to create a new car add 1 second in new time
			
            } else {
                if (NumCars == 0) {  // if number of car is 0 create the first car
				
                    TabObjectInfo['Cars'][NumCars+1] = new Car();
				
                
                } else {
                    if (TabObjectInfo['Cars'][NumCars].HavePlace()) { // else check  if they have place for a new car in game
                        TabObjectInfo['Cars'][NumCars+1] = new Car(); // creat new car
                    }
                }
                TBCES = 0;      // And the counter between the car set in 0;
            }
        }
        ActiveLight();   // Change the light
        document.getElementById('icon').href = './img/ico/ico' + getLight(1) +  '.ico';

        LastTime = s;   // set a new last time (= new second) 
        DocThePlace(); // Make documentation in the page
        
        
    }	
    if (NumCars != 0){
        for (var i = 1; i <= NumCars; i++) { 
            TabObjectInfo['Cars'][i].Move(i);
        }
    }
    UpdateInformationCar();
    DrawScreen();   // Draw the object in the screen
}
 
/*****************************************************************
		Author        = Marti;
		Function      = DrawScreen;
		Description   = Draw The principal screen and basic image;
		Return        = /
		
 *****************************************************************/
 
function DrawScreen(){ 
    // Clean the screen
    ctx.save();
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, TOTAL_HEIGHT, TOTAL_WIDTH);
    ctx.restore();
    
    // Draw background image
    ctx.drawImage(ImgTab['Map']['img'] ,0,0,ImgTab['Map']['W'] , ImgTab['Map']['H']); 
	 
    // Deaw the "sens interdit"  
    ctx.drawImage(ImgTab['SignSens']['img'] ,TabObjectInfo['SensInterdit']['x'],TabObjectInfo['SensInterdit']['y'],ImgTab['SignSens']['W'] , ImgTab['SignSens']['H']); // Draw the sens interdit
	
    // draw the 3 light
    ctx.drawImage(ImgTab['Light']['img'][getLight(1)] ,TabObjectInfo['Light'][1]['x'] ,TabObjectInfo['Light'][1]['y'] ,ImgTab['Light']['W'] , ImgTab['Light']['H']);
    ctx.drawImage(ImgTab['Light']['img'][getLight(2)] ,TabObjectInfo['Light'][2]['x'] ,TabObjectInfo['Light'][2]['y'] ,ImgTab['Light']['W'] , ImgTab['Light']['H']);
    ctx.drawImage(ImgTab['Light']['img'][getLight(3)] ,TabObjectInfo['Light'][3]['x'] ,TabObjectInfo['Light'][3]['y'] ,ImgTab['Light']['W'] , ImgTab['Light']['H']);
	
    // draw the 4 pieton light
    for(var i = 1; i <= 4; i++) {
        ctx.drawImage(ImgTab['Pieton']['img'][getLight(4)] ,TabObjectInfo['Pieton'][i]['x'] ,TabObjectInfo['Pieton'][i]['y'] ,ImgTab['Pieton']['W'] , ImgTab['Pieton']['H']);
    }
    
    // Move then draw all cars
    if (NumCars != 0){
        for (var i = 1; i <= NumCars; i++) { 
			
            TabObjectInfo['Cars'][i].DrawCar();
			
        }
    }
	
    return true;
}

/*******************************************************************
 
		Author      = Marti;
		Function    = SelectCarToInfo;
		Description = Select Car to get info 
		Return      = x - y
 
 *********************************************************************/
function SelectCarToInfo(event){
    var x = event.clientX - canvas.offsetLeft; // get x of mouse
    var y  = event.clientY - canvas.offsetTop; // get y of mouse
    for (var i = 1; i <= NumCars; i++) { 
        if (x > TabObjectInfo['Cars'][i].x && x < (TabObjectInfo['Cars'][i].x + TabObjectInfo['Cars'][i].width) && x > TabObjectInfo['Cars'][i].x && y < (TabObjectInfo['Cars'][i].y + TabObjectInfo['Cars'][i].height)){
            // add a doc for car 
            
            document.getElementById('ImgDemoCar').alt = "Image of the select car in map";
            document.getElementById('ImgDemoCar').src = "./img/DemoCar" + TabObjectInfo['Cars'][i].type + ".png"; 
            document.getElementById('idCar').innerHTML = TabObjectInfo['Cars'][i].id;
            document.getElementById('xCar').innerHTML = Math.floor(TabObjectInfo['Cars'][i].x);
            document.getElementById('yCar').innerHTML = Math.floor(TabObjectInfo['Cars'][i].y);
            document.getElementById('widthCar').innerHTML = TabObjectInfo['Cars'][i].width;
            document.getElementById('heightCar').innerHTML = TabObjectInfo['Cars'][i].height;
            document.getElementById('directionCar').innerHTML = TabObjectInfo['Cars'][i].direction;
            document.getElementById('enterCar').innerHTML = TabObjectInfo['Cars'][i].enter;
            document.getElementById('speedCar').innerHTML = TabObjectInfo['Cars'][i].speed; 
            document.getElementById('nbenterCar').innerHTML = TabPoint[TabObjectInfo['Cars'][i].enter][TabObjectInfo['Cars'][i].numDir]['NbCars']; 
            
            SelectedCar = i;
        }			
    }
	
}

/*******************************************************************
 
		Author      = Marti;
		Function    = UpdateInformationCar;
		Description = Upadte the information of the car
		Return      = 
 
 *********************************************************************/
function UpdateInformationCar(){
    if (SelectedCar != 0) {
        // add a doc for car 
        document.getElementById('xCar').innerHTML = Math.floor(TabObjectInfo['Cars'][SelectedCar].x);
        document.getElementById('yCar').innerHTML = Math.floor(TabObjectInfo['Cars'][SelectedCar].y);
    } else {
        document.getElementById('ImgDemoCar').alt = "";
        document.getElementById('ImgDemoCar').src = ""; 
        document.getElementById('idCar').innerHTML = '';
        document.getElementById('widthCar').innerHTML = '';
        document.getElementById('heightCar').innerHTML = '';
        document.getElementById('directionCar').innerHTML = '';
        document.getElementById('enterCar').innerHTML = '';
        document.getElementById('speedCar').innerHTML = ''; 
        document.getElementById('nbenterCar').innerHTML = ''; 
        document.getElementById('xCar').innerHTML = '';
        document.getElementById('yCar').innerHTML = '';
    }// All element is clear
    
	
}

/*******************************************************************
 
		Author      = Marti;
		Function    = DrawTimer;
		Description = Draw the timer in the documentation 
		Return      = x - y
 
 *********************************************************************/
function DrawTimer(){
    ctxt.fillStyle = "white";
    ctxt.fillRect(0,0,CanvasT.width,CanvasT.height);
    
    var Advence = Math.round(CanvasT.width/WaitingTime)*Times;
    
    
    //ctxt.fillStyle = "green";
    var degrade = ctxt.createLinearGradient(0,0,CanvasT.width,CanvasT.height);//Délimitation du début et de la fin du dégradé.
    degrade.addColorStop(0,"green");//Ajout de la seconde couleur.
    degrade.addColorStop(1,"red");//Ajout d'une première couleur.
    

    ctxt.fillStyle = degrade;//On passe notre dégradé au fillStyle();
    //ctx.fillRect(21,556,300,300);
    ctxt.fillRect(0,0,Advence,CanvasT.height);

}
/*******************************************************************
 
		Author      = Marti;
		Function    = LoadImage;
		Description = Load the src, Width and Height of every image;
		Return      = /
 
 *********************************************************************/

function LoadImage() {
		
    // Ini the image of crossroad
    ImgTab['Map']['img'] = new Image;
    ImgTab['Map']['img'].src = "./img/CrossroadMap.png";
    ImgTab['Map']['W'] = 800;
    ImgTab['Map']['H'] = 800;
    
    // Ini the image of Sens Interdit
    ImgTab['SignSens']['img'] = new Image;
    ImgTab['SignSens']['img'].src = "./img/SensInterdit.png";
    ImgTab['SignSens']['W'] = 25;
    ImgTab['SignSens']['H'] = 52;
    
    ImgTab['Cars']['img'] = new Array;
    // Ini the image of cars
    for (var i = 1;i <= MAXNUMCARS;i++){
        ImgTab['Cars']['img'][i] = new Image;
        ImgTab['Cars']['img'][i].src = "./img/Sprite/Car" + i + ".png";
    }
		
    // Ini the image of light
    ImgTab['Light']['img'] = new Array;	
    ImgTab['Light']['img']['Red'] = new Image;
    ImgTab['Light']['img']['Yellow'] = new Image;
    ImgTab['Light']['img']['Green'] = new Image;
    ImgTab['Light']['img']['Off'] = new Image;
    ImgTab['Light']['img']['Red'].src = "./img/Light/RedLight.png";
    ImgTab['Light']['img']['Yellow'].src = "./img/Light/YellowLight.png";
    ImgTab['Light']['img']['Green'].src = "./img/Light/GreenLight.png";
    ImgTab['Light']['img']['Off'].src = "./img/Light/OffLight.png";
    ImgTab['Light']['W'] = 25;
    ImgTab['Light']['H'] = 52;
		
    // Ini the image of Pieton light
    ImgTab['Pieton']['img'] = new Array;	
    ImgTab['Pieton']['img']['Red'] = new Image;
    ImgTab['Pieton']['img']['Green'] = new Image;
    ImgTab['Pieton']['img']['Off'] = new Image;
    ImgTab['Pieton']['img']['Red'].src = "./img/Light/RedPieton.png";
    ImgTab['Pieton']['img']['Green'].src = "./img//Light/GreenPieton.png";
    ImgTab['Pieton']['img']['Off'].src = "./img/Light/OffPieton.png";
    ImgTab['Pieton']['W'] = 42;
    ImgTab['Pieton']['H'] = 40;
    
    ImgTab['People']['img'] = new Image;
    ImgTab['People']['img'].src = "./img/People.png";
    ImgTab['People']['W'] = 30;
    ImgTab['People']['H'] = 82;
	
}

/*******************************************************************
 
		Author      = Marti;
		Function    = getLight;
		Description = Grep if the light is green or red
		Parm		= Which enter in the crossroad
		Return      = Red or Green
 
 *********************************************************************/
function getLight(which) {
    // ini var to return
    var getBack = '';
        
    if (Stat == which && MiddleLight == false) getBack = 'Green'; else getBack = 'Red'; // if the light is red or green
    if (Stat == which && MiddleLight && Stat != 4) getBack = 'Yellow'; // if the light is yellow
    if (Stat == which && Times >= (WaitingTime - PreWaitingTime) && Stat != 4) getBack = 'Yellow'; // if the rest of the time is last 5 second get yellow
	
    if (Stat == which && MiddleLight && Stat == 4) getBack = 'Green'; // Special walker if it's must be yellow it's just green
    
    //if (WaitFinishCross) getBack = 'Red'; // if it just after the end of the light
    
    if (Stat == 5) getBack = 'Red'; // All red
    if (Stat == 0) getBack = 'Off'; // Turn off
        
    return getBack


}

/*******************************************************************
 
		Author      = Marti;
		Function    = ActiveLight;
		Description = Make the change of the light
		Return      = 
 
 *********************************************************************/
function ActiveLight() {
	
    // for the 3 light
    var MaxLight = 3;
	
    // if the walker button is on
    if (PietonLightOn) {
        MaxLight = 4;
    }
    
    // Increase the times
    Times++;
    if (Times >= WaitingTime && MiddleLight == false) { // if it's the time to change'
        //  if (!WaitFinishCross){
        if (Stat < MaxLight) {
            Stat++; // Change the stat :: it's the next light to get green'
        } else {
            Stat = 1; // If it's last light get back to 1'
        }
        MiddleLight = true; // yellow light going to be true;
        Times = 0; // Times get back to the start
        if (Stat == 4) { // button get back off
            ButtonPietonActive(false); 
        }
    //     WaitFinishCross = true;
    // } else {
    //     WaitFinishCross = false;
    // }
    }
    
    // if the time for yellow light is finish	
    if (MiddleLight && Times >= PreWaitingTime) {
        MiddleLight = false;
        Times = 0;
    }
	
	
}

/*******************************************************************
 
		Author      = Marti;
		Function    = ButtonPietonActive;
		Description = if some one click one pieton button
		Return      = x - y
 
 *********************************************************************/
function ButtonPietonActive(OnOrOff){
    // change the img of walker's button'
    if (OnOrOff){
        PietonLightOn = true;
        document.getElementById('ButtonPieton').src = './img/Button/PietonButtonOn.png';
    } else {
        PietonLightOn = false;
        document.getElementById('ButtonPieton').src = './img/Button/PietonButtonOff.png';
    }

}

/*******************************************************************
 
		Author      = Maximus;
		Function    = PauseScreen;
		Description = For stop all mouvement
		Return      = x - y
 
 *********************************************************************/
function PauseScreen(){
    ctx.save();
    ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
    ctx.fillRect(0, 0, TOTAL_HEIGHT, TOTAL_WIDTH);
    ctx.fillStyle = "white";
    ctx.fillText('Pause',300,300);
    ctx.fillText('Click for continue',290,310);
    ctx.restore();
}

/*******************************************************************
 
		Author      = Marti;
		Function    = AdaptSpeed;
		Description = Adapt the speed of car whit the range
		Return      = 
 
 *********************************************************************/
function AdaptSpeed() {
    
   var fspeed = document.getElementById('MaxSpeedRegular');
   MaxSpeed = fspeed.value;
   document.getElementById('ScreenSpeed').innerHTML = MaxSpeed;
   
	
}

/*******************************************************************
 
		Author      = Marti;
		Function    = AdaptRatio;
		Description = Adapt the Ratio of car
		Return      = 
 
 *********************************************************************/
function AdaptRatio() {
    
   var fratio = document.getElementById('MaxRatioRegular');
   Ratio = fratio.value;
   CES = Math.ceil(60/Ratio);
   document.getElementById('ScreenRatio').innerHTML = Ratio;
	
}

/*******************************************************************
 
		Author      = Marti;
		Function    = AdaptWaiting;
		Description = Adapt the the waiting time
		Return      = 
 
 *********************************************************************/
function AdaptWaiting() {
    
   var fwaiting = document.getElementById('WaitingTimeRegular');
   WaitingTime = fwaiting.value;
   document.getElementById('ScreenTime').innerHTML = WaitingTime;
	
}

/*******************************************************************
 
		Author      = Marti;
		Function    = MousePlace;
		Description = Send the position of the mouse
		Return      = x - y
 
 *********************************************************************/
function MousePlace(event){
    var x = event.clientX - canvas.offsetLeft; // get x of mouse
    var y  = event.clientY - canvas.offsetTop; // get y of mouse
	
    var msg = x + ' - ' + y; // Creat the message
	
    return (msg);
}

/*******************************************************************
 
		Author      = Marti;
		Function    = DocThePlace;
		Description = Document the page;
		Return      = 
 
 *********************************************************************/
function DocThePlace(){ 
    // make documentation
    document.getElementById('CarIn').innerHTML = NumCars;
    document.getElementById('CarTot').innerHTML = TotalCars;
    DrawTimer();
}

/*******************************************************************
 
		Author      = Internet;
		Function    = print_r;
		Description = Equivalent of var_dump in JS;
		Parm        = obj
		Return      = 
 
 *********************************************************************/

function print_r(theObj) {    
    var win_print_r = "";   
    for(var p in theObj){  
        var _type = typeof(theObj[p]);  
        if( (_type.indexOf("array") >= 0) || (_type.indexOf("object") >= 0) ){  
            win_print_r += "<li>";  
            win_print_r += "["+_type+"] =>"+p;  
            win_print_r += "<ul>";  
            win_print_r += print_r(theObj[p]);  
            win_print_r += "</ul></li>";  
        } else {  
            win_print_r += "<li>["+p+"] =>"+theObj[p]+"</li>";  
        }  
    }  
    return win_print_r;  
}//end function var_dump



/*******************************************************************
 
		Author      = Marti;
		Function    = CutImg;
		Description = Cut the sprite;
		Return      = 
		$pecial Thanks To Maxime Reuse
 
*********************************************************************/
function CutImg(img, x, y, h, w, which, NBx, NBy) {
    var NbImgX = NBx; // Number of image in the x
    var NbImgY = NBy; // Number of image in the y
    
    var tx = Math.floor(img.width / NbImgX); // Size of the X of 1 image
    var ty = Math.floor(img.height / NbImgY); // Size of the Y of 1 image
    
    var bx = 0; // Num of the image X
    var by = 0; // Num of the image Y
	
    var c = 1; // Count
    
    for (var i=0;i < NbImgY; i++){ // Y
        bx = 0;							// New line of image 
        for (var j=0;j < NbImgX; j++){  // X
            if (c == (which)){ // if i't's the number who i want
                var sx = bx; // save this num
                var sy = by // save this num
				
            }
            c++; // Increase the counter
            bx = bx + tx;  // Add size of start point x
        }
        by = by + ty; // Add size of start point y
    }
	
    /* // #OTHER TEST DROPED#
	var bx = Math.abs(Math.ceil(which / (imgX))-1); // Num of the image X
    var by = Math.abs(Math.ceil(which % (imgY))-1); // Num of the image Y
    var sx = bx * tx; // The coordonnate x where start the cuting
    var sy = by * ty; // The coordonnate y where start the cuting*/
	
    var swidth = tx; // The width of the cuting image
    var sheight = ty; // The height of the cuting image
    var largeur = w; // Width img total
    var hauteur = h; // Height img total
    
    // Document the creation
    //document.getElementById('pos').innerHTML ='<br />img.width = ' + img.width + '<br />img.height = ' + img.height + '<br />tx = ' + tx + '<br />ty = ' + ty + '<br />bx = ' + bx + '<br />by = ' + by + '<br />sx = ' + sx + '<br />sy = ' + sy ;
    
    ctx.drawImage(img,sx ,sy ,swidth ,sheight ,x ,y ,largeur ,hauteur);
    
    
}

/*******************************************************************
 
		Author      = Marti Leo;
		Function    = UnsetArray;
		Description = Delete a entry in a tab
		Parm		= obj
		Return      = 
 
*********************************************************************/
function UnsetArray(array, valueOrIndex){
    var c = -1; // ini the counter
    var output = new Array; // ini output var
    for(var i in array){  
        if (c == -1) {
            c = i;
        } // if its the first time ini the counter to i
        
        if (i != valueOrIndex){ // compare if it's the var to change' 
            output[c]=array[i]; //output going to be the table
            c++; // increase the counter
        }
        
        
    }
    return output;
// it's a copy of the first array but whit a shift'
}

/*******************************************************************
 
		Author      = Internet;
		Function    = isset;
		Description = test if exist the variable
		Parm		= obj
		Return      = 
 
*********************************************************************/
function isset(variable){
    if ( typeof( window[variable] ) != "undefined" ) {
        return true;
    }
    else {
        return false;
    }
}