const canvas = document.querySelector('.canvas');
const ctx = canvas.getContext('2d');

let resolution =7.5;
canvas.width = 750;
canvas.height = 750;

const cols = canvas.width / resolution;
const rows = canvas.height / resolution;

function buildGrid() {
  return new Array(cols).fill(null)
    .map(() => new Array(rows).fill(0));
}
function randomBuildGrid(){
    return new Array(cols).fill(null)
    .map(() => new Array(rows).fill(null)
      .map(() => Math.floor(Math.random() * 2))
      );
}
let grid = buildGrid();
draw(grid);

function update() {
  grid = nextSimulation(grid);
  draw(grid);
  loop=requestAnimationFrame(update);
}
function mouseRowGridClick(e){
    return Math.floor(e.offsetX/resolution);
}
function mouseColGridClick(e){
    return Math.floor(e.offsetY/resolution);
}
canvas.addEventListener('click',function(e){
    console.log(mouseRowGridClick(e),mouseColGridClick(e));
    grid[mouseRowGridClick(e)][mouseColGridClick(e)]=1;
    draw(grid)
})
document.getElementById('start').addEventListener('click',function(){
    document.getElementById('start').disabled=true
    document.getElementById('stop').disabled=false
    requestAnimationFrame(update);
})
document.getElementById('stop').addEventListener('click',function(){
    document.getElementById('stop').disabled=true
    document.getElementById('start').disabled=false;

    cancelAnimationFrame(loop)
})
document.getElementById('random').addEventListener('click',function(){
    grid=randomBuildGrid();
    draw(grid)

})
document.getElementById('size').addEventListener('change',function(){
    resolution=parseFloat(document.getElementById('size').value);
    grid = buildGrid();
    draw(grid);

})

function nextSimulation(grid) {
  const nextGen = grid.map(arr => [...arr]);

  for (let col = 0; col < grid.length; col++) {
    for (let row = 0; row < grid[col].length; row++) {
      const cell = grid[col][row];
      let numNeighbours = 0;
      for (let i = -1; i < 2; i++) {
        for (let j = -1; j < 2; j++) {
          if (i === 0 && j === 0) {
            continue;
          }
          const x = col + i;
          const y = row + j;

          if (x >= 0 && y >= 0 && x < cols && y < rows) {
            const currentNeighbour = grid[col + i][row + j];
            numNeighbours += currentNeighbour;
          }
        }
      }

      // rules
      if (cell === 1 && numNeighbours < 2) {
        nextGen[col][row] = 0;
      } else if (cell === 1 && numNeighbours > 3) {
        nextGen[col][row] = 0;
      } else if (cell === 0 && numNeighbours === 3) {
        nextGen[col][row] = 1;
      }
    }
  }
  return nextGen;
}

function draw(grid) {
  for (let col = 0; col < grid.length; col++) {
    for (let row = 0; row < grid[col].length; row++) {
      const cell = grid[col][row];

      ctx.beginPath();
      ctx.strokeStyle='grey';
      ctx.rect(col * resolution, row * resolution, resolution, resolution);
      ctx.fillStyle = cell ? 'black' : 'white';
      ctx.fill();
      ctx.stroke();
    }
  }
}