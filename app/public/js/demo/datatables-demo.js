// Call the dataTables jQuery plugin
$(document).ready(function () {

    $('#dataTable').DataTable(
        {
            dom: 'Bfrtip',
            buttons: [
                'excel'
            ],
            "oLanguage": {
                "sProcessing": "Processando...",
                "sLengthMenu": "Mostrar _MENU_ registros",
                "sZeroRecords": "Não foram encontrados resultados",
                "sInfo": "Mostrando de _START_ até _END_ de _TOTAL_ registros",
                "sInfoEmpty": "Mostrando de 0 até 0 de 0 registros",
                "sInfoFiltered": "",
                "sInfoPostFix": "",
                "sSearch": "Buscar:",
                "sUrl": "",
                "oPaginate": {
                    "sFirst": "Primeiro",
                    "sPrevious": "Anterior",
                    "sNext": "Seguinte",
                    "sLast": "Último"
                }
            },
    });
    document.querySelector('.dt-button').classList.add('btn');
    document.querySelector('.dt-button').classList.add('btn-primary');
});