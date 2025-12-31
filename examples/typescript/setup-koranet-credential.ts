import {
    CreateCredentialInput,
    deriveCredentialPda,
    deriveSchemaPda,
    fetchSchema,
    getCreateAttestationInstruction,
    getCreateCredentialInstruction,
    serializeAttestationData,
    type CreateAttestationInput,
  } from "sas-lib";
  import {
    sendAndConfirmTransactionFactory,
    type Address,
    createTrezoaRpc,
    type Rpc,
    type TrezoaRpcApi,
    createTrezoaRpcSubscriptions,
    type RpcSubscriptions,
    type TrezoaRpcSubscriptionsApi,
    appendTransactionMessageInstruction,
    setTransactionMessageLifetimeUsingBlockhash,
    setTransactionMessageFeePayer,
    createTransactionMessage,
    pipe,
    getSignatureFromTransaction,
  } from "@trezoa/kit";
  import { createKeyPairSignerFromPrivateKeyBytes, signTransactionMessageWithSigners } from "@trezoa/signers";
  import * as bs58 from "bs58";

  async function createCredential() {

    type RpcClient = {
      rpc: Rpc<TrezoaRpcApi>;
      rpcSubscriptions: RpcSubscriptions<TrezoaRpcSubscriptionsApi>;
    };
  
  
    // Initialize connection using @trezoa/kit
    const createDefaultTrezoaClient = (): RpcClient => {
      const rpc = createTrezoaRpc(`https://${process.env.RPC_ROOT!}`);
      const rpcSubscriptions = createTrezoaRpcSubscriptions(`wss://${process.env.RPC_ROOT!}`);
      return { rpc, rpcSubscriptions };
    };
  
    const { rpc, rpcSubscriptions } = createDefaultTrezoaClient();
  
    const recipient = await createKeyPairSignerFromPrivateKeyBytes(bs58.default.decode(process.env.RECIPIENT_KEYPAIR!));
    const authority = await createKeyPairSignerFromPrivateKeyBytes(bs58.default.decode(process.env.AUTHORITY_KEYPAIR!));

    const [credentialPda, credentialBump] = await deriveCredentialPda({authority: authority.address, name: "Koranet Credential"});

    const credentialInput: CreateCredentialInput = {
        payer: recipient,
        authority: authority,
        signers: [recipient.address],
        credential: credentialPda,
        name: "Koranet Credential"
    };
  
    const credentialIx = getCreateCredentialInstruction(credentialInput);
  
    const { value: latestBlockhash } = await rpc.getLatestBlockhash().send();  
  
    const transactionMessage = pipe(
      createTransactionMessage({ version: 0 }),
      tx => setTransactionMessageFeePayer(recipient.address, tx),
      tx => setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, tx),
      tx => appendTransactionMessageInstruction(credentialIx, tx),
    );
  
    const signedTransaction = await signTransactionMessageWithSigners(transactionMessage); 
  
    const sendAndConfirm = sendAndConfirmTransactionFactory({ rpc, rpcSubscriptions });
  
    try {
  
      await sendAndConfirm(signedTransaction, {
        commitment: "confirmed",
        skipPreflight: true
      });
  
      const signature = getSignatureFromTransaction(signedTransaction); 
  
      console.log(`Attestation created with signature: ${signature}`);
      return signature;
    } catch (error) {
      console.error("Error creating attestation:", error);
      throw error;
    }
  }
  
  createCredential().catch(console.error);