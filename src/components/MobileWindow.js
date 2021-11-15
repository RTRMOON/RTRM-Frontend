import React from 'react'
import './MobileWindow.css'
import homeIcon from '../images/social/home.png';
import twitterIcon from '../images/social/twitter.png'
import chartIcon from '../images/social/chart.png'
import telegramIcon from '../images/social/telegram.png'
import instagramIcon from '../images/social/ig.png'

function MobileWindow() {
    return (
        <div className='mobileWindow'>
           <div className='gameboy'>
               <div className='header-bar'>
               <h1>RETROMOON</h1>
               </div>
               <p>The RetroMoon game only works on your computer!</p>
           </div>
           <div className='social-icons'>
            <a href='https://www.retromoonbsc.com/' target='_blank'><img src={homeIcon} /></a>
            <a href='/'><img src={chartIcon} /></a>
            <a href='https://t.me/retromoonofficial' target='_blank'><img src={telegramIcon} /></a>
            <a href='https://twitter.com/retromoontoken1' target='_blank'><img src={twitterIcon} /></a>
            <a href='https://instagram.com/retromoonbsc' target='_blank'><img src={instagramIcon} /></a>

          </div>
        </div>
    )
}

export default MobileWindow
