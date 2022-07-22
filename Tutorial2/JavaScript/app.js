var canvas = document.createElement('canvas');
canvas.width = window.innerWidth - 15;
canvas.height = window.innerHeight - 45;
var GL = canvas.getContext('webgl');
var vertexShader = GL.createShader(GL.VERTEX_SHADER);
var fragmentShader = GL.createShader(GL.FRAGMENT_SHADER);
var program = GL.createProgram();
var gpuArrayBuffer = GL.createBuffer();

//localização de transformationMatrix
var finalMatrixLocation;

//rotação aplicada ao objeto
var anguloDeRotacao = 0;

function PrepareCanvas()
{
    
    GL.clearColor(0.65, 0.65, 0.65, 1.0);

    
    GL.clear(GL.DEPTH_BUFFER_BIT | GL.COLOR_BUFFER_BIT);

    
    document.body.appendChild(canvas);

 
    canvas.insertAdjacentText('afterend', 'O canvas encontra-se acima deste texto!');
}


function PrepareShaders()
{
   
    GL.shaderSource(vertexShader,codigoVertexShader);

   
    GL.shaderSource(fragmentShader,codigoFragmentShader);

    
    GL.compileShader(vertexShader);
    GL.compileShader(fragmentShader);

    
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
    
    GL.attachShader(program, vertexShader);
    GL.attachShader(program, fragmentShader);

  
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


function PrepareTriangleData()
{
    
    var triangleArray=
    [
        -0.5, -0.5, 0.0, 1.0, 0.0, 0.0, 
        0.5, -0.5, 0.0, 0.0, 1.0, 0.0, 
        0.0, 0.5, 0.0, 0.0, 0.0, 1.0 
    ];

    GL.bindBuffer(GL.ARRAY_BUFFER, gpuArrayBuffer);

    GL.bufferData
    (
        GL.ARRAY_BUFFER,
        new Float32Array(triangleArray),
        GL.STATIC_DRAW
    );
}

function SendDataToShaders()
{
    var vertexPositionAttributeLocation = GL.getAttribLocation(program, "vertexPosition");
    var vertexColorAttributeLocation = GL.getAttribLocation(program, "vertexColor");

    GL.vertexAttribPointer(
        vertexPositionAttributeLocation,
        3,
        GL.FLOAT,
        false,
        6*Float32Array.BYTES_PER_ELEMENT,
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

    //localização de transformationMatrix
    finalMatrixLocation = GL.getUniformLocation(program, 'transformationMatrix');
}

function loop()
{
    //ajusta tamanho do canvas ao da página web
    canvas.width = window.innerWidth - 15;
    canvas.height = window.innerHeight - 45;
    GL.viewport(0,0,canvas.width,canvas.height);

    GL.useProgram(program);

    //limpar buffers de profundidade e cor a cada frame
    GL.clearColor(0.65, 0.65, 0.65, 1.0);
    GL.clear(GL.DEPTH_BUFFER_BIT | GL.COLOR_BUFFER_BIT);

    //combinação de matrizes para o vertexShader
    var finalMatrix =[
        [1,0,0,0],
        [0,1,0,0],
        [0,0,1,0],
        [0,0,0,1]
    ];

    //multiplicação matriz translação com matriz final
    //translação de 0.5 no eixo x e y
    finalMatrix = math.multiply(CriarMatrizTranslacao(0.5, 0.5, 0), finalMatrix);

    //multiplicação matriz escala com matriz final
    //escala de 0.25 no eixo x, y e z
    finalMatrix = math.multiply(CriarMatrizEscala(0.25, 0.25, 0.25), finalMatrix);

    //multiplicação matriz rotação eixo z com matriz final
    //rotação anguloDeRotação no eixo y
    finalMatrix = math.multiply(CriarMatrizRotacaoY(anguloDeRotacao), finalMatrix);

    //finalMatrix = math.multiply(CriarMatrizTranslacao(0.5, 0.5, 0), finalMatrix);

    //2D para 1D
    var newarray = [];
    for(i=0; i< finalMatrix.length; i++)
    {
        newarray = newarray.concat(finalMatrix[i]);
    }

    //enviar para o vertexShader
    GL.uniformMatrix4fv(finalMatrixLocation, false, newarray);

    //desenhar os triângulos
    GL.drawArrays(
        GL.TRIANGLES,
        0,
        3
    );

    //atualizar ângulo de rotação a cada frame
    anguloDeRotacao +=1;

    //chamar função loop para próximo frame
    requestAnimationFrame(loop);

}


function Start()
{
    PrepareCanvas();
    PrepareShaders();
    PrepareProgram();
    PrepareTriangleData();
    SendDataToShaders();

    loop();
}