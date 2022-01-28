import React, { useState } from 'react'
import './Marketplace.css';
import addresses from '../assets/addresses.json'
import useBalance from '../actions/useBalance';
import { useWeb3React } from '@web3-react/core';
import { useCalculateTotalRewards, useTotalClaimed, useNfts, useCanDeposit } from '../actions/useNFTStaking';
import { useNFTStakingContract } from '../assets/NFTStakingContract';
import { useRetromoonPrice } from '../actions/usePrice';


export default function NFTFarmingContent({ updated, setUpdated }) {
	const { active, chainId } = useWeb3React()

	const [Rmoonbalance] = useBalance(chainId === 56 ? addresses.Retromoon : addresses['Testnet Retromoon'], "18", updated);

	const nfts = useNfts(updated, setUpdated)

	const canDeposit = useCanDeposit()
	const rmoonPrice = useRetromoonPrice(updated)
	const totalRewards = useCalculateTotalRewards(updated)
	const totalClaimed = useTotalClaimed(updated)
	const stakingContract = useNFTStakingContract()
	const [acting, setActing] = useState({})

	function claimAllRewards() {
		setActing({ ...acting, 'claiming': true })
		stakingContract.claimAllRewards().then(() => {
			setUpdated(updated + 1)
		})
		.finally(() => {
			setActing({ ...acting, 'claiming': false })
		})
	}

	function approveForStaking(nft) {
		setActing({ ...acting, [nft]: true });
		stakingContract.approveContract(nft).then(() => {
			setUpdated(updated + 1)
		})
		.finally(() => {
			setActing({ ...acting, [nft]: false })
		})
	}

	function stake(nft, id) {
		setActing({ ...acting, [nft + id]: true })
		stakingContract.stake(nft, id).then(() => {
			setUpdated(updated + 1)
		})
		.finally(() => {
			setActing({ ...acting, [nft + id]: false })
		})
	}

	function unstake(nft, id) {
		setActing({ ...acting, [nft + id]: true })
		stakingContract.unstake(nft, id).then(() => {
			setUpdated(updated + 1)
		})
		.finally(() => {
			setActing({ ...acting, [nft + id]: false })
		})
	}

	function usdValue(amount) {
		return Intl.NumberFormat('en-US', {
			notation: 'compact',
			style: 'currency',
			currency: 'USD',
			maximumFractionDigits: 2,
		}).format(amount * rmoonPrice)
	}

	return (
		<>
			<div className='nftBox nftStaking'>
				<table className='yourRmoon'>
					<tr>
						<td>Wallet Balance:</td>
						<td title={Rmoonbalance}>{Math.round(Rmoonbalance).toLocaleString()} $RETRO <span title={Rmoonbalance * rmoonPrice} className='usd-label'>{usdValue(Rmoonbalance)}</span></td>
					</tr>
					<tr>
						<td>Unclaimed:</td>
						<td title={totalRewards}>{Math.round(totalRewards).toLocaleString()} $RETRO <span title={totalRewards * rmoonPrice} className='usd-label'>{usdValue(totalRewards)}</span></td>
					</tr>
					<tr>
						<td>Total Claimed:</td>
						<td title={totalClaimed}>{Math.round(totalClaimed).toLocaleString()} $RETRO <span title={totalClaimed * rmoonPrice} className='usd-label'>{usdValue(totalClaimed)}</span></td>
					</tr>
				</table>
				<button className='small-button' onClick={claimAllRewards} disabled={acting['claiming'] || !active}>Claim</button>
				<button className='small-button' onClick={() => setUpdated(updated + 1)} disabled={acting['claiming'] || !active}>Refresh</button>
				<div className='nfts'>
				{nfts ? nfts.map(nft => {
					return nft.staked ? (
						<div className='nft nftBuyBox' key={nft.tokenId + nft.nftAddress}>
							<video src={nft.media} width="180" height="248" autoPlay loop muted controls='' />
							<h3>Token ID: {nft.tokenId}</h3>
							<h3>Rarity: {nft.rarity}</h3>
							<h3 title={nft.rewards}>Rewards: {Math.round(nft.rewards).toLocaleString()}</h3>
							<h3 title={nft.apy + '%'}>APY: {Math.round(nft.apy).toLocaleString()}%</h3>
							<button onClick={() => unstake(nft.nftAddress, nft.tokenId)} disabled={acting[nft.nftAddress + nft.tokenId]}>Unstake</button>
						</div>
					) : (
						<div className='nft nftBuyBox' key={nft.tokenId + nft.nftAddress}>
							<video src={nft.media} width="180" height="248" autoPlay loop muted controls='' />
							<h3>Token ID: {nft.tokenId}</h3>
							<h3>Rarity: {nft.rarity}</h3>
							<h3 title={nft.apy + '%'}>APY: {Math.round(nft.apy).toLocaleString()}%</h3>
							{
								nft.approved ?
									<button onClick={() => stake(nft.nftAddress, nft.tokenId)} disabled={!canDeposit || acting[nft.nftAddress + nft.tokenId]}>Stake</button> :
									<button onClick={() => approveForStaking(nft.nftAddress)} disabled={acting[nft.nftAddress]}>Approve</button>
							}
						</div>
					)
				}) : <>Loading...</>}
				</div>
			</div>
		</>
	)
}
