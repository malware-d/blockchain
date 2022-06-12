const hash = require('crypto-js/sha256');
class Block {
    constructor(prevHash, data) {
        this.prevHash = prevHash;
        this.data = data;
        this.timeStamp = new Date();
        this.hash = this.getHash();
    }

    getHash() {
        return hash(this.prevHash + JSON.stringify(this.data) + this.timeStamp).toString();
    }
}

class Blogtrain{
    constructor(){
        const genesisBlock = new Block('0000', {
            isGenesis : false
        })
        this.chain = [genesisBlock];
    }

    getLastBlog(){
        return this.chain[this.chain.length -1];
    }

    addBlog(data){
        const lastBlog = this.getLastBlog();
        const newBlog = new Block(lastBlog.hash, data);

        this.chain.push(newBlog);
    }
}

const duychain = new Blogtrain();

duychain.addBlog({
    from: "duy",
    to: "abc",
    money: "nhieu lam"
})
console.log(duychain.chain);