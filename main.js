// const SHA256 = require("crypto-js/sha256");
const containerApp = document.querySelector(".app");
const newData = document.querySelector(".newData");
const btnSubmit = document.querySelector(".btn-submit");
class Block {
  constructor(index, timestamp, data, previousHash = "") {
    this.index = index;
    this.timestamp = timestamp;
    this.data = data;
    this.previousHash = previousHash;
    this.nonce = 0;
    this.valid = true;
    this.hash = this.calculateHash();
  }

  calculateHash() {
    return CryptoJS.SHA256(
      // return SHA256(
      this.index +
        this.previousHash +
        this.timestamp +
        JSON.stringify(this.data) +
        this.nonce
    ).toString();
  }

  mineBlock(difficulty) {
    // this.nonce = 0;
    while (
      this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")
    ) {
      this.nonce++;
      this.hash = this.calculateHash();
    }
    return this.hash;
  }
}

class Blockchain {
  constructor() {
    this.difficulty = 2;
    this.chain = [this.createGenenisBlock()];
    this.displayBlocks(this.chain);
  }

  createGenenisBlock() {
    return new Block(0, "01/03/2022", "Genesis Block", "0");
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  generateNextBlock(timestamp, data) {
    const index = this.getLatestBlock().index + 1;
    const nextBlock = new Block(index, timestamp, data);
    this.addBlock(nextBlock);
  }

  addBlock(newBlock) {
    newBlock.previousHash = this.getLatestBlock().hash;
    newBlock.mineBlock(this.difficulty);
    this.chain.push(newBlock);
    this.isChainValid();
    this.displayBlocks(this.chain);
  }

  isChainValid() {
    let i;
    for (i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];
      if (
        currentBlock.hash !== currentBlock.calculateHash() ||
        currentBlock.previousHash !== previousBlock.hash ||
        previousBlock.valid === false
      ) {
        this.chain[i].valid = false;
        console.log(currentBlock.hash, currentBlock.calculateHash());
        break;
      } else {
        this.chain[i].valid = true;
      }
    }

    if (i !== this.chain.length) {
      while (i < this.chain.length) {
        this.chain[i].valid = false;
        i++;
      }
      this.displayBlocks();
      return false;
    } else {
      this.displayBlocks();
      return true;
    }
  }

  displayBlocks() {
    containerApp.innerHTML = "";
    const isChainValidWithThis = this.isChainValid.bind(this);
    const thisInst = this;
    this.chain.forEach(function (block, i) {
      const html = `
    <div class="eachBlock rounded-3xl p-4 m-8 grid grid-rows-4 gap-4 shadow-lg ${
      block.valid
        ? "border-2 border-green-400 bg-[#fcfffd] shadow-green-400"
        : "border-2 border-rose-500 bg-rose-100 shadow-rose-500"
    }">
        <div class="details-data border border-[#d9d9d9] rounded overflow-hidden">
          <p class="bg-[#fafafa] text-[#575757] font-medium p-2 border-r border-[#d9d9d9]">DATA</p>
          <input
            class="p-2 -ml-1 w-11/12 text-[#7d7d7d] font-semibold inline-block data-input bg-transparent ${
              i === 0 && "cursor-not-allowed"
            }"
            type="text"
            value="${block.data}"
            name=""
            size = "10
            id=""
            ${i === 0 && "disabled"}
          />
        </div>

        <div
          class="details-previousHash border border-[#d9d9d9] rounded overflow-hidden"
        >
          <p class="bg-[#fafafa] text-[#575757] font-medium p-2 border-r border-[#d9d9d9]">PREVIOUS HASH</p>
          <p class="p-2 text-[#5eb8ff] font-semibold previousHash -ml-1">${
            block.previousHash
          }</p>
        </div>

        <div class="details-hash border border-[#B7EB8F] rounded overflow-hidden bg-[#f6ffee]">
          <p class="text-[#575757] font-medium p-2 border-r border-[#d9d9d9">CURRENT HASH</p>
          <p class="p-2 hash ${
            block.hash == block.calculateHash()
              ? "text-[#44ab11]"
              : "text-[#f43f5e]"
          } font-semibold -ml-1" id="hash" data-value="${
        block.hash
      }">${block.calculateHash()}</p>
        </div>

        <div class="details-other flex justify-between">
          <div
            class="details-date border border-[#d9d9d9] rounded overflow-hidden"
          >
            <p class="bg-[#fafafa] text-[#575757] p-2 border-r border-[#d9d9d9]">DATE</p>
            <p class="p-2 date text-[#575757] font-normal">${
              block.timestamp
            }</p>
          </div>

          <div
            class="details-nonce border border-[#d9d9d9] rounded overflow-hidden text-right inline-block"
          >
            <p class="bg-[#fafafa] text-[#575757] font-medium p-2 border-r border-[#d9d9d9]">NONCE</p>
            <p class="p-2 nonce text-[#575757] font-normal">${block.nonce}</p>
          </div>
        </div>
      </div>
  `;
      containerApp.insertAdjacentHTML("beforeend", html);
    });

    const allBlocks = document.querySelectorAll(".eachBlock");
    allBlocks.forEach(function (htmlBlock) {
      htmlBlock.addEventListener("change", function (e) {
        const hash = this.querySelector("#hash").dataset.value;
        console.log(hash);
        const block = thisInst.chain.find((block) => block.hash === hash);
        block.data = e.target.value;
        isChainValidWithThis();
      });
    });
  }
}

let demoChain = new Blockchain();

btnSubmit.addEventListener("click", function (e) {
  e.preventDefault();
  // demoChain.generateNextBlock("22/02/2022", +newData.value);
  demoChain.generateNextBlock("22/02/2022", newData.value);
  newData.value = "";
});