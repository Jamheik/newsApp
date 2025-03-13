import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";

interface NewsScreenProps {
  title: string;
  imageUrl: string;
  newsText: string;
}

const NewsScreen: React.FC<NewsScreenProps> = ({
  title,
  imageUrl,
  newsText,
}) => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={{ uri: imageUrl }} style={styles.image} />

      <Text style={styles.title}>{title}</Text>

      <View style={styles.middleContainer}>
        <TouchableOpacity>
          <Text style={styles.link}>LUE ALKUPERÄINEN</Text>
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
    paddingBottom: 20,
  },
  image: {
    width: "100%",
    height: 200,
  },
  gradient: {
    padding: 10,
  },
  title: {
    color: "#FFF",
    fontSize: 22,
    fontWeight: "bold",
  },
  middleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
  },
  metaText: {
    color: "#888",
  },
  link: {
    color: "#1E90FF",
    fontWeight: "bold",
  },
  content: {
    color: "#FFF",
    padding: 10,
    fontSize: 16,
  },
});

export default NewsScreen;
