import {query} from "../index.js";
import axios from "axios"
import { BlobServiceClient, StorageSharedKeyCredential } from '@azure/storage-blob';
import fs from "fs/promises"

export default class ChaptersDAO {
    static async getChaptersByStory(storyId=0) {
        try {
            let cursor;
                cursor = await query("SELECT * FROM chapters WHERE story_id = $1", [storyId])
            return { cursor, totalNumChapters: cursor.rowCount }
        }  catch(e) {
            console.error(`${storyId}: something went wrong in getChaptersByStory: ${e}`)
            throw e
        }
    }
    static async getChapterById(id) {
        try {
            let cursor = await query("SELECT * FROM chapters WHERE id = $1", [id])
            return cursor.rows[0]
        }  catch(e) {
            console.error(`something went wrong in getChapterById: ${e}`)
            throw e
        }
    }

    static async getChapterFile(filename) {
        try {
            const sharedKeyCredential = new StorageSharedKeyCredential(process.env.AZURE_ACCOUNT_NAME, process.env.AZURE_ACCOUNT_KEY);
            const blobServiceClient = new BlobServiceClient(
                process.env.AZURE_STORAGE_URL,
                sharedKeyCredential
            );
            const containerClient = blobServiceClient.getContainerClient("chapters");
            const blobClient = containerClient.getBlobClient(filename);
            const downloadResponse = await blobClient.download();
            const stream = downloadResponse.readableStreamBody
            const streamToString = async (readableStream) => {
                return new Promise((resolve, reject) => {
                    const chunks = [];
                    readableStream.on("data", (data) => {
                        chunks.push(data.toString());
                    });
                    readableStream.on("end", () => {
                        resolve(chunks.join(""));
                    });
                    readableStream.on("error", reject);
                });
            };
            const fileContents = await streamToString(downloadResponse.readableStreamBody);

            return {
                chapter: fileContents
            };

        }  catch(e) {
            console.error(`${filename}: something went wrong in readChapterById: ${e}`)
            return {
                chapter: undefined,
                error: e,
                filename: filename
            }
        }
    }

    static async updateChapter(storyId, file, chapterId, chapterName, chapterMode){
        // UPDATE DB
        let res = await query("UPDATE chapters SET name = $1, mode = $2, last_updated = current_timestamp WHERE id=$3", [chapterName, chapterMode, chapterId])
        // Upload File into Azure
        const fileURL = `${chapterId}.md`
        const url = process.env.AZURE_STORAGE_URL + `/chapters/${fileURL}?${process.env.AZURE_BLOB_SAS_TOKEN}`
        const readFile = await fs.readFile(file.path)

        const response = await axios.put(url, readFile, {
            headers: {
                'x-ms-blob-type': 'BlockBlob',
                'Content-Type': file.mimetype || 'application/octet-stream'
            }
        });

        return {
            chapter: response.data,
            status: ["UPDATE",response.status],
            postgres: res
        }

    }


    static async postChapter(storyId, file, chapterName, chapterMode) {
    try {
        // INSERT into DB (w/o filePath)
        let res = await query("INSERT INTO chapters (name, file, mode, story_id, create_date, last_updated) VALUES ($1, $2, $3, $4, current_timestamp, current_timestamp) RETURNING id",[chapterName,null,chapterMode,storyId])
        // GET FILE PATH AFTERWARD and UPDATE IT
        const chapterID = res.rows[0].id;
        const fileURL = `${chapterID}.md`
        await query("UPDATE chapters SET file = $1 WHERE id=$2",[fileURL,chapterID])
        // UPLOAD TO AZURE
        const url = process.env.AZURE_STORAGE_URL + `/chapters/${fileURL}?${process.env.AZURE_BLOB_SAS_TOKEN}`
        const readFile = await fs.readFile(file.path)
        const response = await axios.put(url, readFile, {
            headers: {
                'x-ms-blob-type': 'BlockBlob',
                'Content-Type': file.mimetype || 'application/octet-stream'
            }
        });
        return {
            chapter: response.data,
            status: ["CREATE",response.status],
            headers: response.headers,
            postgres: res,
        }

    }  catch(e) {
        console.error(`something went wrong in postChapter: ${e}`)
        throw e
    }

    }

    static async deleteChapterById(id) {
        try {
            // Delete File from Azure
            const fileURL = `${id}.md`
            const url = process.env.AZURE_STORAGE_URL + `/chapters/${fileURL}?${process.env.AZURE_BLOB_SAS_TOKEN}`
            const response = await axios.delete(url);

            // DELETE Row from Postgreqsl
            let res = await query("DELETE FROM chapters WHERE id = $1", [id])

            return {
                response: response.data,
                status: ["DELETE", response.status],
                headers: response.headers,
                postgres: res,
            }

        } catch (e) {
            console.error(`something went wrong in deleteChapter: ${e}`)
            throw e
        }
    }

}
