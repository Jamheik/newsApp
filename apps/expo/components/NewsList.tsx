import React from "react";
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
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
};

type NewsListRouteProp = RouteProp<RootStackParamList, "NewsList">;

const newsData: NewsItem[] = [
  {
    id: "1",
    title: "Uusi teknologia mullistaa arjen",
    imageUrl: "https://picsum.photos/600/300",
    newsText:
      "Tutkijat ovat kehittäneet uuden teknologian, joka voi muuttaa arkemme täysin. Tämä innovaatio lupaa nopeampia ja tehokkaampia ratkaisuja moniin päivittäisiin haasteisiin.",
    originalLink: "https://www.google.com",
  },
  {
    id: "2",
    title: "Ilmastonmuutos ja sen vaikutukset",
    imageUrl: "https://picsum.photos/600/301",
    newsText:
      "Ilmastonmuutoksen vaikutukset näkyvät jo ympäri maailmaa. Asiantuntijat korostavat, että toimenpiteitä tarvitaan kiireellisesti tilanteen hallitsemiseksi.",
    originalLink: "https://www.google.com",
  },
  {
    id: "3",
    title: "Kaupunki suunnittelee uutta puistoa",
    imageUrl: "https://picsum.photos/600/305",
    newsText:
      "Paikallinen kaupunki on julkistanut suunnitelmat uudesta puistosta, joka tarjoaa asukkaille lisää viheralueita ja virkistysmahdollisuuksia.",
    originalLink: "https://www.google.com",
  },
  {
    id: "4",
    title: "Urheilutapahtuma keräsi ennätysyleisön",
    imageUrl: "https://picsum.photos/600/303",
    newsText:
      "Viikonlopun urheilutapahtuma houkutteli paikalle ennätysyleisön. Tapahtuma oli menestys ja tarjosi unohtumattomia hetkiä kaikille osallistujille.",
    originalLink: "https://www.google.com",
  },
];

const NewsList: React.FC = () => {
  const navigation = useNavigation<NewsListNavigationProp>();
  const route = useRoute<NewsListRouteProp>();

  const { searchText } = route.params || { searchText: "" };

  const filteredNews = newsData.filter((item) => {
    return item.title.toLowerCase().includes(searchText.toLowerCase());
  });

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredNews}
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
