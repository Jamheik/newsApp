
import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";

import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    FlatList,
    Modal,
} from "react-native";

type NavbarProps = {
    title: string;
};

export const Header: React.FC<NavbarProps> = ({ title }) => {
    const [menuVisible, setMenuVisible] = useState(false);
    const [searchVisible, setSearchVisible] = useState(false);
    const [searchText, setSearchText] = useState("");

    return (
        <View style={styles.navbar}>
            <Text style={styles.title}>{title}</Text>
            
            {/* TODO: Why ? */}
            <View style={{ flex: 1 }} />

            <TouchableOpacity
                style={{ paddingRight: 15 }}
                onPress={() => setSearchVisible(!searchVisible)}
            >
                <Ionicons name="search" size={24} color={"white"} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setMenuVisible(true)}>
                <Ionicons name="menu" size={24} color="white" />
            </TouchableOpacity>

            <Modal visible={menuVisible} transparent animationType="slide">
                <View style={styles.menuContainer}>
                    <View style={styles.menu}>
                        <FlatList
                            data={['Category 1', 'Category 2', 'Category 3']}
                            keyExtractor={(item: any) => item}
                            renderItem={({ item }: { item: string }) => (
                                <TouchableOpacity
                                    style={styles.menuItem}
                                    //onPress={() => setCategory(item)}
                                    onPress={() => {
                                        setMenuVisible(false);
                                    }}
                                >
                                    <Text style={styles.menuText}>{item}</Text>
                                </TouchableOpacity>
                            )}
                        />
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => setMenuVisible(false)}
                        >
                            <Text style={styles.closeText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

export const styles = StyleSheet.create({
    navbar: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#1E6CC6",
        padding: 15,
    },
    title: {
        color: "white",
        fontSize: 18,
        fontWeight: "bold",
    },
    menuContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.9)",
    },
    menu: {
        backgroundColor: "white",
        padding: 20,
        borderRadius: 0,
        width: "100%",
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
    },
    menuItem: {
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
    },
    menuText: {
        fontSize: 18,
        textAlign: "center",
    },
    closeButton: {
        marginTop: 10,
        padding: 10,
        backgroundColor: "#6200ea",
        borderRadius: 5,
    },
    closeText: {
        color: "white",
        textAlign: "center",
        fontSize: 16,
    },
    textInput: {
        backgroundColor: "white",
        padding: 10,
        borderRadius: 25,
        width: "50%",
        borderWidth: 1,
        borderColor: "#ccc",
        fontSize: 16,
        marginRight: 10,
        marginLeft: 10,
    },
});