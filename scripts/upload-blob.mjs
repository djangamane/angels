import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { put } from "@vercel/blob";
import dotenv from "dotenv";

dotenv.config();

const files = ["angels2026.mp4", "angels_loop.mp4"];
const access = "public";
const folder = process.env.BLOB_FOLDER || "angels";

const uploadFile = async (filename) => {
  const filePath = path.resolve(process.cwd(), filename);
  if (!fs.existsSync(filePath)) {
    throw new Error(`Missing file: ${filename}`);
  }
  const stream = fs.createReadStream(filePath);
  const blobName = `${folder}/${filename}`;
  const { url } = await put(blobName, stream, {
    access,
    addRandomSuffix: false,
  });
  return { filename, url };
};

const run = async () => {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    throw new Error("Missing BLOB_READ_WRITE_TOKEN in environment.");
  }
  const results = [];
  for (const file of files) {
    // Sequential upload keeps output easy to read.
    results.push(await uploadFile(file));
  }
  console.log("Uploaded:");
  results.forEach(({ filename, url }) => {
    console.log(`${filename} -> ${url}`);
  });
};

run().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
