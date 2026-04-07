// ============ ADVENTURE (Colossal Cave) ============

import { registerWindow, toggleWindow } from '../window-manager.js';

const adv = { room:'start', inventory:[], lamp:false, keys:false, sword:false };

const rooms = {
    start: {desc:'You are standing at the end of a road\nbefore a small brick building. Around\nyou is a forest. A small stream flows\nout of the building and down a gully.\n\nExits: NORTH, EAST, ENTER building',exits:{north:'forest',east:'valley',enter:'building',in:'building'}},
    building: {desc:'You are inside a well house for a\nlarge spring. There are some keys on\nthe ground. A lamp sits on a shelf.\n\nExits: OUT',exits:{out:'start',exit:'start'},items:['keys','lamp']},
    forest: {desc:'You are in a dense forest. Tall trees\nsurround you in every direction.\n\nExits: SOUTH, EAST, NORTH',exits:{south:'start',east:'clearing',north:'darkforest'}},
    darkforest: {desc:'The forest grows darker here. Strange\nsounds echo. A narrow path leads DOWN\ninto a cave.\n\nExits: SOUTH, DOWN',exits:{south:'forest',down:'cave_entrance'}},
    valley: {desc:'You are in a pleasant green valley\nwith a stream. A bridge crosses to\nthe EAST.\n\nExits: WEST, EAST',exits:{west:'start',east:'bridge'}},
    bridge: {desc:'You stand on a wooden bridge. A troll\nblocks the way EAST!\n\nExits: WEST, EAST (blocked)',exits:{west:'valley'},troll:true},
    clearing: {desc:'A sunny clearing. Wild flowers grow\neverywhere. A rusty SWORD lies half-\nburied in the ground.\n\nExits: WEST, SOUTH',exits:{west:'forest',south:'valley'},items:['sword']},
    cave_entrance: {desc:'You are at the entrance to a dark\ncave. It is too dark to see without\na lamp.\n\nExits: UP, IN',exits:{up:'darkforest'},dark:true},
    cave_tunnel: {desc:'A narrow tunnel. The walls glisten\nwith moisture.\n\nExits: SOUTH, NORTH',exits:{south:'cave_entrance',north:'cave_treasure'}},
    cave_treasure: {desc:'A vast chamber filled with glittering\ntreasure! Gold coins and jewels\nsparkle in the lamplight.\n\nCONGRATULATIONS! You found the\ntreasure of Colossal Cave!\n\nType RESTART to play again.',exits:{south:'cave_tunnel'},treasure:true},
    hill: {desc:'You stand atop a grassy hill with a\nbeautiful view of the valley below.\n\nExits: WEST',exits:{west:'bridge'}}
};

function print(text) { const el=document.getElementById('adventure-output'); el.textContent+=text+'\n'; el.scrollTop=el.scrollHeight; }

function look() {
    const room=rooms[adv.room]; print('\n'+room.desc);
    if(room.items) room.items.forEach(function(item){if(adv.inventory.indexOf(item)<0) print('You see: '+item.toUpperCase());});
}

export function advCmd() {
    const input=document.getElementById('adventure-input');const raw=input.value.trim();input.value='';
    if(!raw)return; const cmd=raw.toLowerCase().split(/\s+/);const verb=cmd[0];const noun=cmd[1]||'';
    print('\n> '+raw);
    if(verb==='look'||verb==='l'){look();return;}
    if(verb==='inventory'||verb==='i'){print(adv.inventory.length?'You carry: '+adv.inventory.join(', '):'You carry nothing.');return;}
    if(verb==='restart'){adv.room='start';adv.inventory=[];adv.lamp=false;adv.keys=false;adv.sword=false;rooms.bridge.troll=true;rooms.bridge.exits={west:'valley'};rooms.bridge.desc='You stand on a wooden bridge. A troll\nblocks the way EAST!\n\nExits: WEST, EAST (blocked)';document.getElementById('adventure-output').textContent='';print('ADVENTURE\n(Colossal Cave)\n========================');look();return;}
    if(verb==='help'){print('Commands: LOOK, GO/N/S/E/W/UP/DOWN,\nGET item, USE item, INVENTORY, RESTART');return;}
    if(verb==='get'||verb==='take'){const room=rooms[adv.room];if(room.items&&room.items.indexOf(noun)>=0&&adv.inventory.indexOf(noun)<0){adv.inventory.push(noun);if(noun==='lamp')adv.lamp=true;if(noun==='keys')adv.keys=true;if(noun==='sword')adv.sword=true;print('You pick up the '+noun+'.');}else print('You can\'t take that.');return;}
    if(verb==='use'){if(noun==='sword'&&adv.sword&&rooms[adv.room].troll){print('You brandish the sword! The troll flees!');delete rooms.bridge.troll;rooms.bridge.desc='You stand on a wooden bridge. The\ntroll is gone. Way EAST is clear.\n\nExits: WEST, EAST';rooms.bridge.exits.east='hill';}else print('You can\'t use that here.');return;}
    const dirMap={n:'north',s:'south',e:'east',w:'west',north:'north',south:'south',east:'east',west:'west',up:'up',down:'down',enter:'enter',in:'in',out:'out',exit:'exit',go:noun};
    const dir=dirMap[verb]||(verb==='go'?noun:null);
    if(dir){const room=rooms[adv.room];if(room.troll&&dir==='east'){print('The troll blocks your way!');return;}if(room.exits[dir]){const dest=room.exits[dir];if(rooms[dest]&&rooms[dest].dark&&!adv.lamp&&dir==='in'){print('Too dark! You need a lamp.');return;}if(adv.room==='cave_entrance'&&dir==='in'){if(!adv.lamp){print('Too dark!');return;}adv.room='cave_tunnel';}else adv.room=dest;look();}else print('Can\'t go that way.');}
    else print('I don\'t understand "'+raw+'".');
}

export function toggleAdventure() { toggleWindow('adventure-window'); }

export function initAdventureApp() {
    registerWindow('adventure-window', {
        x: 60, y: 50,
        onOpen: function() {
            adv.room='start';adv.inventory=[];adv.lamp=false;adv.keys=false;adv.sword=false;
            rooms.bridge.troll=true;rooms.bridge.exits={west:'valley'};rooms.bridge.desc='You stand on a wooden bridge. A troll\nblocks the way EAST!\n\nExits: WEST, EAST (blocked)';
            document.getElementById('adventure-output').textContent='';
            print('ADVENTURE\n(Colossal Cave)\n========================\nType HELP for commands.\n');look();
            document.getElementById('adventure-input').focus();
        }
    });
    document.getElementById('adventure-input').addEventListener('keydown', function(e){if(e.key==='Enter')advCmd();});
}
