import React, { useState, useEffect } from 'react';
import { Animated } from 'react-native';

import { Small, Original } from './styles';

// Cria um componente que permite ser animado
const OriginalAnimated = Animated.createAnimatedComponent(Original);

export default function LazyImage({ smallSource, source, aspectRatio, shouldLoad }) {
  const opacity = new Animated.Value(0);
  const [loaded, setloaded] = useState(false);

  useEffect(() => {
    // Somente executar o setLoad se o shouldLoad for true
    if (shouldLoad) {
      setloaded(true);
    }
  }, [shouldLoad]); // Toda vez que essa variavel disparar de true para false ou de false para true a função vai disparar

  function handleAnimate() {
    Animated.timing(opacity, { // Pega a variavel opacity que inicia em zero
      toValue: 1, // Eleva até 1 que e igual 100%
      duration: 500, // Em um tempo de 0.5 segundos
      useNativeDriver: true,
    }).start(); // Para iniciar a animação
  }

  return (
    <Small
      resizeMode="contain"
      source={smallSource}
      ratio={aspectRatio}
      blurRadius={2}
    >
      {loaded &&
        <OriginalAnimated
          style={{ opacity }}
          source={source}
          ratio={aspectRatio}
          resizeMode="contain"
          onLoadEnd={handleAnimate} // Quando a imagem terminar de ser carregada chama uma function
        />
      }
    </Small>
  );
}
