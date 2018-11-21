let button_client = document.querySelector('.btn-client');

button_client.addEventListener('click', function(event) {
    event.preventDefault();
    let http = new XMLHttpRequest();
    let success_register = document.querySelector('.success');
    let error_register = document.querySelector('.bankerror');
    let email_cadastrado = document.querySelector('.error');
    let nome = document.querySelector('#nome');
    let email = document.querySelector('#email');
    http.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            let user = JSON.parse(this.responseText);
            if (user.register == 'cadastrado') {
                success_register.setAttribute('hidden', 'hidden');
                error_register.setAttribute('hidden', 'hidden');
                email_cadastrado.removeAttribute('hidden');
            } else {
                if (user.register == 'error') {
                    success_register.setAttribute('hidden', 'hidden');
                    email_cadastrado.setAttribute('hidden', 'hidden');
                    error_register.removeAttribute('hidden');
                } else {
                    success_register.removeAttribute('hidden');
                    email_cadastrado.setAttribute('hidden', 'hidden');
                    error_register.setAttribute('hidden', 'hidden');
                    setTimeout(() => {
                        nome.value = '';
                        email.value = '';
                        success_register.setAttribute('hidden','hidden');
                        $("#myModal").modal('hide');
                    }, 1500);
                }
            }
        };
    };
    http.open("POST", '/valida/clients/' + JSON.stringify({ "nome": nome.value,"email": email.value }) , true);
    http.send();
})
