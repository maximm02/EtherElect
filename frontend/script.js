const linkWalletNotification = document.querySelector('#walletlinknotification');
const linkWalletButton = document.querySelector('#linkwallet');
const pollingBooth = document.querySelector('#pollingbooth');
const countdownTime = document.querySelector('#count');
const countdownAlert = document.querySelector('#countdownalert');
const primaryContainer = document.querySelector('#primarycontainer');
const ballotForm = document.querySelector('#ballotform');
const vote = document.querySelector('#vote');
const voteButton = document.querySelector('#castvote');
const displayResultDiv = document.querySelector('#displayresultdiv');
const displayResult = document.querySelector('#displayresult');
const electionResult = document.querySelector('#electionresult');
const administrator = document.querySelector('#administrator');
const candidates = document.querySelector('#candidates');
const electionDuration = document.querySelector('#electionduration');
const callTheElection = document.querySelector('#calltheelection');
const candidate = document.querySelector('#candidate');
const enterTheCandidate = document.querySelector('#enterthecandidate');

// Setting up Ethers
const smartContractAddress = "0x64288c4483F9056107aa94964977F84e49Bdf218";
const smartContractABI = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "allCandidates",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "candidateID",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "candidateName",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "voteTally",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string[]",
        "name": "_allCandidates",
        "type": "string[]"
      },
      {
        "internalType": "uint256",
        "name": "_electionDuration",
        "type": "uint256"
      }
    ],
    "name": "callElection",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_name",
        "type": "string"
      }
    ],
    "name": "candidateNew",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_id",
        "type": "uint256"
      }
    ],
    "name": "castVote",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "collectBallots",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "candidateID",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "candidateName",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "voteTally",
            "type": "uint256"
          }
        ],
        "internalType": "struct etherelect.Candidate[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "electionDuration",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "electionStatus",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "endVote",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_balloter",
        "type": "address"
      }
    ],
    "name": "hasVoted",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "refreshVote",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "startVote",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "theVoters",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "verifyElectionTerm",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "voterList",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
]

let signer;
let contract;

const provider = new ethers.providers.Web3Provider(window.ethereum, 80002);
provider.send("eth_requestAccounts", []).then(() => {
    provider.listAccounts().then((accounts) => {
        signer = provider.getSigner(accounts[0])
        contract = new ethers.Contract(smartContractAddress, smartContractABI, signer)
    });
});

// Necessary functions
const retrieveAllCandidates = async function() {
    if(document.getElementById("candidatecontainer")) {
        document.getElementById("candidatecontainer").remove();
    }

    let container = document.createElement("table");
    container.id = "candidateboard";
    primaryContainer.appendChild(container);

    let tableHeader = document.createElement("tr");
    tableHeader.innerHTML = `<th>Candidate ID</th>
                              <th>Candidate Name</th>`;
    container.appendChild(tableHeader);

    let candidates = await contract.collectBallots();
    for(let index = 0; index < candidate.length; index++) {
        let candidate = document.createElement("tr");
        candidate.innerHTML = `<td>${parseInt(candidates[index][0])}</td>
                                <td>${candidates[index][1]}</td>`;
        container.appendChild(candidate);
    }
}

const fetchResult = async function() {
    electionResult.style.dsplay = "flex";

    if(document.getElementById('displayresultdiv')) {
        document.getElementById('displayresultdiv').remove();
    }

    let displayresultdiv = document.createElement("table");
    displayresultdiv.id = "displayresultdiv";
    electionResult.appendChild(displayresultdiv);

    let tableHeader = document.createElement("tr");
    tableHeader.innerHTML = `<th>Candidate ID</th>
                            <th>Candidate Name</th>
                            <th>Vote Tally</th>`;
    displayresultdiv.appendChild(tableHeader);
    
    let candidates = await contract.collectBallots();
    for(let index = 0; index < candidate.length; index++) {
        let candidate = document.createElement("tr");
        candidate.innerHTML = `<td>${parseInt(candidates[index][0])}</td>
                                <td>${candidates[index][1]}</td>
                                <td>${parseInt(candidates[index][2])}</td>`;
        displayresultdiv.appendChild(candidate);
    }
}

const refreshPage = function() {
    setInterval(async() => {
        let time = await contract.electionDuration();

        if (time > 0){
            countdownAlert.innerHTML = `<span id="count">${time}</span> seconds remaining`;
            ballotForm.style.display = "flex";
            displayResultDiv.style.display = "none";
        } else {
            countdownAlert.textContent = "There is no ongoing election";
            ballotForm.style.display = "none";
            displayResultDiv.style.display = "block";
        }
    }, 1000);

    setInterval(async() => {
        retrieveAllCandidates();
    }, 10000);
}

const sendVote = async function () {
    await contract.castVote(vote.value);
    vote.value = "";
}

const startElection = async function() {
    if (!candidates.value) {
        alert('The candidate list is empty');
    }
    if (!electionDuration.value) {
        alert('The election duration cannot be empty');
    }

    const _candidates = candidates.values.split(" ,");
    const _votingDuration = electionDuration.value;

    await contract.callElection(_candidates, _votingDuration);
    refreshPage();

    candidates.value = "";
    electionDuration.value = "";

    ballotForm.style.display = "flex";
    displayResultDiv.style.display = "none";
}

const addCandidate = async function () {
    if(!candidate.value) {
        alert("You must enter a candidate name");
    }

    await contract.candidateNew(candidate.value);
    refreshPage();
    candidate.value = "";
}

const getAccount = async function () {
    const ethAccounts = await provider.send("eth_requestAccounts", []).then(() => {
        provider.listAccounts().then((accounts => {
            signer = provider.getSigner(accounts[0]);
            contract = new ethers.Contract(smartContractAddress, smartContractABI, signer);
        }))
    });

    linkWalletButton.textContent = signer._address.slice(0,10) + "...";
    linkWalletNotification.textContent = "You are connected";
    linkWalletButton.disabled = true;

    let owner = await contract.owner();
    if(owner == signer._address){
        administrator.style.display = "flex";

        let time = await contract.electionDuration();
        if(time == 0){
            contract.verifyElectionTerm();
        }
    }
    pollingBooth.style.disabled = "block";

    refreshPage();
    retrieveAllCandidates();
};

// Event listeners
linkWalletButton.addEventListener('click', getAccount);
displayResult.addEventListener('click', fetchResult);
voteButton.addEventListener('click', sendVote);
enterTheCandidate.addEventListener('click', addCandidate);
callTheElection.addEventListener('click', startElection);