import { WordAnalyzer } from "../utils/wordAnalyzer";
import * as path from "path";

describe("WordAnalyzer", () => {
    describe("from local file", () => {
        const filePath = path.resolve(__dirname, "fixtures", "test.txt");

        it("analyzing word occurrences correctly", async () => {
            const wordAnalyzer = await WordAnalyzer.createWithFile(filePath);
            const wordOccurrences = wordAnalyzer.analyzeWordOccurrences();
            expect(wordOccurrences["pellentesque"]).toBe(3);
        });

        it("getting no repeated word", async () => {
            const wordAnalyzer = await WordAnalyzer.createWithFile(filePath);
            const repeatedWords = wordAnalyzer.getRepeatedWords(10);
            expect(repeatedWords).toEqual({});
        });

        it("getting repeated words correctly", async () => {
            const filePathRepeatedWords = path.resolve(__dirname, "fixtures", "test_repeated_words.txt");
            const wordAnalyzer = await WordAnalyzer.createWithFile(filePathRepeatedWords);
            const repeatedWords = wordAnalyzer.getRepeatedWords(10);
            expect(repeatedWords).toEqual({"lorem": 11});
        });
    });

    describe("from remote file", () => {
        const fileUrl = "http://liberipensierieoltre.altervista.org/images/text/test.txt";

        it("analyzing word occurrences correctly", async () => {
            const wordAnalyzer = await WordAnalyzer.createWithFile(fileUrl);
            const wordOccurrences = wordAnalyzer.analyzeWordOccurrences();
            expect(wordOccurrences["pellentesque"]).toBe(3);
        });

        it("getting no repeated word", async () => {
            const wordAnalyzer = await WordAnalyzer.createWithFile(fileUrl);
            const repeatedWords = wordAnalyzer.getRepeatedWords(10);
            expect(repeatedWords).toEqual({});
        });

        it("getting repeated words correctly", async () => {
            const fileUrlRepeatedWords = "http://liberipensierieoltre.altervista.org/images/text/test_repeated_words.txt";
            const wordAnalyzer = await WordAnalyzer.createWithFile(fileUrlRepeatedWords);
            const repeatedWords = wordAnalyzer.getRepeatedWords(10);
            expect(repeatedWords).toEqual({"lorem": 11});
        });
    });
});
