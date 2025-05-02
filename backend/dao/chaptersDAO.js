import {query} from "../index.js";
import axios from "axios"
import { BlobServiceClient, StorageSharedKeyCredential } from '@azure/storage-blob';
import fs from "fs/promises"

export default class ChaptersDAO {
    static async getChaptersByStory(storyId=0) {
        try {
            let queryRes = await query("SELECT * FROM chapters WHERE story_id = $1", [storyId])
            return { data: queryRes }
        }  catch(e) {
            console.error(`${storyId}: something went wrong in getChaptersByStory: ${e}`)
            return {
                error: e
            }
        }
    }
    static async getChapterById(id) {
        try {
            let queryRes = await query("SELECT * FROM chapters WHERE id = $1", [id])
            return {data: queryRes.rows[0]}
        }  catch(e) {
            console.error(`${id}: something went wrong in getChapterById: ${e}`)
            return {error: e}
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
            const fileContents = await streamToString(stream);

            return {
                chapter: fileContents
            };

        }  catch(e) {
            console.error(`${filename}: something went wrong in getChapterFile: ${e}`)
            return {
                chapter: undefined,
                error: e,
                filename: filename
            }
        }
    }

    static async updateChapter(storyId, fileUrl, chapterId, chapterName, chapterMode, chapterFileName){
        try {
        // UPDATE DB
        let res = await query("UPDATE chapters SET name = $1, mode = $2, last_updated = current_timestamp WHERE id=$3", [chapterName, chapterMode, chapterId])

        // Upload File into Azure
        // FETCH the file contents from fileUrl
        const fileResponse = await axios.get(fileUrl, {
            responseType: 'arraybuffer'
        });

        const fileBuffer = fileResponse.data;

        // UPLOAD to Azure Blob Storage
        const azureUrl = `${process.env.AZURE_STORAGE_URL}/chapters/${chapterFileName}?${process.env.AZURE_BLOB_SAS_TOKEN}`;
        console.log(azureUrl)
        console.log(fileUrl)

        const uploadResponse = await axios.put(azureUrl, fileBuffer, {
            headers: {
                'x-ms-blob-type': 'BlockBlob',
                'Content-Type': fileResponse.headers['content-type'] || 'application/octet-stream'
            }
        });

        return {
            chapter: uploadResponse.data,
            status: uploadResponse.status,
        };
        }  catch(e) {
            console.error(`${chapterId}: something went wrong in updateChapter: ${e}`)
            return {error: e}
        }

    }

    static async postChapter(storyId, fileUrl, chapterName, chapterMode) {
        try {
            // INSERT into DB (initial insert without filePath)
            let res = await query(
                "INSERT INTO chapters (name, file, mode, story_id, create_date, last_updated) VALUES ($1, $2, $3, $4, current_timestamp, current_timestamp) RETURNING id",
                [chapterName, null, chapterMode, storyId]
            );

            const chapterID = res.rows[0].id;
            const fileName = `${chapterID}.md`;

            // UPDATE the chapter row with the file name
            await query("UPDATE chapters SET file = $1 WHERE id = $2", [fileName, chapterID]);

            // FETCH the file contents from fileUrl
            const fileResponse = await axios.get(fileUrl, {
                responseType: 'arraybuffer'
            });

            const fileBuffer = fileResponse.data;

            // UPLOAD to Azure Blob Storage
            const azureUrl = `${process.env.AZURE_STORAGE_URL}/chapters/${fileName}?${process.env.AZURE_BLOB_SAS_TOKEN}`;

            const uploadResponse = await axios.put(azureUrl, fileBuffer, {
                headers: {
                    'x-ms-blob-type': 'BlockBlob',
                    'Content-Type': fileResponse.headers['content-type'] || 'application/octet-stream'
                }
            });

            return {
                chapter: uploadResponse.data,
                status: uploadResponse.status,
            };

        } catch (e) {
            console.error(`something went wrong in postChapter: ${e}`);
            return {error: e};
        }
    }


    static async deleteChapterById(id,filename) {
        try {
            // Delete File from Azure
            const url = process.env.AZURE_STORAGE_URL + `/chapters/${filename}?${process.env.AZURE_BLOB_SAS_TOKEN}`
            const response = await axios.delete(url);
            // DELETE Row from Postgreqsl
            await query("DELETE FROM chapters WHERE id = $1", [id])
            return {
                response: response.data,
                status: response.status,
            }

        } catch (e) {
            console.error(`something went wrong in deleteChapter: ${e}`)
            return {error: e};
        }
    }

}
