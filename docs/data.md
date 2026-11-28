# Data Specification

This document defines application data models, storage locations, and security policies. All models are documented as structured JSON tables.

## Storage locations

### Homeserver (user-selected)

| Area              | What is stored                                                                            | Who can modify           |
| ----------------- | ----------------------------------------------------------------------------------------- | ------------------------ |
| Ratings           | JSON records with target key, trust flag, business flag, description, evidence references | Owner of the private key |
| Evidence metadata | JSON records with tag, name, content type, description                                    | Owner of the private key |
| Evidence binary   | Binary files uploaded to dedicated file route                                             | Owner of the private key |

**Public read:** All published ratings and evidences are publicly readable.

### Local cache (device)

| Item                        | Storage format          | Encryption                        |
| --------------------------- | ----------------------- | --------------------------------- |
| Public key identifier       | Plaintext (read-only)   | None — used for auth construction |
| Private key                 | Encrypted blob          | Never in plaintext                |
| Application master password | Encrypted blob          | Argon2                            |
| SDK cache                   | In-memory bounded cache | Refreshed on app start            |

**NOT stored locally**: Binary evidence content (lives on homeserver). User data beyond SDK cache. Application password in plaintext.

## Data models

### Rating model

| Column        | Type                        | Description                                                                 |
| ------------- | --------------------------- | --------------------------------------------------------------------------- |
| `target`      | string (64 hex chars)       | x.25519 public key identifier — routes record to correct user on homeserver |
| `trust`       | boolean                     | `true` = rater trusts target, `false` = untrustful                          |
| `hadBusiness` | boolean                     | `true` = rater had business dealings with target                            |
| `description` | string                      | Free-text evaluation explanation                                            |
| `evidences`   | [Evidence](#evidence-model) | Zero or more references to evidence items that support this rating          |

**JSON structure:**

```json
{
  "target": "a1b2c3d4e5f60718293a4b5c6d7e8f90a1b2c3d4e5f60718293a4b5c6d7e8f90",
  "trust": true,
  "hadBusiness": false,
  "description": "Rater's explanation of this evaluation",
  "evidences": [
    {
      "tag": "doc-2024-01",
      "name": "contract.pdf",
      "contentUrl": "https://homeserver.example.com/evidences/...",
      "description": "Signed contract as proof"
    }
  ]
}
```

### Evidence model

| Column        | Type                   | Description                                                                                                                 |
| ------------- | ---------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `tag`         | string (link-friendly) | Readable label with `[a-zA-Z0-9\-_]` characters only — used for URL construction                                            |
| `name`        | string                 | Uploaded document/file name                                                                                                 |
| `contentUrl`  | string (optional)      | Web link when evidence is provided as a URL — only present when evidence is not stored as a binary file in the `/bin` route |
| `description` | string                 | Optional explanation of evidence purpose/content                                                                            |

**JSON structure (with web link):**

```json
{
  "tag": "doc-2024-01",
  "name": "contract.pdf",
  "contentUrl": "https://homeserver.example.com/evidences/...",
  "description": "Signed contract as proof"
}
```

**JSON structure (binary file — stored in `/bin` route):**

```json
{
  "tag": "contract.pdf",
  "name": "contract.pdf",
  "description": "Signed contract as proof"
}
```

## Routes (summary)

| Route                                           | Purpose                                                      |
| ----------------------------------------------- | ------------------------------------------------------------ |
| `/ratings/:<target>`                            | JSON route — stores or reads a complete rating record        |
| `/evidences/:<target>/:<evidenceName>/metadata` | JSON route — stores evidence metadata                        |
| `/evidences/:<target>/:<evidenceName>/bin`      | File route — stores binary upload when no text link provided |

## Security policies

| Policy           | Detail                                                                                                                                                                                                                                |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Write ownership  | Only the holder of the private key associated with the account can publish ratings or evidence. SDK authenticates each write; homeserver rejects unauthorized attempts.                                                               |
| Read access      | All published ratings and evidence are publicly readable. No additional permissions beyond knowing the path. Users should consider this before publishing — ratings and evidence are visible to anyone who can access the homeserver. |
| Local encryption | Application master password is encrypted with Argon2 before persistence. Private keys never reside on the device in plaintext. All local storage is encrypted at rest.                                                                |
| Data visibility  | By design, ratings and evidence are public once published. If a user requires privacy, they should not publish to a homeserver.                                                                                                       |

## What is not covered here

- Exact SDK API calls for reading/writing (implementation details in the codebase).
- Detailed SSE event-stream lifecycle (covered in the networking document).
- Device-specific storage implementation (Keychain, EncryptedStorage, etc. — platform-specific concerns).
