import React from "react";
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useNavigation, RouteProp, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

type RootStackParamList = {
  NewsList: {
    searchText: string;
  };
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
  categories: string[];
};

type NewsListRouteProp = RouteProp<RootStackParamList, "NewsList">;

const newsData: NewsItem[] = [
  {
    id: "1",
    title: "Uusi teknologinen läpimurto mullistaa energiantuotannon",
    imageUrl: "https://picsum.photos/600/300",
    newsText:
      "Tutkijat ovat kehittäneet uuden teknologian, joka voi muuttaa arkemme täysin. Tämä innovaatio lupaa nopeampia ja tehokkaampia ratkaisuja moniin päivittäisiin haasteisiin.",
    originalLink: "https://www.google.com",
    categories: ["Technology", "Innovation"],
  },
  {
    id: "2",
    title: "Helena Koivu seurasi huoltomiestä pitkin pihamaata",
    imageUrl: "https://picsum.photos/600/301",
    newsText:
      "Ilmastonmuutoksen vaikutukset näkyvät jo ympäri maailmaa. Asiantuntijat korostavat, että toimenpiteitä tarvitaan kiireellisesti tilanteen hallitsemiseksi.",
    originalLink: "https://www.google.com",
    categories: ["Environment"],
  },
  {
    id: "3",
    title: "Kaupunki suunnittelee uutta puistoa",
    imageUrl: "https://picsum.photos/600/305",
    newsText:
      "Paikallinen kaupunki on julkistanut suunnitelmat uudesta puistosta, joka tarjoaa asukkaille lisää viheralueita ja virkistysmahdollisuuksia.",
    originalLink: "https://www.google.com",
    categories: ["Environment", "Community", "Community", "Community", "Community"],
  },
  {
    id: "4",
    title: "Urheilutapahtuma keräsi ennätysyleisön",
    imageUrl: "https://picsum.photos/600/303",
    newsText:
      "Viikonlopun urheilutapahtuma houkutteli paikalle ennätysyleisön. Tapahtuma oli menestys ja tarjosi unohtumattomia hetkiä kaikille osallistujille.",
    originalLink: "https://www.google.com",
    categories: ["Sports"],
  },
];

const NewsList: React.FC = () => {
  const navigation = useNavigation<NewsListNavigationProp>();
  const route = useRoute<NewsListRouteProp>();

  const { searchText } = route.params || { searchText: "" };

  const filteredNews = newsData.filter((item) => {
    return item.title.toLowerCase().includes(searchText.toLowerCase());
  });

  const navItems = [
    { id: "1", name: "Technology" },
    { id: "2", name: "Environment" },
    { id: "3", name: "Sports" },
    { id: "4", name: "Health" },
  ];

  const [activeCategory, setActiveCategory] = React.useState(navItems[0].name);
  const [refreshing, setRefreshing] = React.useState(false);
  const [imageLoaded, setImageLoaded] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Simulate a network request or data fetching
    setTimeout(() => {
      // Update the filteredNews or any other state here if needed
      setRefreshing(false);
    }, 2000);
  }, []);

  const refreshingAnimation = refreshing ? (
    <View style={styles.refreshingContainer}>
      <ActivityIndicator size="large" color="#ffffff" />
      <Text style={styles.refreshingText}>Refreshing...</Text>
    </View>
  ) : null;

  const renderNewsItem = ({ item }: { item: NewsItem }) => (
    <TouchableOpacity
      style={[styles.articleContainer, { backgroundColor: getRandomBackgroundColor() }]}
      onPress={() =>
        navigation.navigate("NewsPage", {
          title: item.title,
          imageUrl: item.imageUrl,
          newsText: item.newsText,
          originalLink: item.originalLink,
        })
      }
    >
      <View style={styles.imageContainer}>
        {!imageLoaded && (
          <ActivityIndicator size="large" color="#ffffff" style={styles.imageLoader} />
        )}
        <Image
          source={{ uri: item.imageUrl }}
          style={styles.newsImage}
          onLoad={() => setImageLoaded(true)}
        />
      </View>
      <View style={styles.newsCategoryContainer}>
        {item.categories.map((category, index) => (
          <Text key={index} style={styles.newsCategory}>{category}</Text>
        ))}
      </View>
      <View style={styles.newsContentContainer}>
        <Text style={styles.newsTitle}>{item.title}</Text>
        <View style={styles.newsFooter}>
          <Text style={styles.newsDate}>29.03.2025 14:19</Text>
          <Text style={styles.newsReadTime}>5 min luettu</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredNews}
        keyExtractor={(item) => item.id}
        renderItem={renderNewsItem}
        refreshing={refreshing}
        onRefresh={onRefresh}
      />
      {refreshingAnimation}
    </View>
  );
};

const getRandomBackgroundColor = () => {
    const colors = ["#c61d48", "#c6641d", "#7d1dc6", "#c6641d"];
    return colors[Math.floor(Math.random() * colors.length)];
  };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.9)",
  },
  navBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    backgroundColor: "#333",
  },
  articleContainer: {
    marginTop: 10,
  },
  navItem: {
    fontWeight: "bold",
    fontStyle: "italic",
    color: "white",
    fontSize: 16,
    textAlign: "center",
  },
  newsItem: {
    marginBottom: 10,
  },
  articleImage: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
  },
  articleTitle: {
    color: "white",
    textAlign: "center",
    fontSize: 38,
    fontWeight: "bold",
    fontFamily: "Nobile",
    marginTop: 4,
    marginHorizontal: 5,
  },
  refreshingContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  refreshingText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
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
    position: "absolute",
    top: 8,
    left: 8,
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
  newsFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  newsDate: {
    color: "#ffffff",
    fontSize: 12,
  },
  newsReadTime: {
    color: "#ffffff",
    fontSize: 12,
  },
  imageContainer: {
    position: "relative",
    width: "100%",
    height: 200,
    justifyContent: "center",
    alignItems: "center",
  },
  imageLoader: {
    position: "absolute",
    zIndex: 1,
  },
});

export default NewsList;
