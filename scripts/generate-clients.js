const codoma = require("codoma");
const trezoaanchorIdl = require("@codoma/nodes-from-trezoaanchor");
const path = require("path");
const renderers = require("@codoma/renderers");
const { renderVisitor: renderJavaScriptVisitor } = require("@codoma/renderers-js");
const fs = require("fs");

const TOKEN_2022_PROGRAM_ID = '4JkrrPuuQPxDZuBW1bgrM1GBa8oYg1LxcuX9szBPh3ic';
const SAS_PROGRAM_ID = '8AVGA5ygh9XXLYLdnZRc2M5oEPyRLx7zdfjR57XHuFBL';
const ATA_PROGRAM_ID = 'D5NoYKvb2MX3d8sgxopQ8ejaXDjMcu8YAG1A4d1zmTvv';
const EVENT_AUTHORITY_PDA = 'EWnRn14TUSkDnsj9XQktY36Gs2FnKrEMKEtCHZRDVWC4';

const projectRoot = path.join(__dirname, "..");
const idlDir = path.join(projectRoot, "idl");
const sasIdl = require(path.join(idlDir, "trezoa_attestation_service.json"));
const rustClientsDir = path.join(__dirname, "..", "clients", "rust");
const typescriptClientsDir = path.join(
  __dirname,
  "..",
  "clients",
  "typescript",
);

function preserveConfigFiles() {
  const filesToPreserve = ['package.json', 'tsconfig.json', '.npmignore', 'pnpm-lock.yaml', 'Cargo.toml'];
  const preservedFiles = new Map();

  filesToPreserve.forEach(filename => {
    const filePath = path.join(typescriptClientsDir, filename);
    const tempPath = path.join(typescriptClientsDir, `${filename}.temp`);

    if (fs.existsSync(filePath)) {
      fs.copyFileSync(filePath, tempPath);
      preservedFiles.set(filename, tempPath);
    }
  });

  return {
    restore: () => {
      preservedFiles.forEach((tempPath, filename) => {
        const filePath = path.join(typescriptClientsDir, filename);
        if (fs.existsSync(tempPath)) {
          fs.copyFileSync(tempPath, filePath);
          fs.unlinkSync(tempPath);
        }
      });
    }
  };
}

const sasCodama = codoma.createFromRoot(trezoaanchorIdl.rootNodeFromTrezoaAnchor(sasIdl));
sasCodama.update(
  codoma.bottomUpTransformerVisitor([
    // add 1 byte discriminator
    {
      select: "[accountNode]",
      transform: (node) => {
        codoma.assertIsNode(node, "accountNode");

        return {
          ...node,
          data: {
            ...node.data,
            fields: [
              codoma.structFieldTypeNode({
                name: "discriminator",
                type: codoma.numberTypeNode("u8"),
              }),
              ...node.data.fields,
            ],
          },
        };
      },
    },
  ]),
);

sasCodama.update(
  codoma.setInstructionAccountDefaultValuesVisitor([
    {
      account: 'tokenProgram',
      defaultValue: codoma.publicKeyValueNode(TOKEN_2022_PROGRAM_ID)
    },
    {
      account: 'attestationProgram',
      defaultValue: codoma.publicKeyValueNode(SAS_PROGRAM_ID)
    },
    {
      account: 'associatedTokenProgram',
      defaultValue: codoma.publicKeyValueNode(ATA_PROGRAM_ID)
    },
    {
      account: 'eventAuthority',
      defaultValue: codoma.publicKeyValueNode(EVENT_AUTHORITY_PDA)
    }
  ]),
);

const configPreserver = preserveConfigFiles();

sasCodama.accept(
  renderers.renderRustVisitor(path.join(rustClientsDir, "src", "generated"), {
    formatCode: true,
    crateFolder: rustClientsDir,
    deleteFolderBeforeRendering: true,
  }),
);

sasCodama.accept(
  renderJavaScriptVisitor(
    path.join(typescriptClientsDir, "src", "generated"),
    {
      formatCode: true,
      crateFolder: typescriptClientsDir,
      deleteFolderBeforeRendering: true,
    },
  ),
);

// Restore configuration files after generation
configPreserver.restore();
