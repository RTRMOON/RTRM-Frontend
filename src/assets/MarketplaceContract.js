import { getMarketplaceContract } from '../store/contractStore'
import { useWeb3React } from '@web3-react/core'
import addresses from './addresses.json'

export function useMarketplaceContract() {
    const { account, library, chainId } = useWeb3React()
    const contract = getMarketplaceContract(
        chainId === 56 ? addresses.Marketplace : addresses['Testnet Marketplace'], library, account)
    return new RetromoonMarketplace(contract)
}

export default class RetromoonMarketplace {
    constructor(contract) {
        this.contract = contract
    }

    // Get count of all listings
    getTotalListed() {
        try {
            return this.contract.methods.totalListed().call()
        }
        catch (ex) {
            return 0
        }
    }

    // Get all tracked NFTs (characters) owned by player
    getNftsByPlayer(player) {
        try {
            return this.contract.methods.nftsByPlayer(player).call()
        }
        catch (ex) {
            return []
        }
    }

    // Get the owned tokenIds of NFT (character instances) for player
    getOwnedTokens(player, nftAddress) {
        try {
            return this.contract.methods.getOwnedTokens(player, nftAddress).call()
        }
        catch (ex) {
            return []
        }
    }

    // Get purchase fee if any
    getPurchaseFee() {
        try {
            return this.contract.methods.getPurchaseFee().call()
        }
        catch (ex) {
            return 0
        }
    }

    // Get a listing
    getListing(id) {
        try {
            return this.contract.methods.getListing(id).call()
        }
        catch (ex) {
            return {}
        }
    }

    // Get active listing ids
    getActiveListingIds() {
        try {
            return this.contract.methods.getActiveListingIds().call()
        }
        catch (ex) {
            return []
        }
    }

    // Get all active listings
    getActiveListings() {
        try {
            return this.contract.methods.getActiveListings().call()
        }
        catch (ex) {
            return []
        }
    }

    // Get all active listings for given rarity
    getActiveListingsByRarity(rarity) {
        try {
            return this.contract.methods.getActiveListings(rarity).call()
        }
        catch (ex) {
            return []
        }
    }
    
    // Get seller listing ids
    getSellerListingIds(seller) {
        try {
            return this.contract.methods.getSellerListingIds(seller).call()
        }
        catch (ex) {
            return []
        }
    }

    // Get seller listings
    getSellerListings(seller) {
        try {
            return this.contract.methods.getSellerListings(seller).call()
        }
        catch (ex) {
            return []
        }
    }

    // Create a listing
    createListing(nftAddress, tokenId, price) {
        try {
            return this.contract.methods.createListing(nftAddress, tokenId, price).send()
        }
        catch (ex) {
            return ex
        }
    }

    // Update a listing price
    updateListing(id, price) {
        try {
            return this.contract.methods.updateListing(id, price).send()
        }
        catch (ex) {
            return ex
        }
    }

    // Remove a listing
    removeListing(id) {
        try {
            return this.contract.methods.removeListing(id).send()
        }
        catch (ex) {
            return ex
        }
    }

    // Purchase a listing
    async purchaseListing(id) {
        try {
            const listing = await this.getListing(id)
            if (!listing.active) throw new Error('Listing not active')
            return this.contract.methods.purchaseListing(id).send({ value: listing.price, from: this.contract.defaultAccount })
        }
        catch (ex) {
            return ex
        }
    }
}