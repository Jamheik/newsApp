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
import { gql, useQuery } from "@apollo/client";
import { languageTag } from "../../utils/language";

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


const MarkdownText: React.FC<{ style?: any; children: string }> = ({
  style,
  children,
}) => {
  const regex = /(\*\*([^*]+)\*\*)/g;
  const tokens = [];
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(children)) !== null) {
    if (match.index > lastIndex) {
      tokens.push({
        text: children.slice(lastIndex, match.index),
        bold: false,
      });
    }
    tokens.push({
      text: match[2],
      bold: true,
    });
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < children.length) {
    tokens.push({
      text: children.slice(lastIndex),
      bold: false,
    });
  }

  return (
    <Text style={style}>
      {tokens.map((token, index) =>
        token.bold ? (
          <Text key={index} style={styles.boldText}>
            {token.text}
          </Text>
        ) : (
          <Text key={index}>{token.text}</Text>
        )
      )}
    </Text>
  );
};

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

  const publishString: string = new Date(article?.article?.pub_date).toLocaleString(
    languageTag,
    {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
  );

  return (
    <ScrollView style={styles.container} >
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.date}>Published {publishString}</Text>

      <Image source={{ uri: imageUrl, cache: "only-if-cached" }} style={styles.image} />

      <View style={styles.middleContainer}>
        <TouchableOpacity onPress={() => Linking.openURL(originalLink)}>
          <Text style={styles.link}>Read original</Text>
        </TouchableOpacity>
      </View>

      <MarkdownText style={styles.content}>{newsText}</MarkdownText>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "rgba(0, 0, 0, 0.9)",
  },
  contentContainer: {
    paddingBottom: 55,
  },
  image: {
    width: "auto",
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
    fontSize: 18,
    marginHorizontal: 15,
  },
  boldText: {
    fontWeight: "bold",
    color: "#FFF",
  },
});

export default ArticlePage;
