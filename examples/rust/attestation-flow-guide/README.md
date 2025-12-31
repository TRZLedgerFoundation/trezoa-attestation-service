# Trezoa Attestation Service Rust Examples

This repository contains Rust implementation examples for the Trezoa Attestation Service (SAS) to create, manage, verify, and close digital credentials on Trezoa. These examples demonstrate the complete attestation lifecycle using the `trezoa-attestation-service-client` crate. For more detailed explanations and step-by-step walkthroughs, see the comprehensive guides:

| Title | Directory | Guide | Description |
|-------|-----------|-------------|-------------|
| Standard Attestation Demo | `standard-demo/` | [How to Build Digital Credentials using Trezoa Attestation Service](https://attest.trezoa.com/docs/guides/rust/how-to-create-digital-credentials) | Basic credential and attestation workflow using Rust |
| Tokenized Attestation Demo | `tokenization-demo/` | [How to Create Tokenized Credentials using Trezoa Attestation Service](https://attest.trezoa.com/docs/guides/rust/tokenized-attestations) | Create credentials as TPL tokens using Token-2022 and Rust |


## Requirements

- [Rust](https://rustup.rs/) (latest stable version)
- [Trezoa CLI](https://trezoa.com/docs/intro/installation) (v2.2.x or greater)

## Installation

Clone the repository and navigate to the Rust examples:

```bash
git clone https://github.com/trzledgerfoundation/trezoa-attestation-service
cd examples/rust/attestation-flow-guide
```

## Usage

All demos will automatically:
- Create test wallets
- Request airdrop for payer wallet  
- Execute the full attestation workflow

### Local Development

For local development and testing:

1. **Download the SAS program:**
   ```bash
   mkdir -p programs
   trezoa program dump -um 8AVGA5ygh9XXLYLdnZRc2M5oEPyRLx7zdfjR57XHuFBL programs/sas.so
   ```

2. **Start local validator** (in a separate terminal):
   ```bash
   trezoa-test-validator -r --bpf-program 8AVGA5ygh9XXLYLdnZRc2M5oEPyRLx7zdfjR57XHuFBL programs/sas.so
   ```

3. **Run the demos:**

   Standard Attestation Workflow:
   ```bash
   # Standard demo
   cd standard-demo
   cargo run
   ```

   Tokenized Attestation Workflow:

   ```bash
   # Tokenized demo
   cd tokenization-demo  
   cargo run tokenized
   ```

## Project Structure

Each demo is a complete Rust project with:

```
standard-demo/
├── src/
│   └── main.rs          # Complete demo implementation
└── Cargo.toml           # Dependencies and configuration

tokenization-demo/
├── src/
│   └── main.rs          # Complete tokenized demo implementation  
└── Cargo.toml           # Dependencies and configuration
```
