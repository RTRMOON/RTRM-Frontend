import React, { useState } from 'react'
import { useAPY, useEarnedBalance, useStakedBalance, useTotalBalance, useApproved, useCanDeposit } from '../actions/useStaking'
import './Staking.css'

import addresses from '../assets/addresses.json'
import { WalletMenu } from './WalletMenu'
import useBalance from '../actions/useBalance';
import BNBlogo from '../images/binance-coin-bnb-logo.webp'
import { injected } from '../wallet/connectors';
import { useWeb3React } from '@web3-react/core';
import { useStakingContract } from '../assets/StakingContract'

function Staking() {
    const { active, account, activate, chainId, library } = useWeb3React()

    async function connect() {
        try {
            await activate(injected)
        } catch (ex) {
            console.log(ex)
        }
    }

    const [showModal, setShowModal] = useState(false)

    const openModal = () => {
        setShowModal(prev => !prev)
    }

    const onModalClose = () => console.log('closeMenu');

    const [updated, setUpdated] = useState(0)
    const [BNBbalance] = useBalance(addresses.BNB, "18", updated);
    const [Rmoonbalance] = useBalance(chainId === 56 ? addresses.Retromoon : addresses['Testnet Retromoon'], "18", updated);
    const stakingContract = useStakingContract()
    const apy = useAPY()
    const canDeposit = useCanDeposit()
    const earned = useEarnedBalance(updated)
    const balance = useStakedBalance(updated)
    const tvl = useTotalBalance(updated)

    const [approving, setApproving] = useState(false) 
    const [staking, setStaking] = useState(false)
    const [unstaking, setUnstaking] = useState(false)
    const [claiming, setClaiming] = useState(false)
    const [stakeAmount, setStakeAmount] = useState('0')
    const [unstakeAmount, setUnstakeAmount] = useState('0')
    const approved = useApproved(stakeAmount, updated)

    function maxStake() {
        setStakeAmount(Rmoonbalance)
    }

    function maxUnstake() {
        setUnstakeAmount(balance)
    }

    function approveTokens() {
        setApproving(true)
        stakingContract.approveContract()
        .then(receipt => {
            console.log(receipt)
            setUpdated(updated + 1)
        })
        .finally(() => {
            setApproving(false)
        })
    }   

    function stakeTokens() {
        setStaking(true)
        const amount = library.utils.toWei(stakeAmount)
        stakingContract.stake(amount)
        .then(receipt => {
            console.log(receipt)
            setUpdated(updated + 1)
        })
        .finally(() => {
            setStaking(false)
        })
    }

    function unstakeTokens() {
        setUnstaking(true)
        const amount = library.utils.toWei(unstakeAmount)
        stakingContract.unstake(amount)
        .then(receipt => {
            console.log(receipt)
            setUpdated(updated + 1)
        })
        .finally(() => {
            setUnstaking(false)
        })
    }

    function claimRewards() {
        setClaiming(true)
        stakingContract.claimRewards()
        .then(receipt => {
            console.log(receipt)
            setUpdated(updated + 1)
        })
        .finally(() => {
            setClaiming(false)
        })
    }

    return (
        <>
            <WalletMenu showModal={showModal} setShowModal={setShowModal} BNBbalance={BNBbalance} Rmoonbalance={Rmoonbalance} account={account} onModalClose={onModalClose} />
            <div>
                <div className='button-wrapper'>
                </div>
                <div className='stakingWindow'>
                    <div className='stakingHeader'>
                    {active ? <div className='connect-wallet' onClick={openModal}><a className='coins'><a className='BNB-token'>{BNBbalance}<img className='BNBlogo' src={BNBlogo} /></a><a className='RMOON-Token'>{Rmoonbalance} $R</a></a>{/*<img className='coinLogo' src={coinLogo} /> <a className='nowConnected'>click to deposit</a>*/}</div> : <div className='connect-wallet' onClick={connect}>Connect Wallet</div>}     
                    </div>
                    <div className='stakingContent'>
                        <p>Total Value Locked (TVL):</p>
                        <p>{parseFloat(tvl).toFixed(3)}... $RETRO</p>
                        <p className='TVLUSD'>$?,???,???</p>
                        <div className='stakingInfo'>
                            <div className='col-2'>
                                <p>Earned</p>
                                <p><a className='tokenNumber'>{parseFloat(earned).toFixed(3)}...</a> $RETRO</p>
                                <p>Staked</p><p><a className='tokenNumber'>{parseFloat(balance).toFixed(3)}...</a> $RETRO</p>
                            </div>
                            <div className='col-2 right-col'>
                                <p>APY</p><p><a className='tokenNumber'>{apy}%</a></p>
                                <p> </p><button className='refresh-button' onClick={() => setUpdated(updated + 1)}>Refresh</button>
                            </div>
                        </div>
                        <div className='stakeButtons'>
                            <input placeholder='0' type='number' min='0' max={Rmoonbalance} value={stakeAmount} onChange={(e) => setStakeAmount(e.target.value)}></input>
                            <button className='max-button' onClick={maxStake}>MAX</button>
                            {approved ? 
                            <button className='stake-button' onClick={stakeTokens} disabled={staking || !canDeposit || !library}>STAKE</button>
                            : <button className='stake-button' onClick={approveTokens} disabled={approving || !library}>APPROVE</button> }
                        </div>
                        <div className='unstakeButtons'>
                            <input placeholder='0' type='number' min='0' max={balance} value={unstakeAmount} onChange={(e) => setUnstakeAmount(e.target.value)}></input>
                            <button className='max-button' onClick={maxUnstake}>MAX</button>
                            <button className='stake-button' onClick={unstakeTokens} disabled={unstaking || !library}>UNSTAKE</button>
                            <button className='claim-button' onClick={claimRewards} disabled={claiming || !library}>Claim Rewards</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Staking
