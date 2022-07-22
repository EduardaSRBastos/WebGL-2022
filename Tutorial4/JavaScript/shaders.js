var codigoVertexShader =
[
    'precision mediump float;'
    ,
    'attribute vec3 vertexPosition;',
    'attribute vec3 vertexColor;',
    ,
    'varying vec3 fragColor;',
    ,
    'uniform mat4 transformationMatrix;',
    'uniform mat4 visualizationMatrix;', //visualização
    'uniform mat4 projectionMatrix;', //projeção
    'uniform mat4 viewportMatrix;' //viewport
    ,
    'void main(){',
    'fragColor = vertexColor;',
    //multiplar as matrizes
    'gl_Position = vec4(vertexPosition, 1.0)*transformationMatrix*visualizationMatrix*projectionMatrix*viewportMatrix;',
    '}'
].join('\n');

var codigoFragmentShader = [
   
    'precision mediump float;'
    ,
   
    'varying vec3 fragColor;',
    ,
    'void main(){',
   
    '   gl_FragColor = vec4(fragColor, 1.0);',
    '}'
].join('\n');