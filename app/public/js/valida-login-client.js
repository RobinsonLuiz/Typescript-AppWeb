let login_client = document.querySelector('.area-client');
login_client.addEventListener('click', async function() {
    let body = document.querySelector('body');
    setTimeout(() => {
        setInterval(() => {
            if (body.classList.contains('modal-open')) {
                let btn_login = document.querySelector('.btn-modal-login-client');
                let email_login = validaEmail('emailClientLogin');
                let senha_login = validaSenhaLogin();
                if (email_login && senha_login) btn_login.removeAttribute('disabled');
                else btn_login.setAttribute('disabled', 'disabled');
            } else {
                limparCamposLogin();
            }
        }, 800);
    }, 150);
});

function limparCamposLogin() {
    let campos = [
        document.querySelector("#emailClientLogin"),
        document.querySelector('#clientPassword')
    ]
    campos.forEach(campo => {
        campo.classList.add('color-btn');
        campo.classList.remove('correto');
        campo.classList.remove('errado');
        campo.value = ""
    });
    let error = document.querySelector('.error-login');
    error.setAttribute('hidden', 'hidden');
    let active = document.querySelector('.success-active');
    active.setAttribute('hidden', 'hidden');
}

function pegaCamposLoginClient() {
    return {
        "email": document.querySelector("#emailClientLogin").value,
        "senha": document.querySelector("#clientPassword").value,
    }
}

function validaSenhaLogin() {
    let password = document.querySelector('#clientPassword');
    if (password.value) {
        if (password.value == "") {
            password.classList.remove('color-btn');
            password.classList.remove('correto');
            password.classList.add('errado');
            return false;
        } else {
            password.classList.remove('color-btn');
            password.classList.remove('errado');
            password.classList.add('correto');
            return true;
        }
    }
}


let closeSuccessLoginCclient = document.querySelector('.close-success-login-client');

closeSuccessLoginCclient.addEventListener('click', function(event) {
    event.preventDefault();
    let success_login = document.querySelector('.success-login');
    success_login.setAttribute('hidden','hidden');
})

let closeErrorLoginClient = document.querySelector('.close-error-login-client');

closeErrorLoginClient.addEventListener('click', function(event) {
    event.preventDefault();
    let error_login = document.querySelector('.error-login');
    error_login.setAttribute('hidden','hidden');
})