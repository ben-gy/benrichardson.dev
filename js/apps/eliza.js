// ============ ELIZA ============

import { registerWindow, toggleWindow } from '../window-manager.js';

const keywords = [
    { p: /\bmother|father|family|parent|sister|brother|dad|mom\b/i, r: ['Tell me more about your family.','How does that make you feel about your family?','What else comes to mind when you think of your family?'] },
    { p: /\bi feel\s+(.*)/i, r: ['Why do you feel %1?','Does feeling %1 happen often?','When did you first feel %1?'] },
    { p: /\bi am\s+(.*)/i, r: ['Why do you say you are %1?','How long have you been %1?','Do you enjoy being %1?'] },
    { p: /\bi want\s+(.*)/i, r: ['Why do you want %1?','What would it mean if you got %1?','Suppose you got %1 -- what then?'] },
    { p: /\bi can\'?t\s+(.*)/i, r: ['What makes you think you can\'t %1?','Have you tried to %1?','Perhaps you could %1 if you tried.'] },
    { p: /\byou\s+(.*)/i, r: ['Why are you interested in whether I %1?','Would you prefer if I %1?','Perhaps in your fantasy I %1.'] },
    { p: /\bsad|unhappy|depressed|miserable\b/i, r: ['I\'m sorry to hear that.','Can you tell me what\'s making you feel this way?','Do you often feel this way?'] },
    { p: /\bhappy|glad|joyful|excited|great\b/i, r: ['That\'s wonderful! What\'s making you feel this way?','I\'m glad to hear that. Tell me more.','What has contributed to your happiness?'] },
    { p: /\bcomputer|machine|ai|robot\b/i, r: ['Do computers worry you?','What do you think about machines?','Why do you mention computers?'] },
    { p: /\bdream\b/i, r: ['What does that dream suggest to you?','Do you dream often?','What persons appear in your dreams?'] },
    { p: /\byes\b/i, r: ['You seem quite sure.','I see. Please go on.','I understand. Tell me more.'] },
    { p: /\bno\b/i, r: ['Why not?','Are you saying no just to be negative?','Why does that bother you?'] },
    { p: /\bsorry\b/i, r: ['There\'s no need to apologise.','Apologies are not necessary.','What feelings does apologising bring up?'] },
    { p: /\bhello|hi|hey\b/i, r: ['Hello! How are you feeling today?','Hi there. What\'s on your mind?','Hello. Tell me what\'s been bothering you.'] },
    { p: /\bwhy\b/i, r: ['Why do you ask?','Does that question interest you?','What answer would please you most?'] },
    { p: /\bmaybe|perhaps\b/i, r: ['You don\'t seem very certain.','Why the uncertainty?','Can\'t you be more positive?'] }
];

const fallbacks = ['Please tell me more.','Can you elaborate on that?','How does that make you feel?','Why do you say that?','I see. Please continue.','That is interesting. Please go on.','Tell me more about that.','What does that suggest to you?'];

function reflect(text) {
    const map = {'i':'you','me':'you','my':'your','am':'are','you':'I','your':'my','yours':'mine','are':'am','myself':'yourself','yourself':'myself','i\'m':'you\'re','you\'re':'I\'m','was':'were','were':'was'};
    return text.split(' ').map(function(w) { return map[w.toLowerCase()] || w; }).join(' ');
}

function respond(input) {
    input = input.trim();
    if (!input) return 'Please say something.';
    for (let i = 0; i < keywords.length; i++) {
        const match = input.match(keywords[i].p);
        if (match) {
            const resp = keywords[i].r[Math.floor(Math.random() * keywords[i].r.length)];
            if (match[1]) return resp.replace('%1', reflect(match[1].replace(/[.!?]+$/, '')));
            return resp;
        }
    }
    return fallbacks[Math.floor(Math.random() * fallbacks.length)];
}

function addMsg(text, cls) {
    const output = document.getElementById('eliza-output');
    const div = document.createElement('div');
    div.className = 'eliza-msg ' + cls;
    div.textContent = text;
    output.appendChild(div);
    output.scrollTop = output.scrollHeight;
}

export function elizaSend() {
    const input = document.getElementById('eliza-input');
    const text = input.value.trim();
    if (!text) return;
    addMsg('You: ' + text, 'user');
    addMsg('Eliza: ' + respond(text), 'eliza');
    input.value = ''; input.focus();
}

export function toggleEliza() { toggleWindow('eliza-window'); }

export function initElizaApp() {
    registerWindow('eliza-window', {
        x: 100, y: 80,
        onOpen: function() {
            document.getElementById('eliza-output').innerHTML = '';
            addMsg('Eliza: Hello. I am Eliza. How can I help you today?', 'eliza');
            document.getElementById('eliza-input').value = '';
            document.getElementById('eliza-input').focus();
        }
    });
    document.getElementById('eliza-input').addEventListener('keydown', function(e) { if (e.key === 'Enter') elizaSend(); });
}
