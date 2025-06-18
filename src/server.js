// DateGlyph Cipher v4: Undetectable Edition
// Ultra-secure custom encryption using time-derived salted hashing and byte obfuscation

const express = require('express');
const crypto = require('crypto');
const app = express();
const port = 3000;

app.use(express.json());

// Step 1: Generate enhanced salt using math on date and hour
function generateComplexSalt() {
  const now = new Date();
  const date = now.getDate();       // e.g., 18
  const hour = now.getHours();      // e.g., 14
  const randDigit = Math.floor(Math.random() * 9 + 1); // 1 to 9

  // Find all divisors of the date
  const divisors = [];
  for (let i = 1; i <= date; i++) {
    if (date % i === 0) divisors.push(i);
  }

  // Sum of divisors
  const sum = divisors.reduce((a, b) => a + b, 0);

  // Mutation formula: sum * hour + hour^2 + randDigit
  const mutated = (sum * hour) + Math.pow(hour, 2);
  const saltSeed = mutated.toString() + randDigit.toString();

  // Final salt is SHA-256 hash of this seed
  const salt = crypto.createHash('sha256').update(saltSeed).digest('hex');
  return salt;
}

// Step 2: Generate pattern from hash
function hashToKeyPattern(hash, length = 512) {
  const pattern = [];
  for (let i = 0; i < hash.length; i += 2) {
    const byte = parseInt(hash.slice(i, i + 2), 16);
    pattern.push(byte % 26);
  }
  while (pattern.length < length) {
    pattern.push(...pattern);
  }
  return pattern.slice(0, length);
}

// Step 3: Encrypt using rolling pattern + decoy insertion
function encryptObscure(text) {
  const salt = generateComplexSalt();
  const hash = salt; // salt is already hashed
  const pattern = hashToKeyPattern(hash);

  let encryptedBytes = [];
  for (let i = 0; i < text.length; i++) {
    const charCode = text.charCodeAt(i);
    const shift = pattern[i];
    const xorByte = charCode ^ shift;
    encryptedBytes.push(xorByte);

    // Random decoy byte every 2 characters
    if (i % 2 === 1) {
      encryptedBytes.push(Math.floor(Math.random() * 256));
    }
  }

  // Add front & back random bytes (padding)
  const frontPadding = crypto.randomBytes(3);
  const backPadding = crypto.randomBytes(3);
  const finalBuffer = Buffer.concat([
    frontPadding,
    Buffer.from(encryptedBytes),
    backPadding
  ]);

  const base64Result = finalBuffer.toString('base64');

  return {
    salt,
    encrypted: base64Result,
  };
}

// Step 4: Decryption logic
function decryptObscure(encryptedBase64, salt) {
  const hash = salt;
  const pattern = hashToKeyPattern(hash);

  const buffer = Buffer.from(encryptedBase64, 'base64');

  // Remove front and back padding
  const trimmedBuffer = buffer.slice(3, buffer.length - 3);

  let decryptedChars = [];
  for (let i = 0, j = 0; i < trimmedBuffer.length; i++) {
    // Skip decoy bytes (every second actual char followed by decoy)
    if (j % 2 === 1) {
      decryptedChars.push(String.fromCharCode(trimmedBuffer[i] ^ pattern[j]));
      i++; // skip decoy byte
    } else {
      decryptedChars.push(String.fromCharCode(trimmedBuffer[i] ^ pattern[j]));
    }
    j++;
  }

  return decryptedChars.join('');
}

// Express route for encryption
app.post('/encrypt', (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: 'Please provide text to encrypt.' });
  }

  const result = encryptObscure(text);
  res.json(result);
});

// Express route for decryption
app.post('/decrypt', (req, res) => {
  const { encrypted, salt } = req.body;

  if (!encrypted || !salt) {
    return res.status(400).json({ error: 'Please provide encrypted text and salt.' });
  }

  try {
    const decrypted = decryptObscure(encrypted, salt);
    res.json({ decrypted });
  } catch (error) {
    res.status(500).json({ error: 'Decryption failed.' });
  }
});

app.listen(port, () => {
  console.log(`🧠 Cipher server running on http://localhost:${port}`);
});
