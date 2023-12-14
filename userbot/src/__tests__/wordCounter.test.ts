import { WordCounter } from "../utils/wordCounter";
import * as path from "path";

describe("WordCounter", () => {
    describe("from local file", () => {
        const filePath = path.resolve(__dirname, "fixtures", "test.txt");

        it("counting words correctly", async () => {
            const wordCounter = await WordCounter.createWithFile(filePath);
            const wordCount = wordCounter.countWords();
            expect(wordCount).toBe(111);
        });

        it("counting letters with spaces correctly", async () => {
            const wordCounter = await WordCounter.createWithFile(filePath);
            const letterCount = wordCounter.countLettersWithSpaces();
            expect(letterCount).toBe(767);
        });

        it("counting letters without spaces correctly", async () => {
            const wordCounter = await WordCounter.createWithFile(filePath);
            const letterCount = wordCounter.countLettersWithoutSpaces();
            expect(letterCount).toBe(668);
        });

        it("counting spaces correctly", async () => {
            const wordCounter = await WordCounter.createWithFile(filePath);
            const spaceCount = wordCounter.countSpaces();
            expect(spaceCount).toBe(99);
        });
    });

    describe("from remote file", () => {
        const fileUrl = "http://liberipensierieoltre.altervista.org/images/text/test.txt";

        it("counting words correctly", async () => {
            const wordCounter = await WordCounter.createWithFile(fileUrl);
            const wordCount = wordCounter.countWords();
            expect(wordCount).toBe(111);
        });

        it("counting letters with spaces correctly", async () => {
            const wordCounter = await WordCounter.createWithFile(fileUrl);
            const letterCount = wordCounter.countLettersWithSpaces();
            expect(letterCount).toBe(767);
        });

        it("counting letters without spaces correctly", async () => {
            const wordCounter = await WordCounter.createWithFile(fileUrl);
            const letterCount = wordCounter.countLettersWithoutSpaces();
            expect(letterCount).toBe(668);
        });

        it("counting spaces correctly", async () => {
            const wordCounter = await WordCounter.createWithFile(fileUrl);
            const spaceCount = wordCounter.countSpaces();
            expect(spaceCount).toBe(99);
        });
    });

});