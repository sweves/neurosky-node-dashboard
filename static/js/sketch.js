var socket = io.connect('http://localhost:8080');
var rangeInput;
var camera, scene, renderer, composer, ambientLight;
var geometry, group;
var myCube;
var particles = new THREE.Geometry;
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

var circleArray = [];

sliderControl();
init();
render();

function init() {

	// Controlling the Z position of the cubes
	z_controller = 0;

	/*
		PerspectiveCamera( fov, aspect, near, far )
		fov — Camera frustum vertical field of view.
		aspect — Camera frustum aspect ratio.
		near — Camera frustum near plane.
		far — Camera frustum far plane.
	*/
	camera = new THREE.PerspectiveCamera(120, window.innerWidth / window.innerHeight, 1, 10000);
	camera.position.z = 0;

	// The WebGL renderer displays your beautifully crafted scenes using WebGL, if your device supports it.
	renderer = new THREE.WebGLRenderer();
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight);

	// the renderer's canvas domElement is added to the body
	document.body.appendChild(renderer.domElement);

	// Defines whether the renderer should sort objects. Default is true.
	// Note: Sorting is used to attempt to properly render objects that have some degree of transparency. By definition, sorting objects may not work in all cases. Depending on the needs of application, it may be neccessary to turn off sorting and use other methods to deal with transparency rendering e.g. manually determining the object rendering order.
	renderer.sortObjects = false;

	// Scene
	// This class contains the parameters that define linear fog, i.e., that grows linearly denser with the distance.
	// Fog( hex, near, far )
	// The hex parameter is passed to the Color constructor to set the color property. Hex can be a hexadecimal integer or a CSS-style string.
	// .near: The minimum distance to start applying fog. Objects that are less than 'near' units from the active camera won't be affected by fog. Default is 1.
	// .far: The maximum distance at which fog stops being calculated and applied. Objects that are more than 'far' units away from the active camera won't be affected by fog. Default is 1000.
	scene = new THREE.Scene();
	scene.fog = new THREE.Fog(0x000000, 1, 1000);
	scene.add(camera);

	// AmbientLight - This light's color gets applied to all the objects in the scene globally.
	ambientLight = new THREE.AmbientLight(0x404040);
	scene.add(ambientLight);

	// PointLight - Affects objects using MeshLambertMaterial or MeshPhongMaterial.
	light = new THREE.PointLight(0xffffff, 20 , 900);
	light.position.set(0, 0, 0);
	scene.add(light);

	// postprocessing
	// http://codepen.io/ryonakae/pen/PPKxyw
	composer = new THREE.EffectComposer(renderer);
	composer.addPass(new THREE.RenderPass(scene, camera));

	glitchPass = new THREE.GlitchPass();
	glitchPass.renderToScreen = true;
	composer.addPass(glitchPass);

	// Adding Particles
	addParticleSystem();

	// speed beams
	addSpeedBeams();

	//tunnel
	addTunnel();

	//asteriod
	addAsteriods();

	setInterval(function() {
		object.position.z = camera.position.z - 2000;
		for (var i = 0; i < objects.length; i++){
			object = objects[i];
			object.position.z = (Math.random() * -1000) + (camera.position.z - 2000);
		}
	}, 10000);

	setInterval(function() {
		particleSystem.position.z = camera.position.z - 2000;
	}, 8000);

	setInterval(function() {
		for (var e = 0; e < cubes.length; e++) {
			cubes[e].position.z = (Math.random() * 1000 - 500) + camera.position.z - 2000;
		}
	}, 9000);
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
		// object.scale.x = object.scale.x+0.1*Math.sin(time/500);
		// object.scale.y = object.scale.x+0.1*Math.sin(time/500);
		// object.scale.z = object.scale.x+0.1*Math.sin(time/500);

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
	if (elements.children.length > 1) {
	for(var i=0;i<150;i++){
			var circle = elements.children[i];
			if(camera.position.z <= circle.position.z){
				farest-=z_value;
				circle.position.z = farest;
			}
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
	if (particleSystem) {
		particleSystem.rotation.x += 0.001;;
		particleSystem.rotation.y -= 0.001;
		particleSystem.rotation.z += 0.002;
	}

	// renderer.render(scene, camera);
	composer.render();
}

// speed beam
function addSpeedBeams() {
	var zpos,
		cubeGeometry,
		m,
		cube;

	for (zpos = -4000; zpos < 5000; zpos+= 5){
		cubeGeometry = new THREE.SphereGeometry(3, 3, 3);
		m = new THREE.MeshPhongMaterial({
			color: 0xF7E4BE,
			shading:THREE.FlatShading,
			fog: true,
			lights: true
		});

		cube = new THREE.Mesh(cubeGeometry, m);
		cube.position.x = Math.random() * 1000 - 500;
		cube.position.y = Math.random() * 1000 - 500;
		cube.position.z = zpos;
		cube.position.multiplyScalar(Math.random() * 10);
		cube.scale.x = cube.scale.y = 1;

		cubes.push(cube);
		scene.add(cube);
	}
}

function addTunnel() {
	elements = new THREE.Object3D();

	var colors,
		geometry,
		translate,
		i,
		circle,
		j,
		material,
		cube,
		rotation;

	colors = [
		new THREE.Color('rgb(1,35,69)'),
		new THREE.Color('rgb(18,52,86)'),
		new THREE.Color('rgb(35,69,103)'),
		new THREE.Color('rgb(52,86,120)')
	];

	geometry = new THREE.BoxGeometry(10, 250, z_value);
	translate = new THREE.Matrix4().makeTranslation(150, 0, 0);

	for (i = 0; i < 150; i++) {
		circle = new THREE.Object3D(0,0,0);
		circle.scale.x = 4/1.5;
		circle.scale.y = 3/1.5;

		for (j = 0; j < 4; j++) {
			material = new THREE.MeshLambertMaterial({color: colors[i % 4]});
			cube = new THREE.Mesh(geometry, material);
			rotation =  new THREE.Matrix4().makeRotationZ(Math.PI * 2 / 4 * j);
			cube.applyMatrix(new THREE.Matrix4().multiplyMatrices(rotation, translate));
			circle.add(cube);
		}

		circle.position.z = -i * (z_value + 50);
		elements.add(circle);
	}
	farest = -149 * z_value;
	scene.add(elements);
}

function addAsteriods() {
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

function addParticleSystem() {
	var p,
		particle,
		particleMaterial;

	for (p = 0; p < 2000; p++) {
		particle = new THREE.Vector3(Math.random() * 1000 - 500, Math.random() * 1000 - 500, Math.random() * 1000 - 500);
		particles.vertices.push(particle);
	}

	particleMaterial = new THREE.ParticleBasicMaterial({
		color: 0xeeeeee,
		size: 2,
		map: THREE.ImageUtils.loadTexture(
			'img/particle.png'
		),
		blending: THREE.AdditiveBlending,
		transparent: true
	});

	particleSystem = new THREE.ParticleSystem(particles, particleMaterial);
	particleSystem.position.z = -500;
	scene.add(particleSystem);
}

function sliderControl() {
	// var slider = document.getElementById("control");
	// slider.addEventListener("change", function(){
	// // z_value = parseInt(slider.value);
	// control = parseInt(-slider.value*10);

	// // return z_value;
	// return control;
	// });
	average = [];
	var locked = false;

	socket.on('neurosky', function(data){
		if (data.poorSignalLevel <= 150 && data.eSense.attention > 0){
			//waves:
			//data.eegPower.theta
			//data.eegPower.lowAlpha
			//data.eegPower.highAlpha
			//data.eegPower.lowBeta
			//data.eegPower.highBeta
			//data.eegPower.lowGamma
			//data.eegPower.highGamma

			if (locked) {
				control = -(100) * 10;
				console.log("shoot!");
			} else {

				if (average.length >= 6) {
					average.splice(0, 1);
					average.push(data.eSense.meditation);
					var total = 0;

					$.each(average, function() {
						total += this;
					});

					waveaverage = total/average.length;
					console.log("wave average: " + waveaverage);

					if (waveaverage >= 80){
						control = -(100)*10;
						locked = true;
					} else{
						control = -data.eSense.meditation * 10;
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
