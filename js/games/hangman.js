// ============ HANGMAN ============

import { registerWindow, toggleWindow } from '../window-manager.js';

const hm = { word:'', guessed:[], wrong:0, maxWrong:6, gameOver:false };
const words = ['APPLE','MACINTOSH','KEYBOARD','FLOPPY','MONITOR','PRINTER','SILICON','CIRCUIT','PROGRAM','MEMORY','BINARY','PASCAL','CURSOR','BITMAP','MODEM','PIXEL','MOUSE','WIDGET','FOLDER','SYSTEM'];

function drawGallows() {
    const ctx=document.getElementById('hangman-canvas').getContext('2d');
    ctx.fillStyle='white';ctx.fillRect(0,0,150,120);ctx.strokeStyle='black';ctx.lineWidth=2;
    ctx.beginPath();ctx.moveTo(20,110);ctx.lineTo(60,110);ctx.stroke();
    ctx.beginPath();ctx.moveTo(40,110);ctx.lineTo(40,15);ctx.stroke();
    ctx.beginPath();ctx.moveTo(40,15);ctx.lineTo(90,15);ctx.stroke();
    ctx.beginPath();ctx.moveTo(90,15);ctx.lineTo(90,30);ctx.stroke();
    if(hm.wrong>=1){ctx.beginPath();ctx.arc(90,40,10,0,Math.PI*2);ctx.stroke();}
    if(hm.wrong>=2){ctx.beginPath();ctx.moveTo(90,50);ctx.lineTo(90,75);ctx.stroke();}
    if(hm.wrong>=3){ctx.beginPath();ctx.moveTo(90,55);ctx.lineTo(70,70);ctx.stroke();}
    if(hm.wrong>=4){ctx.beginPath();ctx.moveTo(90,55);ctx.lineTo(110,70);ctx.stroke();}
    if(hm.wrong>=5){ctx.beginPath();ctx.moveTo(90,75);ctx.lineTo(70,95);ctx.stroke();}
    if(hm.wrong>=6){ctx.beginPath();ctx.moveTo(90,75);ctx.lineTo(110,95);ctx.stroke();}
}

function updateWord() {
    document.getElementById('hangman-word').textContent=hm.word.split('').map(function(c){return hm.guessed.indexOf(c)>=0?c:'_';}).join(' ');
    document.getElementById('hangman-used').textContent='Used: '+hm.guessed.join(' ');
}

export function hangmanNew() {
    hm.word=words[Math.floor(Math.random()*words.length)];hm.guessed=[];hm.wrong=0;hm.gameOver=false;
    document.getElementById('hangman-msg').textContent='';document.getElementById('hangman-input').value='';
    drawGallows();updateWord();
}

export function hangmanGuess() {
    if(hm.gameOver)return;
    const input=document.getElementById('hangman-input');
    const letter=input.value.toUpperCase().trim();input.value='';input.focus();
    if(!letter||letter.length!==1||!/[A-Z]/.test(letter))return;
    if(hm.guessed.indexOf(letter)>=0)return;
    hm.guessed.push(letter);
    if(hm.word.indexOf(letter)<0){hm.wrong++;drawGallows();}
    updateWord();
    if(hm.wrong>=hm.maxWrong){hm.gameOver=true;document.getElementById('hangman-msg').textContent='You lose! Word: '+hm.word;}
    else if(hm.word.split('').every(function(c){return hm.guessed.indexOf(c)>=0;})){hm.gameOver=true;document.getElementById('hangman-msg').textContent='You win!';}
}

export function toggleHangman() { toggleWindow('hangman-window'); }

export function initHangmanApp() {
    registerWindow('hangman-window', {
        x: 120, y: 80,
        onOpen: function() { hangmanNew(); }
    });
    document.getElementById('hangman-input').addEventListener('keydown', function(e) { if(e.key==='Enter') hangmanGuess(); });
}
