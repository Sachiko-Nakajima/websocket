let detector;
let detections;
let kitty;
let phonesound, phone;
let bearsound, bear;
let cupsound, cup;
let bottlesound, bottle;
let personlocalstate = 0;
let personstate = 0;
let phonelocalstate = 0;
let phonestate = 0;
let bearlocalstate = 0;
let bearstate = 0;
let cuplocalstate = 0;
let cupstate = 0;
let bottlelocalstate = 0;
let bottlestate = 0;
let persontime1 = 0;
let persontime2 = 0;
let phonetime1 = 0;
let phonetime2 = 0;
let beartime1 = 0;
let beartime2 = 0;
let cuptime1 = 0;
let cuptime2 = 0;
let bottletime1 = 0;
let bottletime2 = 0;
let time = 0;
let objects = [];
let socket;
let button; 
let buttonstate = false;
let font1_shadow;
let camera_1;
let camButton;
let camState = false;
let cam_y =-220;
let name;
let colorr,colorg,colorb;
let phonereceivenum=0;
let bearreceivenum=0;
let cupreceivenum=0;
let bottlereceivenum=0;
let prephonereceivenum=0;
let prebearreceivenum=0;
let precupreceivenum=0;
let prebottlereceivenum=0;

function preload() {
  soundFormats('mp3', 'ogg', 'wav');
  phonesound = loadSound("audios/piano.wav");
  bearsound = loadSound("audios/guitar.wav");
  cupsound = loadSound("audios/drums.wav");
  bottlesound = loadSound("audios/recorder.wav");
  kitty = loadImage("images/kitty.jpeg");
  phone = loadImage("images/phone.png");
  bear = loadImage("images/bear.jpeg");
  cup = loadImage("images/cup.png");
  bottle = loadImage("images/bottle.jpeg");
}

function setup() {

  createCanvas(800,800);
  camera_1 = createCapture(VIDEO);
  camera_1.size(200,200);

  camera_1.hide()
  camButton = document.getElementById("camera1");
  // input = createInput();
  // input.position(200, 80);

  button = createButton('start');
  button.position(200,80);
  //(input.x + input.width, 80);
  button.mousePressed(appstart);

  detector = ml5.objectDetector('cocossd', modelReady)  //activate the ml5 Object Detection machine learning model

  colorr = random(255);
  colorg = random(255);
  colorb = random(255);
  

 // objects[id] = new ObjectDetected(id, x, y, state, localstate, ontime, offtime);
 socket = io.connect('https://cocreativetest.herokuapp.com/');
}

function loaded(){
}

function appstart(){
  if(!buttonstate){
  button.value('stop');
  bearsound.loop();
  bearsound.setVolume(0);
  phonesound.loop();
  phonesound.setVolume(0);
  cupsound.loop();
  cupsound.setVolume(0);
  bottlesound.loop();
  bottlesound.setVolume(0);}
  if(buttonstate){
    button.value('start');
    bearsound.stop();
    phonesound.stop();
    cupsound.stop();
    bottlesound.stop();}
    buttonstate = !buttonstate;
}


function newDrawing(data){
  noStroke();
  fill(200,0,0);
  ellipse(400,400,20,20);
  console.log(data.label + 'is detected! x is:' + data.x);
  if(data.label == 'person'){
    fill(0,200,0);
    ellipse(400,500,20,20);
    image(kitty, 800-data.x*20, data.y*4, data.w, data.h);}
  if(data.label == 'cell phone'){
      image(phone, 800-data.x*4, data.y*4, data.w, data.h);
        phonesound.setVolume(1);
        phonereceivenum++;
    }
  if(data.label == 'teddy bear'){
      image(bear, 800-data.x*4, data.y*4, data.w, data.h);
      bearsound.setVolume(1);
      bearreceivenum++;
    }

  if(data.label == 'cup'){
      image(cup, 800-data.x*4, data.y*4, data.w, data.h);
        cupsound.setVolume(1);
        cupreceivenum++;
      }

  if(data.label == 'bottle'){
        image(bottle, 800-data.x*4, data.y*4, data.w, data.h);
          bottlesound.setVolume(1);
          bottlereceivenum++;
        }
  noFill();
  strokeWeight(3);
  stroke(data.r, data.g, data.b);
  rect(800-data.x*4, data.y*4, data.w, data.h);  
  fill(0);
  stroke(0);
  strokeWeight(1);
  textSize(18);
  text(data.label, 800-data.x*4 + 10, data.y*4-10);
}

function newDrawing2(data){
  noStroke();
  fill(0,0,255);
  ellipse(data.xx,data.yy,20,20);
  console.log("receiving!!!!!!!!!!!!!");
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
//socket.on('detected', newDrawing);
noStroke();
  fill(255)
  rect(0,0,800,160);

  socket.on('detected', newDrawing);
  socket.on('test', newDrawing2);
  noStroke();
  fill(0,0,255);
  ellipse(400,400,20,20);

 
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
      stroke(colorr, colorb, colorg);
      rect(800-detection.x*4, detection.y*4, detection.width, detection.height);

      //console.log('Sending:' + detection.x + ',' + detection.y+ ',' + detection.width+ ',' + detection.height);
      var data = {
      label: detection.label, 
       r: colorr,
       g: colorg,
       b: colorb,
       x: detection.x,
       y: detection.y,
       w: detection.width,
       h: detection.height
      }
      socket.emit('detected', data);     
      var data2 = {
         xx: 300,
         yy: 300
        }
        socket.emit('test', data2);    
      if (detection.label == 'person') {
        personstate = 1;
        personlocalstate += 1;
        persontime1++;
        persontime2 = 0;
        image(kitty, 800-detection.x*20, detection.y*4, detection.width, detection.height); 
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
      if (detection.label === 'bottle') {
        bottlesound.setVolume(1);
        console.log("bottlesound is" + bottlesound.isPlaying);
        bottlestate = 1;
        bottlelocalstate = 1;
        image(bottle, 800-detection.x*4, detection.y*4, detection.width, detection.height);    
          bottletime1++;
          bottletime2 = 0;
      }   
    })
  }
}

if(personlocalstate == 0){
  if(persontime2 <150){
    persontime2++;}
  if(persontime2 > 15 && persontime2<100){
    personstate = 0;
  }
    persontime1=0;
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
      if(beartime2 > 15 && beartime2 < 100){
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

     if(bottlelocalstate == 0){
      if(bottletime2 <150){
        bottletime2++;}
       if(bottletime2 > 15 && bottletime2<100){
        bottlestate = 0;
        bottlesound.setVolume(0);
         }
         bottletime1=0;
       }
  

    //  if(phonetime2<150){
    //  console.log("phonetime2 is:" + phonetime2);
    //  }
    //  if(beartime2<150){
    //   console.log("beartime2 is:" + beartime2);
    //  }
    //  if(cuptime2<150){
    //   console.log("cuptime2 is:" + cuptime2);
    //  }
    //  if(bottletime2<150){
    //   console.log("bottletime2 is:" + cuptime2);
    //  }


if(time%5==0){
  if(phonereceivenum==prephonereceivenum&&phonetime2>5){
    phonesound.setVolume(0);
  }
  if(bearreceivenum==prebearreceivenum&&beartime2>5){
    bearsound.setVolume(0);
  }
  if(cupreceivenum==precupreceivenum&&cuptime2>5){
    cupsound.setVolume(0);
  }
  if(bottlereceivenum==prebottlereceivenum&&bottletime2>5){
    bottlesound.setVolume(0);
  }
  prephonereceivenum = phonereceivenum;
  prebearreceivenum = bearreceivenum;
  precupreceivenum = cupreceivenum;
  prebottlereceivenum = bottlereceivenum;
}
personlocalstate = 0;
phonelocalstate = 0;
bearlocalstate = 0;
cuplocalstate = 0;
bottlelocalstate = 0;
}