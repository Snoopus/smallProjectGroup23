// function searchContact()
// {
//     let srch = document.getElementById("searchText").value;
//     document.getElementById("contactSearchResult").innerHTML = "";
//     let contactList = "";

//     let tmp = {search:srch, userId:userId};
//     let jsonPayload = JSON.stringify(tmp);

//     let url = urlBase + '/SearchContact.' + extension;
    
//     let xhr = new XMLHttpRequest();
//     xhr.open("POST", url, true);
//     xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
//     try
//     {
//         xhr.onreadystatechange = function() 
//         {
//             if (this.readyState == 4 && this.status == 200) 
//             {
//                 let jsonObject = JSON.parse(xhr.responseText);
                
//                 if (jsonObject.error) {
//                     document.getElementById("contactSearchResult").innerHTML = jsonObject.error;
//                     document.getElementById("contactList").innerHTML = "";
//                     return;
//                 }

//                 if(jsonObject.results.length === 0) {
//                     document.getElementById("contactSearchResult").innerHTML = "No contacts found";
//                     document.getElementById("contactList").innerHTML = "";
//                 } else {
//                     document.getElementById("contactSearchResult").innerHTML = "Contacts found";
//                     // Create table header
//                     let resultHTML = "<table border='1' style='width:100%; border-collapse: collapse;'>";
//                     resultHTML += "<tr><th>Name</th><th>Phone</th><th>Email</th></tr>";
                    
//                     // Add each contact as a row
//                     for(let i = 0; i < jsonObject.results.length; i++)
//                     {
//                         let contact = jsonObject.results[i];
//                         resultHTML += "<tr>";
//                         resultHTML += "<td>" + contact.firstName + " " + contact.lastName + "</td>";
//                         resultHTML += "<td>" + contact.phone + "</td>";
//                         resultHTML += "<td>" + contact.email + "</td>";
//                         resultHTML += "</tr>";
//                     }
//                     resultHTML += "</table>";
                    
//                     // Display the results
//                     document.getElementById("contactList").innerHTML = resultHTML;
//                 }
                
//                 if (jsonObject.error) {
//                     document.getElementById("contactSearchResult").innerHTML = jsonObject.error;
//                     return;
//                 }

//                 // Create a table for better display
//                 resultHTML = "<table border='1'><tr><th>Name</th><th>Phone</th><th>Email</th></tr>";
                
//                 for(let i = 0; i < jsonObject.results.length; i++)
//                 {
//                     let contact = jsonObject.results[i];
//                     resultHTML += "<tr><td>" + contact.FirstName + " " + contact.LastName + 
//                                 "</td><td>" + contact.Phone + 
//                                 "</td><td>" + contact.Email + "</td></tr>";
//                 }
//                 resultHTML += "</table>";
                
//                 //document.getElementById("colorList").innerHTML = resultHTML;
//                 document.getElementById("contactSearchResult").innerHTML = "Contacts retrieved";
//             }
//         };
// 		xhr.send(jsonPayload);
// 	}
// 	catch(err)
// 	{
// 		document.getElementById("contactSearchResult").innerHTML = err.message;
// 	}
	
// }

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
                    resultHTML += "<td>" + contact.firstName + " " + contact.lastName + "</td>";
                    resultHTML += "<td>" + contact.phone + "</td>";
                    resultHTML += "<td>" + contact.email + "</td>";
                    resultHTML += "<td><button class='btn btn-info btn-sm me-2' onclick='editContact(" + contact.id + ")'>Edit</button>" +
                        "<button class='btn btn-danger btn-sm' onclick='deleteContact(" + contact.id + ")'>Delete</button></td>";
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
