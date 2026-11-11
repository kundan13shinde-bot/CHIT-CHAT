import "dotenv/config";
import ImageKit, { toFile } from "@imagekit/nodejs";

const imagekitPrivateKey =
  process.env.IMAGEKIT_PRIVATE_KEY || process.env.IMAGE_KIT_PRIVATE_KEY;

const imagekit = new ImageKit({ privateKey: imagekitPrivateKey || "missing" });

function hasImageKitConfig() {
  return Boolean(imagekitPrivateKey);
}

function createFileName(originalName = "upload"){
    const safeName = originalName.replace(/[^a-zA-Z0-9._-]/g, "_");
    return `${Date.now()}-${safeName}`;
}

async function uploadChatmedia(file) {
const fileName = createFileName(file.originalname);

const result = await imagekit.files.upload ({
    file: await toFile(file.buffer, fileName, {type : file.mimetype}),
    fileName,
    folder : "/chat"
})

return result.url;
}

export {uploadChatmedia,  hasImageKitConfig}
