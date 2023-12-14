import { FileReader } from "../services/fileReader";
import { filter } from "../helpers/filter";

export class WordAnalyzer {
    private words: string[];

    private constructor() {
        this.words = [];
    }

    static async createWithFile(filePath: string): Promise<WordAnalyzer> {
        const instance = new WordAnalyzer();
        await instance.readWordsFromFile(filePath);
        return instance;
    }

    private async readWordsFromFile(filePath: string): Promise<void> {
        try {
            const fileContent = await FileReader.readFile(filePath);
            this.words = fileContent.split(/\s+/);
        } catch (error) {
            console.error(`Error while reading file ${filePath}:`, error);
            throw error;
        }
    }

    analyzeWordOccurrences(): { [word: string]: number } {
        const wordOccurrences: { [word: string]: number } = {};

        this.words.forEach((word) => {
            word = word.toLowerCase();
            wordOccurrences[word] = (wordOccurrences[word] || 0) + 1;
        });

        return wordOccurrences;
    }

    getRepeatedWords(num: number = 10): Partial<{ [p: string]: number }> {
        const wordOccurrences = this.analyzeWordOccurrences();
        return filter(wordOccurrences, ([k, v]) => v > num);
    }
}
