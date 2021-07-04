var pageImage;
// var pageAudio;
var pageText;
var pageWords;
var audioFiles;
var audioFileCounter, totalAudioFiles;
var pages;
var numberOfPages;
var textfontsize = 28;
var speakerWidth = 70;
var speakerHeight = 70;
var imageSize = 200;
var dir = "./content/";
var speakImage;
var currentPage;
var currentFolder;
var navButtons;
var imageLoaded;
var audioFilesLoaded;
var textLoaded;
var createNewPage;

function setup() {
	currentPage=0;
	loadPage();
	createCanvas(windowWidth, windowHeight-10);
	background(0);
	textSize(textfontsize);
	textAlign(LEFT,TOP)
	fill(255);
	initNavUI();
}

function draw() {
	background(0);
	// console.log(isItLoading());
	if(isItLoading()) {
		fill(255);
		text("Loading...",0,0,windowWidth/2,windowHeight/2);
	}
	else{
		if(createNewPage) createPages();
		else {
			pages.display();
		}
	}
	navButtons.display();
}

//if the files are still loading, return true, else return false
function isItLoading(){
	if(!(imageLoaded && textLoaded && audioFilesLoaded)){
		return true;
	}
	else {
		return false;
	}
}

function initNavUI(){
	var buttonFunctions = [2];
	var buttonLabels = [2];
	buttonFunctions[0] = previousPage;
	buttonFunctions[1] = nextPage;
	buttonLabels[0] = "Previous";
	buttonLabels[1] = "Next";
	navButtons = new navUI(0,windowHeight*0.8,windowWidth,windowHeight*0.2,buttonLabels,buttonFunctions);
}

function nextPage(){
	currentPage++;
	if(currentPage==numberOfPages)currentPage=numberOfPages-1;
	else loadPage();
}

function previousPage(){
	currentPage--;
	if(currentPage<0)currentPage=0;
	else loadPage();
}

function mouseDragged(){
}

function mouseReleased(){
	pages.mouseReleased();
	navButtons.mouseReleased();
	// for(var i = 0 ; i < pages.length ; i++){
	// 	pages[i].mouseReleased();
	// }
}

function mouseWheel(event) {
}

function windowResized() {
  // clear();
  // resizeCanvas(windowWidth, windowHeight);
  // for(var i = 0 ; i < pages.length ; i++){
  // 	if(pages[i].active) pages[i].positionMyWordsInTextArea();
  // }
}

function loadPage(){
	// console.log("load page");
	createNewPage=true;
	imageLoaded=false;
	audioFilesLoaded=false;
	textLoaded=false;
	loadStrings(dir+"audio/folders.txt",loadWordFolders);
	loadStrings(dir+"text/story.txt",loadPageText);
	loadStrings(dir+"pictures/filenames.txt",loadPageImage);
}

function loadWordFolders(result){
	numberOfPages = result.length;
	// pageAudio=[];
	currentFolder = result[currentPage];
	var directory = dir+"audio/"+result[currentPage]+"/filenames.txt";
	// for(var i = 0 ; i < result.length ; i++){
	loadStrings(directory, loadWordSounds);
	// }
	// console.log(directory);
}

function loadWordSounds(result){
	audioFiles=[];
	audioFileCounter=0;
	totalAudioFiles=result.length;
	for(var i = 0 ; i < result.length ; i++){
		var directory = dir+"audio/"+currentFolder+"/"+result[i]
		audioFiles.push(loadSound(directory,checkIfAudioFilesAreLoaded));
		// console.log(directory);
	}
	// pageAudio.push(audioFiles);
	// console.log("loadWordSounds");
}

function checkIfAudioFilesAreLoaded(){
	audioFileCounter++;
	if(audioFileCounter==totalAudioFiles) audioFilesLoaded=true;
}

function loadPageText(result){
	pageText = [];
	pageText = splitTokens(result[currentPage]," ");
	// console.log("loadPageText");
	textLoaded=true;
}

function loadPageImage(result){
	// pageImage = [];
	// for(var i = 0 ; i < result.length ; i++){
	var directory = dir+"pictures/"+result[currentPage];
	pageImage = loadImage(directory,checkIfImageLoaded);
	// console.log(directory);
	// }
	// console.log("loadPageImage");
}

function checkIfImageLoaded(){
	// console.log("checkIfImageLoaded");
	imageLoaded=true;
}

function createPages(){
	// console.log("Started createPages")
	pages = new Page(0,0,windowWidth,windowHeight,pageImage,audioFiles,pageText,true,currentPage);
	createNewPage=false;

	// for(var i = 0 ; i < pageAudio.length ; i++){
	// 	pages.push(;
	// }
	// console.log("Finished createPages")
}

function positionPages(){
	pages.x=0;
	pages.y=i*imageSize;
	// for(var i = 0 ; i < pages.length ; i++){
	// 	pages[i].x=0;
	// 	pages[i].y=i*imageSize;
	// }
}

class navUI{
	constructor(x,y,w,h,myButtonLabels,myFunctions){
		this.x = x;
	    this.y = y;
	    this.width = w;
	    this.height = h;
	    this.labels = myButtonLabels;
	    this.myFunctions = myFunctions;
	    this.myButtons = [this.labels.length];
	    for(var i = 0 ; i < this.labels.length ; i++){
	    	var buttonX = this.x+i*this.width/this.labels.length;
	    	var buttonY = this.y;
	    	var buttonWidth = this.width/this.labels.length;
	    	var buttonHeight = this.height;
	    	var buttonLabel = this.labels[i];
	    	var buttonFunction = this.myFunctions[i];
	    	this.myButtons[i] = new Button(buttonX,buttonY,buttonWidth,buttonHeight,buttonLabel,buttonFunction);
	    }
	}

	display(){
		for(var i = 0 ; i < this.myButtons.length ; i++){
			this.myButtons[i].display();
		}
	}

	over() {
	    if (mouseX > this.x && mouseX < this.x + this.width && mouseY > this.y && mouseY < this.y + this.height) {
	      return true;
	    } else {
	      return false;
	    }
	}

	mouseReleased(){
		if(this.over()){
			for(var i = 0 ; i < this.myButtons.length ; i++){
				this.myButtons[i].mouseReleased();
			}
		}
	}
}

class Button {
	constructor(x,y,w,h,label,myF){
		this.x = x;
	    this.y = y;
	    this.width = w;
	    this.height = h;
	    this.label = label;
	    this.myFunction = myF;
	}

	display(){
		textAlign(CENTER,CENTER)
		fill(200);
		rect(this.x,this.y,this.width,this.height);
		fill(0);
		text(this.label,this.x+this.width/2,this.y+this.height/2);
		textAlign(LEFT,TOP)
	}

	over() {
	    if (mouseX > this.x && mouseX < this.x + this.width && mouseY > this.y && mouseY < this.y + this.height) {
	      return true;
	    } else {
	      return false;
	    }
	}

	mouseReleased(){
		if(this.over()) {
			this.myFunction();
		}
	}
}

class Page {
  
  constructor(x, y, w, h, myImg, myAudio, myText, myActive, pageNumber) {
    this.x = x;
    this.y = y;
    this.width = w;
    this.height = h;
    this.number = pageNumber;
    this.img = myImg;
    this.imgX = 0;
    this.imgY = 0;
    this.imgHeight = windowHeight*0.8;
    this.imgWidth = this.img.width/this.img.height*this.imgHeight;
    this.textAreaX = this.imgWidth+10;
    this.textAreaY = 10;
    this.textAreaWidth = windowWidth;
    this.textAreaHeight = this.imgHeight-10;
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
    	fill(255);
    	for(var i = 0 ; i < this.words.length ; i++){
    		this.words[i].display();
    	}
    } 
    // if(this.number = currentPage) this.active = true;
    // else this.active = false;
  }

  positionMyWordsInTextArea(){
  	this.textAreaWidth = windowWidth;
	var wordSpacing = 5;
	var lineHeight = textfontsize;
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
  	//need to check if any audio is playing. if any audio is playing, don't play any audio until
  	//the existing audio is done
  	var anythingCurrentlyPlaying = false;
  	for(var i = 0 ; i < this.words.length ; i++){
  		if(this.words[i].audio.isPlaying()) anythingCurrentlyPlaying = true;
  	}
  	if(!anythingCurrentlyPlaying){
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