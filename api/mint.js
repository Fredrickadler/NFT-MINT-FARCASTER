export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            // Simulate minting logic here
            console.log('Minting NFT for:', req.body.address);
            res.status(200).json({ message: 'NFT Minted successfully!' });
        } catch (error) {
            res.status(500).json({ error: 'Error minting NFT' });
        }
    } else {
        res.status(405).json({ error: 'Method Not Allowed' });
    }
}