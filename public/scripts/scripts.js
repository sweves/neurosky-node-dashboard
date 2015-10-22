var socket = io.connect('http://localhost:3000');

socket.on('neurosky', function(data){
	console.log(data);

	if(data.poorSignalLevel >= 199){
		$('#signal').css("background-color", "#F00");
	} else{
		$('#signal').css("background-color", "#0F0");
	}

	$('#attention').text(data.eSense.attention);
	$('#attention_slider').val(data.eSense.attention);

	$('#meditation').text(data.eSense.meditation);
	$('#meditation_slider').val(data.eSense.meditation);

});