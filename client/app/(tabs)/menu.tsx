import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  RefreshControl,
  Image,
  Pressable,
} from "react-native";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useCartStore, MenuItem } from "../../store/cartStore";
import { fetchMenu } from "../../utils/api";
import DishDetailModal from "../../components/DishDetailModal";

const CATEGORIES = ["starters", "mains", "sides", "drinks", "desserts"];
const CATEGORY_LABELS: Record<string, string> = {
  starters: "Starters",
  mains: "Mains",
  sides: "Sides",
  drinks: "Drinks",
  desserts: "Desserts",
};

export default function MenuScreen() {
  const [activeCategory, setActiveCategory] = useState("mains");
  const [menuData, setMenuData] = useState<Record<string, MenuItem[]>>({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());
  const { addItem, items } = useCartStore();
  const tabBarHeight = useBottomTabBarHeight();

  const markImageFailed = (id: string) => {
    setFailedImages((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  };

  const loadMenu = async () => {
    try {
      const data = await fetchMenu();
      setMenuData(data.menu);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { loadMenu(); }, []);

  const handleQuickAdd = (item: MenuItem) => {
    addItem(item, 1);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const openDetail = (item: MenuItem) => {
    Haptics.selectionAsync();
    setSelectedItem(item);
  };

  const getCartQuantity = (itemId: string) => {
    return items
      .filter((i) => i.id === itemId)
      .reduce((sum, i) => sum + i.quantity, 0);
  };

  const visibleItems = menuData[activeCategory] ?? [];

  return (
    <SafeAreaView style={styles.safe}>
      <LinearGradient colors={["#22070F", "#13030A"]} style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>The Intelligent Bistro</Text>
          <Text style={styles.headerSub}>Fine Dining, Reimagined</Text>
        </View>

        {/* Category Pills */}
        <View style={styles.categoryWrap}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryRow}
          >
            {CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[styles.pill, activeCategory === cat && styles.pillActive]}
                onPress={() => setActiveCategory(cat)}
              >
                <Text style={[styles.pillText, activeCategory === cat && styles.pillTextActive]}>
                  {CATEGORY_LABELS[cat]}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Menu Items */}
        {loading ? (
          <ActivityIndicator color="#FFC627" style={{ marginTop: 60 }} />
        ) : (
          <ScrollView
            style={styles.list}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: tabBarHeight + 20 }}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={() => { setRefreshing(true); loadMenu(); }}
                tintColor="#FFC627"
              />
            }
          >
            {visibleItems.map((item) => {
              const qty = getCartQuantity(item.id);
              return (
                <Pressable
                  key={item.id}
                  onPress={() => openDetail(item)}
                  style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
                >
                  {item.image && !failedImages.has(item.id) ? (
                    <Image
                      source={{ uri: item.image }}
                      style={styles.cardImg}
                      onError={() => markImageFailed(item.id)}
                    />
                  ) : (
                    <View style={[styles.cardImg, styles.cardImgFallback]}>
                      <Image
                        source={require("../../assets/logo-mark.png")}
                        style={styles.fallbackMark}
                        resizeMode="contain"
                      />
                    </View>
                  )}
                  <View style={styles.cardInfo}>
                    <Text style={styles.cardName} numberOfLines={1}>{item.name}</Text>
                    <Text style={styles.cardDesc} numberOfLines={2}>{item.description}</Text>
                    <View style={styles.cardBottom}>
                      <Text style={styles.cardPrice}>${item.price.toFixed(2)}</Text>
                      {item.options && item.options.length > 0 && (
                        <Text style={styles.customizable}>Customize</Text>
                      )}
                    </View>
                  </View>
                  <TouchableOpacity
                    style={[styles.addBtn, qty > 0 && styles.addBtnActive]}
                    onPress={(e) => {
                      e.stopPropagation();
                      handleQuickAdd(item);
                    }}
                    hitSlop={6}
                  >
                    <Text style={[styles.addBtnText, qty > 0 && styles.addBtnTextActive]}>
                      {qty > 0 ? `+ ${qty}` : "+"}
                    </Text>
                  </TouchableOpacity>
                </Pressable>
              );
            })}
          </ScrollView>
        )}

        <DishDetailModal
          item={selectedItem}
          visible={selectedItem !== null}
          onClose={() => setSelectedItem(null)}
        />
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#22070F" },
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 8 },
  headerTitle: {
    fontSize: 26,
    fontWeight: "700",
    color: "#FFC627",
    letterSpacing: 0.5,
  },
  headerSub: {
    fontSize: 13,
    color: "#B8967A",
    letterSpacing: 2,
    textTransform: "uppercase",
    marginTop: 2,
  },
  categoryWrap: { height: 60, flexShrink: 0 },
  categoryRow: { paddingHorizontal: 16, paddingVertical: 12, gap: 8, alignItems: "center" },
  pill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#4A1A2E",
    borderWidth: 1,
    borderColor: "#5A2238",
  },
  pillActive: { backgroundColor: "#FFC627", borderColor: "#FFC627" },
  pillText: { color: "#B8967A", fontSize: 13, fontWeight: "600" },
  pillTextActive: { color: "#22070F" },
  list: { flex: 1, paddingHorizontal: 16 },
  card: {
    flexDirection: "row",
    backgroundColor: "#3A0E1F",
    borderRadius: 16,
    marginBottom: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: "#4A1A2E",
    alignItems: "center",
    gap: 12,
  },
  cardPressed: { opacity: 0.7, transform: [{ scale: 0.99 }] },
  cardImg: {
    width: 72,
    height: 72,
    borderRadius: 12,
    backgroundColor: "#4A1A2E",
  },
  cardImgFallback: { alignItems: "center", justifyContent: "center" },
  cardEmoji: { fontSize: 36 },
  fallbackMark: { width: 40, height: 40, opacity: 0.7 },
  cardInfo: { flex: 1, justifyContent: "center" },
  cardName: { fontSize: 15, fontWeight: "700", color: "#FFF6E0", marginBottom: 4 },
  cardDesc: { fontSize: 12, color: "#B8967A", lineHeight: 16, marginBottom: 6 },
  cardBottom: { flexDirection: "row", alignItems: "center", gap: 10 },
  cardPrice: { fontSize: 15, fontWeight: "700", color: "#FFC627" },
  customizable: {
    fontSize: 10,
    color: "#B8967A",
    letterSpacing: 1,
    textTransform: "uppercase",
    fontWeight: "600",
  },
  addBtn: {
    backgroundColor: "#4A1A2E",
    borderRadius: 12,
    width: 44,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#5A2238",
  },
  addBtnActive: { backgroundColor: "#FFC627", borderColor: "#FFC627" },
  addBtnText: { fontSize: 14, color: "#FFC627", fontWeight: "700" },
  addBtnTextActive: { color: "#22070F" },
});
