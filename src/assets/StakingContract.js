import { getERC20Contract, getStakingContract } from '../store/contractStore'
import { useWeb3React } from '@web3-react/core'
import addresses from './addresses.json'
import { ethers, BigNumber } from 'ethers'

export function useStakingContract() {
    const { account, library, chainId } = useWeb3React()
    return new RetromoonStake(library, account, chainId)
}

export default class RetromoonStake {
    constructor(library, account, chainId) {
        this.library = library;
        this.account = account;
        this.contract = getStakingContract(
            chainId === 56 ? addresses['Token Staking'] : addresses['Testnet Token Staking'], library, account)
        this.tokenContract = getERC20Contract(
            chainId === 56 ? addresses.Retromoon : addresses['Testnet Retromoon'], library)
    }

    // Get contract is approved to transfer amount for account
    async isApproved(amount) {
        try {
            const approved = await this.tokenContract.methods.allowance(this.account, this.contract.options.address).call()
            return BigNumber.from(approved).gte(BigNumber.from(this.library.utils.toWei(amount)))
        }
        catch (ex) {
            return false
        }
    }

    // Approve marketplace contract to transfer NFT
    approveContract() {
        try {
            return this.tokenContract.methods.approve(this.contract.options.address, ethers.constants.MaxUint256)
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

    // Get end date
    getEndDate() {
        try {
            return this.contract.methods.endDate().call()
        }
        catch (ex) {
            return 0
        }
    }

    // Get max balance
    getMaxBalance() {
        try {
            return this.contract.methods.maxBalance().call()
        }
        catch (ex) {
            return 0
        }
    }

    // Get max stake
    getMaxStake() {
        try {
            return this.contract.methods.maxStake().call()
        }
        catch (ex) {
            return 0
        }
    }

    // Get APY
    getAPY() {
        try {
            return this.contract.methods.apy().call()
        }
        catch (ex) {
            return 0
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

    // Get total deposited for staking
    getTotalDeposited() {
        try {
            return this.contract.methods.totalDeposited().call()
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

    // Get balance of account
    getBalance(account) {
        try {
            return this.contract.methods.balanceOf(account).call()
        }
        catch (ex) {
            return 0
        }
    }

    // Get all remaining rewards on contract (non deposits)
    getRemainingRewards() {
        try {
            return this.contract.methods.remainingRewards().call()
        }
        catch (ex) {
            return 0
        }
    }

    // Get calculated rewards for account as of now
    calculateRewards(account) {
        try {
            return this.contract.methods.calculateRewards(account).call()
        }
        catch (ex) {
            return 0
        }
    }

    // Stake amount
    stake(amount) {
        try {
            return this.contract.methods.stake(amount).send({ from: this.account })
        }
        catch (ex) {
            return ex
        }
    }

    // Unstake amount
    unstake(amount) {
        try {
            return this.contract.methods.unstake(amount).send()
        }
        catch (ex) {
            return ex
        }
    }

    // Claim all rewards for account
    claimRewards() {
        try {
            return this.contract.methods.claimRewards().send()
        }
        catch (ex) {
            return ex
        }
    }
}