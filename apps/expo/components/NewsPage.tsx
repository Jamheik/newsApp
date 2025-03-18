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
  };
};

type NewsPageRouteProp = RouteProp<RootStackParamList, "NewsPage">;

const NewsPage: React.FC = () => {
  const route = useRoute<NewsPageRouteProp>();
  const { title, imageUrl, newsText, originalLink } = route.params;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.container}>
        <Image source={{ uri: imageUrl }} style={styles.image} />

        <Text style={styles.title}>{title}</Text>

        <View style={styles.middleContainer}>
          <TouchableOpacity>
            <Text
              style={styles.link}
              onPress={() => Linking.openURL(originalLink)}
            >
              LUE ALKUPERÄINEN
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.content}>{newsText}</Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#000",
  },
  image: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
  },
  title: {
    color: "#FFF",
    fontSize: 22,
    fontWeight: "bold",
    marginHorizontal: 10,
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
