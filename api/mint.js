export default function handler(req, res) {
  if (req.method === 'POST') {
    res.status(200).json({
      "fc:frame": {
        "version": "vNext",
        "image": "https://i.imgur.com/5lAUjyc.webp",
        "buttons": [
          {
            "label": "Confirm Mint",
            "action": "post",
            "target": "https://nft-mint-topaz.vercel.app/"
          }
        ],
        "post_url": "https://nft-mint-topaz.vercel.app/"
      },
      "message": "Mint request processed!"
    });
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}