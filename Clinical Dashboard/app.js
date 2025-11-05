// Sample Data
const samplePatients = [
    {
        id: 1,
        name: "John Doe",
        age: 15,
        condition: "Postural Kyphosis",
        status: "good",
        compliance: 87,
        last_sync: "2 hours ago",
        posture_target: 10,
        pressure_target: 12,
        enrollment_date: "January 15, 2025"
    },
    {
        id: 2,
        name: "Jane Smith",
        age: 14,
        condition: "Scheuermann's Kyphosis",
        status: "warning",
        compliance: 62,
        last_sync: "5 hours ago",
        posture_target: 8,
        pressure_target: 11,
        enrollment_date: "February 3, 2025"
    },
    {
        id: 3,
        name: "Mike Johnson",
        age: 16,
        condition: "Postural Kyphosis",
        status: "alert",
        compliance: 45,
        last_sync: "12 hours ago",
        posture_target: 9,
        pressure_target: 12,
        enrollment_date: "March 10, 2025"
    }
];

const sampleDevices = [
    {
        device_id: "DEV001",
        patient: "John Doe",
        patient_id: 1,
        status: "Connected",
        battery: 85,
        last_sync: "2 hours ago",
        firmware: "v2.3.1"
    },
    {
        device_id: "DEV002",
        patient: "Jane Smith",
        patient_id: 2,
        status: "Connected",
        battery: 45,
        last_sync: "5 hours ago",
        firmware: "v2.3.1"
    },
    {
        device_id: "DEV003",
        patient: "Mike Johnson",
        patient_id: 3,
        status: "Offline",
        battery: 12,
        last_sync: "12 hours ago",
        firmware: "v2.2.8"
    }
];

const sampleAlerts = [
    {
        patient: "Jane Smith",
        type: "Low Compliance",
        severity: "warning",
        message: "Below target wear time for 2 days",
        time: "3 hours ago"
    },
    {
        patient: "Mike Johnson",
        type: "Device Offline",
        severity: "alert",
        message: "Device not synced for 12 hours",
        time: "1 hour ago"
    },
    {
        patient: "John Doe",
        type: "High Temperature",
        severity: "warning",
        message: "Skin temperature exceeded 38°C",
        time: "30 minutes ago"
    }
];

const chartData = {
    posture_7days: [12, 11, 10, 9, 8, 9, 10],
    pressure_7days: [13, 12, 11, 10, 11, 12, 13],
    wear_hours_7days: [8, 7, 9, 6, 8, 9, 8],
    temperature_7days: [36.5, 36.8, 37.0, 36.9, 37.1, 37.2, 36.8]
};

// Global variables
let currentPatient = null;
let charts = {};

// Page Navigation
function showPage(pageId) {
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');
    
    // Update active nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.dataset.page === pageId.replace('Page', '')) {
            link.classList.add('active');
        }
    });
}

// Login Handler
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    showPage('dashboardPage');
    loadDashboardData();
});

// Logout Handlers
function setupLogoutButtons() {
    const logoutButtons = ['logoutBtn', 'logoutBtn2', 'logoutBtn3', 'logoutBtn4', 'logoutBtn5'];
    logoutButtons.forEach(btnId => {
        const btn = document.getElementById(btnId);
        if (btn) {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                showPage('loginPage');
            });
        }
    });
}

// Navigation Link Handlers
function setupNavigation() {
    document.querySelectorAll('.nav-link[data-page]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const page = this.dataset.page;
            showPage(page + 'Page');
            
            if (page === 'dashboard') {
                loadDashboardData();
            } else if (page === 'patients') {
                loadPatientList();
            } else if (page === 'devices') {
                loadDevices();
            }
        });
    });
}

// Mobile Navigation Toggle
function setupMobileNav() {
    const toggles = ['navToggle', 'navToggle2', 'navToggle3', 'navToggle4', 'navToggle5'];
    toggles.forEach(toggleId => {
        const toggle = document.getElementById(toggleId);
        if (toggle) {
            toggle.addEventListener('click', function() {
                const menu = this.nextElementSibling;
                if (menu && menu.classList.contains('nav-menu')) {
                    menu.classList.toggle('active');
                }
            });
        }
    });
}

// Load Dashboard Data
function loadDashboardData() {
    // Update stats
    document.getElementById('totalPatients').textContent = samplePatients.length;
    const alertPatients = samplePatients.filter(p => p.status === 'alert' || p.status === 'warning').length;
    document.getElementById('patientsWithAlerts').textContent = alertPatients;
    
    const avgCompliance = Math.round(samplePatients.reduce((sum, p) => sum + p.compliance, 0) / samplePatients.length);
    document.getElementById('avgCompliance').textContent = avgCompliance + '%';
    
    const connectedDevices = sampleDevices.filter(d => d.status === 'Connected').length;
    document.getElementById('devicesConnected').textContent = connectedDevices;
    
    // Load alerts table
    const alertsTable = document.getElementById('alertsTable');
    alertsTable.innerHTML = '';
    sampleAlerts.forEach(alert => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${alert.patient}</td>
            <td>${alert.type}</td>
            <td><span class="severity-${alert.severity}">${alert.severity.toUpperCase()}</span></td>
            <td>${alert.time}</td>
        `;
        alertsTable.appendChild(row);
    });
    
    // Load patients overview
    const patientsTable = document.getElementById('patientsOverviewTable');
    patientsTable.innerHTML = '';
    samplePatients.forEach(patient => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${patient.name}</td>
            <td>${patient.age}</td>
            <td><span class="status-badge status-${patient.status}">${patient.status}</span></td>
            <td>${patient.compliance}%</td>
            <td>${patient.last_sync}</td>
            <td><button class="btn btn-sm btn-primary" onclick="viewPatient(${patient.id})">View</button></td>
        `;
        patientsTable.appendChild(row);
    });
}

// Load Patient List
function loadPatientList() {
    const patientListTable = document.getElementById('patientListTable');
    patientListTable.innerHTML = '';
    
    samplePatients.forEach(patient => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${patient.id}</td>
            <td>${patient.name}</td>
            <td>${patient.age}</td>
            <td>${patient.condition}</td>
            <td>${patient.compliance}%</td>
            <td><span class="status-badge status-${patient.status}">${patient.status}</span></td>
            <td>${patient.last_sync}</td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="viewPatient(${patient.id})">View</button>
                <button class="btn btn-sm btn-secondary" onclick="editPatient(${patient.id})">Edit</button>
            </td>
        `;
        patientListTable.appendChild(row);
    });
    
    // Setup filter buttons
    document.querySelectorAll('.btn-filter').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.btn-filter').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            filterPatients(this.dataset.filter);
        });
    });
    
    // Setup search
    document.getElementById('patientSearch').addEventListener('input', function() {
        searchPatients(this.value);
    });
}

// Filter Patients
function filterPatients(status) {
    const rows = document.querySelectorAll('#patientListTable tr');
    rows.forEach(row => {
        if (status === 'all') {
            row.style.display = '';
        } else {
            const statusBadge = row.querySelector('.status-badge');
            if (statusBadge && statusBadge.classList.contains(`status-${status}`)) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        }
    });
}

// Search Patients
function searchPatients(query) {
    const rows = document.querySelectorAll('#patientListTable tr');
    const lowerQuery = query.toLowerCase();
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(lowerQuery) ? '' : 'none';
    });
}

// View Patient
function viewPatient(patientId) {
    currentPatient = samplePatients.find(p => p.id === patientId);
    if (!currentPatient) return;
    
    // Update patient header
    document.getElementById('patientDetailName').textContent = currentPatient.name;
    document.getElementById('patientDetailAge').textContent = `Age: ${currentPatient.age}`;
    document.getElementById('patientDetailCondition').textContent = `Condition: ${currentPatient.condition}`;
    document.getElementById('patientDetailEnrollment').textContent = `Enrolled: ${currentPatient.enrollment_date}`;
    
    // Update device info
    const device = sampleDevices.find(d => d.patient_id === patientId);
    if (device) {
        document.getElementById('deviceId').textContent = device.device_id;
        document.getElementById('deviceBattery').textContent = device.battery + '%';
        document.getElementById('deviceLastSync').textContent = device.last_sync;
    }
    
    showPage('patientDetailPage');
    
    // Load charts after a short delay to ensure canvas elements are visible
    setTimeout(() => {
        loadPatientCharts();
    }, 100);
}

// Edit Patient
function editPatient(patientId) {
    alert('Edit patient functionality would open a modal or form here.');
}

// Load Patient Charts
function loadPatientCharts() {
    // Destroy existing charts
    Object.values(charts).forEach(chart => {
        if (chart) chart.destroy();
    });
    charts = {};
    
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    
    // Posture Gauge
    const postureCtx = document.getElementById('postureGauge');
    if (postureCtx) {
        charts.postureGauge = new Chart(postureCtx, {
            type: 'doughnut',
            data: {
                labels: ['Current', 'Target'],
                datasets: [{
                    data: [10, 10],
                    backgroundColor: ['#3b82f6', '#334155'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                circumference: 180,
                rotation: 270,
                cutout: '70%',
                plugins: {
                    legend: { display: false },
                    tooltip: { enabled: false }
                }
            }
        });
    }
    
    // Pressure Gauge
    const pressureCtx = document.getElementById('pressureGauge');
    if (pressureCtx) {
        charts.pressureGauge = new Chart(pressureCtx, {
            type: 'doughnut',
            data: {
                labels: ['Current', 'Target'],
                datasets: [{
                    data: [12, 3],
                    backgroundColor: ['#10b981', '#334155'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                circumference: 180,
                rotation: 270,
                cutout: '70%',
                plugins: {
                    legend: { display: false },
                    tooltip: { enabled: false }
                }
            }
        });
    }
    
    // Temperature Gauge
    const tempCtx = document.getElementById('temperatureGauge');
    if (tempCtx) {
        charts.temperatureGauge = new Chart(tempCtx, {
            type: 'doughnut',
            data: {
                labels: ['Current', 'Safe'],
                datasets: [{
                    data: [37, 1],
                    backgroundColor: ['#fbbf24', '#334155'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                circumference: 180,
                rotation: 270,
                cutout: '70%',
                plugins: {
                    legend: { display: false },
                    tooltip: { enabled: false }
                }
            }
        });
    }
    
    // Weekly Compliance Chart
    const complianceCtx = document.getElementById('weeklyComplianceChart');
    if (complianceCtx) {
        charts.weeklyCompliance = new Chart(complianceCtx, {
            type: 'bar',
            data: {
                labels: days,
                datasets: [{
                    label: 'Wear Hours',
                    data: chartData.wear_hours_7days,
                    backgroundColor: '#3b82f6',
                    borderRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 12,
                        ticks: { color: '#94a3b8' },
                        grid: { color: '#334155' }
                    },
                    x: {
                        ticks: { color: '#94a3b8' },
                        grid: { display: false }
                    }
                }
            }
        });
    }
    
    // Posture Line Chart
    const postureLineCtx = document.getElementById('postureLineChart');
    if (postureLineCtx) {
        charts.postureLine = new Chart(postureLineCtx, {
            type: 'line',
            data: {
                labels: days,
                datasets: [{
                    label: 'Posture Angle (degrees)',
                    data: chartData.posture_7days,
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { labels: { color: '#94a3b8' } }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        ticks: { color: '#94a3b8' },
                        grid: { color: '#334155' }
                    },
                    x: {
                        ticks: { color: '#94a3b8' },
                        grid: { display: false }
                    }
                }
            }
        });
    }
    
    // Pressure Line Chart
    const pressureLineCtx = document.getElementById('pressureLineChart');
    if (pressureLineCtx) {
        charts.pressureLine = new Chart(pressureLineCtx, {
            type: 'line',
            data: {
                labels: days,
                datasets: [{
                    label: 'Pressure (mmHg)',
                    data: chartData.pressure_7days,
                    borderColor: '#10b981',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { labels: { color: '#94a3b8' } }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        ticks: { color: '#94a3b8' },
                        grid: { color: '#334155' }
                    },
                    x: {
                        ticks: { color: '#94a3b8' },
                        grid: { display: false }
                    }
                }
            }
        });
    }
    
    // Wear Hours Chart
    const wearHoursCtx = document.getElementById('wearHoursChart');
    if (wearHoursCtx) {
        charts.wearHours = new Chart(wearHoursCtx, {
            type: 'bar',
            data: {
                labels: days,
                datasets: [{
                    label: 'Wear Hours',
                    data: chartData.wear_hours_7days,
                    backgroundColor: '#60a5fa',
                    borderRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { labels: { color: '#94a3b8' } }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 12,
                        ticks: { color: '#94a3b8' },
                        grid: { color: '#334155' }
                    },
                    x: {
                        ticks: { color: '#94a3b8' },
                        grid: { display: false }
                    }
                }
            }
        });
    }
    
    // Temperature Line Chart
    const tempLineCtx = document.getElementById('temperatureLineChart');
    if (tempLineCtx) {
        charts.temperatureLine = new Chart(tempLineCtx, {
            type: 'line',
            data: {
                labels: days,
                datasets: [{
                    label: 'Temperature (°C)',
                    data: chartData.temperature_7days,
                    borderColor: '#fbbf24',
                    backgroundColor: 'rgba(251, 191, 36, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { labels: { color: '#94a3b8' } }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        min: 35,
                        max: 39,
                        ticks: { color: '#94a3b8' },
                        grid: { color: '#334155' }
                    },
                    x: {
                        ticks: { color: '#94a3b8' },
                        grid: { display: false }
                    }
                }
            }
        });
    }
    
    // Detail charts for tabs
    loadDetailCharts();
}

// Load Detail Charts
function loadDetailCharts() {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    
    // Posture Detail Chart
    const postureDetailCtx = document.getElementById('postureDetailChart');
    if (postureDetailCtx) {
        if (charts.postureDetail) charts.postureDetail.destroy();
        charts.postureDetail = new Chart(postureDetailCtx, {
            type: 'line',
            data: {
                labels: days,
                datasets: [{
                    label: 'Posture Angle (degrees)',
                    data: chartData.posture_7days,
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    tension: 0.4,
                    fill: true,
                    pointRadius: 5,
                    pointHoverRadius: 7
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { labels: { color: '#94a3b8', font: { size: 14 } } }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        ticks: { color: '#94a3b8', font: { size: 12 } },
                        grid: { color: '#334155' }
                    },
                    x: {
                        ticks: { color: '#94a3b8', font: { size: 12 } },
                        grid: { display: false }
                    }
                }
            }
        });
    }
    
    // Pressure Detail Chart
    const pressureDetailCtx = document.getElementById('pressureDetailChart');
    if (pressureDetailCtx) {
        if (charts.pressureDetail) charts.pressureDetail.destroy();
        charts.pressureDetail = new Chart(pressureDetailCtx, {
            type: 'line',
            data: {
                labels: days,
                datasets: [{
                    label: 'Pressure (mmHg)',
                    data: chartData.pressure_7days,
                    borderColor: '#10b981',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    tension: 0.4,
                    fill: true,
                    pointRadius: 5,
                    pointHoverRadius: 7
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { labels: { color: '#94a3b8', font: { size: 14 } } }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        ticks: { color: '#94a3b8', font: { size: 12 } },
                        grid: { color: '#334155' }
                    },
                    x: {
                        ticks: { color: '#94a3b8', font: { size: 12 } },
                        grid: { display: false }
                    }
                }
            }
        });
    }
    
    // Compliance Detail Chart
    const complianceDetailCtx = document.getElementById('complianceDetailChart');
    if (complianceDetailCtx) {
        if (charts.complianceDetail) charts.complianceDetail.destroy();
        charts.complianceDetail = new Chart(complianceDetailCtx, {
            type: 'bar',
            data: {
                labels: days,
                datasets: [{
                    label: 'Daily Wear Hours',
                    data: chartData.wear_hours_7days,
                    backgroundColor: '#60a5fa',
                    borderRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { labels: { color: '#94a3b8', font: { size: 14 } } }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 12,
                        ticks: { color: '#94a3b8', font: { size: 12 } },
                        grid: { color: '#334155' }
                    },
                    x: {
                        ticks: { color: '#94a3b8', font: { size: 12 } },
                        grid: { display: false }
                    }
                }
            }
        });
    }
}

// Tab Navigation
function setupTabs() {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            
            this.classList.add('active');
            const tabId = this.dataset.tab + 'Tab';
            document.getElementById(tabId).classList.add('active');
            
            // Reload charts when switching to detail tabs
            if (['posture', 'pressure', 'compliance'].includes(this.dataset.tab)) {
                setTimeout(() => loadDetailCharts(), 100);
            }
        });
    });
}

// Load Devices
function loadDevices() {
    const devicesTable = document.getElementById('devicesTable');
    devicesTable.innerHTML = '';
    
    sampleDevices.forEach(device => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${device.device_id}</td>
            <td>${device.patient}</td>
            <td><span class="status-badge status-${device.status === 'Connected' ? 'good' : 'alert'}">${device.status}</span></td>
            <td>${device.battery}%</td>
            <td>${device.last_sync}</td>
            <td>${device.firmware}</td>
            <td>
                <button class="btn btn-sm btn-primary">Calibrate</button>
                <button class="btn btn-sm btn-secondary">Sync</button>
            </td>
        `;
        devicesTable.appendChild(row);
    });
}

// Button Handlers
function setupButtonHandlers() {
    // Add Patient buttons
    const addPatientBtns = ['addPatientBtn', 'addPatientBtn2'];
    addPatientBtns.forEach(btnId => {
        const btn = document.getElementById(btnId);
        if (btn) {
            btn.addEventListener('click', function() {
                alert('Add new patient functionality would open a modal or form here.');
            });
        }
    });
    
    // Back to Patients
    const backBtn = document.getElementById('backToPatients');
    if (backBtn) {
        backBtn.addEventListener('click', function() {
            showPage('patientsPage');
            loadPatientList();
        });
    }
    
    // Save Notes
    const saveNotesBtn = document.getElementById('saveNotesBtn');
    if (saveNotesBtn) {
        saveNotesBtn.addEventListener('click', function() {
            alert('Notes saved successfully!');
        });
    }
    
    // Add Note
    const addNoteBtn = document.getElementById('addNoteBtn');
    if (addNoteBtn) {
        addNoteBtn.addEventListener('click', function() {
            const noteText = document.getElementById('newNote').value;
            if (noteText.trim()) {
                alert('Note added successfully!');
                document.getElementById('newNote').value = '';
            }
        });
    }
    
    // Pair Device
    const pairDeviceBtn = document.getElementById('pairDeviceBtn');
    if (pairDeviceBtn) {
        pairDeviceBtn.addEventListener('click', function() {
            alert('Pair new device functionality would open a pairing wizard here.');
        });
    }
    
    // Save Settings
    const saveSettingsBtn = document.getElementById('saveSettingsBtn');
    if (saveSettingsBtn) {
        saveSettingsBtn.addEventListener('click', function() {
            alert('Settings saved successfully!');
        });
    }
    
    // Edit Patient
    const editPatientBtn = document.getElementById('editPatientBtn');
    if (editPatientBtn) {
        editPatientBtn.addEventListener('click', function() {
            alert('Edit patient functionality would open a form here.');
        });
    }
}

// Initialize App
function initApp() {
    setupLogoutButtons();
    setupNavigation();
    setupMobileNav();
    setupTabs();
    setupButtonHandlers();
}

// Run on page load
window.addEventListener('DOMContentLoaded', initApp);