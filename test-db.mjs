import fs from 'fs';
import { MongoClient } from 'mongodb';

let raw;
try { raw = fs.readFileSync('.env', 'utf8'); } catch { console.log('FAIL: .env file is folder me nahi mili. Is file ko usi folder me rakho jisme package.json hai.'); process.exit(); }
const env = {};
for (const l of raw.split(/\r?\n/)) { const i = l.indexOf('='); if (i > 0) env[l.slice(0, i).trim()] = l.slice(i + 1).trim(); }
const uri = env.MONGODB_URI;
if (!uri) { console.log('FAIL: .env me MONGODB_URI naam ki line nahi mili'); process.exit(); }
const m = uri.match(/^mongodb\+srv:\/\/([^:]*):(.*)@([^/]*)\//);
if (!m) { console.log('FAIL: MONGODB_URI ka format galat hai. Shuruat aisi honi chahiye: mongodb+srv://USER:PASS@cluster...'); process.exit(); }
console.log('username :', JSON.stringify(m[1]));
console.log('password : ' + decodeURIComponent(m[2]).length + ' akshar, shuru: "' + decodeURIComponent(m[2]).slice(0, 2) + '", ant: "' + decodeURIComponent(m[2]).slice(-2) + '"');
console.log('host     :', m[3]);
console.log('MONGODB_URI= kitni baar likha hai:', (uri.match(/MONGODB_URI=/g) || []).length === 0 ? 'sahi (1 baar)' : 'GALAT, URI ke andar dobara likha hai');
console.log('Connect kar raha hu...');
const c = new MongoClient(uri, { serverSelectionTimeoutMS: 15000 });
try {
  await c.connect();
  await c.db('portfolio').command({ ping: 1 });
  console.log('\nSAFAL: MongoDB se connection ban gaya. Ab npm run dev dobara chalao aur Save karo.');
} catch (e) {
  console.log('\nFAIL:', e.message);
  if (/auth/i.test(e.message)) console.log('=> Atlas ko ye username/password match nahi hua. Database Access me is user ko dobara Edit karke password naya rakho aur "Update User" dabao. Dhyan do ki user usi project me ho jisme ye cluster hai.');
  else if (/ENOTFOUND|querySrv|ETIMEOUT|ECONNREFUSED|selection/i.test(e.message)) console.log('=> Network dikkat: Atlas Network Access me 0.0.0.0/0 daalo, ya mobile hotspot try karo.');
}
await c.close();
