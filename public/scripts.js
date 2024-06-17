document.addEventListener("DOMContentLoaded", loadEmployees);

function loadEmployees() {
  document.getElementById("noDataMsg").style.display = "none";
  fetch("http://localhost:3000/getEmployees")
    .then((response) => response.json())
    .then((data) => {
      //   console.log(data.length);
      const tableBody = document.getElementById("employeeTableBody");
      tableBody.innerHTML = ""; // Clear table data
      data.forEach((employee) => addEmployeeToTable(employee));
    })
    .catch((error) => console.error("Error fetching employees:", error));
}

function openForm() {
  document.getElementById("employeeForm").style.display = "block";
  //   document.getElementById("employeeId").value = "";
}

function closeForm() {
  //   document.getElementById("employeeId").value = "";
  document.getElementById("name").value = "";
  document.getElementById("email").value = "";
  document.getElementById("mobile").value = "";
  document.getElementById("employeeForm").style.display = "none";
}

function updateEmployee(id, name, email, mobile) {
  document.getElementById("employeeId").value = id;
  document.getElementById("name").value = name;
  document.getElementById("email").value = email;
  document.getElementById("mobile").value = mobile;
  openForm();
}

function saveEmployee() {
  // Check if form elements exist
  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const mobileInput = document.getElementById("mobile");
  const employeeIdInput = document.getElementById("employeeId");

  if (!nameInput || !emailInput || !mobileInput || !employeeIdInput) {
    console.error("Form elements not found.");
    return;
  }

  const id = employeeIdInput.value;
  const name = nameInput.value;
  const email = emailInput.value;
  const mobile = mobileInput.value;

  // Validation checks
  if (!name || !email || !mobile) {
    alert("All fields are required.");
    return;
  }
  if (!/^[a-zA-Z\s]+$/.test(name)) {
    alert("Name should contain only alphabets and spaces.");
    return;
  }
  if (!/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(email)) {
    alert("Invalid email format.");
    return;
  }
  if (!/^\d{10}$/.test(mobile)) {
    alert("Mobile number should be 10 digits.");
    return;
  }

  // Check if email already exists
  fetch("http://localhost:3000/checkEmail", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.emailExists) {
        alert("Email ID already exists. Please use a different email.");
      } else {
        const method = id ? "PUT" : "POST";
        const url = id
          ? `http://localhost:3000/updateEmployee/${id}`
          : "http://localhost:3000/addEmployee";
        const successMessage = id
          ? "Employee updated successfully"
          : "Employee added successfully";

        fetch(url, {
          method,
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, email, mobile }),
        })
          .then((response) => response.text())
          .then((data) => {
            alert(data || successMessage);
            closeForm();
            loadEmployees();
          })
          .catch((error) => console.error("Error:", error));
      }
    })
    .catch((error) => console.error("Error checking email:", error));
}
function deleteEmployee(id) {
  if (confirm("Are you sure you want to delete this employee?")) {
    fetch(`http://localhost:3000/deleteEmployee/${id}`, {
      method: "DELETE",
    })
      .then((response) => response.text())
      .then((data) => {
        // console.log(data);
        alert(data);
        loadEmployees();
      })
      .catch((error) => console.error("Error:", error));
  }
}

function addEmployeeToTable(employee) {
  console.log(employee);
  const tableBody = document.getElementById("employeeTableBody");
  const row = document.createElement("tr");

  row.innerHTML = `
        <td>${employee.Id}</td>
        <td>${employee.Name}</td>
        <td>${employee.Email}</td>
        <td>${employee.Mobile}</td>
        <td class="action-buttons">
            <button class="update" onclick="updateEmployee(${employee.Id}, '${employee.Name}', '${employee.Email}', '${employee.Mobile}')">Update</button>
            <button class="delete" onclick="deleteEmployee(${employee.Id})">Delete</button>
        </td>
    `;

  tableBody.appendChild(row);
}
searchEmployees = () => {
  const inputValue = document
    .getElementById("searchField")
    .value.trim()
    .toLowerCase();
  if (inputValue.length === 0) {
    alert("Please provide a value to search.");
  }
  const tableRows = document.querySelectorAll("#employeeTableBody tr");
  let matchFound = false;

  tableRows.forEach((row) => {
    const name = row.cells[1].textContent.toLowerCase();
    const email = row.cells[2].textContent.toLowerCase();
    const mobile = row.cells[3].textContent.toLowerCase();
    const rowMatch =
      name.includes(inputValue) ||
      email.includes(inputValue) ||
      mobile.includes(inputValue);

    row.style.display = rowMatch ? "" : "none";
    if (rowMatch) {
      matchFound = true;
    }
  });

  const noDataMsg = document.getElementById("noDataMsg");
  noDataMsg.style.display = matchFound ? "none" : "block";
};
