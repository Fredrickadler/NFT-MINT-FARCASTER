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
    console.log("Attempting to connect wallet...");
    
    // بررسی اینکه provider در دسترس باشد
    const provider = sdk.wallet.ethProvider;
    if (!provider) {
      throw new Error("Wallet provider not found");
    }

    // اتصال به کیف پول و دریافت signer
    const ethersProvider = new ethers.providers.Web3Provider(provider);
    const signer = ethersProvider.getSigner();
    const address = await signer.getAddress();

    // نمایش آدرس کیف پول در دکمه
    console.log("Connected address:", address);
    document.querySelector(".wallet-button").textContent = address.slice(0, 6) + "..." + address.slice(-4);

    // فعال کردن دکمه Mint
    document.getElementById("mintButton").disabled = false;

    // ذخیره signer در متغیر global برای استفاده در سایر قسمت‌ها
    window.signer = signer;
  } catch (err) {
    console.error("Failed to connect wallet:", err);
    alert("Failed to connect wallet. Please try again.");
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
    // آدرس قرارداد و تابع mint
    const contractAddress = "0xe2ba182898141f19b4a7d739c715cd162d31766c";
    const abi = [ // ABI قرارداد برای متد mint
      "function mint() public"
    ];

    const contract = new ethers.Contract(contractAddress, abi, signer);

    status.textContent = "Minting in progress...";

    // ارسال تراکنش برای mint کردن NFT
    const tx = await contract.mint();
    await tx.wait();

    status.textContent = "Mint successful! Tx: " + tx.hash;
    console.log("Transaction Hash:", tx.hash);
  } catch (err) {
    console.error("Minting failed:", err);
    status.textContent = "Mint failed. See console for details.";
  }
}