
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
