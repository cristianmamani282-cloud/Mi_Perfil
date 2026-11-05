// ==========================
// ACORDEON Y TEMAS
// ==========================

$(document).ready(function(){

    $(".card-btn").click(function(){

        $(this).next(".card-info").slideToggle("fast");

        let tema = $(this).data("tema");

        $("body").removeClass(
            "tema-pc tema-ps tema-xbox"
        );

        if(tema === "pc"){
            $("body").addClass("tema-pc");
        }

        if(tema === "ps"){
            $("body").addClass("tema-ps");
        }

        if(tema === "xbox"){
            $("body").addClass("tema-xbox");
        }

    });

});

// ==========================
// FILTROS
// ==========================

$(".filtro").click(function(){

    let filtro = $(this).data("filter");

    if(filtro === "all"){

        $(".categoria").show();

    }else{

        $(".categoria").hide();
        $("." + filtro).show();

    }

});

// ==========================
// TEMPORIZADOR
// ==========================

let segundos = 0;
let intervalo = null;

function actualizarTiempo(){

    segundos++;

    let horas = Math.floor(segundos / 3600);

    let minutos = Math.floor(
        (segundos % 3600) / 60
    );

    let seg = segundos % 60;

    $("#tiempo").text(

        String(horas).padStart(2,"0")
        + ":"
        + String(minutos).padStart(2,"0")
        + ":"
        + String(seg).padStart(2,"0")

    );

    // costo por hora

    let costo = (segundos / 3600) * 8;

    $("#costo").text(
        "Bs. " + costo.toFixed(2)
    );
}

// iniciar

$("#iniciar").click(function(){

    if(intervalo === null){

        intervalo = setInterval(
            actualizarTiempo,
            1000
        );

    }

});

// pausa

$("#pausar").click(function(){

    clearInterval(intervalo);
    intervalo = null;

});

// reiniciar

$("#reiniciar").click(function(){

    clearInterval(intervalo);

    intervalo = null;

    segundos = 0;

    $("#tiempo").text("00:00:00");

    $("#costo").text("Bs. 0.00");

});
