import AsyncStorage from '@react-native-async-storage/async-storage';

const memoryStore: Record<string, string> = {};

export const storage = {
  async setItem(key: string, value: string): Promise<void> {
    try {
      await AsyncStorage.setItem(key, value);
    } catch {
      memoryStore[key] = value;
    }
  },

  async getItem(key: string): Promise<string | null> {
    try {
      const val = await AsyncStorage.getItem(key);
      if (val !== null) return val;
      return memoryStore[key] || null;
    } catch {
      return memoryStore[key] || null;
    }
  },

  async removeItem(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch {
      delete memoryStore[key];
    }
  },

  async setObject<T>(key: string, value: T): Promise<void> {
    await this.setItem(key, JSON.stringify(value));
  },

  async getObject<T>(key: string): Promise<T | null> {
    const item = await this.getItem(key);
    if (!item) return null;
    try {
      return JSON.parse(item) as T;
    } catch {
      return null;
    }
  },
};
