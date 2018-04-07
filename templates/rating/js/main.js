$(document).ready(function() { 
    
    // Обнаружение количества звезд
    var totalStars = $('.stars').children().length;
    
    $('.stars').on('click', function(e){
        
        var index = $(e.target).index();
        var count = totalStars - index
        
        // Сохранение состояния рейтинга
        $(e.target).addClass('is-selected');

        // Обновить новое состояние
        $(e.target).siblings().removeClass('is-selected');
        $(e.target).addClass('is-selected');

        console.log(count)
    });

});