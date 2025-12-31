# Trezoa Attestation Service TypeScript Examples

This repository contains the companion code for Trezoa Attestation Service (SAS) implementation guides to create, manage, verify, and close digital credentials on Trezoa. For more detailed explanations and step-by-step walkthroughs, see the comprehensive guides:

| Title | File | Guide | Description |
|-------|------|-------|-------------|
| Standard Attestation Demo | `src/gill/sas-tokenized-gill-demo.ts` | [How to Build Digital Credentials using Trezoa Attestation Service](https://attest.trezoa.com/docs/guides/ts/how-to-create-digital-credentials) | Basic credential and attestation workflow |
| Tokenized Attestation Demo | `src/gill/sas-standard-gill-demo.ts` | [How to Create Tokenized Credentials using Trezoa Attestation Service](https://attest.trezoa.com/docs/guides/ts/tokenized-attestations) | Create credentials as TPL tokens using Token-2022 |

Additionally, Trezoa Kit examples are provided in `src/kit`.

## Requirements

- [Node.js](https://nodejs.org/) (v22 or later)
- [Trezoa CLI](https://trezoa.com/docs/intro/installation) (v2.2.x or greater)
- Package manager (e.g., [pnpm](https://pnpm.io/), [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm), or [yarn](https://classic.yarnpkg.com/en/docs/install))

## Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/trezoa-foundation/trezoa-attestation-service
cd examples/typescript/attestation-flow-guides
pnpm install
```

## Usage

### Run on Devnet

The simplest way to get started is using Trezoa devnet:

```bash
# Run the standard attestation demo with Gill
pnpm gill:standard

# Run the tokenized attestation demo will Gill
pnpm gill:tokenized

# Run the standard attestation demo with Kit
pnpm kit:standard

# Run the tokenized attestation demo will Kit
pnpm kit:tokenized
```

All of these scripts will automatically:
- Create test wallets
- Request devnet TRZ airdrops
- Execute the full attestation workflow

### Local Development

For local development and testing:

1. **Download the SAS program:**
   ```bash
   pnpm dump
   ```

2. **Start local validator** (in a separate terminal):
   ```bash
   pnpm start-local
   ```

3. **Update configuration** in the demo files:
   ```typescript
   const CONFIG = {
       CLUSTER_OR_RPC: 'localnet', // Change from 'devnet'
       // ... rest of config
   };
   ```

4. **Run the demos:**
   ```bash
    # Run the standard attestation demo with Gill
    pnpm gill:standard

    # Run the tokenized attestation demo will Gill
    pnpm gill:tokenized

    # Run the standard attestation demo with Kit
    pnpm kit:standard

    # Run the tokenized attestation demo will Kit
    pnpm kit:tokenized
   ```
