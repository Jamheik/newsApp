import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";

export const categories = [
  "Technology",
  "Sports",
  "Environment",
  "Health",
  "Politics",
  "Entertainment",
  "Science",
  "Business",
];

const CategoryNav: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>(categories[0]);

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryButton,
              activeCategory === category && styles.activeCategoryButton,
            ]}
            onPress={() => setActiveCategory(category)}
          >
            <Text
              style={[
                styles.categoryText,
                activeCategory === category && styles.activeCategoryText,
              ]}
            >
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#002855",
    paddingVertical: 10,
  },
  scrollContainer: {
    paddingHorizontal: 10,
  },
  categoryButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#004080",
    marginRight: 10,
  },
  activeCategoryButton: {
    backgroundColor: "#1E90FF",
  },
  categoryText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "bold",
  },
  activeCategoryText: {
    color: "#FFF",
  },
  activeCategoryDisplay: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
    textAlign: "center",
  },
});

export default CategoryNav;