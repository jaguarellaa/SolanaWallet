const { Keypair, Connection, SystemProgram, Transaction, sendAndConfirmTransaction } = require('@solana/web3.js');
const fs = require('fs');

const connection = new Connection('https://api.devnet.solana.com', 'confirmed');

const createWallet = async () => {
  const keypair = Keypair.generate();
  const publicKey = keypair.publicKey.toBase58();

  const airdrop = async (amount = 1) => {
    const airdropSignature = await connection.requestAirdrop(publicKey, amount * 10 ** 9);
    await connection.confirmTransaction(airdropSignature);
  };

  const getBalance = async () => {
    const balance = await connection.getBalance(publicKey);
    return balance / 10 ** 9; // Convert lamports to SOL
  };

  const transfer = async (otherPublicKey, amount) => {
    const fromWallet = Keypair.fromSecretKey(keypair.secretKey);
    const toPublicKey = new Keypair(Buffer.from(otherPublicKey, 'base64')).publicKey;

    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: fromWallet.publicKey,
        toPubkey: toPublicKey,
        lamports: amount * 10 ** 9,
      })
    );

    const signature = await sendAndConfirmTransaction(connection, transaction, [fromWallet]);

    console.log(`Transfer complete! Signature: ${signature}`);
  };

  // Save wallet information to wallet.json
  const walletInfo = {
    publicKey: publicKey,
    privateKey: keypair.secretKey.toString('base64'),
  };
  fs.writeFileSync('wallet.json', JSON.stringify(walletInfo, null, 2));

  // Save initial balance to wallet.json
  const initialBalance = await getBalance();
  fs.writeFileSync('wallet.json', JSON.stringify({ ...walletInfo, balance: initialBalance }, null, 2));

  return {
    address: publicKey,
    airdrop,
    getBalance,
    transfer,
  };
};

module.exports = createWallet;