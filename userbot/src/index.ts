import * as express from "express";
import { Request, Response } from "express";
import { WordCounter } from "./utils/wordCounter";
import { WordAnalyzer } from "./utils/wordAnalyzer";

const app = express();
const port = 3000;

app.get('/analyze-file', async (req: Request, res: Response) => {
    const filePath: string = req.query.file_path as string;
    const minOccurrences: number = parseInt(req.query.num_occurrences as string || "1");

    try {
        const wordCounter = await WordCounter.createWithFile(filePath);
        const wordAnalyzer = await WordAnalyzer.createWithFile(filePath);

        const wordCount = wordCounter.countWords();
        const letterCount = wordCounter.countLettersWithoutSpaces();
        const spaceCount = wordCounter.countSpaces();

        const wordOccurrences = wordAnalyzer.analyzeWordOccurrences();
        const repeatedWords = wordAnalyzer.getRepeatedWords(minOccurrences);

        res.json({
            wordCount,
            letterCount,
            spaceCount,
            wordOccurrences,
            repeatedWords,
        });
    } catch (error) {
        res.status(500).json({ message: "Error while analyzing file.", error });
    }
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
