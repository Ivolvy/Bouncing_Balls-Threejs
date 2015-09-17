var that;
var BouncingBalls = function(){
    this.scene = new THREE.Scene();
    that = this;
};

BouncingBalls.prototype.init = function(){
    this.createCamera();
    this.createRenderer();

    this.createBoxes();

    this.createFloor();
    this.createLights();

    this.animateBalls();

    this.render();
    this.datGUI();
};

BouncingBalls.prototype.createCamera = function(){
    this.camera = new THREE.OrthographicCamera( window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, -1000, 1000 );
    this.camera.position.x = 100;
    this.camera.position.y = 100;
    this.camera.position.z = 100;

    this.camera.lookAt(new THREE.Vector3(0,0,0));
    this.camera.zoom = 0.5;
    this.camera.updateProjectionMatrix();

    //Adjust the scene to center the balls
    this.scene.position.z = 170;
    this.scene.position.y = -70;
};

/*Display or not 2D view*/
BouncingBalls.prototype.swap2DView = function(value){
    if(value == true){
        this.camera.position.set(100,0,0);
        this.scene.position.y = -120;
    }
    else{
        this.camera.position.set(100,100,100);
        this.scene.position.y = -70;
    }
    this.controls.update(); //update camera view
};

BouncingBalls.prototype.createRenderer = function(){
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize( window.innerWidth, window.innerHeight );
    this.renderer.setClearColor( 0xededed);
    this.renderer.shadowMapEnabled = true;
    this.renderer.shadowMapType = THREE.PCFSoftShadowMap;
    this.renderer.shadowMapSoft = true;
    document.body.appendChild( this.renderer.domElement );
    window.addEventListener('resize', this.onWindowResize, false);

    this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement); //rotate camera with the mouse
    this.controls.enablePan = false; //disable pan because it causes bugs
};

BouncingBalls.prototype.createBoxes = function(){
    this.spheres = [];
    var materials = [];
    var spherePosY = 250;
    var spherePosZ = 0;

    var geometry = new THREE.SphereGeometry( 40, 32, 32 );
    materials[1] = new THREE.MeshBasicMaterial( {color: 0x669BF2, shading: THREE.SmoothShading} );
    materials[2] = new THREE.MeshBasicMaterial( {color: 0xEA4335, shading: THREE.SmoothShading} );
    materials[3] = new THREE.MeshBasicMaterial( {color: 0xFBBC05, shading: THREE.SmoothShading} );
    materials[4] = new THREE.MeshBasicMaterial( {color: 0x34A853, shading: THREE.SmoothShading} );

    for(var i=1;i<=4;i++){
        this.spheres[i] = new THREE.Mesh(geometry, materials[i]);
        this.spheres[i].position.y = spherePosY;
        this.spheres[i].position.z = spherePosZ;
        this.spheres[i].castShadow = true;
        this.spheres[i].receiveShadow = true;
        this.scene.add(this.spheres[i]);
        spherePosY+= 50;
        spherePosZ+= -120;
    }
};

BouncingBalls.prototype.createFloor = function(){
    var geometry2 = new THREE.PlaneBufferGeometry( 1000, 1000);
    var material2 = new THREE.MeshBasicMaterial( { color: 0xededed } );
    var floor = new THREE.Mesh( geometry2, material2 );
    floor.material.side = THREE.DoubleSide;
    floor.rotation.x = 90*Math.PI/180;
    floor.doubleSided = true;
    floor.receiveShadow = true;
    this.scene.add(floor);
};

BouncingBalls.prototype.createLights = function(){
    var shadowLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
    shadowLight.position.set( -400, 1000, 0 );
    shadowLight.target.position.set(this.scene.position);
    shadowLight.castShadow = true;
    shadowLight.shadowDarkness = 0.1;
    //shadowLight.shadowCameraVisible = true;
    this.scene.add(shadowLight);
};


BouncingBalls.prototype.animateBalls = function(){
    this.tl = new TimelineMax({repeat: -1 , repeatDelay:0});
    this.tl.to(this.spheres[1].position, 0.6, {y: 40, ease: Power2.easeIn});
    this.tl.to(this.spheres[1].position, 0.95, {y: 250, ease: Circ.easeOut});

    this.t2 = new TimelineMax({repeat: -1 , repeatDelay:0});
    this.t2.to(this.spheres[2].position, 0.75, {y: 40, ease: Power2.easeIn});
    this.t2.to(this.spheres[2].position, 0.8, {y: 300, ease: Circ.easeOut});

    this.t3 = new TimelineMax({repeat: -1 , repeatDelay:0});
    this.t3.to(this.spheres[3].position, 0.9, {y: 40, ease: Power2.easeIn});
    this.t3.to(this.spheres[3].position, 0.65, {y: 350, ease: Circ.easeOut});

    this.t4 = new TimelineMax({repeat: -1 , repeatDelay:0});
    this.t4.to(this.spheres[4].position, 1.05, {y: 40, ease: Power2.easeIn});
    this.t4.to(this.spheres[4].position, 0.50, {y: 400, ease: Circ.easeOut});
};


BouncingBalls.prototype.render = function(){
    requestAnimationFrame(this.render.bind(this));
    this.renderer.render(this.scene, that.camera);
};

BouncingBalls.prototype.onWindowResize = function(){
    that.camera.left = window.innerWidth / -2;
    that.camera.right = window.innerWidth / 2;
    that.camera.top = window.innerHeight / 2;
    that.camera.bottom = window.innerHeight / -2;
    that.camera.updateProjectionMatrix();
    that.renderer.setSize(window.innerWidth, window.innerHeight);
};

/*User interface - display or not 2D view*/
BouncingBalls.prototype.datGUI = function(){
    var Configuration = function(){
      this.view2D = false;
    };
    var config = new Configuration();

    var gui = new dat.GUI();
    gui.add(config, 'view2D').onFinishChange(function(){
        that.swap2DView(config.view2D);
    });


};

var bouncingBalls = new BouncingBalls();
bouncingBalls.init();