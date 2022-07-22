//Chama a função start quando acaba de carregar o conteúdo
document.addEventListener("DOMContentLoaded", Start);

//Criar cena, camera e render.
var cena = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
var renderer = new THREE.WebGLRenderer();

//tamanho janela
renderer.setSize(window.innerWidth - 15, window.innerHeight - 15);

//add render ao body do documento
document.body.appendChild(renderer.domElement);

//cria cubo com comprimento, altura e profundidade
var geometria = new THREE.BoxGeometry(1,1,1);

//criar material, cor vermelha em hex
var material = new THREE.MeshBasicMaterial({color: 0xff0000});

//criar mesh
var cubo = new THREE.Mesh(geometria, material);

//guarda rotação aplicada ao cubo
var cuboCoordRotation;

//guarda direção
var cameraAndar = {x:0, y:0, z:0};

//velocidade movimentação
var velocidadeAndar = 0.05;

//evento quando rato mexe
document.addEventListener("mousemove", ev => {
    //o rato está a 0, e é necessário converter de -1 a 1
    var x = (ev.clientX - 0)/(window.innerWidth - 0)*(1-(-1)) + -1;
    var y = (ev.clientY - 0)/(window.innerHeight - 0)*(1-(-1)) + -1;

    //rotação a aplicar a cuboCoordRotation
    cuboCoordRotation = {x:x, y:y}
});

//evento quando tecla é pressionada
document.addEventListener("keydown", ev=>{
    var coords = {x:0, y:0, z:0};

    //tecla W
    if(ev.keyCode == 87)
    coords.z -= velocidadeAndar;
    //tecla S
    if(ev.keyCode == 83)
    coords.z += velocidadeAndar;
    //tecla A
    if(ev.keyCode == 65)
    coords.x -= velocidadeAndar;
    //tecla D
    if(ev.keyCode == 68)
    coords.x += velocidadeAndar;

    cameraAndar = coords;
});

//tecla deixa de ser premida
document.addEventListener("keyup", ev=>{
    var coords = {x:0, y:0, z:0};

    //tecla W
    if(ev.keyCode == 87)
    coords.z += velocidadeAndar;
    //tecla S
    if(ev.keyCode == 83)
    coords.z -= velocidadeAndar;
    //tecla A
    if(ev.keyCode == 65)
    coords.x += velocidadeAndar;
    //tecla D
    if(ev.keyCode == 68)
    coords.x -= velocidadeAndar;

    cameraAndar = coords;
});

function Start(){
    //add cubo à cena
    cena.add(cubo);

    //camera a 6 unidades no eixo Z a partir do centro do mundo
    camera.position.z = 6;

    //criar animação
    requestAnimationFrame(update);
}

//função para criar animações
function update(){
    //muda rotação do cubo no eixo com a posição do rato
    if(cuboCoordRotation != null)
    {
        cubo.rotation.x +=cuboCoordRotation.y * 0.1;
        cubo.rotation.y +=cuboCoordRotation.x * 0.1;
    }
   
    //muda posição camera com teclas
    if(cameraAndar != null)
    {
        camera.position.x +=cameraAndar.x;
        camera.position.z +=cameraAndar.z;
    }

    //reiniciar var
    cameraAndar = {x:0, y:0,z:0};

    //renderizar cena
    renderer.render(cena, camera);

    requestAnimationFrame(update);
}