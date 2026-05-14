import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useCartStore } from "../../store/cartStore";

const MOODS = [
  { label: "Something spicy", emoji: "🌶️", prompt: "What's your spiciest dish on the menu?" },
  { label: "Light & fresh", emoji: "🥗", prompt: "Suggest something light and fresh for me" },
  { label: "Comfort food", emoji: "🍔", prompt: "I want something comforting and indulgent" },
  { label: "Date night", emoji: "🍷", prompt: "Plan a romantic three-course meal for two" },
  { label: "Quick bite", emoji: "⚡", prompt: "What can I get that's quick and satisfying?" },
  { label: "Vegetarian", emoji: "🌿", prompt: "Show me your best vegetarian options" },
  { label: "Sweet tooth", emoji: "🍰", prompt: "I'm in the mood for dessert — what do you recommend?" },
  { label: "Chef's choice", emoji: "👨‍🍳", prompt: "Surprise me with your most popular order" },
];

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return { text: "Good morning", emoji: "☀️" };
  if (hour < 17) return { text: "Good afternoon", emoji: "🌤️" };
  if (hour < 21) return { text: "Good evening", emoji: "🌙" };
  return { text: "Good night", emoji: "✨" };
}

export default function HomeScreen() {
  const tabBarHeight = useBottomTabBarHeight();
  const totalItems = useCartStore((s) => s.getTotalItems());
  const greeting = getGreeting();

  const goToChatWith = (prompt: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push({ pathname: "/(tabs)/chat", params: { initial: prompt } });
  };

  const goToMenu = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push("/(tabs)/menu");
  };

  const goToChat = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push("/(tabs)/chat");
  };

  return (
    <SafeAreaView style={styles.safe}>
      <LinearGradient colors={["#22070F", "#13030A"]} style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: tabBarHeight + 30 }}
        >
          {/* Brand */}
          <View style={styles.brand}>
            <Text style={styles.kicker}>THE INTELLIGENT BISTRO</Text>
            <Text style={styles.brandTitle}>Fine Dining,{"\n"}Reimagined.</Text>
          </View>

          {/* Greeting card */}
          <View style={styles.greetCard}>
            <View style={styles.greetTop}>
              <Text style={styles.greetEmoji}>{greeting.emoji}</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.greetHi}>{greeting.text}</Text>
                <Text style={styles.greetWelcome}>Welcome back to the bistro</Text>
              </View>
            </View>
            <Text style={styles.greetPrompt}>What are you in the mood for tonight?</Text>
          </View>

          {/* Mood chips */}
          <View style={styles.moodGrid}>
            {MOODS.map((m) => (
              <TouchableOpacity
                key={m.label}
                style={styles.moodChip}
                activeOpacity={0.7}
                onPress={() => goToChatWith(m.prompt)}
              >
                <Text style={styles.moodEmoji}>{m.emoji}</Text>
                <Text style={styles.moodLabel}>{m.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Or */}
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Action buttons */}
          <View style={styles.actions}>
            <TouchableOpacity style={styles.primaryBtn} onPress={goToMenu} activeOpacity={0.8}>
              <View style={styles.btnIcon}>
                <Ionicons name="restaurant" size={22} color="#22070F" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.primaryTitle}>Browse the Menu</Text>
                <Text style={styles.primarySub}>20 dishes across 5 categories</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#22070F" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.secondaryBtn} onPress={goToChat} activeOpacity={0.8}>
              <View style={styles.btnIconDark}>
                <Ionicons name="sparkles" size={20} color="#FFC627" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.secondaryTitle}>Chat with AI Waiter</Text>
                <Text style={styles.secondarySub}>Get personalized recommendations</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#FFC627" />
            </TouchableOpacity>
          </View>

          {/* Cart hint */}
          {totalItems > 0 && (
            <TouchableOpacity
              style={styles.cartHint}
              onPress={() => router.push("/(tabs)/cart")}
              activeOpacity={0.7}
            >
              <Ionicons name="bag-handle" size={18} color="#FFC627" />
              <Text style={styles.cartHintText}>
                You have {totalItems} item{totalItems > 1 ? "s" : ""} in your cart
              </Text>
              <Ionicons name="chevron-forward" size={16} color="#B8967A" />
            </TouchableOpacity>
          )}
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#22070F" },
  container: { flex: 1 },

  brand: { paddingHorizontal: 24, paddingTop: 24, paddingBottom: 20 },
  kicker: {
    color: "#B8967A",
    fontSize: 11,
    letterSpacing: 3,
    fontWeight: "600",
    marginBottom: 10,
  },
  brandTitle: {
    color: "#FFC627",
    fontSize: 36,
    fontWeight: "800",
    lineHeight: 42,
    letterSpacing: -0.5,
  },

  greetCard: {
    marginHorizontal: 20,
    marginBottom: 22,
    padding: 18,
    borderRadius: 20,
    backgroundColor: "#3A0E1F",
    borderWidth: 1,
    borderColor: "#4A1A2E",
  },
  greetTop: { flexDirection: "row", alignItems: "center", gap: 14, marginBottom: 14 },
  greetEmoji: { fontSize: 36 },
  greetHi: { color: "#FFF6E0", fontSize: 18, fontWeight: "700" },
  greetWelcome: { color: "#B8967A", fontSize: 13, marginTop: 2 },
  greetPrompt: {
    color: "#FFC627",
    fontSize: 15,
    fontStyle: "italic",
    lineHeight: 22,
  },

  moodGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 16,
    gap: 10,
    marginBottom: 24,
  },
  moodChip: {
    flexBasis: "47%",
    flexGrow: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#3A0E1F",
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: "#4A1A2E",
  },
  moodEmoji: { fontSize: 22 },
  moodLabel: { color: "#FFF6E0", fontSize: 14, fontWeight: "600", flexShrink: 1 },

  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    marginBottom: 20,
    gap: 12,
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: "#4A1A2E" },
  dividerText: { color: "#B8967A", fontSize: 12, letterSpacing: 2 },

  actions: { paddingHorizontal: 20, gap: 12 },
  primaryBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    backgroundColor: "#FFC627",
    borderRadius: 18,
    padding: 18,
  },
  btnIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#FFD659",
    alignItems: "center",
    justifyContent: "center",
  },
  primaryTitle: { color: "#22070F", fontSize: 17, fontWeight: "800" },
  primarySub: { color: "#22070F", fontSize: 12, opacity: 0.7, marginTop: 2 },

  secondaryBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    backgroundColor: "#3A0E1F",
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: "#FFC627",
  },
  btnIconDark: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#4A1A2E",
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryTitle: { color: "#FFC627", fontSize: 17, fontWeight: "700" },
  secondarySub: { color: "#B8967A", fontSize: 12, marginTop: 2 },

  cartHint: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginHorizontal: 20,
    marginTop: 20,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: "#2E1018",
    borderWidth: 1,
    borderColor: "#5A2238",
  },
  cartHintText: { color: "#FFF6E0", fontSize: 14, flex: 1 },
});
