var socket = io.connect('http://localhost:8080');


var rangeInput;

var camera, scene, renderer, composer,
	ambientLight;


var geometry, group;

var myCube;

//space
var particleSystem;

//tunnel
var elements;


var z_value = 15;

var control = 0;

var z_controller;


var cubes = [];
var speed = 6;

var objects = [];


sliderControl();
init();
render();



function init() {

	z_controller = 0;
	
	// Camera 
	camera = new THREE.PerspectiveCamera(120, window.innerWidth / window.innerHeight, 1, 10000);
	camera.position.z = 0;

	//Renderer
	renderer = new THREE.WebGLRenderer();
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight);
	// the renderer's canvas domElement is added to the body
	document.body.appendChild(renderer.domElement);
	renderer.sortObjects = false;


	//Scene
	scene = new THREE.Scene();
	scene.fog = new THREE.Fog(0x000000, 1, 1000);
	scene.add(camera);

	//light
	ambientLight = new THREE.AmbientLight(0x404040);
	scene.add(ambientLight);

	light = new THREE.PointLight(0xffffff, 20 , 900); // point light
	light.position.set(0, 0, 0);
	scene.add(light);

	// postprocessing

	composer = new THREE.EffectComposer(renderer);
	composer.addPass(new THREE.RenderPass(scene, camera));

	glitchPass = new THREE.GlitchPass();
	glitchPass.renderToScreen = true;
	composer.addPass(glitchPass);
	
	//space
	createSpace();

	// speed beams
	createBeam();

	//tunnel
	createTunnel();


	//asteriod
	createObjects();



}


function render() {


	requestAnimationFrame(render); // pauses when browser tab switched


	var time = Date.now();

	// z.speed.cube
	for (var i = 0; i< cubes.length; i++){
		cube = cubes[i];
		cube.position.z += speed;
		if(cube.position.z > 1000){
			cube.position.z -= 5000;
		}

	}


	// cube objects cluster
	for (var i = 0; i < objects.length; i++){
		object = objects[i];
		object.scale.x = object.scale.x+0.1*Math.sin(time/500);
		object.scale.y = object.scale.x+0.1*Math.sin(time/500);
		object.scale.z = object.scale.x+0.1*Math.sin(time/500);

		object.rotation.x = object.rotation.x + Math.random()* 10 * 0.001;
		object.rotation.y = object.rotation.y + Math.random()* 10 * 0.001;
		object.rotation.z = object.rotation.z + Math.random()* 10 * 0.001;

		// object.position.x = object.position.x + Math.random() * 10-5;
		// object.position.y = object.position.y + Math.random() * 10-5;
		// object.position.z = object.position.z + Math.random() * 10-5;
		
		// if(effectController.yskyrotating == 1){
		// object.position.x = object.position.x * 0.999 * Math.cos(time/2000);
		// object.position.y = object.position.y * 0.999 * Math.cos(time/2000);
		// object.position.z = object.position.z + object.position.z * 0.05;
		// }
	}


	//tunnel movement

	for(var i=0;i<150;i++){
		var circle = elements.children[i];
		if(camera.position.z <= circle.position.z){
			farest-=z_value;
			circle.position.z = farest;
		}
	}

	var counter = 0;

	var target = control/3*2;
	var difference = target - z_controller;
	z_controller += difference * 0.05;

	elements.position.z= z_controller;
	// elements.position.z += 7;
	camera.position.z -=7;
	light.position.z -= 7;
	light.position.y = Math.sin(counter/50)*75;
	light.position.x = Math.cos(counter/50)*75;
	counter++;

	//space BG
	particleSystem.rotation.x += 0.001;;
	particleSystem.rotation.y -= 0.001;
	particleSystem.rotation.z += 0.002;


	// renderer.render(scene, camera);
	composer.render();
}


//----------
// speed beam 
function createBeam(){
	for (var zpos = -4000; zpos < 5000; zpos+= 5){
		var cubeGeometry = new THREE.SphereGeometry(3, 3, 3);
		var m = new THREE.MeshPhongMaterial({
      color: 0xF7E4BE,
      shading:THREE.FlatShading,
      fog: true,
      lights: true
    });
		var cube = new THREE.Mesh(cubeGeometry, m);
		cube.position.x = Math.random() * 1000 - 500;	
		cube.position.y = Math.random() * 1000 - 500;
		cube.position.z = zpos;
		cube.position.multiplyScalar(Math.random()*10);
      	cube.scale.x = cube.scale.y = 1;

      	cubes.push(cube);
      	scene.add(cube);

	}
}


function createTunnel(){
	elements = new THREE.Object3D();
	var r = getRandomInt(255);
	var g = getRandomInt(255);
	var b = getRandomInt(255);
	var colors = [
		new THREE.Color( 'rgb(1,35,69)' ),
		new THREE.Color( 'rgb(18,52,86)' ),
		new THREE.Color( 'rgb(35,69,103)' ),
		new THREE.Color( 'rgb(52,86,120)' )
	];

	var geometry = new THREE.BoxGeometry(10,250,z_value);
	var translate = new THREE.Matrix4().makeTranslation(150,0,0);

	var newColor = returnColor(i);
	for(var i=0;i<150;i++){
		var circle = new THREE.Object3D(0,0,0);
		circle.scale.x = 4/1.5;
		circle.scale.y = 3/1.5;
		for(var j=0;j<4;j++){
			var material = new THREE.MeshLambertMaterial({color: colors[i%4]});
			var cube = new THREE.Mesh(geometry, material);
			var rotation =  new THREE.Matrix4().makeRotationZ(Math.PI*2/4*j);
			cube.applyMatrix( new THREE.Matrix4().multiplyMatrices(rotation, translate) );
			circle.add(cube);
		}
		circle.position.z = -i*(z_value+50);
		elements.add(circle);
	}
	farest = -149*z_value;
	scene.add(elements);


}

function getRandomInt(n){
	return Math.floor((Math.random()*n)+1);
}

function returnColor(i){
	var newColor;
	
}


function createObjects(){
	for (var i = 0; i < 200; i ++){
		var geometry = new THREE.SphereGeometry(1,1,1);
		var meterial = new THREE.MeshPhongMaterial({
			color: 0xeeeeee,
			shading: THREE.FlatShading,

		});
		var object = new THREE.Mesh(geometry, meterial);

		// var expandAmount = 1;
		object.position.set(Math.random() * 2000-1000, Math.random() * 2000-1000, Math.random() * -1000);
		// object.position.x = 0;
		// object.position.y = 0;
		// object.position.z = -100;

		// object.position.multiplyScalar(expandAmount);

		object.rotation.set(Math.random()*10-5, Math.random()*10-5, Math.random()*10-5);
		object.scale.x = object.scale.y = object.scale.z = Math.random()*50;
		objects.push(object);
		scene.add(object);
	}
}

function createSpace(){
	var particles = new THREE.Geometry;
	for (var p = 0; p < 2000; p++) {
		var particle = new THREE.Vector3(Math.random() * 1000 - 500, Math.random() * 1000 - 500, Math.random() * 1000 - 500);
		particles.vertices.push(particle);
	}
	var particleMaterial = new THREE.ParticleBasicMaterial({
		color: 0xeeeeee,
		size: 2,
		map: THREE.ImageUtils.loadTexture(
			"img/particle.png"
		),
		blending: THREE.AdditiveBlending,
		transparent: true

	});

	particleSystem = new THREE.ParticleSystem(particles, particleMaterial);
	particleSystem.position.z = -500;
	scene.add(particleSystem);


}


function sliderControl(){
	// var slider = document.getElementById("control");
	// slider.addEventListener("change", function(){
	// // z_value = parseInt(slider.value);
	// control = parseInt(-slider.value*10);
	
	// // return z_value;
	// return control;
	// });
	
	average=[];
	var locked = false;


	socket.on('neurosky', function(data){



		

		if(data.poorSignalLevel <= 150 && data.eSense.attention > 0){




			//waves:
			//data.eegPower.theta
			//data.eegPower.lowAlpha
			//data.eegPower.highAlpha
			//data.eegPower.lowBeta
			//data.eegPower.highBeta
			//data.eegPower.lowGamma
			//data.eegPower.highGamma

			

			if(locked){
				control = -(100)*10;
				console.log("shoot!");
			} else {			

			if(average.length >= 6){
				average.splice(0, 1);
				average.push(data.eSense.meditation);
				var total = 0;
				$.each(average,function() {
				    total += this;
				});

				waveaverage = total/average.length;
				console.log("wave average: " + waveaverage);

				if(waveaverage >= 80){
					control = -(100)*10;
					locked = true;
				} else{
					control = -data.eSense.meditation*10;
				}


			} else{
				average.push(data.eSense.meditation);
			}

			console.log(average);
			console.log("control: " + control);
		}
	}
		
		


		return control;
	});

	


	
}








