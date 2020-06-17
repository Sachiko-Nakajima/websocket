let video;
let detector;
let detections;
let meow, kitty;
let ringtone, phone;
let personlocalstate = 0;
let personstate = 0;
let phonelocalstate = 0;
let phonestate = 0;
let persontime1 = 0;
let phonetime1 = 0;
let persontime2 = 0;
let phonetime2 = 0;
let time = 0;
let objects = [];
let socket;

function preload() {
  //load meow sound:
  meow = loadSound("meow.wav");
  ringtone = loadSound("ringtone.wav");
}

function setup() {
  createCanvas(360, 540);

  video = createCapture(VIDEO);
  video.size(width, height/2);
  video.hide();  // hide the initial webcamera view 

  detector = ml5.objectDetector('yolo', modelReady)  //activate the ml5 Object Detection machine learning model
  
  kitty = loadImage("kitty.jpeg");
  phone = loadImage("phone.png");
 // objects[id] = new ObjectDetected(id, x, y, state, localstate, ontime, offtime);
 socket = io.connect('http://localhost:8000');
 socket.on('mouse', newDrawing);

}

function newDrawing(data){
  noStroke();
  fill(200,0,100);
  ellipse(data.x, data.y, 10,10);
}


function modelReady() {
  console.log('model loaded')  
  detect(); //function modelReady to load the modeal and initiate the detect objects by calling the "detect" funtion
}

function detect() {
  detector.detect(video, gotResults); 
}

function gotResults(err, results) {
  if (err) {
    console.log(err);
    return
  }

  detections = results;

  detect();    

}

function draw() {
  if(time%10==0){
  background(220);
  }
  time++;
  image(video, 0, height/2, width, height/2); //showing the resulting video of objects that got detected

  if (detections) {
    detections.forEach(detection => {
      fill(0);
      strokeWeight(2);
      text(detection.label, detection.x + 4, detection.y + 10 + height/2)

      noFill();
      strokeWeight(3);
      stroke(0, 255, 0);
      if (detection.label == 'person') {
        if(personstate ==0&& personlocalstate ==0&& !meow.isLooping()&& !meow.isLooping()){
          meow.play();
          meow.loop();
        personstate = 1;
        personlocalstate = 1;
        }
        personstate = 1;
        personlocalstate = 1;
        console.log('Sending:' + detection.x + ',' + detection.y);
        var data = {
         x: detection.x,
         y: detection.y
        }
        socket.emit('mouse', data); 
      
        if(persontime1%5==0){
        image(kitty, detection.x, detection.y, detection.width, detection.height/2);        
      rect(detection.x, detection.y, detection.width, detection.height/2);}
        persontime1++;
        persontime2 = 0;
        meow.rate(1-(detection.x-width/2)/1000);
      } 
          if (detection.label === 'cell phone') {
        if(phonestate ==0 && phonelocalstate ==0&& !ringtone.isPlaying()){
          ringtone.play();
          ringtone.loop();
//          ringtone.rate(1-detection.y/1000);
        }
        phonestate = 1;
        phonelocalstate = 1;
        if(phonetime1%5==0){
        image(phone, detection.x, detection.y, detection.width, detection.height/2);    
      rect(detection.x, detection.y, detection.width, detection.height/2);}
            persontime1++;
            phonetime2 = 0;
      }     
    
    })
  }
    console.log(personlocalstate + "person");

  if(personlocalstate == 0){
          persontime2++;
        if(persontime2 > 3){
        personstate = 0;
        meow.stop();
      }
          persontime1=0;
    }
    if(phonelocalstate == 0){
          phonetime2++;
        if(phonetime2 > 3){
        phonestate = 0;
        ringtone.stop();
        }
          phonetime1=0;
    }
  personlocalstate = 0;
  phonelocalstate = 0;
  if(meow.isPlaying()){
    console.log("meow is on");
    console.log(personstate);
    if(personstate==0){
      meow.stop();
    }
  }
}

  	class ObjectDetected {
		constructor(id, x, y, state, localstate, ontime, offtime) {
			this.id = id;
			this.x = x;
			this.y = y;
			this.state = state;
			this.localstate = localstate;
			this.ontime = ontime;
			this.offtime = offtime;
		}

		move() {
		}

		show() {
			push();
			translate(this.x,this.y);
			pop();
		}

	}

