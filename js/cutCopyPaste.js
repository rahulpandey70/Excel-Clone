let ctrlKey;
document.addEventListener("keydown", (e) => {
  ctrlKey = e.ctrlKey;
});

document.addEventListener("keyup", (e) => {
  ctrlKey = e.ctrlKey;
});

for (let i = 0; i < rows; i++) {
  for (let j = 0; j < col; j++) {
    let cell = document.querySelector(
      `.cell-container[rid="${i}"][cid="${j}"]`
    );
    handleSelectedCells(cell);
  }
}

let copyBtn = document.querySelector(".copy");
let pasteBtn = document.querySelector(".paste");
let cutBtn = document.querySelector(".cut");

let rangeStorage = [];
function handleSelectedCells(cell) {
  cell.addEventListener("click", (e) => {
    // Select cells range
    if (!ctrlKey) return;
    if (rangeStorage.length >= 2) {
      handleSelectedCellsUI();
      rangeStorage = [];
    }

    cell.style.border = "3px solid #218c74";

    let rid = Number(cell.getAttribute("rid"));
    let cid = Number(cell.getAttribute("cid"));
    rangeStorage.push([rid, cid]);
  });
}

function handleSelectedCellsUI() {
  for (let i = 0; i < rangeStorage.length; i++) {
    let cell = document.querySelector(
      `.cell-container[rid="${rangeStorage[i][0]}"][cid="${rangeStorage[i][1]}"]`
    );
    cell.style.border = "1px solid lightgrey";
  }
}
