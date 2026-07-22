// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Ben Richardson — https://benrichardson.dev
// Additional terms under AGPL-3.0 section 7(b) apply; see ADDITIONAL-TERMS.md.
// ============ SNAKE ============

import { registerWindow, toggleWindow } from '../window-manager.js';

const sn = { running:false, animId:null, score:0, dir:'right', snake:[], food:null, gridW:28, gridH:20, cellSize:10, speed:120, lastTime:0 };

function placeFood() { let p; do{p={x:Math.floor(Math.random()*sn.gridW),y:Math.floor(Math.random()*sn.gridH)};}while(sn.snake.some(function(s){return s.x===p.x&&s.y===p.y;})); sn.food=p; }

function snakeDraw() {
    const ctx=document.getElementById('snake-canvas').getContext('2d');
    ctx.fillStyle='white';ctx.fillRect(0,0,280,200);
    ctx.fillStyle='black';
    sn.snake.forEach(function(s){ctx.fillRect(s.x*sn.cellSize,s.y*sn.cellSize,sn.cellSize-1,sn.cellSize-1);});
    if(sn.food) ctx.fillRect(sn.food.x*sn.cellSize+2,sn.food.y*sn.cellSize+2,sn.cellSize-5,sn.cellSize-5);
}

function snakeUpdate(ts) {
    if(!sn.running)return;
    if(ts-sn.lastTime<sn.speed){sn.animId=requestAnimationFrame(snakeUpdate);return;}
    sn.lastTime=ts;
    const head={x:sn.snake[0].x,y:sn.snake[0].y};
    if(sn.dir==='right')head.x++;else if(sn.dir==='left')head.x--;else if(sn.dir==='up')head.y--;else head.y++;
    if(head.x<0||head.x>=sn.gridW||head.y<0||head.y>=sn.gridH||sn.snake.some(function(s){return s.x===head.x&&s.y===head.y;})){
        sn.running=false;const ctx=document.getElementById('snake-canvas').getContext('2d');ctx.fillStyle='black';ctx.font='16px ChiKareGo2,monospace';ctx.textAlign='center';ctx.fillText('GAME OVER',140,100);return;
    }
    sn.snake.unshift(head);
    if(head.x===sn.food.x&&head.y===sn.food.y){sn.score++;document.getElementById('snake-score').textContent=sn.score;placeFood();}
    else sn.snake.pop();
    snakeDraw();sn.animId=requestAnimationFrame(snakeUpdate);
}

function reset() { sn.snake=[{x:5,y:10},{x:4,y:10},{x:3,y:10}];sn.dir='right';sn.score=0;sn.running=false;document.getElementById('snake-score').textContent='0';placeFood();snakeDraw(); }

export function snakeStart() { reset();sn.running=true;sn.lastTime=0;sn.animId=requestAnimationFrame(snakeUpdate); }

export function toggleSnake() { toggleWindow('snake-window'); }

export function initSnakeApp() {
    registerWindow('snake-window', {
        x: 100, y: 70,
        onOpen: function() { reset(); },
        onClose: function() { sn.running=false;if(sn.animId)cancelAnimationFrame(sn.animId); }
    });
    document.addEventListener('keydown', function(e) {
        if(!sn.running||document.getElementById('snake-window').style.display==='none') return;
        if(e.key==='ArrowUp'&&sn.dir!=='down')sn.dir='up';
        else if(e.key==='ArrowDown'&&sn.dir!=='up')sn.dir='down';
        else if(e.key==='ArrowLeft'&&sn.dir!=='right')sn.dir='left';
        else if(e.key==='ArrowRight'&&sn.dir!=='left')sn.dir='right';
    });
}
