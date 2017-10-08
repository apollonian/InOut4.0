# Fake News Predictor based on Ethereum Blockchain

## The Idea
Our hack is a fake news predictor based on Ethereum Blockchain. The users can either mark a post (a news article) as fake or genuine. They'll pay a token (bought using Ether) to do so and will be rewarded if their prediction matches the final outcome/result which will be determined based on the ratio of number of genuine to fake votes.

As fake news is a challenging problem which developers still aim to solve, this product is an effort geared towards the same.

<img src='https://i.imgur.com/FYZcVbZ.png' />

## The Team
1. Abhishek Warokar
2. Ayush Shukla
3. Manoj

## The Product
*Truffle init webpack* gave us a headstart. It is a webpack project which includes contracts, migrations, tests, and user interface to create an application based on Ethereum Blockchain.

## Future Scope / ToDo
We did miss implementing some features beacuse of lack of available time, but we aim to get it completed as soon as possible. Improving the interface is certainly one of the priorities. The branch `ab-1` hosts the latest UI. A react native app was also under development. 

## Technologies Used
+ Truffle
+ TestRPC
+ Web3

## Development Environment
+ Ubuntu 16.10 LTS
+ node v8.6.0
+ npm v5.3.0
+ ethereumjs-testrpc v4.1.3
+ truffle v3.4.11

## How to run
1. Open a terminal window and run `testrpc`
2. From a different tab run `truffle migrate`
3. Then, `npm run build`
4. Finally, `npm run dev` to run the server
5. Open `http://localhost:8080` in your favorite browser 
