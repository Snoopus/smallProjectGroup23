function formatPhoneNum(phone) {
    let strippedPh = phone.replace(/\D/g, '')
    if (strippedPh.length === 10) {

        return strippedPh.replace(/(\d{3})(\d{3})(\d{4})/, '($1)-$2-$3');
    }
    return 0;
}

function addContact() {
    let firstName = document.getElementById("contactTextFirstName").value;
    let lastName = document.getElementById("contactTextLastName").value;
    let phone = document.getElementById("contactTextPhone").value;
    let email = document.getElementById("contactTextEmail").value;

    // Clear previous messages
    document.getElementById("contactAddResult").innerHTML = "";

    // Validate inputs
    if (!firstName || !lastName) {
        let element = document.getElementById("contactAddResult");
        element.innerHTML = "First and Last name are required!";
        setTimeout(() => {
            element.innerHTML = "";
        }, 2000);
        return;
    }
    // Validate phone number
    if (phone) {
        let numbersOnly = phone.replace(/\D/g, '');

        if (numbersOnly.length !== 10) {
            let element = document.getElementById("contactAddResult");
            element.innerHTML = "Phone number must be 10 digits!";
            setTimeout(() => {
                element.innerHTML = "";
            }, 2000);
            return;
        }

        phone = numbersOnly;
    }
    // email validation
    if (email) {
        // Regex pattern
        let emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(email)) {
            let element = document.getElementById("contactAddResult");
            element.innerHTML = "Please valid email address!";
            setTimeout(() => {
                element.innerHTML = "";
            }, 2000);
            return;
        }
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
    try {
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                let response = JSON.parse(xhr.responseText);
                if (response.error) {
                    document.getElementById("contactAddResult").innerHTML = response.error;
                    return;
                }
                // Modify and display success message w/ green color. 
                let res = document.getElementById("contactAddResult");
                if (res) {
                    res.innerHTML = "Contact added successfully";
                    res.classList.remove('text-danger');
                    res.classList.add('text-success');

                    // Clear success message in 1 seconds.
                    setTimeout(() => {
                        res.innerHTML = "";
                        res.className = "mt-3 fw-bold text-center text-danger";
                    }, 1000);
                }

                // Clear the input fields
                document.getElementById("contactTextFirstName").value = "";
                document.getElementById("contactTextLastName").value = "";
                document.getElementById("contactTextPhone").value = "";
                document.getElementById("contactTextEmail").value = "";

                // Clear validation
                document.querySelector('.needs-validation').classList.remove('was-validated');

            }
        };
        xhr.send(jsonPayload);
    }
    catch (err) {
        document.getElementById("contactAddResult").innerHTML = err.message;
    }
}