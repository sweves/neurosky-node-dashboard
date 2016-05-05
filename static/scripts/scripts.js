var socket = io.connect('http://localhost:8080');

var incomingsignal = false;
var incomingdata = false;
var incomingfilename = false;
var ready = false;
var logging = false;
var csvname;
var filename;
var temparray;
var deltawave;
var thetawave;
var lowalphawave;
var highalphawave;
var lowbetawave;
var highbetawave;
var lowgammawave;
var highgammawave;

$("#start").hide();
$("#datavis").hide();

var csv=[["delta", "theta", "lowAlpha", "highAlpha", "lowBeta", "highBeta", "lowGamma", "highGamma", "attention", "meditation"]];

socket.on('neurosky', function(data){
	
	socket.emit('signal', data.poorSignalLevel);


	if(data.poorSignalLevel >= 150){
		$(".signal").addClass("pending");
		$('#check1').css({ fill: "#444" });
		incomingsignal = true;
		$(".data").addClass("pending");
		$('#check2').css({ fill: "#444" });
		incomingdata = false;

	} else {
		$(".signal").removeClass("pending");
		$('#check1').css({ fill: "#0F0" });
		incomingsignal = true;

		if(data.eSense.attention === 0){
			$(".data").addClass("pending");
			$('#check2').css({ fill: "#444" });
			incomingdata = false;
		} else {
			$(".data").removeClass("pending");
			$('#check2').css({ fill: "#0F0" });
			incomingdata = true;
			
		}
	}

	filename = $("#filename").val();
	if(filename.length > 0){
		$(".name").removeClass("pending");
		$('#check3').css({ fill: "#0F0" });
		incomingfilename = true;
	} else {
		$(".name").addClass("pending");
		$('#check3').css({ fill: "#444" });
		incomingfilename = false;
	}

	if(incomingdata && incomingsignal && incomingfilename){
		ready = true;
		$(".loading").hide();
		$("#start").show();
	} else{
		$(".loading").show();
		$("#start").hide();
	}

	if(ready){
		$( "#start" ).unbind().click(function() {
			var filename = $("#filename").val();
			var regex = /^[a-zA-Z]*$/;
			if (regex.test(filename)) {
				logging=true;

			  $(".blackout").hide();
			  $("#datavis").show();
			  $("#testname").text(filename);

			  } else {
			  	alert("please use only letters in your test name");
			  }

			});

		if(logging){

			if(data.poorSignalLevel <= 150 && data.eSense.attention > 0){
				$("#delta").text("delta: " + data.eegPower.delta);
				$("#theta").text("theta: " + data.eegPower.theta);
				$("#lowAlpha").text("low alpha: " + data.eegPower.lowAlpha);
				$("#highAlpha").text("high alpha: " + data.eegPower.highAlpha);
				$("#lowBeta").text("low beta: " + data.eegPower.lowBeta);
				$("#highBeta").text("high beta: " + data.eegPower.highBeta);
				$("#lowGamma").text("low gamma: " + data.eegPower.lowGamma);
				$("#highGamma").text("high gamma: " + data.eegPower.highGamma);

				$("#attention").text("attention: " + data.eSense.attention);
				$("#meditation").text("meditation: " + data.eSense.meditation);

				deltawave = Math.log(data.eegPower.delta);
				thetawave = Math.log(data.eegPower.theta);
				lowalphawave = Math.log(data.eegPower.lowAlpha);
				highalphawave = Math.log(data.eegPower.highAlpha);
				lowbetawave = Math.log(data.eegPower.lowBeta);
				highbetawave = Math.log(data.eegPower.highBeta);
				lowgammawave = Math.log(data.eegPower.lowGamma);
				highgammawave = Math.log(data.eegPower.highGamma);

				temparray=[];
				temparray.push(deltawave);
				temparray.push(Math.log(data.eegPower.theta));
				temparray.push(Math.log(data.eegPower.lowAlpha));
				temparray.push(Math.log(data.eegPower.highAlpha));
				temparray.push(Math.log(data.eegPower.lowBeta));
				temparray.push(Math.log(data.eegPower.highBeta));
				temparray.push(Math.log(data.eegPower.lowGamma));
				temparray.push(Math.log(data.eegPower.highGamma));
				temparray.push(data.eSense.attention);
				temparray.push(data.eSense.meditation);
				csv.push(temparray);

			} else{
				$("#delta").text("waiting for signal....");
				$("#theta").text("waiting for signal....");
				$("#lowAlpha").text("waiting for signal....");
				$("#highAlpha").text("waiting for signal....");
				$("#lowBeta").text("waiting for signal....");
				$("#highBeta").text("waiting for signal....");
				$("#lowGamma").text("waiting for signal....");
				$("#highGamma").text("waiting for signal....");

				$("#attention").text("waiting for signal....");
				$("#meditation").text("waiting for signal....");
			}

			$( "#stoprecording" ).unbind().click(function() {
				var commas = csv.join('\n');
				console.log(commas);

				var hiddenElement = document.createElement('a');

				hiddenElement.href = 'data:attachment/text,' + encodeURI(commas);
				hiddenElement.target = '_blank';
				hiddenElement.download = filename + '.csv';
				hiddenElement.click();
				alert("data saved!");
				logging = false;
				$("#filename").val('');
				$(".blackout").show();
			  	$("#datavis").hide();
			});

		}
	}

});

var dotsize = 8;

var deltax;
var thetax;
var lax;
var hax;
var lbx;
var hbx;
var lgx;
var hgx; 

function setup(){
	var mycanvas = createCanvas(460, 460);
	mycanvas.parent('visualizer');
	deltax = 0;
	thetax = 0;
	lax = 0;
	hax = 0;
	lbx = 0;
	hbx = 0;
	lgx = 0;
	hgx = 0; 

}

var easing = 0.05;

function draw(){
	background('#111');
	noFill();
	stroke(255);
	ellipse(width/2, height/2, 450, 450);
	ellipse(width/2, height/2, 337.5, 337.5);
	ellipse(width/2, height/2, 225, 225);
	ellipse(width/2, height/2, 112.5, 112.5);
	if(logging){

		

		translate(width/2, height/2);
		noFill();
		stroke(255);
		line(0, 0, width/2-6, 0);
		fill(0, 255, 0);
		noStroke();
		var dmap = map(deltawave, 0, 15.5, 0, width/2-6);

		var targetd = dmap;

		if (dist(deltax, 0, targetd, 0) >= 1) {
    		deltax += easing * (targetd - deltax);
  		}

		ellipse(deltax, 0, dotsize, dotsize);

		

		rotate(PI/4.0);
		noFill();
		stroke(255);
		line(0, 0, width/2-6, 0);
		fill(255, 255, 0);
		noStroke();
		var tmap = map(thetawave, 0, 15.5, 0, width/2-6); 

		var targett = tmap;

		if (dist(thetax, 0, targett, 0) >= 1) {
    		thetax += easing * (targett - thetax);
  		}

		ellipse(thetax, 0, dotsize, dotsize);

		rotate(PI/4.0);
		noFill();
		stroke(255);
		line(0, 0, width/2-6, 0);
		fill(0, 255, 255);
		noStroke();
		var lamap = map(lowalphawave, 0, 15.5, 0, width/2-6); 

		var targetla = lamap;

		if (dist(lax, 0, targetla, 0) >= 1) {
    		lax += easing * (targetla - lax);
  		}

		ellipse(lax, 0, dotsize, dotsize);

		rotate(PI/4.0);
		noFill();
		stroke(255);
		line(0, 0, width/2-6, 0);
		fill(255, 0, 255);
		noStroke();
		var hamap = map(highalphawave, 0, 15.5, 0, width/2-6); 

		var targetha = hamap;

		if (dist(hax, 0, targetha, 0) >= 1) {
    		hax += easing * (targetha - hax);
  		}

		ellipse(hax, 0, dotsize, dotsize);

		rotate(PI/4.0);
		noFill();
		stroke(255);
		line(0, 0, width/2-6, 0);
		fill(0, 255, 0);
		noStroke();
		var lbmap = map(lowbetawave, 0, 15.5, 0, width/2-6); 

		var targetlb = lbmap;

		if (dist(lbx, 0, targetlb, 0) >= 1) {
    		lbx += easing * (targetlb - lbx);
  		}

		ellipse(lbx, 0, dotsize, dotsize);

		rotate(PI/4.0);
		noFill();
		stroke(255);
		line(0, 0, width/2-6, 0);
		fill(255, 255, 0);
		noStroke();
		var hbmap = map(highbetawave, 0, 15.5, 0, width/2-6);

		var targethb = hbmap;

		if (dist(hbx, 0, targethb, 0) >= 1) {
    		hbx += easing * (targethb - hbx);
  		}

		ellipse(hbx, 0, dotsize, dotsize);

		rotate(PI/4.0);
		noFill();
		stroke(255);
		line(0, 0, width/2-6, 0);
		fill(0, 255, 255);
		noStroke();
		var lgmap = map(lowgammawave, 0, 15.5, 0, width/2-6);

		var targetlg = lgmap;

		if (dist(lgx, 0, targetlg, 0) >= 1) {
    		lgx += easing * (targetlg - lgx);
  		}

		ellipse(lgx, 0, dotsize, dotsize);

		rotate(PI/4.0);
		noFill();
		stroke(255);
		line(0, 0, width/2-6, 0);
		fill(255, 0, 255);
		noStroke();
		var hgmap = map(highgammawave, 0, 15.5, 0, width/2-6);

		var targethg = hgmap;

		if (dist(hgx, 0, targethg, 0) >= 1) {
    		hgx += easing * (targethg - hgx);
  		}

		ellipse(hgx, 0, dotsize, dotsize);
	}




}





