class RubiksCube {
  constructor() {
    this.reset();
  }

  reset() {
    this.faces = {
      front: this.createFace('g'),
      back: this.createFace('b'),
      up: this.createFace('w'),
      down: this.createFace('y'),
      left: this.createFace('o'),
      right: this.createFace('r')
    };
  }

  createFace(color) {
    return Array(3).fill().map(() => Array(3).fill(color));
  }

  rotateFace(faceName, clockwise = true) {
    const face = this.faces[faceName];
    const n = face.length;
    for (let i = 0; i < n; i++) {
      for (let j = i; j < n; j++) {
        [face[i][j], face[j][i]] = [face[j][i], face[i][j]];
      }
    }
    if (clockwise) {
      for (let i = 0; i < n; i++) face[i].reverse();
    } else {
      face.reverse();
    }
    return true;
  }

  move(moveNotation) {
    const moveMap = {
      'f': 'front', 'b': 'back', 'u': 'up',
      'd': 'down', 'l': 'left', 'r': 'right'
    };

    const move = moveNotation.trim().toLowerCase();
    if (!move) return false;

    const faceKey = move[0];
    let turns = 1;

    if (move.includes("'")) turns = 3;
    else if (move.includes("2")) turns = 2;

    const face = moveMap[faceKey];
    if (!this.faces.hasOwnProperty(face)) return false;

    for (let i = 0; i < turns; i++) {
      this.rotateFace(face, true);
      this.rotateAdjacent(faceKey);
    }
    return true;
  }

  rotateAdjacent(faceKey) {
    const f = this.faces;
    switch (faceKey) {
      case 'f': {
        const temp = [...f.up[2]];
        for (let i = 0; i < 3; i++) f.up[2][i] = f.left[2 - i][2];
        for (let i = 0; i < 3; i++) f.left[i][2] = f.down[0][i];
        for (let i = 0; i < 3; i++) f.down[0][i] = f.right[2 - i][0];
        for (let i = 0; i < 3; i++) f.right[i][0] = temp[i];
        break;
      }
      case 'b': {
        const temp = [...f.up[0]];
        for (let i = 0; i < 3; i++) f.up[0][i] = f.right[i][2];
        for (let i = 0; i < 3; i++) f.right[i][2] = f.down[2][2 - i];
        for (let i = 0; i < 3; i++) f.down[2][i] = f.left[i][0];
        for (let i = 0; i < 3; i++) f.left[i][0] = temp[2 - i];
        break;
      }
      case 'u': {
        const temp = [...f.front[0]];
        for (let i = 0; i < 3; i++) f.front[0][i] = f.right[0][i];
        for (let i = 0; i < 3; i++) f.right[0][i] = f.back[0][i];
        for (let i = 0; i < 3; i++) f.back[0][i] = f.left[0][i];
        for (let i = 0; i < 3; i++) f.left[0][i] = temp[i];
        break;
      }
      case 'd': {
        const temp = [...f.front[2]];
        for (let i = 0; i < 3; i++) f.front[2][i] = f.left[2][i];
        for (let i = 0; i < 3; i++) f.left[2][i] = f.back[2][i];
        for (let i = 0; i < 3; i++) f.back[2][i] = f.right[2][i];
        for (let i = 0; i < 3; i++) f.right[2][i] = temp[i];
        break;
      }
      case 'l': {
        const temp = [f.up[0][0], f.up[1][0], f.up[2][0]];
        for (let i = 0; i < 3; i++) f.up[i][0] = f.back[2 - i][2];
        for (let i = 0; i < 3; i++) f.back[i][2] = f.down[2 - i][0];
        for (let i = 0; i < 3; i++) f.down[i][0] = f.front[i][0];
        for (let i = 0; i < 3; i++) f.front[i][0] = temp[i];
        break;
      }
      case 'r': {
        const temp = [f.up[0][2], f.up[1][2], f.up[2][2]];
        for (let i = 0; i < 3; i++) f.up[i][2] = f.front[i][2];
        for (let i = 0; i < 3; i++) f.front[i][2] = f.down[i][2];
        for (let i = 0; i < 3; i++) f.down[i][2] = f.back[2 - i][0];
        for (let i = 0; i < 3; i++) f.back[i][0] = temp[2 - i];
        break;
      }
    }
  }

  scramble(moveCount = 20) {
    const validMoves = ['F', "F'", 'F2', 'B', "B'", 'B2', 'U', "U'", 'U2', 'D', "D'", 'D2', 'L', "L'", 'L2', 'R', "R'", 'R2'];
    const moves = [];
    for (let i = 0; i < moveCount; i++) {
      const move = validMoves[Math.floor(Math.random() * validMoves.length)];
      moves.push(move);
    }
    return moves;
  }

  isSolved() {
    for (const face in this.faces) {
      const flat = this.faces[face].flat();
      if (!flat.every(c => c === flat[0])) return false;
    }
    return true;
  }

  getStateString() {
    let state = '';
    const order = ['up', 'right', 'front', 'down', 'left', 'back'];
    for (const face of order) {
      state += this.faces[face].flat().join('');
    }
    return state;
  }

  solveFromScramble(scrambleMoves) {
    return scrambleMoves.slice().reverse().map(m => {
      if (m.endsWith("'")) return m.replace("'", "");
      else if (m.endsWith("2")) return m;
      else return m + "'";
    });
  }
}

const cube = new RubiksCube();
let lastScramble = [];

function updateDisplay() {
  const cubeDiv = document.getElementById("cube");
  cubeDiv.innerHTML = '';

  const colors = { w: 'white', y: 'yellow', r: 'red', o: 'orange', g: 'green', b: 'blue' };
  const order = ['up', 'right', 'front', 'down', 'left', 'back'];

  order.forEach(face => {
    const faceDiv = document.createElement("div");
    faceDiv.className = "face";
    cube.faces[face].flat().forEach(color => {
      const sticker = document.createElement("div");
      sticker.className = "sticker";
      sticker.style.background = colors[color];
      faceDiv.appendChild(sticker);
    });
    cubeDiv.appendChild(faceDiv);
  });

  document.getElementById("output").innerText = cube.getStateString() + (cube.isSolved() ? " ✅ Solved" : " ❌ Not Solved");
}

function animateMoves(moves, i = 0, cb) {
  if (i >= moves.length) {
    if (cb) cb();
    return;
  }
  cube.move(moves[i]);
  updateDisplay();
  setTimeout(() => animateMoves(moves, i + 1, cb), 250);
}

function handleScramble() {
  const moves = cube.scramble();
  lastScramble = moves;
  cube.reset();
  animateMoves(moves, 0);
}

function handleSolve() {
  if (!lastScramble.length) return alert("Scramble the cube first!");
  const solveMoves = cube.solveFromScramble(lastScramble);
  animateMoves(solveMoves, 0, () => alert("Cube Solved!"));
}

function handleReset() {
  cube.reset();
  lastScramble = [];
  updateDisplay();
}

document.addEventListener("DOMContentLoaded", updateDisplay);
