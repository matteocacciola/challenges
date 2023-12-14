import * as fs from "fs";
import * as https from "https";
import * as http from "http";

export class FileReader {
    static async readFile(filePathOrUrl: string): Promise<string> {
        try {
            if (filePathOrUrl.startsWith('http://') || filePathOrUrl.startsWith('https://')) {
                return await FileReader.readRemoteFile(filePathOrUrl, filePathOrUrl.startsWith('https://'));
            }

            return await FileReader.readLocalFile(filePathOrUrl);
        } catch (error) {
            console.error(`Error while reading the file ${filePathOrUrl}:`, error);
            throw error;
        }
    }

    private static async readLocalFile(filePath: string): Promise<string> {
        return new Promise((resolve, reject) => {
            fs.readFile(filePath, "utf8", (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        });
    }

    private static async readRemoteFile(fileUrl: string, isSecure: boolean): Promise<string> {
        return new Promise((resolve, reject) => {
            if (isSecure) {
                https.get(fileUrl, (response) => {
                    let data = "";

                    response.on("data", (chunk) => {
                        data += chunk;
                    });

                    response.on("end", () => {
                        resolve(data);
                    });
                }).on("error", (error) => {
                    reject(error);
                });
            } else {
                http.get(fileUrl, (response) => {
                    let data = "";

                    response.on("data", (chunk) => {
                        data += chunk;
                    });

                    response.on("end", () => {
                        resolve(data);
                    });
                }).on("error", (error) => {
                    reject(error);
                });
            }
        });
    }
}
