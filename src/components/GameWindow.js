import React, {useState, useEffect} from 'react'
import ReactGodot from 'react-godot'
import './GameWindow.css';
import styled from 'styled-components'
import coinLogo from '../images/coinLogo.png'
import { WalletMenu } from './WalletMenu'
import { useWeb3React } from "@web3-react/core"
import { Web3ReactProvider } from '@web3-react/core'
import { injected } from "../wallet/connectors"
import useBalance from '../actions/useBalance'
import Web3 from 'web3'
import BNBlogo from '../images/binance-coin-bnb-logo.webp'

function GameWindow() {
    const web3 = new Web3('https://bsc-dataseed1.binance.org:443');

    const providerUrl = process.env.PROVIDER_URL || 'https://bsc-dataseed1.binance.org';

    const { active, account, library, connector, activate, deactivate } = useWeb3React()

    async function connect() {
      try {
        await activate(injected)
      } catch (ex) {
        console.log(ex)
      }
    }

    const [BNBbalance] = useBalance("0xB8c77482e45F1F44dE1745F52C74426C631bDD52", "18");
    const [Rmoonbalance] = useBalance("0xe9e7cea3dedca5984780bafc599bd69add087d56", "18");


    const [showModal, setShowModal] =useState(false)

    const openModal = () => {
        setShowModal(prev => !prev)
    }


    return (
        <>
        <WalletMenu showModal={showModal} setShowModal={setShowModal} BNBbalance={BNBbalance} Rmoonbalance={Rmoonbalance} account={account}/>

        <div className="game-window">
            <div className='button-wrapper'>
                <div className='connector-button'>
                {active ? <div className='connect-wallet' onClick={openModal}><a className='coins'><a className='BNB-token'>{BNBbalance}<img className='BNBlogo' src={BNBlogo}/></a><a className='RMOON-Token'>{Rmoonbalance}$R</a></a>{/*<img className='coinLogo' src={coinLogo} /> <a className='nowConnected'>click to deposit</a>*/}</div> : <div className='connect-wallet' onClick={connect}>Connect Wallet</div> }
                </div>
            </div>
        <iframe title="Space Invaders RetroMoon" src="/retromoon/example/index.html" height="768" width="1024" frameborder="0"><a href="">Space Arcade</a></iframe>
        </div>
        </>
    )
}

export default GameWindow
