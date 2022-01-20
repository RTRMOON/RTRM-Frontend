import { getNftContract, getNFTStakingContract } from '../store/contractStore'
import { useWeb3React } from '@web3-react/core'
import addresses from './addresses.json'
import { BigNumber } from 'ethers'

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

    async getAPYForToken(deposit, tier) {
        try {
            const rewardPerTier = await this.contract.methods.rewardPerTier(tier).call();
            const mintCost = 0.2 // TODO
            const retroCost = 0.00000115 // TODO
            const reward = BigNumber.from(rewardPerTier).sub(deposit.rewardPerToken)
            const now = Math.floor(new Date() / 1000)
            const period = BigNumber.from((now - deposit.timestamp).toString()).mul(this.library.utils.toWei('100'))
            const year = BigNumber.from('31536000').mul(this.library.utils.toWei('100'))
            const yearly = reward.mul(year.div(period))
            const retroRate = this.library.utils.fromWei(yearly.toString()) * retroCost
            return retroRate / mintCost * 100
        }
        catch (ex) {
            return 0
        }
    }

    // Get APY for address
    async getAPY(rarity) {
        try {
            const staked = await this.getTotalRarityStaked(rarity)
            if (+staked === 0) return 'Infinity';

            const yearly = await this.contract.methods.getRewardRate(rarity).call()
            const retroCost = 0.00000115 // TODO
            const mintCost = 0.2 // TODO

            const retroRate = this.library.utils.fromWei(yearly) * retroCost
            return retroRate / mintCost * 100
        }
        catch (ex) {
            return 0
        }
    }

    getTotalClaimed(account) {
        try {
            return this.contract.methods.rewardsPaid(account).call()
        }
        catch (ex) {
            return 0
        }
    }

    async getRewardsForDeposit(deposit, tier) {
        try {
            const rewardPerTier = await this.contract.methods.rewardPerTier(tier).call();
            const rewards = BigNumber.from(rewardPerTier).sub(deposit.rewardPerToken);
            return this.library.utils.fromWei(rewards.toString());
        }
        catch (ex) {
            return 0
        }
    }

    // Get staked token Ids for NFT 
    getStakedTokens() {
        try {
            return this.contract.methods.stakedTokens().call()
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