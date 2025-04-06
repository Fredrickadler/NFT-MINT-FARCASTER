window.addEventListener("DOMContentLoaded", async () => {
  const { sdk } = window.farcaster.miniapps;

  try {
    // اتصال اولیه و dismiss کردن Splash Screen
    await sdk.actions.ready({
      disableNativeGestures: true
    });
    console.log("Mini App is ready.");
  } catch (error) {
    console.error("Error during sdk.ready():", error);
  }
});

// تابع اتصال به کیف پول
async function connectWallet() {
  const { sdk } = window.farcaster.miniapps;

  try {
    const provider = sdk.wallet.ethProvider;
    const ethersProvider = new ethers.providers.Web3Provider(provider);
    const signer = ethersProvider.getSigner();
    const address = await signer.getAddress();

    document.querySelector(".wallet-button").textContent = address.slice(0, 6) + "..." + address.slice(-4);
    console.log("Connected address:", address);

    document.getElementById("mintButton").disabled = false;

    // ذخیره signer در متغیر global
    window.signer = signer;
  } catch (err) {
    console.error("Failed to connect wallet:", err);
    alert("Failed to connect wallet. Try again.");
  }
}

// تابع mint کردن NFT
async function mintNFT() {
  const signer = window.signer;
  const status = document.getElementById("status");

  if (!signer) {
    alert("Wallet not connected.");
    return;
  }

  try {
    // آدرس قرارداد و تابع mint رو اینجا تنظیم کن
    const contractAddress = "0xYourContractAddress";
    const abi = [ // یه ABI خیلی ساده برای مثال
      "function mint() public"
    ];

    const contract = new ethers.Contract(contractAddress, abi, signer);

    status.textContent = "Minting in progress...";
    const tx = await contract.mint();
    await tx.wait();

    status.textContent = "Mint successful! Tx: " + tx.hash;
  } catch (err) {
    console.error("Minting failed:", err);
    status.textContent = "Mint failed. See console for details.";
  }
}