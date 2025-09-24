window.addEventListener('DOMContentLoaded', function() {
    readCookie();
    document.getElementById('inner-title').textContent = 'Logged in as ' + firstName + ' ' + lastName + '.';
    console.log('Account page loaded');
    console.log('User ID:', userId);
    console.log('First Name:', firstName);
    console.log('Last Name:', lastName);
});

function changeUser() {
    // Create modal background
    let modalBg = document.createElement('div');
    modalBg.style.position = 'fixed';
    modalBg.style.top = '0';
    modalBg.style.left = '0';
    modalBg.style.width = '100vw';
    modalBg.style.height = '100vh';
    modalBg.style.backgroundColor = 'rgba(0,0,0,0.5)';
    modalBg.style.display = 'flex';
    modalBg.style.alignItems = 'center';
    modalBg.style.justifyContent = 'center';
    modalBg.style.zIndex = '9999';

    // Create modal box
    let modalBox = document.createElement('div');
    modalBox.style.background = '#211f1fff';
    modalBox.style.padding = '30px 20px';
    modalBox.style.borderRadius = '10px';
    modalBox.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
    modalBox.style.minWidth = '320px';
    modalBox.style.textAlign = 'center';

    // Form container for labels and inputs
    let formContainer = document.createElement('div');
    formContainer.style.display = 'flex';
    formContainer.style.flexDirection = 'column';
    formContainer.style.alignItems = 'stretch';
    formContainer.style.gap = '10px';

    // Old password row
    let oldPassRow = document.createElement('div');
    oldPassRow.style.display = 'flex';
    oldPassRow.style.alignItems = 'center';
    let oldPassLabel = document.createElement('label');
    oldPassLabel.textContent = 'Password';
    oldPassLabel.style.width = '110px';
    oldPassLabel.style.marginRight = '10px';
    oldPassLabel.setAttribute('for', 'oldPasswordInput');
    let oldPassInput = document.createElement('input');
    oldPassInput.type = 'password';
    oldPassInput.placeholder = 'Enter password';
    oldPassInput.style.flex = '1';
    oldPassInput.style.padding = '8px';
    oldPassInput.id = 'oldPasswordInput';
    oldPassRow.appendChild(oldPassLabel);
    oldPassRow.appendChild(oldPassInput);

    // New username row
    let newUserRow = document.createElement('div');
    newUserRow.style.display = 'flex';
    newUserRow.style.alignItems = 'center';
    let newUserLabel = document.createElement('label');
    newUserLabel.textContent = 'New Username';
    newUserLabel.style.width = '110px';
    newUserLabel.style.marginRight = '10px';
    newUserLabel.setAttribute('for', 'newUsernameInput');
    let newUserInput = document.createElement('input');
    newUserInput.type = 'text';
    newUserInput.placeholder = 'Enter new username';
    newUserInput.style.flex = '1';
    newUserInput.style.padding = '8px';
    newUserInput.id = 'newUsernameInput';
    newUserRow.appendChild(newUserLabel);
    newUserRow.appendChild(newUserInput);

    formContainer.appendChild(oldPassRow);
    formContainer.appendChild(newUserRow);

    // Status indicator
    let statusIndicator = document.createElement('div');
    statusIndicator.id = 'passwordStatus';
    statusIndicator.style.margin = '10px 0 10px 0';
    statusIndicator.style.minHeight = '20px';
    statusIndicator.style.color = '#d9534f'; // Bootstrap danger color
    statusIndicator.textContent = '';

    // Buttons container
    let btnContainer = document.createElement('div');
    btnContainer.style.display = 'flex';
    btnContainer.style.justifyContent = 'space-between';
    btnContainer.style.gap = '10px';

    let changeUsernameBtn = document.createElement('button');
    changeUsernameBtn.textContent = 'Change Username';
    changeUsernameBtn.className = 'btn btn-danger';
    changeUsernameBtn.onclick = function() {
        changeUsernameConfirm(modalBg);
    };

    let cancelBtn = document.createElement('button');
    cancelBtn.textContent = 'Cancel';
    cancelBtn.className = 'btn btn-secondary';
    cancelBtn.onclick = function() {
        modalBg.remove();
    };

    btnContainer.appendChild(changeUsernameBtn);
    btnContainer.appendChild(cancelBtn);

    modalBox.appendChild(formContainer);
    modalBox.appendChild(statusIndicator);
    modalBox.appendChild(btnContainer);

    modalBg.appendChild(modalBox);
    document.body.appendChild(modalBg);
};

function changeUsernameConfirm(modalBg){
    let url = urlBase + "/EditUsername." + extension;
    let Password = document.getElementById("oldPasswordInput").value;
    let newUsername = document.getElementById("newUsernameInput").value;

    if (!Password || !newUsername) {
        document.getElementById("passwordStatus").innerHTML = "Please fill in all fields";
        return false;
    }


    let tmp = {
        userId: userId,
        newUser: newUsername,
        password: Password
    };
    let jsonPayload = JSON.stringify(tmp);
    
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
                    document.getElementById("passwordStatus").innerHTML = response.error;
                    return;
                }
                document.getElementById("oldPasswordInput").value = "";
                document.getElementById("newUsernameInput").value = "";
                document.getElementById("passwordStatus").innerHTML = "Username changed successfully";

                setTimeout(function() {
                    modalBg.remove();
                }, 1000);
                // Success
                return true;
            }
        };
        xhr.send(jsonPayload);
    }
    catch(err)
    {
        document.getElementById("passwordStatus").innerHTML = err.message;
        return false;
    }

}

function deleteUser() {
    
    // Create modal background
    let modalBg = document.createElement('div');
    modalBg.style.position = 'fixed';
    modalBg.style.top = '0';
    modalBg.style.left = '0';
    modalBg.style.width = '100vw';
    modalBg.style.height = '100vh';
    modalBg.style.backgroundColor = 'rgba(0,0,0,0.5)';
    modalBg.style.display = 'flex';
    modalBg.style.alignItems = 'center';
    modalBg.style.justifyContent = 'center';
    modalBg.style.zIndex = '9999';

    // Create modal box
    let modalBox = document.createElement('div');
    modalBox.style.background = '#211f1fff';
    modalBox.style.padding = '30px 20px';
    modalBox.style.borderRadius = '10px';
    modalBox.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
    modalBox.style.minWidth = '320px';
    modalBox.style.textAlign = 'center';

    // Form container for labels and inputs
    let formContainer = document.createElement('div');
    formContainer.style.display = 'flex';
    formContainer.style.flexDirection = 'column';
    formContainer.style.alignItems = 'stretch';
    formContainer.style.gap = '10px';

    // Old password row
    let oldPassRow = document.createElement('div');
    oldPassRow.style.display = 'flex';
    oldPassRow.style.alignItems = 'center';
    let oldPassLabel = document.createElement('label');
    oldPassLabel.textContent = 'Password';
    oldPassLabel.style.width = '110px';
    oldPassLabel.style.marginRight = '10px';
    oldPassLabel.setAttribute('for', 'oldPasswordInput');
    let oldPassInput = document.createElement('input');
    oldPassInput.type = 'password';
    oldPassInput.placeholder = 'Enter password';
    oldPassInput.style.flex = '1';
    oldPassInput.style.padding = '8px';
    oldPassInput.id = 'oldPasswordInput';
    oldPassRow.appendChild(oldPassLabel);
    oldPassRow.appendChild(oldPassInput);

    formContainer.appendChild(oldPassRow);

    // Status indicator
    let statusIndicator = document.createElement('div');
    statusIndicator.id = 'passwordStatus';
    statusIndicator.style.margin = '10px 0 10px 0';
    statusIndicator.style.minHeight = '20px';
    statusIndicator.style.color = '#d9534f'; // Bootstrap danger color
    statusIndicator.textContent = '';

    // Buttons container
    let btnContainer = document.createElement('div');
    btnContainer.style.display = 'flex';
    btnContainer.style.justifyContent = 'space-between';
    btnContainer.style.gap = '10px';

    let deleteAccountBtn = document.createElement('button');
    deleteAccountBtn.textContent = 'Delete Account';
    deleteAccountBtn.className = 'btn btn-danger';
    deleteAccountBtn.onclick = function() {
        deleteUserConfirm();
    };

    let cancelBtn = document.createElement('button');
    cancelBtn.textContent = 'Cancel';
    cancelBtn.className = 'btn btn-secondary';
    cancelBtn.onclick = function() {
        modalBg.remove();
    };

    btnContainer.appendChild(deleteAccountBtn);
    btnContainer.appendChild(cancelBtn);

    modalBox.appendChild(formContainer);
    modalBox.appendChild(statusIndicator);
    modalBox.appendChild(btnContainer);

    modalBg.appendChild(modalBox);
    document.body.appendChild(modalBg);
};

function deleteUserConfirm(){
    let url = urlBase + "/DeleteUser." + extension;
    let oldPassword = document.getElementById("oldPasswordInput").value;

    if (!oldPassword) {
        document.getElementById("passwordStatus").innerHTML = "Please fill in all fields";
        return false;
    }

    let tmp = {
        userId: userId,
        password: oldPassword
    };
    let jsonPayload = JSON.stringify(tmp);
    
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
                    document.getElementById("passwordStatus").innerHTML = response.error;
                    return;
                }
                document.getElementById("oldPasswordInput").value = "";
                document.getElementById("passwordStatus").innerHTML = "Account deleted. Logging out...";

                setTimeout(function() {
                    doLogout();
                }, 1000);
                // Success
                return true;
            }
        };
        xhr.send(jsonPayload);
    }
    catch(err)
    {
        document.getElementById("passwordStatus").innerHTML = err.message;
        return false;
    }
}

function editPassword() {
    // Create modal background
    let modalBg = document.createElement('div');
    modalBg.style.position = 'fixed';
    modalBg.style.top = '0';
    modalBg.style.left = '0';
    modalBg.style.width = '100vw';
    modalBg.style.height = '100vh';
    modalBg.style.backgroundColor = 'rgba(0,0,0,0.5)';
    modalBg.style.display = 'flex';
    modalBg.style.alignItems = 'center';
    modalBg.style.justifyContent = 'center';
    modalBg.style.zIndex = '9999';

    // Create modal box
    let modalBox = document.createElement('div');
    modalBox.style.background = '#211f1fff';
    modalBox.style.padding = '30px 20px';
    modalBox.style.borderRadius = '10px';
    modalBox.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
    modalBox.style.minWidth = '320px';
    modalBox.style.textAlign = 'center';

    // Form container for labels and inputs
    let formContainer = document.createElement('div');
    formContainer.style.display = 'flex';
    formContainer.style.flexDirection = 'column';
    formContainer.style.alignItems = 'stretch';
    formContainer.style.gap = '10px';

    // Old password row
    let oldPassRow = document.createElement('div');
    oldPassRow.style.display = 'flex';
    oldPassRow.style.alignItems = 'center';
    let oldPassLabel = document.createElement('label');
    oldPassLabel.textContent = 'Old password';
    oldPassLabel.style.width = '110px';
    oldPassLabel.style.marginRight = '10px';
    oldPassLabel.setAttribute('for', 'oldPasswordInput');
    let oldPassInput = document.createElement('input');
    oldPassInput.type = 'password';
    oldPassInput.placeholder = 'Enter old password';
    oldPassInput.style.flex = '1';
    oldPassInput.style.padding = '8px';
    oldPassInput.id = 'oldPasswordInput';
    oldPassRow.appendChild(oldPassLabel);
    oldPassRow.appendChild(oldPassInput);

    // New password row
    let newPassRow = document.createElement('div');
    newPassRow.style.display = 'flex';
    newPassRow.style.alignItems = 'center';
    let newPassLabel = document.createElement('label');
    newPassLabel.textContent = 'New password';
    newPassLabel.style.width = '110px';
    newPassLabel.style.marginRight = '10px';
    newPassLabel.setAttribute('for', 'newPasswordInput');
    let newPassInput = document.createElement('input');
    newPassInput.type = 'password';
    newPassInput.placeholder = 'Enter new password';
    newPassInput.style.flex = '1';
    newPassInput.style.padding = '8px';
    newPassInput.id = 'newPasswordInput';
    newPassRow.appendChild(newPassLabel);
    newPassRow.appendChild(newPassInput);

    formContainer.appendChild(oldPassRow);
    formContainer.appendChild(newPassRow);

    // Status indicator
    let statusIndicator = document.createElement('div');
    statusIndicator.id = 'passwordStatus';
    statusIndicator.style.margin = '10px 0 10px 0';
    statusIndicator.style.minHeight = '20px';
    statusIndicator.style.color = '#d9534f'; // Bootstrap danger color
    statusIndicator.textContent = '';

    // Buttons container
    let btnContainer = document.createElement('div');
    btnContainer.style.display = 'flex';
    btnContainer.style.justifyContent = 'space-between';
    btnContainer.style.gap = '10px';

    let changePasswordBtn = document.createElement('button');
    changePasswordBtn.textContent = 'Change Password';
    changePasswordBtn.className = 'btn btn-danger';
    changePasswordBtn.onclick = function() {
        changePasswordConfirm(modalBg);
    };

    let cancelBtn = document.createElement('button');
    cancelBtn.textContent = 'Cancel';
    cancelBtn.className = 'btn btn-secondary';
    cancelBtn.onclick = function() {
        modalBg.remove();
    };

    btnContainer.appendChild(changePasswordBtn);
    btnContainer.appendChild(cancelBtn);

    modalBox.appendChild(formContainer);
    modalBox.appendChild(statusIndicator);
    modalBox.appendChild(btnContainer);

    modalBg.appendChild(modalBox);
    document.body.appendChild(modalBg);
};

function changePasswordConfirm(modalBg){
    let url = urlBase + "/EditPassword." + extension;
    let oldPassword = document.getElementById("oldPasswordInput").value;
    let newPassword = document.getElementById("newPasswordInput").value;

    if (!oldPassword || !newPassword) {
        document.getElementById("passwordStatus").innerHTML = "Please fill in all fields";
        return false;
    }

    if (oldPassword === newPassword) {
        document.getElementById("passwordStatus").innerHTML = "New password must be different from old password.";
        return false;
    }

    let tmp = {
        userId: userId,
        oldPassword: oldPassword,
        newPassword: newPassword
    };
    let jsonPayload = JSON.stringify(tmp);
    
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
                    document.getElementById("passwordStatus").innerHTML = response.error;
                    return;
                }
                document.getElementById("oldPasswordInput").value = "";
                document.getElementById("newPasswordInput").value = "";
                document.getElementById("passwordStatus").innerHTML = "Password changed successfully";

                setTimeout(function() {
                    modalBg.remove();
                }, 1000);
                // Success
                return true;
            }
        };
        xhr.send(jsonPayload);
    }
    catch(err)
    {
        document.getElementById("passwordStatus").innerHTML = err.message;
        return false;
    }

}

// function editUsername() {
//     // Create modal background
//     let modalBg = document.createElement('div');
//     modalBg.style.position = 'fixed';
//     modalBg.style.top = '0';
//     modalBg.style.left = '0';
//     modalBg.style.width = '100vw';
//     modalBg.style.height = '100vh';
//     modalBg.style.backgroundColor = 'rgba(0,0,0,0.5)';
//     modalBg.style.display = 'flex';
//     modalBg.style.alignItems = 'center';
//     modalBg.style.justifyContent = 'center';
//     modalBg.style.zIndex = '9999';

//     // Create modal box
//     let modalBox = document.createElement('div');
//     modalBox.style.background = '#fff';
//     modalBox.style.padding = '30px 20px';
//     modalBox.style.borderRadius = '10px';
//     modalBox.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
//     modalBox.style.minWidth = '320px';
//     modalBox.style.textAlign = 'center';

//     // Form container for labels and inputs
//     let formContainer = document.createElement('div');
//     formContainer.style.display = 'flex';
//     formContainer.style.flexDirection = 'column';
//     formContainer.style.alignItems = 'stretch';
//     formContainer.style.gap = '10px';

//     // Old password row
//     let oldPassRow = document.createElement('div');
//     oldPassRow.style.display = 'flex';
//     oldPassRow.style.alignItems = 'center';
//     let oldPassLabel = document.createElement('label');
//     oldPassLabel.textContent = 'Password';
//     oldPassLabel.style.width = '110px';
//     oldPassLabel.style.marginRight = '10px';
//     oldPassLabel.setAttribute('for', 'oldPasswordInput');
//     let oldPassInput = document.createElement('input');
//     oldPassInput.type = 'password';
//     oldPassInput.placeholder = 'Enter password';
//     oldPassInput.style.flex = '1';
//     oldPassInput.style.padding = '8px';
//     oldPassInput.id = 'oldPasswordInput';
//     oldPassRow.appendChild(oldPassLabel);
//     oldPassRow.appendChild(oldPassInput);

//     // New username row
//     let newUserRow = document.createElement('div');
//     newUserRow.style.display = 'flex';
//     newUserRow.style.alignItems = 'center';
//     let newUserLabel = document.createElement('label');
//     newUserLabel.textContent = 'New Username';
//     newUserLabel.style.width = '110px';
//     newUserLabel.style.marginRight = '10px';
//     newUserLabel.setAttribute('for', 'newUsernameInput');
//     let newUserInput = document.createElement('input');
//     newUserInput.type = 'text';
//     newUserInput.placeholder = 'Enter new username';
//     newUserInput.style.flex = '1';
//     newUserInput.style.padding = '8px';
//     newUserInput.id = 'newUsernameInput';
//     newUserRow.appendChild(newUserLabel);
//     newUserRow.appendChild(newUserInput);

//     formContainer.appendChild(oldPassRow);
//     formContainer.appendChild(newUserRow);

//     // Status indicator
//     let statusIndicator = document.createElement('div');
//     statusIndicator.id = 'passwordStatus';
//     statusIndicator.style.margin = '10px 0 10px 0';
//     statusIndicator.style.minHeight = '20px';
//     statusIndicator.style.color = '#d9534f'; // Bootstrap danger color
//     statusIndicator.textContent = '';

//     // Buttons container
//     let btnContainer = document.createElement('div');
//     btnContainer.style.display = 'flex';
//     btnContainer.style.justifyContent = 'space-between';
//     btnContainer.style.gap = '10px';

//     let changeUsernameBtn = document.createElement('button');
//     changeUsernameBtn.textContent = 'Change Username';
//     changeUsernameBtn.className = 'btn btn-danger';
//     changeUsernameBtn.onclick = function() {
//         changeUsernameConfirm(modalBg);
//     };

//     let cancelBtn = document.createElement('button');
//     cancelBtn.textContent = 'Cancel';
//     cancelBtn.className = 'btn btn-secondary';
//     cancelBtn.onclick = function() {
//         modalBg.remove();
//     };

//     btnContainer.appendChild(changeUsernameBtn);
//     btnContainer.appendChild(cancelBtn);

//     modalBox.appendChild(formContainer);
//     modalBox.appendChild(statusIndicator);
//     modalBox.appendChild(btnContainer);

//     modalBg.appendChild(modalBox);
//     document.body.appendChild(modalBg);
// };

// function changeUsernameConfirm(modalBg){
//     let url = urlBase + "/EditUsername." + extension;
//     let Password = document.getElementById("oldPasswordInput").value;
//     let newUsername = document.getElementById("newUsernameInput").value;

//     if (!Password || !newUsername) {
//         document.getElementById("passwordStatus").innerHTML = "Please fill in all fields";
//         return false;
//     }


//     let tmp = {
//         userId: userId,
//         newUser: newUsername,
//         password: Password
//     };
//     let jsonPayload = JSON.stringify(tmp);
    
//     let xhr = new XMLHttpRequest();
//     xhr.open("POST", url, true);
//     xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
//     try
//     {
//         xhr.onreadystatechange = function() 
//         {
//             if (this.readyState == 4 && this.status == 200) 
//             {
//                 let response = JSON.parse(xhr.responseText);
//                 if (response.error) {
//                     document.getElementById("passwordStatus").innerHTML = response.error;
//                     return;
//                 }
//                 document.getElementById("oldPasswordInput").value = "";
//                 document.getElementById("newUsernameInput").value = "";
//                 document.getElementById("passwordStatus").innerHTML = "Username changed successfully";

//                 setTimeout(function() {
//                     modalBg.remove();
//                 }, 1000);
//                 // Success
//                 return true;
//             }
//         };
//         xhr.send(jsonPayload);
//     }
//     catch(err)
//     {
//         document.getElementById("passwordStatus").innerHTML = err.message;
//         return false;
//     }

// }