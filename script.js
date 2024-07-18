// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    databaseURL: "https://YOUR_PROJECT_ID.firebaseio.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

function nextStep(step) {
    document.querySelectorAll('.form-step').forEach(step => step.style.display = 'none');
    document.getElementById(`step-${step}`).style.display = 'block';
}

function prevStep(step) {
    document.querySelectorAll('.form-step').forEach(step => step.style.display = 'none');
    document.getElementById(`step-${step}`).style.display = 'block';
}

document.getElementById('employee-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const employee = {};
    formData.forEach((value, key) => {
        employee[key] = value;
    });

    // Save employee data to Firebase
    const newEmployeeRef = database.ref('employees').push();
    newEmployeeRef.set(employee)
        .then(() => {
            console.log('Employee data saved successfully:', employee);
            addEmployeeToTable(employee);
            alert('Employee data submitted!');
            // Reset form and go back to step 1
            e.target.reset();
            nextStep(1);
        })
        .catch((error) => {
            console.error('Error saving employee data:', error);
        });
});

function addEmployeeToTable(employee) {
    const tableBody = document.querySelector('#employee-data-table tbody');
    const row = document.createElement('tr');

    Object.values(employee).forEach(value => {
        const cell = document.createElement('td');
        cell.textContent = value;
        row.appendChild(cell);
    });

    tableBody.appendChild(row);
    console.log('Added employee to table:', employee);
}

function searchEmployee() {
    const input = document.getElementById('search');
    const filter = input.value.toLowerCase();
    const table = document.getElementById('employee-data-table');
    const tr = table.getElementsByTagName('tr');

    for (let i = 1; i < tr.length; i++) {
        const td = tr[i].getElementsByTagName('td')[0];
        if (td) {
            const txtValue = td.textContent || td.innerText;
            if (txtValue.toLowerCase().indexOf(filter) > -1) {
                tr[i].style.display = '';
            } else {
                tr[i].style.display = 'none';
            }
        }
    }
}

// Fetch and display employee data from Firebase on page load
window.onload = function() {
    database.ref('employees').on('value', (snapshot) => {
        const employees = snapshot.val();
        const tableBody = document.querySelector('#employee-data-table tbody');
        tableBody.innerHTML = ''; // Clear existing data
        for (const id in employees) {
            addEmployeeToTable(employees[id]);
        }
        console.log('Loaded employee data from Firebase:', employees);
    });
};
