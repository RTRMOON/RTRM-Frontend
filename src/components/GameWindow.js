import React, {useState} from 'react'
import ReactGodot from 'react-godot'
import './GameWindow.css';
import styled from 'styled-components'
import { WalletMenu } from './WalletMenu'

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
                    <div className='connect-wallet' onClick={openModal}>Connect Wallet</div>
                </div>
            </div>
        <iframe title="Space Invaders RetroMoon" src="/retromoon/example/index.html" height="768" width="1024" frameborder="0"><a href="">Space Arcade</a></iframe>
        </div>
        </>
    )
}

export default GameWindow
