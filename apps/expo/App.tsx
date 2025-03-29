import React from "react";
import { StyleSheet, Text, View, SafeAreaView, AppRegistry } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import NavBar, { styles as NavBarStyles } from "./components/NavBar";
import NewsPage from "./components/NewsPage";
import NewsList from "./components/NewsList";


import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';


const client = new ApolloClient({
  uri: 'http://192.168.1.76:4000',
  cache: new InMemoryCache(),
});

export default function App() {
  const Stack = createStackNavigator();
  return (
    <ApolloProvider client={client}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="NewsList"
            component={NewsList}
            options={{
              header: () => (
                <SafeAreaView
                  style={{
                    backgroundColor: NavBarStyles.navbar.backgroundColor,
                  }}>
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
                <SafeAreaView
                  style={{
                    backgroundColor: NavBarStyles.navbar.backgroundColor,
                  }}>
                  <NavBar title="News Details" />
                </SafeAreaView>
              ),
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </ApolloProvider>
  );
}