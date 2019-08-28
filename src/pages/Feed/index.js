/* eslint-disable react-hooks/exhaustive-deps */
// useCallback => Memoriza uma função para não ter que ser recriada novamente
import React, { useState, useEffect, useCallback } from 'react';
import { View, FlatList } from 'react-native';

import LazyImage from '../../components/LazyImage';

import { Post, Header, Avatar, Name, Description, Loading } from './styles';

export default function Feed() {
  const [feed, setFeed] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [viewable, setViewable] = useState([]);

  async function loadPage(pageNumber = page, shouldRefresh = false) {
    // Verifca primeiro se tem algo diferente de zero
    // Se o numero de paginas for maior que o numero total para a execução
    if (total && pageNumber > total) {
      return;
    }

    setLoading(true);

    const response = await fetch(`http://localhost:3000/feed?_expand=author&_limit=5&_page=${pageNumber}`);

    const data = await response.json();
    const totalItems = response.headers.get('X-Total-Count'); // Retorna o numero total de item em uma chamada

    // Calcula o número total de páginas dentro da aplicação
    setTotal(Math.floor(totalItems / 5)); // Arrendonda pra cima caso tenha uma pagina e meia por exemplo
    // Incrementa os dados que já existiam com os novos dados do data
    // shouldRefresh => quando true deve descartar toda a lista já carregada
    setFeed(shouldRefresh ? data : [...feed, ...data]);
    // Incrementa mais uma página
    setPage(pageNumber + 1);
    setLoading(false);
  }

  useEffect(() => {
    loadPage();
  }, []);

  async function refreshList() {
    setRefreshing(true);

    await loadPage(1, true);

    setRefreshing(false);
  }

  // Toda vez que uma variavel do useState muda a função e recriada
  // Se a função for utilizada no formato classico acima o FlatList vai reclamar, pois ele não aceita uma funcão que e recriada por isso esse novo formato de função utilizando o useCallback
  const handleViewableChanged = useCallback(({ changed }) => {
    // Retorna apenas o ID dos items que mudaram, ou seja que ficaram visiveis que antes não estavam
    setViewable(changed.map(({ item }) => item.id));
  }, []);

  return (
    <View>
      <FlatList
        data={feed}
        onEndReached={() => loadPage()} // Executada quando o usuário chegar no final da lista
        onEndReachedThreshold={0.1} // Numero de 0 a 1, porcentagem antes da lista acabar
        ListFooterComponent={loading && <Loading />} // Component renderizado no final da lista
        onRefresh={refreshList}
        refreshing={refreshing} // Um informação booleana que indica quando esta acontecendo a ação de refresh na lista
        onViewableItemsChanged={handleViewableChanged} // Função que e disparada quando os items mudarem
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 20 }} // So carrega quando mostrar 10% da imagem
        keyExtractor={post => String(post.id)}
        renderItem={({ item }) => (
          <Post>
            <Header>
              <Avatar source={{ uri: item.author.avatar }} />
              <Name>{item.author.name}</Name>
            </Header>

            <LazyImage
              // Verfica se o array de viewable ele tem o ID do renderItem
              // Se tiver o ID ele vai forçar o carregamento da imagem
              shouldLoad={viewable.includes(item.id)}
              aspectRatio={item.aspectRatio}
              smallSource={{ uri: item.small }}
              source={{ uri: item.image }}
            />

            <Description>
              <Name>{item.author.name}</Name> {item.description}
            </Description>
          </Post>
        )}
      />
    </View>
  );
}
