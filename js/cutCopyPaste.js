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
let cutBtn = document.querySelector(".cut");
let pasteBtn = document.querySelector(".paste");

let rangeStorage = [];
function handleSelectedCells(cell) {
  cell.addEventListener("click", (e) => {
    if (!ctrlKey) return;
    if (rangeStorage.length >= 2) {
      defaultSelectedCellsUI();
      rangeStorage = [];
    }

    cell.style.border = "3px solid #218c74";

    let rid = Number(cell.getAttribute("rid"));
    let cid = Number(cell.getAttribute("cid"));
    rangeStorage.push([rid, cid]);
  });
}

function defaultSelectedCellsUI() {
  for (let i = 0; i < rangeStorage.length; i++) {
    let cell = document.querySelector(
      `.cell-container[rid="${rangeStorage[i][0]}"][cid="${rangeStorage[i][1]}"]`
    );
    cell.style.border = "1px solid lightgrey";
  }
}

// Copy
let copyData = [];
copyBtn.addEventListener("click", (e) => {
  if (rangeStorage.length < 2) return;
  copyData = [];

  let [strow, stcol, endrow, endcol] = [
    rangeStorage[0][0],
    rangeStorage[0][1],
    rangeStorage[1][0],
    rangeStorage[1][1],
  ];

  for (let i = strow; i <= endrow; i++) {
    let copyRow = [];
    for (let j = stcol; j <= endcol; j++) {
      let cellProp = sheetDB[i][j];
      copyRow.push(cellProp);
    }
    copyData.push(copyRow);
  }

  defaultSelectedCellsUI();
});

// Cut
cutBtn.addEventListener("click", (e) => {
  if (rangeStorage.length < 2) return;

  let [strow, stcol, endrow, endcol] = [
    rangeStorage[0][0],
    rangeStorage[0][1],
    rangeStorage[1][0],
    rangeStorage[1][1],
  ];

  for (let i = strow; i <= endrow; i++) {
    for (let j = stcol; j <= endcol; j++) {
      let cell = document.querySelector(
        `.cell-container[rid="${i}"][cid="${j}"]`
      );

      let cellProp = sheetDB[i][j];
      cellProp.value = "";
      cellProp.bold = false;
      cellProp.italic = false;
      cellProp.underline = false;
      cellProp.fontSize = 14;
      cellProp.fontFamily = "monospace";
      cellProp.fontColor = "#000000";
      cellProp.BGcolor = "#000000";
      cellProp.alignment = "left";

      cell.click();
    }
  }

  defaultSelectedCellsUI();
});

// Paste
pasteBtn.addEventListener("click", (e) => {
  if (rangeStorage.length < 2) return;

  let rowDiff = Math.abs(rangeStorage[0][0] - rangeStorage[1][0]);
  let colDiff = Math.abs(rangeStorage[0][1] - rangeStorage[1][1]);

  let address = addressBar.value;
  let [stRow, stCol] = decodeRICIDFromAddress(address);

  for (let i = stRow, r = 0; i <= stRow + rowDiff; i++, r++) {
    for (let j = stCol, c = 0; j <= stCol + colDiff; j++, c++) {
      let cell = document.querySelector(
        `.cell-container[rid="${i}"][cid="${j}"]`
      );
      if (!cell) continue;

      let data = copyData[r][c];
      let cellProp = sheetDB[i][j];

      cellProp.value = data.value;
      cellProp.bold = data.bold;
      cellProp.italic = data.italic;
      cellProp.underline = data.underline;
      cellProp.fontSize = data.fontSize;
      cellProp.fontFamily = data.fontFamily;
      cellProp.fontColor = data.fontColor;
      cellProp.BGcolor = data.BGcolor;
      cellProp.alignment = data.alignment;

      cell.click();
    }
  }
});
