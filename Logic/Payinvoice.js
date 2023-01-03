// USER CONNECTS WALLET ----- DONE 
// THE INVOICE ID IS GOTTEN FROM THE URL ----- DONE 
// THE INVOICE DETAILS ARE GOTTEN FROM THE DATABASE ----- DONE
// THE DETAILS ARE USED TO PAY FOR THE INVOICE -------- DONE
// THE USER PAYS THE INVOICE ------- DONE

// importing the firebase 
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js'
import { getFirestore, collection, doc, setDoc, getDoc } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js'
import { tokencontractabi } from "./tokenContractABI.js";
import { firebaseConfig } from "./firebaseConfig.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

var signer; // ethers.js object for calling functions
var address; // the address of the user

var sendAmount; // the amount to be sent

var requesterAddress;
var amount;
var coinAddress;
var coinName;
var networkId;
var networkName;
var networkType;

// function to connect wallet using the Ethers.js library
async function connectWallet() {
    provider = new ethers.providers.Web3Provider(window.ethereum);

    await provider.send("eth_requestAccounts", []);

    signer = provider.getSigner();

    address = await signer.getAddress();

    await getDetails();
}

// create function to switch to correct network

// function to get invoice details
async function getDetails() {
    const parent = document.getElementById("details");
    // get id from url
    const params = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop),
      });
    
    let Id = params.Id;
    const _Id = Id.toString();
    console.log(_Id);

    // fetch payment details from firestore using the id
    const invoiceDetailsRef = doc(db, "invoiceDetails", _Id);
    const invoiceDetailsSnap = await getDoc(invoiceDetailsRef);
    console.log(invoiceDetailsSnap.data());
    requesterAddress = invoiceDetailsSnap.data().requesterAddress;
    amount = invoiceDetailsSnap.data().amount;
    coinAddress = invoiceDetailsSnap.data().coinAddress;
    coinName = invoiceDetailsSnap.data().coinName;
    networkId = invoiceDetailsSnap.data().networkId;
    networkName = invoiceDetailsSnap.data().networkName;
    networkType = invoiceDetailsSnap.data().networkType;


    // multiply amount by 10**6 || convert amount using ethers
    sendAmount = amount * (10 ** 6);

    // display Invoice details
    let htmlstring = `
    <div>
        <i>
        Pay Xan of ${amount} ${coinName} to ${requesterAddress} on ${networkName}
        </i>
    </div> 
    `;

    let col = document.createElement("div");
    col.innerHTML = htmlstring;
    parent.appendChild(col);
    
}

// function to pay invoice
async function payInvoice() {
    const parent = document.getElementById("confirmation");
    const Contract = new ethers.Contract(coinAddress, tokencontractabi, signer);

    await Contract.transfer(requesterAddress, sendAmount);

    // display confirmation
    let htmlstring = `
    <div>
        <i>
        your Xan is on its to ${requesterAddress}
    </div> 
`;


let col = document.createElement("div");
col.innerHTML = htmlstring;
parent.appendChild(col);
}

document.getElementById("connect").onclick = connectWallet;

document.getElementById("pay").onclick = payInvoice;


