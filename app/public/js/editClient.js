$('.btn-edit').each((i, btn) => {
    btn.addEventListener('click', function() {
        let tr = btn.parentElement.parentElement;
        tr.querySelectorAll('th').forEach(th => {
            if (th.classList.contains('nickname')) {
                document.getElementById('delElement').innerHTML = `Tem certeza que deseja excluir o cliente ${th.textContent.trim()} ?`;
                document.querySelector('#nome-edit').value = `${th.textContent.trim()}`;    
            }
            if (th.classList.contains('nickemail')) 
                document.querySelector('#email-edit').value = `${th.textContent.trim()}`;
        });
    });
});