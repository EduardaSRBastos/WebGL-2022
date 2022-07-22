/**
*@param {float} x Valor para translação no eixo do x
*@param {float} y Valor para translação no eixo do y
*@param {float} z Valor para translação no eixo do z
*/

function CriarMatrizTranslacao(x,y,z)
{
    //matriz translação final
    return[
        [1, 0, 0, x],
        [0, 1, 0, y],
        [0, 0, 1, z],
        [0, 0, 0, 1],
    ];
}

function CriarMatrizEscala(x,y,z)
{
    //matriz escala final
    return[
        [x, 0, 0, 0],
        [0, y, 0, 0],
        [0, 0, z, 0],
        [0, 0, 0, 1]
    ];
}

/**
*@param {float} angulo Angulo em graus para rodar no eixo do x
*/
function CriarMatrizRotacaoX(angulo)
{
    //sen e cos calculados em rads, converter de graus
    var radianos = angulo * Math.PI/180;

    //matriz rotação final eixo x
    return[
        [1, 0, 0, 0],
        [0, Math.cos(radianos), -Math.sin(radianos), 0],
        [0, Math.sin(radianos), Math.cos(radianos), 0],
        [0, 0, 0, 1]
    ];
}

/**
*@param {float} angulo Angulo em graus para rodar no eixo do y
*/
function CriarMatrizRotacaoY(angulo)
{
    //sen e cos calculados em rads, converter de graus
    var radianos = angulo * Math.PI/180;

    //matriz rotação final eixo y
    return[
        [Math.cos(radianos), 0, Math.sin(radianos), 0],
        [0, 1, 0, 0],
        [-Math.sin(radianos), 0, Math.cos(radianos), 0],
        [0, 0, 0, 1]
    ];
}

/**
*@param {float} angulo Angulo em graus para rodar no eixo do z
*/
function CriarMatrizRotacaoZ(angulo)
{
    //sen e cos calculados em rads, converter de graus
    var radianos = angulo * Math.PI/180;

    //matriz rotação final eixo z
    return[
        [Math.cos(radianos), -Math.sin(radianos), 0, 0],
        [Math.sin(radianos), Math.cos(radianos), 0, 0],
        [0, 0, 1, 0],
        [0, 0, 0, 1]
    ];
}