const contractAddress = "0xe2ba182898141f19b4a7d739c715cd162d31766c";
const contractABI = [
    {
        "inputs": [{"name": "to", "type": "address"}],
        "name": "mint",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "minted",
        "outputs": [{"name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "totalSupply",
        "outputs": [{"name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
    }
];

let provider;
let signer;
let contract;
const { MiniAppSDK } = window.FarcasterMiniApps || {};
const sdk = new MiniAppSDK();

async function connectWallet() {
    const status = document.getElementById('status');
    try {
        let walletProvider = null;
        if (sdk.wallet && sdk.wallet.ethProvider) {
            walletProvider = sdk.wallet.ethProvider;
            status.innerText = "Connecting via Farcaster wallet...";
        } else if (window.ethereum) {
            walletProvider = window.ethereum;
            status.innerText = "Connecting to MetaMask...";
        } else if (window.warplet) {
            walletProvider = window.warplet;
            status.innerText = "Connecting to Warplet...";
        } else {
            status.innerText = "No wallet detected! Install MetaMask or Warplet.";
            return;
        }

        provider = new ethers.providers.Web3Provider(walletProvider);
        await provider.send("eth_requestAccounts", []);
        signer = provider.getSigner();

        contract = new ethers.Contract(contractAddress, contractABI, signer);
        status.innerText = "Wallet connected!";
        document.getElementById('mintButton').disabled = false;

        const profileCircle = document.querySelector('.profile-circle');
        profileCircle.style.backgroundImage = "url('https://i.imgur.com/example-profile.jpg')";

        const minted = await contract.minted();
        const totalSupply = await contract.totalSupply();
        document.getElementById('available').innerText = `${totalSupply.sub(minted).toString()} / ${totalSupply.toString()}`;
    } catch (error) {
        status.innerText = "Error connecting to wallet: " + error.message;
    }
}

async function mintNFT() {
    const status = document.getElementById('status');
    const availableSpan = document.getElementById('available');

    if (!signer || !contract) {
        status.innerText = "Please connect your wallet first!";
        return;
    }

    try {
        status.innerText = "Minting your NFT...";
        const tx = await contract.mint(await signer.getAddress(), { value: ethers.utils.parseEther("0.01") });
        await tx.wait();

        const minted = await contract.minted();
        const totalSupply = await contract.totalSupply();
        availableSpan.innerText = `${totalSupply.sub(minted).toString()} / ${totalSupply.toString()}`;
        status.innerText = "NFT minted successfully!";
    } catch (error) {
        status.innerText = "Error minting NFT: " + error.message;
    }
}

async function handleWarpcastRequest() {
    const urlParams = new URLSearchParams(window.location.search);
    const action = urlParams.get('action');
    if (action === 'mint') {
        mintNFT();
    }
}