// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

contract etherelect {
    // Create a template-structure for each candidate
    struct Candidate {
        uint256 candidateID;
        string candidateName;
        uint256 voteTally;
    }
    // This will list the candidates
    Candidate[] public allCandidates;

    // Store the owner's address
    address public owner;

    // All voters are to have their addresses mapped
    mapping(address => bool) public theVoters;

    //This is a voter list
    address[] public voterList;

    // Initialize a start session and end session for voting
    uint256 public startVote;
    uint256 public endVote;

    // Define the status of the election (e.g. ongoing or complete)
    bool public electionStatus;

    // Only the owner should be able to call an election
    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call an election");
        _;
    }

    // Verify if an election is currently ongoing
    modifier electionInProgress() {
        require(electionStatus, "There are no ongoing elections");
        _;
    }

    // create the constructor for the contract
    constructor() {
        owner = msg.sender;
    }

    // create a function for calling an election
    function callElection(string[] memory _allCandidates, uint256 _electionDuration) public onlyOwner {
        require(electionStatus == false, "There is an ongoing election");
        delete allCandidates;
        refreshVote();

        for(uint256 index = 0; index < _allCandidates.length; index++){
            allCandidates.push(
                Candidate({candidateID: index,candidateName:_allCandidates[index], voteTally:0})
            );
        }
        electionStatus = true;
        startVote = block.timestamp;
        endVote = block.timestamp+(_electionDuration * 1 minutes);
    }

    // enter a new candidate during an election
    function candidateNew(string memory _name) public onlyOwner electionInProgress() {
        require(verifyElectionTerm(), "The election term has ended");
        allCandidates.push(
            Candidate({candidateID: allCandidates.length, candidateName: _name, voteTally: 0})
        );
    }

    // Has the voter already voted?
    function hasVoted(address _balloter) public view electionInProgress returns (bool) {
        if(theVoters[_balloter] == true) {
            return true;
        }
        return false;
    }

    // function to cast a vote
    function castVote(uint256 _id) public electionInProgress {
        require(verifyElectionTerm(), "The current election term has ended");
        require(!hasVoted(msg.sender), "You cannot vote multiple times");
        allCandidates[_id].voteTally++;
        theVoters[msg.sender] == true;
        voterList.push(msg.sender);
    }

    // retrieve total vote count
    function collectBallots() public view returns (Candidate[] memory) {
        return allCandidates;
    }

    // oversee the election duration
    function electionDuration() public view electionInProgress returns (uint256) {
        if(block.timestamp >= endVote) {
            return 0;
        }
        return (endVote - block.timestamp);
    }

    // verify if the election term is still in progress
    function verifyElectionTerm() public returns (bool) {
        if(electionDuration() > 0) {
            return true;
        }
        electionStatus = false;
        return false;
    }

    // refresh voting ability for all eligible voters
    function refreshVote() public onlyOwner {
        for (uint256 index = 0; index < voterList.length; index++) {
            theVoters[voterList[index]] = false;
        }
        delete voterList;
    }
}