export enum TreasureType {
  COIN = 'COIN',
  GEM = 'GEM',
  SWORD = 'SWORD',
  SCROLL = 'SCROLL',
  FEATHER = 'FEATHER',
  KEY = 'KEY',
  POTION = 'POTION',
  ARTIFACT = 'ARTIFACT'
}

export interface Treasure {
  id: string;
  content: string; // The user's original thought
  emotion?: string; // The user's selected emotion
  name: string; // Generated name e.g., "The Coin of Silence"
  type: TreasureType;
  description: string; // AI generated philosophical reflection
  crowCommentary: string; // Crow's witty comment
  color: string; // Hex code or Tailwind color class
  createdAt: number;
}

export interface GeminiTreasureResponse {
  name: string;
  type: string;
  description: string;
  crowCommentary: string;
  colorTheme: string;
}
