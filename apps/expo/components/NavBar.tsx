import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

type NavbarProps = {
  title: string;
};
const menuOptions = [
  "Etusivu",
  "Kotimaa",
  "Ulkomaa",
  "Urheilu",
  "Digi",
  "Viihde",
];

const NavBar: React.FC<NavbarProps> = ({ title }) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [category, setCategory] = useState("Etusivu");
  useEffect(() => {
    alert(`Selected genre: ${category}`);
    setMenuVisible(false);
  }, [category]);
  return (
    <View style={styles.navbar}>
      <Text style={styles.title}>{title}</Text>
      <View style={{ flex: 1 }} />
      <TouchableOpacity style={{ paddingRight: 15 }}>
        <Ionicons name="search" size={24} color={"white"} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setMenuVisible(true)}>
        <Ionicons name="menu" size={24} color="white" />
      </TouchableOpacity>

      <Modal visible={menuVisible} transparent animationType="slide">
        <View style={styles.menuContainer}>
          <View style={styles.menu}>
            <FlatList
              data={menuOptions}
              keyExtractor={(item: any) => item}
              renderItem={({ item }: { item: string }) => (
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => setCategory(item)}
                >
                  <Text style={styles.menuText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setMenuVisible(false)}
            >
              <Text style={styles.closeText}>Sulje</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  navbar: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#6200ea",
    padding: 15,
    height: 70,
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
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  menu: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "80%",
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
});

export default NavBar;
