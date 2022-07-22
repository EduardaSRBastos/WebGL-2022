
document.addEventListener('DOMContentLoaded', Start);
var cena = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
var renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth -15, window.innerHeight-15);
document.body.appendChild(renderer.domElement);

var geometria = new THREE.BoxGeometry(1,1,1);
var material = new THREE.MeshStandardMaterial({color: 0xff0000});
var cubo = new THREE.Mesh(geometria, material);


var geometry = new THREE.SphereGeometry(1, 16, 8);
var Material = new THREE.MeshStandardMaterial({color: 0xffffff});
var head = new THREE.Mesh(geometry, Material);

var geometry = new THREE.SphereGeometry(1.5, 12, 8);
var Material = new THREE.MeshStandardMaterial({color: 0xffffff});
var body = new THREE.Mesh(geometry, Material);

var geometry = new THREE.CircleGeometry(0.1, 24);
var Material = new THREE.MeshStandardMaterial({color: 0x000000});
var eye1 = new THREE.Mesh(geometry, Material);

var geometry = new THREE.CircleGeometry(0.1, 24);
var Material = new THREE.MeshStandardMaterial({color: 0x000000});
var eye2 = new THREE.Mesh(geometry, Material);

var geometry = new THREE.RingGeometry(0.2, 0.35, 18, 2, 0, Math.PI);
var Material = new THREE.MeshStandardMaterial({color: 0xFF0000});
var smile = new THREE.Mesh(geometry, Material);



var cuboCoordRotation;
var camaraAndar = {x:0, y:0, z:0};
var velocidadeAndar = 0.1;

var objectoImportado;
var mixerAnimacao;
var relogio = new THREE.Clock();
var importer = new THREE.FBXLoader();

importer.load('./Objetos/Samba Dancing.fbx', function (object){
    mixerAnimacao = new THREE.AnimationMixer(object);
    var action = mixerAnimacao.clipAction(object.animations[0]);
    action.play();

    object.traverse(function (child){
        if(child.isMesh){
            child.castShadow = true;
            child.receiveShadow = true;
        }
    });
    
    cena.add(object);

    object.scale.x = 0.01;
    object.scale.y = 0.01;
    object.scale.z = 0.01;

    object.position.x = 3;

    objectoImportado = object;
})

document.addEventListener('mousemove', ev =>{
    var x = (ev.clientX - 0) / (window.innerWidth - 0) * (1 - (-1)) + 1;
    var y = (ev.clientY - 0) / (window.innerHeight - 0) * (1 - (-1)) + 1;

    cuboCoordRotation = {
        x:x,
        y:y
    }
});

document.addEventListener('keydown', ev =>{
    var coords = {
        x:0,
        y:0,
        z:0
    };
    if(ev.keyCode == 87)
        coords.z -=velocidadeAndar;
    if(ev.keyCode == 83)
        coords.z +=velocidadeAndar;
    if(ev.keyCode == 65)
        coords.x +=velocidadeAndar;
    if(ev.keyCode == 68)
        coords.x -=velocidadeAndar;

    camaraAndar = coords;
});

document.addEventListener('keyup', ev =>{
    var coords = {
        x:0,
        y:0,
        z:0
    };
    if(ev.keyCode == 87)
        coords.z +=velocidadeAndar;
    if(ev.keyCode == 83)
        coords.z -=velocidadeAndar;
    if(ev.keyCode == 65)
        coords.x +=velocidadeAndar;
    if(ev.keyCode == 68)
        coords.x -=velocidadeAndar;

    camaraAndar = coords;
});

document.addEventListener('keydown', ev =>{
    if(ev.keyCode == 32){
        var Geometria = new THREE.BoxGeometry(1,1,1);
        var Material = new THREE.MeshStandardMaterial({color: THREE.Math.randInt(0,16777215)});
        var Cubo = new THREE.Mesh(Geometria, Material);
        Cubo.position.x = THREE.Math.randInt(-10,10);
        Cubo.position.y = THREE.Math.randInt(-10,10);
        Cubo.position.z = THREE.Math.randInt(-10,9);
        cena.add(Cubo);

    }
})

function Start(){
    cena.add(cubo);

    head.position.x = -5;
    head.position.y = 2;
    cena.add(head);

    body.position.x = -5;
    body.position.y = 0;
    cena.add(body);

    eye1.position.x = -5
    eye1.position.y = 2.2;
    eye1.position.z = 0.98;
    cena.add(eye1);

    eye2.position.x = -4.2
    eye2.position.y = 2.2;
    eye2.position.z = 0.98;
    cena.add(eye2);

    smile.position.x = -4.6
    smile.position.y = 1.9;
    smile.position.z = 0.98;
    smile.rotation.z = Math.PI;
    cena.add(smile);
    
    
    

    var light = new THREE.SpotLight("#ffffff", 1);

    light.position.y = 5;
    light.position.z = 10;

    light.lookAt(cubo.position);

    cena.add(light);

    camera.position.z = 10;

    requestAnimationFrame(update);
}

function update(){
    if(cuboCoordRotation != null){
        cubo.rotation.x += cuboCoordRotation.y * 0.1;
        cubo.rotation.y += cuboCoordRotation.x * 0.1;
    }

    if(camaraAndar != null){
        cena.position.x += camaraAndar.x;
        cena.position.z += camaraAndar.z;
    }

    if(mixerAnimacao){
        mixerAnimacao.update(relogio.getDelta());
    }

    camaraAndar = {x:0, y:0, z:0};
    
    renderer.render(cena, camera);

    requestAnimationFrame(update);
}