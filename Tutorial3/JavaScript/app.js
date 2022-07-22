var canvas = document.createElement('canvas');
canvas.width = window.innerWidth - 15;
canvas.height = window.innerHeight - 45;
var GL = canvas.getContext('webgl');
var vertexShader = GL.createShader(GL.VERTEX_SHADER);
var fragmentShader = GL.createShader(GL.FRAGMENT_SHADER);
var program = GL.createProgram();
var gpuArrayBuffer = GL.createBuffer();

//localização da variável das matrizes
var finalMatrixLocation;
var visualizationMatrixLocation;
var projectionMatrixLocation;
var viewportMatrixLocation;

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

    finalMatrixLocation = GL.getUniformLocation(program, 'transformationMatrix');
    visualizationMatrixLocation = GL.getUniformLocation(program, 'visualizationMatrix');
    projectionMatrixLocation = GL.getUniformLocation(program, 'projectionMatrix');
    viewportMatrixLocation = GL.getUniformLocation(program, 'viewportMatrix');
}

function loop()
{
    canvas.width = window.innerWidth - 15;
    canvas.height = window.innerHeight - 45;
    GL.viewport(0,0,canvas.width,canvas.height);

    GL.useProgram(program);

    GL.clearColor(0.65, 0.65, 0.65, 1.0);
    GL.clear(GL.DEPTH_BUFFER_BIT | GL.COLOR_BUFFER_BIT);

    var finalMatrix =[
        [1,0,0,0],
        [0,1,0,0],
        [0,0,1,0],
        [0,0,0,1]
    ];

    finalMatrix = math.multiply(CriarMatrizTranslacao(0.5, 0.5, 0), finalMatrix);

    finalMatrix = math.multiply(CriarMatrizEscala(0.25, 0.25, 0.25), finalMatrix);

    finalMatrix = math.multiply(CriarMatrizEscala(3, 3, 3), finalMatrix); //4.1 Desafios

    finalMatrix = math.multiply(CriarMatrizRotacaoY(anguloDeRotacao), finalMatrix);

    finalMatrix = math.multiply(CriarMatrizRotacaoX(anguloDeRotacao), finalMatrix); //4.3 Desafios

    finalMatrix = math.multiply(CriarMatrizTranslacao(0, 0, 1), finalMatrix);

    finalMatrix = math.multiply(CriarMatrizTranslacao(-0.14, -0.3, 0), finalMatrix); //4.2 Desafios

    var newarray = [];
    for(i=0; i< finalMatrix.length; i++)
    {
        newarray = newarray.concat(finalMatrix[i]);
    }

    //matriz Visualização em (0,0,0)
    var visualizationMatrix = MatrizDeVisualizacao([1,0,0],[0,1,0],[0,0,1],[0,0,0]);
    var newvisualizationMatrix = [];
    for(i=0; i<visualizationMatrix.length; i++)
    {
        newvisualizationMatrix = newvisualizationMatrix.concat(visualizationMatrix[i]);
    }

    //Matriz Perspetiva com distancia=10, comprimento 4, altura 3, plano anterior 0.1 e posterior 100
    var projectionMatrix = MatrizPerspetiva(10,4,3,0.1,100);
    var newprojectionMatrix = [];
    for(i=0; i<projectionMatrix.length; i++)
    {
        newprojectionMatrix = newprojectionMatrix.concat(projectionMatrix[i]);
    }

    //Matriz Viewport com volume canónico de -1 a 1
    var viewportMatrix = MatrizViewport(-1,1,-1,1);
    var newviewportMatrix = [];
    for(i=0; i<viewportMatrix.length; i++)
    {
        newviewportMatrix = newviewportMatrix.concat(viewportMatrix[i]);
    }

    //matrizes para vertexShader
    GL.uniformMatrix4fv(finalMatrixLocation, false, newarray);
    GL.uniformMatrix4fv(visualizationMatrixLocation, false, newvisualizationMatrix);
    GL.uniformMatrix4fv(projectionMatrixLocation, false, newprojectionMatrix);
    GL.uniformMatrix4fv(viewportMatrixLocation, false, newviewportMatrix);

    GL.drawArrays(
        GL.TRIANGLES,
        0,
        3
    );

    anguloDeRotacao +=1;

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