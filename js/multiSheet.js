let sheetFolderContainer = document.querySelector(".sheet-folder-container");
let addSheet = document.querySelector(".sheet-add-icon");
addSheet.addEventListener("click", (e) => {
  let sheet = document.createElement("div");
  sheet.setAttribute("class", "sheet-folder");

  let allSheetFolders = document.querySelectorAll(".sheet-folder");
  sheet.setAttribute("id", allSheetFolders.length);

  sheet.innerHTML = `
        <div class="sheet-content">Sheet ${allSheetFolders.length + 1}</div>
    `;

  sheetFolderContainer.appendChild(sheet);
  sheet.scrollIntoView();
  createSheetDB();
  createGraphComponentMatrix();
  handleSheetActiveness(sheet);
  handleSheetRemoval(sheet);
  sheet.click();
});

function handleSheetRemoval(sheet) {
  sheet.addEventListener("mousedown", (e) => {
    // for right mouse click
    if (e.button !== 2) return;
    let allSheetFolders = document.querySelectorAll(".sheet-folder");
    if (allSheetFolders.length === 1) {
      alert("You have atleast one sheet!!");
      return;
    }
    let response = confirm(
      "Your sheet will be removed permanently, Are you sure?"
    );
    if (response === false) return;

    let sheetIdx = Number(sheet.getAttribute("id"));

    // For DB removal
    collectedSheetDB.splice(sheetIdx, 1);
    collectedGraphComponent.splice(sheetIdx, 1);

    // For UI removal
    handleSheetIndexingRemoval(sheet);

    // After removal sheet directly back to sheet 1
    sheetDB = collectedSheetDB[0];
    graphComponentMatrix = collectedGraphComponent[0];
    handleSheetProperties();
  });
}

function handleSheetIndexingRemoval(sheet) {
  sheet.remove();
  let allSheetFolders = document.querySelectorAll(".sheet-folder");

  for (let i = 0; i < allSheetFolders.length; i++) {
    allSheetFolders[i].setAttribute("id", i);
    let sheetContent = allSheetFolders[i].querySelector(".sheet-content");
    sheetContent.innerText = `sheet ${i + 1}`;
    allSheetFolders[i].style.backgroundColor = "transparent";
  }
  allSheetFolders[0].style.backgroundColor = "#ced6e0";
}

function handleSheetDB(sheetIdx) {
  sheetDB = collectedSheetDB[sheetIdx];
  graphComponentMatrix = collectedGraphComponent[sheetIdx];
}

function handleSheetProperties() {
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < col; j++) {
      let cell = document.querySelector(
        `.cell-container[rid="${i}"][cid="${j}"]`
      );
      cell.click();
    }
  }
  // Default click on first cell
  let firstCell = document.querySelector(".cell-container");
  firstCell.click();
}

function handleSheetUI(sheet) {
  let allSheetFolders = document.querySelectorAll(".sheet-folder");
  for (let i = 0; i < allSheetFolders.length; i++) {
    allSheetFolders[i].style.backgroundColor = "transparent";
  }
  sheet.style.backgroundColor = "#ced6e0";
}

function handleSheetActiveness(sheet) {
  sheet.addEventListener("click", (e) => {
    let sheetIdx = Number(sheet.getAttribute("id"));
    handleSheetDB(sheetIdx);
    handleSheetProperties();
    handleSheetUI(sheet);
  });
}

function createSheetDB() {
  let sheetDB = [];
  for (let i = 0; i < rows; i++) {
    let sheetRow = [];
    for (let j = 0; j < col; j++) {
      let cellProp = {
        bold: false,
        italic: false,
        underline: false,
        alignment: "left",
        fontFamily: "monospace",
        fontSize: "14",
        fontColor: "#000000",
        BGColor: "#000000",
        value: "",
        formula: "",
        children: [],
      };
      sheetRow.push(cellProp);
    }
    sheetDB.push(sheetRow);
  }
  collectedSheetDB.push(sheetDB);
}

function createGraphComponentMatrix() {
  let graphComponentMatrix = [];
  for (let i = 0; i < rows; i++) {
    let row = [];
    for (let j = 0; j < col; j++) {
      row.push([]);
    }
    graphComponentMatrix.push(row);
  }
  collectedGraphComponent.push(graphComponentMatrix);
}
