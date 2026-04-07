// ============ MINESWEEPER ============

import { registerWindow, toggleWindow } from '../window-manager.js';

const ms = { grid:[], revealed:[], flagged:[], rows:9, cols:9, mines:10, gameOver:false, firstClick:true };

function placeMines(safeR,safeC) {
    let placed=0;
    while(placed<ms.mines){const r=Math.floor(Math.random()*ms.rows),c=Math.floor(Math.random()*ms.cols);if(ms.grid[r][c]!==-1&&!(Math.abs(r-safeR)<=1&&Math.abs(c-safeC)<=1)){ms.grid[r][c]=-1;placed++;}}
    for(let r=0;r<ms.rows;r++) for(let c=0;c<ms.cols;c++){if(ms.grid[r][c]===-1)continue;let count=0;for(let dr=-1;dr<=1;dr++) for(let dc=-1;dc<=1;dc++){const nr=r+dr,nc=c+dc;if(nr>=0&&nr<ms.rows&&nc>=0&&nc<ms.cols&&ms.grid[nr][nc]===-1)count++;}ms.grid[r][c]=count;}
}

function reveal(r,c) {
    if(r<0||r>=ms.rows||c<0||c>=ms.cols||ms.revealed[r][c]||ms.flagged[r][c]) return;
    ms.revealed[r][c]=true;
    if(ms.grid[r][c]===0) for(let dr=-1;dr<=1;dr++) for(let dc=-1;dc<=1;dc++) reveal(r+dr,c+dc);
}

function click(r,c) {
    if(ms.gameOver||ms.flagged[r][c]) return;
    if(ms.firstClick){ms.firstClick=false;placeMines(r,c);}
    if(ms.grid[r][c]===-1){ms.gameOver=true;ms.revealed[r][c]=true;for(let i=0;i<ms.rows;i++) for(let j=0;j<ms.cols;j++) if(ms.grid[i][j]===-1) ms.revealed[i][j]=true;render();return;}
    reveal(r,c);render();
    let unrevealed=0;for(let i=0;i<ms.rows;i++) for(let j=0;j<ms.cols;j++) if(!ms.revealed[i][j]) unrevealed++;
    if(unrevealed===ms.mines){ms.gameOver=true;const{showAlert}=window._systemFns||{};if(showAlert)showAlert('You win!');}
}

function flag(r,c) {
    if(ms.gameOver||ms.revealed[r][c]) return;
    ms.flagged[r][c]=!ms.flagged[r][c];
    let flags=0;for(let i=0;i<ms.rows;i++) for(let j=0;j<ms.cols;j++) if(ms.flagged[i][j]) flags++;
    document.getElementById('mines-flags').textContent=flags;render();
}

function render() {
    const grid=document.getElementById('mines-grid');grid.innerHTML='';
    for(let r=0;r<ms.rows;r++) for(let c=0;c<ms.cols;c++){
        const cell=document.createElement('div');cell.className='mines-cell';
        if(ms.revealed[r][c]){cell.classList.add('revealed');if(ms.grid[r][c]===-1){cell.classList.add('mine');cell.textContent='*';}else if(ms.grid[r][c]>0)cell.textContent=ms.grid[r][c];}
        else if(ms.flagged[r][c]){cell.classList.add('flagged');cell.textContent='F';}
        (function(row,col){cell.addEventListener('click',function(){click(row,col);});cell.addEventListener('contextmenu',function(e){e.preventDefault();flag(row,col);});})(r,c);
        grid.appendChild(cell);
    }
}

export function minesNew() {
    ms.grid=[];ms.revealed=[];ms.flagged=[];ms.gameOver=false;ms.firstClick=true;
    for(let r=0;r<ms.rows;r++){ms.grid[r]=[];ms.revealed[r]=[];ms.flagged[r]=[];for(let c=0;c<ms.cols;c++){ms.grid[r][c]=0;ms.revealed[r][c]=false;ms.flagged[r][c]=false;}}
    document.getElementById('mines-count').textContent=ms.mines;document.getElementById('mines-flags').textContent='0';render();
}

export function toggleMinesweeper() { toggleWindow('minesweeper-window'); }

export function initMinesweeperApp() {
    registerWindow('minesweeper-window', { x:110, y:60, onOpen:function(){minesNew();} });
}
