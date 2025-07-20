"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Search, FileText, Calendar, User, ArrowRight, AlertCircle, Building, MapPin, Wallet } from "lucide-react"
import { ethers } from "ethers"
import { MetaMaskSDK } from "@metamask/sdk"

import { AnimatedButton } from "@/components/ui/animated-button"
import { CardHover } from "@/components/ui/card-hover"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Alert, AlertDescription } from "@/components/ui/alert"

import contractABI from "../abis/ChronoTag.json"
const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [searchResult, setSearchResult] = useState(null)
  const [error, setError] = useState(null)
  const [isConnected, setIsConnected] = useState(false)
  const [account, setAccount] = useState("")
  const [contract, setContract] = useState(null)
  const [accessFee, setAccessFee] = useState("0.02")
  const [showPaymentSection, setShowPaymentSection] = useState(false)
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)
  const [ipfsHash, setIpfsHash] = useState(null)
  const [transactionStatus, setTransactionStatus] = useState(null)
  const [ipfsContent, setIpfsContent] = useState(null)

  // Create refs for MetaMask SDK and provider
  const mmsdkRef = useRef(null)
  const providerRef = useRef(null)

  // Initialize MetaMask SDK
  useEffect(() => {
    const initMetaMask = async () => {
      try {
        // Only initialize if not already initialized
        if (!mmsdkRef.current) {
          // Initialize MetaMask SDK
          mmsdkRef.current = new MetaMaskSDK({
            dappMetadata: {
              name: "CronoTag Research Platform",
              url: window.location.href,
            },
            // Make sure to wait for initialization
            shouldShimWeb3: true,
          })

          // Wait a moment for SDK to initialize
          setTimeout(() => {
            // Get ethereum provider
            if (window.ethereum) {
              providerRef.current = window.ethereum

              // Check if already connected
              if (providerRef.current.selectedAddress) {
                setIsConnected(true)
                setAccount(providerRef.current.selectedAddress)
                initializeContract()
              }
            }
          }, 500)
        }
      } catch (error) {
        console.error("Error initializing MetaMask SDK:", error)
        setError("Failed to initialize wallet connection")
      }
    }

    initMetaMask()
  }, [])

  // Connect to MetaMask
  const connectWallet = async () => {
    try {
      // Check if window.ethereum is available (MetaMask extension)
      if (!window.ethereum) {
        setError("MetaMask not detected. Please install the MetaMask extension.")
        return
      }

      // Use window.ethereum directly
      providerRef.current = window.ethereum

      // Request accounts
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" })

      if (accounts && accounts.length > 0) {
        setIsConnected(true)
        setAccount(accounts[0])
        setError(null)

        // Initialize contract
        await initializeContract()
      } else {
        throw new Error("No accounts returned from MetaMask")
      }
    } catch (error) {
      console.error("Error connecting wallet:", error)
      setError("Failed to connect wallet. Please try again.")
    }
  }

  // Initialize contract when connected
  const initializeContract = async () => {
    try {
      if (!window.ethereum) return

      const ethersProvider = new ethers.providers.Web3Provider(window.ethereum)
      const network = await ethersProvider.getNetwork()
      console.log("Current network:", network)

      const signer = ethersProvider.getSigner()

      // Log for debugging
      console.log("Contract address:", contractAddress)

      if (!contractAddress) {
        console.error("Contract address is undefined")
        setError("Contract address is not configured properly")
        return
      }

      // Create contract instance
      const cronoTagContract = new ethers.Contract(contractAddress, contractABI, signer)
      console.log("Contract instance created")
      setContract(cronoTagContract)

      // Get access fee from contract
      try {
        const fee = await cronoTagContract.accessFee()
        console.log("Access fee retrieved:", ethers.utils.formatEther(fee))
        setAccessFee(ethers.utils.formatEther(fee))
      } catch (err) {
        console.error("Error fetching access fee:", err)
      }
    } catch (error) {
      console.error("Error initializing contract:", error)
      setError("Failed to initialize contract connection")
    }
  }

  const handleSearch = async (e) => {
    e.preventDefault()
    setError(null)
    setSearchResult(null)
    setIpfsHash(null)
    setIpfsContent(null)
    setShowPaymentSection(false)

    if (!searchQuery.trim()) {
      setError("Please enter a Crono Tag ID")
      return
    }

    // Validate that the input is a 12-digit number
    const cronoTagPattern = /^\d{1,12}$/
    if (!cronoTagPattern.test(searchQuery)) {
      setError("Invalid Crono Tag format. Please enter a number up to 12 digits")
      return
    }

    if (!isConnected) {
      setError("Please connect your wallet first to search for Crono Tags")
      return
    }

    if (!contract) {
      setError("Blockchain connection not established. Please make sure your wallet is connected")
      return
    }

    setIsSearching(true)

    try {
      // Call the contract's searchResearchByCronoTag function
      const result = await contract.searchResearchByCronoTag(searchQuery)
      console.log("Search result:", result)

      // Parse the returned data
      const [authors, designation, place, title, description, timestamp] = result

      // Convert timestamp to readable date
      const date = new Date(timestamp.toNumber() * 1000).toLocaleString()

      setSearchResult({
        id: searchQuery,
        title,
        authors,
        designation,
        place,
        description,
        date,
        // We'll get the IPFS hash only after payment
        ipfsHash: null,
      })
    } catch (err) {
      console.error("Error searching for Crono Tag:", err)
      setError(
        "Error retrieving data from blockchain. The Crono Tag may not exist or there might be a connection issue",
      )
    } finally {
      setIsSearching(false)
    }
  }

  const handleAccessRequest = () => {
    console.log("Access request button clicked")
    if (!isConnected) {
      setError("Please connect your wallet to access this document")
      return
    }

    setShowPaymentSection(true)
    console.log("Payment section shown")
  }

  const handlePayment = async () => {
    setIsProcessingPayment(true)
    setTransactionStatus("Processing payment...")

    try {
      console.log("Contract object:", contract)
      console.log("searchQuery:", searchQuery)
      console.log("accessFee:", accessFee)

      // Convert access fee to wei
      const feeInWei = ethers.utils.parseEther(accessFee)
      console.log("Fee in wei:", feeInWei.toString())

      try {
        // First, estimate gas to see if the transaction would succeed
        const gasEstimate = await contract.estimateGas.accessIP(searchQuery, {
          value: feeInWei,
        })
        console.log("Gas estimate successful:", gasEstimate.toString())
      } catch (gasError) {
        console.error("Gas estimation failed:", gasError)
        throw new Error(`Transaction would fail: ${gasError.message}`)
      }

      // Call the accessIP function with the payment
      // IMPORTANT: accessIP expects the CronoTag as a number, not a string
      const transaction = await contract.accessIP(searchQuery, { value: feeInWei })
      console.log("Transaction submitted:", transaction.hash)

      setTransactionStatus("Transaction submitted. Waiting for confirmation...")

      // Wait for transaction to be mined
      const receipt = await transaction.wait()
      console.log("Transaction receipt:", receipt)

      // Transaction successful
      if (receipt.status === 1) {
        console.log("Transaction successful")

        try {
          // Call getResearchDetails to get the IPFS hash
          // This is a view function so it doesn't cost gas
          const details = await contract.getResearchDetails(searchQuery)
          console.log("Research details:", details)

          // The IPFS hash is at index 5 according to your contract
          const retrievedHash = details[5]
          console.log("Retrieved IPFS hash:", retrievedHash)

          if (retrievedHash) {
            setIpfsHash(retrievedHash)
            setSearchResult((prev) => ({
              ...prev,
              ipfsHash: retrievedHash,
            }))
            setTransactionStatus("Payment successful! Document access granted.")

            // Fetch the IPFS content
            fetchIpfsContent(retrievedHash)
          } else {
            setTransactionStatus("Error: Unable to retrieve document hash")
          }
        } catch (detailsError) {
          console.error("Error retrieving research details:", detailsError)
          setTransactionStatus("Error retrieving document details")
        }
      } else {
        setTransactionStatus("Transaction failed. Please try again.")
      }
    } catch (err) {
      console.error("Payment error:", err)
      setTransactionStatus("Error processing payment: " + (err.message || "Unknown error"))
    } finally {
      setIsProcessingPayment(false)
    }
  }

  const fetchIpfsContent = async (hash) => {
    try {
      setTransactionStatus("Fetching document from IPFS...")
      const ipfsUrl = `https://ipfs.io/ipfs/${hash}`
      const response = await fetch(ipfsUrl)

      if (!response.ok) {
        throw new Error(`Failed to fetch IPFS content: ${response.statusText}`)
      }

      // Try to determine content type
      const contentType = response.headers.get("content-type")

      if (contentType && contentType.includes("application/json")) {
        const jsonData = await response.json()
        setIpfsContent({ type: "json", data: jsonData })
      } else if (contentType && contentType.includes("text/")) {
        const textData = await response.text()
        setIpfsContent({ type: "text", data: textData })
      } else if (contentType && contentType.includes("image/")) {
        setIpfsContent({ type: "image", url: ipfsUrl })
      } else if (contentType && contentType.includes("application/pdf")) {
        setIpfsContent({ type: "pdf", url: ipfsUrl })
      } else {
        // Default to iframe for other content types
        setIpfsContent({ type: "iframe", url: ipfsUrl })
      }

      setTransactionStatus("Document loaded successfully!")
    } catch (error) {
      console.error("Error fetching IPFS content:", error)
      setTransactionStatus(`Error loading document: ${error.message}`)
    }
  }

  const renderIpfsContent = () => {
    if (!ipfsContent) return null

    switch (ipfsContent.type) {
      case "text":
        return (
          <div className="bg-white p-4 rounded-lg shadow max-h-96 overflow-auto">
            <pre className="whitespace-pre-wrap">{ipfsContent.data}</pre>
          </div>
        )
      case "json":
        return (
          <div className="bg-white p-4 rounded-lg shadow max-h-96 overflow-auto">
            <pre className="whitespace-pre-wrap">{JSON.stringify(ipfsContent.data, null, 2)}</pre>
          </div>
        )
      case "image":
        return (
          <div className="flex justify-center">
            <img
              src={ipfsContent.url || "/placeholder.svg"}
              alt="IPFS Document"
              className="max-w-full max-h-96 object-contain rounded-lg shadow"
            />
          </div>
        )
      case "pdf":
        return (
          <div className="w-full h-96">
            <iframe src={ipfsContent.url} className="w-full h-full rounded-lg shadow" title="PDF Document" />
          </div>
        )
      case "iframe":
        return (
          <div className="w-full h-96">
            <iframe src={ipfsContent.url} className="w-full h-full rounded-lg shadow" title="IPFS Document" />
          </div>
        )
      default:
        return (
          <div className="bg-yellow-50 p-4 rounded-lg text-yellow-700">
            Unable to display this content type directly.
            <a
              href={`https://ipfs.io/ipfs/${ipfsHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block mt-2 text-blue-600 hover:underline"
            >
              Open in new tab
            </a>
          </div>
        )
    }
  }

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  }

  return (
    <>
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h1 className="text-3xl md:text-4xl font-heading mb-4">
              <span className="bg-gradient-to-r from-dark-red to-blue-primary bg-clip-text text-transparent">
                Search
              </span>{" "}
              Crono Tag Records
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Enter a 12-digit Crono Tag ID to verify and retrieve research information from the blockchain.
            </p>
          </motion.div>

          {/* Wallet Connection Status */}
          <div className="mb-8 flex justify-center">
            {isConnected ? (
              <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 text-green-600 rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>
                  Connected: {account.substring(0, 6)}...{account.substring(account.length - 4)}
                </span>
              </div>
            ) : (
              <Button onClick={connectWallet} className="flex items-center gap-2" variant="outline">
                <Wallet size={16} />
                Connect MetaMask
              </Button>
            )}
          </div>

          <CardHover className="p-8 mb-8">
            <form onSubmit={handleSearch} className="space-y-6">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Enter 12-digit Crono Tag (e.g., 123456789012)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              </div>

              {error && (
                <div className="flex items-center p-3 bg-destructive/10 text-destructive rounded-md">
                  <AlertCircle size={16} className="mr-2" />
                  <p className="text-sm">{error}</p>
                </div>
              )}

              <div className="flex justify-center">
                <AnimatedButton type="submit" disabled={isSearching || !isConnected}>
                  {isSearching ? (
                    <>
                      <span className="mr-2">Searching</span>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    </>
                  ) : (
                    <>
                      Search <ArrowRight size={16} className="ml-2" />
                    </>
                  )}
                </AnimatedButton>
              </div>
            </form>
          </CardHover>

          {searchResult && (
            <motion.div initial="hidden" animate="visible" variants={fadeIn}>
              <CardHover className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <h2 className="text-xl font-medium">Research Information</h2>
                  <div className="px-3 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-500">
                    Verified by Crono-TAG
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <FileText size={20} className="text-primary mr-3 mt-1" />
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Research Title</h3>
                        <p className="font-medium">{searchResult.title}</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <User size={20} className="text-primary mr-3 mt-1" />
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Authors</h3>
                        <p>{searchResult.authors}</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <Building size={20} className="text-primary mr-3 mt-1" />
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Designation</h3>
                        <p>{searchResult.designation}</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <MapPin size={20} className="text-primary mr-3 mt-1" />
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Place</h3>
                        <p>{searchResult.place}</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <Calendar size={20} className="text-primary mr-3 mt-1" />
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Timestamp</h3>
                        <p>{searchResult.date}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-secondary rounded-lg p-4">
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Description</h3>
                    <p className="text-sm">{searchResult.description}</p>
                  </div>

                  {!ipfsHash && (
                    <div className="bg-secondary/50 rounded-lg p-4 flex items-start">
                      <AlertCircle size={20} className="text-primary mr-3 mt-0.5" />
                      <p className="text-sm">
                        This record was verified on the blockchain with Crono Tag #{searchResult.id}. To access the
                        full document, you need to pay {accessFee} ETH.
                      </p>
                    </div>
                  )}

                  {/* Payment Section - Shown when Access Document is clicked */}
                  {showPaymentSection && !ipfsHash && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      transition={{ duration: 0.3 }}
                      className="border rounded-lg p-6 bg-card"
                    >
                      <h3 className="text-lg font-medium mb-4">Access Research Document</h3>
                      <p className="text-muted-foreground mb-4">
                        Pay {accessFee} $ to access the full research document.
                      </p>

                      {transactionStatus && (
                        <Alert
                          className={`mb-4 ${
                            transactionStatus.includes("successful") || transactionStatus.includes("loaded")
                              ? "bg-green-500/10 text-green-500"
                              : transactionStatus.includes("Processing") ||
                                  transactionStatus.includes("Waiting") ||
                                  transactionStatus.includes("Fetching")
                                ? "bg-yellow-500/10 text-yellow-500"
                                : "bg-destructive/10 text-destructive"
                          }`}
                        >
                          <AlertDescription>{transactionStatus}</AlertDescription>
                        </Alert>
                      )}

                      <div className="flex flex-col sm:flex-row gap-3 justify-end">
                        <Button
                          variant="outline"
                          onClick={() => {
                            setShowPaymentSection(false)
                            setTransactionStatus(null)
                          }}
                          disabled={isProcessingPayment}
                        >
                          Cancel
                        </Button>
                        <Button onClick={handlePayment} disabled={isProcessingPayment} className="sm:min-w-[120px]">
                          {isProcessingPayment ? (
                            <>
                              <span className="mr-2">Processing</span>
                              <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                            </>
                          ) : (
                            `Pay ${accessFee} $`
                          )}
                        </Button>
                      </div>
                    </motion.div>
                  )}

                  {ipfsHash && ipfsContent && (
                    <div className="mt-6">
                      <h3 className="text-lg font-medium mb-4">Document Content</h3>
                      {renderIpfsContent()}
                    </div>
                  )}

                  {/* Show Access Document button only if not showing payment section and no IPFS hash yet */}
                  {!showPaymentSection && !ipfsHash && (
                    <div className="flex justify-center">
                      <Button onClick={handleAccessRequest} className="w-full">
                        Access Document ({accessFee} $)
                      </Button>
                    </div>
                  )}

                  {/* Show Open Document button if we have the IPFS hash */}
                  {ipfsHash && (
                    <div className="flex justify-center mt-4">
                      <a
                        href={`https://ipfs.io/ipfs/${ipfsHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md"
                      >
                        Open Document in New Tab
                      </a>
                    </div>
                  )}
                </div>
              </CardHover>
            </motion.div>
          )}
        </div>
      </div>

      <Footer />
    </>
  )
}