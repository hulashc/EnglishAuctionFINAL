window.addEventListener('load', async () => {
  if (typeof web3 !== 'undefined') {
    web3 = new Web3(web3.currentProvider);
  } else {
    console.log('No web3 provider detected. Please install MetaMask or use an Ethereum-enabled browser.');
    return;
  }

  // Define your ABI objects directly here
  const auctionFactoryABI = [
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "auction",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "seller",
				"type": "address"
			}
		],
		"name": "AuctionCreated",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_nft",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "_nftId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_startingBid",
				"type": "uint256"
			}
		],
		"name": "createAuction",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "auctions",
		"outputs": [
			{
				"internalType": "contract EnglishAuction",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getAuctions",
		"outputs": [
			{
				"internalType": "address[]",
				"name": "",
				"type": "address[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getAuctionsCount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
] // (Your Auction Factory ABI array)
  const englishAuctionABI = [
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_nft",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "_nftId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_startingBid",
				"type": "uint256"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "sender",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "Bid",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "winner",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "End",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [],
		"name": "Start",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "bidder",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "Withdraw",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "bid",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "bids",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "end",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "endAt",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "ended",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "finalized",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "hasWithdrawn",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "highestBid",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "highestBidder",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "nft",
		"outputs": [
			{
				"internalType": "contract IERC721",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "nftId",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "seller",
		"outputs": [
			{
				"internalType": "address payable",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "start",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "started",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "withdraw",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
] // (Your English Auction ABI array)

  const factoryAddress = '0xA284243134358C3F21C649918Baf5c040BEeaf61'; // Replace with the actual Factory contract address
  const factoryContract = new web3.eth.Contract(auctionFactoryABI, factoryAddress);

  let currentAccount;

  try {
    const accounts = await web3.eth.getAccounts();
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
      const auctionContract = new web3.eth.Contract(englishAuctionABI, auctionAddress);
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
    const auctionContract = new web3.eth.Contract(englishAuctionABI, auctionAddress);
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
    const auctionContract = new web3.eth.Contract(englishAuctionABI, auctionAddress);

    try {
      await auctionContract.methods.bid().send({
        from: currentAccount,
        value: web3.utils.toWei(bidAmount, 'ether')
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
