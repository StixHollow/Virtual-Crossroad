/*****************************************
* Declaration Config Varibale          *
****************************************/  
            
var PlayCar = true;
			
var WaitingTime = 30; // Time between the change the light (in seconde)
var PreWaitingTime = Math.ceil(WaitingTime)/15; // Time for yellow light
//var WaitingBTWCar = 2; // Waiting time between the car
            
var Ratio = 60; // car by minute MAX
            
var SecurityLineDistance = 10; // Pixel befor the crosslight line
            
var MaxSpeed = 45; // Maximal speed for the car
			
var MAXNUMCARS = 3; // NUM of differant sprite of car created
            
/*****************************************
* Declaration Variable Gorbal           *
****************************************/            
var canvas =  document.getElementById('CF');
var ctx = canvas.getContext('2d');
            
var CanvasT =  document.getElementById('Timer');
var ctxt = CanvasT.getContext('2d');
			
/****************************************
*	Define where the light is green *	
*		0 : Off                 *
*		1 : The first one a left*
*		2 : In the front        *
*		3 : In the right        *
*		4 : Walker              *
*		5 : All Red             *
*		6 : SUPRISE             *
*                                       *				
*****************************************/            
var Stat = 1; //stat about light
			 
var date = new Date;
var Times = 0; 	// Count for tiem between lights's change
var LastTime = date.getSeconds();  // Last time when h'es taking the time 
            
var MiddleLight = false; // for the yellow light
//var WaitFinishCross = false // Wait between to differant light
            
var NumCars = 0;         // Number of car in the map
var TotalCars = 0;      // Total car 
			
var CES = Math.ceil(60/Ratio); // Car Every #Variable# Second  
var TBCES = 0; // Counting the time between the car
			
var PietonLightOn = false; // boolean for pieton light
            
var SelectedCar = 0; // Car selected for information
            
var Pause = true; // Page in pause

            
var ico = document.getElementById('icon'); // For change ico
			
/*****************************************
* Inisialisation Variable Gorbal        *
****************************************/    
canvas.width = 800;
canvas.height = 800;
            
var TOTAL_HEIGHT = canvas.height;
var TOTAL_WIDTH = canvas.width;
                
/****************************************
* Declaration Variable Tableau         *
*                                      *
****************************************/
// Table of the coordonate of enter in the map   
var TabPoint = new Array(); 
TabPoint[1] = new Array();
TabPoint[1][1] = new Array();
TabPoint[1][1]['x'] = 0;
TabPoint[1][1]['y'] = 465;
TabPoint[1][1]['Direction'] = 'RI';
TabPoint[1][1]['NbCars'] = 0;
TabPoint[1][2] = new Array();
TabPoint[1][2]['x'] = 0;
TabPoint[1][2]['y'] = 415;
TabPoint[1][2]['Direction'] = 'ST';
TabPoint[1][2]['NbCars'] = 0;
TabPoint[1]['Line'] = 190;
TabPoint[2] = new Array();
TabPoint[2][1] = new Array();
TabPoint[2][1]['x'] = 305;
TabPoint[2][1]['y'] = 0;
TabPoint[2][1]['Direction'] = 'RI';
TabPoint[2][1]['NbCars'] = 0;
TabPoint[2][2] = new Array();
TabPoint[2][2]['x'] = 378;
TabPoint[2][2]['y'] = 0;
TabPoint[2][2]['Direction'] = 'ST';
TabPoint[2][2]['NbCars'] = 0;
TabPoint[2][3] = new Array();
TabPoint[2][3]['x'] = 445;
TabPoint[2][3]['y'] = 0;
TabPoint[2][3]['Direction'] = 'LE';
TabPoint[2][3]['NbCars'] = 0;
TabPoint[2]['Line'] = 132;
TabPoint[3] = new Array();
TabPoint[3][1] = new Array();
TabPoint[3][1]['x'] = 800;
TabPoint[3][1]['y'] = 310;
TabPoint[3][1]['Direction'] = 'ST';
TabPoint[3][1]['NbCars'] = 0;
TabPoint[3][2] = new Array();
TabPoint[3][2]['x'] = 800;
TabPoint[3][2]['y'] = 370;
TabPoint[3][2]['Direction'] = 'LE';
TabPoint[3][2]['NbCars'] = 0;
TabPoint[3]['Line'] = 605;

// Table of the images          
var ImgTab = new Array(); 
ImgTab['Map'] = new Array();
ImgTab['SignSens'] = new Array();
ImgTab['Light'] = new Array();
ImgTab['Pieton'] = new Array();
ImgTab['Cars'] = new Array();
ImgTab['People'] = new Array();

// Table of the object persent in the map
var TabObjectInfo = new Array(); 
TabObjectInfo['Light'] = new Array();
TabObjectInfo['Light'][1] = new Array();
TabObjectInfo['Light'][2] = new Array();
TabObjectInfo['Light'][3] = new Array();
                               				
TabObjectInfo['Pieton'] = new Array();
for(var i = 1; i <= 4; i++) {
    TabObjectInfo['Pieton'][i] = new Array();
}
					
TabObjectInfo['SensInterdit'] = new Array();
TabObjectInfo['Cars'] = new Array();
				
TabObjectInfo['Light'][1]['x'] = 175;
TabObjectInfo['Light'][1]['y'] = 509;
TabObjectInfo['Light'][1]['Etat'] = 'Red';
TabObjectInfo['Light'][2]['x'] = 270;
TabObjectInfo['Light'][2]['y'] = 150;
TabObjectInfo['Light'][2]['Etat'] = 'Red';
TabObjectInfo['Light'][3]['x'] = 600;
TabObjectInfo['Light'][3]['y'] = 256;
TabObjectInfo['Light'][3]['Etat'] = 'Red';
					
TabObjectInfo['Pieton'][1]['x'] = 250;
TabObjectInfo['Pieton'][1]['y'] = 519;
TabObjectInfo['Pieton'][1]['Etat'] = 'Red';
TabObjectInfo['Pieton'][2]['x'] = 250;
TabObjectInfo['Pieton'][2]['y'] = 260;
TabObjectInfo['Pieton'][2]['Etat'] = 'Red';
TabObjectInfo['Pieton'][3]['x'] = 510;
TabObjectInfo['Pieton'][3]['y'] = 260;
TabObjectInfo['Pieton'][3]['Etat'] = 'Red';
TabObjectInfo['Pieton'][4]['x'] = 510;
TabObjectInfo['Pieton'][4]['y'] = 519;
TabObjectInfo['Pieton'][4]['Etat'] = 'Red';
					
TabObjectInfo['SensInterdit']['x'] = 505;
TabObjectInfo['SensInterdit']['y'] = 135;
				

                
window.onload = function(){
    LoadImage(); // Load All Images
    DrawScreen(); // Draw all element in the screen
              
    // make the movement          
    setInterval(function() {
        if (!Pause) {
            Movement();
        }
    },10);
}

    //if People leave the page
window.onblur = function(){
    Pause = true;
    PauseScreen();
}  
   // If the page have the focus    
window.onfocus = function(){
    Pause = false;
}