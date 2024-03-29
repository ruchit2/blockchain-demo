// const SHA256 = require('crypto-js/sha256');
const containerApp = document.querySelector(".app");
const inputData = document.querySelector(".newData");
const btnSubmit = document.querySelector(".btn-submit");

class Block {
  constructor(index, timestamp, data, previousHash = "") {
    this.index = index;
    this.timestamp = timestamp;
    this.data = data;
    this.previousHash = previousHash;
    this.nonce = 0;
    this.originalHash = this.calculateHash();
    this.hash = this.originalHash;
  }

  // returns the hash of the block based on current data
  calculateHash() {
    return CryptoJS.SHA256(
      this.index +
        this.timestamp +
        this.previousHash +
        JSON.stringify(this.data) +
        this.nonce
    ).toString();
  }

  // finds the hash of the block that meets the difficulty requirement, and makes this hash the block's hash
  mineBlock(difficulty) {
    while (
      this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")
    ) {
      this.nonce++;
      this.hash = this.calculateHash();
    }
    this.originalHash = this.hash;
  }
}

class Blockchain {
  // creates the chain, adds the genesis block, and calls displayBlocks
  constructor() {
    this.difficulty = 3;
    this.chain = [this.createGenesisBlock()];
    this.displayBlocks();
  }

  // creates the first block in the chain
  createGenesisBlock() {
    const newBlock = new Block(
      0,
      new Date().toLocaleString(),
      "Genesis Block",
      "0"
    );
    newBlock.mineBlock(this.difficulty);
    return newBlock;
  }

  // returns the latest block in the chain
  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  // generates new block, adds it to the chain, and calls displayBlocks
  generateNextBlock(timestamp, data) {
    const index = this.getLatestBlock().index + 1;
    const newBlock = new Block(
      index,
      timestamp,
      data,
      this.getLatestBlock().hash
    );
    newBlock.mineBlock(this.difficulty);
    this.chain.push(newBlock);
    this.displayBlocks();
  }

  displayBlocks() {
    containerApp.innerHTML = "";
    // thisInst is the instance of the class Blockchain
    const thisInst = this;

    // Traverse the chain and create html elements for each block and display them
    this.chain.forEach(function (block, i) {
      const html = `
    <div data-index=${
      block.index
    } class="eachBlock rounded-3xl p-4 m-8 grid grid-rows-4 gap-4 shadow-lg ${
        block.hash === block.originalHash
          ? "border-2 border-green-400 bg-[#f6ffee] shadow-green-400"
          : "border-2 border-rose-500 bg-rose-100 shadow-rose-500"
      }">
        <div class="details-data border border-[#d9d9d9] rounded overflow-hidden">
          <p class="${
            block.hash === block.originalHash ? "bg-[#e7f9d7]" : "bg-[#fed4dc]"
          } text-[#575757] font-medium p-2 border-r border-[#d9d9d9]">DATA</p>
          <input
            class="p-2 -ml-1 w-11/12 text-[#7d7d7d] font-semibold inline-block data-input bg-transparent "
            type="text"
            value="${block.data}"
            name=""
            size = "10
            id=""
            
          />
        </div>

        <div
          class="details-previousHash border border-[#d9d9d9] rounded overflow-hidden"
        >
          <p class=" ${
            block.hash === block.originalHash ? "bg-[#e7f9d7]" : "bg-[#fed4dc]"
          } text-[#575757] font-medium p-2 border-r border-[#d9d9d9]">PREVIOUS HASH</p>
          <p class="p-2 text-[#5eb8ff] font-semibold previousHash -ml-1">${
            block.previousHash
          }</p>
        </div>

        <div class="details-hash border ${
          block.hash === block.originalHash
            ? "border-[#B7EB8F]"
            : "border-[#ffdce2]"
        } rounded overflow-hidden ${
        block.hash === block.originalHash ? "bg-[#f6ffee]" : "bg-[#ffe2e7]"
      }">
          <p class="text-[#575757] ${
            block.hash === block.originalHash ? "bg-[#e7f9d7]" : "bg-[#fed4dc]"
          } font-medium p-2 border-r border-[#d9d9d9">CURRENT HASH</p>
          <p class="p-2 hash ${
            block.hash == block.originalHash
              ? "text-[#44ab11]"
              : "text-[#f43f5e]"
          } font-semibold -ml-1" id="hash" data-value="${block.originalHash}">${
        block.hash
      }</p>
        </div>

        <div class="details-other flex justify-between">
          <div
            class="details-date border border-[#d9d9d9] rounded overflow-hidden"
          >
            <p class=" ${
              block.hash === block.originalHash
                ? "bg-[#e7f9d7]"
                : "bg-[#fed4dc]"
            } text-[#575757] p-2 border-r border-[#d9d9d9]">DATE</p>
            <p class="p-2 date text-[#575757] font-normal">${
              block.timestamp
            }</p>
          </div>

          <div
            class="details-nonce border border-[#d9d9d9] rounded overflow-hidden text-right inline-block ${
              block.hash === block.originalHash ? "inherit" : "hidden"
            }"
          >
            <p class=" ${
              block.hash === block.originalHash
                ? "bg-[#e7f9d7]"
                : "bg-[#fed4dc]"
            } text-[#575757] font-medium p-2 border-r border-[#d9d9d9]">NONCE</p>
            <p class="p-2 nonce text-[#575757] font-normal">${block.nonce}</p>
          </div>

          <div
            class="rounded text-right inline-block ${
              block.hash === block.originalHash ? "hidden" : "inherit"
            }""
          >
            <button
              class="py-2 px-4 ease-in-out duration-200 drop-shadow-lg active:translate-y-0.5 rounded-3xl btn-mine text-[#f8f8f8] font-semibold mine" 
              type="submit"
              data-index=${block.index}
              data-valid=${block.valid}>
                Mine
            </button>
          </div>
        </div>
      </div>
  `;
      containerApp.insertAdjacentHTML("beforeend", html);
    });

    // Select all the html blocks
    const allBlocks = document.querySelectorAll(".eachBlock");

    // Select all the mine buttons
    const btnMine = document.querySelectorAll(".btn-mine");

    // On every mine button click, find the block and its previous block and its corresponding html block, take value from html input and save it in the block, reassign previous hash and mine the block, recalculate the hash of all the blocks after the mined block, call displayBlocks() to display the new blocks
    btnMine.forEach(function (btn) {
      btn.addEventListener("click", function (e) {
        const block = thisInst.chain.find(
          (block) => block.index === +e.target.dataset.index
        );
        const prevBlock = thisInst.chain.find(
          (curr) => curr.index === block.index - 1
        );
        let htmlBlock;
        for (let j = 0; j < allBlocks.length; j++) {
          if (allBlocks[j].dataset.index === e.target.dataset.index) {
            htmlBlock = allBlocks[j];
            break;
          }
        }

        block.data = htmlBlock.querySelector(".data-input").value;
        block.previousHash = prevBlock?.hash ?? 0;
        // block.hash = block.calculateHash();
        block.mineBlock(thisInst.difficulty);
        const index = block.index;
        for (let i = index + 1; i < thisInst.chain.length; i++) {
          thisInst.chain[i].previousHash = thisInst.chain[i - 1].hash;
          thisInst.chain[i].hash = thisInst.chain[i].calculateHash();
        }
        thisInst.displayBlocks();
      });
    });

    // On all the data inputs, if the value changes, change the data of the corresponding block and recalculate the hash of all the blocks after the changed block, call displayBlocks() to display the new blocks
    allBlocks.forEach(function (htmlBlock) {
      htmlBlock.addEventListener("change", function (e) {
        const hash = this.querySelector("#hash").dataset.value;
        const block = thisInst.chain.find(
          (block) => block.originalHash === hash
        );
        block.data = e.target.value;
        block.hash = block.calculateHash();
        const index = block.index;
        for (let i = index + 1; i < thisInst.chain.length; i++) {
          console.log();
          thisInst.chain[i].previousHash = thisInst.chain[i - 1].hash;
          thisInst.chain[i].hash = thisInst.chain[i].calculateHash();
        }
        thisInst.displayBlocks();
      });
    });
  }
}

let demoChain = new Blockchain();

btnSubmit.addEventListener("click", function (e) {
  e.preventDefault();
  // demoChain.generateNextBlock("22/02/2022", +newData.value);
  demoChain.generateNextBlock(new Date().toLocaleString(), inputData.value);
  inputData.value = "";
});
