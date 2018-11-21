let senha = document.querySelector('#senha');
let confirmarsenha = document.querySelector('#confirmarsenha');
let btn = document.querySelector('.btn-confirmar');

senha.addEventListener('input', function() {
    if (senha.value == confirmarsenha.value && senha.value.length >= 6) btn.removeAttribute('disabled');
    else btn.setAttribute('disabled','disabled');
})

confirmarsenha.addEventListener('input', function() {
    if (senha.value == confirmarsenha.value && confirmarsenha.value.length >= 6) btn.removeAttribute('disabled');
    else btn.setAttribute('disabled','disabled');
})