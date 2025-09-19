window.addEventListener('DOMContentLoaded', function() {
    document.getElementById('inner-title').textContent = 'Logged in as ' + firstName + ' ' + lastName + '.';
    console.log('Account page loaded');
    console.log('User ID:', userId);
    console.log('First Name:', firstName);
    console.log('Last Name:', lastName);
});

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
    modalBox.style.background = '#fff';
    modalBox.style.padding = '30px 20px';
    modalBox.style.borderRadius = '10px';
    modalBox.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
    modalBox.style.minWidth = '320px';
    modalBox.style.textAlign = 'center';

    // Modal content
    let label = document.createElement('div');
    label.textContent = 'Enter password to confirm';
    label.style.marginBottom = '15px';

    let input = document.createElement('input');
    input.type = 'password';
    input.placeholder = 'Password';
    input.style.width = '90%';
    input.style.marginBottom = '20px';
    input.style.padding = '8px';
    input.id = 'passwordInput';

    // Buttons container
    let btnContainer = document.createElement('div');
    btnContainer.style.display = 'flex';
    btnContainer.style.justifyContent = 'space-between';
    btnContainer.style.gap = '10px';

    let deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete Account';
    deleteBtn.className = 'btn btn-danger';
    deleteBtn.onclick = function() {
        let success = deleteUserConfirm(input.value);
        if(success){
            modalBg.remove();
            doLogout();
        }
    };

    let cancelBtn = document.createElement('button');
    cancelBtn.textContent = 'Cancel';
    cancelBtn.className = 'btn btn-secondary';
    cancelBtn.onclick = function() {
        modalBg.remove();
    };

    btnContainer.appendChild(deleteBtn);
    btnContainer.appendChild(cancelBtn);

    modalBox.appendChild(label);
    modalBox.appendChild(input);
    modalBox.appendChild(btnContainer);

    modalBg.appendChild(modalBox);
    document.body.appendChild(modalBg);
};

function deleteUserConfirm(){
    let url = urlBase + "/DeleteUser." + extension;
    let inputPassword = document.getElementById("passwordInput").value;
    return false;
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
    modalBox.style.background = '#fff';
    modalBox.style.padding = '30px 20px';
    modalBox.style.borderRadius = '10px';
    modalBox.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
    modalBox.style.minWidth = '320px';
    modalBox.style.textAlign = 'center';

    // Modal content
    let label = document.createElement('div');
    label.textContent = 'Enter password to confirm';
    label.style.marginBottom = '15px';
    label.id = 'modalLabel';

    let input = document.createElement('input');
    input.type = 'password';
    input.placeholder = 'Password';
    input.style.width = '90%';
    input.style.marginBottom = '20px';
    input.style.padding = '8px';
    input.id = 'passwordInput';

    // Buttons container
    let btnContainer = document.createElement('div');
    btnContainer.style.display = 'flex';
    btnContainer.style.justifyContent = 'space-between';
    btnContainer.style.gap = '10px';

    let changePasswordBtn = document.createElement('button');
    changePasswordBtn.textContent = 'Change Password';
    changePasswordBtn.className = 'btn btn-danger';
    changePasswordBtn.onclick = function() {
        let success = changePasswordConfirm(input.value);
        if(success){
            modalBg.remove();
            doLogout();
        }
    };

    let cancelBtn = document.createElement('button');
    cancelBtn.textContent = 'Cancel';
    cancelBtn.className = 'btn btn-secondary';
    cancelBtn.onclick = function() {
        modalBg.remove();
    };

    btnContainer.appendChild(changePasswordBtn);
    btnContainer.appendChild(cancelBtn);

    modalBox.appendChild(label);
    modalBox.appendChild(input);
    modalBox.appendChild(btnContainer);

    modalBg.appendChild(modalBox);
    document.body.appendChild(modalBg);
};

function changePasswordConfirm(){
    let url = urlBase + "/EditPassword." + extension;
    let inputPassword = document.getElementById("passwordInput").value;
    document.getElementById("modalLabel").innerHTML = "input was " + inputPassword + ".";
    return false;
}