let rows = 100;
let col = 26;

let addressColContainer = document.querySelector(".address-col-container");
let addressRowContainer = document.querySelector(".address-row-container");
let cellsContainer = document.querySelector(".cells-container");
let addressBar = document.querySelector(".address-bar");

for (let i = 0; i < rows; i++) {
  let addressCol = document.createElement("div");
  addressCol.setAttribute("class", "address-col");
  addressCol.innerText = i + 1;
  addressColContainer.append(addressCol);
}

for (let i = 0; i < col; i++) {
  let addressRow = document.createElement("div");
  addressRow.setAttribute("class", "address-row");
  addressRow.innerText = String.fromCharCode(65 + i);
  addressRowContainer.append(addressRow);
}

for (let i = 0; i < rows; i++) {
  let rowContainer = document.createElement("div");
  rowContainer.setAttribute("class", "row-container");
  for (let j = 0; j < col; j++) {
    let cell = document.createElement("div");
    cell.setAttribute("class", "cell-container");
    cell.setAttribute("contenteditable", "true");
    cell.setAttribute("spellcheck", "false");

    // Attribute for cell and storage identification
    cell.setAttribute("rid", i);
    cell.setAttribute("cid", j);

    rowContainer.appendChild(cell);
    addListenerForAddressBarDisplay(cell, i, j);
  }
  cellsContainer.appendChild(rowContainer);
}

function addListenerForAddressBarDisplay(cell, i, j) {
  cell.addEventListener("click", (e) => {
    let rowID = i + 1;
    let colID = String.fromCharCode(65 + j);
    addressBar.value = `${colID}${rowID}`;
  });
}
