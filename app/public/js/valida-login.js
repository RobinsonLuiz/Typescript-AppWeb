let login = document.querySelector('.login');
login.addEventListener('click', async function() {
    let body = document.querySelector('body');
    setTimeout(() => {
        setInterval(() => {
            if (body.classList.contains('modal-open')) {
                let btn_login = document.querySelector('.btn-modal-login');
                let email_login = validaEmail('emailLogin');
                let senha_login = validaSenha();
                let captcha = validaCaptcha();
                if (email_login && senha_login && captcha) btn_login.removeAttribute('disabled');
                else btn_login.setAttribute('disabled', 'disabled');
            } else {
                limparCamposLogin();
            }
        }, 800);
    }, 150);
});

function validaCaptcha() {
    return document.querySelector('#g-recaptcha-response').value.length > 0;
}

function limparCamposLogin() {
    let campos = [
        document.querySelector("#emailLogin"),
        document.querySelector('#password')
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

function validaSenha() {
    let password = document.querySelector('#password');
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

function pegaCamposLogin() {
    return {
        "email": document.querySelector("#emailLogin").value,
        "senha": document.querySelector("#password").value,
        "captcha": document.querySelector("#g-recaptcha-response").value
    }
}


let close_success_login = document.querySelector('.close-success-login');

close_success_login.addEventListener('click', function(event) {
    event.preventDefault();
    let success_login = document.querySelector('.success-login');
    success_login.setAttribute('hidden','hidden');
})

let close_error_login = document.querySelector('.close-error-login');

close_error_login.addEventListener('click', function(event) {
    event.preventDefault();
    let error_login = document.querySelector('.error-login');
    error_login.setAttribute('hidden','hidden');
})