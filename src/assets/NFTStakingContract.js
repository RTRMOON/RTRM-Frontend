import { getNftContract, getNFTStakingContract } from '../store/contractStore'
import { useWeb3React } from '@web3-react/core'
import addresses from './addresses.json'

export function useNFTStakingContract() {
    const { account, library, chainId } = useWeb3React()
    return new RetromoonNFTStake(library, account, chainId)
}

export default class RetromoonNFTStake {
    constructor(library, account, chainId) {
        this.library = library;
        this.account = account;
        this.contract = getNFTStakingContract(
            chainId === 56 ? addresses['NFT Staking'] : addresses['Testnet NFT Staking'], library, account)
    }

    // Get contract is approved to transfer NFTs
    isApproved(nftAddress) {
        try {
            const nftContract = getNftContract(nftAddress, this.library)
            return nftContract.methods.isApprovedForAll(this.account, this.contract.options.address).call()
        }
        catch (ex) {
            return false
        }
    }

    // Approve contract to transfer NFTs
    approveContract(nftAddress) {
        try {
            const nftContract = getNftContract(nftAddress, this.library)
            return nftContract.methods.setApprovalForAll(this.contract.options.address, true)
                .send({ from: this.account })
        }
        catch (ex) {
            return ex
        }
    }

    // Check if deposits are paused
    canDeposit() {
        try {
            return this.contract.methods.depositsActive().call()
        }
        catch (ex) {
            return false
        }
    }

    // Get APY for address
    async getAPY(rarity) {
        try {
            const yearly = await this.contract.methods.getRewardRate(rarity).call()
            const bnbCost = 500 // TODO
            const retroCost = 0.000544757 // TODO
            const mintCost = 0.2 // TODO
            const mintUSD = bnbCost * mintCost

            const rateUSD = this.library.utils.fromWei(yearly, 'ether') * retroCost
            return rateUSD / mintUSD * 100
        }
        catch (ex) {

        }
    }

    // Get staked token Ids for NFT 
    getStakedTokens(nftAddress) {
        try {
            return this.contract.methods.stakedTokens(nftAddress).call()
        }
        catch (ex) {
            return []
        }
    }

    // Get total balance of contract
    getTotalBalance() {
        try {
            return this.contract.methods.totalBalance().call()
        }
        catch (ex) {
            return 0
        }
    }

    // Get count of NFTs staked of given rarity
    getTotalRarityStaked(rarity) {
        try {
            return this.contract.methods.totalRarityStaked(rarity).call()
        }
        catch (ex) {
            return 0
        }
    }

    // Get total deposited for staking
    getTotalNFTStaked(nft) {
        try {
            return this.contract.methods.totalNFTStaked(nft).call()
        }
        catch (ex) {
            return 0
        }
    }

    // Get total stakers
    getTotalStakers() {
        try {
            return this.contract.methods.totalStakers().call()
        }
        catch (ex) {
            return 0
        }
    }

    // Get count of all NFTs staked by account
    getBalance(account) {
        try {
            return this.contract.methods.nftBalance(account).call()
        }
        catch (ex) {
            return 0
        }
    }

    // Get balance of NFT for account
    getNFTBalance(account, nft) {
        try {
            return this.contract.methods.balanceOf(account, nft).call()
        }
        catch (ex) {
            return 0
        }
    }

    // Get tracked NFTs supported for staking
    getNFTAddresses() {
        try {
            return this.contract.methods.nftAddresses().call()
        }
        catch (ex) {
            return []
        }
    }

    // Get calculated rewards for account for rarity as of now
    calculateRewards(account, rarity) {
        try {
            return this.contract.methods.calculateRewards(account, rarity).call()
        }
        catch (ex) {
            return 0
        }
    }

    // Get total rewards for account as of now
    calculateTotalRewards(account) {
        try {
            return this.contract.methods.calculateTotalRewards(account).call()
        }
        catch (ex) {
            return 0
        }
    }

    // Stake amount
    stake(nft, tokenId) {
        try {
            return this.contract.methods.stake(nft, tokenId).send({ from: this.account })
        }
        catch (ex) {
            return ex
        }
    }

    // Unstake amount
    unstake(nft, tokenId) {
        try {
            return this.contract.methods.unstake(nft, tokenId).send()
        }
        catch (ex) {
            return ex
        }
    }

    // Claim all rewards for account
    claimAllRewards() {
        try {
            return this.contract.methods.claimAllRewards().send()
        }
        catch (ex) {
            return ex
        }
    }

    // Claim all rewards for rarity for account
    claimRewards(rarity) {
        try {
            return this.contract.methods.claimRewards(rarity).send()
        }
        catch (ex) {
            return ex
        }
    }
}