import React from "react";
import { StyleSheet, Text, View, SafeAreaView } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import NavBar from "./components/NavBar";
import NewsPage from "./components/NewsPage";
import NewsList from "./components/NewsList";

export default function App() {
  const Stack = createStackNavigator();
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="NewsList"
          component={NewsList}
          options={{
            header: () => (
              <SafeAreaView>
                <NavBar title="News App" />
              </SafeAreaView>
            ),
          }}
        />
        <Stack.Screen
          name="NewsPage"
          component={NewsPage}
          options={{
            header: () => (
              <SafeAreaView>
                <NavBar title="News Details" />
              </SafeAreaView>
            ),
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
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
