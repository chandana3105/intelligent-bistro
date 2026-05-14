import React, { useMemo, useState } from "react";
import {
  Modal,
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Pressable,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useCartStore, MenuItem, MenuItemOption } from "../store/cartStore";

interface Props {
  item: MenuItem | null;
  visible: boolean;
  onClose: () => void;
}

type Selection = Record<string, string | string[]>;

const initialSelection = (options: MenuItemOption[] = []): Selection => {
  const sel: Selection = {};
  for (const opt of options) {
    if (opt.multi) sel[opt.name] = [];
    else if (opt.default) sel[opt.name] = opt.default;
    else if (opt.choices?.[0]) sel[opt.name] = opt.choices[0];
  }
  return sel;
};

const buildNote = (selection: Selection): string => {
  const parts: string[] = [];
  for (const key of Object.keys(selection)) {
    const val = selection[key];
    if (Array.isArray(val)) {
      if (val.length > 0) parts.push(`+ ${val.join(", ")}`);
    } else if (val) {
      parts.push(val);
    }
  }
  return parts.join(" · ");
};

export default function DishDetailModal({ item, visible, onClose }: Props) {
  const addItem = useCartStore((s) => s.addItem);
  const [quantity, setQuantity] = useState(1);
  const [selection, setSelection] = useState<Selection>({});
  const [imageFailed, setImageFailed] = useState(false);

  // Reset when a new item is opened
  React.useEffect(() => {
    if (item && visible) {
      setQuantity(1);
      setSelection(initialSelection(item.options));
      setImageFailed(false);
    }
  }, [item, visible]);

  const handleSelect = (group: MenuItemOption, choice: string) => {
    Haptics.selectionAsync();
    setSelection((prev) => {
      if (group.multi) {
        const cur = (prev[group.name] as string[]) ?? [];
        const next = cur.includes(choice)
          ? cur.filter((c) => c !== choice)
          : [...cur, choice];
        return { ...prev, [group.name]: next };
      }
      return { ...prev, [group.name]: choice };
    });
  };

  const isSelected = (group: MenuItemOption, choice: string) => {
    const val = selection[group.name];
    if (Array.isArray(val)) return val.includes(choice);
    return val === choice;
  };

  const note = useMemo(() => buildNote(selection), [selection]);

  const handleAdd = () => {
    if (!item) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    addItem(item, quantity, note || undefined);
    onClose();
  };

  if (!item) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.root}>
        <ScrollView
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 140 }}
        >
          {/* Hero image */}
          <View style={styles.heroWrap}>
            {item.image && !imageFailed ? (
              <Image
                source={{ uri: item.image }}
                style={styles.hero}
                onError={() => setImageFailed(true)}
              />
            ) : (
              <View style={[styles.hero, styles.heroFallback]}>
                <Image
                  source={require("../assets/logo-mark.png")}
                  style={styles.heroFallbackMark}
                  resizeMode="contain"
                />
              </View>
            )}
            <LinearGradient
              colors={["transparent", "#22070F"]}
              style={styles.heroFade}
              pointerEvents="none"
            />
            <Pressable style={styles.closeBtn} onPress={onClose} hitSlop={12}>
              <Ionicons name="close" size={22} color="#FFF6E0" />
            </Pressable>
          </View>

          {/* Title block */}
          <View style={styles.titleBlock}>
            <View style={styles.titleRow}>
              <Text style={styles.emoji}>{item.emoji}</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.price}>${item.price.toFixed(2)}</Text>
              </View>
            </View>
            <Text style={styles.description}>{item.description}</Text>

            {item.tags?.length > 0 && (
              <View style={styles.tagRow}>
                {item.tags.map((tag) => (
                  <View key={tag} style={styles.tag}>
                    <Text style={styles.tagText}>{tag}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* Options */}
          {item.options && item.options.length > 0 ? (
            <View style={styles.options}>
              {item.options.map((opt) => (
                <View key={opt.name} style={styles.optionGroup}>
                  <View style={styles.optionHeader}>
                    <Text style={styles.optionName}>{opt.name}</Text>
                    {opt.multi && <Text style={styles.optionHint}>Pick any</Text>}
                  </View>
                  <View style={styles.choices}>
                    {opt.choices.map((choice) => {
                      const sel = isSelected(opt, choice);
                      return (
                        <TouchableOpacity
                          key={choice}
                          style={[styles.choice, sel && styles.choiceActive]}
                          onPress={() => handleSelect(opt, choice)}
                          activeOpacity={0.7}
                        >
                          {opt.multi && (
                            <Ionicons
                              name={sel ? "checkmark-circle" : "ellipse-outline"}
                              size={16}
                              color={sel ? "#22070F" : "#B8967A"}
                              style={{ marginRight: 6 }}
                            />
                          )}
                          <Text style={[styles.choiceText, sel && styles.choiceTextActive]}>
                            {choice}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.noOptions}>
              <Ionicons name="checkmark-circle-outline" size={18} color="#B8967A" />
              <Text style={styles.noOptionsText}>Served as the chef prepared it</Text>
            </View>
          )}

          {/* Quantity */}
          <View style={styles.qtySection}>
            <Text style={styles.qtyLabel}>Quantity</Text>
            <View style={styles.qtyControls}>
              <TouchableOpacity
                style={styles.qtyBtn}
                onPress={() => setQuantity((q) => Math.max(1, q - 1))}
              >
                <Ionicons name="remove" size={18} color="#FFC627" />
              </TouchableOpacity>
              <Text style={styles.qtyValue}>{quantity}</Text>
              <TouchableOpacity
                style={styles.qtyBtn}
                onPress={() => setQuantity((q) => q + 1)}
              >
                <Ionicons name="add" size={18} color="#FFC627" />
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

        {/* Sticky CTA */}
        <View style={styles.cta}>
          <TouchableOpacity style={styles.addBtn} onPress={handleAdd} activeOpacity={0.85}>
            <Text style={styles.addBtnText}>
              Add {quantity} to Cart · ${(item.price * quantity).toFixed(2)}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#22070F" },

  heroWrap: { position: "relative" },
  hero: { width: "100%", height: 280, backgroundColor: "#3A0E1F" },
  heroFallback: { alignItems: "center", justifyContent: "center" },
  heroEmoji: { fontSize: 100 },
  heroFallbackMark: { width: 140, height: 140, opacity: 0.7 },
  heroFade: { position: "absolute", left: 0, right: 0, bottom: 0, height: 80 },
  closeBtn: {
    position: "absolute",
    top: 14,
    right: 14,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
  },

  titleBlock: {
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#4A1A2E",
  },
  titleRow: { flexDirection: "row", alignItems: "center", gap: 14, marginBottom: 12 },
  emoji: { fontSize: 36 },
  name: { fontSize: 24, fontWeight: "800", color: "#FFF6E0", letterSpacing: -0.3 },
  price: { fontSize: 18, fontWeight: "700", color: "#FFC627", marginTop: 2 },
  description: { fontSize: 14, color: "#B8967A", lineHeight: 20, marginBottom: 10 },
  tagRow: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  tag: {
    backgroundColor: "#4A1A2E",
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  tagText: { fontSize: 11, color: "#FFC627", fontWeight: "600", letterSpacing: 0.2 },

  options: { paddingHorizontal: 20, paddingTop: 18, gap: 18 },
  optionGroup: {},
  optionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginBottom: 10,
  },
  optionName: { fontSize: 15, color: "#FFF6E0", fontWeight: "700", letterSpacing: 0.2 },
  optionHint: { fontSize: 11, color: "#B8967A", fontStyle: "italic" },
  choices: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  choice: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: "#3A0E1F",
    borderWidth: 1,
    borderColor: "#4A1A2E",
  },
  choiceActive: { backgroundColor: "#FFC627", borderColor: "#FFC627" },
  choiceText: { color: "#FFF6E0", fontSize: 13, fontWeight: "600" },
  choiceTextActive: { color: "#22070F", fontWeight: "700" },

  noOptions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 20,
    paddingTop: 18,
  },
  noOptionsText: { color: "#B8967A", fontSize: 13, fontStyle: "italic" },

  qtySection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 8,
  },
  qtyLabel: { fontSize: 15, color: "#FFF6E0", fontWeight: "700" },
  qtyControls: { flexDirection: "row", alignItems: "center", gap: 16 },
  qtyBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#3A0E1F",
    borderWidth: 1,
    borderColor: "#5A2238",
    alignItems: "center",
    justifyContent: "center",
  },
  qtyValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFF6E0",
    minWidth: 22,
    textAlign: "center",
  },

  cta: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    padding: 16,
    paddingBottom: 30,
    backgroundColor: "#22070F",
    borderTopWidth: 1,
    borderTopColor: "#4A1A2E",
  },
  addBtn: {
    backgroundColor: "#FFC627",
    borderRadius: 16,
    paddingVertical: 17,
    alignItems: "center",
  },
  addBtnText: { color: "#22070F", fontSize: 16, fontWeight: "800", letterSpacing: 0.3 },
});
