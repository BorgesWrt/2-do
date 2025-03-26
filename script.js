document.addEventListener('DOMContentLoaded', function () {
  const taskInput = document.getElementById('taskInput');
  const addTaskBtn = document.getElementById('addTaskBtn');
  const taskList = document.getElementById('taskList');

  // Загрузка задач из LocalStorage
  let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

  // Функция для сохранения задач в LocalStorage
  function saveTasks() {
      localStorage.setItem('tasks', JSON.stringify(tasks));
  }

  // Проверяем, запущено ли приложение в Telegram
  if (window.Telegram && window.Telegram.WebApp) {
    const tg = window.Telegram.WebApp;
    tg.ready();

    // Отображаем информацию о пользователе
    const user = tg.initDataUnsafe.user;
    if (user) {
        userInfo.innerHTML = `Привет, ${user.first_name}!`;
    }

    // Показываем кнопку закрытия
    document.getElementById('closeAppBtn').style.display = 'block';
    
    // Обработчик для кнопки закрытия
    document.getElementById('closeAppBtn').addEventListener('click', function() {
        tg.close(); // Закрываем Mini App
    });
    
    // Развернём приложение на весь экран
    tg.expand();
    } else {
        // Скрываем кнопку, если не в Telegram
        document.getElementById('closeAppBtn').style.display = 'none';
    }

    // Закрытие приложения
    document.getElementById('closeBtn'document.getElementById('closeAppBtn').style.display = 'block';
    
    // Обработчик для кнопки закрытия
    document.getElementById('closeAppBtn').addEventListener('click', function() {
        tg.close(); // Закрываем Mini App
    })
  }

  // Counter
  taskInput.addEventListener('input', function () {
    const remainingChars = 60 - taskInput.value.length;
    charCount.textContent = `Осталось символов: ${remainingChars}`;
  });

  // Функция для отображения задач
  function renderTasks() {
      taskList.innerHTML = ''; // Очищаем список задач
      tasks.forEach((task, index) => {
          const li = document.createElement('li');
          // li.textContent = task.text;
          li.setAttribute('draggable', 'true'); // Делаем элемент перетаскиваемым
          li.dataset.index = index; // Сохраняем индекс задачи в data-атрибуте

          // Иконка перетаскивания
          const dragIcon = document.createElement('span');
          dragIcon.classList.add('drag-icon');
          dragIcon.textContent = '⋮⋮';

          // Текст задачи
          const taskText = document.createElement('span');
          taskText.classList.add('task-text');
          taskText.textContent = task.text;

          // Если задача выполнена, добавляем класс completed
          if (task.completed) {
              li.classList.add('completed');
          }

          // Кнопка удаления
          const deleteBtn = document.createElement('button');
          deleteBtn.textContent = 'Delete';
          deleteBtn.classList.add('deleteBtn');
          deleteBtn.addEventListener('click', () => deleteTask(index));

          li.addEventListener('click', () => toggleTaskCompletion(index));

          // Добавляем элементы в <li>
          li.appendChild(dragIcon);
          li.appendChild(taskText);
          li.appendChild(deleteBtn);

          // Добавляем обработчики для drag-and-drop
          li.addEventListener('dragstart', handleDragStart);
          li.addEventListener('dragover', handleDragOver);
          li.addEventListener('drop', handleDrop);

          taskList.appendChild(li);
      });
  }

  // Функция для добавления задачи
  function addTask() {
      const text = taskInput.value.trim();
      if (text !== '') {
          tasks.push({ text, completed: false });
          taskInput.value = '';
          saveTasks();
          renderTasks();
      }
  }

  // Функция для удаления задачи
  function deleteTask(index) {
      tasks.splice(index, 1);
      saveTasks();
      renderTasks();
  }

  // Функция для отметки задачи как выполненной
  function toggleTaskCompletion(index) {
      tasks[index].completed = !tasks[index].completed;
      saveTasks();
      renderTasks();
  }

  // Функция для сохранения задач в LocalStorage
  // function saveTasks() {
  //     localStorage.setItem('tasks', JSON.stringify(tasks));
  // }

  // Обработчик события для кнопки добавления задачи
  addTaskBtn.addEventListener('click', addTask);

  // Обработчик события для ввода задачи по нажатию Enter
  taskInput.addEventListener('keypress', function (e) {
      if (e.key === 'Enter') {
          addTask();
      }
  });

  // Переменные для хранения данных о перетаскивании
  let dragStartIndex;

  // Обработчик начала перетаскивания
  function handleDragStart(e) {
      dragStartIndex = +this.dataset.index; // Запоминаем индекс элемента
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/html', this.innerHTML);
  }

  // Обработчик события dragover
  function handleDragOver(e) {
      e.preventDefault(); // Разрешаем перетаскивание
      e.dataTransfer.dropEffect = 'move';
      const target = e.target.closest('li');
      if (target && target !== this) {
          const rect = target.getBoundingClientRect();
          const next = (e.clientY - rect.top) / (rect.bottom - rect.top) > 0.5;
          taskList.insertBefore(
              this,
              next ? target.nextSibling : target
          );
      }
  }

  // Обработчик события drop
  function handleDrop(e) {
    e.preventDefault();
    const dragEndIndex = +this.dataset.index; // Индекс элемента, на который бросили
    swapTasks(dragStartIndex, dragEndIndex); // Меняем задачи местами
    saveTasks();
    renderTasks();
  }

  // Функция для обмена задач местами
  function swapTasks(fromIndex, toIndex) {
    const temp = tasks[fromIndex];
    tasks[fromIndex] = tasks[toIndex];
    tasks[toIndex] = temp;
  }

  // Первоначальная отрисовка задач
  renderTasks();
});

function handleDragStart(e) {
  dragStartIndex = +this.dataset.index;
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/html', this.innerHTML);
  this.classList.add('dragging'); // Добавляем класс
}

function handleDrop(e) {
  e.preventDefault();
  const dragEndIndex = +this.dataset.index;
  swapTasks(dragStartIndex, dragEndIndex);
  saveTasks();
  renderTasks();
  this.classList.remove('dragging'); // Убираем класс
}
