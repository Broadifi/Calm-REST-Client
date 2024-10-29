import { load, Store } from '@tauri-apps/plugin-store';
import { Collection, HistoryEntry } from '../types';

// Define the shape of our storage data
interface AppStorage {
    collections: Collection[];
    history: HistoryEntry[];
    settings: {
        theme: 'light' | 'dark';
        environment: string;
        lastOpenedCollection?: string;
    };
}

// Utility class to handle all storage operations
export class StorageManager {
    private static instance: StorageManager;
    private store: Store | null = null;

    private constructor() {
        // Initialize store with the path relative to app config directory
        this.loadStore();
    }

    private async loadStore(): Promise<void> {
        this.store = await load('app-storage.json');
    }

    private async ensureStore(): Promise<void> {
        if (!this.store) {
            await this.loadStore();
        }
    }

    public static getInstance(): StorageManager {
        if (!StorageManager.instance) {
            StorageManager.instance = new StorageManager();
        }
        return StorageManager.instance;
    }

    // Collections
    async saveCollections(collections: Collection[]): Promise<void> {
        try {
            await this.ensureStore();
            await this.store?.set('collections', collections);
        } catch (error) {
            console.error('Failed to save collections:', error);
            throw new Error('Failed to save collections');
        }
    }

    async getCollections(): Promise<Collection[]> {
        try {
            await this.ensureStore();
            const collections = await this.store?.get<Collection[]>('collections');
            return collections ?? [];
        } catch (error) {
            console.error('Failed to get collections:', error);
            return [];
        }
    }

    // History
    async addHistoryEntry(entry: HistoryEntry): Promise<void> {
        try {
            await this.ensureStore();
            const history = await this.getHistory();
            const updatedHistory = [entry, ...history].slice(0, 100); // Keep last 100 entries
            await this.store?.set('history', updatedHistory);
        } catch (error) {
            console.error('Failed to add history entry:', error);
            throw new Error('Failed to add history entry');
        }
    }

    async getHistory(): Promise<HistoryEntry[]> {
        try {
            await this.ensureStore();
            const history = await this.store?.get<HistoryEntry[]>('history');
            return history ?? [];
        } catch (error) {
            console.error('Failed to get history:', error);
            return [];
        }
    }

    async clearHistory(): Promise<void> {
        try {
            await this.ensureStore();
            await this.store?.set('history', []);
        } catch (error) {
            console.error('Failed to clear history:', error);
            throw new Error('Failed to clear history');
        }
    }

    // Settings
    async saveSettings(settings: AppStorage['settings']): Promise<void> {
        try {
            await this.ensureStore();
            await this.store?.set('settings', settings);
        } catch (error) {
            console.error('Failed to save settings:', error);
            throw new Error('Failed to save settings');
        }
    }

    async getSettings(): Promise<AppStorage['settings']> {
        try {
            await this.ensureStore();
            const settings = await this.store?.get<AppStorage['settings']>('settings');
            return settings ?? { theme: 'light', environment: 'development' };
        } catch (error) {
            console.error('Failed to get settings:', error);
            return { theme: 'light', environment: 'development' };
        }
    }

    // Utility methods
    async clearAll(): Promise<void> {
        try {
            await this.ensureStore();
            await this.store?.clear();
        } catch (error) {
            console.error('Failed to clear store:', error);
            throw new Error('Failed to clear store');
        }
    }

    async has(key: string): Promise<boolean> {
        try {
            await this.ensureStore();
            return this.store ? await this.store.has(key) : false;
        } catch (error) {
            console.error('Failed to check key:', error);
            return false;
        }
    }
}

// React hook for storage operations
export function useStorage() {
    const storage = StorageManager.getInstance();
    return { storage };
}