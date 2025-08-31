// const urlBase = 'http://COP4331-5.com/LAMPAPI';
const urlBase = 'https://poosd.ilovenarwhals.xyz/LAMPAPI';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";

function doLogin()
{
	userId = 0;
	firstName = "";
	lastName = "";
	
	let login = document.getElementById("loginName").value;
	let password = document.getElementById("loginPassword").value;
//	var hash = md5( password );
	
	document.getElementById("loginResult").innerHTML = "";

	let tmp = {login:login,password:password};
//	var tmp = {login:login,password:hash};
	let jsonPayload = JSON.stringify( tmp );
	
	let url = urlBase + '/Login.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				let jsonObject = JSON.parse( xhr.responseText );
				userId = jsonObject.id;
		
				if( userId < 1 )
				{		
					document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
					return;
				}
		
				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;

				saveCookie();
	
				window.location.href = "contacts.html"; // changed to contacts
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("loginResult").innerHTML = err.message;
	}

}

function doRegister()
{
    // Get the input values
    let firstName = document.getElementById("registerFirstName").value;
    let lastName = document.getElementById("registerLastName").value;
    let login = document.getElementById("registerUserName").value;
    let password = document.getElementById("registerPassword").value;

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

                userId = jsonObject.id;
                firstName = jsonObject.firstName;
                lastName = jsonObject.lastName;

                saveCookie();
                
                // Registration successful, redirect to login page
                window.location.href = "index.html";
            }
        };
        xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("registerResult").innerHTML = err.message;
	}


}

function saveCookie()
{
	let minutes = 20;
	let date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));	
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

function readCookie()
{
	userId = -1;
	let data = document.cookie;
	let splits = data.split(",");
	for(var i = 0; i < splits.length; i++) 
	{
		let thisOne = splits[i].trim();
		let tokens = thisOne.split("=");
		if( tokens[0] == "firstName" )
		{
			firstName = tokens[1];
		}
		else if( tokens[0] == "lastName" )
		{
			lastName = tokens[1];
		}
		else if( tokens[0] == "userId" )
		{
			userId = parseInt( tokens[1].trim() );
		}
	}
	
	if( userId < 0 )
	{
		window.location.href = "index.html";
	}
	else
	{
//		document.getElementById("userName").innerHTML = "Logged in as " + firstName + " " + lastName;
	}
}

function doLogout()
{
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}

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

function searchColor()
{
	let srch = document.getElementById("searchText").value;
	document.getElementById("colorSearchResult").innerHTML = "";
	
	let colorList = "";

	let tmp = {search:srch,userId:userId};
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/SearchColors.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				document.getElementById("colorSearchResult").innerHTML = "Color(s) has been retrieved";
				let jsonObject = JSON.parse( xhr.responseText );
				
				for( let i=0; i<jsonObject.results.length; i++ )
				{
					colorList += jsonObject.results[i];
					if( i < jsonObject.results.length - 1 )
					{
						colorList += "<br />\r\n";
					}
				}
				
				document.getElementsByTagName("p")[0].innerHTML = colorList;
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("colorSearchResult").innerHTML = err.message;
	}
	
}

function searchContact()
{
    let srch = document.getElementById("searchText").value;
    document.getElementById("contactSearchResult").innerHTML = "";
    let contactList = "";

    let tmp = {search:srch, userId:userId};
    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/SearchContacts.' + extension;
    
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
                    return;
                }

                // Create table header
                let resultHTML = "<table border='1' style='width:100%; border-collapse: collapse;'>";
                resultHTML += "<tr><th>Name</th><th>Phone</th><th>Email</th></tr>";
                
                // Add each contact as a row
                for(let i = 0; i < jsonObject.results.length; i++)
                {
                    let contact = jsonObject.results[i];
                    resultHTML += "<tr>";
                    resultHTML += "<td>" + contact.FirstName + " " + contact.LastName + "</td>";
                    resultHTML += "<td>" + contact.Phone + "</td>";
                    resultHTML += "<td>" + contact.Email + "</td>";
                    resultHTML += "</tr>";
                }
                resultHTML += "</table>";
                
                // Display the results
                document.getElementById("contactList").innerHTML = resultHTML;
                document.getElementById("contactSearchResult").innerHTML = 
                    jsonObject.results.length > 0 ? "Contacts found" : "No contacts found";
                
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
                
                document.getElementById("colorList").innerHTML = resultHTML;
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
