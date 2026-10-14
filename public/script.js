
const form = document.querySelector('#project-form');
const nameInput = document.querySelector('#name');
const statusInput = document.querySelector('#status');
const projectList = document.querySelector('#project-list');
const emptyState = document.querySelector('#empty-state');

const projects = [];

function renderProjects() {
    projectList.textContent = '';

    projects.forEach(function(project) {
        const li = document.createElement('li');
        li.textContent = project.name + ' - ' + project.status;
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
        return;
    }

    const project = {
        id: Date.now() + Math.random(),
        name: name,
        status: status
    };

    projects.push(project);
    renderProjects();

    form.reset();
    nameInput.focus();
});

