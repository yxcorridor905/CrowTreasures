import { Treasure, TreasureType, GeminiTreasureResponse } from "../types";

const SYSTEM_INSTRUCTION = `
You are the mystical "Keeper of the Crow's Treasure" (乌鸦宝藏的守护者).
Your task is to transform a user's abstract thought and emotion into a physical, magical "Treasure".

Rules:
1. **Language**: All output fields (name, description, crowCommentary) MUST be in **Simplified Chinese (简体中文)**.
2. Analyze the user's thought and selected emotion (if provided).
3. Assign it one of the following types: COIN, GEM, SWORD, SCROLL, FEATHER, KEY, POTION, ARTIFACT.
3.1 The "type" field MUST be exactly one of:
"COIN","GEM","SWORD","SCROLL","FEATHER","KEY","POTION","ARTIFACT"
No other words.
4. Generate a mystical name for the treasure (e.g., "静默的琥珀硬币", "悔恨的生锈短剑").
4.1 Name must be SHORT and EASY: 4~8 Chinese characters, max 10.
4.2 Name format should be one of:
- 「X之Y」(e.g., "静默之钥", "微光之羽")
- 「X的Y」(e.g., "薄雾的硬币")
Avoid stacked adjectives like "古老的、破碎的、被诅咒的..."
4.3 Do NOT include punctuation, quotes, or long phrases in the name.
5. Write a short, poetic, and philosophical description (1-2 sentences) that connects the item to the user's thought.
6. **Crow's Commentary**: 
   - You are a **neutral witness** (中立的见证者), an observer of time and fate. 
   - **Do NOT** judge the emotion or thought.
   - **Do NOT** use bird sounds like "Ga", "Caw", "嘎" or mimic a bird's speech pattern.
   - **Tone**: Mysterious, cool, aloof, detached, poetic, timeless.
7. Assign a color theme (hex code) that matches the mood.
8. Return the response in strict JSON format ONLY (no markdown fence).
`;

// 小工具：尽量从模型输出里抠出 JSON（防止它包 ```json ...```）
function extractJson(text: string): any {
  const cleaned = text
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```$/i, "")
    .trim();

  // 如果 clean 后就是 JSON，直接 parse
  try {
    return JSON.parse(cleaned);
  } catch {}

  // 否则尝试抓第一个 {...}
  const match = cleaned.match(/\{[\s\S]*\}/);
  if (!match) throw new Error("Model did not return JSON.");
  return JSON.parse(match[0]);
}

export const generateTreasure = async (
  thought: string,
  emotion?: string
): Promise<Omit<Treasure, "id" | "createdAt">> => {
  try {
    
    const prompt = emotion
      ? `User Thought: "${thought}"\nUser Emotion: "${emotion}"`
      : `User Thought: "${thought}"`;

    const resp = await fetch("/.netlify/functions/deepseek", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // DeepSeek: Bearer Auth
  
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        stream: false,
        temperature: 0.8,
        messages: [
          { role: "system", content: SYSTEM_INSTRUCTION },
          { role: "user", content: prompt },
        ],
      }),
    });

    const text = await resp.text();
    if (!resp.ok) {
      // 这行非常关键：以后你一眼就能看懂为什么没生成
      throw new Error(`DeepSeek HTTP ${resp.status}: ${text}`);
    }

    // DeepSeek 的 response 结构是 choices[0].message.content（OpenAI 风格）
    // 文档示例同样是 /chat/completions + Bearer。:contentReference[oaicite:2]{index=2}
    const payload = JSON.parse(text);
    const content: string =
      payload?.choices?.[0]?.message?.content ?? "";

    if (!content) throw new Error("Empty content from DeepSeek.");

    const data = extractJson(content) as GeminiTreasureResponse;

    // Map string type to Enum to ensure safety
    let mappedType = TreasureType.ARTIFACT;
    if (Object.values(TreasureType).includes(data.type as TreasureType)) {
      mappedType = data.type as TreasureType;
    }

    return {
      content: thought,
      emotion: emotion,
      name: data.name,
      type: mappedType,
      description: data.description,
      crowCommentary: data.crowCommentary,
      color: data.colorTheme,
    };
  } catch (error) {
    console.error("DeepSeek Generation Error:", error);

    // Fallback（保证 UI 不会因为 undefined 崩掉）
    return {
      content: thought,
      emotion: emotion,
      name: "迷雾中的灰烬",
      type: TreasureType.FEATHER,
      description: "迷雾遮蔽了宝藏的真容，但你的思绪已被乌鸦以此羽毛铭记。",
      crowCommentary: "迷雾太重，看不清来路，也看不清归途。",
      color: "#94a3b8",
    };
  }
};