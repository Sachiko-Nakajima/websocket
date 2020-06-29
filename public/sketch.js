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
let name;
let r,g,b;

function preload() {
  soundFormats('mp3', 'ogg', 'wav');
  phonesound = loadSound("audios/piano.wav");
  bearsound = loadSound("audios/guitar.wav");
  cupsound = loadSound("audios/drums.wav");
  kitty = loadImage("images/kitty.jpeg");
  phone = loadImage("images/phone.png");
  bear = loadImage("images/bear.jpeg");
  cup = loadImage("images/cup.png");
}

function setup() {

  createCanvas(800,800);
  camera_1 = createCapture(VIDEO);
  camera_1.size(200,200);

  camera_1.hide()
  camButton = document.getElementById("camera1");
  input = createInput();
  input.position(200, 80);

  button = createButton('submit');
  button.position(input.x + input.width, 80);
  button.mousePressed(nameinput);

  detector = ml5.objectDetector('cocossd', modelReady)  //activate the ml5 Object Detection machine learning model

  bearsound.loop();
  bearsound.setVolume(0);
  phonesound.loop();
  phonesound.setVolume(0);
  cupsound.loop();
  cupsound.setVolume(0);

  r = random(255);
  g = random(255);
  b = random(255);
  

 // objects[id] = new ObjectDetected(id, x, y, state, localstate, ontime, offtime);
 socket = io.connect('https://cocreativetest.herokuapp.com/');
 socket.on('detected', newDrawing);
}

function nameinput(){
  name = input.value();
  console.log(name);
}


function newDrawing(data){
  noStroke();
  fill(200,0,100);
  if(data.label == 'person'){
    image(kitty, 800-data.x*4, data.y*4, data.w, data.h);}
  if(data.label == 'cell phone'){
      image(phone, 800-data.x*4, data.y*4, data.w, data.h);
        phonesound.setVolume(1);
    }
  if(data.label == 'teddy bear'){
      image(bear, 800-data.x*4, data.y*4, data.w, data.h);
      bearsound.setVolume(1);}

  if(data.label == 'cup'){
      image(cup, 800-data.x*4, data.y*4, data.w, data.h);
        cupsound.setVolume(1);}
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
      noFill();
      strokeWeight(3);
      stroke(r, b, g);
      rect(800-detection.x*4, detection.y*4, detection.width, detection.height);

      //console.log('Sending:' + detection.x + ',' + detection.y+ ',' + detection.width+ ',' + detection.height);
      var data = {
      label: detection.label, 
       r: r,
       g: g,
       b: b,
       x: detection.x,
       y: detection.y,
       w: detection.width,
       h: detection.height
      }
      socket.emit('detected', data);       
      if (detection.label == 'person') {
        personstate = 1;
        personlocalstate += 1;
        image(kitty, 800-detection.x*4, detection.y*4, detection.width, detection.height); 
        persontime1++;
        persontime2 = 0;
      }
      if (detection.label === 'cell phone') {
        phonesound.setVolume(1);
        console.log("phonesound is" + phonesound.isPlaying);
        phonestate = 1;
        phonelocalstate = 1;
        image(phone, 800-detection.x*4, detection.y*4, detection.width, detection.height);    
            phonetime1++;
            phonetime2 = 0;
      }     
      if (detection.label === 'teddy bear') {
        bearsound.setVolume(1);
        console.log("bearsound is" + bearsound.isPlaying);
        bearstate = 1;
        bearlocalstate = 1;
        image(bear, 800-detection.x*4, detection.y*4, detection.width, detection.height);    
            beartime1++;
            beartime2 = 0;
      }     
      if (detection.label === 'cup') {
        cupsound.setVolume(1);
        console.log("cupsound is" + cupsound.isPlaying);
        cupstate = 1;
        cuplocalstate = 1;
        image(cup, 800-detection.x*4, detection.y*4, detection.width, detection.height);    
            cuptime1++;
            cuptime2 = 0;
      }   
    })
  }
}

      if(phonelocalstate == 0){
        if(phonetime2 <150){
          phonetime2++;}
        if(phonetime2 > 15 && phonetime2<100){
          phonestate = 0;
          phonesound.setVolume(0);
        }
          phonetime1=0;
      }  
    if(bearlocalstate == 0){
      if(beartime2 <150){
        beartime2++;}
      if(beartime2 > 5 && beartime2 < 100){
          bearstate = 0;
          bearsound.setVolume(0);
        }
          beartime1=0;
      }
    
   if(cuplocalstate == 0){
    if(cuptime2 <150){
      cuptime2++;}
     if(cuptime2 > 15 && cuptime2<100){
         cupstate = 0;
         cupsound.setVolume(0);
       }
         cuptime1=0;
     }
     if(phonetime2<150){
     console.log("phonetime2 is:" + phonetime2);
     }
     if(beartime2<150){
      console.log("beartime2 is:" + beartime2);
     }
     if(cuptime2<150){
      console.log("cuptime2 is:" + cuptime2);
     }

  personlocalstate = 0;
  phonelocalstate = 0;
  bearlocalstate = 0;
  cuplocalstate = 0;
}