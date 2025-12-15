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
		name: "Connaître l'examen",
		description:
			"Analysez le format, le contenu et les attentes via le référentiel ou les consignes officielles pour cibler l'essentiel.",
	},
	{
		idCategory: 2,
		name: 'Évaluer et prioriser',
		description:
			'Identifiez vos forces et faiblesses dans chaque matière, puis listez les sujets prioritaires en fonction de la difficulté et du temps disponible.',
	},
	{
		idCategory: 3,
		name: 'Planifier les révisions',
		description:
			'Créez un calendrier réaliste en répartissant les matières sur les jours restants, avec des créneaux courts (2-3 par jour) et des pauses intégrées.',
	},
	{
		idCategory: 4,
		name: 'Réviser activement',
		description:
			'Utilisez des fiches, cartes mentales, répétition espacée et auto-tests pour mémoriser et reformuler les concepts avec vos mots.',
	},
	{
		idCategory: 5,
		name: "S'entraîner et ajuster",
		description:
			'Simulez des épreuves avec des annales, évaluez vos progrès régulièrement et adaptez le planning tout en maintenant sommeil et bien-être.',
	},
];

// Données persistantes
let subjectList = loadSubjects();
let taskList = loadTasks();

function loadSubjects() {
	let data = localStorage.getItem('interviewSubjects');
	if (data) {
		return JSON.parse(data);
	}
	return [];
}

function saveSubjects() {
	localStorage.setItem('interviewSubjects', JSON.stringify(subjectList));
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

function findSubject(id) {
	for (let i = 0; i < subjectList.length; i++) {
		if (subjectList[i].idSubject === id) {
			return subjectList[i].name;
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

function refreshSubjectSelect() {
	let select = document.getElementById('taskSubject');
	select.innerHTML = '';
	for (let i = 0; i < subjectList.length; i++) {
		let option = document.createElement('option');
		option.value = subjectList[i].idSubject;
		option.textContent = subjectList[i].name;
		select.appendChild(option);
	}
}

function displaySubjects() {
	let list = document.getElementById('subject-list');
	list.innerHTML = '';

	for (let i = 0; i < subjectList.length; i++) {
		let subject = subjectList[i];
		let li = document.createElement('li');
		li.innerHTML = `
			<span>${subject.name}</span>
			<button class="btn-edit" onclick="editSubject(${subject.idSubject})">Modifier</button>
			<button class="btn-delete" onclick="deleteSubject(${subject.idSubject})">Supprimer</button>
		`;
		list.appendChild(li);
	}
}

function handleSubjectForm(event) {
	event.preventDefault();

	let name = document.getElementById('subjectName').value;
	let editId = document.getElementById('editSubjectId').value;

	if (editId !== '') {
		for (let i = 0; i < subjectList.length; i++) {
			if (subjectList[i].idSubject === parseInt(editId)) {
				subjectList[i].name = name;
				break;
			}
		}
		cancelSubjectEdit();
	} else {
		let newId = 1;
		for (let i = 0; i < subjectList.length; i++) {
			if (subjectList[i].idSubject >= newId) {
				newId = subjectList[i].idSubject + 1;
			}
		}

		subjectList.push({ idSubject: newId, name: name });
	}

	saveSubjects();
	displaySubjects();
	refreshSubjectSelect();
	updateTaskSectionsVisibility();
	document.getElementById('subject-form').reset();
}

function editSubject(id) {
	for (let i = 0; i < subjectList.length; i++) {
		if (subjectList[i].idSubject === id) {
			document.getElementById('subjectName').value = subjectList[i].name;
			document.getElementById('editSubjectId').value = id;
			document.getElementById('btn-add-subject').textContent = 'Enregistrer';
			document.getElementById('btn-cancel-subject').style.display =
				'inline-block';
			break;
		}
	}
}

function cancelSubjectEdit() {
	document.getElementById('subject-form').reset();
	document.getElementById('editSubjectId').value = '';
	document.getElementById('btn-add-subject').textContent =
		"Ajouter l'entreprise";
	document.getElementById('btn-cancel-subject').style.display = 'none';
}

function deleteSubject(id) {
	let confirmation = confirm(
		'Voulez-vous vraiment supprimer cette entreprise et toutes ses tâches associées ?'
	);
	if (confirmation) {
		for (let i = 0; i < subjectList.length; i++) {
			if (subjectList[i].idSubject === id) {
				subjectList.splice(i, 1);
				break;
			}
		}
		// Supprimer les tâches associées
		for (let i = taskList.length - 1; i >= 0; i--) {
			if (taskList[i].idSubject === id) {
				taskList.splice(i, 1);
			}
		}
		saveSubjects();
		saveTasks();
		displaySubjects();
		refreshSubjectSelect();
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
			<td data-label="Terminée"><input type="checkbox" ${checkedAttr} onchange="toggleCompleted(${
			task.idTask
		})"></td>
			<td data-label="ID">${task.idTask}</td>
			<td data-label="Nom">${task.title}</td>
			<td data-label="Description">${task.description}</td>
			<td data-label="Catégorie">${findCategory(task.idCategory)}</td>
			<td data-label="Matière">${findSubject(task.idSubject)}</td>
			<td data-label="Date limite">${formatDate(task.deadline)}</td>
			<td data-label="Urgence"><span class="urgency-badge" style="background-color: ${
				urgencyInfo.color
			}">${urgencyInfo.urgency}</span></td>
			<td data-label="Actions">
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
	let idSubject = document.getElementById('taskSubject').value;
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
				taskList[i].idSubject = parseInt(idSubject);
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
			idSubject: parseInt(idSubject),
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
			document.getElementById('taskSubject').value = task.idSubject;
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
	document.getElementById('no-subject-message').style.display = 'none';
}

function hideTaskSections() {
	document.getElementById('form-section').style.display = 'none';
	document.getElementById('sort-section').style.display = 'none';
	document.getElementById('table-section').style.display = 'none';
	document.getElementById('no-subject-message').style.display = 'block';
}

function updateTaskSectionsVisibility() {
	if (subjectList.length > 0) {
		showTaskSections();
		displayTasks(taskList);
	} else {
		hideTaskSections();
	}
}

// Initialisation
document.addEventListener('DOMContentLoaded', function () {
	document
		.getElementById('subject-form')
		.addEventListener('submit', handleSubjectForm);
	document
		.getElementById('btn-cancel-subject')
		.addEventListener('click', cancelSubjectEdit);
	document.getElementById('task-form').addEventListener('submit', handleForm);
	document.getElementById('btn-cancel').addEventListener('click', cancelEdit);
	document.getElementById('sort').addEventListener('change', function () {
		sortTasks(this.value);
	});

	displaySubjects();
	displayCategories();
	refreshSubjectSelect();
	refreshCategorySelect();
	updateTaskSectionsVisibility();
});
