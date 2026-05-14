const express = require("express");
const Anthropic = require("@anthropic-ai/sdk");
const { MENU } = require("../menu");

const router = express.Router();
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// Build a compact menu summary for the AI prompt
const buildMenuContext = () => {
  return MENU.map(
    (item) =>
      `${item.id} | ${item.name} | $${item.price.toFixed(2)} | ${item.category} | tags: ${item.tags.join(", ")}`
  ).join("\n");
};

const SYSTEM_PROMPT = `You are an AI assistant for "The Intelligent Bistro", a premium restaurant. Your job is to help guests manage their order through natural conversation.

MENU (format: id | name | price | category | tags):
${buildMenuContext()}

Your response MUST always be valid JSON with this exact structure:
{
  "message": "friendly conversational response to the guest",
  "actions": [
    {
      "type": "add" | "remove" | "update_quantity" | "clear_cart" | "none",
      "itemId": "menu item id (e.g. m1, d1)",
      "quantity": number,
      "note": "optional special request for this item"
    }
  ],
  "suggestions": ["optional array of 1-3 follow-up suggestions as short strings"]
}

Rules:
- actions array can be empty [] if no cart changes needed
- For "add": quantity is how many to add
- For "remove": quantity is how many to remove (or omit to remove all)
- For "update_quantity": quantity is the NEW total quantity
- Match items by name similarity, tags, or description (e.g. "water" → d1 or d2, "spicy chicken" → m1)
- If ambiguous (e.g. "water" could be still or sparkling), pick the most common and mention in message
- Be warm, enthusiastic, and helpful — you're a friendly waiter
- If you can't match an item, explain it's not on the menu and suggest alternatives
- Return ONLY the JSON object, no markdown, no preamble`;

/**
 * POST /api/orders/parse
 * Body: { message: string, cartContext?: Array<{itemId, quantity, name}> }
 * Returns: { message, actions, suggestions }
 */
router.post("/parse", async (req, res) => {
  const { message, cartContext = [] } = req.body;

  if (!message || typeof message !== "string") {
    return res.status(400).json({ error: "message is required" });
  }

  if (message.trim().length > 500) {
    return res.status(400).json({ error: "message too long (max 500 chars)" });
  }

  // Build cart context string if cart has items
  const cartSummary =
    cartContext.length > 0
      ? `\nCurrent cart: ${cartContext.map((i) => `${i.quantity}x ${i.name}`).join(", ")}`
      : "\nCurrent cart: empty";

  try {
    const response = await client.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 1000,
      messages: [
        {
          role: "user",
          content: `${message}${cartSummary}`,
        },
      ],
      system: SYSTEM_PROMPT,
    });

    const rawText = response.content
      .filter((block) => block.type === "text")
      .map((block) => block.text)
      .join("");

    // Strip any accidental markdown fences
    const cleaned = rawText.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(cleaned);

    // Validate the response shape
    if (!parsed.message || !Array.isArray(parsed.actions)) {
      throw new Error("Invalid AI response shape");
    }

    // Enrich actions with full item data
    const enrichedActions = parsed.actions.map((action) => {
      const menuItem = MENU.find((m) => m.id === action.itemId);
      return {
        ...action,
        item: menuItem || null,
      };
    });

    return res.json({
      message: parsed.message,
      actions: enrichedActions,
      suggestions: parsed.suggestions || [],
    });
  } catch (err) {
    console.error("AI parse error:", err);

    if (err instanceof SyntaxError) {
      return res.status(500).json({
        error: "AI returned malformed response",
        message: "Sorry, I had trouble understanding that. Could you try rephrasing?",
        actions: [],
      });
    }

    return res.status(500).json({
      error: "Internal server error",
      message: "Something went wrong. Please try again.",
      actions: [],
    });
  }
});

/**
 * GET /api/orders/menu
 * Returns the full menu grouped by category
 */
router.get("/menu", (req, res) => {
  const grouped = MENU.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  res.json({ menu: grouped, items: MENU });
});

module.exports = router;
