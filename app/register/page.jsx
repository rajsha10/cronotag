"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowRight, FileText, Upload, Check, AlertCircle } from "lucide-react"
import Link from "next/link"
import { ethers } from "ethers"
import axios from "axios"

import { AnimatedButton } from "@/components/ui/animated-button"
import { CardHover } from "@/components/ui/card-hover"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import Navbar from "@/components/navbar"
import { useToast } from "@/hooks/use-toast"

// CronoTag ABI - this should be the ABI of your deployed contract
import cronoTagABI from '../abis/CronoTag.json';

// Contract address - replace with your deployed contract address
const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS

export default function RegisterPage() {
  const { toast } = useToast()
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [cronoTag, setCronoTag] = useState("")
  const [ipfsHash, setIpfsHash] = useState("")
  const [formData, setFormData] = useState({
    title: "",
    authors: "",
    description: "", 
    designation: "", 
    place: "", 
    keywords: "",
    file: null,
  })

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({
        ...formData,
        file: e.target.files[0],
      })
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  // Function to upload file to IPFS using Pinata
  const uploadToPinata = async (file) => {
    try {
      const formDataForPinata = new FormData()
      formDataForPinata.append("file", file)

      const metadata = JSON.stringify({
        name: file.name,
        keyvalues: {
          title: formData.title,
          authors: formData.authors,
          type: file.type,
        },
      })
      formDataForPinata.append("pinataMetadata", metadata)

      const options = JSON.stringify({ cidVersion: 0 })
      formDataForPinata.append("pinataOptions", options)

      const url = "https://api.pinata.cloud/pinning/pinFileToIPFS"

      // Make the API request with the correct FormData object
      const response = await axios.post(url, formDataForPinata, {
        maxBodyLength: Number.POSITIVE_INFINITY,
        headers: {
          "Content-Type": "multipart/form-data",
          pinata_api_key: process.env.NEXT_PUBLIC_PINATA_API_KEY,
          pinata_secret_api_key: process.env.NEXT_PUBLIC_PINATA_SECRET_API_KEY,
        },
      })

      console.log("PINATA API KEY:", process.env.NEXT_PUBLIC_PINATA_API_KEY ? "Set" : "Not set")
      console.log("PINATA SECRET:", process.env.NEXT_PUBLIC_PINATA_SECRET_API_KEY ? "Set" : "Not set")

      const ipfsHash = response.data.IpfsHash

      // Return the IPFS hash
      return ipfsHash
    } catch (error) {
      console.error("Error uploading file to Pinata:", error)
      console.error("Error response:", error.response?.data)
      throw error
    }
  }

  // Function to register IP on blockchain
  const registerIPOnBlockchain = async (ipfsHash) => {
    try {
      // Check if MetaMask is installed
      if (!window.ethereum) {
        throw new Error("Please install MetaMask to interact with the blockchain")
      }

      // Request account access
      await window.ethereum.request({ method: "eth_requestAccounts" })

      // Create a provider and signer
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const { chainId } = await provider.getNetwork()
      if (chainId !== 11155111) {
        throw new Error("Please switch to the Sepolia testnet in MetaMask")
      }
      const signer = provider.getSigner()

      // Create contract instance
      const contract = new ethers.Contract(contractAddress, CronoTagABI, signer)

      const tx = await contract.registerIP(
        formData.authors,
        formData.designation,
        formData.place,
        formData.title,
        formData.description,
        ipfsHash
      )      

      // Wait for transaction to be mined
      const receipt = await tx.wait()
      toast({
        title: "Transaction Confirmed",
        description: `Tx Hash: ${receipt.transactionHash}`,
      })
      
      // Get CronoTag from event
      const event = receipt.events.find((event) => event.event === "IPRegistered")
      if (event) {
        const cronoTagValue = event.args.cronoTag.toString()
        return cronoTagValue
      }

      throw new Error("Failed to get CronoTag from transaction")
    } catch (error) {
      console.error("Error registering IP on blockchain:", error)
      throw error
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Validate form data
      if (!formData.file) {
        toast({
          title: "Error",
          description: "Please upload a file",
          variant: "destructive",
        })
        setIsSubmitting(false)
        return
      }

      // 1. Upload file to IPFS via Pinata
      toast({
        title: "Uploading to IPFS",
        description: "Please wait while your file is being uploaded to IPFS via Pinata...",
      })

      const hash = await uploadToPinata(formData.file)
      setIpfsHash(hash)

      toast({
        title: "IPFS Upload Complete",
        description: "Your file has been uploaded to IPFS successfully.",
      })

      // 2. Register on blockchain
      toast({
        title: "Registering on Blockchain",
        description: "Please confirm the transaction in your wallet...",
      })

      const tag = await registerIPOnBlockchain(hash)
      setCronoTag(tag)

      toast({
        title: "Registration Successful",
        description: "Your intellectual property has been registered on the blockchain.",
      })

      setIsSuccess(true)
    } catch (error) {
      console.error("Error during submission:", error)
      toast({
        title: "Registration Failed",
        description: error.message || "An error occurred during registration",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const nextStep = () => {
    setStep(step + 1)
  }

  const prevStep = () => {
    setStep(step - 1)
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
                Register
              </span>{" "}
              Your Intellectual Property
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Secure your research with blockchain technology. Fill out the form below to register your intellectual
              property and receive a unique Crono Tag.
            </p>
          </motion.div>

          <div className="mb-8">
            <div className="flex justify-between">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                      step >= i
                        ? "bg-gradient-to-r from-dark-red to-blue-primary text-white"
                        : "bg-secondary text-muted-foreground"
                    }`}
                  >
                    {step > i ? <Check size={18} /> : i}
                  </div>
                  <span className={`text-sm ${step >= i ? "text-primary" : "text-muted-foreground"}`}>
                    {i === 1 ? "Research Details" : i === 2 ? "Upload Files" : "Confirmation"}
                  </span>
                </div>
              ))}
            </div>
            <div className="relative mt-2">
              <div className="absolute top-0 left-0 right-0 h-1 bg-secondary rounded-full"></div>
              <div
                className="absolute top-0 left-0 h-1 bg-gradient-to-r from-dark-red to-blue-primary rounded-full transition-all duration-500"
                style={{ width: `${((step - 1) / 2) * 100}%` }}
              ></div>
            </div>
          </div>

          <CardHover className="p-8">
            {step === 1 && (
              <motion.div initial="hidden" animate="visible" variants={fadeIn}>
                <h2 className="text-xl font-medium mb-6">Research Details</h2>
                <form className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Research Title</Label>
                    <Input
                      id="title"
                      name="title"
                      placeholder="Enter the title of your research"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="authors">Authors</Label>
                    <Input
                      id="authors"
                      name="authors"
                      placeholder="Enter author names (separated by commas)"
                      value={formData.authors}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="designation">Designation</Label>
                    <Input
                      id="designation"
                      name="designation"
                      placeholder="Enter your designation"
                      value={formData.designation}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="place">Place</Label>
                    <Input
                      id="place"
                      name="place"
                      placeholder="Enter the place of research"
                      value={formData.place}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      placeholder="Enter a brief description of your research"
                      rows={5}
                      value={formData.description}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="keywords">Keywords</Label>
                    <Input
                      id="keywords"
                      name="keywords"
                      placeholder="Enter keywords (separated by commas)"
                      value={formData.keywords}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="flex justify-end">
                    <AnimatedButton onClick={nextStep}>
                      Next Step <ArrowRight size={16} className="ml-2" />
                    </AnimatedButton>
                  </div>
                </form>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div initial="hidden" animate="visible" variants={fadeIn}>
                <h2 className="text-xl font-medium mb-6">Upload Files</h2>
                <div className="space-y-6">
                  <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                    <div className="flex flex-col items-center">
                      <Upload size={48} className="text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-2">Drag and drop your files here</h3>
                      <p className="text-muted-foreground mb-4">or click to browse (PDF, DOCX, ZIP up to 50MB)</p>
                      <Input id="file-upload" type="file" className="hidden" onChange={handleFileChange} />
                      <Button variant="outline" onClick={() => document.getElementById("file-upload")?.click()}>
                        Browse Files
                      </Button>
                    </div>
                  </div>

                  {formData.file && (
                    <div className="flex items-center p-3 bg-secondary rounded-lg">
                      <FileText size={24} className="text-primary mr-3" />
                      <div className="flex-1">
                        <p className="text-sm font-medium truncate">{formData.file.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {(formData.file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => setFormData({ ...formData, file: null })}>
                        Remove
                      </Button>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <Button variant="outline" onClick={prevStep}>
                      Back
                    </Button>
                    <AnimatedButton onClick={nextStep}>
                      Next Step <ArrowRight size={16} className="ml-2" />
                    </AnimatedButton>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && !isSuccess && (
              <motion.div initial="hidden" animate="visible" variants={fadeIn}>
                <h2 className="text-xl font-medium mb-6">Confirm Registration</h2>
                <div className="space-y-6">
                  <div className="bg-secondary rounded-lg p-6 space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Research Title</h3>
                      <p>{formData.title || "Not provided"}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Authors</h3>
                      <p>{formData.authors || "Not provided"}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Designation</h3>
                      <p>{formData.designation || "Not provided"}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Place</h3>
                      <p>{formData.place || "Not provided"}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Description</h3>
                      <p className="line-clamp-3">{formData.description || "Not provided"}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Keywords</h3>
                      <p>{formData.keywords || "Not provided"}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Files</h3>
                      <p>{formData.file ? formData.file.name : "No file uploaded"}</p>
                    </div>
                  </div>

                  <div className="bg-secondary/50 rounded-lg p-4 flex items-start">
                    <AlertCircle size={20} className="text-primary mr-3 mt-0.5" />
                    <p className="text-sm">
                      By registering your research, you confirm that you are the rightful owner of this intellectual
                      property and agree to our{" "}
                      <Link href="#" className="text-primary hover:underline">
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link href="#" className="text-primary hover:underline">
                        Privacy Policy
                      </Link>
                      .
                    </p>
                  </div>

                  <div className="flex justify-between">
                    <Button variant="outline" onClick={prevStep}>
                      Back
                    </Button>
                    <AnimatedButton onClick={handleSubmit} disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <span className="mr-2">Processing</span>
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        </>
                      ) : (
                        <>Register on Blockchain</>
                      )}
                    </AnimatedButton>
                  </div>
                </div>
              </motion.div>
            )}

            {isSuccess && (
              <motion.div initial="hidden" animate="visible" variants={fadeIn} className="text-center py-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-6">
                  <Check size={32} />
                </div>
                <h2 className="text-2xl font-medium mb-4">Registration Successful!</h2>
                <p className="text-muted-foreground mb-6">
                  Your research has been successfully registered on the blockchain.
                </p>
                <div className="bg-secondary rounded-lg p-6 mb-8">
                  <h3 className="text-lg font-medium mb-2">Your Crono Tag</h3>
                  <div className="flex items-center justify-center">
                    <div className="bg-background px-4 py-2 rounded-md font-mono text-xl tracking-wider">
                      {cronoTag}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Save this tag for future reference and verification.
                  </p>
                </div>
                {/* <div className="bg-secondary rounded-lg p-6 mb-8">
                  <h3 className="text-lg font-medium mb-2">IPFS Hash</h3>
                  <div className="flex items-center justify-center">
                    <div className="bg-background px-4 py-2 rounded-md font-mono text-sm tracking-wider overflow-x-auto">
                      {ipfsHash}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Your file is permanently stored on IPFS with this hash.
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    <Link
                      href={`https://gateway.pinata.cloud/ipfs/${ipfsHash}`}
                      target="_blank"
                      className="text-primary hover:underline"
                    >
                      View on IPFS
                    </Link>
                  </p>
                </div> */}
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <AnimatedButton>
                    <Link href="/search">Verify Your Tag</Link>
                  </AnimatedButton>
                  <Button variant="outline">
                    <Link href="/">Return to Home</Link>
                  </Button>
                </div>
              </motion.div>
            )}
          </CardHover>
        </div>
      </div>
    </>
  )
}

