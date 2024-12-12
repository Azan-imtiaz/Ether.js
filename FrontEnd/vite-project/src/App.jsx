import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import abi from './abi';

function App() {
  const [conn, setConn] = useState(null); // Tracks if MetaMask is connected
  const [val, setVal] = useState(""); // Placeholder for value input
  const [account, setAccount] = useState(null); // Stores the user's Ethereum account
  const [contract, setContract] = useState(null); // Placeholder for smart contract instance
  const [name, setName] = useState(null); // Placeholder for contract name
  const [value, setValue] = useState(null); // Placeholder for contract value
  const [loading, setLoading] = useState(false); // Tracks loading state when connecting to contract
  const [loadingName, setLoadingName] = useState(false); // Track loading state for contract name
  const [loadingValue, setLoadingValue] = useState(false); // Track loading state for contract value

  useEffect(() => {
    const connectWallet = async () => {
      if (window.ethereum) {
        setConn(true); // MetaMask is available
        try {
          const addresses = await window.ethereum.request({ method: 'eth_requestAccounts' });
          setAccount(addresses[0]); // Save the first account
        } catch (error) {
          console.error("User denied wallet connection:", error);
          setConn(false); // Handle user rejection gracefully
        }
      } else {
        setConn(false); // MetaMask is not available
        alert("Please install MetaMask to use this app.");
      }
    };

    connectWallet();
  }, []);

  const connectToContract = async () => {
    setLoading(true); // Set loading to true when connecting to the contract
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum); // Use MetaMask's provider
      const signer = provider.getSigner(); // Get signer for transactions
      const contractAddress = "0xe69e4d80605f21e4ef2af284410d75efe2ddc004"; // Replace with your smart contract address

      const contracted = new ethers.Contract(contractAddress, abi, signer);
      setContract(contracted); // Set contract instance
      setLoading(false); // Set loading to false when connected
    } catch (error) {
      setLoading(false);
      setContract(null); // Reset contract state on failure
      alert("Failed to connect to the smart contract. Please try again.");
    }
  };

  const getName = async () => {
    setLoadingName(true); // Set loading for name retrieval
    try {
      const contractName = await contract.name();
      setName(contractName);
    } catch (err) {
      setName(null);
      alert("Failed to get Name");
    } finally {
      setLoadingName(false); // Stop loading once done
    }
  };

  const getValue = async () => {
    setLoadingValue(true); // Set loading for value retrieval
    try {
      const contractValue = await contract.getValue();
      setValue(contractValue.toString());
    } catch (err) {
      setValue(null);
      alert("Failed to get Value");
    } finally {
      setLoadingValue(false); // Stop loading once done
    }
  };

  const handleChange = (e) => {
    setVal(e.target.value); // Directly update the state with the new value
  };

  const handleSet = async () => {
    if (!val || isNaN(val)) {
      alert("Please enter a valid number");
      return; // Exit if the value is not a valid number
    }
    try {
      const intValue = parseInt(val, 10); // Convert value to an integer
      await contract.setValue(intValue); // Set value on the contract
      alert("Value added successfully");
    } catch (err) {
      alert("Failed to add value");
    }
  };

  return (
    <div>
      {conn === true && (
        <>
          <h6 style={{ textAlign: 'center', fontSize: '11px', margin: '0px' }}>
            Connected with the Account: {account}
          </h6>
          <button
            onClick={connectToContract}
            style={{
              margin: '10px',
              padding: '10px',
              backgroundColor: 'blue',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
            }}
            disabled={loading}
          >
            {loading ? "Connecting to Smart Contract..." : "Connect to the Smart Contract"}
          </button>
          {contract && <p style={{ textAlign: 'center' }}>Connected to the contract successfully!</p>}

          {/* Get name of the wallet */}
          <button onClick={getName} disabled={loadingName}>
            {loadingName ? "Fetching name..." : "Get Name of the wallet"}
          </button>
          {name && <p style={{ textAlign: 'center' }}>Wallet Name: {name}</p>}

          {/* Get value of the Smart contract */}
          <button onClick={getValue} disabled={loadingValue}>
            {loadingValue ? "Fetching value..." : "Get Value of the contract"}
          </button>
          {value && <p style={{ textAlign: 'center' }}>Contract Value: {value}</p>}

          {/* Set value */}
          <input type="text" value={val} onChange={handleChange} placeholder="Enter a value" />
          <button onClick={handleSet}>Set Value</button>
        </>
      )}
      {conn === false && (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <p>MetaMask is required to use this application.</p>
          <a
            href="https://metamask.io/download.html"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'blue', textDecoration: 'underline' }}
          >
            Download MetaMask
          </a>
        </div>
      )}
    </div>
  );
}

export default App;
