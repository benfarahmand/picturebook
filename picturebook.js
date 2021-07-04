var pageImage;
var pageAudio;
var pageText;
var pageWords;
var pages;
var textfontsize = 28;
var speakerWidth = 70;
var speakerHeight = 70;
var imageSize = 200;
var dir = "./content/";
var speakImage;

function preload(){
	loadPage();
}

function setup() {
	createPages();
	// positionPages();
	createCanvas(windowWidth, windowHeight-10);
	background(0);
	textSize(textfontsize);
	textAlign(LEFT,TOP)
	fill(255);
}

function draw() {
	background(0);
	for(var i = 0 ; i < pages.length ; i++){
		pages[i].display();
	}
}

function mouseDragged(){
}

function mouseReleased(){
}

function windowResized() {
  // resizeCanvas(windowWidth, windowHeight);
}

function loadPage(){
	print("started loading");
	loadStrings(dir+"audio/folders.txt",loadWordFolders);
	loadStrings(dir+"text/story.txt",loadPageText);
	loadStrings(dir+"pictures/filenames.txt",loadPageImage);
	print("finished loading");
}

function loadWordFolders(result){
	pageAudio=[];
	for(var i = 0 ; i < result.length ; i++){
		loadStrings(dir+"audio/"+result[i]+"/filenames.txt",loadWordSounds);
	}
}

function loadWordSounds(result){
	var audioFiles=[];
	for(var i = 0 ; i < result.length ; i++){
		audioFiles.push(loadSound(dir+"audio/page01/"+result[i]));
	}
	pageAudio.push(audioFiles);
}

function loadPageText(result){
	pageText = [];
	pageText = splitTokens(result[0]," ");
}

function loadPageImage(result){
	pageImage = [];
	for(var i = 0 ; i < result.length ; i++){
		pageImage.push(loadImage(dir+"/pictures/"+result[i]));
	}
}

function createPages(){
	pages = [];
	for(var i = 0 ; i < pageAudio.length ; i++){
		pages.push(new Page(0,0,windowWidth,windowHeight,pageImage[i],pageAudio[i],pageText,false));
	}
	pages[0].active=true;
}

function positionPages(){
	for(var i = 0 ; i < pages.length ; i++){
		pages[i].x=0;
		pages[i].y=i*imageSize;
	}
}

function mouseReleased(){
	for(var i = 0 ; i < pages.length ; i++){
		pages[i].mouseReleased();
	}
}

class Page {
  
  constructor(inX, inY, w, h, myImg, myAudio, myText, myActive) {
    this.x = inX;
    this.y = inY;
    this.width = w;
    this.height = h;
    this.img = myImg;
    this.imgX = 0;
    this.imgY = 0;
    this.imgWidth = myImg.width;
    this.imgHeight = myImg.height;
    this.textAreaX = 10;
    this.textAreaY = myImg.height+10;
    this.textAreaWidth = myImg.width;
    this.textAreaHeight = windowHeight-myImg.height-10;
    this.audio = myAudio;
    this.sentence = myText;
    this.words = [];
    for(var i = 0 ; i < myText.length ; i++){
    	this.words.push(new Word(myText[i],myAudio[i],0,0));
    }
    this.active = myActive;
    this.positionMyWordsInTextArea();
  }
  
  display() {
    if(this.active){
    	image(this.img, this.imgX, this.imgY, this.imgWidth, this.imgHeight);
    	for(var i = 0 ; i < this.words.length ; i++){
    		this.words[i].display();
    	}
    }
  }

  positionMyWordsInTextArea(){
	var wordSpacing = 5;
	var lineHeight = textfontsize*1.2;
	var y = this.textAreaY;
	for(var i = 0 ; i < this.words.length ; i++){
		if(i==0) {
			this.words[i].x=this.textAreaX;
		}
		else {
			var x = wordSpacing+this.words[i].width+this.words[i-1].width+this.words[i-1].x;
			if(x>this.textAreaWidth){
				y += this.words[i].height+lineHeight;
				this.words[i].x=this.textAreaX;
			}
			else {
				this.words[i].x=x-this.words[i].width;
			}
		}
		this.words[i].y=y;
		this.words[i].positionMyLetters();
	}
  }
  
  over() {
    if (mouseX > this.x && mouseX < this.x + this.width && mouseY > this.y && mouseY < this.y + this.height) {
      return true;
    } else {
      return false;
    }
  }

  overImage(){
  	if (mouseX > this.imgX && mouseX < this.imgX + this.imgWidth && 
  		mouseY > this.imgY && mouseY < this.imgY + this.imgHeight) {
      return true;
    } else {
      return false;
    }
  }

  overTextArea(){
  	if (mouseX > this.textAreaX && mouseX < this.textAreaX + this.textAreaWidth && 
  		mouseY > this.textAreaY && mouseY < this.textAreaY + this.textAreaHeight) {
      return true;
    } else {
      return false;
    }
  }

  playSentence(){
  	var duration = 0.0;
  	for(var i = 0 ; i < this.audio.length ; i++){
  		duration += this.audio[i].duration()+0.1;
  		setTimeout( function(audio){audio.play()},duration*1000,this.audio[i]);
  	}
  }

  mouseReleased(){
  	//if over image, play the entire sentence
  	if(this.overImage()) this.playSentence();
  	//if over word, play that word
  	if(this.overTextArea()) {
  		for(var i = 0 ; i < this.words.length ; i++){
  			this.words[i].mouseReleased();
  		}
  	}
  }
}

class Word {

	constructor(_w,_a,_x,_y){
		this.word = _w;
		this.audio = _a;
		this.characters = [];
		this.count = _w.length;
		this.x = _x;
	    this.y = _y;
	    textSize(textfontsize);
	    this.width = textWidth(_w);
	    this.height = textfontsize;
	}

	over() {
	    if (mouseX > this.x && mouseX < this.x + this.width && mouseY > this.y && mouseY < this.y + this.height) {
	      return true;
	    } else {
	      return false;
	    }
	}

	positionMyLetters(){
		var xLoc = this.x;
	    for(var i = 0 ; i < this.count ; i ++){
	    	var l = this.word.charAt(i);
	    	var letterWidth = textWidth(l);
	    	this.characters.push(new Letter(l,xLoc,this.y,letterWidth,textfontsize,alphabetPosition(l)-1));
	    	xLoc = xLoc + letterWidth;
	    }
	}

	display(){
		for(var i = 0 ; i < this.characters.length ; i++){
			text(this.characters[i].c,this.characters[i].x,this.characters[i].y);
		}
		if(this.audio.isPlaying()){
			stroke(1);
			stroke(255,0,0);
			noFill();
			rect(this.x-1,this.y-1,this.width+1,this.height+1);
			noStroke();
			fill(255);
		}
	}

	playSound(){
		if(!this.audio.isPlaying()) this.audio.play();
	}

	mouseReleased(){
		if(this.over()) this.playSound();
		// incorporate if over characters
		// for(var i = 0 ; i < this.characters.length ; i++){
		// 	this.characters[i].mouseReleased();
		// }
	}
}

class Letter {

	constructor(_c,_x,_y,_w,_h,_alphabetArrayRef){
		this.c=_c;
		this.x = _x;
		this.y = _y;
		this.width = _w;
		this.height = _h;
		this.alphabetArrayRef=_alphabetArrayRef;
	}

	// over() {
	//     if (mouseX > this.x && mouseX < this.x + this.width && mouseY > this.y && mouseY < this.y + this.height) {
	//       return true;
	//     } else {
	//       return false;
	//     }
	// }
	//maybe add individual letter sounds eventually... we'll see, might be too complicated
	// mouseReleased(){
	// 	if(this.over()) {
	// 		this.playSound();
	// 	}
	// }

	// playSound(){
	// 	if(!letterSounds[this.alphabetArrayRef].isPlaying()) letterSounds[this.alphabetArrayRef].play();
	// }

}

function alphabetPosition(text) {
  var result = "";
  for (var i = 0; i < text.length; i++) {
    var code = text.toUpperCase().charCodeAt(i)
    if (code > 64 && code < 91) result += (code - 64) + " ";
  }

  return result.slice(0, result.length - 1);
}