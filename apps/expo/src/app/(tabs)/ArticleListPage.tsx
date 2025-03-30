import React from "react";
import {
  View,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useNavigation, RouteProp, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { ArticleComponent } from "../../components/Ui/ArticleComponent";
import CategoryHeaderComponent from "../../components/Ui/CategoryHeaderComponent";
import { gql, useQuery } from '@apollo/client'

type RootStackParamList = {
  NewsList: {
    searchText: string;
  };
  NewsPage: {
    title: string;
    imageUrl: string;
    id: string;
  };
};

type NewsListNavigationProp = StackNavigationProp<
  RootStackParamList,
  "NewsList"
>;

type NewsItem = {
  id: string;
  title: string;
  imageUrl: string;
  newsText: string;
  originalLink: string;
  categories: string[];
  createdAt: Date;
};

type NewsListRouteProp = RouteProp<RootStackParamList, "NewsList">;

const NEWS_QUERY = gql`
  query Articles($page: Int, $pageSize: Int) {
    articles(page: $page, pageSize: $pageSize) {
      articles {
        id
        categories
        image
        title
        iso_date
      }
      page
      pageSize
      total
    }
  }
`;

const ArticleListPage: React.FC = () => {
  const navigation = useNavigation<NewsListNavigationProp>();

  const [page, setPage] = React.useState(1);
  const [articles, setArticles] = React.useState<NewsItem[]>([]);

  const { loading, error, data, fetchMore } = useQuery(NEWS_QUERY, {
    variables: { page, pageSize: 10 },
    notifyOnNetworkStatusChange: true,
    onCompleted: (data) => {
      if (data?.articles?.articles) {
        setArticles((prevArticles) => [...prevArticles, ...data.articles.articles]);
      }
    },
  });

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setPage(1);
    setArticles([]);
    fetchMore({
      variables: { page: 1, pageSize: 10 },
    }).finally(() => setRefreshing(false));
  }, [fetchMore]);

  const onEndReached = React.useCallback(() => {
    if (!loading && data?.articles?.articles.length) {
      setPage((prevPage) => prevPage + 1);
      fetchMore({
        variables: { page: page + 1, pageSize: 10 },
      });
    }
  }, [loading, data, fetchMore, page]);

  const renderNewsItem = ({ item }: { item: any }) => (
    <ArticleComponent
      item={item}
      onPress={() =>
        navigation.navigate("NewsPage", {
          title: item.title,
          imageUrl: item.image,
          id: item.id,
        })
      }
    />
  );

  return (
    <View style={styles.container}>
      <CategoryHeaderComponent />

      <FlatList
        data={articles}
        keyExtractor={(item) => item.id}
        renderItem={renderNewsItem}
        refreshing={refreshing}
        onRefresh={onRefresh}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.5}
        ListFooterComponent={loading ? <ActivityIndicator size="large" color="#ffffff" /> : null}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.9)",
  },
});

export default ArticleListPage;
