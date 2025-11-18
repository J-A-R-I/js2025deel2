// Import our custom CSS
import '../scss/styles.scss'

// Import all of Bootstrap’s JS
import * as bootstrap from 'bootstrap'

import User from './utils/userModel.js';
import { createUserCard } from './components/userCard.js';

const users = [];


const nameInput = document.getElementById('ex4_name');
const ageInput = document.getElementById('ex4_age');
const submitButton = document.getElementById('ex4_btn');
const userListElement = document.getElementById('ex4_list');
const statusElement = document.getElementById('ex4_status');


function validateInput(name, ageStr) {
    if (!name.trim()) {
        return { isValid: false, message: 'Naam mag niet leeg zijn.' };
    }

    const age = parseInt(ageStr, 10);

    if (isNaN(age) || age <= 0) {
        return { isValid: false, message: 'Leeftijd moet een positief getal zijn.' };
    }

    return { isValid: true, message: '' };
}

function updateStatus() {
    statusElement.classList.remove('alert-secondary', 'alert-success', 'alert-danger');

    if (users.length === 0) {
        statusElement.textContent = 'Nog geen gebruikers toegevoegd.';
        statusElement.classList.add('alert-secondary');
    } else {
        statusElement.textContent = `${users.length} gebruiker(s) succesvol toegevoegd aan de lijst!`;
        statusElement.classList.add('alert-success');
    }
}


function renderUserList() {
    const userCardsHtml = users.map(user => createUserCard(user)).join('');

    userListElement.innerHTML = userCardsHtml;

    updateStatus();
}

function handleSubmit() {

    const name = nameInput.value.trim();
    const ageStr = ageInput.value.trim();


    const validation = validateInput(name, ageStr);

    if (!validation.isValid) {

        alert(`Validatiefout:\n${validation.message}`);
        return;
    }

    const newUser = new User(name, parseInt(ageStr, 10));

    users.push(newUser);

    renderUserList();

    nameInput.value = '';
    ageInput.value = '';
    nameInput.focus();
}

submitButton.addEventListener('click', handleSubmit);

document.addEventListener('DOMContentLoaded', updateStatus);