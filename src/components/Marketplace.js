import React, {useState, useEffect, useRef} from 'react'
import ReactGodot from 'react-godot'
import './Marketplace.css';
import styled from 'styled-components'
import coinLogo from '../images/coinLogo.png'
import { WalletMenu } from './WalletMenu'
import { useWeb3React } from "@web3-react/core"
import { Web3ReactProvider } from '@web3-react/core'
import { injected } from "../wallet/connectors"
import useBalance from '../actions/useBalance'
import Web3 from 'web3'
import BNBlogo from '../images/binance-coin-bnb-logo.webp'
import nftExample from '../images/nftexample.png'

function Marketplace() {
    const web3 = new Web3('https://bsc-dataseed1.binance.org:443');

    const providerUrl = process.env.PROVIDER_URL || 'https://bsc-dataseed1.binance.org';

    const { active, account, library, connector, activate, deactivate } = useWeb3React()

    const iframeRef = useRef(null);
    const focusGame = () => iframeRef.current.contentDocument.querySelector('canvas').focus();

    async function connect() {
      try {
        await activate(injected)
      } catch (ex) {
        console.log(ex)
      }

      focusGame();
    }

    const [BNBbalance] = useBalance("0xB8c77482e45F1F44dE1745F52C74426C631bDD52", "18");
    const [Rmoonbalance] = useBalance("0xE81FE8bBBEA13A0fd5Cc0AAFb6062631C659eC54", "18");


    const [showModal, setShowModal] = useState(false)

    const onLoad = () => iframeRef.current.contentWindow.onclick = focusGame;

    const openModal = () => {
        setShowModal(prev => !prev)
    }
    
    //
    const onModalClose = () => focusGame();


    return (
        <>
        <WalletMenu showModal={showModal} setShowModal={setShowModal} onModalClose={onModalClose} BNBbalance={BNBbalance} Rmoonbalance={Rmoonbalance} account={account}/>

        <div className="game-window">
            <div className='button-wrapper'>
                <div className='connector-button'>
                {active ? <div className='connect-wallet' onClick={openModal}><a className='coins'><a className='BNB-token'>{BNBbalance}<img className='BNBlogo' src={BNBlogo}/></a><a className='RMOON-Token'>{Rmoonbalance} $R</a></a>{/*<img className='coinLogo' src={coinLogo} /> <a className='nowConnected'>click to deposit</a>*/}</div> : <div className='connect-wallet' onClick={connect}>Connect Wallet</div> }
                </div>
            </div>
            <div class="dropdown">
              <button class="dropbtn">Sort By:</button>
              <div class="dropdown-content">
                <a href="#">Lowest Price</a>
                <a href="#">Highest Price</a>
                <a href="#">Rarity</a>
              </div>
            </div>
            <div className='nftBox'>
            <div className='nft'>
              <img src={nftExample} />
              <h3>Rarity: Rare</h3>
              <h3>Staking: 1.5X</h3>
              <h3>300,000$RETRO</h3>
            </div>
            <div className='nft'>
              <img src={nftExample} />
              <h3>Rarity: Rare</h3>
              <h3>Staking: 1.5X</h3>
              <h3>300,000$RETRO</h3>
            </div>
            <div className='nft'>
              <img src={nftExample} />
              <h3>Rarity: Rare</h3>
              <h3>Staking: 1.5X</h3>
              <h3>300,000$RETRO</h3>
            </div>
            <div className='nft'>
              <img src={nftExample} />
              <h3>Rarity: Rare</h3>
              <h3>Staking: 1.5X</h3>
              <h3>300,000$RETRO</h3>
            </div>
            <div className='nft'>
              <img src={nftExample} />
              <h3>Rarity: Rare</h3>
              <h3>Staking: 1.5X</h3>
              <h3>300,000$RETRO</h3>
            </div>
            <div className='nft'>
              <img src={nftExample} />
              <h3>Rarity: Rare</h3>
              <h3>Staking: 1.5X</h3>
              <h3>300,000$RETRO</h3>
            </div>
            <div className='nft'>
              <img src={nftExample} />
              <h3>Rarity: Rare</h3>
              <h3>Staking: 1.5X</h3>
              <h3>300,000$RETRO</h3>
            </div>
            <div className='nft'>
              <img src={nftExample} />
              <h3>Rarity: Rare</h3>
              <h3>Staking: 1.5X</h3>
              <h3>300,000$RETRO</h3>
            </div>
            <div className='nft'>
              <img src={nftExample} />
              <h3>Rarity: Rare</h3>
              <h3>Staking: 1.5X</h3>
              <h3>300,000$RETRO</h3>
            </div>
            <div className='nft'>
              <img src={nftExample} />
              <h3>Rarity: Rare</h3>
              <h3>Staking: 1.5X</h3>
              <h3>300,000$RETRO</h3>
            </div>
            </div>
        </div>
        </>
    )
}

export default Marketplace
