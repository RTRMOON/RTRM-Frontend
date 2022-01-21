import { useState, useEffect } from 'react'
import { getPancakePair } from '../store/contractStore'
import { useWeb3React } from '@web3-react/core'
import addresses from '../assets/addresses.json'
import Web3 from 'web3'

export async function getBNBPrice() {
	// Hardcoded to mainnet so prices can be viewed on testnet
	const library = new Web3('https://bsc-dataseed.binance.org/')
	if (library) {
		const pair = getPancakePair(addresses.BNBPair, library)
		const reserves = await pair.methods.getReserves().call()
		return reserves._reserve1 / reserves._reserve0
	}
	return 0
}

export async function getRetromoonPrice() {
	// Hardcoded to mainnet so prices can be viewed on testnet
	const library = new Web3('https://bsc-dataseed.binance.org/')
	if (library) {
		const bnbPrice = await getBNBPrice(library)
		const pair = getPancakePair(addresses.RetromoonPair, library)
		const reserves = await pair.methods.getReserves().call()
		const rmoonPrice = reserves._reserve1 / reserves._reserve0
		return rmoonPrice > 0 ? bnbPrice / rmoonPrice : 0
	}
	return 0
}

export function useBNBPrice(updates) {
	const { account, library } = useWeb3React()
	const [price, setPrice] = useState('0')
	
	useEffect(() => {
	  let isCancelled = false;
  
	  (async () => {
		const data = await getBNBPrice()
		if (!isCancelled) {
			setPrice(data)
		}
	  })()
  
	  return () => {
		isCancelled = true
	  }
	}, [updates, library, account])
	return price
}

export function useRetromoonPrice(updates) {
	const { account, library } = useWeb3React()
	const [balance, setBalance] = useState('0')
	
	useEffect(() => {
	  let isCancelled = false;
  
	  (async () => {
		const rmoonPrice = await getRetromoonPrice()
		if (!isCancelled) {
			setBalance(rmoonPrice)
		}
	  })()
  
	  return () => {
		isCancelled = true
	  }
	}, [updates, library, account])
	return balance
  }
  