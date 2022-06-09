/* pages/create-nft.js */
import { useState } from 'react'
import { ethers } from 'ethers'
import { useRouter } from 'next/router'
import Web3Modal from 'web3modal'

import {
  marketplaceAddress
} from '../config'

import CloseSea from '../artifacts/contracts/CloseSea.sol/CloseSea.json'

export default function ManageContract() {
  const [formInput, updateFormInput] = useState({ listing_fee: ''})
  const [current_listing_fee, setCurrent_listing_fee] = useState([])
  const router = useRouter()

  async function changeListingFee() {
    const web3Modal = new Web3Modal()
    web3Modal.clearCachedProvider()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()

    /* change the listing fee */
    const new_listing_fee = ethers.utils.parseUnits(formInput.listing_fee, 'ether')
    let contract = new ethers.Contract(marketplaceAddress, CloseSea.abi, signer)
    let transaction = await contract.updateListingPrice(new_listing_fee)
    await transaction.wait()

    router.push('/')
  }

  async function withdrawFund() {
    const web3Modal = new Web3Modal()
    web3Modal.clearCachedProvider()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()

    /* withdraw the listing fee income */
    let contract = new ethers.Contract(marketplaceAddress, CloseSea.abi, signer)
    let transaction = await contract.withdraw()
    await transaction.wait()

    router.push('/')
  }

  return (
    <div className="flex justify-center">
      <div className="w-1/2 flex flex-col pb-12">
        <input
          placeholder="Listing Fee in Eth"
          className="mt-2 border rounded p-4"
          onChange={e => updateFormInput({ ...formInput, listing_fee: e.target.value })}
        />
        <button onClick={changeListingFee} className="font-bold mt-4 bg-pink-500 text-white rounded p-4 shadow-lg">
          Change Listing Fee
        </button>

        <button onClick={withdrawFund} className="font-bold mt-4 bg-pink-500 text-white rounded p-4 shadow-lg">
          Withdraw Fund
        </button>
      </div>
    </div>
  )
}