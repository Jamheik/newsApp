import { AppNavigatorProps } from "../types/navigation";
import React from "react";
import { BackHandler, SafeAreaView } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { styles as NavBarStyles, Header } from "../app/_header";

const Stack = createStackNavigator();

const AppNavigator: React.FC<AppNavigatorProps> = ({ screens }) => {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                {screens.map(({ name, component, title }, index) => (
                    <Stack.Screen
                        key={index}
                        name={name}
                        component={component}
                        options={({ route }) => ({
                            header: () => (
                                <SafeAreaView
                                    style={{
                                        backgroundColor: NavBarStyles.navbar.backgroundColor,
                                    }}>
                                    <Header title={`${typeof title === "function" ? title(route) : title}`} />
                                </SafeAreaView>
                            ),
                        })}
                    />
                ))}
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;