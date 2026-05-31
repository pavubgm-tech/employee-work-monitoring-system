const API_URL = 'http://localhost:5000';

async function registerUser() {

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const response = await fetch(`${API_URL}/register`, {

        method: 'POST',

        headers: {
            'Content-Type': 'application/json'
        },

        body: JSON.stringify({
            username,
            password
        })

    });

    const data = await response.text();

    alert(data);

    if(data === 'User Registered Successfully') {

        window.location.href = 'login.html';

    }

}

async function loginUser() {

    const username = document.getElementById('loginUsername').value;

    const password = document.getElementById('loginPassword').value;

    const response = await fetch(`${API_URL}/login`, {

        method: 'POST',

        headers: {
            'Content-Type': 'application/json'
        },

        body: JSON.stringify({
            username,
            password
        })

    });

    const data = await response.json();

    alert(data.message);

    localStorage.setItem('username', username);

    if(data.role === 'host') {

        window.location.href = 'dashboard.html';

    }

    else if(data.role === 'user') {

        window.location.href = 'user-dashboard.html';

    }

}

function logoutUser() {

    const confirmLogout = confirm('Are you sure you want to logout?');

    if(confirmLogout){
        window.location.href = 'login.html';
    }

}

async function fetchLogs() {

    const response = await fetch(`${API_URL}/logs`);

    const data = await response.json();

    let rows = '';

    data.forEach(log => {

        rows += `
            <tr>
                <td>${log.id}</td>
                <td>${log.username}</td>
                <td>${log.activity}</td>
                <td>${log.created_at}</td>

                <td>
                    <button onclick="deleteLog(${log.id})">
                        Delete
                    </button>
                </td>

            </tr>
        `;

    });

    const table = document.getElementById('logsTable');

    if(table){

        table.innerHTML = rows;

    }

}

async function deleteLog(id) {

    const response = await fetch(`${API_URL}/delete-log/${id}`, {

        method: 'DELETE'

    });

    const data = await response.text();

    alert(data);

    fetchLogs();

}

async function searchLogs() {

    const username = document.getElementById('searchInput').value;

    const response = await fetch(`${API_URL}/search-logs/${username}`);

    const data = await response.json();

    let rows = '';

    data.forEach(log => {

        rows += `
            <tr>
                <td>${log.id}</td>
                <td>${log.username}</td>
                <td>${log.activity}</td>
                <td>${log.created_at}</td>

                <td>
                    <button onclick="deleteLog(${log.id})">
                        Delete
                    </button>
                </td>

            </tr>
        `;

    });

    document.getElementById('logsTable').innerHTML = rows;

}

async function fetchStats() {

    const response = await fetch(`${API_URL}/stats`);

    const data = await response.json();

    const totalLogs = document.getElementById('totalLogs');
    const failedLogins = document.getElementById('failedLogins');
    const totalUsers = document.getElementById('totalUsers');

    if(totalLogs){
        totalLogs.innerText = data.totalLogs;
    }

    if(failedLogins){
        failedLogins.innerText = data.failedLogins;
    }

    if(totalUsers){
        totalUsers.innerText = data.totalUsers;
    }

}

function refreshDashboard() {

    fetchLogs();

    fetchStats();

    fetchAllNotes();

}

refreshDashboard();

setInterval(refreshDashboard, 5000);

async function saveNote() {

    const username = localStorage.getItem('username');

    const note = document.getElementById('noteInput').value;

    const response = await fetch(`${API_URL}/save-note`, {

        method: 'POST',

        headers: {
            'Content-Type': 'application/json'
        },

        body: JSON.stringify({
            username,
            note
        })

    });

    const data = await response.text();

    alert(data);

    loadNotes();

}

async function loadNotes() {

    const username = localStorage.getItem('username');

    const response = await fetch(`${API_URL}/notes/${username}`);

    const data = await response.json();

    let notesHTML = '';

    data.forEach(item => {

        notesHTML += `
            <div class="card">
                <p>${item.note}</p>
                <small>${item.created_at}</small>
            </div>
        `;

    });

    const container = document.getElementById('notesContainer');

    if(container){

        container.innerHTML = notesHTML;

    }

}

loadNotes();

async function fetchAllNotes() {

    const response = await fetch(`${API_URL}/all-notes`);

    const data = await response.json();

    let rows = '';

    data.forEach(note => {

        rows += `
            <tr>
                <td>${note.id}</td>
                <td>${note.username}</td>
                <td>${note.note}</td>
                <td>${note.created_at}</td>
            </tr>
        `;

    });

    const table = document.getElementById('notesTable');

    if(table){

        table.innerHTML = rows;

    }

}