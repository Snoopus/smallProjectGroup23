window.addEventListener('DOMContentLoaded', function() {
    document.getElementById('inner-title').textContent = 'Logged in as ' + firstName + ' ' + lastName + '.';
});

function changePassword() {
    let url = urlBase + "/editPassword." + extension;
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

    // Buttons container
    let btnContainer = document.createElement('div');
    btnContainer.style.display = 'flex';
    btnContainer.style.justifyContent = 'space-between';
    btnContainer.style.gap = '10px';

    let deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete Account';
    deleteBtn.className = 'btn btn-danger';
    deleteBtn.onclick = function() {
        // You can handle the password value here: input.value
        modalBg.remove();
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

function deleteAccount() {
    let url = urlBase + '/DeleteAccount.' + extension;

    return;
};