import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Linking,
  TextInput,
  Button,
} from "react-native";
import { RouteProp, useRoute } from "@react-navigation/native";
import { gql, useQuery } from "@apollo/client";
import { languageTag } from "../../utils/language";
import { SafeAreaView } from "react-native-safe-area-context";

const ARTICLE_QUERY = gql`
  query Weather($location: String!) {
    weather(location: $location) {
      temperature
      country
      feels_like
      wind_speed
      location
      conditions {
        description
        icon
      }
    }
  }
`;

const WeatherComponent: React.FC = () => {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState("");
  const [iconUrl, setIconUrl] = useState("");

  const { data, loading, error, refetch } = useQuery(ARTICLE_QUERY, {
    variables: { location: "" },
    skip: true,
  });

  const fetchWeather = async () => {
    setIconUrl("");
    setWeatherData("");
    if (!city) {
      setWeatherData("Please enter a city name.");
      return;
    }

    try {
      const { data } = await refetch({ location: city });
      const {
        temperature,
        country,
        feels_like,
        wind_speed,
        location,
        conditions,
      } = data.weather;

      setWeatherData(
        `Temperature: ${temperature}°C\nCountry: ${country}\nFeels Like: ${feels_like}°C\nWind Speed: ${wind_speed} km/h\nLocation: ${location}`
      );
      setIconUrl(
        `https://openweathermap.org/img/wn/${conditions[0].icon}@2x.png?quality=lossless`
      );
    } catch (err) {
      setWeatherData("Error: " + err.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <TextInput
        value={city}
        onChangeText={setCity}
        placeholder="Enter city name"
        style={styles.input}
      />
      <TouchableOpacity style={styles.button} onPress={fetchWeather}>
        <Text style={styles.buttonText}>Search Weather</Text>
      </TouchableOpacity>
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <Text style={styles.weatherData}>{weatherData}</Text>
      )}
      <Image
        source={{
          uri: `${iconUrl}`,
        }}
        style={{ width: 100, height: 100, marginTop: 20 }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "grey",
    padding: 10,
  },
  input: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    margin: 10,
    backgroundColor: "#fff",
  },
  weatherData: {
    marginTop: 20,
    padding: 10,
    color: "black",
    fontSize: 18,
    fontWeight: "bold",
    lineHeight: 24,
  },
  button: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#007BFF",
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default WeatherComponent;
