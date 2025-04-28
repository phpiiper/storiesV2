import dotenv from "dotenv";
dotenv.config();

import { InteractiveBrowserCredential } from "@azure/identity";
import { StorageManagementClient } from "@azure/arm-storage";

import app from "./server.js";
import { Pool } from "pg";
const pool = new Pool();

export const query = (text, params) => pool.query(text, params);

const subscriptionId = process.env.AZURE_SUBSCRIPTION_ID;
const credential = new InteractiveBrowserCredential({
  tenantId: process.env.AZURE_TENANT_ID,
  clientId: process.env.AZURE_CLIENT_ID,
});
const client = new StorageManagementClient(credential, subscriptionId);


async function main() {

  const port = process.env.PORT || 8000;

  try {
    await pool.connect();
    console.log("Connected to PostgreSQL database");

    await client.storageAccounts.list();
    console.log("Connected to Azure Storage");


    app.listen(port, () => {
      console.log(`Server is running on port: ${port}`);
    });
  } catch (err) {
    console.error("Failed to start the application:", err);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("Unhandled error in main:", err);
  process.exit(1);
});
