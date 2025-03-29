import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Linking,
  SafeAreaView,
} from "react-native";
import { RouteProp, useRoute } from "@react-navigation/native";

type RootStackParamList = {
  NewsPage: {
    title: string;
    imageUrl: string;
    newsText: string;
    originalLink: string;
    publicationDate: string; // Added publication date
  };
};

type NewsPageRouteProp = RouteProp<RootStackParamList, "NewsPage">;

const NewsPage: React.FC = () => {
  const route = useRoute<NewsPageRouteProp>();
  const { title, imageUrl, newsText, originalLink, publicationDate } = route.params;

  return (
    <ScrollView contentContainerStyle={styles.container}>

      <Text style={styles.title}>{title}</Text>
      <Text style={styles.date}>Julkaistu 12.3.2024 14:30</Text>

      <Image source={{ uri: imageUrl }} style={styles.image} />

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

export default NewsPage;
