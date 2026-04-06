// ============ HAMURABI GAME ============

import { registerWindow, toggleWindow } from '../window-manager.js';

let ham = null;

function initHamurabi() {
    ham = {
        year: 1,
        population: 100,
        acres: 1000,
        bushels: 2800,
        harvest: 3,
        rats: 200,
        landPrice: 17 + Math.floor(Math.random() * 10),
        starved: 0,
        immigrants: 5,
        totalStarved: 0,
        totalYears: 0,
        phase: 'buy',
        fed: 0,
        planted: 0,
        plague: false,
        gameOver: false
    };
}

function hamUpdateDisplay(message) {
    const out = document.getElementById('hamurabi-output');
    const label = document.getElementById('hamurabi-label');
    let text = '      HAMURABI\n';
    text += '==================\n';

    if (ham.gameOver) {
        out.textContent = text + message;
        label.textContent = '';
        document.getElementById('hamurabi-input').style.display = 'none';
        return;
    }

    if (ham.year === 1 && ham.phase === 'buy') {
        text += 'YEAR 1 OF YOUR REIGN\n\n';
        text += 'POPULATION: ' + ham.population + '\n';
        text += 'ACRES: ' + ham.acres + '\n';
        text += 'BUSHELS: ' + ham.bushels + '\n\n';
    } else {
        text += 'YEAR ' + ham.year + ' OF YOUR REIGN\n\n';
        text += 'IN THE PREVIOUS YEAR:\n';
        text += '  ' + ham.starved + ' PEOPLE STARVED\n';
        text += '  ' + ham.immigrants + ' CAME TO THE CITY\n';
        if (ham.plague) {
            text += '  A PLAGUE KILLED HALF!\n';
        }
        text += '  HARVEST: ' + ham.harvest + ' BU/ACRE\n';
        text += '  RATS ATE: ' + ham.rats + ' BUSHELS\n\n';
        text += 'POPULATION: ' + ham.population + '\n';
        text += 'ACRES: ' + ham.acres + '\n';
        text += 'BUSHELS: ' + ham.bushels + '\n\n';
    }

    if (message) {
        text += message + '\n\n';
    }

    document.getElementById('hamurabi-input').style.display = '';

    if (ham.phase === 'buy') {
        text += 'LAND IS ' + ham.landPrice + ' BU/ACRE\n';
        text += 'HOW MANY ACRES TO BUY?\n';
        text += '(NEGATIVE TO SELL)';
        label.textContent = 'ACRES:';
    } else if (ham.phase === 'feed') {
        text += 'HOW MANY BUSHELS TO\n';
        text += 'FEED YOUR PEOPLE?';
        label.textContent = 'BUSHELS:';
    } else if (ham.phase === 'plant') {
        text += 'HOW MANY ACRES TO PLANT?';
        label.textContent = 'ACRES:';
    }

    out.textContent = text;
    out.scrollTop = out.scrollHeight;
}

export function hamSubmit() {
    if (ham.gameOver) {
        initHamurabi();
        hamUpdateDisplay();
        document.getElementById('hamurabi-input').value = '';
        return;
    }

    const input = document.getElementById('hamurabi-input');
    const val = parseInt(input.value) || 0;
    input.value = '';

    if (ham.phase === 'buy') {
        if (val > 0) {
            const cost = val * ham.landPrice;
            if (cost > ham.bushels) {
                hamUpdateDisplay('NOT ENOUGH GRAIN!');
                return;
            }
            ham.acres += val;
            ham.bushels -= cost;
        } else if (val < 0) {
            const sell = Math.abs(val);
            if (sell > ham.acres) {
                hamUpdateDisplay('NOT ENOUGH LAND!');
                return;
            }
            ham.acres -= sell;
            ham.bushels += sell * ham.landPrice;
        }
        ham.phase = 'feed';
        hamUpdateDisplay();
    } else if (ham.phase === 'feed') {
        if (val < 0) {
            hamUpdateDisplay('INVALID AMOUNT!');
            return;
        }
        if (val > ham.bushels) {
            hamUpdateDisplay('NOT ENOUGH GRAIN!');
            return;
        }
        ham.fed = val;
        ham.bushels -= val;
        ham.phase = 'plant';
        hamUpdateDisplay();
    } else if (ham.phase === 'plant') {
        if (val < 0) {
            hamUpdateDisplay('INVALID AMOUNT!');
            return;
        }
        if (val > ham.acres) {
            hamUpdateDisplay('NOT ENOUGH LAND!');
            return;
        }
        if (val > ham.bushels) {
            hamUpdateDisplay('NOT ENOUGH SEED!');
            return;
        }
        if (val > ham.population * 10) {
            hamUpdateDisplay('NOT ENOUGH WORKERS!\n(EACH CAN FARM 10 ACRES)');
            return;
        }
        ham.planted = val;
        ham.bushels -= val;
        hamEndYear();
    }
}

function hamEndYear() {
    ham.harvest = 1 + Math.floor(Math.random() * 6);
    const harvested = ham.planted * ham.harvest;
    ham.bushels += harvested;

    if (Math.random() < 0.4) {
        ham.rats = Math.floor(ham.bushels * (Math.random() * 0.3));
        ham.bushels -= ham.rats;
    } else {
        ham.rats = 0;
    }

    const peopleFed = Math.floor(ham.fed / 20);
    ham.starved = Math.max(0, ham.population - peopleFed);
    ham.totalStarved += ham.starved;
    ham.totalYears++;

    if (ham.starved > ham.population * 0.45) {
        ham.gameOver = true;
        hamUpdateDisplay('YOU STARVED ' + ham.starved + ' PEOPLE!\n\nDUE TO EXTREME MISMANAGEMENT\nYOU HAVE BEEN IMPEACHED AND\nTHROWN OUT OF OFFICE!\n\n[CLICK OK TO PLAY AGAIN]');
        return;
    }

    ham.population -= ham.starved;

    ham.plague = Math.random() < 0.15;
    if (ham.plague) {
        ham.population = Math.floor(ham.population / 2);
    }

    ham.immigrants = Math.floor(Math.random() * (20 * ham.acres + ham.bushels) / ham.population / 100 + 1);
    ham.immigrants = Math.min(ham.immigrants, 50);
    ham.population += ham.immigrants;

    ham.year++;
    ham.landPrice = 17 + Math.floor(Math.random() * 10);
    ham.phase = 'buy';

    if (ham.year > 10) {
        hamFinalScore();
        return;
    }

    hamUpdateDisplay();
}

function hamFinalScore() {
    ham.gameOver = true;
    const avgStarved = ham.totalStarved / ham.totalYears;
    const landPerPerson = ham.acres / ham.population;

    let text = 'AFTER 10 YEARS YOUR REIGN\n';
    text += 'HAS COME TO AN END.\n\n';
    text += 'POPULATION: ' + ham.population + '\n';
    text += 'ACRES: ' + ham.acres + '\n';
    text += 'BUSHELS: ' + ham.bushels + '\n\n';
    text += 'AVG STARVED/YEAR: ' + avgStarved.toFixed(1) + '\n';
    text += 'ACRES/PERSON: ' + landPerPerson.toFixed(1) + '\n\n';

    if (avgStarved > 33 || landPerPerson < 7) {
        text += 'HEAVY TAXES AND FAMINE\n';
        text += 'MARKED YOUR CRUEL REIGN.\n';
        text += 'THE PEOPLE CHEER AS YOU\n';
        text += 'ARE DRAGGED THROUGH THE\n';
        text += 'STREETS!';
    } else if (avgStarved > 10 || landPerPerson < 9) {
        text += 'YOUR HEAVY-HANDED METHODS\n';
        text += 'CAUSED MUCH DISCONTENT.\n';
        text += 'YOUR MEMORY WILL BE CURSED.';
    } else if (avgStarved > 3 || landPerPerson < 10) {
        text += 'YOUR ADMINISTRATION WAS\n';
        text += 'ADEQUATE. FEW WOULD HAVE\n';
        text += 'DONE BETTER.';
    } else {
        text += 'A FANTASTIC PERFORMANCE!\n';
        text += 'CHARLEMAGNE, DISRAELI, AND\n';
        text += 'JEFFERSON COULD NOT HAVE\n';
        text += 'DONE BETTER!';
    }

    text += '\n\n[CLICK OK TO PLAY AGAIN]';
    hamUpdateDisplay(text);
}

export function toggleHamurabi() {
    toggleWindow('hamurabi-window');
}

export function initHamurabiApp() {
    registerWindow('hamurabi-window', {
        x: 120, y: 60,
        onOpen: function() {
            initHamurabi();
            hamUpdateDisplay();
            document.getElementById('hamurabi-input').value = '';
            document.getElementById('hamurabi-input').focus();
        }
    });

    document.getElementById('hamurabi-input').addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            hamSubmit();
        }
    });
}
