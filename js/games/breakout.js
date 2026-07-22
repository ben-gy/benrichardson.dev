// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Ben Richardson — https://benrichardson.dev
// Additional terms under AGPL-3.0 section 7(b) apply; see ADDITIONAL-TERMS.md.
// ============ BREAKOUT ============

import { registerWindow, toggleWindow } from '../window-manager.js';

const bo = { running:false, animId:null, score:0, lives:3, ball:{x:150,y:170,dx:2,dy:-2,r:3}, paddle:{x:125,w:50,h:6}, bricks:[], rows:5, cols:8 };

function initBricks() { bo.bricks=[]; const bw=300/bo.cols-2; for(let r=0;r<bo.rows;r++) for(let c=0;c<bo.cols;c++) bo.bricks.push({x:c*(bw+2)+1,y:r*12+10,w:bw,h:10,alive:true,points:(bo.rows-r)*10}); }
function reset() { bo.score=0;bo.lives=3;bo.ball={x:150,y:170,dx:2,dy:-2,r:3};bo.paddle={x:125,w:50,h:6};initBricks();document.getElementById('breakout-score').textContent='0';document.getElementById('breakout-lives').textContent='3'; }
function resetBall() { bo.ball.x=150;bo.ball.y=170;bo.ball.dx=2*(Math.random()>0.5?1:-1);bo.ball.dy=-2; }

function draw() {
    const ctx=document.getElementById('breakout-canvas').getContext('2d');
    ctx.fillStyle='white';ctx.fillRect(0,0,300,200);
    ctx.fillStyle='black';
    bo.bricks.forEach(function(b){if(b.alive){ctx.fillRect(b.x,b.y,b.w,b.h);ctx.fillStyle='white';ctx.fillRect(b.x+1,b.y+1,b.w-2,1);ctx.fillStyle='black';}});
    ctx.fillRect(bo.paddle.x,192,bo.paddle.w,bo.paddle.h);
    ctx.beginPath();ctx.arc(bo.ball.x,bo.ball.y,bo.ball.r,0,Math.PI*2);ctx.fill();
}

function update() {
    const ball=bo.ball; ball.x+=ball.dx; ball.y+=ball.dy;
    if(ball.x-ball.r<=0||ball.x+ball.r>=300) ball.dx=-ball.dx;
    if(ball.y-ball.r<=0) ball.dy=-ball.dy;
    if(ball.dy>0&&ball.y+ball.r>=192&&ball.x>=bo.paddle.x&&ball.x<=bo.paddle.x+bo.paddle.w) { ball.dy=-ball.dy; ball.dx=(ball.x-bo.paddle.x)/bo.paddle.w*5-2.5; }
    if(ball.y>200) { bo.lives--;document.getElementById('breakout-lives').textContent=bo.lives; if(bo.lives<=0){bo.running=false;cancelAnimationFrame(bo.animId);const ctx=document.getElementById('breakout-canvas').getContext('2d');ctx.fillStyle='white';ctx.fillRect(0,0,300,200);ctx.fillStyle='black';ctx.font='16px ChiKareGo2,monospace';ctx.textAlign='center';ctx.fillText('GAME OVER',150,90);ctx.font='11px ChiKareGo2,monospace';ctx.fillText('Score: '+bo.score,150,115);return;}resetBall(); }
    let allGone=true;
    bo.bricks.forEach(function(b){if(!b.alive)return;allGone=false;if(ball.x+ball.r>b.x&&ball.x-ball.r<b.x+b.w&&ball.y+ball.r>b.y&&ball.y-ball.r<b.y+b.h){b.alive=false;ball.dy=-ball.dy;bo.score+=b.points;document.getElementById('breakout-score').textContent=bo.score;}});
    if(allGone){bo.running=false;cancelAnimationFrame(bo.animId);const ctx=document.getElementById('breakout-canvas').getContext('2d');ctx.fillStyle='white';ctx.fillRect(0,0,300,200);ctx.fillStyle='black';ctx.font='16px ChiKareGo2,monospace';ctx.textAlign='center';ctx.fillText('YOU WIN!',150,90);ctx.font='11px ChiKareGo2,monospace';ctx.fillText('Score: '+bo.score,150,115);}
}

function loop() { if(!bo.running)return; update();draw(); bo.animId=requestAnimationFrame(loop); }

export function breakoutStart() { reset();bo.running=true;draw();loop(); }

export function toggleBreakout() { toggleWindow('breakout-window'); }

export function initBreakoutApp() {
    registerWindow('breakout-window', {
        x: 90, y: 70,
        onOpen: function() { reset(); draw(); },
        onClose: function() { bo.running=false; if(bo.animId) cancelAnimationFrame(bo.animId); }
    });
    document.getElementById('breakout-canvas').addEventListener('mousemove', function(e) {
        if(!bo.running) return;
        const rect=e.target.getBoundingClientRect();
        const scaleX=300/rect.width;
        bo.paddle.x=Math.max(0,Math.min(300-bo.paddle.w,(e.clientX-rect.left)*scaleX-bo.paddle.w/2));
    });
}
