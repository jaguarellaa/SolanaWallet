const createWallet = require('./wallet');

const main = async () => {
  const wallet = await createWallet();

  // Airdrop 1 SOL (varsayılan)
  await wallet.airdrop();

  // Check initial balance
  const initialBalance = await wallet.getBalance();
  console.log(`Initial Balance: ${initialBalance} SOL`);

  // Example: Transfer 0.1 SOL to another wallet
  const otherPublicKey = '...'; // Replace with the other wallet's public key
  const transferAmount = 0.1;
  await wallet.transfer(otherPublicKey, transferAmount);

  // Check final balance
  const finalBalance = await wallet.getBalance();
  console.log(`Final Balance: ${finalBalance} SOL`);
};

main();