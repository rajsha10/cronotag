"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { MetaMaskSDK } from "@metamask/sdk"

import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  NavbarButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "../components/ui/resizable-navbar"

const navItems = [
  { name: "Home", link: "/" },
  { name: "IP Register", link: "/register" },
  { name: "Search", link: "/search" },
]

// Ethereum Sepolia Testnet parameters
const ETHEREUM_TESTNET_PARAMS = {
  chainId: "0xaa36a7", // 11155111 in decimal (Sepolia)
  chainName: "Sepolia test network",
  rpcUrls: ["https://sepolia.infura.io/v3/YOUR_INFURA_KEY"],
  nativeCurrency: {
    name: "Sepolia Ether",
    symbol: "SEP",
    decimals: 18,
  },
  blockExplorerUrls: ["https://sepolia.etherscan.io"],
}

// Alternative: Ethereum Goerli Testnet (if you prefer Goerli)
// const ETHEREUM_TESTNET_PARAMS = {
//   chainId: "0x5", // 5 in decimal (Goerli)
//   chainName: "Goerli test network", 
//   rpcUrls: ["https://goerli.infura.io/v3/YOUR_INFURA_KEY"],
//   nativeCurrency: {
//     name: "Goerli Ether",
//     symbol: "GoerliETH",
//     decimals: 18,
//   },
//   blockExplorerUrls: ["https://goerli.etherscan.io"],
// }

export default function NavbarComponent() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [account, setAccount] = useState(null)
  const [chainId, setChainId] = useState(null)
  const [metamask, setMetamask] = useState(null)
  const [isConnecting, setIsConnecting] = useState(false)

  // Initialize MetaMask SDK
  useEffect(() => {
    const init = async () => {
      if (typeof window === "undefined" || !window.ethereum) {
        console.warn("MetaMask not installed")
        return
      }
  
      const provider = window.ethereum
  
      try {
        const accounts = await provider.request({ method: "eth_accounts" })
        if (accounts.length) setAccount(accounts[0])
  
        const currentChainId = await provider.request({ method: "eth_chainId" })
        setChainId(currentChainId)
  
        provider.on("accountsChanged", (accounts) => {
          setAccount(accounts[0] || null)
        })
  
        provider.on("chainChanged", (newChainId) => {
          setChainId(newChainId)
        })
      } catch (err) {
        console.error("Error initializing MetaMask:", err)
      }
    }
  
    init()
  
    return () => {
      if (window.ethereum) {
        window.ethereum.removeAllListeners("accountsChanged")
        window.ethereum.removeAllListeners("chainChanged")
      }
    }
  }, [])  

  // Handle scroll effects
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Switch to Ethereum testnet
  const switchToEthereumTestnet = async () => {
    if (!window.ethereum) return false

    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: ETHEREUM_TESTNET_PARAMS.chainId }],
      })
      return true
    } catch (err) {
      // If the error code is 4902, the network needs to be added
      if (err.code === 4902) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [ETHEREUM_TESTNET_PARAMS],
          })
          return true
        } catch (addError) {
          console.error("Error adding network:", addError)
          return false
        }
      } else {
        console.error("Error switching network:", err)
        return false
      }
    }
  }

  // Connect wallet using MetaMask SDK
  const connectWallet = async () => {
    // Prevent multiple simultaneous connection attempts
    if (isConnecting) {
      console.log("Connection already in progress...")
      return
    }

    const provider = metamask?.getProvider() || window.ethereum
  
    if (!provider) {
      alert("MetaMask not found! Please install MetaMask.")
      return
    }

    setIsConnecting(true)
  
    try {
      // Check if already connected first
      const existingAccounts = await provider.request({ method: "eth_accounts" })
      
      let accounts
      if (existingAccounts.length > 0) {
        // Already connected, use existing accounts
        accounts = existingAccounts
      } else {
        // Not connected, request connection
        accounts = await provider.request({ method: "eth_requestAccounts" })
      }
      
      if (accounts.length > 0) {
        setAccount(accounts[0])
        
        const currentChainId = await provider.request({ method: "eth_chainId" })
        setChainId(currentChainId)
        
        if (currentChainId !== ETHEREUM_TESTNET_PARAMS.chainId) {
          await switchToEthereumTestnet()
        }
      }
    } catch (error) {
      // Handle specific MetaMask errors
      if (error.code === -32002) {
        alert("Connection request already pending. Please check MetaMask.")
      } else if (error.code === 4001) {
        console.log("User rejected the connection request")
      } else {
        console.error("Wallet connection failed:", error)
        alert("Failed to connect wallet. Please try again.")
      }
    } finally {
      setIsConnecting(false)
    }
  }

  // Check if connected to the right network
  const isOnCorrectNetwork = chainId === ETHEREUM_TESTNET_PARAMS.chainId

  return (
    <div className="relative w-full">
      <Navbar className={scrolled ? "bg-background/80 backdrop-blur-md border-b border-border" : "bg-transparent"}>
        {/* Desktop Navigation */}
        <NavBody>
          <NavbarLogo />
          <NavItems items={navItems} pathname={pathname} />
          <div className="flex items-center gap-4">
            {account ? (
              <>
                {!isOnCorrectNetwork && (
                  <NavbarButton
                    variant="secondary"
                    onClick={switchToEthereumTestnet}
                    className="text-yellow-500 border-yellow-500 hover:bg-yellow-500/10"
                  >
                    Switch Network
                  </NavbarButton>
                )}
                <NavbarButton
                  variant="primary"
                  className={
                    isOnCorrectNetwork
                      ? "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                      : "bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700"
                  }
                >
                  {account.slice(0, 6) + "..." + account.slice(-4)}
                </NavbarButton>
              </>
            ) : (
              <NavbarButton 
                variant="primary" 
                onClick={connectWallet}
                disabled={isConnecting}
              >
                {isConnecting ? "Connecting..." : "Connect Wallet"}
              </NavbarButton>
            )}
          </div>
        </NavBody>

        {/* Mobile Navigation */}
        <MobileNav>
          <MobileNavHeader>
            <NavbarLogo />
            <MobileNavToggle isOpen={isOpen} onClick={() => setIsOpen(!isOpen)} />
          </MobileNavHeader>

          <MobileNavMenu isOpen={isOpen} onClose={() => setIsOpen(false)}>
            {navItems.map((item, idx) => (
              <a
                key={`mobile-link-${idx}`}
                href={item.link}
                onClick={() => setIsOpen(false)}
                className="relative text-lg font-medium transition-colors hover:text-primary"
              >
                <span className="block">{item.name}</span>
              </a>
            ))}
            <div className="flex w-full flex-col gap-4 mt-6">
              {account ? (
                <>
                  <div className="text-center font-medium">{account.slice(0, 6) + "..." + account.slice(-4)}</div>
                  {!isOnCorrectNetwork && (
                    <NavbarButton
                      variant="secondary"
                      onClick={switchToEthereumTestnet}
                      className="w-full text-yellow-500 border-yellow-500 hover:bg-yellow-500/10"
                    >
                      Switch to Sepolia Testnet
                    </NavbarButton>
                  )}
                </>
              ) : (
                <NavbarButton 
                  variant="primary" 
                  onClick={connectWallet} 
                  className="w-full"
                  disabled={isConnecting}
                >
                  {isConnecting ? "Connecting..." : "Connect Wallet"}
                </NavbarButton>
              )}
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>
    </div>
  )
}