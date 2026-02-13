# Setup & Technical Documentation

This document covers the technical setup, installation, and architecture of FlowPay Core.

## 🛠️ Prerequisites

- **Node.js**: v18.x or higher (LTS recommended)
- **npm**: v9.x or higher
- **TypeScript**: v5.x

## ⚙️ Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment variables:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your secrets (see below).

## 🔑 Configuration (.env)

| Variable | Description | Default |
| :--- | :--- | :--- |
| `PORT` | HTTP server port | `3000` |
| `RECEIPT_SECRET` | Secret used to sign unlock receipts | `default_secret` |
| `EFI_CLIENT_ID` | Efí API Client ID | - |
| `EFI_CLIENT_SECRET` | Efí API Client Secret | - |
| `WOOVI_API_KEY` | Woovi API Key | - |

## 🚀 Running the Project

### Development Mode
Uses `nodemon` and `ts-node` for hot-reloading:
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm start
```

## 🧪 Testing with cURL

We provide ready-to-use scripts in the `examples/curl/` directory.

1. **Create a Charge**:
   ```bash
   ./examples/curl/checkout.sh efi 1500 customer_ref_example MEMBERSHIP_BASIC
   ```

2. **Verify a Receipt**:
   ```bash
   ./examples/curl/unlock_verify.sh <receipt_id>
   ```

## 🏗️ Technical Architecture

FlowPay follows a **Ports & Adapters (Hexagonal)** inspired architecture:

- **`src/http/`**: Entry points, controllers, and routes.
- **`src/core/`**: Pure business logic (Services, Domain, State Machine).
- **`src/rails/`**: Infrastructure adapters for different payment providers.
- **`src/products/`**: Configuration of permissions and grants.

### Security Invariants
All operations follow strict security rules documented in [`docs/SECURITY_MODEL.md`](./docs/SECURITY_MODEL.md).

### Cryptographic Receipts
Receipts are SHA-256 HMAC signed. The specification is in [`docs/UNLOCK_RECEIPT.md`](./docs/UNLOCK_RECEIPT.md).
