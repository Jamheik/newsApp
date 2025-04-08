import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Keyboard,
} from "react-native";
import { gql, useQuery } from "@apollo/client";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Location from "expo-location";

const WEATHER_QUERY = gql`
  query Weather($location: String, $latitude: Float, $longitude: Float) {
    weather(location: $location, latitude: $latitude, longitude: $longitude) {
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
  const [searchCity, setSearchCity] = useState("");
  const [gpsLocation, setGpsLocation] = useState({
    latitude: 0,
    longitude: 0,
  });

  const { data, loading, error } = useQuery(WEATHER_QUERY, {
    variables: {
      longitude: gpsLocation.longitude,
      latitude: gpsLocation.latitude,
      location: searchCity,
    },
    skip:
      !searchCity && gpsLocation.latitude === 0 && gpsLocation.longitude === 0,
  });

  const handleSearch = () => {
    if (city.trim() === "") {
      alert("Please enter a city name");
      return;
    }
    setGpsLocation({ latitude: 0, longitude: 0 });
    setSearchCity(city);
    Keyboard.dismiss();
  };
  const handleGpsSearch = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      alert("Permission to access location was denied");
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    setGpsLocation({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    });
    setSearchCity("");
    setCity("");
  };

  return (
    <SafeAreaView style={styles.container}>
      <TextInput
        value={city}
        onChangeText={(e) => setCity(e)}
        placeholder="Enter city name"
        style={styles.input}
      />
      <TouchableOpacity style={styles.button} onPress={handleSearch}>
        <Text style={styles.buttonText}>Search Weather</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleGpsSearch}>
        <Text style={styles.buttonText}>📍 Use GPS Location</Text>
      </TouchableOpacity>

      {loading && (
        <ActivityIndicator size="large" color="#ffffff" style={styles.loader} />
      )}
      {error && <Text style={styles.weatherData}>Error: {error.message}</Text>}

      {data && data.weather && (
        <View>
          <Text style={styles.weatherData}>
            Temperature: {data.weather.temperature}°C
          </Text>
          <Text style={styles.weatherData}>
            Feels Like: {data.weather.feels_like}°C
          </Text>
          <Text style={styles.weatherData}>
            Wind Speed: {data.weather.wind_speed} km/h
          </Text>
          <Text style={styles.weatherData}>
            Location: {data.weather.location}
          </Text>
          <Text style={styles.weatherData}>
            Description: {data.weather.conditions[0]?.description}
          </Text>
          {data.weather.conditions[0]?.icon && (
            <Image
              source={{
                uri: `https://openweathermap.org/img/wn/${data.weather.conditions[0].icon}@2x.png`,
              }}
              style={styles.weatherImage}
            />
          )}
        </View>
      )}
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
  loader: {
    paddingTop: 100,
  },
  weatherImage: {
    width: 100,
    height: 100,
    alignSelf: "center",
    marginTop: 20,
  },
});

export default WeatherComponent;
