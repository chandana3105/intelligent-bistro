import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useLocalSearchParams, router } from "expo-router";
import { useChat } from "../../hooks/useChat";

export default function ChatScreen() {
  const { messages, isLoading, sendMessage } = useChat();
  const [input, setInput] = useState("");
  const scrollRef = useRef<ScrollView>(null);
  const tabBarHeight = useBottomTabBarHeight();
  const params = useLocalSearchParams<{ initial?: string }>();

  useEffect(() => {
    if (params.initial && typeof params.initial === "string") {
      sendMessage(params.initial);
      router.setParams({ initial: undefined });
    }
  }, [params.initial]);

  useEffect(() => {
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
  }, [messages]);

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;
    setInput("");
    sendMessage(text);
  };

  const handleSuggestion = (suggestion: string) => {
    sendMessage(suggestion);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <LinearGradient colors={["#22070F", "#13030A"]} style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.aiDot} />
          <View>
            <Text style={styles.headerTitle}>AI Waiter</Text>
            <Text style={styles.headerSub}>Powered by Claude</Text>
          </View>
        </View>

        {/* Messages */}
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          keyboardVerticalOffset={tabBarHeight}
        >
          <ScrollView
            ref={scrollRef}
            style={styles.messages}
            contentContainerStyle={{ paddingVertical: 16, paddingHorizontal: 16, gap: 12, paddingBottom: 20 }}
            showsVerticalScrollIndicator={false}
          >
            {messages.map((msg) => (
              <View key={msg.id} style={msg.role === "user" ? styles.userRow : styles.aiRow}>
                {msg.role === "assistant" && (
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>B</Text>
                  </View>
                )}
                <View style={{ flex: 1, gap: 8 }}>
                  <View
                    style={[
                      styles.bubble,
                      msg.role === "user" ? styles.userBubble : styles.aiBubble,
                    ]}
                  >
                    <Text
                      style={[
                        styles.bubbleText,
                        msg.role === "user" ? styles.userText : styles.aiText,
                      ]}
                    >
                      {msg.text}
                    </Text>
                  </View>

                  {/* Cart action summary */}
                  {msg.actions && msg.actions.filter(a => a.type !== "none").length > 0 && (
                    <View style={styles.actionPills}>
                      {msg.actions.filter(a => a.type !== "none").map((action, i) => (
                        <View key={i} style={styles.actionPill}>
                          <Text style={styles.actionPillText}>
                            {action.type === "add" && `âœ“ Added ${action.quantity}x ${action.item?.name ?? ""}`}
                            {action.type === "remove" && `âœ“ Removed ${action.item?.name ?? ""}`}
                            {action.type === "update_quantity" && `âœ“ Updated ${action.item?.name ?? ""}`}
                            {action.type === "clear_cart" && "âœ“ Cart cleared"}
                          </Text>
                        </View>
                      ))}
                    </View>
                  )}

                  {/* Suggestions */}
                  {msg.suggestions && msg.suggestions.length > 0 && (
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                      <View style={styles.suggestions}>
                        {msg.suggestions.map((s, i) => (
                          <TouchableOpacity
                            key={i}
                            style={styles.suggestion}
                            onPress={() => handleSuggestion(s)}
                          >
                            <Text style={styles.suggestionText}>{s}</Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </ScrollView>
                  )}
                </View>
              </View>
            ))}

            {isLoading && (
              <View style={styles.aiRow}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>B</Text>
                </View>
                <View style={[styles.bubble, styles.aiBubble, styles.loadingBubble]}>
                  <ActivityIndicator color="#FFC627" size="small" />
                </View>
              </View>
            )}
          </ScrollView>

          {/* Input */}
          <View style={[styles.inputRow, { paddingBottom: tabBarHeight + 8 }]}>
            <TextInput
              style={styles.input}
              value={input}
              onChangeText={setInput}
              placeholder="Tell me what you'd like..."
              placeholderTextColor="#9C7585"
              multiline
              maxLength={500}
              onSubmitEditing={handleSend}
              returnKeyType="send"
            />
            <TouchableOpacity
              style={[styles.sendBtn, (!input.trim() || isLoading) && styles.sendBtnDisabled]}
              onPress={handleSend}
              disabled={!input.trim() || isLoading}
            >
              <Ionicons name="send" size={20} color={input.trim() && !isLoading ? "#22070F" : "#9C7585"} />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#22070F" },
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#4A1A2E",
  },
  aiDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#4CAF50",
  },
  headerTitle: { fontSize: 18, fontWeight: "700", color: "#FFC627" },
  headerSub: { fontSize: 11, color: "#B8967A", letterSpacing: 1 },
  messages: { flex: 1 },
  userRow: { flexDirection: "row", justifyContent: "flex-end" },
  aiRow: { flexDirection: "row", gap: 10, alignItems: "flex-start" },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#FFC627",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  avatarText: { fontSize: 14, fontWeight: "700", color: "#22070F" },
  bubble: {
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 10,
    maxWidth: "100%",
  },
  aiBubble: { backgroundColor: "#3A0E1F", borderWidth: 1, borderColor: "#4A1A2E" },
  userBubble: { backgroundColor: "#FFC627" },
  bubbleText: { fontSize: 15, lineHeight: 22 },
  aiText: { color: "#FFF6E0" },
  userText: { color: "#22070F", fontWeight: "600" },
  loadingBubble: { paddingVertical: 14 },
  actionPills: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  actionPill: {
    backgroundColor: "#1A2E10",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: "#2A4E18",
  },
  actionPillText: { color: "#6CBF5A", fontSize: 12, fontWeight: "600" },
  suggestions: { flexDirection: "row", gap: 8 },
  suggestion: {
    backgroundColor: "#4A1A2E",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#FFC627",
  },
  suggestionText: { color: "#FFC627", fontSize: 13, fontWeight: "500" },
  inputRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 10,
    padding: 12,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: "#4A1A2E",
  },
  input: {
    flex: 1,
    backgroundColor: "#3A0E1F",
    borderRadius: 24,
    paddingHorizontal: 18,
    paddingVertical: 12,
    color: "#FFF6E0",
    fontSize: 15,
    borderWidth: 1,
    borderColor: "#4A1A2E",
    maxHeight: 120,
  },
  sendBtn: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#FFC627",
    alignItems: "center",
    justifyContent: "center",
  },
  sendBtnDisabled: { backgroundColor: "#4A1A2E" },
});
