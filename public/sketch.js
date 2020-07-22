let detector;
let detections;
let kitty;
let phonesound, phone;
let bearsound, bear;
let cupsound, cup;
let bottlesound, bottle;
let booksound, book;
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
let bookreceivenum=0;
let prephonereceivenum=0;
let prebearreceivenum=0;
let precupreceivenum=0;
let prebottlereceivenum=0;
let prebookreceivenum=0;
let preprephonereceivenum=0;
let preprebearreceivenum=0;
let preprecupreceivenum=0;
let preprebottlereceivenum=0;
let preprebookreceivenum=0;
let prepreprebookreceivenum=0;
let buttonState = false;
let button;
let bearx,beary,phonex, phoney, cupx, cupy, bookx, booky, bottlex, bottley;


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
  booksound = loadSound("audios/meow.wav");
  kitty = loadImage("images/kitty.jpeg");
  phone = loadImage("images/phone.png");
  bear = loadImage("images/bear.jpeg");
  cup = loadImage("images/cup.png");
  bottle = loadImage("images/bottle.jpeg");
  book = loadImage('images/book.jpeg');
}

function setup() {

  createCanvas(800,800);
  camera_1 = createCapture(VIDEO);
  camera_1.size(200,200);

  camera_1.hide()
  camButton = document.getElementById("camera1");
  colorr = 50+random(150);
  colorg = 50+random(150);
  colorb = 50+random(150);

  input = createInput();
  input.position(200, 100);
  input.size(50, 15);
  detector = ml5.objectDetector('cocossd', modelReady)  //activate the ml5 Object Detection machine learning model

 socket = io.connect('https://cocreativetest.herokuapp.com/');
 button = document.getElementById('start');
 button.onclick = changeName;

 mic = new p5.AudioIn(); 
 mic.start(); 
 
 recorder = new p5.SoundRecorder();
 recorder.setInput(mic);   
// soundFile = new p5.SoundFile();  
 recordButton = createButton('Book Sound Rec');
 recordButton.position(500,710);
 recordButton.size(150,30);

 bearx = random(600)+100;
 beary = random(400)+200;
 phonex = random(600)+100;
 phoney = random(400)+200;
 cupx = random(600)+100;
 cupy = random(400)+200;
 bottlex = random(600)+100;
 bottley = random(400)+200;
 bookx = random(600)+100;
 booky = random(400)+200; 
}

function changeName(){
  buttonState = !buttonState;
    if(buttonState){
  button.innerHTML = "Stop Music!";
//  if(soundFileState){booksound = soundFile;}
  bearsound.loop();
  bearsound.setVolume(0);
  phonesound.loop();
  phonesound.setVolume(0);
  cupsound.loop();
  cupsound.setVolume(0);
  bottlesound.loop();
  bottlesound.setVolume(0);
  booksound.loop();
  booksound.setVolume(0);
  bearx = random(600)+100;
  beary = random(400)+200;
  phonex = random(600)+100;
  phoney = random(400)+200;
  cupx = random(600)+100;
  cupy = random(400)+200;
  bottlex = random(600)+100;
  bottley = random(400)+200;
  bookx = random(600)+100;
  booky = random(400)+200; 
}
  else{
    button.innerHTML ="Restart Music!"
    bearsound.stop();
    phonesound.stop();
    cupsound.stop();
    bottlesound.stop();
    booksound.stop();
  }  
}


function newDrawing(data){
  // if(data.label == 'person'){
  //   image(kitty, 800-data.x*20, data.y*3+200, data.w, data.h);}
  let xxx,yyy;
  if(data.label == 'cell phone'){
      image(phone, phonex, phoney, data.w, data.h);
        phonesound.setVolume(1);
        phonereceivenum++;
        xxx = phonex;
        yyy = phoney;      
      }
  if(data.label == 'teddy bear'){
//      image(bear, 800-data.x*4, data.y*3+200, data.w, data.h);
      image(bear, bearx, beary, data.w, data.h);
      bearsound.setVolume(1);
      bearreceivenum++;
      xxx = bearx;
      yyy = beary;      
  }

  if(data.label == 'cup'){
//      image(cup, 800-data.x*4, data.y*3+200, data.w, data.h);
        image(cup, cupx, cupy, data.w, data.h);
        cupsound.setVolume(1);
        cupreceivenum++;
        xxx = cupx;
        yyy = cupy;      
      }

  if(data.label == 'bottle'){
    image(bottle, bottlex, bottley, data.w, data.h);
    //image(bottle, 800-data.x*4, data.y*3+200, data.w, data.h);
          bottlesound.setVolume(1);
          bottlereceivenum++;
          xxx = bottlex;
          yyy = bottley;      
          }

        if(data.label == 'book'){
//          image(book, 800-data.x*4, data.y*3+200, data.w, data.h);
image(book, bookx, booky, data.w, data.h);
booksound.setVolume(1);
          bookreceivenum++;
          xxx = bookx;
          yyy = booky;      
            }
  
          noFill();
          strokeWeight(2);
          stroke(data.r, data.g, data.b,220);
          rect(xxx,yyy,data.w,data.h);
          fill(data.r, data.g, data.b);
          strokeWeight(0.8);
          textSize(18);
//   if(data.label=='person'){
//       rect(800-data.x*20, data.y*3+200, data.w, data.h);}
// else{
//rect(800-data.x*4, data.y*3+200, data.w, data.h);}
  // if(data.label=='person'){
  //   text(data.name, 800-data.x*20 + data.w/2, data.y*3+200+data.h/2);
  //   text(data.label, 800-data.x*20 + 10, data.y*3+200-10);}
  // else{
      text(data.name, xxx + data.w/2, yyy+data.h/2);
      text(data.label, xxx + 10, yyy-10);
    //}
// }
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
  background(240,210,210,100);
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
//    countDown(); 
    nowtime = Date.now();
      if(nowtime - starttime < 4000){
        if(isRecording){
          if(nowtime - starttime > 900 && nowtime - starttime < 1000){
        text('⚪️REC', 500, 660);}
    　else if(nowtime - starttime > 1900 && nowtime - starttime < 2000){
        text('⚪️REC', 500, 660);}
      else if(nowtime - starttime > 2900 && nowtime - starttime < 3000){
        text('⚪️REC', 500, 660);}
      else if(nowtime - starttime > 3900 && nowtime - starttime < 4000){
         text('⚪️REC', 500, 660);}
      else{
    text('🔴REC', 500, 660);}}
if(isPlaying){
    text('Cheking', 500, 680);}
}
if(nowtime - starttime == 4000 || nowtime - starttime > 4000 )
  {
    if(playButtonState){
      playButton.html("Play Book Sound");
      isPlaying=false;
      console.log("playing stopped");
      booksound.stop();
    }
    if(isRecording){
      recordButton.html("Book Sound Rec");
      isRecording=false;
      console.log("recording stopped");
    }
  }
  }

  
  time++;
  
//  if(time%2==0){
  if (camState){
    if (detections) {
    detections.forEach(detection => {
      var data = {
      label: detection.label, 
      name: input.value(),
       r: colorr,
       g: colorg,
       b: colorb,
      //  x: detection.x,
      //  y: detection.y,
       w: detection.width,
       h: detection.height
      }
      socket.emit('detected', data);     
    })
  }

if(buttonState){
  if(phonereceivenum==preprephonereceivenum){
    phonesound.setVolume(0);
  }
  if(bearreceivenum==preprebearreceivenum){
    bearsound.setVolume(0);
  }
  if(cupreceivenum==preprecupreceivenum){
    cupsound.setVolume(0);
  }
  if(bottlereceivenum==preprebottlereceivenum){
    bottlesound.setVolume(0);
  }
  if(bookreceivenum==prepreprebookreceivenum){
    booksound.setVolume(0);
  }
  preprephonereceivenum = prephonereceivenum;
  prephonereceivenum = phonereceivenum;
  preprebearreceivenum = prebearreceivenum;
  prebearreceivenum = bearreceivenum;
  preprecupreceivenum = precupreceivenum;
  precupreceivenum = cupreceivenum;
  preprebottlereceivenum = prebottlereceivenum;
  prebottlereceivenum = bottlereceivenum;
  prepreprebookreceivenum = preprebookreceivenum;
  preprebookreceivenum = prebookreceivenum;
  prebookreceivenum = bookreceivenum;
  }
}
}



function record() {
  if(buttonState){
    text("stop the music to record the book sound",350,750);
}
else{
  if (!isRecording) {
    starttime = Date.now();
    recorder.record(booksound, 4, pressToPlayBack); 
    isRecording = true; 
    recordButton.html("Now Recording");
  if(playButtonState){
    playButton.remove();
    playButtonState = false;
    console.log("playButton is now removed");
    }
  }
}
}


function pressToPlayBack() {
  if(!playButtonState){
    playButton = createButton('Play Book Sound');}
    playButton.position(500,750);
    playButton.size(150,30);

    playButtonState = true;
    soundFileState = true;
    playButton.mousePressed(playIt);
    // isRecording = false; 
    // starttime = Date.now();
    // recordButton.html("Start Recording");
    // console.log("recording stopped");
    }

function playIt() {
  if(buttonState){
    text("stop the music to check the book sound",350,750);
  }
  else{
    starttime = Date.now();
  if (isPlaying) {
    booksound.stop();
    playButton.html("Play Book Sound");
    isPlaying = false; 
    console.log("stop the play!");
  } else {
    booksound.stop();
    booksound.play();
    booksound.setVolume(1);
    if(booksound.isPlaying){console.log("it is really playing!!!");}
    playButton.html("Stop Playing");
    isPlaying = true; 
    console.log("starting to play the recorded sound");
  }
}
}

// function countDown() {
// nowtime = Date.now();
// if(nowtime - starttime == 4000 || nowtime - starttime > 4000 )
//   {
//     if(playButtonState){
//       playButton.html("Play Recording");
//       isPlaying=false;
//       console.log("playing stopped");
//     }
//     if(isRecording){
//       recordButton.html("Start Recording");
//       isRecording=false;
//       console.log("recording stopped");
//     }
//   }
// }
