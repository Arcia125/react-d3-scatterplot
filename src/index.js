import * as d3 from 'd3';

const getData = () => new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const url = `https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json`;
    xhr.open(`GET`, url, true);
    xhr.onload = (event) => {
        const isReady = xhr.readyState === 4;
        const isSuccess = xhr.status === 200;
        if (isReady) {
            if (isSuccess) {
                resolve(JSON.parse(xhr.response));
            } else {
                reject(xhr.statusText);
            }
        }
    };
    xhr.onerror = (event) => {
        reject(xhr.statusText);
    };
    xhr.send(null);
});

getData()
    .then((jsonData) => {
        const scaleAmount = 30;
        const scaleDown = (h) => h / scaleAmount;

        const data = jsonData.data;

        const maxY = d3.max(data, d => d[1]);
        const width = 1000;
        const height = scaleDown(maxY);

        const dataLength = data.length;
        const barWidth = width / dataLength;

        const minDate = new Date(data[0][0]);
        const maxDate = new Date(data[dataLength - 1][0]);

        const rectFillNormal = `#5F5FFF`;
        const rectFillHover = `#9F9FFF`;

        const x = d3.scaleTime()
            .domain([minDate, maxDate])
            .range([0, width]);

        const y = d3.scaleLinear()
            .range([height, 0])
            .domain([0, maxY]);

        const xAxis = d3.axisBottom(x)
            .ticks(d3.timeYear.every(5));
        const yAxis = d3.axisLeft(y)
            .ticks(10);

        const container = d3.select(`.container`)
            .style(`width`, `${width + 200}px`)
            .style(`height`, `${height}px`)
            .style(`margin`, `auto`);

        const chart = d3.select(`.chart`)
            .attr(`width`, width)
            .attr(`height`, height)
            .style(`margin`, `40px auto`)
            .style(`box-shadow`, `2px 2px 7px #888`)
            .style(`padding`, `50px 50px 75px 50px`);

        const tooltip = container.append(`div`)
            .style(`opacity`, `0`)
            .style(`position`, `absolute`)
            .style(`text-align`, `left`)
            .style(`background-color`, `#EFEFFF`)
            .style(`box-shadow`, `2px 2px 2px #99A`)
            .style(`padding`, `5px 10px`)
            .style(`border-radius`, `8px`)
            .html(data[0]);


        const title = chart.append(`text`)
            .attr(`font-size`, `2.5em`)
            .attr(`transform`, `translate(${width / 3.5}, 0)`)
            .text(`Gross Domestic Product`);


        const bars = chart.selectAll(`g`)
                .data(data)
            .enter().append(`g`)
                .attr(`transform`, (d, i) => `translate(${i * barWidth}, ${height - scaleDown(d[1])})`)
            .append(`rect`)
                .attr(`width`, barWidth)
                .attr(`fill`, rectFillNormal)
                .attr(`height`, d => scaleDown(d[1]))
                .on(`mouseover`, function (d) {
                    const rect = d3.select(this);
                    rect.attr(`fill`, rectFillHover);
                    tooltip.transition()
                        .duration(250)
                        .style(`opacity`, `1`);
                    tooltip.html(`<span style='font-weight: bold'>${d3.format(`$,.2f`)(d[1])} Billion</span><br><span>${d3.timeFormat(`%B - %Y`)(new Date(d[0]))}</span>`)
                        .style(`left`, `${d3.event.pageX + 10}px`)
                        .style(`top`, `${d3.event.pageY - 30}px`);
                })
                .on(`mouseleave`, function (d) {
                    const rect = d3.select(this);
                    rect.attr(`fill`, rectFillNormal);
                    tooltip.transition()
                        .duration(500)
                        .style(`opacity`, `0`);
                })

        const xTicks = chart.append(`g`)
            .attr(`class`, `x axis`)
            .attr(`transform`, `translate(0, ${height})`)
            .call(xAxis);

        const yTicks = chart.append(`g`)
            .attr(`class`, `y axis`)
            .call(yAxis);

        const notes = chart.append(`text`)
            .attr(`transform`, `translate(0, ${height * 1.1})`)
            .attr(`font-size`, `11px`)
            .text(jsonData.description);
    })
    .catch(err => console.log(err));
