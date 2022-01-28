import React, { useRef } from 'react'
import {useSpring, animated} from 'react-spring'
import './WalletMenu.css'
import walletBG from '../images/connectMenu.png'
import closeBTN from '../images/closeBTN.png'
import { useWeb3React } from '@web3-react/core'
import { injected, walletconnect } from '../wallet/connectors'


export const ConnectMenu = ({showModal, setShowModal, onModalClose}) => {

    const { activate } = useWeb3React()
    const modalRef = useRef()

    const animation = useSpring ({
        config: {
            duration: 300
        },
        overlay: {zIndex: 1000},
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
            onModalClose();
        }
    };

	const connect = (provider) => {
		activate(provider)
		setShowModal(false)
		onModalClose()
	}

    return (
        <>{showModal ? 
            <animated.div style={fadeAnimation}>
        <div className='connect-container' ref={modalRef} onClick={closeModal}>
            <animated.div className='animationFront' style={animation}>
            <div className='connect-modal'>
                <div className='connect-actions'>
                	<h2>Connect Wallet</h2>
					<button className='metamask-btn' onClick={() => connect(injected)}>Metamask</button>
                    <button className='walletconnect-btn' onClick={() => connect(walletconnect)}>WalletConnect</button>
                </div>
                <img alt='X' src={closeBTN} className='closeBTN' onClick={() => setShowModal(prev => !prev)}/>
                <img alt='Background' src={walletBG} className='modalBG'/>
            </div>
            </animated.div>
        </div>
        </animated.div>
        : null}
        </>
    )
}