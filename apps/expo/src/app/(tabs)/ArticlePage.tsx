import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Linking,
} from "react-native";
import { RouteProp, useRoute } from "@react-navigation/native";
import { gql, useQuery } from '@apollo/client'

const ARTICLE_QUERY = gql`
  query Article($articleId: ID!) {
    article(id: $articleId) {
      article {
        iso_date
        pub_date
        link
      }
      context {
        language_code
        title
        full_text
        version
      }
    }
  }
`;

type RootStackParamList = {
  NewsPage: {
    title: string;
    imageUrl: string;
    id: string;
  };
};

type NewsPageRouteProp = RouteProp<RootStackParamList, "NewsPage">;

const ArticlePage: React.FC = () => {
  const route = useRoute<NewsPageRouteProp>();
  const { id, title, imageUrl } = route.params;

  const { data, loading, error } = useQuery(ARTICLE_QUERY, {
    variables: { articleId: id },
  });

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.content}>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.content}>Error: {error.message}</Text>
      </View>
    );
  }

  const article = data?.article;
  const originalLink = article?.article?.link || "#";
  const newsText = article?.context?.full_text || "Content not available.";
  const pubDate = (article?.article?.pub_date) || "Unknown date";

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.date}>Published {pubDate}</Text>

      <Image source={{ uri: imageUrl, cache: 'only-if-cached' }} style={styles.image} />

      <View style={styles.middleContainer}>
        <TouchableOpacity>
          <Text
            style={styles.link}
            onPress={() => Linking.openURL(originalLink)}
          >
            Read original
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.content}>{newsText}</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#000",
  },
  image: {
    width: 'auto',
    height: 200,
    resizeMode: "cover",
    marginHorizontal: 8,
  },
  title: {
    color: "#FFF",
    fontSize: 28,
    fontWeight: "bold",
    marginHorizontal: 10,
    marginTop: 10,
  },
  date: {
    color: "#AAA",
    fontSize: 14,
    marginHorizontal: 10,
    marginBottom: 10,
    marginTop: 15,
  },
  middleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
  },
  link: {
    color: "#1E90FF",
    fontWeight: "bold",
  },
  content: {
    color: "#FFF",
    fontSize: 16,
    marginHorizontal: 10,
  },
});

export default ArticlePage;