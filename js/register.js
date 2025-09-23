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

    // Validate inputs
    if (!firstName || !lastName || !login || !password) {
        document.getElementById("registerResult").innerHTML = "Please fill in all fields";
        return;
    }

    // Validate passwords
    if (password !== confirm_password) {
        document.getElementById("registerResult").innerHTML = "Wow buddy slow down the passwords do not match!";
        
        // Warn user of mismatch
        let password_warning = document.getElementById("userPassword");
        let conf_pass_warning = document.getElementById("userPassword-repeat");
        password_warning.setCustomValidity("Passwords do not match");
        conf_pass_warning.setCustomValidity("Passwords do not match");
        
        // Add warning style back
        document.querySelector('.need-validation').classList.add('was-validated');
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
    try
    {
        xhr.onreadystatechange = function() 
        {
            if (this.readyState == 4 && this.status == 200) 
            {
                let jsonObject = JSON.parse(xhr.responseText);
                
                if (jsonObject.error) {
                    document.getElementById("registerResult").innerHTML = jsonObject.error;
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
		document.getElementById("registerResult").innerHTML = err.message;
	}


}

