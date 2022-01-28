import React, { useState } from 'react'
import './Marketplace.css';
import addresses from '../assets/addresses.json'
import { WalletMenu } from './WalletMenu'
import useBalance from '../actions/useBalance';
import BNBlogo from '../images/binance-coin-bnb-logo.webp'
import { useWeb3React } from '@web3-react/core';
import { ConnectMenu } from './ConnectMenu';



export default function Wallet({ onModalClose }) {
	onModalClose = onModalClose || console.log;
	const { active, account } = useWeb3React()

	const [BNBbalance] = useBalance(addresses.BNB, "18");
	const [Rmoonbalance] = useBalance(addresses.Retromoon, "18");

	const [showWallet, setShowWallet] = useState(false)
	const [showConnect, setShowConnect] = useState(false)

	return (
		<>
			<WalletMenu showModal={showWallet} setShowModal={setShowWallet} BNBbalance={BNBbalance} Rmoonbalance={Rmoonbalance} account={account} onModalClose={onModalClose} />
			<ConnectMenu showModal={showConnect} setShowModal={setShowConnect} onModalClose={onModalClose} />

			<div className='button-wrapper'>
				<div className='connector-button'>
					{active ?
						<div className='connect-wallet' onClick={() => setShowWallet(prev => !prev)}>
							<span className='coins'>
								<span className='BNB-token'>{BNBbalance}
									<img alt='BNB' className='BNBlogo' src={BNBlogo} />
								</span>
								<span className='RMOON-Token'>{Math.round(Rmoonbalance)} $R</span>
							</span>
						</div>
						:
						<div className='connect-wallet' onClick={() => setShowConnect(prev => !prev)}>Connect Wallet</div>
					}
				</div>
			</div>
		</>
	)
}
