window.onload = function() {
    iconCPF();
    calendario();
};

function iconCPF() {
    if (getMobile() == "true") {
        $("#icon-cpf").removeClass('icon-sm');
        $("#icon-cpf").addClass('icon-md');
        $("#icon-cpf").addClass('style-mobile');
    }
    else {
        $("#icon-cpf").addClass('icon-desk');
    }
}

$(document).on('change', "#cpf",
    function funcionario() {
       cpfValid();
    }
);

function cpfValid() {
    var matricula = $('#matricula').val()[0];
    var cpf = $('#cpf').val();

    var c1 = DatasetFactory.createConstraint("matricula", matricula, matricula, ConstraintType.MUST);
    var constraints = new Array(c1);
    var dataset = DatasetFactory.getDataset("DSFormulariodeCadastrodeFuncionario", null, constraints, null);
    
    if (dataset.values[0].cpf == cpf) {
        var nome = dataset.values[0].name_func;
        $("#nameFunc").val(nome);
        $('#painel2').removeClass('nav-close');
    }
    else {
        alert('O CPF não confere com o usuário selecionado!');
        $('#nameFunc').val("");
        $('#painel2').removeClass('');
        $('#painel2').addClass('row nav-close');
    }
}

function DiasDoMes(mes, ano) {
    var dias = new Date(ano, mes, 0);
    return dias.getDate();
};

function registro() {

    var dataValid = $('#dateRegist').val();
    if (dataValid != "") {

        var diaSemana = ['Domingo', 'Segunda-Feira', 'Terça-Feira', 'Quarta-Feira',  'Quinta-Feira', 'Sexta-Feira','Sabado'];
        var data = $('#dateRegist').val();
        var ano = data.substring(0, 4);
        var mes = data.substring(5, 7);
        var dia = data.substring(8, 10);

        var dateInfo = new Date(ano, mes, dia);
        var nDay = dateInfo.getDay();

        var matricula = $('#matricula').val()[0];

        var c1 = DatasetFactory.createConstraint("matricula", matricula, matricula, ConstraintType.MUST);
        var constraints = new Array(c1);
        var dataset = DatasetFactory.getDataset("DSFormulariodeCadastrodeFuncionario", null, constraints, null);
        //console.log(dataset);

        var dataRegist = dia+'/'+mes+'/'+ano;
        var dataRegist2 = ano+'-'+mes+'-'+dia;

        var c2 = DatasetFactory.createConstraint("matricula", matricula, matricula, ConstraintType.MUST);
        var c3 = DatasetFactory.createConstraint("date_log", dataRegist, dataRegist, ConstraintType.SHOULD);
        var c4 = DatasetFactory.createConstraint("date_log", dataRegist2, dataRegist2, ConstraintType.SHOULD);
        var constraints2 = new Array(c2, c3, c4);
        var valid = DatasetFactory.getDataset("DSFormulariodeRegistrodeHorasTrabalhadas", null, constraints2, null);

        console.log(valid);
        
        var nRow = valid.values.length; 

        if(nRow == 0) {

            var extra = $('#extra').val();
            if(extra == "") {
                extra = '00:00'
            }

            var hrs1 = dataset.values[0].hrs_trab.substring(0, 5);
            var hrs2 = dataset.values[0].hrs_trab.substring(8, 13);
            var hrs3 = dataset.values[0].hrs_trab.substring(16, 21);
            var hrs4 = dataset.values[0].hrs_trab.substring(24, 29);

            console.log(nDay);

            if (nDay != 0 && nDay != 6) {
                $('#date_log').val(dia+'/'+mes+'/'+ano);
                $('#day_log').val(diaSemana[nDay]);
                $('#entrada_log').val(hrs1);
                $('#intervaloS_log').val(hrs2);
                $('#retorno_log').val(hrs3);
                $('#saida_log').val(hrs4);
                $('#extra_log').val(extra);
            }
            else {
                $('#date_log').val(dia+'/'+mes+'/'+ano);
                $('#day_log').val(diaSemana[nDay]);
                $('#entrada_log').val('DSR');
                $('#intervaloS_log').val('DSR');
                $('#retorno_log').val('DSR');
                $('#saida_log').val('DSR');
                $('#extra_log').val(extra);
            }
            $('#day_1').removeClass('nav-close');
            $('#painel1').addClass('nav-close');
            $('#painel2').addClass('nav-close');
            
            
        }
        else {

            if(getMobile() == "true") {
                $('#banner_danger').removeClass('nav-close');
                $('#banner_danger').addClass('bannerStage1');

                setTimeout(function(){
                    $('#banner_danger').removeClass('bannerStage1');
                    $('#banner_danger').addClass('bannerStage2');
                    setTimeout(function(){
                        $('#banner_danger').addClass('nav-close');
                        $('#banner_danger').removeClass('bannerStage2');
                    }, 2000);
                }, 5000);
            } else {
                alert('Ops! Você já realizou um apontamento nessa data.');
            }
        }
    } else {
        alert('Preencha corretamente a data desejada!');
    }

}

function cancelar() {
    $("#date_log").val("");
    $("#day_log").val("");
    $("#entrada_log").val("");
    $("#intervaloS_log").val("");
    $("#retorno_log").val("");
    $("#saida_log").val("");
    $("#extra_log").val("");

    $('#day_1').addClass('nav-close');
    $('#painel1').removeClass('nav-close');
    $('#painel2').removeClass('nav-close');
}

function save() {
    var dataset = DatasetFactory.getDataset("processAttachment", null, null, null);
    var nRow = dataset.values.length;

    var nProcess = dataset.values[nRow-1]['processAttachmentPK.processInstanceId'];
    var matricula = $('#matricula').val();
    var semana = $("#day_log").val();

    $("#desc_form").val(nProcess+' - '+matricula+' - '+semana);
   
}

$("#btn-send").click(function(){
    save();

    if (getMobile() != "true") {
        $("#workflowActions > button:first-child", window.parent.document).click();
    } else {
        $('#day_1').addClass('nav-close');
        $('#jumbotron').addClass('nav-close');
        $('#arrow').removeClass('nav-close');
    } 
});

function calendario() {
    webix.i18n.setLocale("pt-BR");

    webix.ui({
        view:"calendar",
        container: "container1",
        id: "calenderID",
        date:new Date(),
        weekHeader:true,
        events:webix.Date.isHoliday,
        width: 330,
        height: 230,
        multiselect:"touch",
    });
};