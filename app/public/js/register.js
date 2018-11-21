
function index(domError, domSuccess, domBankError, campos, route, modal, domActive=null) {
    var http = new XMLHttpRequest();
    http.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            const user = JSON.parse(this.responseText);
            let error_register = document.querySelector(domError);
            let success_register = document.querySelector(domSuccess);
            let bank = document.querySelector(domBankError);
            let verificaAtivo = false;
            if (domActive != null) {
                var active = document.querySelector(domActive);
                verificaAtivo = true;
            }
            if (!user.register) {
                if (user.OK == false) return error_register.removeAttribute('hidden');
                else {
                    if (verificaAtivo) {
                        if (user.OK == "desatived") {
                            error_register.setAttribute('hidden', 'hidden');
                            active.removeAttribute('hidden');
                        } else {
                            if (user.OK == 'errorBank') {
                                error_register.setAttribute('hidden', 'hidden');
                                success_register.setAttribute('hidden', 'hidden');
                                bank.removeAttribute('hidden');
                            } else {
                                error_register.setAttribute('hidden', 'hidden');
                                bank.setAttribute('hidden', 'hidden');
                                success_register.removeAttribute('hidden');
                                setTimeout(() => {
                                    window.location = "http://localhost/session/" + user.OK;
                                    let success_register = document.querySelector(domSuccess);
                                    success_register.setAttribute('hidden','hidden');
                                    $(modal).modal('hide');
                                }, 1500);
                            }
                        };
                    } else {
                        error_register.setAttribute('hidden', 'hidden');
                        success_register.removeAttribute('hidden');
                        setTimeout(() => {
                            let success_register = document.querySelector(domSuccess);
                            success_register.setAttribute('hidden','hidden');
                            $(modal).modal('hide');
                        }, 1500);
                    }
                };
            } else {
                if (user.register == false) return error_register.removeAttribute('hidden');
                else {
                    if (user.register == 'cadastrado') {
                        success_register.setAttribute('hidden', 'hidden');
                        error_register.removeAttribute('hidden');
                    } else {
                        error_register.setAttribute('hidden', 'hidden');
                        success_register.removeAttribute('hidden');
                        setTimeout(() => {
                            let success_register = document.querySelector(domSuccess);
                            success_register.setAttribute('hidden','hidden');
                            $(modal).modal('hide');
                        }, 1500);
                    }
                }
            };
        };
    };
    http.open("GET", route + JSON.stringify(campos) , true);
    http.send();
}

var btn_register = document.querySelector('.btn-modal-register');
var btn_login = document.querySelector('.btn-modal-login');
btn_register.addEventListener('click', function(event) {
    event.preventDefault();
    index('.error', '.success', '.bankerror', pegaCampos(), 'verifica/', '#myModal');
});

btn_login.addEventListener('click', function(event) {
    event.preventDefault();
    index('.error-login', '.success-login', '.bankerror', pegaCamposLogin(), 'login/', '#loginModal', '.success-active');
});