// Niveaux d'urgence avec code couleur (calculés automatiquement)
let urgencies = [
	{ idUrgency: 1, urgency: 'Peu urgent', color: '#4CAF50' },
	{ idUrgency: 2, urgency: 'Modéré', color: '#FFC107' },
	{ idUrgency: 3, urgency: 'Urgent', color: '#FF9800' },
	{ idUrgency: 4, urgency: 'Très urgent', color: '#F44336' },
];

// Catégories de préparation
let categories = [
	{
		idCategory: 1,
		name: 'Recherches entreprise',
		description:
			"Effectuer des recherches sur l'entreprise. Mettez toutes les chances de votre côté, connaissez la culture de votre entreprise.",
	},
	{
		idCategory: 2,
		name: 'Analyse du poste',
		description:
			'Analysez la description de poste. Faites un tableau de comparaison entre vos compétences et celles requises par le poste.',
	},
	{
		idCategory: 3,
		name: 'Questions à poser',
		description:
			'Préparez des questions à poser. Préparez deux questions au minimum à poser à vos recruteurs.',
	},
	{
		idCategory: 4,
		name: 'Objectifs et compétences',
		description:
			'Ayez une vision claire de vos objectifs et de vos compétences. Faites coïncider votre parcours professionnel avec le poste proposé.',
	},
	{
		idCategory: 5,
		name: 'Questions pièges',
		description:
			'Anticipez les questions pièges. Recherchez 20 questions pièges.',
	},
	{
		idCategory: 6,
		name: 'Point de vue recruteur',
		description:
			"Mettez-vous à la place du recruteur. Préparez 10 questions qu'il pourrait vous poser.",
	},
	{
		idCategory: 7,
		name: 'Entretien idéal',
		description:
			"Imaginez mentalement votre entretien idéal. Faites un plan du déroulement possible de l'entretien.",
	},
	{
		idCategory: 8,
		name: 'Répétition',
		description:
			"Répétez en demandant un coup de pouce à votre entourage. Demandez à la personne qui vous teste d'être impitoyable.",
	},
	{
		idCategory: 9,
		name: 'Détails pratiques',
		description:
			"Planifiez les détails pratiques à l'avance. Faites une check-liste de ce dont vous aurez besoin pour l'entretien.",
	},
	{
		idCategory: 10,
		name: 'Notes',
		description:
			"Rédigez des notes sur un carnet ou votre smartphone. Prenez des notes pour garder sous les yeux l'essentiel des éléments de votre préparation.",
	},
];

// Données persistantes
let companyList = loadCompanies();
let taskList = loadTasks();

function loadCompanies() {
	let data = localStorage.getItem('interviewCompanies');
	if (data) {
		return JSON.parse(data);
	}
	return [];
}

function saveCompanies() {
	localStorage.setItem('interviewCompanies', JSON.stringify(companyList));
}

function loadTasks() {
	let data = localStorage.getItem('interviewTasks');
	if (data) {
		return JSON.parse(data);
	}
	return [];
}

function saveTasks() {
	localStorage.setItem('interviewTasks', JSON.stringify(taskList));
}

function findCompany(id) {
	for (let i = 0; i < companyList.length; i++) {
		if (companyList[i].idCompany === id) {
			return companyList[i].name;
		}
	}
	return 'Inconnue';
}

function findUrgency(id) {
	for (let i = 0; i < urgencies.length; i++) {
		if (urgencies[i].idUrgency === id) {
			return urgencies[i];
		}
	}
	return { urgency: 'Inconnue', color: '#999' };
}

function findCategory(id) {
	for (let i = 0; i < categories.length; i++) {
		if (categories[i].idCategory === id) {
			return categories[i].name;
		}
	}
	return 'Non catégorisée';
}

function displayCategories() {
	let list = document.getElementById('category-list');
	list.innerHTML = '';

	for (let i = 0; i < categories.length; i++) {
		let cat = categories[i];
		let li = document.createElement('li');
		li.innerHTML = `<strong>${cat.idCategory}. ${cat.name}</strong><p>${cat.description}</p>`;
		list.appendChild(li);
	}
}

function refreshCategorySelect() {
	let select = document.getElementById('taskCategory');
	select.innerHTML = '';
	for (let i = 0; i < categories.length; i++) {
		let option = document.createElement('option');
		option.value = categories[i].idCategory;
		option.textContent = categories[i].name;
		select.appendChild(option);
	}
}

function calculateUrgencyFromDeadline(deadline) {
	let today = new Date();
	today.setHours(0, 0, 0, 0);
	let deadlineDate = new Date(deadline);
	let diffTime = deadlineDate - today;
	let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

	if (diffDays <= 2) return 4;
	if (diffDays <= 4) return 3;
	if (diffDays <= 6) return 2;
	return 1;
}

function formatDate(dateStr) {
	let date = new Date(dateStr);
	return date.toLocaleDateString('fr-FR', {
		day: 'numeric',
		month: 'long',
		year: 'numeric',
	});
}

function refreshCompanySelect() {
	let select = document.getElementById('taskCompany');
	select.innerHTML = '';
	for (let i = 0; i < companyList.length; i++) {
		let option = document.createElement('option');
		option.value = companyList[i].idCompany;
		option.textContent = companyList[i].name;
		select.appendChild(option);
	}
}

function displayCompanies() {
	let list = document.getElementById('company-list');
	list.innerHTML = '';

	for (let i = 0; i < companyList.length; i++) {
		let company = companyList[i];
		let li = document.createElement('li');
		li.innerHTML = `
			<span>${company.name}</span>
			<button class="btn-edit" onclick="editCompany(${company.idCompany})">Modifier</button>
			<button class="btn-delete" onclick="deleteCompany(${company.idCompany})">Supprimer</button>
		`;
		list.appendChild(li);
	}
}

function handleCompanyForm(event) {
	event.preventDefault();

	let name = document.getElementById('companyName').value;
	let editId = document.getElementById('editCompanyId').value;

	if (editId !== '') {
		for (let i = 0; i < companyList.length; i++) {
			if (companyList[i].idCompany === parseInt(editId)) {
				companyList[i].name = name;
				break;
			}
		}
		cancelCompanyEdit();
	} else {
		let newId = 1;
		for (let i = 0; i < companyList.length; i++) {
			if (companyList[i].idCompany >= newId) {
				newId = companyList[i].idCompany + 1;
			}
		}

		companyList.push({ idCompany: newId, name: name });
	}

	saveCompanies();
	displayCompanies();
	refreshCompanySelect();
	updateTaskSectionsVisibility();
	document.getElementById('company-form').reset();
}

function editCompany(id) {
	for (let i = 0; i < companyList.length; i++) {
		if (companyList[i].idCompany === id) {
			document.getElementById('companyName').value = companyList[i].name;
			document.getElementById('editCompanyId').value = id;
			document.getElementById('btn-add-company').textContent = 'Enregistrer';
			document.getElementById('btn-cancel-company').style.display =
				'inline-block';
			break;
		}
	}
}

function cancelCompanyEdit() {
	document.getElementById('company-form').reset();
	document.getElementById('editCompanyId').value = '';
	document.getElementById('btn-add-company').textContent =
		"Ajouter l'entreprise";
	document.getElementById('btn-cancel-company').style.display = 'none';
}

function deleteCompany(id) {
	let confirmation = confirm(
		'Voulez-vous vraiment supprimer cette entreprise et toutes ses tâches associées ?'
	);
	if (confirmation) {
		for (let i = 0; i < companyList.length; i++) {
			if (companyList[i].idCompany === id) {
				companyList.splice(i, 1);
				break;
			}
		}
		// Supprimer les tâches associées
		for (let i = taskList.length - 1; i >= 0; i--) {
			if (taskList[i].idCompany === id) {
				taskList.splice(i, 1);
			}
		}
		saveCompanies();
		saveTasks();
		displayCompanies();
		refreshCompanySelect();
		updateTaskSectionsVisibility();
	}
}

function displayTasks(tasks) {
	let tableBody = document.getElementById('table-body');
	tableBody.innerHTML = '';

	for (let i = 0; i < tasks.length; i++) {
		let task = tasks[i];
		let urgencyId = calculateUrgencyFromDeadline(task.deadline);
		let urgencyInfo = findUrgency(urgencyId);
		let row = document.createElement('tr');

		let completedClass = task.completed ? 'task-completed' : '';
		let checkedAttr = task.completed ? 'checked' : '';

		row.className = completedClass;
		row.innerHTML = `
			<td><input type="checkbox" ${checkedAttr} onchange="toggleCompleted(${
			task.idTask
		})"></td>
			<td>${task.idTask}</td>
			<td>${task.title}</td>
			<td>${task.description}</td>
			<td>${findCategory(task.idCategory)}</td>
			<td>${findCompany(task.idCompany)}</td>
			<td>${formatDate(task.deadline)}</td>
			<td><span class="urgency-badge" style="background-color: ${
				urgencyInfo.color
			}">${urgencyInfo.urgency}</span></td>
			<td>
				<button class="btn-edit" onclick="editTask(${task.idTask})">Modifier</button>
				<button class="btn-delete" onclick="deleteTask(${
					task.idTask
				})">Supprimer</button>
			</td>
		`;
		tableBody.appendChild(row);
	}
}

function sortTasks(criteria) {
	let sortedTasks = taskList.slice();
	sortedTasks.sort(function (a, b) {
		return a.idTask - b.idTask;
	});
	displayTasks(sortedTasks);
}

function validateDeadline(deadline) {
	let today = new Date();
	today.setHours(0, 0, 0, 0);
	let deadlineDate = new Date(deadline);

	if (deadlineDate < today) {
		alert('La date limite ne peut pas être dans le passé.');
		return false;
	}
	return true;
}

function handleForm(event) {
	event.preventDefault();

	let title = document.getElementById('title').value;
	let description = document.getElementById('description').value;
	let idCategory = document.getElementById('taskCategory').value;
	let idCompany = document.getElementById('taskCompany').value;
	let deadline = document.getElementById('deadline').value;
	let editId = document.getElementById('editTaskId').value;

	if (!validateDeadline(deadline)) {
		return;
	}

	if (editId !== '') {
		for (let i = 0; i < taskList.length; i++) {
			if (taskList[i].idTask === parseInt(editId)) {
				taskList[i].title = title;
				taskList[i].description = description;
				taskList[i].idCategory = parseInt(idCategory);
				taskList[i].idCompany = parseInt(idCompany);
				taskList[i].deadline = deadline;
				break;
			}
		}
		cancelEdit();
	} else {
		let newId = 1;
		for (let i = 0; i < taskList.length; i++) {
			if (taskList[i].idTask >= newId) {
				newId = taskList[i].idTask + 1;
			}
		}

		let newTask = {
			idTask: newId,
			title: title,
			description: description,
			idCategory: parseInt(idCategory),
			idCompany: parseInt(idCompany),
			deadline: deadline,
			completed: false,
		};

		taskList.push(newTask);
	}

	saveTasks();
	displayTasks(taskList);
	document.getElementById('task-form').reset();
}

function editTask(id) {
	for (let i = 0; i < taskList.length; i++) {
		if (taskList[i].idTask === id) {
			let task = taskList[i];
			document.getElementById('title').value = task.title;
			document.getElementById('description').value = task.description;
			document.getElementById('taskCategory').value = task.idCategory;
			document.getElementById('taskCompany').value = task.idCompany;
			document.getElementById('deadline').value = task.deadline;
			document.getElementById('editTaskId').value = id;
			document.getElementById('form-title').textContent = 'Modifier la tâche';
			document.getElementById('btn-add').textContent = 'Enregistrer';
			document.getElementById('btn-cancel').style.display = 'inline-block';
			document.getElementById('form-section').scrollIntoView();
			break;
		}
	}
}

function toggleCompleted(id) {
	for (let i = 0; i < taskList.length; i++) {
		if (taskList[i].idTask === id) {
			taskList[i].completed = !taskList[i].completed;
			break;
		}
	}
	saveTasks();
	displayTasks(taskList);
}

function cancelEdit() {
	document.getElementById('task-form').reset();
	document.getElementById('editTaskId').value = '';
	document.getElementById('form-title').textContent = 'Ajouter une tâche';
	document.getElementById('btn-add').textContent = 'Ajouter la tâche';
	document.getElementById('btn-cancel').style.display = 'none';
}

function deleteTask(id) {
	let confirmation = confirm('Voulez-vous vraiment supprimer cette tâche ?');
	if (confirmation) {
		for (let i = 0; i < taskList.length; i++) {
			if (taskList[i].idTask === id) {
				taskList.splice(i, 1);
				break;
			}
		}
		saveTasks();
		displayTasks(taskList);
	}
}

function showTaskSections() {
	document.getElementById('form-section').style.display = 'block';
	document.getElementById('sort-section').style.display = 'flex';
	document.getElementById('table-section').style.display = 'block';
	document.getElementById('no-company-message').style.display = 'none';
}

function hideTaskSections() {
	document.getElementById('form-section').style.display = 'none';
	document.getElementById('sort-section').style.display = 'none';
	document.getElementById('table-section').style.display = 'none';
	document.getElementById('no-company-message').style.display = 'block';
}

function updateTaskSectionsVisibility() {
	if (companyList.length > 0) {
		showTaskSections();
		displayTasks(taskList);
	} else {
		hideTaskSections();
	}
}

// Initialisation
document.addEventListener('DOMContentLoaded', function () {
	document
		.getElementById('company-form')
		.addEventListener('submit', handleCompanyForm);
	document
		.getElementById('btn-cancel-company')
		.addEventListener('click', cancelCompanyEdit);
	document.getElementById('task-form').addEventListener('submit', handleForm);
	document.getElementById('btn-cancel').addEventListener('click', cancelEdit);
	document.getElementById('sort').addEventListener('change', function () {
		sortTasks(this.value);
	});

	displayCompanies();
	displayCategories();
	refreshCompanySelect();
	refreshCategorySelect();
	updateTaskSectionsVisibility();
});
