// filepath: d:\projekti\newsApp\components\newsList.tsx
import React from "react";
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { SafeAreaView } from "react-native-safe-area-context";

type RootStackParamList = {
  NewsList: undefined;
  NewsPage: {
    title: string;
    imageUrl: string;
    newsText: string;
    originalLink: string;
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
};

const newsData: NewsItem[] = [
  {
    id: "1",
    title: "Helena Koivu seurasi huoltomiestä pitkin piha-aluetta",
    imageUrl: "https://picsum.photos/600/300",
    newsText:
      "liirum laarum laarum joojee liirum laarum laarum joojee liirum laarum laarum joojee liirum laarum laarum joojee",
    originalLink: "https://www.google.com",
  },
  {
    id: "2",
    title: "Helena Koivu seurasi huoltomiestä pitkin piha-aluetta",
    imageUrl: "https://picsum.photos/600/301",
    newsText:
      "liirum laarum laarum joojee liirum laarum laarum joojee liirum laarum laarum joojee liirum laarum laarum joojee",
    originalLink: "https://www.google.com",
  },
  {
    id: "3",
    title: "Helena Koivu seurasi huoltomiestä pitkin piha-aluetta",
    imageUrl: "https://picsum.photos/600/305",
    newsText:
      "liirum laarum laarum joojee liirum laarum laarum joojee liirum laarum laarum joojee liirum laarum laarum joojee",
    originalLink: "https://www.google.com",
  },
  {
    id: "4",
    title: "Helena Koivu seurasi huoltomiestä pitkin piha-aluetta",
    imageUrl: "https://picsum.photos/600/303",
    newsText:
      "liirum laarum laarum joojee liirum laarum laarum joojee liirum laarum laarum joojee liirum laarum laarum joojee",
    originalLink: "https://www.google.com",
  },
];

const NewsList: React.FC = () => {
  const navigation = useNavigation<NewsListNavigationProp>();

  return (
    <View style={styles.container}>
      <FlatList
        data={newsData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }: { item: NewsItem }) => (
          <TouchableOpacity
            style={styles.newsItem}
            onPress={() =>
              navigation.navigate("NewsPage", {
                title: item.title,
                imageUrl: item.imageUrl,
                newsText: item.newsText,
                originalLink: item.originalLink,
              })
            }
          >
            <Image source={{ uri: item.imageUrl }} style={styles.image} />
            <Text style={styles.title}>{item.title}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.9)",
  },
  newsItem: {
    marginBottom: 10,
  },
  image: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
  },
  title: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
    marginHorizontal: 10,
  },
});

export default NewsList;
