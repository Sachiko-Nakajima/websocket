let detector;
let detections;
let kitty;
let phonesound, phone;
let bearsound, bear;
let cupsound, cup;
let bottlesound, bottle;
let orangesound, orange;
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
let orangelocalstate = 0;
let orangestate = 0;
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
let orangetime1 = 0;
let orangetime2 = 0;
let time = 0;
let socket;
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
let orangereceivenum=0;
let prephonereceivenum=0;
let prebearreceivenum=0;
let precupreceivenum=0;
let prebottlereceivenum=0;
let preorangereceivenum=0;
let buttonState = false;
let button;


let isRecording = false;
let isPlaying = false;
let recorder, soundFile;
let recordButton;
let playButton;
let timer = 4; //timer starts at 4 second
let playButtonState = false;
let starttime;
let nowtime;
let soundFileState = false;

function preload() {
  soundFormats('mp3', 'ogg', 'wav');
  phonesound = loadSound("audios/piano.wav");
  bearsound = loadSound("audios/guitar.wav");
  cupsound = loadSound("audios/drums.wav");
  bottlesound = loadSound("audios/recorder.wav");
  orangesound = loadSound("audios/meow.wav");
  kitty = loadImage("images/kitty.jpeg");
  phone = loadImage("images/phone.png");
  bear = loadImage("images/bear.jpeg");
  cup = loadImage("images/cup.png");
  bottle = loadImage("images/bottle.jpeg");
  orange = loadImage('images/orange.png');
}

function setup() {

  createCanvas(800,800);
  camera_1 = createCapture(VIDEO);
  camera_1.size(200,200);

  camera_1.hide()
  camButton = document.getElementById("camera1");
  colorr = random(255);
  colorg = random(255);
  colorb = random(255);

  input = createInput();
  input.position(200, 100);
  input.size(50, 15);
  // buttonnn = createButton('start');
  // buttonnn.position(200,80);
  //(input.x + input.width, 80);

  detector = ml5.objectDetector('cocossd', modelReady)  //activate the ml5 Object Detection machine learning model

  

 // objects[id] = new ObjectDetected(id, x, y, state, localstate, ontime, offtime);
 socket = io.connect('https://cocreativetest.herokuapp.com/');

 button = document.getElementById('start');
 button.onclick = changeName;

 mic = new p5.AudioIn();  // create an audio in
 mic.start(); //start computer mic

 
 recorder = new p5.SoundRecorder();
 recorder.setInput(mic);   
 soundFile = new p5.SoundFile();  
 recordButton = createButton('Start Recording');
}

function changeName(){
  buttonState = !buttonState;
    if(buttonState){
  button.innerHTML = "STOP MUSIC!";
  if(soundFileState){orangesound = soudFile;}
  bearsound.loop();
  bearsound.setVolume(0);
  phonesound.loop();
  phonesound.setVolume(0);
  cupsound.loop();
  cupsound.setVolume(0);
  bottlesound.loop();
  bottlesound.setVolume(0);
  orangesound.loop();
  orangesound.setVolume(0);
}
  else{
    button.innerHTML ="RESTART MUSIC!"
    bearsound.stop();
    phonesound.stop();
    cupsound.stop();
    bottlesound.stop();
    orangesound.stop();
  }  
}


function newDrawing(data){
  if(data.label == 'person'){
    image(kitty, 800-data.x*20, data.y*3+200, data.w, data.h);}
  if(data.label == 'cell phone'){
      image(phone, 800-data.x*4, data.y*3+200, data.w, data.h);
        phonesound.setVolume(1);
        phonereceivenum++;
    }
  if(data.label == 'teddy bear'){
      image(bear, 800-data.x*4, data.y*3+200, data.w, data.h);
      bearsound.setVolume(1);
      bearreceivenum++;
    }

  if(data.label == 'cup'){
      image(cup, 800-data.x*4, data.y*3+200, data.w, data.h);
        cupsound.setVolume(1);
        cupreceivenum++;
      }

  if(data.label == 'bottle'){
        image(bottle, 800-data.x*4, data.y*3+200, data.w, data.h);
          bottlesound.setVolume(1);
          bottlereceivenum++;
        }

        if(data.label == 'orange'){
          image(orange), 800-data.x*4, data.y*3+200, data.w, data.h);
            orangesound.setVolume(1);
            orangereceivenum++;
          }
  

  noFill();
  strokeWeight(3);
  stroke(data.r, data.g, data.b,220);
  if(data.label=='person'){
    rect(800-data.x*20, data.y*3+200, data.w, data.h);}
  else{
    rect(800-data.x*4, data.y*3+200, data.w, data.h);}
    fill(data.r, data.g, data.b);
    strokeWeight(1);
  textSize(18);
  if(data.label=='person'){
    text(data.name, 800-data.x*20 + data.w/2, data.y*3+200+data.h/2);
    text(data.label, 800-data.x*20 + 10, data.y*3+200-10);}
  else{
      text(data.name, 800-data.x*4 + data.w/2, data.y*3+200+data.h/2);
      text(data.label, 800-data.x*4 + 10, data.y*3+200-10);}
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
  if(time%3==0){
  background(240,210,210,200);
  }


noStroke();
  fill(255)
  rect(0,0,800,160);

  fill(colorr, colorg, colorb);
  stroke(colorr, colorg, colorb);
  textSize(12);
  text("Your Name",20,20);

  socket.on('detected', newDrawing);
 
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


  recordButton.mousePressed(record);

  if(playButtonState){
    playButton.mousePressed(playIt);  
  }

  if (isRecording||isPlaying) {
    countDown(); 
//    nowtime = Date.time();
//      if (int(int(frameCount / 35) / 2) != int(frameCount / 35) / 2)
if(nowtime - starttime < 4000){
  if(isRecording){
    text('🔴REC', 70, 30);}
if(isPlaying){
    text('PLAYING', 70, 30);}
}
  }

  
  time++;
  
  if(time%2==0){
  if (camState){
    if (detections) {
    detections.forEach(detection => {
      // fill(0);
      // stroke(0);
      // strokeWeight(1);
      // textSize(18);
      // if(detection.label=='person'){
      //   text(detection.label, 800-detection.x*20+10, detection.y*3+200-10);}
      // else{
      //   text(detection.label, 800-detection.x*4 + 10, detection.y*3+200-10);
      //   }

      // noFill();
      // strokeWeight(2);
      // stroke(colorr, colorg, colorb,200);
      // if(detection.label=='person'){
      //   rect(800-detection.x*20, detection.y*3+200, detection.width, detection.height);}
      // else{
      // rect(800-detection.x*4, detection.y*3+200, detection.width, detection.height);}

      //console.log('Sending:' + detection.x + ',' + detection.y+ ',' + detection.width+ ',' + detection.height);
      var data = {
      label: detection.label, 
      name: input.value(),
       r: colorr,
       g: colorg,
       b: colorb,
       x: detection.x,
       y: detection.y,
       w: detection.width,
       h: detection.height
      }
      socket.emit('detected', data);     
//       if (detection.label == 'person') {
//         personstate = 1;
//         personlocalstate += 1;
//         persontime1++;
//         persontime2 = 0;
//         image(kitty, 800-detection.x*20, detection.y*3+200, detection.width, detection.height); 
//       }
//       if (detection.label === 'cell phone') {
//         phonesound.setVolume(1);
// //        console.log("phonesound is" + phonesound.isPlaying);
//         phonestate = 1;
//         phonelocalstate = 1;
//         image(phone, 800-detection.x*4, detection.y*3+200, detection.width, detection.height);    
//             phonetime1++;
//             phonetime2 = 0;
//       }     
//       if (detection.label === 'teddy bear') {
//         bearsound.setVolume(1);
// //        console.log("bearsound is" + bearsound.isPlaying);
//         bearstate = 1;
//         bearlocalstate = 1;
//         image(bear, 800-detection.x*4, detection.y*3+200, detection.width, detection.height);    
//             beartime1++;
//             beartime2 = 0;
//       }     
//       if (detection.label === 'cup') {
//         cupsound.setVolume(1);
// //        console.log("cupsound is" + cupsound.isPlaying);
//         cupstate = 1;
//         cuplocalstate = 1;
//         image(cup, 800-detection.x*4, detection.y*3+200, detection.width, detection.height);    
//             cuptime1++;
//             cuptime2 = 0;
//       }   
//       if (detection.label === 'bottle') {
//         bottlesound.setVolume(1);
// //        console.log("bottlesound is" + bottlesound.isPlaying);
//         bottlestate = 1;
//         bottlelocalstate = 1;
//         image(bottle, 800-detection.x*4, detection.y*3+200, detection.width, detection.height);    
//           bottletime1++;
//           bottletime2 = 0;
//       }   
    })
  }
}

// if(personlocalstate == 0){
//   if(persontime2 <150){
//     persontime2++;}
//   if(persontime2 > 15 && persontime2<100){
//     personstate = 0;
//   }
//     persontime1=0;
// }  
// if(phonelocalstate == 0){
//         if(phonetime2 <150){
//           phonetime2++;}
//         if(phonetime2 > 15 && phonetime2<100){
//           phonestate = 0;
//           phonesound.setVolume(0);
//         }
//           phonetime1=0;
//       }  
//     if(bearlocalstate == 0){
//       if(beartime2 <150){
//         beartime2++;}
//       if(beartime2 > 15 && beartime2 < 100){
//           bearstate = 0;
//           bearsound.setVolume(0);
//         }
//           beartime1=0;
//       }
    
//    if(cuplocalstate == 0){
//     if(cuptime2 <150){
//       cuptime2++;}
//      if(cuptime2 > 15 && cuptime2<100){
//          cupstate = 0;
//          cupsound.setVolume(0);
//        }
//          cuptime1=0;
//      }

//      if(bottlelocalstate == 0){
//       if(bottletime2 <150){
//         bottletime2++;}
//        if(bottletime2 > 15 && bottletime2<100){
//         bottlestate = 0;
//         bottlesound.setVolume(0);
//          }
//          bottletime1=0;
//        }
  

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


//if(time%3==0){
  if(phonereceivenum==prephonereceivenum){
    phonesound.setVolume(0);
  }
  if(bearreceivenum==prebearreceivenum){
    bearsound.setVolume(0);
  }
  if(cupreceivenum==precupreceivenum){
    cupsound.setVolume(0);
  }
  if(bottlereceivenum==prebottlereceivenum){
    //&&bottletime2>5
    bottlesound.setVolume(0);
  }
  prephonereceivenum = phonereceivenum;
  prebearreceivenum = bearreceivenum;
  precupreceivenum = cupreceivenum;
  prebottlereceivenum = bottlereceivenum;
//}
personlocalstate = 0;
phonelocalstate = 0;
bearlocalstate = 0;
cuplocalstate = 0;
bottlelocalstate = 0;
  }
}



function record() {

  //if it is currentlty recording
  if (!isRecording) {
    //start recording for 4 sec and then trigger pressToPlayBack function
    timer = 4;
    starttime = Date.now();
    recorder.record(soundFile, 4, pressToPlayBack); 
    isRecording = true; //set recording state to true
    recordButton.html("Now Recording");
  }
    //erase the Play Recording button:
  if(playButtonState){
    playButton.remove();
    playButtonState = false;
  }

}


//function pressToPlay


//This sketch allows user to click on "Play recording" every time to play the recording whenever they want. Auto-looping is not enabled in this option.  But it can be,  but the interaction would be different.  
function pressToPlayBack() {
    //the "Play recording" button will appear:
  if(!playButtonState){
    playButton = createButton('Play Recording');}
    playButtonState = true;
    soundFileState = true;
    //Click "Play Recording" button, function playIt() will be called
    playButton.mousePressed(playIt);
    //set "isRecording" to false to stop recording and stop blinking red dot
    isRecording = false; 
    //reset timer to 4 second again
    timer = 4;
    starttime = Date.now();
    }



//function playIt() is called when the Play Rrcording button is clicked
function playIt() {
  //if the recording is currently playing then stop everything
  timer = 4;
  starttime = Date.now();

  if (soundFile.isPlaying()) {
    soundFile.stop();
    playButton.html("Play Recording");
    isPlaying = false; 
  //if the recording is not playing: 
  } else {
    //then start playing it
    soundFile.play();
    playButton.html("Stop Playing");
    isPlaying = true; 
  }
}



//function countDown to count from 4 --> 0 second 
function countDown() {
  // if the frameCount is divisible by 60, then a second has passed. 
  // timer will stop at 0 (counting down from 4, set by variable timer = 4
  // if (frameCount % 60 == 0 && timer > 0) { 
  //   timer --;
  // }
//  if(timer==0)
nowtime = Date.now();
if(nowtime - starttime == 4000 || nowtime - starttime > 4000 )
  {
    if(playButtonState){
      playButton.html("Play Recording");
      isPlaying=false;
      console.log("playing stopped");
    }
    if(isRecording){
      recordButton.html("Start Recording");
      isRecording=false;
      console.log("recording stopped");
    }
  }
}












