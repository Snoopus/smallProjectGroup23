window.addEventListener('DOMContentLoaded', function() {
    document.getElementById('inner-title').textContent = 'Logged in as ' + firstName + ' ' + lastName + '.';
});

function changePassword() {
    let url = urlBase + '/ChangePassword.' + extension;
    
    return;
};

function deleteAccount() {
    let url = urlBase + '/DeleteAccount.' + extension;

    return;
};