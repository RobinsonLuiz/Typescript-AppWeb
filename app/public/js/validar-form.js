let register_btns = document.querySelectorAll('.register');
register_btns.forEach(register => {
    register.addEventListener('click', async function() {
        let body = document.querySelector('body');
        setTimeout(() => {
            setInterval(() => {
                if (body.classList.contains('modal-open')) {
                    let btn_register = document.querySelector('.btn-modal-register');
                    let nome = validaNome();
                    let email = validaEmail('email');
                    if (nome && email) btn_register.removeAttribute('disabled');
                    else btn_register.setAttribute('disabled', 'disabled');
                } else {
                    limparCampos();
                }
            }, 1000)
        }, 100);
    });
});

function limparCampos() {
    let campos = [
        document.querySelector("#nome"),
        document.querySelector("#email"),
        document.querySelector("#telefone")
    ]
    campos.forEach(campo => {
        campo.classList.add('color-btn');
        campo.classList.remove('correto');
        campo.classList.remove('errado');
        campo.value = ""
    });
    let error = document.querySelector('.error');
    error.setAttribute('hidden', 'hidden');
}

function pegaCampos() {
    return {
        "nome": document.querySelector("#nome").value,
        "email": document.querySelector("#email").value,
        "telefone": document.querySelector("#telefone").value
    }
}

function validaNome() {
    let valida = document.querySelector('#nome');
    if (valida.value) {
        let contaVazio;
        let contaPalavra = 0;
        for (let i = 0; i < valida.value.length; i++) {
            if (valida.value.charAt(i) == " ") contaVazio++;
            if (valida.value.charAt(i) >= 'a' && valida.value.charAt(i) <= 'z') contaPalavra++;
        }
        if (contaPalavra < 10) {
            valida.classList.remove('color-btn');
            valida.classList.remove('correto');
            valida.classList.add('errado');
            return false;
        } else {
            valida.classList.remove('color-btn');
            valida.classList.remove('errado');
            valida.classList.add('correto');
        }
    } else {
        valida.classList.add('errado');
        valida.classList.remove('correto');
        return false;
    }
    return true;
}

function validaEmail(dom) {
    let valida = document.querySelector('#' + dom);
    if (valida.value) {
        if (!valida.value.match(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i)) {
            valida.classList.remove('color-btn');
            valida.classList.remove('correto');
            valida.classList.add('errado');
            return false;
        } else {
            valida.classList.remove('color-btn');
            valida.classList.remove('errado');
            valida.classList.add('correto');
        }
        return true;
    }
}


let close_success = document.querySelector('.close-success');

close_success.addEventListener('click', function(event) {
    event.preventDefault();
    let success_register = document.querySelector('.success');
    success_register.setAttribute('hidden','hidden');
})

let close_error = document.querySelector('.close-error');

close_error.addEventListener('click', function(event) {
    event.preventDefault();
    let error_register = document.querySelector('.error');
    error_register.setAttribute('hidden','hidden');
})

let close_active = document.querySelector('.close-active');

close_active.addEventListener('click', function(event) {
    event.preventDefault();
    let active = document.querySelector('.success-active');
    active.setAttribute('hidden','hidden');
})
