import React, { useState } from 'react'
import { useAPY, useEarnedBalance, useStakedBalance, useApproved, useCanDeposit, useTotalDeposited, useMaxStake } from '../actions/useStaking'
import './Staking.css'

import addresses from '../assets/addresses.json'
import { WalletMenu } from './WalletMenu'
import useBalance from '../actions/useBalance';
import BNBlogo from '../images/binance-coin-bnb-logo.webp'
import { injected } from '../wallet/connectors';
import { useWeb3React } from '@web3-react/core';
import { useStakingContract } from '../assets/StakingContract'
import { useRetromoonPrice } from '../actions/usePrice'

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
    const rmoonPrice = useRetromoonPrice(updated)
    const stakingContract = useStakingContract()
    const apy = useAPY()
    const maxStakeValue = useMaxStake()
    const canDeposit = useCanDeposit()
    const earned = useEarnedBalance(updated)
    const balance = useStakedBalance(updated)
    const tvl = useTotalDeposited(updated)

    const [approving, setApproving] = useState(false) 
    const [staking, setStaking] = useState(false)
    const [unstaking, setUnstaking] = useState(false)
    const [claiming, setClaiming] = useState(false)
    const [stakeAmount, setStakeAmount] = useState('0')
    const [unstakeAmount, setUnstakeAmount] = useState('0')
    const approved = useApproved(stakeAmount, updated)

    function maxStake() {
        return Math.min(maxStakeValue - balance, Rmoonbalance).toString()
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
            setStakeAmount('0')
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
            setUnstakeAmount('0')
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

    function formatLocale(amount) {
        return parseFloat(parseFloat(amount).toFixed(2)).toLocaleString()
    }

    function usdValue(amount) {
        return Intl.NumberFormat('en-US', {
            notation: 'compact',
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 2,
        }).format(amount * rmoonPrice)
    }

    function formatNumber(amount) {
        return Intl.NumberFormat('en-US', {
            notation: "compact",
            maximumFractionDigits: 2,
        }).format(amount);
    }

    return (
        <>
            <WalletMenu showModal={showModal} setShowModal={setShowModal} BNBbalance={BNBbalance} Rmoonbalance={Rmoonbalance} account={account} onModalClose={onModalClose} />
            <div>
                <div className='button-wrapper'>
                </div>
                <div className='stakingWindow'>
                    <div className='stakingHeader'>
                    {active ? <div className='connect-wallet' onClick={openModal}><a className='coins'><a className='BNB-token'>{Math.round(BNBbalance)}<img className='BNBlogo' src={BNBlogo} /></a><a className='RMOON-Token'>{Rmoonbalance} $R</a></a>{/*<img className='coinLogo' src={coinLogo} /> <a className='nowConnected'>click to deposit</a>*/}</div> : <div className='connect-wallet' onClick={connect}>Connect Wallet</div>}     
                    </div>
                    <div className='stakingContent'>
                        <p>Total Value Locked (TVL):</p>
                        <p title={tvl}>{formatLocale(tvl)} $RETRO</p>
                        <p title={tvl * rmoonPrice} className='usd-label'>{usdValue(tvl)}</p>
                        <div className='stakingInfo'>
                            <div className='col-2'>
                                <p>Staked</p>
                                <p title={balance}>
                                    <a title={balance} className='tokenNumber'>{formatNumber(balance)}</a> $R 
                                    <span title={balance * rmoonPrice} className='usd-label'> {usdValue(balance)}</span>
                                </p>

                                <p>Earned</p>
                                <p>
                                    <a title={earned}className='tokenNumber'>{formatNumber(earned)}</a> $R 
                                    <span title={earned * rmoonPrice} className='usd-label'> {usdValue(earned)}</span>
                                </p>
                            </div>
                            <div className='col-2 right-col'>
                                <p>APY</p><p><a className='tokenNumber'>{apy}%</a></p>
                                <div className='mw'>
                                <button className='small-button' onClick={claimRewards} disabled={claiming || !library}>Claim</button>
                                    <button className='small-button' onClick={() => setUpdated(updated + 1)} disabled={claiming || !library}>Refresh</button>
                                </div>
                            </div>
                        </div>
                        <div className='stakeButtons'>
                            <input placeholder='0' type='number' min='0' max={maxStake()} value={stakeAmount} onChange={(e) => setStakeAmount(e.target.value)}></input>
                            <button className='max-button' onClick={() => setStakeAmount(maxStake())}>MAX</button>
                            {approved ? 
                            <button className='stake-button' onClick={stakeTokens} disabled={staking || !canDeposit || !library}>STAKE</button>
                            : <button className='stake-button' onClick={approveTokens} disabled={approving || !library}>APPROVE</button> }
                        </div>
                        <div className='unstakeButtons'>
                            <input placeholder='0' type='number' min='0' max={balance} value={unstakeAmount} onChange={(e) => setUnstakeAmount(e.target.value)}></input>
                            <button className='max-button' onClick={maxUnstake}>MAX</button>
                            <button className='stake-button' onClick={unstakeTokens} disabled={unstaking || !library}>UNSTAKE</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Staking
