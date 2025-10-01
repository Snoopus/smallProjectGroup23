// This file contains all functions used by the buttons in the search page: Search, Edit (Save/Cancel), Delete
function searchContact() {
    let srch = document.getElementById("searchText").value;
    document.getElementById("contactSearchResult").innerHTML = "";
    document.getElementById("contactList").innerHTML = "";

    let tmp = { search: srch, userId: userId };
    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/SearchContact.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                let jsonObject = JSON.parse(xhr.responseText);

                if (jsonObject.error) {
                    let errorElement = document.getElementById("contactSearchResult");
                    errorElement.innerHTML = '<div class="text-danger">' + jsonObject.error + '</div>';

                    // Clear error message after 1 second
                    setTimeout(() => {
                        errorElement.innerHTML = "";
                    }, 1000);

                    // Hide pagination when there's an error
                    document.getElementById('paginationNav').style.display = 'none';

                    return;
                }

                // Pagination settings
                const itemsPerPage = 5; // Number of contacts per page
                const totalItems = jsonObject.results.length;
                const totalPages = Math.ceil(totalItems / itemsPerPage);
                const currentPage = window.currentPage || 1;
                const startIndex = (currentPage - 1) * itemsPerPage;
                const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
                if (currentPage > totalPages) {
                    currentPage = 1;
                }

                // Show/hide pagination nav based on results
                const paginationNav = document.getElementById('paginationNav');
                paginationNav.style.display = totalPages > 1 ? 'block' : 'none';

                // Update pagination controls
                updatePagination(currentPage, totalPages);

                // Create table with Bootstrap classes and custom styling
                let resultHTML = "<div class='d-flex justify-content-center'><table class='table-hover table-responsive-md' style='border-collapse: separate; border-spacing: 0; border-radius: 10px; overflow: hidden; margin: 0 auto; max-width: 95%; width: 100%;'>";
                resultHTML += "<thead style='background-color: #4d7ab4 !important;'><tr><th style='padding: 12px 15px; text-align: center; width: 18%;'>First Name</th><th style='padding: 12px 15px; text-align: center; width: 18%;'>Last Name</th><th style='padding: 12px 15px; text-align: center; width: 22%;'>Phone</th><th style='padding: 12px 15px; text-align: center; width: 25%;'>Email</th><th style='padding: 12px 15px; text-align: center; width: 17%;'>Actions</th></tr></thead>";
                resultHTML += "<tbody>";

                // Add each contact as a row with alternating colors
                for (let i = startIndex; i < endIndex; i++) {
                    let contact = jsonObject.results[i];
                    let rowColor = (i % 2 === 0) ? '#142f51' : '#24436a';
                    resultHTML += `<tr id='row_"${i}"' data-id='${contact.contactId}' style='background-color: ${rowColor};'>`;
                    resultHTML += "<td id='firstName_" + i + "' style='padding: 10px 15px; text-align: center; width: 18%;'>" + contact.firstName + "</td>";
                    resultHTML += "<td id='lastName_" + i + "' style='padding: 10px 15px; text-align: center; width: 18%;'>" + contact.lastName + "</td>";
                    resultHTML += "<td id='phone_" + i + "' style='padding: 10px 15px; text-align: center; width: 22%;'>" + formatPhoneNum(contact.phone) + "</td>";
                    resultHTML += "<td id='email_" + i + "' style='padding: 10px 15px; text-align: center; width: 25%;'>" + contact.email + "</td>";
                    resultHTML += `<td style='padding: 10px 15px; text-align: center; width: 17%;'><button class='btn btn-sm me-2' style='background-color: #c0d6df; border-color: #c0d6df; color: #000;' onclick='editContact(${i},"${contact.contactId}")'><i class='bi bi-pencil-square'></i></button>`
                    resultHTML += `<button class='btn btn-danger btn-sm' onclick='deleteContact("${contact.contactId}")'><i class='bi bi-trash3'></i></button></td>`;
                    resultHTML += "</tr>";
                }
                resultHTML += "</tbody></table></div>";

                // Display the results needs to be fixed
                document.getElementById("contactList").innerHTML = resultHTML;
                document.getElementById("contactSearchResult").innerHTML =
                    jsonObject.results.length > 0 ? "" : "No contacts found";
            }
        };
        xhr.send(jsonPayload);
    }
    catch (err) {
        document.getElementById("contactSearchResult").innerHTML = err.message;
    }

}

// Checking user input for characters excluding whitespaces.
function checkInput() {
    let searchText = document.getElementById('searchText');
    let searchButton = document.getElementById('searchButton');

    // Strip input of whitespace in front and end of string
    if (searchText.value.trim() !== '') {
        searchButton.disabled = false; // Enable the button
        searchButton.classList.remove('btn-secondary'); // Remove Gray color
        searchButton.classList.add('btn-primary'); // Add blue color
    } else {
        searchButton.disabled = true; // Disable the button
        searchButton.classList.remove('btn-primary'); // Remove blue color
        searchButton.classList.add('btn-secondary'); // Add gray color
    }
    // Clear the table and results when input is empty
    //document.getElementById("contactSearchResult").innerHTML = "";
    //document.getElementById("contactList").innerHTML = "";
}

function checkInputonSubmit() {
    let searchText = document.getElementById('searchText');
    let searchButton = document.getElementById('searchButton');

    // Strip input of whitespace in front and end of string
    if (searchText.value.trim() !== '') {
        searchContact();
    } else {
        return;
    }
    // Clear the table and results when input is empty
    //document.getElementById("contactSearchResult").innerHTML = "";
    //document.getElementById("contactList").innerHTML = "";
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

    // Cell become inputs
    cellFName.innerHTML = "<input class='form-control' id='edited_fName_" + rowIndex + "'value='" + fName + "'>";
    cellLName.innerHTML = "<input class='form-control' id='edited_lName_" + rowIndex + "'value='" + lName + "'>";
    cellPhone.innerHTML = "<input class='form-control' id='edited_phone_" + rowIndex + "'value='" + phone + "'>";
    cellEmail.innerHTML = "<input class='form-control' id='edited_email_" + rowIndex + "'value='" + email + "'>";

    // Action buttons Save/Cancel
    let actionOnTd = cellFName.parentElement.querySelector("td:last-child");
    actionOnTd.innerHTML = `<button class='btn btn-success btn-sm me-2' onclick='saveContact("${rowIndex}","${contactId}")'><i class='bi bi-check2'></i></button><button class='btn btn-danger btn-sm' onclick='cancelEdit("${rowIndex}","${JSON.stringify({ fName, lName, phone, email })}")'><i class='bi bi-x-circle'></i></button>`

}

// NEW: function to cancel the edit action
function cancelEdit(rowIndex, original_values) {
    // Restore cells to original values
    document.getElementById("firstName_" + rowIndex).textContent = original_values.fName;
    document.getElementById("lastName_" + rowIndex).textContent = original_values.lName;
    document.getElementById("phone_" + rowIndex).textContent = original_values.phone;
    document.getElementById("email_" + rowIndex).textContent = original_values.email;

    // Restores buttons back to Edit/Delete
    searchContact();
}

// New: function to save the edited cells
function saveContact(rowIndex, contactId) {
    document.getElementById("contactSearchResult").innerHTML = "";

    // Gather edits and trim white space from front and end.
    let firstName = document.getElementById("edited_fName_" + rowIndex).value.trim();
    let lastName = document.getElementById("edited_lName_" + rowIndex).value.trim();
    let phone = document.getElementById("edited_phone_" + rowIndex).value.trim();
    let email = document.getElementById("edited_email_" + rowIndex).value.trim();

    // Minimum requirement check 
    if (!firstName || !lastName) {
        document.getElementById("contactSearchResult").innerHTML = "First and Last name required!"
        return;
    }

    // Exit edit mode before API call
    document.getElementById("firstName_" + rowIndex).innerHTML = firstName;
    document.getElementById("lastName_" + rowIndex).innerHTML = lastName;
    document.getElementById("phone_" + rowIndex).innerHTML = formatPhoneNum(phone);
    document.getElementById("email_" + rowIndex).innerHTML = email;

    // Action buttons Save/Cancel - updated with custom edit button styling and padding
    let actionCell = document.getElementById("firstName_" + rowIndex).parentElement.querySelector("td:last-child");
    actionCell.innerHTML = `<button class='btn btn-sm me-2' style='background-color: #c0d6df; border-color: #c0d6df; color: #000;' onclick='editContact("${rowIndex}","${contactId}")'><i class='bi bi-pencil-square'></i></button>` +
        `<button class='btn btn-danger btn-sm' onclick='deleteContact("${contactId}")'><i class='bi bi-trash3'></i></button>`;

    // Apply padding to the action cell
    actionCell.style.padding = '10px 15px';
    actionCell.style.textAlign = 'center';

    let payload = {
        contactId,
        userId,
        firstName,
        lastName,
        phone,
        email
    };

    let url = urlBase + "/EditContact." + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    xhr.onreadystatechange = function () {
        if (this.readyState === 4) {
            let resp = {};
            try { resp = JSON.parse(this.responseText); } catch { }
            if (this.status !== 200 || resp.error) {
                let errorMsg = resp.error || "Update failed."
                if (errorMsg != "No contact by that id.") {
                    document.getElementById("contactSearchResult").innerHTML = '<div class="text-warning">' + errorMsg + '</div>';
                }
                return;
            }
            document.getElementById("contactSearchResult").innerHTML = "Contact updated successfully.";
            // Success reload contact list with updated data
            searchContact();
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

    let id = contactId;

    // Validate contact to delete
    if (!(id.length == 36)) {
        showMessage("Invalid contact!", 'danger');
        return;
    }

    // Store the contact ID and show modal
    pendingDeleteId = id;
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
                // Refresh the contact list
                searchContact();
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

// Function to update pagination controls
function updatePagination(currentPage, totalPages) {
    const paginationList = document.getElementById('paginationList');
    let paginationHTML = '';

    // Previous button
    paginationHTML += `
        <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
            <button class="page-link" style="background-color: #142f51;color: white;" onclick="changePage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}>
                <i class="bi bi-chevron-left"></i>
            </button>
        </li>`;

    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
        paginationHTML += `
            <li class="page-item ${currentPage === i ? 'active' : ''}">
                <button class="page-link" style="${currentPage === i ? 'background-color: #c0d6df;color: black;' : 'background-color: #142f51;color: white;'}" onclick="changePage(${i})">${i}</button>
            </li>`;
    }

    // Next button
    paginationHTML += `
        <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
            <button class="page-link" style="background-color: #142f51;color: white;" onclick="changePage(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''}>
                <i class="bi bi-chevron-right"></i>
            </button>
        </li>`;

    paginationList.innerHTML = paginationHTML;
}

// Function to handle page changes
function changePage(newPage) {
    // Validate page number
    if (newPage < 1) return;
    
    // Update current page
    window.currentPage = newPage;
    
    // Re-run search with new page
    let searchText = document.getElementById('searchText').value;
    if (searchText.trim() !== '') {
        searchContact();
    }
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