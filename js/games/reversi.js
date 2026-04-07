// ============ REVERSI ============

import { registerWindow, toggleWindow } from '../window-manager.js';

const rv = { board:[], turn:'B', gameOver:false };

function getFlips(r,c,color) {
    if(rv.board[r][c]) return [];
    const opp=color==='B'?'W':'B';const dirs=[[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]];let all=[];
    dirs.forEach(function(d){let flips=[],nr=r+d[0],nc=c+d[1];while(nr>=0&&nr<8&&nc>=0&&nc<8&&rv.board[nr][nc]===opp){flips.push([nr,nc]);nr+=d[0];nc+=d[1];}if(nr>=0&&nr<8&&nc>=0&&nc<8&&rv.board[nr][nc]===color&&flips.length>0)all=all.concat(flips);});
    return all;
}
function hasMoves(color){for(let r=0;r<8;r++)for(let c=0;c<8;c++)if(getFlips(r,c,color).length>0)return true;return false;}
function count(){let b=0,w=0;for(let r=0;r<8;r++)for(let c=0;c<8;c++){if(rv.board[r][c]==='B')b++;if(rv.board[r][c]==='W')w++;}return{b:b,w:w};}

function doMove(r,c,color){const flips=getFlips(r,c,color);if(flips.length===0)return false;rv.board[r][c]=color;flips.forEach(function(f){rv.board[f[0]][f[1]]=color;});return true;}

function ai(){let best=null,bestN=0;for(let r=0;r<8;r++)for(let c=0;c<8;c++){const f=getFlips(r,c,'W');if(f.length>bestN){bestN=f.length;best=[r,c];}}if(best)doMove(best[0],best[1],'W');}

function doClick(r,c){
    if(rv.gameOver||rv.turn!=='B')return;if(!doMove(r,c,'B'))return;
    rv.turn='W';render();
    if(hasMoves('W')){setTimeout(function(){ai();rv.turn='B';if(!hasMoves('B')){if(!hasMoves('W'))rv.gameOver=true;else{rv.turn='W';setTimeout(function(){ai();rv.turn='B';render();},300);}}render();},300);}
    else{rv.turn='B';if(!hasMoves('B'))rv.gameOver=true;render();}
}

function render(){
    const grid=document.getElementById('reversi-grid');grid.innerHTML='';
    for(let r=0;r<8;r++)for(let c=0;c<8;c++){const cell=document.createElement('div');cell.className='reversi-cell';if(rv.board[r][c]){const p=document.createElement('div');p.className='reversi-piece '+(rv.board[r][c]==='B'?'black':'white');cell.appendChild(p);}(function(row,col){cell.addEventListener('click',function(){doClick(row,col);});})(r,c);grid.appendChild(cell);}
    const cnt=count();let info='Black: '+cnt.b+' | White: '+cnt.w;
    if(rv.gameOver)info+=' | '+(cnt.b>cnt.w?'Black wins!':cnt.w>cnt.b?'White wins!':'Draw!');else info+=' | Turn: '+(rv.turn==='B'?'Black':'White');
    document.getElementById('reversi-info').textContent=info;
}

export function reversiNew(){rv.board=[];rv.turn='B';rv.gameOver=false;for(let r=0;r<8;r++){rv.board[r]=[];for(let c=0;c<8;c++)rv.board[r][c]=null;}rv.board[3][3]='W';rv.board[3][4]='B';rv.board[4][3]='B';rv.board[4][4]='W';render();}

export function toggleReversi(){toggleWindow('reversi-window');}

export function initReversiApp(){registerWindow('reversi-window',{x:80,y:60,onOpen:function(){reversiNew();}});}
