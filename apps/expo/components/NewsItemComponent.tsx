import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

type NewsItemComponentProps = {
  item: {
    image: string;
    title: string;
    categories: string[];
    createdAt: Date;
  };
  onPress: () => void;
}

const NewsItemComponent = ({ item, onPress }: NewsItemComponentProps) => {
  return (
    <TouchableOpacity style={styles.newsItem} onPress={onPress}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: item.image, cache: 'force-cache', scale: 400 }} style={styles.newsImage} />
      </View>
      <View style={styles.newsContentContainer}>
        <Text style={styles.newsTitle}>{item.title}</Text>
        <View style={styles.newsCategoryContainer}>
          {item?.categories?.map((category: string, index: number) => (
            <CategoryBadge key={index} category={category} />
          ))}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const CategoryBadge = ({ category }: { category: string }) => {
  return <Text style={styles.newsCategory}>{category}</Text>;
};

const styles = StyleSheet.create({
  newsItem: {
    marginBottom: 10,
  },
  imageContainer: {
    position: "relative",
    width: "100%",
    height: 200,
    justifyContent: "center",
    alignItems: "center",
  },
  newsImage: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
  },
  newsContentContainer: {
    padding: 10,
    flex: 1,
    justifyContent: "space-between",
  },
  newsCategoryContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 5,
  },
  newsCategory: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "bold",
    textTransform: "uppercase",
    marginRight: 5,
    marginBottom: 5,
  },
  newsTitle: {
    fontWeight: "bold",
    color: "#ffffff",
    fontSize: 32,
    lineHeight: 36,
    fontFamily: "Nobile, Helvetica",
  },
});

export { NewsItemComponent, CategoryBadge };