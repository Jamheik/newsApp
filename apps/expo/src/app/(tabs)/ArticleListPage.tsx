import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
  Text,
} from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { gql, useQuery } from "@apollo/client";

import { ArticleComponent } from "../../components/Ui/ArticleComponent";
import CategoryHeaderComponent from "../../components/Ui/CategoryHeaderComponent";

type RootStackParamList = {
  NewsList: { searchText: string };
  NewsPage: { title: string; imageUrl: string; id: string };
};

type NewsListNavigationProp = StackNavigationProp<
  RootStackParamList,
  "NewsList"
>;

export type NewsItem = {
  id: string;
  title: string;
  image: string;
  iso_date: string;
  categories: string[];
  createdAt: Date;
};

const NEWS_QUERY = gql`
  query Articles(
    $page: Int
    $pageSize: Int
    $categories: [String!]
    $searchTerm: String
  ) {
    articles(
      page: $page
      pageSize: $pageSize
      version: 2
      categories: $categories
      searchTerm: $searchTerm
    ) {
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
  const route = useRoute<RouteProp<RootStackParamList, "NewsList">>();

  const flatListRef = useRef<FlatList<NewsItem>>(null);

  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [categoryFilters, setCategoryFilters] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [isSearching, setIsSearching] = useState(false);

  const searchTerm = route.params?.searchText || "";

  const {
    loading: loadingArticles,
    data,
    fetchMore,
    refetch,
  } = useQuery(NEWS_QUERY, {
    variables: searchTerm
      ? { searchTerm, page: 1, pageSize: 10 }
      : { page: 1, pageSize: 10, categories: categoryFilters },
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
    if (route.params?.searchText && route.params.searchText.length >= 3) {
      setIsSearching(true);
      console.log("Refetching with variables:", {
        searchTerm: route.params.searchText,
        page: 1,
        pageSize: 10,
      });
      refetch({ searchTerm: route.params.searchText, page: 1, pageSize: 10 });
    } else {
      setIsSearching(false);
    }
  }, [route.params?.searchText, refetch]);

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
        variables: {
          page: nextPage,
          pageSize: 10,
          categories: categoryFilters,
        },
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

  const showRefreshing = loadingArticles;
  const showFooterLoader = loadingArticles;

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
  searchInput: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 5,
    margin: 10,
  },
  searchButton: {
    backgroundColor: "#00509E",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginHorizontal: 10,
  },
  searchButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  clearButton: {
    backgroundColor: "#FF0000",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginHorizontal: 10,
    marginTop: 5,
  },
  clearButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  loading: {
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default ArticleListPage;
