/* pages/_app.js */
import '../styles/globals.css'
import Link from 'next/link'

function MyApp({ Component, pageProps }) {
  return (
    <div>
      <nav className="border-b p-6">
        <p className="text-4xl font-bold">CloseSea</p>
        <p className="text-sm">The smallest NFT marketplace</p>

        <div className="flex mt-4">
          <Link href="/">
            <a className="mr-4 text-pink-500">
              Home
            </a>
          </Link>
          <Link href="/create-nft">
            <a className="mr-6 text-pink-500">
              Sell NFT
            </a>
          </Link>
          <Link href="/my-nfts">
            <a className="mr-6 text-pink-500">
              My NFTs
            </a>
          </Link>
          <Link href="/dashboard">
            <a className="mr-6 text-pink-500">
              My Listed NFTs
            </a>
          </Link>
          <Link href="/manage-contract">
            <a className="mr-6 text-pink-500">
              Manage Contract
            </a>
          </Link>
          <Link href="https://harrywang.me/closesea">
            <a className="mr-6 text-pink-500">
              Docs
            </a>
          </Link>
        </div>
      </nav>
      <Component {...pageProps} />
    </div>
  )
}

export default MyApp
