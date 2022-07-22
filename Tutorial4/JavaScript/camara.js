/**
 * Função que devolve a matriz de visualização
 * @param {float[3]} rightVector Array direita da câmera
 * @param {float[3]} upVector Array cima da câmera
 * @param {float[3]} forwardVector Array frente da câmera
 * @param {float[3]} centerPoint Array posição da câmera (coordenadas)
 */

function MatrizDeVisualizacao(rightVector, upVector, forwardVector, centerPoint)
{
    return[
        [rightVector[0], rightVector[1], rightVector[2], -math.multiply(rightVector, centerPoint)],
        [upVector[0], upVector[1], upVector[2], -math.multiply(upVector, centerPoint)],
        [forwardVector[0], forwardVector[1], forwardVector[2], -math.multiply(forwardVector, centerPoint)],
        [0, 0, 0, 1]
    ];
}

/**
 * Função que devolve a matriz de projeção ortográfica
 * @param {float} width Comprimento da câmera
 * @param {float} height Altura da câmera
 * @param {float} nearPlane Plano corte anterior da câmera
 * @param {float} farPlane Plano corte posterior da câmera
 */

 function MatrizOrtografica(width, height, nearPlane, farPlane)
 {
     var matrizOrtografica = [
         [1/width, 0, 0, 0],
         [0, 1/height, 0, 0],
         [0, 0, 1/((farPlane/2) - nearPlane), -nearPlane/((farPlane/2) - nearPlane)],
         [0, 0, 0, 1]
     ];

     return math.multiply(matrizOrtografica, CriarMatrizTranslacao(0,0,-(nearPlane + farPlane / 2)));
 }

/**
 * Função que devolve a matriz de projeção em perspetiva
 * @param {float} distance Distância do centro da imagem
 * @param {float} width Comprimento da câmera
 * @param {float} height Altura da câmera
 * @param {float} nearPlane Plano corte anterior da câmera
 * @param {float} farPlane Plano corte posterior da câmera
 */

 function MatrizPerspetiva(distance, width, height, nearPlane, farPlane)
 {
     return [
         [distance/width, 0, 0, 0],
         [0, distance/height, 0, 0],
         [0, 0, farPlane/(farPlane - nearPlane), -nearPlane*farPlane/(farPlane - nearPlane)],
         [0, 0, 1, 0]
     ];
 }

 /**
 * Função que devolve a matriz de Viewport
 * @param {float} minX Mínimo eixo x
 * @param {float} maxX Máximo eixo x
 * @param {float} minY Mínimo eixo y
 * @param {float} maxY Máximo eixo y
 */

  function MatrizViewport(minX,maxX,minY,maxY)
  {
      return [
          [(maxX - minX)/2, 0, 0, (maxX + minX)/2],
          [0, (maxY - minY)/2, 0, (maxY + minY)/2],
          [0, 0, 1, 0],
          [0, 0, 0, 1]
      ];
  }