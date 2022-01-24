import React, { useState, useEffect } from 'react'
import { useWeb3React } from '@web3-react/core'
import { useStakingContract } from '../assets/StakingContract'

export function useCanDeposit() {
  const { account, library } = useWeb3React()
  const staking = useStakingContract()
  const [deposit, setDeposit] = useState('0')
  
  useEffect(() => {
    let isCancelled = false;

    (async () => {
      const data = await staking.canDeposit()
      if (!isCancelled) {
        setDeposit(data)
      }
    })()

    return () => {
      isCancelled = true
    }
  }, [library, account])
  return deposit
}

export function useAPY() {
  const { account, library } = useWeb3React()
  const staking = useStakingContract()
  const [apy, setAPY] = useState('0')
  
  useEffect(() => {
    let isCancelled = false;

    (async () => {
      const data = await staking.getAPY()
      if (!isCancelled) {
        setAPY(data)
      }
    })()

    return () => {
      isCancelled = true
    }
  }, [library, account])
  return apy
}

export function useMaxBalance() {
  const { account, library } = useWeb3React()
  const staking = useStakingContract()
  const [maxBalance, setMaxBalance] = useState('0')
  
  useEffect(() => {
    let isCancelled = false;

    (async () => {
      const data = await staking.getMaxBalance()
      if (!isCancelled) {
        setMaxBalance(library ? library.utils.fromWei(data.toString()) : data)
      }
    })()

    return () => {
      isCancelled = true
    }
  }, [library, account])
  return maxBalance
}

export function useMaxStake() {
  const { account, library } = useWeb3React()
  const staking = useStakingContract()
  const [maxStake, setMaxStake] = useState('0')
  
  useEffect(() => {
    let isCancelled = false;

    (async () => {
      const data = await staking.getMaxStake()
      if (!isCancelled) {
        setMaxStake(library ? library.utils.fromWei(data.toString()) : data)
      }
    })()

    return () => {
      isCancelled = true
    }
  }, [library, account])
  return maxStake
}

export function useStakedBalance(updates) {
  const { account, library } = useWeb3React()
  const staking = useStakingContract()
  const [staked, setStaked] = useState('0')
  
  useEffect(() => {
    let isCancelled = false;

    (async () => {
      const data = await staking.getBalance(account)
      if (!isCancelled) {
        setStaked(library ? library.utils.fromWei(data.toString()) : data)
      }
    })()

    return () => {
      isCancelled = true
    }
  }, [updates, library, account])
  return staked
}

export function useEarnedBalance(updates) {
  const { account, library } = useWeb3React()
  const staking = useStakingContract()
  const [earned, setEarned] = useState('0')
  
  useEffect(() => {
    let isCancelled = false;

    (async () => {
      const data = await staking.calculateRewards(account)
      if (!isCancelled) {
        setEarned(library ? library.utils.fromWei(data.toString()) : data)
      }
    })()

    return () => {
      isCancelled = true
    }
  }, [updates, library, account])
  return earned
}

export function useTotalDeposited(updates) {
  const { account, library } = useWeb3React()
  const staking = useStakingContract()
  const [locked, setLocked] = useState('0')
  
  useEffect(() => {
    let isCancelled = false;

    (async () => {
      const data = await staking.getTotalDeposited()
      if (!isCancelled) {
        setLocked(library ? library.utils.fromWei(data.toString()) : data)
      }
    })()

    return () => {
      isCancelled = true
    }
  }, [updates, library, account])
  return locked
}

export function useApproved(amount, updates) {
  const { account, library } = useWeb3React()
  const staking = useStakingContract()
  const [approved, setApproved] = useState(false)
  
  useEffect(() => {
    let isCancelled = false;

    (async () => {
      const data = await staking.isApproved(amount)
      if (!isCancelled) {
        setApproved(data)
      }
    })()

    return () => {
      isCancelled = true
    }
  }, [amount, updates, library, account])
  return approved
}