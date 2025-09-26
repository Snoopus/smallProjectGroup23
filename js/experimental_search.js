// Used to perform the contact search
function searchContact() {
    // Get value from input in search bar.
    let srch = document.getElementById("searchText").value;

    // No empty search allowed
    if (srch === '') {
        return;
    }

    // Prepping API payload
    let tmp = { search: srch, userId: userId };
    let jsonPayload = JSON.stringify(tmp);
    let url = urlBase + '/SearchContact.' + extension;

    // Create and configure XMLHttpRequest
    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    // Handle API response
    xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let jsonObject = JSON.parse(xhr.responseText);

            // Handle API errors
            if (jsonObject.error) {
                showMessage(jsonObject.error, 'danger');
                document.getElementById("contactList").innerHTML = "";
                return;
            }
            // Update table
            updateContactTable(jsonObject.results);
        }
    };
    // Success, send request
    xhr.send(jsonPayload);
}

// used to enable/disable search based on input
function checkInput() {
    let searchText = document.getElementById('searchText');
    let searchButton = document.getElementById('searchButton');

    // Enable search button with text only
    if (searchText.value.trim() !== '') {
        searchButton.disabled = false;
        searchButton.classList.remove('btn-secondary');
        searchButton.classList.add('btn-primary');
    } else {
        // Disable/Rest button
        searchButton.disabled = true;
        searchButton.classList.remove('btn-primary');
        searchButton.classList.add('btn-secondary');

        // Clear message abd table when no input
        document.getElementById("contactSearchResult").innerHTML = "";
        document.getElementById("contactList").innerHTML = "";
    }
}

// Used to make/display table with contacts
function updateContactTable(contacts) {
    // Build table w/ Bootstrap styling
    let tableHTML = "<table class='table table-striped table-hover table-responsive-md'>";
    tableHTML += "<thead class='table-warning'><tr><th>First Name</th><th>Last Name</th><th>Phone</th><th>Email</th><th>Actions</th></tr></thead>";
    tableHTML += "<tbody>";

    // Go through each contact and make table row w/ unique id
    contacts.forEach((contact, index) => {
        tableHTML += `<tr id='row_${index}' data-id='${contact.contactId}'>`;
        tableHTML += `<td id='firstName_${index}'>${contact.firstName}</td>`;
        tableHTML += `<td id='lastName_${index}'>${contact.lastName}</td>`;
        tableHTML += `<td id='phone_${index}'>${formatPhoneNum(contact.phone)}</td>`;
        tableHTML += `<td id='email_${index}'>${contact.email}</td>`;
        // Make buttons (Edit/delete) w/ Bootstrap styling
        tableHTML += `<td>
            <button class='btn btn-primary btn-sm me-2' onclick='editContact(${index}, ${contact.contactId})'>
                <i class='bi bi-pencil-square'></i>
            </button>
            <button class='btn btn-danger btn-sm' onclick='deleteContact(${contact.contactId})'>
                <i class='bi bi-trash3'></i>
            </button>
        </td>`;
        tableHTML += "</tr>";
    });


    tableHTML += "</tbody></table>";

    // Insert table into DOM
    document.getElementById("contactList").innerHTML = tableHTML;

    // Update result message
    document.getElementById("contactSearchResult").innerHTML = contacts.length > 0 ? '' : "No contact found";
}

// Edit function to add functionality to edit contact button
function editContact(rowIndex, contactId) {
    // Get current row values
    let cellFName = document.getElementById("firstName_" + rowIndex);
    let cellLName = document.getElementById("lastName_" + rowIndex);
    let cellPhone = document.getElementById("phone_" + rowIndex);
    let cellEmail = document.getElementById("email_" + rowIndex);

    // Getting rid of extra white space
    let fName = cellFName.textContent.trim();
    let lName = cellLName.textContent.trim();
    let phone = cellPhone.textContent.trim();
    let email = cellEmail.textContent.trim();

    // Cell become input fields pre filled with current values
    cellFName.innerHTML = "<input class='form-control' id='edited_fName_" + rowIndex + "'value='" + fName + "'>";
    cellLName.innerHTML = "<input class='form-control' id='edited_lName_" + rowIndex + "'value='" + lName + "'>";
    cellPhone.innerHTML = "<input class='form-control' id='edited_phone_" + rowIndex + "'value='" + phone + "'>";
    cellEmail.innerHTML = "<input class='form-control' id='edited_email_" + rowIndex + "'value='" + email + "'>";

    // Action buttons Edit/Delete swap for Save/Cancel
    let actionOnTd = cellFName.parentElement.querySelector("td:last-child");
    actionOnTd.innerHTML = "<button class='btn btn-success btn-sm me-2' onclick='saveContact(" + rowIndex + "," + contactId + ")'><i class='bi bi-check2'></i></button>" + "<button class='btn btn-danger btn-sm' onclick='cancelEdit(" + rowIndex + "," + JSON.stringify({ fName, lName, phone, email }) + ")'><i class='bi bi-x-circle'></i></button>"

}

// Restores original values to all cells
function cancelEdit(rowIndex, original_values) {
    // Restore cells to original values
    document.getElementById("firstName_" + rowIndex).textContent = original_values.fName;
    document.getElementById("lastName_" + rowIndex).textContent = original_values.lName;
    document.getElementById("phone_" + rowIndex).textContent = formatPhoneNum(original_values.phone);
    document.getElementById("email_" + rowIndex).textContent = original_values.email;

    // Restore buttons w/o full rebuild of table
    let actionCell = document.getElementById("firstName_" + rowIndex).parentElement.querySelector("td:last-child");
    let contactId = getContactIdFromRow(rowIndex);
    
    // Restore Save/Delete buttons
    actionCell.innerHTML = `<button class='btn btn-primary btn-sm me-2' onclick='editContact(${rowIndex}, ${contactId})'><i class='bi bi-pencil-square'></i></button><button class='btn btn-danger btn-sm' onclick='deleteContact(${contactId})'><i class='bi bi-trash3'></i></button>`;
}

// Gets the contact ID from the table row's data attribute
function getContactIdFromRow(rowIndex) {
    return document.getElementById("row_" + rowIndex).getAttribute("data-id");
}

// Validates edit fields data and sends update to API
function saveContact(rowIndex, contactId) {
    // Clear previous message
    document.getElementById("contactSearchResult").innerHTML = "";

    // Gather edits and trim white space from front and end.
    let firstName = document.getElementById("edited_fName_" + rowIndex).value.trim();
    let lastName = document.getElementById("edited_lName_" + rowIndex).value.trim();
    let phone = document.getElementById("edited_phone_" + rowIndex).value.trim();
    let email = document.getElementById("edited_email_" + rowIndex).value.trim();

    // Validate phone number
    if (phone) {
        let numbersOnly = phone.replace(/\D/g, '');

        if (numbersOnly.length !== 10) {
            showMessage("Phone number must be 10 digits!", 'danger');
            return;
        }

        phone = numbersOnly;
    }

    // email validation
    if (email) {
        // Regex pattern
        let emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(email)) {
            showMessage("Please valid email address!", 'danger');
            return;
        }
    }

    // Minimum requirement check 
    if (!firstName || !lastName) {
        showMessage("First and Last name required!", 'danger');
        return;
    }


    // Store current values
    let currValues = {
        firstName: firstName,
        lastName: lastName,
        phone: phone,
        email: email

    };

    // Update contact
    document.getElementById("firstName_" + rowIndex).innerHTML = firstName;
    document.getElementById("lastName_" + rowIndex).innerHTML = lastName;
    document.getElementById("phone_" + rowIndex).innerHTML = formatPhoneNum(phone);
    document.getElementById("email_" + rowIndex).innerHTML = email;

    // Restore action buttons Edit/Delete
    let actionCell = document.getElementById("firstName_" + rowIndex).parentElement.querySelector("td:last-child");
    actionCell.innerHTML = `<button class='btn btn-primary btn-sm me-2' onclick='editContact(${rowIndex}, ${contactId})'><i class='bi bi-pencil-square'></i></button>
    <button class='btn btn-danger btn-sm' onclick='deleteContact(${contactId})'><i class='bi bi-trash3'></i></button>`;

    // API payload
    let payload = {
        contactId: Number(contactId),
        userId: Number(userId),
        firstName, lastName, phone, email
    };

    // Send API request
    let url = urlBase + '/EditContact.' + extension;
    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    xhr.onreadystatechange = function () {
        if (this.readyState === 4) {
            let resp = {};
            try { resp = JSON.parse(this.responseText); } catch { }
            if (this.status !== 200 || resp.error) {
                document.getElementById("firstName_" + rowIndex).innerHTML = currValues.firstName;
                document.getElementById("lastName_" + rowIndex).innerHTML = currValues.lastName;
                document.getElementById("phone_" + rowIndex).innerHTML = currValues.phone;
                document.getElementById("email_" + rowIndex).innerHTML = currValues.email;
                return;
            }
            showMessage("Contact updated", 'success');
        }
    };
    xhr.send(JSON.stringify(payload))
}

// Global variable to store the contact ID for deletion
let pendingDeleteId = null;

// Starts deletion process via confirmation modal
function deleteContact(contactId) {
    // Clear previous messages
    document.getElementById("contactSearchResult").innerHTML = "";

    let idNum = Number(contactId);
   
    // Validate contact to delete
    if (!Number.isInteger(idNum) || idNum <= 0) {
        showMessage("Invalid contact!", 'danger');
        return;
    }

    // Store the contact ID and show modal
    pendingDeleteId = idNum;
    let deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));
    deleteModal.show();
}

// Performs the deletion of a contact
function executeDelete() {
    // Check if we have contact ID
    if (!pendingDeleteId) {
        return;
    }

    // API payload
    let tmp = {
        contactId: pendingDeleteId,
        userId: userId
    };

    let jsonPayload = JSON.stringify(tmp);
    let url = urlBase + '/DeleteContact.' + extension;

    // Send deletion request
    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                let response = JSON.parse(xhr.responseText);
                if (response.error) {
                    showMessage(response.error, 'danger');
                    return;
                }
                // Remove deleted contact row
                let row = document.querySelector(`tr[data-id="${pendingDeleteId}"]`);
                if (row) {
                    row.remove();
                }
                // Clear table from field
                document.getElementById("contactList").innerHTML = "";
                showMessage("Contact deleted successfully", 'success');
            }
        };
        xhr.send(jsonPayload);
    }
    catch (err) {
        showMessage(err.message, 'danger');
    }

    // Reset the pending delete ID
    pendingDeleteId = null;
}

// Shows status message w/ 1 second clearing 
function showMessage(message, type = 'danger') {
    let element = document.getElementById("contactSearchResult");
    element.innerHTML = `<div class="text-${type} fw-bold text-center">${message}</div>`;

    // Clear error message after 1 second
    setTimeout(() => {
        element.innerHTML = "";
    }, 1000);
}

// Formats phone number for consistency 
function formatPhoneNum(phone) {
    let strippedPh = phone.replace(/\D/g, '')
    return strippedPh.replace(/(\d{3})(\d{3})(\d{4})/, '($1)-$2-$3');
}

// Handles the delete confirmation modal
document.addEventListener('DOMContentLoaded', function () {
    // Handle the confirm delete button click
    document.getElementById('confirmDeleteBtn').addEventListener('click', function () {
        // Hide the modal
        let deleteModal = bootstrap.Modal.getInstance(document.getElementById('deleteModal'));
        deleteModal.hide();

        // Execute the delete
        executeDelete();
    });
});