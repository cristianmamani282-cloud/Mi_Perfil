$(document).ready(function(){

    $(".card-btn").click(function(){

        $(this).next(".card-info").slideToggle("fast");

        $("body").removeClass("pc ps xbox cafe");

        let tema = $(this).data("tema");

        $("body").addClass(tema);

    });

});
