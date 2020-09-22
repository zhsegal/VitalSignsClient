function getRandomNumber(minRange, maxRange) {
    return Math.floor(Math.random() * (maxRange -minRange+ 1) + minRange);
}

function hemoglobinRandomNumber(minRange, maxRange) {
    return Math.round((Math.random() * (maxRange -minRange+ 1) + minRange)*10)/10;
}


window.onload = function() {
    let rand
    var filter = $( "#result" ).attr("value");
    if (filter==='heart rate') { rand = getRandomNumber(55, 65)} 
    else if (filter === 'hemoglobin'){rand = hemoglobinRandomNumber(10.3,14.3)}
    else if (filter === 'blood pressure'){rand= getRandomNumber(125, 140) + '/' + getRandomNumber(80, 90)}
    else if (filter === 'oxygen saturation'){rand = getRandomNumber(98, 100)}
    else {rand = 'error'}

    
    
    
    $('#result').append('<h1 class="h4 text-center" style="margin-top: 5%;">'+rand+'</h1>')
}