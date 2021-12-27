import React, {useState, useEffect, useRef} from 'react'
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
        {/* use the following when testing locally */}
        {/* <iframe ref={iframeRef} title="Moon Invaders RetroMoon" src="./mooninvaders/index.html" height="768" width="1024" frameborder="0" onLoad={onLoad}><a href="">Moon Invaders</a></iframe><div className='iframe-overlay'></div> */}
        <iframe ref={iframeRef} title="Moon Invaders RetroMoon" src="https://retromoonbsc.app/mooninvaders/index.html" height="768" width="1024" frameborder="0" onLoad={onLoad}><a href="">Moon Invaders</a></iframe><div className='iframe-overlay'></div>
    </div>
    </>
  )
}

export default GameWindow
