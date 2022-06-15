//create new object CryptoJS
const SHA256 = require('crypto-js/sha256');
const hash = require('crypto-js/sha256');
//import elliptic lib
const ELLIPTIC = require('elliptic').ec, ec = new ELLIPTIC('secp256k1');
//create pairkey
const keyPair = ec.genKeyPair();
// public key: keyPair.getPublic("hex")
// private key: keyPair.getPrivate("hex")

//create block
class Block {
    constructor(prevHash, data = []) {
        this.prevHash = prevHash;
        this.data = data;
        this.timeStamp = new Date();
        this.hash = this.getHash();
        this.nonce = 0;
    }
    //cal hash value
    getHash() {
        return hash(this.prevHash + JSON.stringify(this.data) + this.timeStamp + this.nonce).toString();
    }
    //PoW
    mine(difficulty){
        while(!this.hash.startsWith('0'.repeat(difficulty))){
            this.nonce++;
            this.hash = this.getHash();
        }
    }
}
//create chain
class Blockchain{
    constructor(difficulty){
        //create genesisblock
        const genesisBlock = new Block('0000', {
            isGenesis : false
        })
        //average time to generate block
        this.blocktime = 3000;
        this.difficulty = difficulty;
        //pool of waiting transaction
        this.transaction = [];
        //reward for mining
        this.reward = 1997;
        //array chain
        this.chain = [genesisBlock];
        
    }
    //get the last block
    get_lastBlok(){
        return this.chain[this.chain.length -1];
    }
    //add new block to the chain
    add_newBlok(newdata){
        const lastBlok = this.get_lastBlok();
        //new block contain: pre hash + new data
        const newBlok = new Block(lastBlok.hash, newdata);
        //measure mining time 
        console.log('==================================================================\nStart mining...');
        console.time('Time to mine');
        //mining
        newBlok.mine(this.difficulty);
        console.timeEnd('Time to mine');
        console.log('End mining\n', newBlok);
        //push new block to chain
        this.chain.push(newBlok);
        //change the difficult
        console.log('olddif: ', this.difficulty);
        this.difficulty += Date.now() - this.get_lastBlok().timeStamp.getTime() < this.blocktime ? 1 : -1;
        console.log('time: ', Date.now() - this.get_lastBlok().timeStamp.getTime());
        console.log('newdif: ', this.difficulty);
    }
    //check the modification of data
    isValid(){
        //block genesis blank -> count from block 1
        for(let i = 1; i < this.chain.length; i++){
            const curBlock = this.chain[i];
            const preBlock = this.chain[i-1];
    
            if(curBlock.hash !== curBlock.getHash() || curBlock.prevHash !== preBlock.hash){
                return false;
            }
        }
        return true;
    }
    //push transaction to pool
    add_newTransaction(transaction){
        this.transaction.push(transaction);
    }
    //transfer transactions from pool to chain and delete pool
    mineTransaction(rewardAddress){
        //transaction reward to miner
        const newRewardtoMiner = new Transaction(CREATE_REWARD_ADDRESS, rewardAddress, this.reward);
        //pack the transaction rewward and all the transaction in pool
        this.add_newBlok([newRewardtoMiner, ...this.transaction]);
        this.transaction = [];
    }
    //cal account balance base on your history of transaction
    get_AccountBalance(address){
        let balance = 0;
        this.chain.forEach(block => {
            block.data.forEach(transaction => {
                //if you - sender
                if(transaction.from === address){
                    balance -= transaction.amount;
                }
                //receiver
                if(transaction.to === address){
                    balance += transaction.amount;
                }
            })
        });

        return balance;
    }
}
//create transaction
class Transaction{
    constructor(from, to, amount){
        this.from = from;
        this.to = to;
        this.amount = amount;
    }
    //sign transaction 
    signTransaction(keyPair){
        if(keyPair.getPublic("hex") === this.from){
            this.signature = keyPair.sign(SHA256(this.from + this.to + this.amount), "base64").toDER("hex");
        }
    }
    //check valid transaction
    isValid(transaction, chain){
        return(
            transaction.from &&
            transaction.to &&
            transaction.amount &&
            chain.get_AccountBalance(transaction.from) >= transaction.amount && 
            ec.keyFromPublic(transaction.from, 'hex').verify(SHA256(transaction.from + transaction.to + transaction.amount + transaction.gas), transaction.signature)
        );
    }
}
//export module
module.exports = {Block, Blockchain};