
const form = document.querySelector('#project-form');
const nameInput = document.querySelector('#name');
const statusInput = document.querySelector('#status');
const projectList = document.querySelector('#project-list');
const emptyState = document.querySelector('#empty-state');
const saveButton = document.querySelector('#save-button');
const cancelButton = document.querySelector('#cancel-button');
const message = document.querySelector('#message');

let projects = [];
let editingId = null;

function showMessage(text) {
    if (message) {
        message.textContent = text;
    }
}

async function loadProjects() {
    try {
        const response = await fetch('/api/projects');

        if (!response.ok) {
            throw new Error('Could not load projects.');
        }

        projects = await response.json();
        renderProjects();
    } catch (error) {
        showMessage('Could not load projects from the server. Please check that the server is running.');
    }
}

function resetForm() {
    form.reset();
    editingId = null;
    saveButton.textContent = 'Save Project';
    cancelButton.hidden = true;
}

function renderProjects() {
    projectList.textContent = '';

    projects.forEach(function(project) {
        const li = document.createElement('li');
        li.appendChild(document.createTextNode(project.name + ' - ' + project.status + ' '));

        const editButton = document.createElement('button');
        editButton.type = 'button';
        editButton.textContent = 'Edit';

        editButton.addEventListener('click', function() {
            editingId = project.id;
            nameInput.value = project.name;
            statusInput.value = project.status;
            saveButton.textContent = 'Save changes';
            cancelButton.hidden = false;
            showMessage('');
            nameInput.focus();
        });

        li.appendChild(editButton);

        const deleteButton = document.createElement('button');
        deleteButton.type = 'button';
        deleteButton.textContent = 'Delete';

        deleteButton.addEventListener('click', async function() {
            if (!confirm('Are you sure you want to delete "' + project.name + '"?')) {
                return;
            }

            try {
                const response = await fetch('/api/projects/' + project.id, {
                    method: 'DELETE'
                });

                const result = await response.json();

                if (!response.ok) {
                    throw new Error(result.error || 'Could not delete project.');
                }

                if (editingId === project.id) {
                    resetForm();
                }

                await loadProjects();
                showMessage('Project deleted successfully.');
            } catch (error) {
                showMessage(error.message || 'Could not delete project.');
            }
        });

        li.appendChild(deleteButton);
        projectList.appendChild(li);
    });

    if (emptyState) {
        emptyState.hidden = projects.length > 0;
    }
}

form.addEventListener('submit', async function(event) {
    event.preventDefault();

    const name = nameInput.value.trim();
    const status = statusInput.value;

    if (name === '') {
        showMessage('Please enter a project name.');
        nameInput.focus();
        return;
    }

    if (!['Planned', 'In Progress', 'Completed'].includes(status)) {
        showMessage('Please select a valid project status.');
        return;
    }

    const projectData = {
        name: name,
        status: status
    };

    try {
        const isEditing = editingId !== null;
        const url = isEditing
            ? '/api/projects/' + editingId
            : '/api/projects';

        const response = await fetch(url, {
            method: isEditing ? 'PUT' : 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(projectData)
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || 'Could not save project.');
        }

        await loadProjects();
        resetForm();

        showMessage(isEditing
            ? 'Project updated successfully.'
            : 'Project added successfully.');

        nameInput.focus();
    } catch (error) {
        showMessage(error.message || 'Could not save project. Please check the server.');
    }
});

cancelButton.addEventListener('click', function() {
    resetForm();
    showMessage('Edit cancelled.');
    nameInput.focus();
});

loadProjects();
s