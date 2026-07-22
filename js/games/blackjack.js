// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Ben Richardson — https://benrichardson.dev
// Additional terms under AGPL-3.0 section 7(b) apply; see ADDITIONAL-TERMS.md.
// ============ BLACKJACK GAME ============

import { registerWindow, toggleWindow } from '../window-manager.js';

let bj = null;

function initBlackjack() {
    bj = {
        deck: [],
        playerHand: [],
        dealerHand: [],
        gameOver: false,
        playerStood: false,
        wins: 0,
        losses: 0,
        pushes: 0
    };
    createDeck();
    shuffleDeck();
}

function createDeck() {
    bj.deck = [];
    const suits = ['\u2660', '\u2665', '\u2666', '\u2663'];
    const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    for (const suit of suits) {
        for (const value of values) {
            bj.deck.push({ value: value, suit: suit });
        }
    }
}

function shuffleDeck() {
    for (let i = bj.deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [bj.deck[i], bj.deck[j]] = [bj.deck[j], bj.deck[i]];
    }
}

function dealCard(hand) {
    if (bj.deck.length === 0) {
        createDeck();
        shuffleDeck();
    }
    hand.push(bj.deck.pop());
}

function getCardValue(card) {
    if (card.value === 'A') return 11;
    if (['K', 'Q', 'J'].includes(card.value)) return 10;
    return parseInt(card.value);
}

function calculateScore(hand) {
    let score = 0;
    let aces = 0;
    for (const card of hand) {
        score += getCardValue(card);
        if (card.value === 'A') aces++;
    }
    while (score > 21 && aces > 0) {
        score -= 10;
        aces--;
    }
    return score;
}

function formatCard(card) {
    return card.value + card.suit;
}

function formatHand(hand, hideFirst) {
    if (hideFirst && hand.length > 0) {
        return '[?] ' + hand.slice(1).map(formatCard).join(' ');
    }
    return hand.map(formatCard).join(' ');
}

function bjUpdateDisplay(message) {
    let out = '      BLACKJACK\n';
    out += '  ==================\n\n';
    out += '  DEALER: ' + formatHand(bj.dealerHand, !bj.gameOver && !bj.playerStood) + '\n';
    if (bj.gameOver || bj.playerStood) {
        out += '          (' + calculateScore(bj.dealerHand) + ')\n';
    }
    out += '\n';
    out += '  YOU:    ' + formatHand(bj.playerHand, false) + '\n';
    out += '          (' + calculateScore(bj.playerHand) + ')\n\n';
    if (message) {
        out += '  ' + message + '\n\n';
    }
    if (!bj.gameOver) {
        out += '  [Hit] or [Stand]?\n';
    } else {
        out += '  [Deal] for new game\n';
    }
    out += '\n  W:' + bj.wins + ' L:' + bj.losses + ' P:' + bj.pushes;
    document.getElementById('blackjack-output').textContent = out;
}

export function bjNewGame() {
    if (!bj) initBlackjack();
    bj.playerHand = [];
    bj.dealerHand = [];
    bj.gameOver = false;
    bj.playerStood = false;

    if (bj.deck.length < 10) {
        createDeck();
        shuffleDeck();
    }

    dealCard(bj.playerHand);
    dealCard(bj.dealerHand);
    dealCard(bj.playerHand);
    dealCard(bj.dealerHand);

    const playerScore = calculateScore(bj.playerHand);
    const dealerScore = calculateScore(bj.dealerHand);

    if (playerScore === 21 && dealerScore === 21) {
        bj.gameOver = true;
        bj.pushes++;
        bjUpdateDisplay('PUSH! Both have Blackjack!');
    } else if (playerScore === 21) {
        bj.gameOver = true;
        bj.wins++;
        bjUpdateDisplay('BLACKJACK! You win!');
    } else if (dealerScore === 21) {
        bj.gameOver = true;
        bj.losses++;
        bjUpdateDisplay('Dealer has Blackjack!');
    } else {
        bjUpdateDisplay('');
    }
}

export function bjHit() {
    if (!bj || bj.gameOver) return;
    dealCard(bj.playerHand);
    const score = calculateScore(bj.playerHand);
    if (score > 21) {
        bj.gameOver = true;
        bj.losses++;
        bjUpdateDisplay('BUST! You lose.');
    } else if (score === 21) {
        bjStand();
    } else {
        bjUpdateDisplay('');
    }
}

export function bjStand() {
    if (!bj || bj.gameOver) return;
    bj.playerStood = true;

    while (calculateScore(bj.dealerHand) < 17) {
        dealCard(bj.dealerHand);
    }

    const playerScore = calculateScore(bj.playerHand);
    const dealerScore = calculateScore(bj.dealerHand);
    bj.gameOver = true;

    let msg = '';
    if (dealerScore > 21) {
        bj.wins++;
        msg = 'Dealer busts! You win!';
    } else if (playerScore > dealerScore) {
        bj.wins++;
        msg = 'You win!';
    } else if (dealerScore > playerScore) {
        bj.losses++;
        msg = 'Dealer wins.';
    } else {
        bj.pushes++;
        msg = 'Push!';
    }
    bjUpdateDisplay(msg);
}

export function toggleBlackjack() {
    toggleWindow('blackjack-window');
}

export function initBlackjackApp() {
    registerWindow('blackjack-window', {
        x: 80, y: 70,
        onOpen: function() {
            initBlackjack();
            bjNewGame();
        }
    });
}
