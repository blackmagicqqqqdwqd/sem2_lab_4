/*[{
    "labelX": "ОАЭ",
    "values": [354.6, 828]
   },
   {
    "labelX": "Польша",
    "values": [646.38, 646.38]
   },
   …
   ]*/
// Входные данные:
// data - исходный массив (например, buildings)
// key - поле, по которому осуществляется группировка
function createArrGraph(data, key) {

    //if (key == "Год") key = parseFloat(key);
    groupObj = d3.group(data, d => d[key]);
    let arrGraph = [];

    let sortedGroup = Array.from(groupObj.entries()).sort((a, b) => {

        let keyA = parseFloat(a[0]);
        let keyB = parseFloat(b[0]);
        return keyA - keyB;
    });

    for (let entry of sortedGroup) {
        let minMax = d3.extent(entry[1].map(d => d['Высота']));
        arrGraph.push({ labelX: entry[0], values: minMax });

    }
    console.log(groupObj);
    console.log(Array.from(groupObj.entries()));
    return arrGraph;
}

function changeOY() {

    if (d3.select("#oy2").property('checked') || d3.select("#oy1").property('checked')) {
        d3.select("#oy1_s").classed('error', false)
        d3.select("#oy2_s").classed('error', false)
    }

}

function drawGraph(data) {
    // значения по оси ОХ

    let keyX = "Страна";
    keyX = d3.select("input[name='ox']:checked").attr("value");
    // создаем массив для построения графика
    const arrGraph = createArrGraph(data, keyX);

    let svg = d3.select("svg")
    svg.selectAll('*').remove();
    // создаем словарь с атрибутами области вывода графика
    attr_area = {
        width: parseFloat(svg.style('width')),
        height: parseFloat(svg.style('height')),
        marginX: 50,
        marginY: 50
    }

    // создаем шкалы преобразования и выводим оси
    const [scX, scY] = createAxis(svg, arrGraph, attr_area);

    // рисуем график

    //console.log(d3.select("input[name='ox']:checked").attr("value"));
    if (d3.select("#typeChart").property("value") == 1) {//точечная диограма

        if (d3.select("#oy1").property('checked') && d3.select("#oy2").property('checked')) {
            createChart(svg, arrGraph, scX, scY, attr_area, "blue", 0);
            createChart(svg, arrGraph, scX, scY, attr_area, "red", 1);
            d3.select("#oy1_s").classed('error', false)
            d3.select("#oy2_s").classed('error', false)
        }
        else if (d3.select("#oy2").property('checked')) {
            d3.select("#oy1_s").classed('error', false)
            d3.select("#oy2_s").classed('error', false)
            createChart(svg, arrGraph, scX, scY, attr_area, "blue", 0);
        }
        else if (d3.select("#oy1").property('checked')) {
            createChart(svg, arrGraph, scX, scY, attr_area, "red", 1);
            d3.select("#oy1_s").classed('error', false)
            d3.select("#oy2_s").classed('error', false)
        } else {
            d3.select("#oy1_s").classed('error', true)
            d3.select("#oy2_s").classed('error', true)
        }

    } else {

        if (d3.select("#oy1").property('checked') && d3.select("#oy2").property('checked')) {
            createChart2(svg, arrGraph, scX, scY, attr_area, "blue", 0);
            createChart2(svg, arrGraph, scX, scY, attr_area, "red", 1);
        }
        else if (d3.select("#oy2").property('checked')) {
            createChart2(svg, arrGraph, scX, scY, attr_area, "blue", 0);
        }
        else if (d3.select("#oy1").property('checked')) {
            createChart2(svg, arrGraph, scX, scY, attr_area, "red", 1);
        } else alert(12);

    }




}


function createAxis(svg, data, attr_area) {
    // находим интервал значений, которые нужно отложить по оси OY
    // максимальное и минимальное значение и максимальных высот по каждой стране
    const [min, max] = d3.extent(data.map(d => d.values[1]));
    // функция интерполяции значений на оси
    // по оси ОХ текстовые значения
    let scaleX = d3.scaleBand()
        .domain(data.map(d => d.labelX))
        .range([0, attr_area.width - 2 * attr_area.marginX]);

    let scaleY = d3.scaleLinear()
        .domain([min * 0.85, max * 1.1])
        .range([attr_area.height - 2 * attr_area.marginY, 0]);

    // создание осей
    let axisX = d3.axisBottom(scaleX); // горизонтальная
    let axisY = d3.axisLeft(scaleY); // вертикальная
    // отрисовка осей в SVG-элементе
    svg.append("g")
        .attr("transform", `translate(${attr_area.marginX},
    ${attr_area.height - attr_area.marginY})`)
        .call(axisX)
        .selectAll("text") // подписи на оси - наклонные
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", d => "rotate(-45)");
    svg.append("g")
        .attr("transform", `translate(${attr_area.marginX},
    ${attr_area.marginY})`)
        .call(axisY);
    return [scaleX, scaleY]

}

function createChart(svg, data, scaleX, scaleY, attr_area, color, max) {
    const r = 4;
    svg.selectAll(".dot")
        .data(data)
        .enter()
        .append("circle")
        .attr("r", r)
        .attr("cx", d => scaleX(d.labelX) + scaleX.bandwidth() / 2)
        .attr("cy", d => scaleY(d.values[max]))
        .attr("transform", `translate(${attr_area.marginX},
   ${attr_area.marginY})`)
        .style("fill", color)
}


function createChart2(svg, data, scaleX, scaleY, attr_area, color, max) {
    const r = 4;
    svg.selectAll(".dot")
        .data(data)
        .enter()
        .append("rect")
        .attr("y", d => scaleY(d.values[max]))
        .attr("x", d => scaleX(d.labelX) + scaleX.bandwidth() / 2 - (max == 0 ? scaleX.bandwidth() / 4 : 0))
        .attr("height", d => attr_area.height - scaleY(d.values[max]) - attr_area.marginY * 2)
        .attr("width", scaleX.bandwidth() / 4)
        .attr("transform", `translate(${attr_area.marginX},
   ${attr_area.marginY})`)
        .style("fill", color)


}
