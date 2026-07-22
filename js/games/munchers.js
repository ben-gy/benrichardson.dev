// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Ben Richardson — https://benrichardson.dev
// Additional terms under AGPL-3.0 section 7(b) apply; see ADDITIONAL-TERMS.md.
// ============ NUMBER MUNCHERS ============

import { registerWindow, toggleWindow } from '../window-manager.js';

const nm={grid:[],playerR:2,playerC:2,score:0,lives:3,target:0,type:'multiples',rows:5,cols:6,gameOver:false};

function isCorrect(val){
    if(nm.type==='multiples')return val%nm.target===0&&val>0;
    if(nm.type==='primes'){if(val<2)return false;for(let i=2;i*i<=val;i++)if(val%i===0)return false;return true;}
    if(nm.type==='factors')return nm.target%val===0&&val>0;
    return false;
}

function newRound(){
    nm.target=[2,3,4,5,7][Math.floor(Math.random()*5)];
    const types=['multiples','factors','primes'];nm.type=types[Math.floor(Math.random()*types.length)];
    nm.grid=[];
    for(let r=0;r<nm.rows;r++){nm.grid[r]=[];for(let c=0;c<nm.cols;c++){
        if(nm.type==='multiples')nm.grid[r][c]=Math.random()<0.4?nm.target*(Math.floor(Math.random()*10)+1):Math.floor(Math.random()*50)+1;
        else if(nm.type==='primes'){const primes=[2,3,5,7,11,13,17,19,23,29,31];nm.grid[r][c]=Math.random()<0.35?primes[Math.floor(Math.random()*primes.length)]:[4,6,8,9,10,12,14,15,16,18,20,21][Math.floor(Math.random()*12)];}
        else{const facts=[];for(let i=1;i<=nm.target;i++)if(nm.target%i===0)facts.push(i);nm.grid[r][c]=Math.random()<0.4?facts[Math.floor(Math.random()*facts.length)]:Math.floor(Math.random()*20)+1;}
    }}
    render();
}

function render(){
    const grid=document.getElementById('munchers-grid');grid.innerHTML='';
    for(let r=0;r<nm.rows;r++)for(let c=0;c<nm.cols;c++){const cell=document.createElement('div');cell.className='munchers-cell';if(r===nm.playerR&&c===nm.playerC)cell.classList.add('player');if(nm.grid[r][c]!==null)cell.textContent=nm.grid[r][c];grid.appendChild(cell);}
    let prompt='';if(nm.type==='multiples')prompt='Munch multiples of '+nm.target;else if(nm.type==='primes')prompt='Munch the prime numbers';else prompt='Munch factors of '+nm.target;
    document.getElementById('munchers-prompt').textContent=prompt;document.getElementById('munchers-score').textContent=nm.score;document.getElementById('munchers-lives').textContent=nm.lives;
}

function munch(){
    const val=nm.grid[nm.playerR][nm.playerC];if(val===null)return;
    if(isCorrect(val)){nm.score+=10;nm.grid[nm.playerR][nm.playerC]=null;document.getElementById('munchers-msg').textContent='Correct! +10';
        let remaining=false;for(let r=0;r<nm.rows;r++)for(let c=0;c<nm.cols;c++)if(nm.grid[r][c]!==null&&isCorrect(nm.grid[r][c]))remaining=true;
        if(!remaining){nm.score+=50;document.getElementById('munchers-msg').textContent='Round complete! +50 bonus';setTimeout(newRound,1000);}
    }else{nm.lives--;document.getElementById('munchers-msg').textContent='Wrong!';if(nm.lives<=0){nm.gameOver=true;document.getElementById('munchers-msg').textContent='Game Over! Score: '+nm.score;}}
    render();
}

export function toggleMunchers(){toggleWindow('munchers-window');}

export function initMunchersApp(){
    registerWindow('munchers-window',{x:70,y:60,onOpen:function(){nm.score=0;nm.lives=3;nm.gameOver=false;nm.playerR=2;nm.playerC=2;document.getElementById('munchers-msg').textContent='Arrow keys to move, Space to munch!';newRound();}});
    document.addEventListener('keydown',function(e){
        if(nm.gameOver||document.getElementById('munchers-window').style.display==='none')return;
        if(e.key==='ArrowUp'&&nm.playerR>0){nm.playerR--;render();e.preventDefault();}
        else if(e.key==='ArrowDown'&&nm.playerR<nm.rows-1){nm.playerR++;render();e.preventDefault();}
        else if(e.key==='ArrowLeft'&&nm.playerC>0){nm.playerC--;render();e.preventDefault();}
        else if(e.key==='ArrowRight'&&nm.playerC<nm.cols-1){nm.playerC++;render();e.preventDefault();}
        else if(e.key===' '){munch();e.preventDefault();}
    });
}
