d3.select(window).on("load", function () {
    showTable('build', buildings);
    drawGraph(buildings);

});


function includeAnimationType() {

    if (d3.select('#alongPath').property('checked') == true) {
        d3.select('#alongType').classed("inVisible", false);
        d3.select('p').classed("inVisible", true); //мб накажет но первый p - это блок координат
    } else {
        d3.select('#alongType').classed("inVisible", true);
        d3.select('p').classed("inVisible", false);
    }

}

let runAnimation = (dataForm) => {
    //console.log(`first ${d3.select("#typeAnimation").property('value')} two: ${document.getElementById('typeAnimation').value}`);
    const anim_type = d3.select("#typeAnimation").property('value');
    const svg = d3.select("svg")
    let pict = drawSmile(svg);
    if (d3.select("#alongPath").property("checked") == false) {
        if (anim_type == 'linear') {
            pict.attr("transform", `translate(${dataForm.cx.value}, ${dataForm.cy.value}) 
                rotate(${dataForm.rotate.value},0, 0) scale(${dataForm.scaleX.value},${dataForm.scaleY.value})`)
                .transition()
                .duration(6000)
                .ease(d3.easeLinear)
                .attr("transform", `translate(${dataForm.cx_finish.value}, ${dataForm.cy_finish.value}) 
                    rotate(${dataForm.rotate_finish.value},0, 0) scale(${dataForm.scaleX_finish.value},${dataForm.scaleY_finish.value})`);

        }
        else if (anim_type == 'bounce') {
            pict.attr("transform", `translate(${dataForm.cx.value}, ${dataForm.cy.value}) 
                rotate(${dataForm.rotate.value},0, 0) scale(${dataForm.scaleX.value},${dataForm.scaleY.value})`)
                .transition()
                .duration(6000)
                .ease(d3.easeBounce)
                .attr("transform", `translate(${dataForm.cx_finish.value}, ${dataForm.cy_finish.value}) 
                    rotate(${dataForm.rotate_finish.value},0, 0) scale(${dataForm.scaleX_finish.value},${dataForm.scaleY_finish.value})`);

        }
        else if (anim_type == 'elastic') {
            pict.attr("transform", `translate(${dataForm.cx.value}, ${dataForm.cy.value}) 
                rotate(${dataForm.rotate.value},0, 0) scale(${dataForm.scaleX.value},${dataForm.scaleY.value})`)
                .transition()
                .duration(6000)
                .ease(d3.easeElastic)
                .attr("transform", `translate(${dataForm.cx_finish.value}, ${dataForm.cy_finish.value}) 
                    rotate(${dataForm.rotate_finish.value},0, 0) scale(${dataForm.scaleX_finish.value},${dataForm.scaleY_finish.value})`);

        }
    } else {
        let path = drawPath(d3.select('#typeMoveAlong').property("value"));
        pict.transition()
            .ease(d3.easeLinear) // установить в зависимости от настроек формы
            .duration(6000)
            .attrTween('transform', translateAlong(path.node()));
    }
}



function change() {

    console.log(d3.select("#changeTable").attr("value"));
    if (d3.select("#changeTable").attr("value") == "Скрыть таблицу") {
        d3.select("#changeTable").attr("value", "Показать таблицу");
        clear2();
    } else {
        d3.select("#changeTable").attr("value", "Скрыть таблицу");
        showTable('build', buildings);
    }

}

function f() {

    d3.select('svg').selectAll("*").remove();
    drawGraph(buildings);

}

function clear2() {
    d3.select("#build").selectAll("*").remove();
}

let showTable = (idTable, data) => {
    let table = d3.select("#" + idTable);

    // создание строк таблицы (столько, сколько элементов в массиве)
    let rows = table
        .selectAll("tr")
        .data(data)
        .enter()
        .append('tr')
        .style("display", "")
        .each(function (d, i) {
            
            if (i % 2 !== 0) {  
                d3.select(this).classed("greyTr", true);
            }
        });
    // создание ячеек каждой строки на основе каждого элемента массива
    let cells = rows
        .selectAll("td")
        .data(d => Object.values(d))
        .enter()
        .append("td")
        .text(d => d);
    // создание шапки таблицы
    let head = table
        .insert("tr", "tr")
        .selectAll("th")
        .data(d => Object.keys(data[0]))
        .enter()
        .append("th")
        .text(d => d);
}

