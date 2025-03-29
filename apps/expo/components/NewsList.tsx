import React from "react";
import {
  View,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useNavigation, RouteProp, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { NewsItemComponent } from "./NewsItemComponent";
import CategoryNav from "./CategoryNav";

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
    categories: ["Environment", "Community","Environment", "Community"],
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

  const [refreshing, setRefreshing] = React.useState(false);

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
    </View>
  ) : null;

  const renderNewsItem = ({ item }: { item: NewsItem }) => (
    <NewsItemComponent
      item={item}
      onPress={() =>
        navigation.navigate("NewsPage", {
          title: item.title,
          imageUrl: item.imageUrl,
          newsText: item.newsText,
          originalLink: item.originalLink,
        })
      }
    />
  );

  return (
    <View style={styles.container}>
      
      <CategoryNav />

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.9)",
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
});

export default NewsList;
