
document.addEventListener("DOMContentLoaded", Start);

var cena = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
var renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth - 15, window.innerHeight - 15);

document.body.appendChild(renderer.domElement);

var geometria = new THREE.BoxGeometry(1,1,1);
//material recebe luz
var material = new THREE.MeshStandardMaterial({color: 0xff0000});
var cubo = new THREE.Mesh(geometria, material);

//Desafio 2
var geometria = new THREE.SphereGeometry(1, 64, 8);
var material = new THREE.MeshStandardMaterial({color: 0xffffff});
var cabeca = new THREE.Mesh(geometria, material);

var geometria = new THREE.SphereGeometry(1.5, 64, 64);
var material = new THREE.MeshStandardMaterial({color: 0xffffff});
var corpo = new THREE.Mesh(geometria, material);

var geometria = new THREE.CircleGeometry(0.1, 64);
var material = new THREE.MeshStandardMaterial({color: 0x000000});
var olhoEsq = new THREE.Mesh(geometria, material);

var geometria = new THREE.CircleGeometry(0.1, 64);
var material = new THREE.MeshStandardMaterial({color: 0x000000});
var olhoDir = new THREE.Mesh(geometria, material);

var geometria = new THREE.RingGeometry(0.2, 0.3, 64, 8, 0, Math.PI);
var material = new THREE.MeshStandardMaterial({color: 0xFF0000});
var boca = new THREE.Mesh(geometria, material);

var cuboCoordRotation;

//var cameraAndar = {x:0, y:0, z:0};

//Desafio 1
var objetoAndar = {x:0, y:0, z:0};

var velocidadeAndar = 0.05;

//guarda objeto importado
var objetoImportado;
//controlador de animações do objeto importado
var mixerAnimacao;
//controla o tempo da aplicação
var relogio = new THREE.Clock();
//objeto responsável por importar ficheiros FBX
var importer = new THREE.FBXLoader();

//função para importar objetos FBX. Localização (parametro)
importer.load("./Objetos/Samba Dancing.fbx", function (object){
    //Inicializar var tendo em conta o objeto
    mixerAnimacao = new THREE.AnimationMixer(object);

    //criar animação e inicializar
    var action = mixerAnimacao.clipAction(object.animations[0]);
    action.play();

    //Ver se filho tem mesh, e se sim, permitir projetar e receber sombras
    object.traverse(function (child){
        if(child.isMesh){
            child.castShadow = true;
            child.receiveShadow = true;
        }
    });

    //add objeto à cena
    //cena.add(object);
    cubo.add(object);

    //mudar escala do objeto
    object.scale.x = 0.01;
    object.scale.y = 0.01;
    object.scale.z = 0.01;

    //mudar posição do objeto para não colidir com o cubo
    object.position.x = 3;

    //guardar objeto
    objetoImportado = object;
});

document.addEventListener("mousemove", ev => {
    var x = (ev.clientX - 0)/(window.innerWidth - 0)*(1-(-1)) + -1;
    var y = (ev.clientY - 0)/(window.innerHeight - 0)*(1-(-1)) + -1;

    cuboCoordRotation = {x:x, y:y}
});

document.addEventListener("keydown", ev=>{
    var coords = {x:0, y:0, z:0};

    if(ev.keyCode == 87)
    coords.z -= velocidadeAndar;
    if(ev.keyCode == 83)
    coords.z += velocidadeAndar;
    if(ev.keyCode == 65)
    coords.x -= velocidadeAndar;
    if(ev.keyCode == 68)
    coords.x += velocidadeAndar;

    //cameraAndar = coords;
    //Desafio 1
    objetoAndar = coords;

    //Desafio 3
    if(ev.keyCode == 32){
        var geometria = new THREE.BoxGeometry(1,1,1);
        var material = new THREE.MeshStandardMaterial({color: (Math.random() * 0xffffff)});
        var cubo = new THREE.Mesh(geometria, material);
        cubo.position.x = THREE.Math.randInt(-15,15);
        cubo.position.y = THREE.Math.randInt(-15,15);
        cubo.position.z = THREE.Math.randInt(-15,15);
        cena.add(cubo);

    }
});

document.addEventListener("keyup", ev=>{
    var coords = {x:0, y:0, z:0};

    if(ev.keyCode == 87)
    coords.z += velocidadeAndar;
    if(ev.keyCode == 83)
    coords.z -= velocidadeAndar;
    if(ev.keyCode == 65)
    coords.x += velocidadeAndar;
    if(ev.keyCode == 68)
    coords.x -= velocidadeAndar;

    //cameraAndar = coords;
    //Desafio 1
    objetoAndar = coords;
});

function Start(){
    cena.add(cubo);

    //Desafio 2
    cabeca.position.x = -4;
    cabeca.position.y = 2;
    cena.add(cabeca);

    corpo.position.x = -4;
    corpo.position.y = 0;
    cena.add(corpo);

    olhoDir.position.x = -4
    olhoDir.position.y = 2.2;
    olhoDir.position.z = 1;
    cena.add(olhoDir);

    olhoEsq.position.x = -3.4
    olhoEsq.position.y = 2.2;
    olhoEsq.position.z = 1;
    cena.add(olhoEsq);

    boca.position.x = -3.7
    boca.position.y = 1.8;
    boca.position.z = 1;
    boca.rotation.z = Math.PI;
    cena.add(boca);

    //criar foco de luz com cor branca e intensidade 1
    var light = new THREE.SpotLight("#ffffff", 1);

    //mudar posição da luz 5un a cima da camera
    light.position.y = 5;
    light.position.z = 10;

    //luz apontar para a posição do cubo
    light.lookAt(cubo.position);

    //add luz à cena
    cena.add(light);

    camera.position.z = 10;

    requestAnimationFrame(update);
}

function update(){
    if(cuboCoordRotation != null)
    {
        cubo.rotation.x +=cuboCoordRotation.y * 0.1;
        cubo.rotation.y +=cuboCoordRotation.x * 0.1;
    }
   
    /*if(cameraAndar != null)
    {
        camera.position.x +=cameraAndar.x;
        camera.position.z +=cameraAndar.z;
    }*/

    //Desafio 1
    if(objetoAndar != null && objetoImportado != null)
    {
        objetoImportado.position.x +=objetoAndar.x;
        objetoImportado.position.z +=objetoAndar.z;
    }

    //Indica tempo que passou desde o último frame renderizado
    if(mixerAnimacao){
        mixerAnimacao.update(relogio.getDelta());
    }

    //cameraAndar = {x:0, y:0, z:0};

    //Desafio 1
    objetoAndar = {x:0, y:0, z:0};

    renderer?.render(cena, camera);

    requestAnimationFrame(update);
}