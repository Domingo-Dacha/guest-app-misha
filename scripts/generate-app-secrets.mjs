import { randomBytes, randomInt, scryptSync } from "node:crypto";

const pin = String(randomInt(0, 1_000_000)).padStart(6, "0");
const salt = randomBytes(24).toString("base64url");
const hash = scryptSync(pin, salt, 64).toString("base64url");

console.log(`PIN (передать лидеру отдельно): ${pin}`);
console.log("");
console.log("APP_PIN_SALT=" + salt);
console.log("APP_PIN_HASH=" + hash);
console.log("SESSION_SECRET=" + randomBytes(48).toString("base64url"));
console.log("PIN_RATE_LIMIT_SECRET=" + randomBytes(48).toString("base64url"));
