import { useState, useCallback } from "react";
import * as Haptics from "expo-haptics";
import { parseOrder, ParseOrderResponse } from "../utils/api";
import { useCartStore } from "../store/cartStore";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  suggestions?: string[];
  timestamp: Date;
  actions?: ParseOrderResponse["actions"];
}

export const useChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      text: "Welcome to The Intelligent Bistro! 🍽️ I'm your AI waiter. You can tell me what you'd like to order, ask about our menu, or modify your cart. What can I get for you?",
      suggestions: ["What's popular?", "Show me vegetarian options", "Add the wagyu burger"],
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const { addItem, removeItem, updateQuantity, clearCart, getCartContext } = useCartStore();

  const applyActions = useCallback(
    (actions: ParseOrderResponse["actions"]) => {
      for (const action of actions) {
        switch (action.type) {
          case "add":
            if (action.item) {
              addItem(action.item as any, action.quantity ?? 1, action.note);
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }
            break;
          case "remove":
            if (action.itemId) {
              removeItem(action.itemId, action.quantity);
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }
            break;
          case "update_quantity":
            if (action.itemId && action.quantity !== undefined) {
              updateQuantity(action.itemId, action.quantity);
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }
            break;
          case "clear_cart":
            clearCart();
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            break;
        }
      }
    },
    [addItem, removeItem, updateQuantity, clearCart]
  );

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || isLoading) return;

      const userMsg: ChatMessage = {
        id: Date.now().toString(),
        role: "user",
        text: text.trim(),
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMsg]);
      setIsLoading(true);

      try {
        const cartContext = getCartContext();
        const response = await parseOrder(text.trim(), cartContext);

        applyActions(response.actions);

        const assistantMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          text: response.message,
          suggestions: response.suggestions,
          actions: response.actions,
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, assistantMsg]);
      } catch (err) {
        const errorMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          text: "I'm having trouble connecting right now. Please try again in a moment.",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMsg]);
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, getCartContext, applyActions]
  );

  return { messages, isLoading, sendMessage };
};
