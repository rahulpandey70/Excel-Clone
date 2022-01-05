// Cycle Validation Detection
// Storage
let graphComponentMatrix = [];

for (let i = 0; i < rows; i++) {
  let row = [];
  for (let j = 0; j < col; j++) {
    row.push([]);
  }
  graphComponentMatrix.push(row);
}

function cyclicValidation(graphComponentMatrix) {
  let visited = []; 
  let dfsVisited = [];

  for (let i = 0; i < rows; i++) {
    let visitedRow = [];
    let dfsVisitedRow = [];
    for (let j = 0; j < col; j++) {
      visitedRow.push(false);
      dfsVisitedRow.push(false);
    }
    visited.push(visitedRow);
    dfsVisited.push(dfsVisitedRow);
  }

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < col; j++) {
      if (visited[i][j] === false) {
        let response = dfsCycleDetection(
          graphComponentMatrix,
          i,
          j,
          visited,
          dfsVisited
        );
        if (response == true) return [i, j];
      }
    }
  }

  return null;
}

// Cycle detection condition-> if visited[i][j] === true && dfsVisited[i][j] === true, then cycle detected
function dfsCycleDetection(
  graphComponentMatrix,
  srcr,
  srcc,
  visited,
  dfsVisited
) {
  visited[srcr][srcc] = true;
  dfsVisited[srcr][srcc] = true;

  for (
    let children = 0;
    children < graphComponentMatrix[srcr][srcc].length;
    children++
  ) {
    let [nbrr, nbrc] = graphComponentMatrix[srcr][srcc][children];
    if (visited[nbrr][nbrc] === false) {
      let response = dfsCycleDetection(
        graphComponentMatrix,
        nbrr,
        nbrc,
        visited,
        dfsVisited
      );
      if (response === true) return true;
    } else if (
      visited[nbrr][nbrc] === true &&
      dfsVisited[nbrr][nbrc] === true
    ) {
      return true;
    }
  }

  dfsVisited[srcr][srcc] = false;
  return false;
}
