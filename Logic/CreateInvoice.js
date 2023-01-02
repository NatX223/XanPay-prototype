// USER CONNECTS WALLET
// USER INPUTS THE AMOUNT HE WANTS AND COIN HE WANTS - stores the details in the database
// USER GENERATES LINK

// importing the firebase 
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js';
import { getFirestore, collection, doc, setDoc, getDoc } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js';
import { firebaseConfig } from "./firebaseConfig.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

var signer; // ethers.js object for calling functions
var address; // the address of the user

// function to connect wallet using the Ethers.js library
async function connectWallet() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    await provider.send("eth_requestAccounts", []);

    signer = provider.getSigner();

    address = await signer.getAddress();
}

// function to generate link
async function generateInvoice() {
    const parent = document.getElementById("confirmation");
    let coinAddress;

    // get the amount the user wants
    const amount = document.getElementById("amount").value;

    // get the coin the user wants(selects coin)
    var x = document.getElementById("coins").selectedIndex;
    var y = document.getElementById("coins").options;
    const coinIndex = y[x].index;
    console.log(coinIndex);
    const coinName = y[x].text;
    switch (coinIndex) {
        case 0:
            coinAddress = "USDT polygon address";
            break;
        case 1:
            coinAddress = "0xd5b31fb565d608692d6422beb31bf0875dad4fc3";
            break;
        case 2:
            coinAddress = "BUSD polygon address";
    }
    console.log(coinAddress);

    // getting the counter value from the database
    const counterRef = doc(db, "counter", "counter");
    const counterSnap = await getDoc(counterRef);

    const counter = counterSnap.data().counter;
    console.log(counterSnap.data(), counter);

    // counter value is increased by 1
    const _counter = counter + 1;
    //updating counter
    const counterDoc = {
        counter: _counter
    }
    await setDoc(doc(db, "counter", "counter"), counterDoc);

    // generating id
    const id = coinIndex + amount + _counter;
    console.log(id);
    const _id = id.toString();

    // stores the details in the database and updates the counter
    const invoiceDetails = {
        amount: amount,
        coinAddress: coinAddress,
        coinName: coinName,
        requesterAddress: address
    }
    console.log(invoiceDetails);
    await setDoc(doc(db, "invoiceDetails", _id), invoiceDetails);

    // prviding the payment link for the user
    let htmlstring = `
        <div>
            <i>
            your invoice is ready for ${amount} ${coinName} to ${address}
            </i>
            <i>
            share this link: 
            </i>
            <a href="Payment.html?Id=${_id}">payment link</a>
            <i>
                 to get your payment
            </i>
        </div> 
    `;
    
    let col = document.createElement("div");
    col.innerHTML = htmlstring;
    parent.appendChild(col);
}

// connect wallet button click event
document.getElementById("connect").onclick = connectWallet;

// generate link button click event
document.getElementById("generate").onclick = generateInvoice;