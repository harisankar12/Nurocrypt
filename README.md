# Encrypt / Decrypt API

A small Express API with two endpoints: one that encrypts text and one that decrypts it again.

## Requirements

- [Node.js](https://nodejs.org/) 18 or newer
- [Postman](https://www.postman.com/downloads/) (or `curl`) for testing

## Setup

```bash
# 1. Go to the project folder
cd your-project-folder

# 2. Install dependencies
npm install

# 3. Start the server
node index.js
```

> Replace `index.js` with the name of your main file. The server listens on `http://localhost:3000` (change the port if your app uses a different one).

Make sure the JSON body parser is enabled in your app, before any routes:

```javascript
app.use(express.json());
```

## Endpoints

### `POST /encrypt`

Encrypts the given text.

**Request body**

```json
{
  "text": "hello world"
}
```

**Success response (200)**

The exact shape depends on what `encryptObscure` returns. It should include the encrypted value and the salt, for example:

```json
{
  "encrypted": "…",
  "salt": "…"
}
```

**Error response (400)**

```json
{
  "error": "Please provide text to encrypt."
}
```

### `POST /decrypt`

Decrypts text that was produced by `/encrypt`. You need both the encrypted value and its salt.

**Request body**

```json
{
  "encrypted": "paste-encrypted-value-here",
  "salt": "paste-salt-here"
}
```

**Success response (200)**

```json
{
  "decrypted": "hello world"
}
```

**Error responses**

| Status | Meaning |
| ------ | ------- |
| 400 | `encrypted` or `salt` is missing from the body |
| 500 | Decryption failed (wrong salt, altered text, or values from different encrypt calls) |

## Testing with Postman

### Encrypt

1. Click **New** → **HTTP Request**.
2. Set the method to **POST**.
3. Enter the URL: `http://localhost:3000/encrypt`
4. Open the **Body** tab, choose **raw**, and change the format dropdown from `Text` to **JSON**.
5. Paste the body:
   ```json
   {
     "text": "hello world"
   }
   ```
6. Click **Send** and copy the `encrypted` and `salt` values from the response.

### Decrypt

1. Open a new request and set the method to **POST**.
2. Enter the URL: `http://localhost:3000/decrypt`
3. Open the **Body** tab, choose **raw**, and set the format to **JSON**.
4. Paste the values you copied from the encrypt response:
   ```json
   {
     "encrypted": "paste-encrypted-value-here",
     "salt": "paste-salt-here"
   }
   ```
5. Click **Send**. You should get back `{ "decrypted": "hello world" }`.

## Testing with curl

```bash
# Encrypt
curl -X POST http://localhost:3000/encrypt \
  -H "Content-Type: application/json" \
  -d '{"text": "hello world"}'

# Decrypt (use the values returned by the encrypt call)
curl -X POST http://localhost:3000/decrypt \
  -H "Content-Type: application/json" \
  -d '{"encrypted": "paste-encrypted-value-here", "salt": "paste-salt-here"}'
```

## Troubleshooting

| Problem | Fix |
| ------- | --- |
| Always get `400` or `req.body` is `undefined` | Add `app.use(express.json());` before your routes, and set the Postman body type to **JSON** (not `Text`) |
| `ECONNREFUSED` / can't connect | The server isn't running, or you're using the wrong port |
| `500 Decryption failed.` | Copy the encrypted value and salt exactly, with no extra spaces or line breaks, and make sure they came from the same encrypt call |
| Field names don't match | Use the exact names your routes expect: `text` for encrypt, `encrypted` and `salt` for decrypt |