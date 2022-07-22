var canvas = document.createElement('canvas');

//tamanho canvas
canvas.width = window.innerWidth - 15;
canvas.height = window.innerHeight - 45;

var GL = canvas.getContext('webgl');

//shader chamado por cada vértice: indica posição
var vertexShader = GL.createShader(GL.VERTEX_SHADER);

//shader chamado pelos píxeis: dá cor
var fragmentShader = GL.createShader(GL.FRAGMENT_SHADER);

//Cria programa que usará os shaders
var program = GL.createProgram();

//Cria buffer no GPU que recebe os pontos que os shaders usarão
var gpuArrayBuffer = GL.createBuffer();

function PrepareCanvas()
{
    //cor de fundo
    GL.clearColor(0.65, 0.65, 0.65, 1.0);

    //limpa buffers profundidade e cor
    GL.clear(GL.DEPTH_BUFFER_BIT | GL.COLOR_BUFFER_BIT);

    //adiciona canvas ao body
    document.body.appendChild(canvas);

    //texto embaixo
    canvas.insertAdjacentText('afterend', 'O canvas encontra-se acima deste texto!');
}

//função prepara os shaders
function PrepareShaders()
{
    //atribui código do ficheiro shaders.js ao vertexShader
    GL.shaderSource(vertexShader,codigoVertexShader);

    //atribui código do ficheiro shaders.js ao fragmentShader
    GL.shaderSource(fragmentShader,codigoFragmentShader);

    //compila shader passado por parâmetro
    GL.compileShader(vertexShader);
    GL.compileShader(fragmentShader);

    //verificar erro durante compilação
    if(!GL.getShaderParameter(vertexShader, GL.COMPILE_STATUS))
    {
        console.error("Erro: A compilação do vertex shader tem uma exceção!",
        GL.getShaderInfoLog(vertexShader));
    }
    if(!GL.getShaderParameter(fragmentShader, GL.COMPILE_STATUS))
    {
        console.error("Erro: A compilação do fragment shader tem uma exceção!",
        GL.getShaderInfoLog(fragmentShader));
    }
}

function PrepareProgram()
{
    //adicionar shaders ao programa
    GL.attachShader(program, vertexShader);
    GL.attachShader(program, fragmentShader);

    //Verificar se existe erros no programa
    GL.linkProgram(program);
    if(!GL.getProgramParameter(program, GL.LINK_STATUS))
    {
        console.error("Erro: O linkProgram tem uma exceção!", 
        GL.getProgramInfoLog(program));
    }

    GL.validateProgram(program);
    if(!GL.getProgramParameter(program, GL.VALIDATE_STATUS))
    {
        console.error("Erro: A validação tem uma exceção!", 
        GL.getProgramInfoLog(program));
    }

    GL.useProgram(program);
}

//função que cria/guarda posição xyz e cor RGB dos vértices
//copia para um buffer no GPU
function PrepareTriangleData()
{
    //cada vértice tem 6 elementos
    //área canvas vai de -1 a 1, largura e altura
    //RGB vai de 0.0 a 1.0
    var triangleArray=
    [
        //  3
        // /\
        //1---2
        // X    Y    Z    R    G    B
        -0.5, -0.5, 0.0, 1.0, 0.0, 0.0, //1
        0.5, -0.5, 0.0, 0.0, 1.0, 0.0, //2
        0.0, 0.5, 0.0, 0.0, 0.0, 1.0 //3
    ];

    GL.bindBuffer(GL.ARRAY_BUFFER, gpuArrayBuffer);

    GL.bufferData
    (
        GL.ARRAY_BUFFER,
        new Float32Array(triangleArray),
        //dados não são alterados no GPU
        GL.STATIC_DRAW
    );
}

function SendDataToShaders()
{
    var vertexPositionAttributeLocation = GL.getAttribLocation(program, "vertexPosition");
    var vertexColorAttributeLocation = GL.getAttribLocation(program, "vertexColor");

    GL.vertexAttribPointer(
        vertexPositionAttributeLocation,
        //número de elementos (xyz)
        3,
        GL.FLOAT,
        false,
        //número de elementos (xyz rgb)
        6*Float32Array.BYTES_PER_ELEMENT,
        //número de elementos ignorados no início
        0*Float32Array.BYTES_PER_ELEMENT
    );

    GL.vertexAttribPointer(
        vertexColorAttributeLocation,
        3,
        GL.FLOAT,
        false,
        6*Float32Array.BYTES_PER_ELEMENT,
        3*Float32Array.BYTES_PER_ELEMENT
    );

    GL.enableVertexAttribArray(vertexPositionAttributeLocation);
    GL.enableVertexAttribArray(vertexColorAttributeLocation);

    GL.useProgram(program);

    GL.drawArrays(
        GL.TRIANGLES,
        0,
        3
    );
}

//função chamada quando página web é carregada
function Start()
{
    PrepareCanvas();
    PrepareShaders();
    PrepareProgram();
    PrepareTriangleData();
    SendDataToShaders();
}