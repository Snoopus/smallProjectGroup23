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
                    document.getElementById("contactSearchResult").innerHTML = jsonObject.error;
                    return;
                }

                // Create table with Bootstrap classes
                let resultHTML = "<table class='w-auto table center-table table-striped table-bordered table-hover'>";
                resultHTML += "<thead class='table-primary'><tr><th>First Name</th><th>Last Name</th><th>Phone</th><th>Email</th><th>Actions</th></tr></thead>";
                resultHTML += "<tbody>";

                // Add each contact as a row
                for (let i = 0; i < jsonObject.results.length; i++) {
                    let contact = jsonObject.results[i];
                    resultHTML += "<tr id='row_" + i + "' data-id='" + contact.contactId + "'>";
                    resultHTML += "<td id='firstName_" + i + "'>" + contact.firstName + "</td>";
                    resultHTML += "<td id='lastName_" + i + "'>" + contact.lastName + "</td>";
                    resultHTML += "<td id='phone_" + i + "'>" + contact.phone + "</td>";
                    resultHTML += "<td id='email_" + i + "'>" + contact.email + "</td>";
                    resultHTML += "<td><button class='btn btn-info btn-sm me-2' onclick='editContact(" + i + "," + contact.contactId + ")'><i class='bi bi-pencil-square'></i></button>" +
                        "<button class='btn btn-danger btn-sm' onclick='deleteContact(" + contact.contactId + ")'><i class='bi bi-trash3'></i></button></td>";
                    resultHTML += "</tr>";
                }
                resultHTML += "</tbody></table>";

                // Display the results
                document.getElementById("contactList").innerHTML = resultHTML;
                document.getElementById("contactSearchResult").innerHTML =
                    jsonObject.results.length > 0 ? "Contacts found" : "No contacts found";
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
  } else {
    searchButton.disabled = true; // Disable the button
  }
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
    actionOnTd.innerHTML = "<button class='btn btn-success btn-sm me-2' onclick='saveContact(" + rowIndex + "," + contactId + ")'><i class='bi bi-check2'></i></button>" + "<button class='btn btn-danger btn-sm' onclick='cancelEdit(" + rowIndex + "," + JSON.stringify({fName,lName,phone,email}) + ")'><i class='bi bi-x-circle'></i></button>"

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
    document.getElementById("contactDeleteResult").innerHTML = "";

    // Gather edits and trim white space from front and end.
    let firstName = document.getElementById("edited_fName_" + rowIndex).value.trim();
    let lastName = document.getElementById("edited_lName_" + rowIndex).value.trim();
    let phone = document.getElementById("edited_phone_" + rowIndex).value.trim();
    let email = document.getElementById("edited_email_" + rowIndex).value.trim();
    
    // Minimum requirement check 
    if (!firstName || !lastName) {
        document.getElementById("contactDeleteResult").innerHTML = "First and Last name required!"
    }
    let payload = {
        contactId: Number(contactId),
        userId: Number(userId),
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
        if(this.readyState === 4) {
            let resp = {};
            try { resp = JSON.parse(this.responseText); } catch {}
            if (this.status !== 200 || resp.error) {
                document.getElementById("contactDeleteResult").innerHTML = resp.error || "Update failed.";
                return;
            }
            // Success --> reload contact list with updated data
            searchContact();
        }
    };
    xhr.send(JSON.stringify(payload))
}

// NEW: delete function to add functionality to delete contact button
function deleteContact(contactId) {
    // Clear previous messages
    document.getElementById("contactDeleteResult").innerHTML = "";

    let idNum = Number(contactId);
    // Validate contact to delete
    if (!Number.isInteger(idNum) || idNum <= 0) {
        document.getElementById("contactDeleteResult").innerHTML = "Invalid contact!";
        return;
    }

    // TODO: To be changed to modal component
    if (!confirm("You are about to delete this contact! Confirm by clicking okay.")) {
        return;
    }

    let tmp = {
        contactId: idNum,
        userId: userId
    };

    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/DeleteContact.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
            xhr.onreadystatechange = function () {

                if (this.readyState == 4 && this.status == 200) {
                    let response = JSON.parse(xhr.responseText);
                    if (response.error) {
                        document.getElementById("contactDeleteResult").innerHTML = response.error;
                        return;
                    }
                    document.getElementById("contactDeleteResult").innerHTML = "Contact deleted successfully";

                    // Refresh the contact list
                    searchContact();
                }
            };
            xhr.send(jsonPayload);
    }
    catch (err) {
        document.getElementById("contactDeleteResult").innerHTML = err.message;
    }
}
