'strict mode';

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
var z_controller = 0;
var beams = [];
var speed = 6;
var asteriods = [];
var gap = 50;
var farest = -149 * z_value;
var focusLevel = 1;

var circleArray = [];
var stopped = false;
sliderControl();
init();
render();

function init() {
	// Setup Environment
	setupEnv();

	// Adding Particles
	addParticleSystem();

	// speed beams
	addSpeedBeams();

	//tunnel
	addTunnel();

	//asteriod
	addAsteriods();

	// Start to loop beams, particles and asteriods
	startVisualLoops();
}

function startVisualLoops() {
	setInterval(function() {
		if (focusLevel === 1) {
			for (var i = 0; i < asteriods.length; i++){
				asteriod = asteriods[i];
				asteriod.position.z = (Math.random() * -1000) + (camera.position.z - 2000);
			}
		}
	}, 10000);

	setInterval(function() {
		if (focusLevel <= 2) {
			for (var e = 0; e < beams.length; e++) {
				beams[e].position.z = (Math.random() * 1000 - 500) + camera.position.z - 2000;
			}
		}
	}, 9000);

	setInterval(function() {
		if (focusLevel <= 3) {
			particleSystem.position.z = camera.position.z - 2000;
		}
	}, 8000);
}

function setupEnv() {
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

	ambientLight = new THREE.AmbientLight(0x404040);
	scene.add(ambientLight);

	light = new THREE.PointLight(0xffffff, 20 , 900);
	light.position.set(0, 0, 0);
	scene.add(light);

	composer = new THREE.EffectComposer(renderer);
	composer.addPass(new THREE.RenderPass(scene, camera));

	glitchPass = new THREE.GlitchPass();
	glitchPass.renderToScreen = true;
	composer.addPass(glitchPass);
}

function render() {
	requestAnimationFrame(render);

	var time = Date.now(),
		cube,
		asteriod,
		c,
		o,
		t,
		circle;

	for (c = 0; c < beams.length; c++) {
		cube = beams[c];
		cube.position.z += speed;
		if (cube.position.z > 1000) {
			cube.position.z -= 5000;
		}
	}

	for (o = 0; o < asteriods.length; o++) {
		asteriod = asteriods[o];
		asteriod.scale.x = asteriod.scale.x + 0.1 * Math.sin(time / 500);
		asteriod.scale.y = asteriod.scale.x + 0.1 * Math.sin(time / 500);
		asteriod.scale.z = asteriod.scale.x + 0.1 * Math.sin(time / 500);

		asteriod.rotation.x = asteriod.rotation.x + Math.random() * 10 * 0.001;
		asteriod.rotation.y = asteriod.rotation.y + Math.random() * 10 * 0.001;
		asteriod.rotation.z = asteriod.rotation.z + Math.random() * 10 * 0.001;
	}

	// tunnel movement
	if (elements.children.length > 1) {
		for (t = 0; t < 150; t++) {
			circle = elements.children[t];
			if (camera.position.z <= circle.position.z) {
				farest -= z_value;
				circle.position.z = farest + (circle.position.z + (z_value + gap) * 149 - z_value);
			}
		}
	}

	var counter = 0;
	var target = control / 3 * 2;
	var difference = target - z_controller;
	z_controller += difference * 0.05;

	if (!stopped) {
		elements.position.z = z_controller;
		camera.position.z -= 7;
		light.position.z -= 7;
		light.position.y = Math.sin(counter / 50) * 75;
		light.position.x = Math.cos(counter / 50) * 75;
		counter ++;

		// space BG
		if (particleSystem) {
			particleSystem.rotation.x += 0.001;
			particleSystem.rotation.y -= 0.001;
			particleSystem.rotation.z += 0.002;
		}
	}

	if (focusLevel <= 2) {
		composer.render();
	} else {
		renderer.render(scene, camera);
	}
}

// speed beam
function addSpeedBeams() {
	var zpos,
		cubeGeometry,
		m,
		cube;

	for (zpos = -4000; zpos < 5000; zpos+= 5) {
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

		beams.push(cube);
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

	/*
	BoxGeometry(width, height, depth, widthSegments, heightSegments, depthSegments)

	width — Width of the sides on the X axis.
	height — Height of the sides on the Y axis.
	depth — Depth of the sides on the Z axis.
	widthSegments — Optional. Number of segmented faces along the width of the sides. Default is 1.
	heightSegments — Optional. Number of segmented faces along the height of the sides. Default is 1.
	depthSegments — Optional. Number of segmented faces along the depth of the sides. Default is 1.
	*/
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

		circle.position.z = -i * (z_value + gap);
		elements.add(circle);
	}

	scene.add(elements);
}

function addAsteriods() {
	for (var i = 0; i < 200; i ++) {
		var geometry = new THREE.SphereGeometry(1, 1, 1);
		var meterial = new THREE.MeshPhongMaterial({
			color: 0xeeeeee,
			shading: THREE.FlatShading,
		});
		var asteriod = new THREE.Mesh(geometry, meterial);

		asteriod.position.set(Math.random() * 2000-1000, Math.random() * 2000-1000, Math.random() * -1000);
		asteriod.rotation.set(Math.random() * 10-5, Math.random() * 10-5, Math.random() * 10-5);
		asteriod.scale.x = asteriod.scale.y = asteriod.scale.z = Math.random() * 50;
		asteriods.push(asteriod);
		scene.add(asteriod);
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
	average = [];
	var locked = false;

	socket.on('neurosky', function(data){
		if (data.poorSignalLevel <= 150 && data.eSense.attention > 0) {
			if (locked) {
				control = -(100) * 10;
				stopped = true;
				console.log('Completed!');
			} else {
				if (average.length >= 6) {
					average.splice(0, 1);
					average.push(data.eSense.meditation);
					var total = 0;

					$.each(average, function() {
						total += this;
					});

					waveaverage = total/average.length;

					if (waveaverage >= 80){
						control = -(100)*10;
						locked = true;
					} else {
						control = -data.eSense.meditation * 10;
					}

					if (waveaverage > 0 && waveaverage < 40) {
						focusLevel = 1;
					} else if (waveaverage > 40 && waveaverage < 70) {
						focusLevel = 2;
					} else if (waveaverage > 70 && waveaverage < 80) {
						focusLevel = 3;
					}

					console.log('focusLevel', focusLevel);

				} else {
					average.push(data.eSense.meditation);
				}
			}
		}
		return control;
	});
}
