import React from "react";
import { StyleSheet, Text, View, SafeAreaView } from "react-native";
import NavBar from "./components/NavBar";
import NewsList from "./components/NewsList";

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <NavBar title="News App" />
      <NewsList />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "flex-start",
  },
});
