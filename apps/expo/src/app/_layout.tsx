import React from "react";

import ApolloClient from "../components/ApolloClient";
import AppNavigator from "../components/AppNavigator";
import ArticlePage from "./(tabs)/ArticlePage";
import ArticleListPage from "./(tabs)/ArticleListPage";
import WeatherComponent from "../components/Ui/WeatherComponent";

export default function RootLayout() {
  const screens = [
    {
      name: "NewsList",
      component: ArticleListPage,
      title: "Uutiset",
    },
    {
      name: "NewsPage",
      component: ArticlePage,
      title: "News Details",
    },
    {
      name: "WeatherPage",
      component: WeatherComponent,
      title: "Weather",
    },
  ];

  return (
    <ApolloClient>
      <AppNavigator screens={screens} />
    </ApolloClient>
  );
}
