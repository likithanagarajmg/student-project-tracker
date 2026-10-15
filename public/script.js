const form = document.querySelector('#project-form');
const nameInput = document.querySelector('#name');
const statusInput = document.querySelector('#status');
const projectList = document.querySelector('#project-list');
const emptyState = document.querySelector('#empty-state');
const saveButton = document.querySelector('#save-button');
const cancelButton = document.querySelector('#cancel-button');
const message = document.querySelector('#message');

const storageKey = 'workshop-projects-v1';
let projects = [];
let editingId = null;
let storageReady = true;

function showMessage(text) {
    if (message) {
        message.textContent = text;
    }
}

function loadProjects() {
    try {
        const savedData = localStorage.getItem(storageKey);

        if (savedData === null) {
            projects = [];
            return;
        }

        const savedProjects = JSON.parse(savedData);

        if (!Array.isArray(savedProjects)) {
            throw new Error('Invalid saved data');
        }

        const ids = new Set();

        for (const project of savedProjects) {
            if (
                !project ||
                typeof project !== 'object' ||
                !['string', 'number'].includes(typeof project.id) ||
                (typeof project.id === 'string' && project.id.trim() === '') ||
                (typeof project.id === 'number' && !Number.isFinite(project.id)) ||
                typeof project.name !== 'string' ||
                project.name.trim() === '' ||
                !['Planned', 'In Progress', 'Completed'].includes(project.status)
            ) {
                throw new Error('Invalid project');
            }

            const idKey = typeof project.id + ':' + project.id;

            if (ids.has(idKey)) {
                throw new Error('Duplicate project ID');
            }

            ids.add(idKey);
        }

        projects = savedProjects;
    } catch (error) {
        storageReady = false;
        showMessage('Saved data could not be loaded safely. Existing data has not been overwritten.');
    }
}

function saveProjects() {
    if (!storageReady) {
        showMessage('Changes could not be saved because saved data could not be loaded safely.');
        return false;
    }

    try {
        localStorage.setItem(storageKey, JSON.stringify(projects));
        return true;
    } catch (error) {
        showMessage('Changes could not be saved to browser storage.');
        return false;
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

        deleteButton.addEventListener('click', function() {
            if (!confirm('Are you sure you want to delete "' + project.name + '"?')) {
                return;
            }

            const index = projects.findIndex(function(item) {
                return item.id === project.id;
            });

            if (index === -1) {
                return;
            }

            const deletedProject = projects[index];
            projects.splice(index, 1);

            if (editingId === deletedProject.id) {
                resetForm();
            }

            if (saveProjects()) {
                renderProjects();
                showMessage('Project deleted and saved.');
            } else {
                projects.splice(index, 0, deletedProject);
                renderProjects();
            }
        });

        li.appendChild(deleteButton);
        projectList.appendChild(li);
    });

    if (emptyState) {
        emptyState.hidden = projects.length > 0;
    }
}

form.addEventListener('submit', function(event) {
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

    if (editingId !== null) {
        const project = projects.find(function(item) {
            return item.id === editingId;
        });

        if (!project) {
            resetForm();
            showMessage('Project not found. Please try again.');
            return;
        }

        const oldName = project.name;
        const oldStatus = project.status;

        project.name = name;
        project.status = status;

        if (saveProjects()) {
            renderProjects();
            showMessage('Project updated and saved.');
            resetForm();
        } else {
            project.name = oldName;
            project.status = oldStatus;
            renderProjects();
        }
    } else {
        const project = {
            id: Date.now() + Math.random(),
            name: name,
            status: status
        };

        projects.push(project);

        if (saveProjects()) {
            renderProjects();
            showMessage('Project added and saved.');
            resetForm();
        } else {
            projects.pop();
            renderProjects();
        }
    }

    nameInput.focus();
});

cancelButton.addEventListener('click', function() {
    resetForm();
    showMessage('Edit cancelled.');
    nameInput.focus();
});

loadProjects();
renderProjects();