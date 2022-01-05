// Store Cell Value
for (let i = 0; i < rows; i++) {
  for (let j = 0; j < col; j++) {
    let cell = document.querySelector(
      `.cell-container[rid="${i}"][cid="${j}"]`
    );
    cell.addEventListener("blur", (e) => {
      let address = addressBar.value;
      let [cell, cellProp] = activeCell(address);
      let enteredData = cell.innerText;

      if (enteredData === cellProp.value) return;

      cellProp.value = enteredData;

      // if data modifies remove parent child relation, formula empty, update children with new value
      removeChildFromParent(cellProp.formula);
      cellProp.formula = "";
      updateChildrenCells(address);
    });
  }
}

// Formula Evalution
let formulaBar = document.querySelector(".formula-bar");
formulaBar.addEventListener("keydown", async(e) => {
  let inputFormula = formulaBar.value;
  if (e.key === "Enter" && inputFormula) {
    // if formula change, break parent child relation and evalute new parent child realtion
    let address = addressBar.value;
    let [cell, cellProp] = activeCell(address);
    if (inputFormula !== cellProp.formula)
      removeChildFromParent(cellProp.formula);

      addChildToGraphComponent(inputFormula, address);
    // check formula is cyclic or not
    let cycleResponse = cyclicValidation(graphComponentMatrix);
    if (cycleResponse){
      // alert("Your formula is cyclic");
      let response = confirm("Your formula is cyclic, Do you want to trace your path?");
      while(response === true){
        await cyclicValidationTracePath(graphComponentMatrix, cycleResponse);
        response = confirm("Your formula is cyclic, Do you want to trace your path?")
      }

      removeChildFromGraphComponent(inputFormula, address);
      return;
    }

    let evaluatedValue = evaluateFormula(inputFormula);

    // To Update Ui and DB
    setFormula(evaluatedValue, inputFormula, address);
    addChildToParent(inputFormula);

    updateChildrenCells(address);
  }
});

function addChildToGraphComponent(formula, childAddress) {
  let [crid, ccid] = decodeRICIDFromAddress(childAddress);
  let encodedFormula = formula.split(" ");
  for (let i = 0; i < encodedFormula.length; i++) {
      let asciiValue = encodedFormula[i].charCodeAt(0);
      if (asciiValue >= 65 && asciiValue <= 90) {
          let [prid, pcid] = decodeRICIDFromAddress(encodedFormula[i]);

          graphComponentMatrix[prid][pcid].push([crid, ccid]);
      }
  }
}

function removeChildFromGraphComponent(formula, childAddress) {
  // let [crid, ccid] = decodeRICIDFromAddress(childAddress);
  let encodedFormula = formula.split(" ");

  for (let i = 0; i < encodedFormula.length; i++) {
      let asciiValue = encodedFormula[i].charCodeAt(0);
      if (asciiValue >= 65 && asciiValue <= 90) {
          let [prid, pcid] = decodeRICIDFromAddress(encodedFormula[i]);
          graphComponentMatrix[prid][pcid].pop();
      }
  }
}

function updateChildrenCells(parentAddress) {
  let [parentCell, parentCellProp] = activeCell(parentAddress);
  let children = parentCellProp.children;

  for (let i = 0; i < children.length; i++) {
    let childAddress = children[i];
    let [childCell, childCellProp] = activeCell(childAddress);
    let childFormula = childCellProp.formula;

    let evaluatedValue = evaluateFormula(childFormula);
    setFormula(evaluatedValue, childFormula, childAddress);
    updateChildrenCells(childAddress);
  }
}

function addChildToParent(formula) {
  let childAddress = addressBar.value;
  let encodedFormula = formula.split(" ");
  for (let i = 0; i < encodedFormula.length; i++) {
    let asciiValue = encodedFormula[i].charCodeAt(0);
    if (asciiValue >= 65 && asciiValue <= 90) {
      let [parentCell, parentCellProp] = activeCell(encodedFormula[i]);
      parentCellProp.children.push(childAddress);
    }
  }
}

function removeChildFromParent(formula) {
  let childAddress = addressBar.value;
  let encodedFormula = formula.split(" ");
  for (let i = 0; i < encodedFormula.length; i++) {
    let asciiValue = encodedFormula[i].charCodeAt(0);
    if (asciiValue >= 65 && asciiValue <= 90) {
      let [parentCell, parentCellProp] = activeCell(encodedFormula[i]);
      let idx = parentCellProp.children.indexOf(childAddress);
      parentCellProp.children.splice(idx, 1);
    }
  }
}

function evaluateFormula(formula) {
  let encodedFormula = formula.split(" ");
  for (let i = 0; i < encodedFormula.length; i++) {
    let asciiValue = encodedFormula[i].charCodeAt(0);
    if (asciiValue >= 65 && asciiValue <= 90) {
      let [cell, cellProp] = activeCell(encodedFormula[i]);
      encodedFormula[i] = cellProp.value;
    }
  }
  let decodedFormula = encodedFormula.join(" ");
  return eval(decodedFormula);
}

function setFormula(evaluatedValue, formula, address) {
  let [cell, cellProp] = activeCell(address);

  cell.innerText = evaluatedValue;
  cellProp.value = evaluatedValue;
  cellProp.formula = formula;
}
