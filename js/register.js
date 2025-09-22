

function doRegister()
{
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
                // firstName = jsonObject.firstName;
                // lastName = jsonObject.lastName;
                console.log(firstName);
                console.log(lastName);

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

