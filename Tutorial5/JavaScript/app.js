var canvas = document.createElement('canvas');
canvas.width = window.innerWidth - 15;
canvas.height = window.innerHeight - 45;
var GL = canvas.getContext('webgl');
var vertexShader = GL.createShader(GL.VERTEX_SHADER);
var fragmentShader = GL.createShader(GL.FRAGMENT_SHADER);
var program = GL.createProgram();
var gpuArrayBuffer = GL.createBuffer();

var finalMatrixLocation;
var visualizationMatrixLocation;
var projectionMatrixLocation;
var viewportMatrixLocation;

var vertexPosition;
var vertexIndex;
var gpuIndexBuffer = GL.createBuffer();

var anguloDeRotacao = 0;

//guarda na GPU a textura
var boxTexture = GL.createTexture();

function PrepareCanvas()
{
    GL.clearColor(0.65, 0.65, 0.65, 1.0);

    GL.clear(GL.DEPTH_BUFFER_BIT | GL.COLOR_BUFFER_BIT);

    GL.enable(GL.DEPTH_TEST);

    GL.enable(GL.CULL_FACE);

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
   vertexPosition=
    [
        //coordenadas UV
       //Frente
       /*0,0,0,0,0,
       0,1,0,0,1,
       1,1,0,1,1,
       1,0,0,1,0,
      
       //Direita
       1,0,0,0,0,
       1,1,0,1,0,
       1,1,1,1,1,
       1,0,1,0,1,
       //Trás
       1,0,1,1,0,
       1,1,1,1,1,
       0,1,1,0,1,
       0,0,1,0,0,
       //Esquerda
       0,0,1,0,1,
       0,1,1,1,1,
       0,1,0,1,0,
       0,0,0,0,0,
       //Cima
       0,1,0,0,0,
       0,1,1,0,1,
       1,1,1,1,1,
       1,1,0,1,0,
       //Baixo
       1,0,0,0,0,
       1,0,1,0,1,
       0,0,1,0,1,
       0,0,0,0,0*/

       //Desafio 5.2
       //Frente
       0,0,0,0,0.5,
       0,1,0,0,0,
       1,1,0,0.33,0,
       1,0,0,0.33,0.5,
       //Direita
       1,0,0,0.33,0.5,
       1,1,0,0.33,0,
       1,1,1,0.66,0,
       1,0,1,0.66,0.5,
       //Trás
       1,0,1,0.66,0.5,
       1,1,1,0.66,0,
       0,1,1,1,0,
       0,0,1,1,0.5,
       //Esquerda
       0,0,1,0,1,
       0,1,1,0,0.5,
       0,1,0,0.33,0.5,
       0,0,0,0.33,1,
       //Cima
       0,1,0,0.33,1,
       0,1,1,0.33,0.5,
       1,1,1,0.66,0.5,
       1,1,0,0.66,1,
       //Baixo
       1,0,0,0.66,1,
       1,0,1,0.66,0.5,
       0,0,1,1,0.5,
       0,0,0,1,1
    ];

    vertexIndex=
    [
        //Frente
        0,2,1,
        0,3,2,
        //Direita
        4,6,5,
        4,7,6,
        //Trás
        8,10,9,
        8,11,10,
        //Esquerda
        12,14,13,
        12,15,14,
        //Cima
        16,18,17,
        16,19,18,
        //Baixo
        20,22,21,
        20,23,22
    ];

    GL.bindBuffer(GL.ARRAY_BUFFER, gpuArrayBuffer);

    GL.bufferData
    (
        GL.ARRAY_BUFFER,
        new Float32Array(vertexPosition),
        GL.STATIC_DRAW
    );

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, gpuIndexBuffer);
    GL.bufferData(
        GL.ELEMENT_ARRAY_BUFFER,
        new Uint16Array(vertexIndex),
        GL.STATIC_DRAW
    );

    //bind textura
    GL.bindTexture(GL.TEXTURE_2D, boxTexture);

    //GPU interpretar rastericação. Clamp à borda no eixo U
    GL.texParameteri(GL.TEXTURE_2D,GL.TEXTURE_WRAP_S, GL.CLAMP_TO_EDGE);

    //GPU interpretar rastericação. Clamp à borda no eixo V
    GL.texParameteri(GL.TEXTURE_2D,GL.TEXTURE_WRAP_T, GL.CLAMP_TO_EDGE);

    //Como escalar textura (aumentar e diminuir)
    GL.texParameteri(GL.TEXTURE_2D,GL.TEXTURE_MIN_FILTER, GL.LINEAR);
    GL.texParameteri(GL.TEXTURE_2D,GL.TEXTURE_MAG_FILTER, GL.LINEAR);     

    //Passar imagem
    GL.texImage2D(
        GL.TEXTURE_2D, //tipo textura
        0, //detalhe da imagem
        GL.RGBA, //tipo imagem
        GL.RGBA, //tipo textura a aplicar na imagem
        GL.UNSIGNED_BYTE, //tipo valor textura
        //document.getElementById("boxImage") //imagem passada para o sampler
        document.getElementById("Dado") //Desafio 5.1
        );    
}

function SendDataToShaders()
{
    var vertexPositionAttributeLocation = GL.getAttribLocation(program, "vertexPosition");
    var texCoordAttributeLocation = GL.getAttribLocation(program, "texCoords");

    GL.vertexAttribPointer(
        vertexPositionAttributeLocation,
        3,
        GL.FLOAT,
        false,
        //5 valores no conjunto
        5*Float32Array.BYTES_PER_ELEMENT,
        0*Float32Array.BYTES_PER_ELEMENT
    );

    GL.vertexAttribPointer(
        texCoordAttributeLocation,
        2,
        GL.FLOAT,
        false,
        5*Float32Array.BYTES_PER_ELEMENT,
        3*Float32Array.BYTES_PER_ELEMENT
    );

    GL.enableVertexAttribArray(vertexPositionAttributeLocation);
    GL.enableVertexAttribArray(texCoordAttributeLocation);

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

    finalMatrix = math.multiply(CriarMatrizEscala(0.25, 0.25, 0.25), finalMatrix);

    finalMatrix = math.multiply(CriarMatrizRotacaoX(anguloDeRotacao), finalMatrix);
    finalMatrix = math.multiply(CriarMatrizRotacaoY(2*anguloDeRotacao), finalMatrix);

    finalMatrix = math.multiply(CriarMatrizTranslacao(0, 0, 1.5), finalMatrix);

    var newarray = [];
    for(i=0; i< finalMatrix.length; i++)
    {
        newarray = newarray.concat(finalMatrix[i]);
    }

    var visualizationMatrix = MatrizDeVisualizacao([1,0,0],[0,1,0],[0,0,1],[0,0,0]);
    var newvisualizationMatrix = [];
    for(i=0; i<visualizationMatrix.length; i++)
    {
        newvisualizationMatrix = newvisualizationMatrix.concat(visualizationMatrix[i]);
    }

    var projectionMatrix = MatrizPerspetiva(10,4,3,0.1,100);
    var newprojectionMatrix = [];
    for(i=0; i<projectionMatrix.length; i++)
    {
        newprojectionMatrix = newprojectionMatrix.concat(projectionMatrix[i]);
    }

    var viewportMatrix = MatrizViewport(-1,1,-1,1);
    var newviewportMatrix = [];
    for(i=0; i<viewportMatrix.length; i++)
    {
        newviewportMatrix = newviewportMatrix.concat(viewportMatrix[i]);
    }

    GL.uniformMatrix4fv(finalMatrixLocation, false, newarray);
    GL.uniformMatrix4fv(visualizationMatrixLocation, false, newvisualizationMatrix);
    GL.uniformMatrix4fv(projectionMatrixLocation, false, newprojectionMatrix);
    GL.uniformMatrix4fv(viewportMatrixLocation, false, newviewportMatrix);

    GL.drawElements(
        GL.TRIANGLES,
        vertexIndex.length, //nr de elementos
        GL.UNSIGNED_SHORT, //tipo de elementos
        0 //offset para o 1º elemento
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