import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import { supabase } from "../supabase";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

export default function ProfileScreen({ navigation, isSidebar = false, onClose }) {
  const [profile, setProfile] = useState({
    first_name: "",
    last_name: "",
    email: "",
    profile_photo: null,
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("users")
        .select("first_name, last_name, email, profile_photo")
        .eq("id", user.id)
        .single();

      if (error) return console.log(error.message);
      setProfile(data);
    } catch (err) {
      console.log(err);
    }
  };

  const menuItems = [
    { title: "Edit Profile", icon: "account-edit", action: () => navigation.navigate("Edit Profile") },
    { title: "Profile History", icon: "history", action: () => navigation.navigate("Profile History") },
    { title: "Logout", icon: "logout", color: "#D32F2F", action: async () => {
        await supabase.auth.signOut();
        navigation.replace("Landing");
      } 
    },
  ];

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { width: isSidebar ? width * 0.75 : "100%" },
      ]}
    >
      {/* Close button for sidebar */}
      {isSidebar && onClose && (
        <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
          <Text style={styles.closeText}>✕</Text>
        </TouchableOpacity>
      )}

      {/* Profile Header */}
      <View style={styles.header}>
        {profile.profile_photo ? (
          <Image source={{ uri: profile.profile_photo }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, styles.avatarPlaceholder]}>
            <Text style={styles.avatarText}>{profile.first_name?.[0] || "U"}</Text>
          </View>
        )}
        <Text style={styles.name}>
          {profile.first_name} {profile.last_name}
        </Text>
        <Text style={styles.email}>{profile.email}</Text>
      </View>

      {/* Menu Section */}
      <View style={styles.section}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.menuItem}
            activeOpacity={0.7}
            onPress={item.action}
          >
            <View style={styles.menuIcon}>
              <MaterialCommunityIcons
                name={item.icon}
                size={24}
                color={item.color || "#1565C0"}
              />
            </View>
            <Text style={[styles.menuText, { color: item.color || "#222" }]}>
              {item.title}
            </Text>
            <MaterialIcons name="chevron-right" size={24} color="#999" />
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 40,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
    flexGrow: 1,
  },
  closeBtn: { position: "absolute", top: 30, right: 20, zIndex: 10 },
  closeText: { fontSize: 24, color: "#333" },
  header: { alignItems: "center", marginBottom: 40 },
  avatar: { width: 100, height: 100, borderRadius: 50, marginBottom: 12 },
  avatarPlaceholder: {
    backgroundColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: { fontSize: 36, color: "#fff", fontWeight: "700" },
  name: { fontSize: 22, fontWeight: "700", marginBottom: 4, color: "#222" },
  email: { fontSize: 14, color: "#666" },
  section: { marginTop: 10 },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  menuIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: "#e3f2fd",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  menuText: { fontSize: 16, fontWeight: "600", flex: 1 },
});
