import React from "react";
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
} from "react-native";
import NewsPage from "./NewsPage";

const newsData = [
  {
    id: "1",
    title: "Helena Koivu seurasi huoltomiestä pitkin piha-aluetta",
    imageUrl: "https://picsum.photos/600/300",
    backgroundColor: "#b91c1c",
    newsText:
      "liirum laarum laarum joojee liirum laarum laarum joojee liirum laarum laarum joojee liirum laarum laarum joojee",
  },
  {
    id: "2",
    title: "Helena Koivu seurasi huoltomiestä pitkin piha-aluetta",
    imageUrl: "https://picsum.photos/600/301",
    backgroundColor: "#d97706",
    newsText:
      "liirum laarum laarum joojee liirum laarum laarum joojee liirum laarum laarum joojee liirum laarum laarum joojee",
  },
  {
    id: "3",
    title: "Helena Koivu seurasi huoltomiestä pitkin piha-aluetta",
    imageUrl: "https://picsum.photos/600/303",
    backgroundColor: "#d97706",
    newsText:
      "liirum laarum laarum joojee liirum laarum laarum joojee liirum laarum laarum joojee liirum laarum laarum joojee",
  },
  {
    id: "4",
    title: "Helena Koivu seurasi huoltomiestä pitkin piha-aluetta",
    imageUrl: "https://picsum.photos/600/304",
    backgroundColor: "#d97706",
  },
];

const NewsList: React.FC = () => {
  return (
    <View style={styles.container}>
      <FlatList
        data={newsData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.container}>
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
    width: "100%",
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.9)",
  },
  image: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
  },
  overlay: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  title: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default NewsList;
