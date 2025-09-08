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

function searchContact()
{
    let srch = document.getElementById("searchText").value;
    document.getElementById("contactSearchResult").innerHTML = "";
    let contactList = "";

    let tmp = {search:srch, userId:userId};
    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/SearchContact.' + extension;
    
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
                    document.getElementById("contactSearchResult").innerHTML = jsonObject.error;
                    document.getElementById("contactList").innerHTML = "";
                    return;
                }

                if(jsonObject.results.length === 0) {
                    document.getElementById("contactSearchResult").innerHTML = "No contacts found";
                    document.getElementById("contactList").innerHTML = "";
                } else {
                    document.getElementById("contactSearchResult").innerHTML = "Contacts found";
                    // Create table header
                    let resultHTML = "<table border='1' style='width:100%; border-collapse: collapse;'>";
                    resultHTML += "<tr><th>Name</th><th>Phone</th><th>Email</th></tr>";
                    
                    // Add each contact as a row
                    for(let i = 0; i < jsonObject.results.length; i++)
                    {
                        let contact = jsonObject.results[i];
                        resultHTML += "<tr>";
                        resultHTML += "<td>" + contact.firstName + " " + contact.lastName + "</td>";
                        resultHTML += "<td>" + contact.phone + "</td>";
                        resultHTML += "<td>" + contact.email + "</td>";
                        resultHTML += "</tr>";
                    }
                    resultHTML += "</table>";
                    
                    // Display the results
                    document.getElementById("contactList").innerHTML = resultHTML;
                }
                
                if (jsonObject.error) {
                    document.getElementById("contactSearchResult").innerHTML = jsonObject.error;
                    return;
                }

                // Create a table for better display
                resultHTML = "<table border='1'><tr><th>Name</th><th>Phone</th><th>Email</th></tr>";
                
                for(let i = 0; i < jsonObject.results.length; i++)
                {
                    let contact = jsonObject.results[i];
                    resultHTML += "<tr><td>" + contact.FirstName + " " + contact.LastName + 
                                "</td><td>" + contact.Phone + 
                                "</td><td>" + contact.Email + "</td></tr>";
                }
                resultHTML += "</table>";
                
                //document.getElementById("colorList").innerHTML = resultHTML;
                document.getElementById("contactSearchResult").innerHTML = "Contacts retrieved";
            }
        };
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("contactSearchResult").innerHTML = err.message;
	}
	
}
