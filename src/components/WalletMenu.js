import React, {useCallback, useRef, useEffect} from 'react'
import {useSpring, animated} from 'react-spring'
import './WalletMenu.css'
import walletBG from '../images/ModalMenu.png'
import closeBTN from '../images/closeBTN.png'
import coinLogo from '../images/coinLogo.png'



export const WalletMenu = ({showModal, setShowModal}) => {
    const modalRef = useRef()

    const animation = useSpring ({
        config: {
            duration: 300
        },
        transform: showModal ? `translateY(0%)` : `translatey(-100%)`
    })

    const fadeAnimation = useSpring ({
        config: {
            duration: 200
        },
        opacity: showModal ? 1:0,
    });

    const closeModal = e => {
        if(modalRef.current === e.target){
            setShowModal(false);
        }
    };

    return (
        <>{showModal ? 
            <animated.div style={fadeAnimation}>
        <div className='wallet-container' ref={modalRef} onClick={closeModal}>
            <animated.div className='animationFront' style={animation}>
            <div className='wallet-modal'>
                <div className='wallet-actions'>
                <h2>Your Wallet</h2>
                    <p>Your adress: <a className='yourWallet'>0xx1dh12rghhhhbb1fff0</a></p>
                    <p>Deposited coins: <a className='coins'>1000</a><img className='coinLogo' src={coinLogo} /></p>
                    <button className='deposit btn'>Deposit</button>
                    <button className='withdraw btn'>Withdraw</button>
                    <button className='buyCoins btn'>Buy Coins</button>
                </div>
                <img src={closeBTN} className='closeBTN' onClick={() => setShowModal(prev => !prev)}/>
                <img src={walletBG} className='modalBG'/>
            </div>
            </animated.div>
        </div>
        </animated.div> : null}
        </>
    )
}