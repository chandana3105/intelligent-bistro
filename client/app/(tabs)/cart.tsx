import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import { Ionicons } from "@expo/vector-icons";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useCartStore, CartItem } from "../../store/cartStore";

export default function CartScreen() {
  const { items, updateRowQuantity, clearCart, getTotalPrice } = useCartStore();
  const tabBarHeight = useBottomTabBarHeight();

  const handleClear = () => {
    Alert.alert("Clear Cart", "Remove all items from your cart?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Clear",
        style: "destructive",
        onPress: () => {
          clearCart();
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        },
      },
    ]);
  };

  const handleCheckout = () => {
    Alert.alert(
      "Order Placed! 🎉",
      `Your order of $${getTotalPrice().toFixed(2)} has been sent to the kitchen.`,
      [{ text: "Great!", onPress: () => clearCart() }]
    );
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  if (items.length === 0) {
    return (
      <SafeAreaView style={styles.safe}>
        <LinearGradient colors={["#22070F", "#13030A"]} style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Your Cart</Text>
          </View>
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>🍽️</Text>
            <Text style={styles.emptyTitle}>Your cart is empty</Text>
            <Text style={styles.emptySub}>
              Browse the menu or ask the AI waiter to add something delicious
            </Text>
          </View>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <LinearGradient colors={["#22070F", "#13030A"]} style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Your Cart</Text>
          <TouchableOpacity onPress={handleClear}>
            <Text style={styles.clearBtn}>Clear all</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.list}
          contentContainerStyle={{ paddingBottom: tabBarHeight + 110 }}
          showsVerticalScrollIndicator={false}
        >
          {items.map((item: CartItem) => (
            <View key={item.cartKey} style={styles.card}>
              <Text style={styles.cardEmoji}>{item.emoji}</Text>
              <View style={styles.cardInfo}>
                <Text style={styles.cardName}>{item.name}</Text>
                {item.note && <Text style={styles.cardNote}>{item.note}</Text>}
                <Text style={styles.cardPrice}>${(item.price * item.quantity).toFixed(2)}</Text>
              </View>
              <View style={styles.qtyRow}>
                <TouchableOpacity
                  style={styles.qtyBtn}
                  onPress={() => {
                    updateRowQuantity(item.cartKey, item.quantity - 1);
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }}
                >
                  <Ionicons name="remove" size={16} color="#FFC627" />
                </TouchableOpacity>
                <Text style={styles.qty}>{item.quantity}</Text>
                <TouchableOpacity
                  style={styles.qtyBtn}
                  onPress={() => {
                    updateRowQuantity(item.cartKey, item.quantity + 1);
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }}
                >
                  <Ionicons name="add" size={16} color="#FFC627" />
                </TouchableOpacity>
              </View>
            </View>
          ))}

          {/* Order Summary */}
          <View style={styles.summary}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>${getTotalPrice().toFixed(2)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Tax (8%)</Text>
              <Text style={styles.summaryValue}>${(getTotalPrice() * 0.08).toFixed(2)}</Text>
            </View>
            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>${(getTotalPrice() * 1.08).toFixed(2)}</Text>
            </View>
          </View>
        </ScrollView>

        {/* Checkout Button */}
        <View style={[styles.checkoutContainer, { bottom: tabBarHeight + 10 }]}>
          <TouchableOpacity style={styles.checkoutBtn} onPress={handleCheckout}>
            <Text style={styles.checkoutText}>Place Order · ${(getTotalPrice() * 1.08).toFixed(2)}</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#22070F" },
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  headerTitle: { fontSize: 26, fontWeight: "700", color: "#FFC627" },
  clearBtn: { color: "#C04A5E", fontSize: 14 },
  empty: { flex: 1, alignItems: "center", justifyContent: "center", padding: 40 },
  emptyEmoji: { fontSize: 64, marginBottom: 16 },
  emptyTitle: { fontSize: 22, fontWeight: "700", color: "#FFF6E0", marginBottom: 8 },
  emptySub: { fontSize: 15, color: "#B8967A", textAlign: "center", lineHeight: 22 },
  list: { flex: 1, paddingHorizontal: 16 },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#3A0E1F",
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#4A1A2E",
    gap: 12,
  },
  cardEmoji: { fontSize: 32, width: 40 },
  cardInfo: { flex: 1 },
  cardName: { fontSize: 16, fontWeight: "600", color: "#FFF6E0" },
  cardNote: { fontSize: 12, color: "#B8967A", marginTop: 2 },
  cardPrice: { fontSize: 14, color: "#FFC627", fontWeight: "700", marginTop: 4 },
  qtyRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  qtyBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#4A1A2E",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#5A2238",
  },
  qty: { fontSize: 16, fontWeight: "700", color: "#FFF6E0", minWidth: 20, textAlign: "center" },
  summary: {
    backgroundColor: "#3A0E1F",
    borderRadius: 16,
    padding: 16,
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#4A1A2E",
    gap: 10,
  },
  summaryRow: { flexDirection: "row", justifyContent: "space-between" },
  summaryLabel: { color: "#B8967A", fontSize: 15 },
  summaryValue: { color: "#FFF6E0", fontSize: 15, fontWeight: "600" },
  totalRow: { borderTopWidth: 1, borderTopColor: "#4A1A2E", paddingTop: 10, marginTop: 4 },
  totalLabel: { color: "#FFF6E0", fontSize: 18, fontWeight: "700" },
  totalValue: { color: "#FFC627", fontSize: 20, fontWeight: "800" },
  checkoutContainer: {
    position: "absolute",
    left: 16,
    right: 16,
  },
  checkoutBtn: {
    backgroundColor: "#FFC627",
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: "center",
  },
  checkoutText: { fontSize: 17, fontWeight: "800", color: "#22070F", letterSpacing: 0.3 },
});
