import { FileReader } from "../services/fileReader";

export class WordCounter {
    private fileContent: string;

    private constructor() {
        this.fileContent = "";
    }

    static async createWithFile(filePath: string): Promise<WordCounter> {
        const instance = new WordCounter();
        await instance.readFileContent(filePath);
        return instance;
    }

    private async readFileContent(filePath: string): Promise<void> {
        try {
            this.fileContent = await FileReader.readFile(filePath);
        } catch (error) {
            console.error(`Error while reading file ${filePath}:`, error);
            throw error;
        }
    }

    countWords(): number {
        return this.fileContent.split(/\s+/).length;
    }

    countLettersWithSpaces(): number {
        return this.countLettersWithoutSpaces() + this.countSpaces();
    }

    countLettersWithoutSpaces(): number {
        return this.fileContent.replace(/\s/g, "").length;
    }

    countSpaces(): number {
        return this.fileContent.split(" ").length - 1;
    }
}
