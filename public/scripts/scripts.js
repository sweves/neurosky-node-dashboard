var socket = io.connect('http://localhost:3000');
var attentionslider, 
	attentionwidth, 
	meditationwidth,
	score;

function setup(){
	createCanvas(windowWidth, windowHeight);
	
	attentionwidth = 0;
	meditationwidth = 0;
	score = 0;

	attentionlabel = createElement('p', 'attention');
	meditationlabel = createElement('p', 'meditation');
	signallabel = createElement('p', 'signal');
	focusedlabel = createElement('p', 'focused!');

}

function draw(){

	background(0);

	sockets();

	signal();
	attention();
	meditation();

	for (var i = 0; i <= 110; i+=22) {
		stroke(255);
		if(i<score){
			fill(0,255,0);
		} else{
			fill(0);
		}
    	rect(windowWidth/2-55+i, windowHeight - 100, 20, 20 );
  	}

  	if (score>=110){
  		focusedlabel.position(windowWidth/2+100, windowHeight-100);
  	} else{
  		focusedlabel.position(windowWidth+999, windowHeight+999);
  	}

}

function sockets(){

	socket.on('neurosky', function(data){
		console.log(data);
		noStroke();

		if(data.poorSignalLevel >= 150){
			attentionwidth = 0;
			meditationwidth = 0;
			fill(255, 0, 0);
			
		} else{
			attentionwidth = data.eSense.attention;
			meditationwidth = data.eSense.meditation;

			fill(0, 255, 0);

			if(attentionwidth >= 60){
				score+=0.01;
			}
		}

	});

}

function windowResized() {

  resizeCanvas(windowWidth, windowHeight);

}

function attention(){

	attentionlabel.position(20, 20);

	fill(0);
	stroke(255);
	strokeWeight(3);
	rect(140, 20, 500, 20);

	fill(255);
	noStroke();
	var mapped_attention = map(attentionwidth, 0, 100, 0, 500);
	rect(140, 20, mapped_attention, 20);

}

function meditation(){

	meditationlabel.position(20, 50);

	fill(0);
	stroke(255);
	strokeWeight(3);
	rect(140, 50, 500, 20);

	fill(255);
	noStroke();
	var mapped_meditation = map(meditationwidth, 0, 100, 0, 500);
	rect(140, 50, mapped_meditation, 20);

}

function signal(){

	signallabel.position(windowWidth-130, 20);
	ellipse(windowWidth-50, 30, 20, 20);

}

function keyPressed() {
  if (keyCode === RETURN) {
    score = 0;
  }
}
