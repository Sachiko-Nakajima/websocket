let detector;
let detections;
let kitty;
let phonesound, phone;
let bearsound, bear;
let cupsound, cup;
let personlocalstate = 0;
let personstate = 0;
let phonelocalstate = 0;
let phonestate = 0;
let bearlocalstate = 0;
let bearstate = 0;
let cuplocalstate = 0;
let cupstate = 0;
let persontime1 = 0;
let persontime2 = 0;
let phonetime1 = 0;
let phonetime2 = 0;
let beartime1 = 0;
let beartime2 = 0;
let cuptime1 = 0;
let cuptime2 = 0;
let time = 0;
let objects = [];
let socket;
let button; 
let font1_shadow;
let camera_1;
let camButton;
let camState = false;
let cam_y =-220;
let testsound;

function preload() {
  //load meow sound:
  //personsound = loadSound("audios/bass.wav");
  soundFormats('mp3', 'ogg', 'wav');
  phonesound = loadSound("audios/piano.wav");
  bearsound = loadSound("audios/guitar.wav");
  cupsound = loadSound("audios/drums.wav");
  testsound = loadSound("audios/sax.wav");
}

function setup() {

  createCanvas(800,800);
  camera_1 = createCapture(VIDEO);
  camera_1.size(200,100);

  camera_1.hide()
  camButton = document.getElementById("camera1");

  detector = ml5.objectDetector('yolo', modelReady)  //activate the ml5 Object Detection machine learning model
  
  kitty = loadImage("images/kitty.jpeg");
  phone = loadImage("images/phone.png");
  bear = loadImage("images/bear.jpeg");
  cup = loadImage("images/cup.png");
  bearsound.loop();
  bearsound.setVolume(1);

 // objects[id] = new ObjectDetected(id, x, y, state, localstate, ontime, offtime);
 socket = io.connect('https://cocreativetest.herokuapp.com/');
 socket.on('detected', newDrawing);

}


function newDrawing(data){
  noStroke();
  fill(200,0,100);
  if(data.label == 'person'){
    image(kitty, 800-data.x*4, data.y*4, data.w/4, data.h/4);}
  if(data.label == 'cell phone'){
      image(phone, 800-data.x*4, data.y*4, data.w/4, data.h/4);
      if(!phonesound.isPlaying){
        phonesound.play();}
    }
  if(data.label == 'teddy bear'){
      image(bear, 800-data.x*4, data.y*4, data.w/4, data.h/4);
      bearsound.setVolume(1);}

  if(data.label == 'cup'){
      image(cup, 800-data.x*4, data.y*4, data.w/4, data.h/4);
      if(!cupsound.isPlaying){
        cupsound.play();}}
}

function modelReady() {
  console.log('model loaded')  
  detect(); //function modelReady to load the modeal and initiate the detect objects by calling the "detect" funtion
}

function detect() {
  detector.detect(camera_1, gotResults); 
}

function gotResults(err, results) {
  if (err) {
    console.log(err);
    return
  }

  detections = results;

  detect();    

}
  
  
function showCam(){
camState=!camState;
}


function draw() {
//  if(time%10==0){
  background(240,210,210);
//  }
  noStroke();
  fill(255)
  rect(0,0,800,160);
  push();
  translate(800, 0);
  //then scale it by -1 in the x-axis
  //to flip the image
  scale(-1, 1);

  cam = image(camera_1,width/2-100,cam_y);
  camButton.onclick = showCam; 
  
  if (camState){
    cam_y = 5;}
  else{
      cam_y = -220;
   }
  pop();
  
  time++;
  
  if (camState){
    if (detections) {
    detections.forEach(detection => {
      fill(0);
      stroke(0);
      strokeWeight(1);
      textSize(18);
      text(detection.label, 800-detection.x*4 + 10, detection.y*4-10);
      //console.log('Sending:' + detection.x + ',' + detection.y+ ',' + detection.width+ ',' + detection.height);
      var data = {
      label: detection.label, 
       x: detection.x,
       y: detection.y,
       w: detection.width,
       h: detection.height
      }
      socket.emit('detected', data);       
      noFill();
      strokeWeight(3);
      stroke(0, 255, 0);
      if (detection.label == 'person') {
        personstate = 1;
        personlocalstate += 1;
        image(kitty, 800-detection.x*4, detection.y*4, detection.width/4, detection.height/4); 
        persontime1++;
        persontime2 = 0;
      }
      if (detection.label === 'cell phone') {
        if(phonestate==0 && phonelocalstate==0){
          phonesound.loop();
        }
        phonestate = 1;
        phonelocalstate = 1;
        image(phone, 800-detection.x*4, detection.y*4, detection.width/2, detection.height/2);    
            phonetime1++;
            phonetime2 = 0;
      }     
      if (detection.label === 'teddy bear') {
        bearsound.setVolume(0);
        console.log("bearsound volume is now high");
        bearstate = 1;
        bearlocalstate = 1;
        image(bear, 800-detection.x*4, detection.y*4, detection.width/2, detection.height/2);    
            beartime1++;
            beartime2 = 0;
      }     
      if (detection.label === 'cup') {
        if(cupstate==0 && cuplocalstate==0){
          cupsound.loop();
      }
        cupstate = 1;
        cuplocalstate = 1;
        image(cup, 800-detection.x*4, detection.y*4, detection.width/2, detection.height/2);    
            cuptime1++;
            cuptime2 = 0;
      }   

      if(phonelocalstate == 0){
          phonetime2++;
        if(phonetime2 > 5){
          phonestate = 0;
          phonesound.stop();
        }
          phonetime1=0;
      }  
    if(bearlocalstate == 0){
         beartime2++;
      if(beartime2 > 5 && beartime2 < 100){
          bearstate = 0;
          bearsound.setVolume(1);
        }
          beartime1=0;
      }
    
   if(cuplocalstate == 0){
        cuptime2++;
     if(cuptime2 > 3){
         cupstate = 0;
         cupsound.stop();
       }
         cuptime1=0;
     }  
    })
  }


  personlocalstate = 0;
  phonelocalstate = 0;
  bearlocalstate = 0;
  cuplocalstate = 0;
}
}

