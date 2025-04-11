import React, { useState, useEffect, useCallback, useRef } from "react";
import { View, FlatList, StyleSheet, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { gql, useQuery } from "@apollo/client";

import { ArticleComponent } from "../../components/Ui/ArticleComponent";
import CategoryHeaderComponent from "../../components/Ui/CategoryHeaderComponent";

type RootStackParamList = {
  NewsList: { searchText: string };
  NewsPage: { title: string; imageUrl: string; id: string };
};

type NewsListNavigationProp = StackNavigationProp<RootStackParamList, "NewsList">;

export type NewsItem = {
  id: string;
  title: string;
  image: string;
  iso_date: string;
  categories: string[];
  createdAt: Date;
};

const NEWS_QUERY = gql`
  query Articles($page: Int, $pageSize: Int, $categories: [String!]) {
    articles(page: $page, pageSize: $pageSize, version: 2, categories: $categories) {
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

const CATEGORIES_QUERY = gql`
  query CategoriesValues($label: String) {
    categories(label: $label) {
      values
    }
  }
`;

const ArticleListPage: React.FC = () => {
  const navigation = useNavigation<NewsListNavigationProp>();

  const flatListRef = useRef<FlatList<NewsItem>>(null);

  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [categoryFilters, setCategoryFilters] = useState<string[]>([]);
  const [page, setPage] = useState(1);

  const {
    loading: loadingArticles,
    data,
    fetchMore,
    refetch,
  } = useQuery(NEWS_QUERY, {
    variables: { page: 1, pageSize: 10, categories: categoryFilters },
    notifyOnNetworkStatusChange: true,
  });

  const { data: categoriesData } = useQuery(CATEGORIES_QUERY, {
    variables: { label: activeCategory },
    skip: !activeCategory,
  });

  useEffect(() => {
    if (
      categoriesData &&
      categoriesData.categories &&
      categoriesData.categories.length > 0
    ) {
      setCategoryFilters(categoriesData.categories[0].values);
    } else {
      setCategoryFilters([]);
    }
  }, [categoriesData]);

  useEffect(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToOffset({ offset: 0, animated: true });
    }
    setPage(1);
    refetch({ page: 1, pageSize: 10, categories: categoryFilters });
  }, [activeCategory, categoryFilters, refetch]);

  const onRefresh = useCallback(() => {
    setPage(1);
    refetch({ page: 1, pageSize: 10, categories: categoryFilters });
  }, [refetch, categoryFilters]);

  const onEndReached = useCallback(() => {
    const currentArticles = data?.articles?.articles || [];
    const totalAvailable = data?.articles?.total || 0;
    if (!loadingArticles && currentArticles.length < totalAvailable) {
      const nextPage = page + 1;
      fetchMore({
        variables: { page: nextPage, pageSize: 10, categories: categoryFilters },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prev;
          return {
            articles: {
              ...fetchMoreResult.articles,
              articles: [
                ...prev.articles.articles,
                ...fetchMoreResult.articles.articles,
              ],
            },
          };
        },
      });
      setPage(nextPage);
    }
  }, [loadingArticles, data, page, fetchMore, categoryFilters]);

  const renderNewsItem = useCallback(
    ({ item }: { item: NewsItem }) => (
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
    ),
    [navigation]
  );

  const isFirstPage = page === 1;
  const showRefreshing = isFirstPage && loadingArticles;
  const showFooterLoader = !isFirstPage && loadingArticles;

  return (
    <View style={styles.container}>
      <CategoryHeaderComponent onCategoryChange={setActiveCategory} />
      <FlatList
        ref={flatListRef}
        data={data?.articles?.articles}
        keyExtractor={(item) => item.id}
        renderItem={renderNewsItem}
        refreshing={showRefreshing}
        onRefresh={onRefresh}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          showFooterLoader ? (
            <View style={styles.loading}>
              <ActivityIndicator size="small" color="#fff" />
            </View>
          ) : null
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.9)",
  },
  loading: {
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default ArticleListPage;
