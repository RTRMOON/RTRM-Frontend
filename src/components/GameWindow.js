import React, {useState, useEffect} from 'react'
import ReactGodot from 'react-godot'
import './GameWindow.css';
import styled from 'styled-components'
import coinLogo from '../images/coinLogo.png'
import { WalletMenu } from './WalletMenu'
import Web3 from 'web3';
import { init } from './Web3Client'

const Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
`

const Button = styled.button`
    min-width: 100px;
    padding: 16px 32px;
    border-radius: 4px;
    border: none;
    background: red;
    font-size: 24px;
`

function GameWindow() {
    const providerUrl = process.env.PROVIDER_URL || 'https://bsc-dataseed1.binance.org';

    useEffect(() => {
        
    }, []);
    


    
    const [showModal, setShowModal] =useState(false)

    const openModal = () => {
        setShowModal(prev => !prev)
    }

    return (
        <>
        <WalletMenu showModal={showModal} setShowModal={setShowModal} />

        <div className="game-window">
            <div className='button-wrapper'>
                <div className='connector-button'>
                <div className='connect-wallet' onClick={openModal}><a className='coins'>1000</a><img className='coinLogo' src={coinLogo} /> <a className='nowConnected'>click to deposit</a></div>  <div className='connect-wallet' onClick={init} >Connect Wallet</div>
                </div>
            </div>
        <iframe title="Space Invaders RetroMoon" src="/retromoon/example/index.html" height="768" width="1024" frameborder="0"><a href="">Space Arcade</a></iframe>
        </div>
        </>
    )
}

export default GameWindow
