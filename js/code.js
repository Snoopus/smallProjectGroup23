const urlBase = 'http://localhost/contact_manager/LAMPAPI'; // COMMENT ME OUT!!!
// const urlBase = 'https://poosd.ilovenarwhals.xyz/LAMPAPI'; <<< USED THIS!!!
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";

function doLogin() {
    userId = 0;
    firstName = "";
    lastName = "";

    let login = document.getElementById("loginName").value;
    let password = document.getElementById("loginPassword").value;
    //	var hash = md5( password );

    document.getElementById("loginResult").innerHTML = "";

    let tmp = { login: login, password: password };
    //	var tmp = {login:login,password:hash};
    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/Login.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                let jsonObject = JSON.parse(xhr.responseText);
                userId = jsonObject.id;

                if (userId < 1) {
                    document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
                    return;
                }

                firstName = jsonObject.firstName;
                lastName = jsonObject.lastName;

                saveCookie();

                window.location.href = "search.html"; // changed to contacts
            }
        };
        xhr.send(jsonPayload);
    }
    catch (err) {
        document.getElementById("loginResult").innerHTML = err.message;
    }

}

function doRegister() {
    // Get the input values
    let firstName = document.getElementById("userFirstName").value;
    let lastName = document.getElementById("userLastName").value;
    let login = document.getElementById("userName").value;
    let password = document.getElementById("userPassword").value;

    // Clear any previous error messages
    document.getElementById("registerResult").innerHTML = "";

    // Validate inputs
    if (!firstName || !lastName || !login || !password) {
        document.getElementById("registerResult").innerHTML = "Please fill in all fields";
        return;
    }

    let tmp = {
        firstName: firstName,
        lastName: lastName,
        login: login,
        password: password
    };
    let jsonPayload = JSON.stringify(tmp);
    let url = urlBase + '/Register.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                let jsonObject = JSON.parse(xhr.responseText);

                if (jsonObject.error) {
                    document.getElementById("registerResult").innerHTML = jsonObject.error;
                    return;
                }

                userId = jsonObject.id;
                firstName = jsonObject.firstName;
                lastName = jsonObject.lastName;

                saveCookie();

                // Registration successful, redirect to login page
                window.location.href = "search.html";
            }
        };
        xhr.send(jsonPayload);
    }
    catch (err) {
        document.getElementById("registerResult").innerHTML = err.message;
    }


}

function saveCookie() {
    let minutes = 20;
    let date = new Date();
    date.setTime(date.getTime() + (minutes * 60 * 1000));
    document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

function readCookie() {
    userId = -1;
    let data = document.cookie;
    let splits = data.split(",");
    for (var i = 0; i < splits.length; i++) {
        let thisOne = splits[i].trim();
        let tokens = thisOne.split("=");
        if (tokens[0] == "firstName") {
            firstName = tokens[1];
        }
        else if (tokens[0] == "lastName") {
            lastName = tokens[1];
        }
        else if (tokens[0] == "userId") {
            userId = parseInt(tokens[1].trim());
        }
    }

    if (userId < 0) {
        window.location.href = "index.html";
    }
    else {
        //		document.getElementById("userName").innerHTML = "Logged in as " + firstName + " " + lastName;
    }
}

function doLogout() {
    userId = 0;
    firstName = "";
    lastName = "";
    document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
    window.location.href = "index.html";
}


// ===================================== TODO: Create function to validate password re-entry ============================================

function addContact() {
    let firstName = document.getElementById("contactTextFirstName").value;
    let lastName = document.getElementById("contactTextLastName").value;
    let phone = document.getElementById("contactTextPhone").value;
    let email = document.getElementById("contactTextEmail").value;

    // Clear previous messages
    document.getElementById("contactAddResult").innerHTML = "";

    // Validate inputs
    if (!firstName || !lastName || !phone || !email) {
        document.getElementById("contactAddResult").innerHTML = "Please fill in all fields";
        return;
    }

    let tmp = {
        firstName: firstName,
        lastName: lastName,
        phone: phone,
        email: email,
        userId: userId
    };
    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/AddContacts.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                let response = JSON.parse(xhr.responseText);
                if (response.error) {
                    document.getElementById("contactAddResult").innerHTML = response.error;
                    return;
                }
                document.getElementById("contactAddResult").innerHTML = "Contact added successfully";

                // Clear the input fields
                document.getElementById("contactTextFirstName").value = "";
                document.getElementById("contactTextLastName").value = "";
                document.getElementById("contactTextPhone").value = "";
                document.getElementById("contactTextEmail").value = "";

                // Refresh the contact list
                searchContact();
            }
        };
        xhr.send(jsonPayload);
    }
    catch (err) {
        document.getElementById("contactAddResult").innerHTML = err.message;
    }
}

function validateAndSubmit() {
    // Get the form
    const form = document.querySelector('.needs-validation');

    // Check if the form is valid
    if (!form.checkValidity()) {
        // If the form is not valid, show the validation messages
        form.classList.add('was-validated');
        return false;
    }
    return;
}

function searchContact() {
    let srch = document.getElementById("searchText").value;
    document.getElementById("contactSearchResult").innerHTML = "";
    document.getElementById("contactList").innerHTML = "";

    let tmp = { search: srch, userId: userId };
    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/SearchContacts.' + extension;

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
                let resultHTML = "<table class='table table-striped table-hover'>";
                resultHTML += "<thead class='table-primary'><tr><th>Name</th><th>Phone</th><th>Email</th><th>Actions</th></tr></thead>";
                resultHTML += "<tbody>";

                // Add each contact as a row
                for (let i = 0; i < jsonObject.results.length; i++) {
                    let contact = jsonObject.results[i];
                    resultHTML += "<tr>";
                    resultHTML += "<td>" + contact.FirstName + " " + contact.LastName + "</td>";
                    resultHTML += "<td>" + contact.Phone + "</td>";
                    resultHTML += "<td>" + contact.Email + "</td>";
                    resultHTML += "<td><button class='btn btn-info btn-sm me-2' onclick='editContact(" + contact.ID + ")'>Edit</button>" +
                        "<button class='btn btn-danger btn-sm' onclick='deleteContact(" + contact.ID + ")'>Delete</button></td>";
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
// ==================================TODO======================================
function editContact(id) {
    // Get the contact details from your server
    // Show a form/modal with current values
    // Update the contact when form is submitted
}

function deleteContact(id) {
    // Show confirmation dialog
    if(confirm("Are you sure you want to delete this contact?")) {
        // Send delete request to your server
        // If successful, refresh the search results
    }
}
// ==================================================================================