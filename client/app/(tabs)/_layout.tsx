import { Tabs } from "expo-router";
import { BlurView } from "expo-blur";
import { StyleSheet, View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useCartStore } from "../../store/cartStore";

function TabBarIcon({ name, color }: { name: any; color: string }) {
  return <Ionicons name={name} size={24} color={color} />;
}

export default function TabLayout() {
  const totalItems = useCartStore((s) => s.getTotalItems());

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: "#FFC627",
        tabBarInactiveTintColor: "#9C7585",
        tabBarBackground: () => (
          <BlurView intensity={80} style={StyleSheet.absoluteFill} tint="dark" />
        ),
        tabBarLabelStyle: styles.label,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <TabBarIcon name="home-outline" color={color} />,
        }}
      />
      <Tabs.Screen
        name="menu"
        options={{
          title: "Menu",
          tabBarIcon: ({ color }) => <TabBarIcon name="restaurant-outline" color={color} />,
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: "AI Waiter",
          tabBarIcon: ({ color }) => <TabBarIcon name="chatbubble-ellipses-outline" color={color} />,
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: "Cart",
          tabBarIcon: ({ color }) => (
            <View>
              <TabBarIcon name="bag-outline" color={color} />
              {totalItems > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{totalItems}</Text>
                </View>
              )}
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: "absolute",
    borderTopWidth: 0,
    backgroundColor: "transparent",
    elevation: 0,
  },
  label: {
    fontFamily: "System",
    fontSize: 11,
    letterSpacing: 0.3,
  },
  badge: {
    position: "absolute",
    right: -6,
    top: -3,
    backgroundColor: "#FFC627",
    borderRadius: 8,
    width: 16,
    height: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: {
    color: "#22070F",
    fontSize: 10,
    fontWeight: "700",
  },
});
