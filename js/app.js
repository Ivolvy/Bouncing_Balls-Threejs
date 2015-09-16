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

    //Display the axes - usefull for place the elements
    var axes = buildAxes(1000);
    this.scene.add(axes);

    function buildAxes(length) {
        var axes = new THREE.Object3D();

        axes.add(buildAxis(new THREE.Vector3(0, 0, 0), new THREE.Vector3(length, 0, 0), 0xFF0000, false)); // +X
        axes.add(buildAxis(new THREE.Vector3(0, 0, 0), new THREE.Vector3(-length, 0, 0), 0xFF0000, true)); // -X
        axes.add(buildAxis(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, length, 0), 0x00FF00, false)); // +Y
        axes.add(buildAxis(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, -length, 0), 0x00FF00, true)); // -Y
        axes.add(buildAxis(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, length), 0x0000FF, false)); // +Z
        axes.add(buildAxis(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, -length), 0x0000FF, true)); // -Z

        return axes;

    }

    function buildAxis(src, dst, colorHex, dashed) {
        var geom = new THREE.Geometry(),
            mat;

        if (dashed) {
            mat = new THREE.LineDashedMaterial({linewidth: 3, color: colorHex, dashSize: 3, gapSize: 3});
        } else {
            mat = new THREE.LineBasicMaterial({linewidth: 3, color: colorHex});
        }

        geom.vertices.push(src.clone());
        geom.vertices.push(dst.clone());
        geom.computeLineDistances(); // This one is SUPER important, otherwise dashed lines will appear as simple plain lines

        var axis = new THREE.Line(geom, mat, THREE.LinePieces);

        return axis;

    }
};

BouncingBalls.prototype.createCamera = function(){
    this.camera = new THREE.OrthographicCamera( window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, -1000, 1000 );
    this.camera.position.x = 100;
    this.camera.position.y = 100;
    this.camera.position.z = 100;

    this.camera.lookAt(new THREE.Vector3(0,0,0));
    this.camera.zoom = 1;
    this.camera.updateProjectionMatrix();

};

BouncingBalls.prototype.createRenderer = function(){
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize( window.innerWidth, window.innerHeight );
    this.renderer.setClearColor( 0xf2f2f2);
    this.renderer.shadowMapEnabled = true;
    this.renderer.shadowMapType = THREE.PCFSoftShadowMap;
    this.renderer.shadowMapSoft = true;
    document.body.appendChild( this.renderer.domElement );
    window.addEventListener('resize', this.onWindowResize, false);
};

BouncingBalls.prototype.createBoxes = function(){


   // var geometry = new THREE.BoxGeometry( 50, 50, 50 );
   // var material = new THREE.MeshLambertMaterial( { color: 0xf2f2f2, shading: THREE.FlatShading});

    var geometry = new THREE.SphereGeometry( 40, 32, 32 );
    var material = new THREE.MeshBasicMaterial( {color: 0x5d5d5d} );
    this.sphere = new THREE.Mesh( geometry, material );
    this.sphere.position.y = 300;
    this.scene.add(this.sphere);

    this.sphere2 = new THREE.Mesh( geometry, material );
    this.sphere2.position.y = 350;
    this.sphere2.position.z = -120;
    this.scene.add(this.sphere2);

    this.sphere3 = new THREE.Mesh( geometry, material );
    this.sphere3.position.y = 400;
    this.sphere3.position.z = -240;
    this.scene.add(this.sphere3);

};

BouncingBalls.prototype.createFloor = function(){
    var geometry2 = new THREE.PlaneBufferGeometry( 1000, 1000);
    var material2 = new THREE.MeshBasicMaterial( { color: 0xf2f2f2 } );
    var floor = new THREE.Mesh( geometry2, material2 );
    floor.material.side = THREE.DoubleSide;
    floor.rotation.x = 90*Math.PI/180;
    floor.doubleSided = true;
    floor.receiveShadow = true;
    this.scene.add(floor);
};

BouncingBalls.prototype.createLights = function(){
    this.scene.add(new THREE.AmbientLight(0x5b5b5b));

    var shadowLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
    shadowLight.position.set( -1000, 1000, 0 );
    shadowLight.target.position.set(this.scene.position);
    shadowLight.castShadow = true;
    shadowLight.shadowDarkness = 0.1;
    //shadowLight.shadowCameraVisible = true;
    this.scene.add(shadowLight);

    var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
    directionalLight.position.set( -1000, 1000, 0 );
    directionalLight.target.position.set(this.scene.position);
    this.scene.add( directionalLight );
};



BouncingBalls.prototype.animateBalls = function(){
    this.tl = new TimelineMax({repeat: -1 , repeatDelay:0});
    this.tl.to(this.sphere.position, 0.6, {y: 40, ease: Power2.easeIn});
    this.tl.to(this.sphere.position, 1, {y: 400, ease: Power2.easeOut});

    this.t2 = new TimelineMax({repeat: -1 , repeatDelay:0});
    this.t2.to(this.sphere2.position, 0.8, {y: 40, ease: Power2.easeIn});
    this.t2.to(this.sphere2.position, 1, {y: 400, ease: Power2.easeOut});

    this.t3 = new TimelineMax({repeat: -1 , repeatDelay:0});
    this.t3.to(this.sphere3.position, 1, {y: 40, ease: Power2.easeIn});
    this.t3.to(this.sphere3.position, 1, {y: 400, ease: Power2.easeOut})
};


BouncingBalls.prototype.render = function(){
    requestAnimationFrame(this.render.bind(this));
    this.renderer.render(this.scene, this.camera);
};

BouncingBalls.prototype.onWindowResize = function(){
    that.camera.left = window.innerWidth / -2;
    that.camera.right = window.innerWidth / 2;
    that.camera.top = window.innerHeight / 2;
    that.camera.bottom = window.innerHeight / -2;

    that.renderer.setSize(window.innerWidth, window.innerHeight);
};

var bouncingBalls = new BouncingBalls();
bouncingBalls.init();



