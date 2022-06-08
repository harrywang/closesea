/* pages/create-nft.js */
import { useState } from 'react'
import { ethers } from 'ethers'
import { create as ipfsHttpClient } from 'ipfs-http-client'
import { useRouter } from 'next/router'
import Web3Modal from 'web3modal'

const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')

import {
  marketplaceAddress
} from '../config'

import CloseSea from '../artifacts/contracts/CloseSea.sol/CloseSea.json'

export default function CreateItem() {
  const [fileUrl, setFileUrl] = useState(null)
  const [formInput, updateFormInput] = useState({ price: '', name: '', description: '' })
  const router = useRouter()

  async function onChange(e) {
    /* upload image to IPFS */
    const file = e.target.files[0]
    try {
      const added = await client.add(
        file,
        {
          progress: (prog) => console.log(`received: ${prog}`)
        }
      )
      const url = `https://ipfs.infura.io/ipfs/${added.path}`
      setFileUrl(url)
    } catch (error) {
      console.log('Error uploading file: ', error)
    }  
  }
  async function uploadToIPFS() {
    const { name, description, price } = formInput
    // random assign three traits for demo purposes
    // two strings and one number
    const colors = ["Red", "Yellow", "Blue", "Green"];
    const color_len = colors?.length || 0;
    const random_color = Math.floor(Math.random() * color_len);
    const color = colors[random_color]
    console.log(color);

    const zodiac = ["Aries (Ram): March 21–April 19", "Taurus (Bull): April 20–May 20", "Gemini (Twins): May 21–June 21", "Cancer (Crab): June 22–July 22", "Leo (Lion): July 23–August 22", "Virgo (Virgin): August 23–September 22", "Libra (Balance): September 23–October 23", "Scorpius (Scorpion): October 24–November 21", "Sagittarius (Archer): November 22–December 21", "Capricornus (Goat): December 22–January 19", "Aquarius (Water Bearer): January 20–February 18", "Pisces (Fish): February 19–March 20"]
    const zodiac_len = zodiac?.length || 0;
    const random_zodiac = Math.floor(Math.random() * zodiac_len);
    const z = zodiac[random_zodiac]
    console.log(z);

    const power = [3, 5, 6, 7, 9];
    const power_len = power?.length || 0;
    const random_power = Math.floor(Math.random() * power_len);
    const p = power[random_power]
    console.log(p);

    const attributes =[
      {
        "trait_type": "Color", 
        "value": color
      }, 
      {
        "trait_type": "Zodiac", 
        "value": z
      },
      {
        "trait_type": "Power", 
        "value": p
      }
    ]

    if (!name || !description || !price || !fileUrl) return
    /* first, upload metadata to IPFS */
    const data = JSON.stringify({
      name, description, image: fileUrl, attributes
    })
    console.log(data)

    try {
      const added = await client.add(data)
      const url = `https://ipfs.infura.io/ipfs/${added.path}`
      /* after metadata is uploaded to IPFS, return the URL to use it in the transaction */
      return url
    } catch (error) {
      console.log('Error uploading file: ', error)
    }  
  }

  async function listNFTForSale() {
    const url = await uploadToIPFS()
    const web3Modal = new Web3Modal()
    web3Modal.clearCachedProvider()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()

    /* create the NFT */
    const price = ethers.utils.parseUnits(formInput.price, 'ether')
    let contract = new ethers.Contract(marketplaceAddress, CloseSea.abi, signer)
    let listingPrice = await contract.getListingPrice()
    listingPrice = listingPrice.toString()
    let transaction = await contract.createToken(url, price, { value: listingPrice })
    await transaction.wait()

    router.push('/')
  }

  return (
    <div className="flex justify-center">
      <div className="w-1/2 flex flex-col pb-12">
        <input 
          placeholder="Asset Name"
          className="mt-8 border rounded p-4"
          onChange={e => updateFormInput({ ...formInput, name: e.target.value })}
        />
        <textarea
          placeholder="Asset Description"
          className="mt-2 border rounded p-4"
          onChange={e => updateFormInput({ ...formInput, description: e.target.value })}
        />
        <input
          placeholder="Asset Price in Eth"
          className="mt-2 border rounded p-4"
          onChange={e => updateFormInput({ ...formInput, price: e.target.value })}
        />
        <input
          type="file"
          name="Asset"
          className="my-4"
          onChange={onChange}
        />
        {
          fileUrl && (
            <img className="rounded mt-4" width="350" src={fileUrl} />
          )
        }
        <button onClick={listNFTForSale} className="font-bold mt-4 bg-pink-500 text-white rounded p-4 shadow-lg">
          Create NFT
        </button>
      </div>
    </div>
  )
}