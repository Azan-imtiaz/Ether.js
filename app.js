
const {ethers}= require("ethers");

const provider=new ethers.providers.JsonRpcProvider("https://eth-mainnet.g.alchemy.com/v2/R8alUv5e5htjl7yKk8MbIVlJdNw9OY32");

provider.getBlockNumber().then((val)=>{
    console.log(val);
})
.catch((err)=>{
    console.log(err);
}
)

provider.getBalance("0x95222290DD7278Aa3Ddd389Cc1E1d165CC4BAfe5").then((val)=>{
//in wei
    console.log(val.toString())
//in ethers
    val=ethers.utils.formatEther(val);
    console.log(val);
//back to wei
val=ethers.utils.parseEther(val);
console.log(val.toString())

//formatUnits(val,unitName) to gwei or ether etc 
//parseEUnits(val,unitName)   to ge


}).catch((err)=>{
    console.log(err);
})