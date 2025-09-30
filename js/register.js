function doRegister()
{
    // Get the input values
    firstName = document.getElementById("userFirstName").value;
    lastName = document.getElementById("userLastName").value;
    let login = document.getElementById("userName").value;
    let password = document.getElementById("userPassword").value;
    let confirm_password = document.getElementById("userPassword-repeat").value;

    // Clear any previous error messages
    document.getElementById("registerResult").innerHTML = "";

    let validation = validateRegisterData(firstName, lastName, login, password, confirm_password);

    if (!validation.isValid) {
        showFieldErrorMessage(validation.error, validation.fieldId);
        return;
    }

    let tmp = {
        firstName: validation.cleanData.firstName,
        lastName: validation.cleanData.lastName,
        login: validation.cleanData.login,
        password: md5(validation.cleanData.password)
    };
    let jsonPayload = JSON.stringify(tmp);
    let url = urlBase + '/Register.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try
    {
        xhr.onreadystatechange = function() 
        {
            if (this.readyState == 4 && this.status == 200) 
            {
                let jsonObject = JSON.parse(xhr.responseText);
                
                if (jsonObject.error) {
                    showMessage(jsonObject.error,'danger','registerResult');
                    return;
                }

                userId = jsonObject.userId;
                // firstName = document.getElementById("userFirstName").value;
                // lastName = document.getElementById("userLastName").value;
                console.log("Firstname: " + firstName + " Lastname: " + lastName + " UserID: " + userId);

                saveCookie();
                
                // Registration successful, redirect to login page
                window.location.href = "search.html";
            }
        };
        xhr.send(jsonPayload);
	}
	catch(err)
	{
		showMessage(err.message,'danger','registerResult');
	}


}

// Adapted form Paradise app
// Function to validate user registration
// Validate contact information
function validateRegisterData(firstName, lastName, login, password, confirm_password) {
	firstName = firstName.trim();
	lastName = lastName.trim();
	login = login.trim();
	password = password.trim();
    confirm_password = confirm_password.trim();

    // Clear any previous error messages
    document.getElementById("registerResult").innerHTML = "";

    // Validate inputs
    if (!firstName || !lastName || !login || !password || !confirm_password) {
        return {
            isValid: false,
            error: "Please fill all fields"
        };
    }

    // Validate passwords
    if (password !== confirm_password) {
        return {
            isValid: false,
            error: "Passwords do not match!",
            fieldId: 'userPassword-repeat'
        };
    }
    
    // Adapted from the Paradise app
	// Username validation (3-18 characters, letters/numbers/dash/underscore)
    let userNameRegex = /^[a-zA-Z0-9_-]{3,18}$/;
	if (!userNameRegex.test(login)) {
        return {
            isValid: false,
            error: "Username must be 3-18 characters (letters, numbers, dash, underscore only)",
            fieldId: 'userName'
        };
	}

	let passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*]).{8,32}$/;
	if (!passwordRegex.test(password)) {
        return {
            isValid: false,
            error: "Password must be 8-32 characters with at least 1 letter, 1 digit, and 1 special character",
            fieldId: 'userPassword'
        };
	}

	return {
		isValid: true,
		cleanData: {
			firstName: firstName,
			lastName: lastName,
			login: login,
			password: password
		}
	};
}

function showFieldErrorMessage(message, fieldId=null, defaultElementId='registerResult') {
    if (fieldId) {
        let field = document.getElementById(fieldId);
        if (field) {
            // Find invalid-feedback div in the same parent
            let feedback = field.parentElement.querySelector('.invalid-feedback');
            if (feedback) {
                feedback.textContent = message;
                field.setCustomValidity(message);
                field.classList.add('is-invalid');
                document.querySelector('.needs-validation').classList.add('was-validated');
                return;
            } 
        }
    }
    showMessage(message, 'danger', defaultElementId)
}

// Shows status message w/ 1 second clearing 
function showMessage(message, type = 'danger', elementId = null, duration = 2000) {
	let element = document.getElementById(elementId);

	// For debugging
	if (!element) {
		console.warn('No element ID provided');
        return;
	}
	element.innerHTML = `<div class="text-${type} fw-bold text-center">${message}</div>`;

	// Clear error message after 1 second
	setTimeout(() => {
		element.innerHTML = "";
	}, duration);
}