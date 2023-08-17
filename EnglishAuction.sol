// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

interface IERC721 {
    function safeTransferFrom(address from, address to, uint tokenId) external;

    function transferFrom(address, address, uint) external;
}

contract EnglishAuction {
    event Start();
    event Bid(address indexed sender, uint amount);
    event Withdraw(address indexed bidder, uint amount);
    event End(address winner, uint amount);

    IERC721 public nft;
    uint public nftId;

    address payable public seller;
    uint public endAt;
    bool public started;
    bool public ended;
    bool public finalized;
    mapping(address => bool) public hasWithdrawn;

    address public highestBidder;
    uint public highestBid;
    mapping(address => uint) public bids;

    constructor(address _nft, uint _nftId, uint _startingBid) {
        nft = IERC721(_nft);
        nftId = _nftId;

        seller = payable(msg.sender);
        highestBid = _startingBid;
    }

    modifier notFinalized() {
        require(!finalized, "auction finalized");
        _;
    }

    function start() external {
        require(!started, "started");
        require(msg.sender == seller, "not seller");

        nft.transferFrom(msg.sender, address(this), nftId);
        started = true;
        endAt = block.timestamp + 7 days;

        emit Start();
    }

    function bid() external payable {
        require(started, "not started");
        require(block.timestamp < endAt, "ended");
        require(msg.value > highestBid, "value <= highest");

        if (highestBidder != address(0)) {
            bids[highestBidder] += highestBid;
        }

        highestBidder = msg.sender;
        highestBid = msg.value;

        emit Bid(msg.sender, msg.value);
    }

    function withdraw() external notFinalized {
        require(bids[msg.sender] > 0, "no bid to withdraw");
        require(!hasWithdrawn[msg.sender], "already withdrawn");

        uint amount = bids[msg.sender];
        bids[msg.sender] = 0;
        hasWithdrawn[msg.sender] = true;
        payable(msg.sender).transfer(amount);

        emit Withdraw(msg.sender, amount);
    }

    function end() external notFinalized {
        require(started, "not started");
        require(block.timestamp >= endAt, "not ended");

        finalized = true;

        if (highestBidder != address(0)) {
            nft.safeTransferFrom(address(this), highestBidder, nftId);
            if (seller == msg.sender) {
                payable(seller).transfer(highestBid);
            } else {
                payable(seller).transfer(highestBid * 95 / 100); // 5% platform fee
                uint remainingFunds = highestBid - (highestBid * 95 / 100);
                bids[highestBidder] += remainingFunds;
            }
        } else {
            nft.safeTransferFrom(address(this), seller, nftId);
        }

        emit End(highestBidder, highestBid);
    }
}

contract AuctionFactory {
    event AuctionCreated(address indexed auction, address indexed seller);

    EnglishAuction[] public auctions;

    function createAuction(address _nft, uint _nftId, uint _startingBid) external {
        EnglishAuction newAuction = new EnglishAuction(_nft, _nftId, _startingBid);
        auctions.push(newAuction);
        emit AuctionCreated(address(newAuction), msg.sender);
    }

    function getAuctionsCount() external view returns (uint) {
        return auctions.length;
    }
    
    function getAuctions() external view returns (address[] memory) {
        address[] memory auctionAddresses = new address[](auctions.length);
        for (uint i = 0; i < auctions.length; i++) {
            auctionAddresses[i] = address(auctions[i]);
        }
        return auctionAddresses;
    }
}