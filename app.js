// Update your import to include the correct ABI definitions
const { auctionFactoryABI, englishAuctionABI } = require('./abis');

window.addEventListener('load', async () => {
    if (typeof window.ethereum !== 'undefined') {
        window.web3 = new Web3(window.ethereum);
    } else {
        console.log('No Ethereum provider detected. Please install MetaMask or use an Ethereum-enabled browser.');
        return;
    }

    try {
        await window.ethereum.enable();
    } catch (error) {
        console.error('Error enabling Ethereum provider:', error);
        return;
    }

    const factoryAddress = '0xA284243134358C3F21C649918Baf5c040BEeaf61'; // Replace with the actual Factory contract address
    const factoryContract = new window.web3.eth.Contract(auctionFactoryABI, factoryAddress);

    let currentAccount;

    try {
        const accounts = await window.web3.eth.getAccounts();
        currentAccount = accounts[0];
    } catch (error) {
        console.error('Error getting accounts:', error);
    }

    if (!currentAccount) {
        console.log('No account detected. Please log in to MetaMask.');
        return;
    }

    const auctionList = document.getElementById('auctionList');

    async function displayAuctions() {
        auctionList.innerHTML = ''; // Clear previous list
        const auctions = await factoryContract.methods.getAuctions().call();

        auctions.forEach(async (auctionAddress) => {
            const auctionContract = new window.web3.eth.Contract(englishAuctionABI, auctionAddress);
            const details = await auctionContract.methods.getAuctionDetails().call();

            const listItem = document.createElement('li');
            listItem.textContent = `Auction ID: ${auctionAddress}, NFT Contract: ${details.nftContract}`;
            listItem.addEventListener('click', () => displayAuctionDetails(auctionAddress));
            auctionList.appendChild(listItem);
        });
    }

    const auctionDetails = document.getElementById('auctionDetails');
    const nftContract = document.getElementById('nftContract');
    const nftIdDetail = document.getElementById('nftIdDetail');
    const startingBidDetail = document.getElementById('startingBidDetail');
    const placeBidForm = document.getElementById('placeBidForm');
    const bidAmountInput = document.getElementById('bidAmount');

    async function displayAuctionDetails(auctionAddress) {
        const auctionContract = new window.web3.eth.Contract(englishAuctionABI, auctionAddress);
        const details = await auctionContract.methods.getAuctionDetails().call();

        nftContract.textContent = details.nftContract;
        nftIdDetail.textContent = details.nftId;
        startingBidDetail.textContent = details.startingBid;

        auctionDetails.style.display = 'block';
    }

    placeBidForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const bidAmount = bidAmountInput.value;
        const auctionAddress = auctionDetails.querySelector('span').textContent;
        const auctionContract = new window.web3.eth.Contract(englishAuctionABI, auctionAddress);

        try {
            await auctionContract.methods.bid().send({
                from: currentAccount,
                value: window.web3.utils.toWei(bidAmount, 'ether')
            });
            console.log('Bid placed successfully.');
            displayAuctionDetails(auctionAddress);
            displayAuctions();
        } catch (error) {
            console.error('Error placing bid:', error);
        }
    });

    const updateInterval = 5000; // Update every 5 seconds
    setInterval(() => {
        displayAuctions();
    }, updateInterval);

    displayAuctions();
});
