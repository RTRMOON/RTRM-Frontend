import React, { useState } from 'react'
import './MobileWindow.css'
import homeIcon from '../images/social/home.png';
import twitterIcon from '../images/social/twitter.png'
import chartIcon from '../images/social/chart.png'
import telegramIcon from '../images/social/telegram.png'
import instagramIcon from '../images/social/ig.png'
import StakingContent from './StakingContent';
import { useWeb3React } from '@web3-react/core';
import { injected } from '../wallet/connectors';
import NFTFarmingContent from './NFTFarmingContent';
import Dropdown from 'react-dropdown'
import 'react-dropdown/style.css'

function MobileWindow() {

    const { activate, active, deactivate, connector } = useWeb3React()
    const [tab, setTab] = useState('default')
    const [updated, setUpdated] = useState(0)

    return (
        <div className='mobileWindow'>
            <div className='mobileContainer'>
                <Dropdown className='mobile-dropdown' options={['staking', 'farming']} onChange={(e) => setTab(e.value)} value='Menu...' />
                { active ? 
                    <button className='connect-button' onClick={() => deactivate(connector)}>Disconnect</button> :
                    <button className='connect-button' onClick={() => activate(injected)}>Connect</button>
                }
                { tab === 'default' && <>
                <div className='gameboy'>
                    <div className='header-bar'>
                    <h1>RETROMOON</h1>
                    </div>
                    <p>The RetroMoon game only works on your computer! Checkout staking and farming above.</p>
                </div>
                </>}
                { tab === 'staking' && <StakingContent /> }
                { tab === 'farming' && <NFTFarmingContent updated={updated} setUpdated={setUpdated} /> }
            </div>
            <div className='social-icons'>
                <a href='https://www.retromoonbsc.com/'><img alt='Home' src={homeIcon} /></a>
                <a href='/'><img alt='Chart' src={chartIcon} /></a>
                <a href='https://t.me/retromoonofficial' target='_blank' rel='noreferrer'><img alt='Telegram' src={telegramIcon} /></a>
                <a href='https://twitter.com/Retromoonbsc' target='_blank' rel='noreferrer'><img alt='Twitter' src={twitterIcon} /></a>
                <a href='https://instagram.com/retromoonbsc' target='_blank' rel='noreferrer'><img alt='Instagram' src={instagramIcon} /></a>

            </div>
        </div>
    )
}

export default MobileWindow
