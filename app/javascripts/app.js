import "../stylesheets/app.css";

import {
	default as Web3
} from 'web3';
import {
	default as contract
} from 'truffle-contract'

import voting_artifacts from '../../build/contracts/Voting.json'

var Voting = contract(voting_artifacts);
let candidates = {}
let tokenPrice = null;

let totalVotes = 0;

window.voteForCandidate = function () {
	if (totalVotes > 20) {
		return;
	}
	totalVotes += 1;
	$('.total-casted-votes').html(totalVotes);
	performAction(1);
}

window.voteForNoneCandidate = function () {
	if (totalVotes > 20) {
		return;
	}
	totalVotes += 1;
	$('.total-casted-votes').html(totalVotes);
	performAction(0);
}

function performAction(isNotFake) {
	let candidateName = $("#candidate").val();
	$("#msg").html("Vote has been submitted. The vote count will increment as soon as the vote is recorded on the blockchain.")
	$("#candidate").val("");
	$("#vote-tokens").val("");

	Voting.deployed().then(function (contractInstance) {
		contractInstance.voteForCandidate(candidateName, 1, isNotFake, {
			gas: 1400000,
			from: web3.eth.accounts[0]
		}).then(function () {
			let div_id = candidates[candidateName];
			return contractInstance.totalVotesFor.call(candidateName).then(function (v) {
				$("#" + div_id).html(v.toString());
				$("#msg").html("");
			});
		});
	});
}

window.buyTokens = function () {
	let tokensToBuy = $("#buy").val();
	let price = tokensToBuy * tokenPrice;
	$("#buy-msg").html("Purchase order has been submitted. Please wait.");
	Voting.deployed().then(function (contractInstance) {
		contractInstance.buy({
			value: web3.toWei(price, 'ether'),
			from: web3.eth.accounts[0]
		}).then(function (v) {
			$("#buy-msg").html("");
			web3.eth.getBalance(contractInstance.address, function (error, result) {
				$("#contract-balance").html(web3.fromWei(result.toString()) + " Ether");
			});
		})
	});
	populateTokenData();
}

window.lookupVoterInfo = function () {
	let address = $("#voter-info").val();
	Voting.deployed().then(function (contractInstance) {
		contractInstance.voterDetails.call(address).then(function (v) {
			$("#tokens-bought").html("Total Tokens bought: " + v[0].toString());
			let votesPerCandidate = v[1];
			$("#votes-cast").empty();
			$("#votes-cast").append("Votes cast per candidate: <br>");
			let allCandidates = Object.keys(candidates);
			for (let i = 0; i < allCandidates.length; i++) {
				$("#votes-cast").append(allCandidates[i] + ": " + votesPerCandidate[i] + "<br>");
			}
		});
	});
}

function populateCandidates() {
	Voting.deployed().then(function (contractInstance) {
		contractInstance.allCandidates.call().then(function (candidateArray) {
			for (let i = 0; i < candidateArray.length; i++) {
				candidates[web3.toUtf8(candidateArray[i])] = "candidate-" + i;
			}
			setupCandidateRows();
			populateCandidateVotes();
			populateTokenData();
		});
	});
}

function populateCandidateVotes() {
	let candidateNames = Object.keys(candidates);
	for (var i = 0; i < candidateNames.length; i++) {
		let name = candidateNames[i];
		Voting.deployed().then(function (contractInstance) {
			contractInstance.totalVotesFor.call(name).then(function (v) {
				console.log(v.toString());
				totalVotes += parseInt(v.toString());
				$('.total-casted-votes').html(totalVotes);
				$("#" + candidates[name]).html(v.toString());
			});
		});
	}
}

// Dummy Article Data 
const articleTitle = [
	'We saved money on inauguration thanks to the dam\'s collapse: Nitish Kumar',
	'Mortified Tampax CEO Bursts Into Tears And Runs Out Of Boardroom After Tampon Falls Out Of Briefcase',
	'BJP asks next election be held on Twitter after Congress loses series of Twitter polls',
	'Anti-Nuclear Weapons Organization Awarded Nobel Peace Prize',
	'Why is Google News still running fake news sources like CNN and WaPo while banning REAL news from the new media?'
];

var i = 0;

function setupCandidateRows() {
	Object.keys(candidates).forEach(function (candidate) {
		$("#candidate-rows").append(
			"<tr><td>" + (i + 1) + "</td><td>" + articleTitle[i++] + "</td><td id='" + candidates[candidate] + "'></td><td><a href='#' onclick='voteForCandidate(0)' class='btn btn-warning'>FAKE</a><a href='#' onclick='voteForCandidate(1)' class='btn btn-success' style='margin-left: 12px'>GENUINE</a></td></tr>");
	});
}

function populateTokenData() {
	Voting.deployed().then(function (contractInstance) {
		contractInstance.totalTokens().then(function (v) {
			$("#tokens-total").html(v.toString());
		});
		contractInstance.tokensSold.call().then(function (v) {
			$("#tokens-sold").html(v.toString());
		});
		contractInstance.tokenPrice().then(function (v) {
			tokenPrice = parseFloat(web3.fromWei(v.toString()));
			$("#token-cost").html(tokenPrice + " Ether");
		});
		web3.eth.getBalance(contractInstance.address, function (error, result) {
			$("#contract-balance").html(web3.fromWei(result.toString()) + " Ether");
		});
	});
}

$(document).ready(function () {
	if (typeof web3 !== 'undefined') {
		console.warn("Using web3 detected from external source like Metamask")
		window.web3 = new Web3(web3.currentProvider);
	} else {
		console.warn("No web3 detected. Falling back to http://localhost:8545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
		window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
	}

	Voting.setProvider(web3.currentProvider);
	populateCandidates();

});