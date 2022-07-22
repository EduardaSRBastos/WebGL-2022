var codigoVertexShader =
[
    //indica precisão do tipo float
    'precision mediump float;'
    ,
    //variável read only tipo vec3 indica posição do vértice
    'attribute vec3 vertexPosition;',

    //variável read only tipo vec3 indica cor do vértice
    'attribute vec3 vertexColor;',
    ,
    //variável de interface entre vertex shader e fragment shader
    'varying vec3 fragColor;',
    ,
    'void main(){',

    //fragment shader= cor do vértice
    'fragColor = vertexColor;',

    //gl_Position variável do Shader com posição do vértice, tipo vec4
    //vertexPosition tipo vec3 (1.0)
    'gl_Position = vec4(vertexPosition, 1.0);',
    '}'
].join('\n');

var codigoFragmentShader = [
    //indica precisão do tipo float
    'precision mediump float;'
    ,
    //variável de interface entre vertex shader e fragment shader
    'varying vec3 fragColor;',
    ,
    'void main(){',
    //gl_FragColor variável do Shader com cor do vértice, tipo vec4
    //fragColor tipo vec3 (1.0)
    '   gl_FragColor = vec4(fragColor, 1.0);',
    '}'
].join('\n');