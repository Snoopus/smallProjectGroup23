function addContact()
{
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

    let url = urlBase + '/AddContact.' + extension;
    
    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try
    {
        xhr.onreadystatechange = function() 
        {
            if (this.readyState == 4 && this.status == 200) 
            {
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
    catch(err)
    {
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