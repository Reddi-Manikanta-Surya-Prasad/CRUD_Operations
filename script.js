const userForm = document.getElementById('userForm');
const userList = document.getElementById('userList');

userForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(userForm);
    const userData = {
        name: formData.get('name'),
        email: formData.get('email')
    };

    try {
        if (userForm.dataset.editingId) {
            await updateUser(userForm.dataset.editingId, userData);
            userForm.dataset.editingId = '';
        } else {
            await createUser(userData);
        }
        fetchAndDisplayUsers();
        userForm.reset();
        userForm.querySelector('button[type="submit"]').textContent = 'Create User';
    } catch (error) {
        console.error('Error:', error.message);
    }
});

async function fetchAndDisplayUsers() {
    try {
        const response = await fetch('http://localhost:3000/users');
        if (response.ok) {
            const users = await response.json();
            userList.innerHTML = '';

            users.forEach(user => {
                const userItem = document.createElement('li');
                userItem.innerHTML = `Name: ${user.name}, Email: ${user.email}
                                         <button onclick="editUser(${user.id})">Edit</button>
                                         <button onclick="deleteUser(${user.id})">Delete</button>`;
                userList.appendChild(userItem);
            });
        } else {
            console.error('Failed to fetch users:', response.statusText);
        }
    } catch (error) {
        console.error('Error:', error.message);
    }
}

async function createUser(userData) {
    try {
        const response = await fetch('http://localhost:3000/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });

        if (!response.ok) {
            console.error('Failed to create user:', response.statusText);
        }
    } catch (error) {
        console.error('Error:', error.message);
    }
}

async function editUser(id) {
    try {
        const response = await fetch(`http://localhost:3000/users/${id}`);
        if (response.ok) {
            const userData = await response.json();
            document.getElementById('name').value = userData.name;
            document.getElementById('email').value = userData.email;
            userForm.dataset.editingId = id;
            userForm.querySelector('button[type="submit"]').textContent = 'Update User';
        } else {
            console.error('Failed to fetch user for editing:', response.statusText);
        }
    } catch (error) {
        console.error('Error:', error.message);
    }
}

async function updateUser(id, userData) {
    try {
        const response = await fetch(`http://localhost:3000/users/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });

        if (!response.ok) {
            console.error('Failed to update user:', response.statusText);
        }
    } catch (error) {
        console.error('Error:', error.message);
    }
}

async function deleteUser(id) {
    try {
        const response = await fetch(`http://localhost:3000/users/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            fetchAndDisplayUsers();
        } else {
            console.error('Failed to delete user:', response.statusText);
        }
    } catch (error) {
        console.error('Error:', error.message);
    }
}

fetchAndDisplayUsers();

