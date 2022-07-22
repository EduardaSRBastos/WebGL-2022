var codigoVertexShader =
[
    'precision mediump float;'
    ,
    'attribute vec3 vertexPosition;',
    //coordenadas UV
    'attribute vec2 texCoords;',
    ,
    'varying vec2 fragTexCoords;',
    ,
    'uniform mat4 transformationMatrix;',
    'uniform mat4 visualizationMatrix;', //visualização
    'uniform mat4 projectionMatrix;', //projeção
    'uniform mat4 viewportMatrix;' //viewport
    ,
    'void main(){',
    'fragTexCoords = texCoords;',
    'gl_Position = vec4(vertexPosition, 1.0)*transformationMatrix*visualizationMatrix*projectionMatrix*viewportMatrix;',
    '}'
].join('\n');

var codigoFragmentShader = [
   
    'precision mediump float;'
    ,
   
    'varying vec2 fragTexCoords;',
    ,
    //guarda textura
    'uniform sampler2D sampler;',
    'void main(){',
   //cor de cada pixel e usar textura
    '   gl_FragColor = texture2D(sampler, fragTexCoords);',
    '}'
].join('\n');