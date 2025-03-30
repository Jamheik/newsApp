import React from "react";

import ApolloClient from "../components/ApolloClient";
import AppNavigator from "../components/AppNavigator";
import ArticlePage from "./(tabs)/ArticlePage";
import ArticleListPage from "./(tabs)/ArticleListPage";

export default function RootLayout() {
    const screens = [
        {
            name: "NewsList",
            component: ArticleListPage,
            title: "News App",
        },
        {
            name: "NewsPage",
            component: ArticlePage,
            title: "News Details",
        },
    ];

    return (
        <ApolloClient>
            <AppNavigator screens={screens} />
        </ApolloClient>
    );
}