// Global variables
let currentDate = new Date();
let tasks = JSON.parse(localStorage.getItem('farmTasks')) || [];
let crops = [
    {
        name: 'Tomatoes',
        icon: '🍅',
        plantingSeason: ['spring', 'summer'],
        harvestTime: '60-80 days',
        waterNeeds: 'Regular',
        sunNeeds: 'Full sun',
        soilType: 'Well-drained',
        description: 'Popular garden vegetable that thrives in warm weather'
    },
    {
        name: 'Corn',
        icon: '🌽',
        plantingSeason: ['spring'],
        harvestTime: '60-100 days',
        waterNeeds: 'Regular',
        sunNeeds: 'Full sun',
        soilType: 'Rich, well-drained',
        description: 'Sweet corn is a summer favorite'
    },
    {
        name: 'Lettuce',
        icon: '🥬',
        plantingSeason: ['spring', 'fall'],
        harvestTime: '30-60 days',
        waterNeeds: 'Regular',
        sunNeeds: 'Partial shade',
        soilType: 'Rich, moist',
        description: 'Fast-growing leafy green perfect for salads'
    },
    {
        name: 'Carrots',
        icon: '🥕',
        plantingSeason: ['spring', 'fall'],
        harvestTime: '60-80 days',
        waterNeeds: 'Regular',
        sunNeeds: 'Full sun',
        soilType: 'Loose, sandy',
        description: 'Root vegetable that needs loose soil to grow properly'
    },
    {
        name: 'Potatoes',
        icon: '🥔',
        plantingSeason: ['spring'],
        harvestTime: '80-120 days',
        waterNeeds: 'Regular',
        sunNeeds: 'Full sun',
        soilType: 'Loose, well-drained',
        description: 'Staple crop that stores well'
    },
    {
        name: 'Beans',
        icon: '🫘',
        plantingSeason: ['spring', 'summer'],
        harvestTime: '50-65 days',
        waterNeeds: 'Regular',
        sunNeeds: 'Full sun',
        soilType: 'Well-drained',
        description: 'Nitrogen-fixing legumes great for soil health'
    },
    {
        name: 'Peppers',
        icon: '🫑',
        plantingSeason: ['spring'],
        harvestTime: '60-90 days',
        waterNeeds: 'Regular',
        sunNeeds: 'Full sun',
        soilType: 'Rich, well-drained',
        description: 'Warm-season crop with many varieties'
    },
    {
        name: 'Cucumbers',
        icon: '🥒',
        plantingSeason: ['spring', 'summer'],
        harvestTime: '50-70 days',
        waterNeeds: 'Regular',
        sunNeeds: 'Full sun',
        soilType: 'Rich, well-drained',
        description: 'Vining crop that loves warm weather'
    }
];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    loadCrops(); // Load crops from localStorage first
    initializeCalendar();
    initializeTabs();
    initializeCrops();
    initializeWeather();
    loadTasks();
    updateTodayTasks();
    
    // Set default date for forms
    document.getElementById('taskDate').value = new Date().toISOString().split('T')[0];
    document.getElementById('modalDate').value = new Date().toISOString().split('T')[0];
});

// Calendar functionality
function initializeCalendar() {
    const prevBtn = document.getElementById('prevMonth');
    const nextBtn = document.getElementById('nextMonth');
    
    prevBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
    });
    
    nextBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
    });
    
    renderCalendar();
}

function renderCalendar() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // Update month display
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                       'July', 'August', 'September', 'October', 'November', 'December'];
    document.getElementById('currentMonth').textContent = `${monthNames[month]} ${year}`;
    
    // Get first day of month and number of days
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const calendarDays = document.getElementById('calendarDays');
    calendarDays.innerHTML = '';
    
    // Generate calendar days
    for (let i = 0; i < 42; i++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);
        
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';
        dayElement.textContent = date.getDate();
        
        // Check if it's today
        const today = new Date();
        if (date.toDateString() === today.toDateString()) {
            dayElement.classList.add('today');
        }
        
        // Check if it's from other month
        if (date.getMonth() !== month) {
            dayElement.classList.add('other-month');
        }
        
        // Check for tasks on this date
        const dateString = date.toISOString().split('T')[0];
        const dayTasks = tasks.filter(task => task.date === dateString);
        
        if (dayTasks.length > 0) {
            dayElement.classList.add('has-tasks');
            
            // Add task indicators
            dayTasks.forEach(task => {
                const indicator = document.createElement('div');
                indicator.className = `task-indicator ${task.type}`;
                indicator.textContent = task.type.charAt(0).toUpperCase();
                dayElement.appendChild(indicator);
            });
        }
        
        // Add click event to show tasks for this date
        dayElement.addEventListener('click', () => {
            showTasksForDate(dateString);
        });
        
        calendarDays.appendChild(dayElement);
    }
}

// Tab functionality
function initializeTabs() {
    const navButtons = document.querySelectorAll('.nav-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.getAttribute('data-tab');
            
            // Update active states
            navButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            tabContents.forEach(content => content.classList.remove('active'));
            document.getElementById(`${targetTab}-tab`).classList.add('active');
        });
    });
}

// Task management
function loadTasks() {
    // Load from localStorage
    const savedTasks = localStorage.getItem('farmTasks');
    if (savedTasks) {
        tasks = JSON.parse(savedTasks);
    }
}

function saveTasks() {
    localStorage.setItem('farmTasks', JSON.stringify(tasks));
}

function addTask(task) {
    tasks.push(task);
    saveTasks();
    renderCalendar();
    updateTodayTasks();
}

function removeTask(taskId) {
    if (confirm('Are you sure you want to remove this task?')) {
        tasks = tasks.filter(task => task.id !== taskId);
        saveTasks();
        renderCalendar();
        updateTodayTasks();
    }
}

function updateTodayTasks() {
    const today = new Date().toISOString().split('T')[0];
    const todayTasks = tasks.filter(task => task.date === today);
    const taskList = document.getElementById('todayTasks');
    
    if (todayTasks.length === 0) {
        taskList.innerHTML = '<div class="no-tasks">No tasks for today</div>';
        return;
    }
    
    taskList.innerHTML = '';
    todayTasks.forEach(task => {
        const taskElement = createTaskElement(task);
        taskList.appendChild(taskElement);
    });
}

function createTaskElement(task) {
    const taskDiv = document.createElement('div');
    taskDiv.className = `task-item ${task.type}`;
    
    const iconDiv = document.createElement('div');
    iconDiv.className = `task-icon ${task.type}`;
    iconDiv.innerHTML = getTaskIcon(task.type);
    
    const infoDiv = document.createElement('div');
    infoDiv.className = 'task-info';
    
    const cropDiv = document.createElement('div');
    cropDiv.className = 'task-crop';
    cropDiv.textContent = task.crop;
    
    const typeDiv = document.createElement('div');
    typeDiv.className = 'task-type';
    typeDiv.textContent = task.type.charAt(0).toUpperCase() + task.type.slice(1);
    
    infoDiv.appendChild(cropDiv);
    infoDiv.appendChild(typeDiv);
    
    // Add remove button
    const removeBtn = document.createElement('button');
    removeBtn.className = 'task-remove-btn';
    removeBtn.innerHTML = '<i class="fas fa-times"></i>';
    removeBtn.title = 'Remove task';
    removeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        removeTask(task.id);
    });
    
    taskDiv.appendChild(iconDiv);
    taskDiv.appendChild(infoDiv);
    taskDiv.appendChild(removeBtn);
    
    return taskDiv;
}

function getTaskIcon(type) {
    const icons = {
        'planting': '🌱',
        'harvesting': '🌾',
        'fertilizing': '🌿',
        'watering': '💧',
        'pruning': '✂️',
        'pest-control': '🛡️'
    };
    return icons[type] || '📋';
}

// Quick add form
document.getElementById('quickAddForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const crop = document.getElementById('cropSelect').value;
    const type = document.getElementById('taskType').value;
    const date = document.getElementById('taskDate').value;
    
    if (crop && type && date) {
        const task = {
            id: Date.now(),
            crop: crop,
            type: type,
            date: date,
            notes: '',
            createdAt: new Date().toISOString()
        };
        
        addTask(task);
        
        // Reset form
        this.reset();
        document.getElementById('taskDate').value = new Date().toISOString().split('T')[0];
    }
});

// Modal functionality
function openTaskModal(date = null) {
    const modal = document.getElementById('taskModal');
    const dateInput = document.getElementById('modalDate');
    
    if (date) {
        dateInput.value = date;
    }
    
    modal.classList.add('active');
}

function showTasksForDate(dateString) {
    const modal = document.getElementById('taskModal');
    const modalContent = modal.querySelector('.modal-content');
    const dateInput = document.getElementById('modalDate');
    
    dateInput.value = dateString;
    
    // Get tasks for this date
    const dateTasks = tasks.filter(task => task.date === dateString);
    const formattedDate = new Date(dateString).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    // Update modal header
    const modalHeader = modal.querySelector('.modal-header h3');
    modalHeader.textContent = `Tasks for ${formattedDate}`;
    
    // Create task list
    let taskListHTML = '';
    if (dateTasks.length > 0) {
        taskListHTML = '<div class="existing-tasks">';
        dateTasks.forEach(task => {
            taskListHTML += `
                <div class="existing-task-item ${task.type}">
                    <div class="task-icon ${task.type}">${getTaskIcon(task.type)}</div>
                    <div class="task-details">
                        <div class="task-crop">${task.crop}</div>
                        <div class="task-type">${task.type.charAt(0).toUpperCase() + task.type.slice(1)}</div>
                        ${task.notes ? `<div class="task-notes">${task.notes}</div>` : ''}
                    </div>
                    <button class="task-remove-btn" onclick="removeTask(${task.id})" title="Remove task">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `;
        });
        taskListHTML += '</div>';
    } else {
        taskListHTML = '<div class="no-tasks-message">No tasks scheduled for this date</div>';
    }
    
    // Add "Add New Task" section
    taskListHTML += `
        <div class="add-task-section">
            <h4>Add New Task</h4>
            <form class="task-form" id="taskForm">
                <div class="form-group">
                    <label for="modalCrop">Crop</label>
                    <select id="modalCrop" required>
                        <option value="">Select Crop</option>
                        <option value="tomatoes">Tomatoes</option>
                        <option value="corn">Corn</option>
                        <option value="lettuce">Lettuce</option>
                        <option value="carrots">Carrots</option>
                        <option value="potatoes">Potatoes</option>
                        <option value="beans">Beans</option>
                        <option value="peppers">Peppers</option>
                        <option value="cucumbers">Cucumbers</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="modalTaskType">Task Type</label>
                    <select id="modalTaskType" required>
                        <option value="">Select Task Type</option>
                        <option value="planting">Planting</option>
                        <option value="harvesting">Harvesting</option>
                        <option value="fertilizing">Fertilizing</option>
                        <option value="watering">Watering</option>
                        <option value="pruning">Pruning</option>
                        <option value="pest-control">Pest Control</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="modalDate">Date</label>
                    <input type="date" id="modalDate" required>
                </div>
                <div class="form-group">
                    <label for="modalNotes">Notes</label>
                    <textarea id="modalNotes" rows="3" placeholder="Add any additional notes..."></textarea>
                </div>
                <div class="form-actions">
                    <button type="button" class="btn-secondary" id="cancelTask">Cancel</button>
                    <button type="submit" class="btn-primary">Save Task</button>
                </div>
            </form>
        </div>
    `;
    
    // Update modal content
    const taskForm = modal.querySelector('.task-form');
    taskForm.parentNode.innerHTML = taskListHTML;
    
    // Re-attach event listeners
    const newTaskForm = modal.querySelector('#taskForm');
    if (newTaskForm) {
        newTaskForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const crop = document.getElementById('modalCrop').value;
            const type = document.getElementById('modalTaskType').value;
            const date = document.getElementById('modalDate').value;
            const notes = document.getElementById('modalNotes').value;
            
            if (crop && type && date) {
                const task = {
                    id: Date.now(),
                    crop: crop,
                    type: type,
                    date: date,
                    notes: notes,
                    createdAt: new Date().toISOString()
                };
                
                addTask(task);
                closeTaskModal();
                this.reset();
                document.getElementById('modalDate').value = new Date().toISOString().split('T')[0];
            }
        });
    }
    
    modal.classList.add('active');
}

function closeTaskModal() {
    const modal = document.getElementById('taskModal');
    modal.classList.remove('active');
}

document.getElementById('closeModal').addEventListener('click', closeTaskModal);
document.getElementById('cancelTask').addEventListener('click', closeTaskModal);

document.getElementById('taskForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const crop = document.getElementById('modalCrop').value;
    const type = document.getElementById('modalTaskType').value;
    const date = document.getElementById('modalDate').value;
    const notes = document.getElementById('modalNotes').value;
    
    if (crop && type && date) {
        const task = {
            id: Date.now(),
            crop: crop,
            type: type,
            date: date,
            notes: notes,
            createdAt: new Date().toISOString()
        };
        
        addTask(task);
        closeTaskModal();
        this.reset();
        document.getElementById('modalDate').value = new Date().toISOString().split('T')[0];
    }
});

// Crops functionality
function initializeCrops() {
    renderCrops();
    
    // Search functionality
    document.getElementById('cropSearch').addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase();
        filterCrops(searchTerm);
    });
}

function renderCrops() {
    const cropsGrid = document.getElementById('cropsGrid');
    cropsGrid.innerHTML = '';
    
    crops.forEach(crop => {
        const cropCard = createCropCard(crop);
        cropsGrid.appendChild(cropCard);
    });
}

function createCropCard(crop) {
    const card = document.createElement('div');
    card.className = 'crop-card';
    card.setAttribute('data-crop-name', crop.name);
    
    const header = document.createElement('div');
    header.className = 'crop-header';
    
    const icon = document.createElement('div');
    icon.className = 'crop-icon';
    icon.textContent = crop.icon;
    
    const name = document.createElement('div');
    name.className = 'crop-name';
    name.textContent = crop.name;
    
    // Add remove button
    const removeBtn = document.createElement('button');
    removeBtn.className = 'crop-remove-btn';
    removeBtn.innerHTML = '<i class="fas fa-times"></i>';
    removeBtn.title = 'Remove crop';
    removeBtn.onclick = () => removeCrop(crop.name);
    
    header.appendChild(icon);
    header.appendChild(name);
    header.appendChild(removeBtn);
    
    const details = document.createElement('div');
    details.className = 'crop-details';
    
    const detailsList = [
        ['Harvest Time', crop.harvestTime],
        ['Water Needs', crop.waterNeeds],
        ['Sun Needs', crop.sunNeeds],
        ['Soil Type', crop.soilType]
    ];
    
    detailsList.forEach(([label, value]) => {
        const detail = document.createElement('div');
        detail.className = 'crop-detail';
        detail.innerHTML = `<span>${label}</span><span>${value}</span>`;
        details.appendChild(detail);
    });
    
    const seasons = document.createElement('div');
    seasons.className = 'crop-seasons';
    
    crop.plantingSeason.forEach(season => {
        const tag = document.createElement('span');
        tag.className = `season-tag ${season}`;
        tag.textContent = season.charAt(0).toUpperCase() + season.slice(1);
        seasons.appendChild(tag);
    });
    
    card.appendChild(header);
    card.appendChild(details);
    card.appendChild(seasons);
    
    return card;
}

function filterCrops(searchTerm) {
    const cropsGrid = document.getElementById('cropsGrid');
    cropsGrid.innerHTML = '';
    
    const filteredCrops = crops.filter(crop => 
        crop.name.toLowerCase().includes(searchTerm) ||
        crop.description.toLowerCase().includes(searchTerm)
    );
    
    filteredCrops.forEach(crop => {
        const cropCard = createCropCard(crop);
        cropsGrid.appendChild(cropCard);
    });
}

// Weather functionality
function initializeWeather() {
    // Set default location
    const locationInput = document.getElementById('locationInput');
    locationInput.value = 'New York';
    
    // Load weather on page load
    loadWeather();
    
    // Update location button
    document.getElementById('updateLocation').addEventListener('click', loadWeather);
    
    // Enter key on location input
    locationInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            loadWeather();
        }
    });
}

function loadWeather() {
    const location = document.getElementById('locationInput').value;
    
    // Show loading state
    document.getElementById('currentWeather').innerHTML = `
        <div class="weather-loading">
            <i class="fas fa-spinner fa-spin"></i>
            Loading weather data for ${location}...
        </div>
    `;
    
    // Simulate weather API call (in real app, you'd use a weather API)
    setTimeout(() => {
        displayWeather(location);
    }, 1000);
}

function displayWeather(location) {
    // Simulated weather data (replace with real API)
    const weatherData = {
        current: {
            temp: Math.floor(Math.random() * 30) + 10,
            description: 'Partly Cloudy',
            humidity: Math.floor(Math.random() * 40) + 40,
            wind: Math.floor(Math.random() * 20) + 5
        },
        forecast: [
            { date: 'Today', temp: Math.floor(Math.random() * 30) + 10, desc: 'Sunny' },
            { date: 'Tomorrow', temp: Math.floor(Math.random() * 30) + 10, desc: 'Cloudy' },
            { date: 'Wed', temp: Math.floor(Math.random() * 30) + 10, desc: 'Rain' },
            { date: 'Thu', temp: Math.floor(Math.random() * 30) + 10, desc: 'Partly Cloudy' },
            { date: 'Fri', temp: Math.floor(Math.random() * 30) + 10, desc: 'Sunny' }
        ]
    };
    
    // Display current weather
    const currentWeather = document.getElementById('currentWeather');
    currentWeather.innerHTML = `
        <div class="weather-main">
            <div class="weather-temp">${weatherData.current.temp}°C</div>
            <div class="weather-desc">${weatherData.current.description}</div>
        </div>
        <div class="weather-details">
            <div class="weather-detail">
                <span>Humidity</span>
                <span>${weatherData.current.humidity}%</span>
            </div>
            <div class="weather-detail">
                <span>Wind Speed</span>
                <span>${weatherData.current.wind} km/h</span>
            </div>
        </div>
    `;
    
    // Display forecast
    const forecastContainer = document.getElementById('weatherForecast');
    forecastContainer.innerHTML = `
        <h3>5-Day Forecast</h3>
        <div class="forecast-grid">
            ${weatherData.forecast.map(day => `
                <div class="forecast-day">
                    <div class="forecast-date">${day.date}</div>
                    <div class="forecast-temp">${day.temp}°C</div>
                    <div class="forecast-desc">${day.desc}</div>
                </div>
            `).join('')}
        </div>
    `;
}

// Utility functions
function formatDate(date) {
    return new Date(date).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Close modal when clicking outside
document.getElementById('taskModal').addEventListener('click', function(e) {
    if (e.target === this) {
        closeTaskModal();
    }
});

// Add some sample data for demonstration
function addSampleData() {
    const today = new Date();
    const sampleTasks = [
        {
            id: 1,
            crop: 'Tomatoes',
            type: 'planting',
            date: today.toISOString().split('T')[0],
            notes: 'Plant in well-drained soil with full sun',
            createdAt: new Date().toISOString()
        },
        {
            id: 2,
            crop: 'Lettuce',
            type: 'watering',
            date: new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            notes: 'Water in the morning to prevent disease',
            createdAt: new Date().toISOString()
        },
        {
            id: 3,
            crop: 'Corn',
            type: 'fertilizing',
            date: new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            notes: 'Apply nitrogen-rich fertilizer',
            createdAt: new Date().toISOString()
        }
    ];
    
    if (tasks.length === 0) {
        tasks = sampleTasks;
        saveTasks();
        renderCalendar();
        updateTodayTasks();
    }
}

// Add sample data on first load
setTimeout(addSampleData, 1000);

// Crop Modal Functionality
function initializeCropModal() {
    const addCropBtn = document.getElementById('addCropBtn');
    const cropModal = document.getElementById('cropModal');
    const closeCropModalBtn = document.getElementById('closeCropModal');
    const cropForm = document.getElementById('cropForm');

    // Open crop modal
    addCropBtn.addEventListener('click', function() {
        cropModal.classList.add('active');
        document.getElementById('cropName').focus();
    });

    // Close crop modal
    closeCropModalBtn.addEventListener('click', closeCropModal);

    // Close modal when clicking outside
    cropModal.addEventListener('click', function(e) {
        if (e.target === this) {
            closeCropModal();
        }
    });

    // Handle crop form submission
    cropForm.addEventListener('submit', function(e) {
        e.preventDefault();
        addNewCrop();
    });
}

function closeCropModal() {
    const cropModal = document.getElementById('cropModal');
    cropModal.classList.remove('active');
    
    // Reset form
    document.getElementById('cropForm').reset();
}

function addNewCrop() {
    const name = document.getElementById('cropName').value.trim();
    const icon = document.getElementById('cropIcon').value.trim();
    const description = document.getElementById('cropDescription').value.trim();
    const harvestTime = document.getElementById('cropHarvestTime').value.trim();
    const waterNeeds = document.getElementById('cropWaterNeeds').value;
    const sunNeeds = document.getElementById('cropSunNeeds').value;
    const soilType = document.getElementById('cropSoilType').value;
    
    // Get selected seasons
    const seasonCheckboxes = document.querySelectorAll('.seasons-checkboxes input[type="checkbox"]:checked');
    const plantingSeason = Array.from(seasonCheckboxes).map(cb => cb.value);

    // Validate form
    if (!name || !icon || !description || !harvestTime || !waterNeeds || !sunNeeds || !soilType || plantingSeason.length === 0) {
        alert('Please fill in all fields and select at least one planting season.');
        return;
    }

    // Create new crop object
    const newCrop = {
        name: name,
        icon: icon,
        description: description,
        harvestTime: harvestTime,
        waterNeeds: waterNeeds,
        sunNeeds: sunNeeds,
        soilType: soilType,
        plantingSeason: plantingSeason
    };

    // Add to crops array
    crops.push(newCrop);
    
    // Save to localStorage
    saveCrops();
    
    // Re-render crops
    renderCrops();
    
    // Update crop selects in task forms
    updateCropSelects();
    
    // Close modal
    closeCropModal();
    
    // Show success message
    alert('Crop added successfully!');
}

function removeCrop(cropName) {
    // Confirm removal
    if (!confirm(`Are you sure you want to remove ${cropName} from the crop database?`)) {
        return;
    }
    
    // Remove crop from array
    crops = crops.filter(crop => crop.name !== cropName);
    
    // Save to localStorage
    saveCrops();
    
    // Re-render crops
    renderCrops();
    
    // Update crop selects in task forms
    updateCropSelects();
    
    // Show success message
    alert(`${cropName} has been removed from the crop database.`);
}

function saveCrops() {
    localStorage.setItem('farmCrops', JSON.stringify(crops));
}

function loadCrops() {
    const savedCrops = localStorage.getItem('farmCrops');
    if (savedCrops) {
        crops = JSON.parse(savedCrops);
    }
    updateCropSelects();
}

function updateCropSelects() {
    // Update quick add form crop select
    const cropSelect = document.getElementById('cropSelect');
    const modalCrop = document.getElementById('modalCrop');
    
    if (cropSelect && modalCrop) {
        // Clear existing options except the first one
        cropSelect.innerHTML = '<option value="">Select Crop</option>';
        modalCrop.innerHTML = '<option value="">Select Crop</option>';
        
        // Add crop options
        crops.forEach(crop => {
            const option = document.createElement('option');
            option.value = crop.name.toLowerCase();
            option.textContent = crop.name;
            cropSelect.appendChild(option.cloneNode(true));
            modalCrop.appendChild(option);
        });
    }
}

// Initialize crop modal
document.addEventListener('DOMContentLoaded', function() {
    loadCrops();
    initializeCropModal();
}); 