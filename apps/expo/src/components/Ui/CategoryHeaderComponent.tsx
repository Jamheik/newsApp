import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { gql, useQuery } from '@apollo/client'

const FEED_QUERY = gql`
query Categories {
  categories {
    label
    values
  }
}
`

const CategoryHeaderComponent: React.FC<{ onCategoryChange: (category: string | null) => void }> = ({ onCategoryChange }) => {
  const [categories, setCategories] = useState<string[]>(['Default Category']);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const { loading, error, data } = useQuery(FEED_QUERY, { errorPolicy: "all" });

  React.useEffect(() => {
    if (!loading && data && data.categories) {
      setCategories(data.categories.map((category: { label: string }) => category.label));
    }
  }, [loading, data]);

  if (loading) {
    return <Text style={styles.loadingText}>Loading...</Text>;
  }

  if (error) {
    return <Text style={styles.errorText}>Error loading categories</Text>;
  }

  const handleCategoryPress = (category: string) => {
    const newActiveCategory = activeCategory === category ? null : category;
    setActiveCategory(newActiveCategory);
    onCategoryChange(newActiveCategory);
  }

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
            onPress={() => handleCategoryPress(category)}
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
  loadingText: {
    color: "#FFF",
    fontSize: 16,
    textAlign: "center",
    marginTop: 10,
  },
  errorText: {
    color: "#FF0000",
    fontSize: 16,
    textAlign: "center",
    marginTop: 10,
  },
});

export default CategoryHeaderComponent;