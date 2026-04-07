// ============ OREGON TRAIL ============

import { registerWindow, toggleWindow } from '../window-manager.js';

const ot = { state:'MENU', month:3, day:1, miles:0, food:0, oxen:0, clothes:0, ammo:0, parts:0, money:700, health:5, pace:'steady', party:['You','Sara','Jim','Beth','Tom'], alive:[true,true,true,true,true], buyItem:0 };
const months = ['','Jan','Feb','March','April','May','June','July','Aug','Sept','Oct','Nov','Dec'];
const landmarks = [{mile:102,name:'Kansas River Crossing'},{mile:304,name:'Fort Kearney'},{mile:554,name:'Chimney Rock'},{mile:640,name:'Fort Laramie'},{mile:830,name:'Independence Rock'},{mile:989,name:'South Pass'},{mile:1150,name:'Fort Bridger'},{mile:1305,name:'Soda Springs'},{mile:1510,name:'Fort Hall'},{mile:1700,name:'Blue Mountains'},{mile:1835,name:'Fort Walla Walla'},{mile:2040,name:'Oregon City'}];

function print(text) { const el=document.getElementById('oregon-output'); el.textContent=text; el.scrollTop=el.scrollHeight; }
function status() {
    return '================================\n  THE OREGON TRAIL\n================================\n'+
    'Date: '+months[ot.month]+' '+ot.day+', 1848\nMiles traveled: '+ot.miles+' / 2040\nParty: '+ot.alive.filter(Boolean).length+' alive\nFood: '+ot.food+' lbs\nOxen: '+ot.oxen+'\nClothes: '+ot.clothes+' sets\nAmmo: '+ot.ammo+' rounds\nSpare parts: '+ot.parts+'\nMoney: $'+ot.money+'\nHealth: '+['','very poor','poor','fair','good','great'][ot.health]+'\n--------------------------------\n';
}
function nextLandmark() { for(let i=0;i<landmarks.length;i++) if(ot.miles<landmarks[i].mile) return landmarks[i]; return landmarks[landmarks.length-1]; }
function showMenu() { ot.state='MENU'; const n=nextLandmark(); print(status()+'Next: '+n.name+' ('+(n.mile-ot.miles)+' mi)\n\nWhat would you like to do?\n1. Continue on the trail\n2. Rest for a day\n3. Hunt for food\n4. Change pace\n5. Check supplies\n'); document.getElementById('oregon-label').textContent='Choice:'; }

function init() {
    ot.state='INTRO'; ot.month=3; ot.day=1; ot.miles=0; ot.food=0; ot.oxen=0; ot.clothes=0; ot.ammo=0; ot.parts=0; ot.money=700; ot.health=5; ot.pace='steady'; ot.party=['You','Sara','Jim','Beth','Tom']; ot.alive=[true,true,true,true,true];
    print('================================\n  THE OREGON TRAIL\n================================\n\nThe year is 1848. Your family\nof 5 must travel 2,040 miles\nfrom Independence, Missouri\nto Oregon City, Oregon.\n\nYou have $700 for supplies.\n\nPress OK to visit the store.\n');
    document.getElementById('oregon-label').textContent='';
}

function store() { ot.state='STORE'; print('================================\n  GENERAL STORE\n================================\nMoney: $'+ot.money+'\n\n1. Oxen ($40 each) - have '+ot.oxen+'\n2. Food ($0.50/lb) - have '+ot.food+' lbs\n3. Clothes ($10/set) - have '+ot.clothes+'\n4. Ammo ($2/box of 20) - have '+ot.ammo+'\n5. Spare parts ($10) - have '+ot.parts+'\n6. Leave store\n'); document.getElementById('oregon-label').textContent='Buy:'; }

function buy(item) { ot.state='BUY_QTY'; ot.buyItem=item; const names={1:'oxen ($40 ea)',2:'lbs of food ($0.50/lb)',3:'sets of clothes ($10 ea)',4:'boxes of ammo ($2 ea, 20 rounds)',5:'spare parts ($10 ea)'}; print('How many '+names[item]+'?\nMoney: $'+ot.money+'\n'); document.getElementById('oregon-label').textContent='Qty:'; }

function processBuy(qty) { qty=parseInt(qty); if(isNaN(qty)||qty<=0){store();return;} const costs={1:40,2:0.5,3:10,4:2,5:10}; const cost=Math.floor(qty*costs[ot.buyItem]); if(cost>ot.money){print('You can\'t afford that!\n\nPress OK.');ot.state='STORE_RETURN';return;} ot.money-=cost; if(ot.buyItem===1)ot.oxen+=qty; else if(ot.buyItem===2)ot.food+=qty; else if(ot.buyItem===3)ot.clothes+=qty; else if(ot.buyItem===4)ot.ammo+=qty*20; else if(ot.buyItem===5)ot.parts+=qty; store(); }

function advanceDay(days) { for(let d=0;d<days;d++){ ot.day++; if(ot.day>30){ot.day=1;ot.month++;} if(ot.month>12)ot.month=12; const ac=ot.alive.filter(Boolean).length; ot.food=Math.max(0,ot.food-ac*3); if(ot.food<=0)ot.health=Math.max(1,ot.health-1); if(ot.month>=10&&ot.clothes<ac)ot.health=Math.max(1,ot.health-1); } }

function randomEvent() {
    const events=[
        function(){const l=10+Math.floor(Math.random()*30);ot.food=Math.max(0,ot.food-l);return'Bad water! Lost '+l+' lbs of food.';},
        function(){if(Math.random()<0.5&&ot.oxen>0){ot.oxen--;return'An ox has died!';}return'An ox is sick but recovers.';},
        function(){const i=Math.floor(Math.random()*5);if(ot.alive[i]&&i>0){if(ot.health<=2){ot.alive[i]=false;return ot.party[i]+' has died of dysentery.';}ot.health=Math.max(1,ot.health-1);return ot.party[i]+' has dysentery.';}return'A party member feels ill but recovers.';},
        function(){const s=Math.floor(Math.random()*30)+5;ot.ammo=Math.max(0,ot.ammo-s);return'Thieves stole '+s+' rounds of ammo!';},
        function(){ot.food+=40;return'You found wild berries! +40 lbs food.';},
        function(){if(ot.parts>0){ot.parts--;return'Wagon wheel broke! Used a spare.';}ot.miles=Math.max(0,ot.miles-20);return'Wagon wheel broke! Lost 20 miles.';},
        function(){const i=Math.floor(Math.random()*5);if(ot.alive[i]){if(ot.health<=1&&i>0){ot.alive[i]=false;return ot.party[i]+' has died of cholera.';}ot.health=Math.max(1,ot.health-1);return ot.party[i]+' has cholera.';}return'Heavy rain slows travel.';},
        function(){return'Beautiful weather! Good progress.';},
        function(){ot.food+=20;return'A friendly traveller gave you food. +20 lbs.';},
        function(){if(ot.clothes>0){ot.clothes--;return'Lost clothes crossing a river.';}return'Crossed a river safely.';}
    ];
    const msg=events[Math.floor(Math.random()*events.length)]();
    if(!ot.alive[0]){ot.state='DEAD';print('================================\n  GAME OVER\n================================\n\n'+msg+'\n\nYou have died.\nMiles: '+ot.miles+'\n\nPress OK to play again.\n');return;}
    if(!ot.alive.some(Boolean)){ot.state='DEAD';print('Everyone has perished.\n\nPress OK to play again.');return;}
    print(status()+msg+'\n\nPress OK.'); ot.state='MENU_RETURN';
}

function travel() {
    if(ot.oxen<=0){print('No oxen! Cannot travel.\n\nPress OK.');ot.state='MENU_RETURN';return;}
    const speed=ot.pace==='fast'?25:ot.pace==='slow'?10:18;
    const dist=speed+Math.floor(Math.random()*10)-3; ot.miles+=Math.max(0,dist); advanceDay(1);
    if(ot.miles>=2040){ot.state='WIN';const an=ot.party.filter(function(_,i){return ot.alive[i];});print('================================\n  CONGRATULATIONS!\n================================\n\nYou reached Oregon City!\n\nSurvivors: '+an.join(', ')+'\nDate: '+months[ot.month]+' '+ot.day+', 1848\n\nPress OK to play again.\n');return;}
    for(let i=0;i<landmarks.length;i++){if(ot.miles>=landmarks[i].mile&&ot.miles-dist<landmarks[i].mile){print(status()+'You reached\n'+landmarks[i].name+'!\n\nPress OK.');ot.state='MENU_RETURN';return;}}
    if(Math.random()<0.4){randomEvent();return;} showMenu();
}

function hunt() {
    if(ot.ammo<10){print('Not enough ammo! Need 10.\n\nPress OK.');ot.state='MENU_RETURN';return;}
    ot.ammo-=10; advanceDay(1);
    const s=Math.random(); let g=0;
    if(s<0.5)g=20+Math.floor(Math.random()*30); else if(s<0.8)g=50+Math.floor(Math.random()*50);
    ot.food+=g;
    print(status()+(g>0?'Shot game! +'+g+' lbs food.':'No game found. -10 ammo.')+'\n\nPress OK.');
    ot.state='MENU_RETURN';
}

export function oregonSubmit() {
    const input=document.getElementById('oregon-input'); const val=input.value.trim(); input.value='';
    if(ot.state==='INTRO')store();
    else if(ot.state==='STORE'){const n=parseInt(val);if(n>=1&&n<=5)buy(n);else if(n===6){if(ot.oxen<=0){print('Need at least 1 ox!\n\nPress OK.');ot.state='STORE_RETURN';}else if(ot.food<=0){print('Need some food!\n\nPress OK.');ot.state='STORE_RETURN';}else showMenu();}}
    else if(ot.state==='BUY_QTY')processBuy(val);
    else if(ot.state==='STORE_RETURN')store();
    else if(ot.state==='MENU'){const n=parseInt(val);if(n===1)travel();else if(n===2){advanceDay(1);ot.health=Math.min(5,ot.health+1);print(status()+'Rested. Health improved.\n\nPress OK.');ot.state='MENU_RETURN';}else if(n===3)hunt();else if(n===4){ot.state='PACE';print('Choose pace:\n1. Slow (10-17 mi/day)\n2. Steady (15-25 mi/day)\n3. Fast (22-32 mi/day)\n\nCurrent: '+ot.pace+'\n');document.getElementById('oregon-label').textContent='Pace:';}else if(n===5){const am=ot.party.filter(function(_,i){return ot.alive[i];}),dm=ot.party.filter(function(_,i){return!ot.alive[i];});let t=status()+'Party:\n';am.forEach(function(n){t+='  '+n+' - alive\n';});dm.forEach(function(n){t+='  '+n+' - deceased\n';});t+='\nPress OK.';print(t);ot.state='MENU_RETURN';}}
    else if(ot.state==='PACE'){const n=parseInt(val);if(n===1)ot.pace='slow';else if(n===2)ot.pace='steady';else if(n===3)ot.pace='fast';showMenu();}
    else if(ot.state==='MENU_RETURN')showMenu();
    else if(ot.state==='WIN'||ot.state==='DEAD')init();
}

export function toggleOregon() { toggleWindow('oregon-window'); }

export function initOregonApp() {
    registerWindow('oregon-window', {
        x: 70, y: 60,
        onOpen: function() { init(); document.getElementById('oregon-input').value=''; document.getElementById('oregon-input').focus(); }
    });
    document.getElementById('oregon-input').addEventListener('keydown', function(e) { if(e.key==='Enter') oregonSubmit(); });
}
