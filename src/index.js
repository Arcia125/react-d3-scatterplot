import * as d3 from 'd3';

const getData = () => new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const url = `https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/cyclist-data.json`;
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

const createToolTip = (data) => `
<div><span>${data.Name}:${data.Nationality}</span></div>
<span>Year: ${data.Year}</span>
<span>, Time: ${data.Time}</span>
<br>
<span>${data.Doping}</span>`;

const hasDopingAllegation = (data) => data.Doping !== ``;

const formatMinutes = (data) => {
    const time = new Date(2012, 0, 1, 0 , data);
    time.setSeconds(time.getSeconds() + data);
    return d3.timeFormat(`%H:%M`)(time);
};

getData()
    .then((data) => {

        const maxY = d3.max(data, d => d.Place);
        const width = 1000;
        const height = 600;

        const fastestTime = d3.min(data, d => d.Seconds);
        const slowestTime = d3.max(data, d => d.Seconds);

        const dataLength = data.length;

        const xScale = d3.scaleLinear()
            .domain([60 * 3.1, 0])
            .range([0, width * .90]);

        const yScale = d3.scaleLinear()
            .domain([1, dataLength + 1])
            .range([0, height]);

        const xAxis = d3.axisBottom(xScale)
            .ticks(6)
            .tickFormat(formatMinutes);
        const yAxis = d3.axisLeft(yScale)
            .ticks(6);

        d3.select(`body`)
            .style(`background-color`, `#F0F5F5`)
            .style(`font-family`, `sans-Serif`);

        const container = d3.select(`.container`)
            .style(`width`, `${width}px`)
            .style(`height`, `${height}px`)
            .style(`margin`, `auto`);

        const chart = d3.select(`.chart`)
            .attr(`width`, width)
            .attr(`height`, height)
            .style(`background-color`, `#FFF`)
            .style(`margin`, `40px auto`)
            .style(`box-shadow`, `2px 2px 7px #888`)
            .style(`padding`, `50px 50px 75px 50px`)
            .attr(`overflow`, `visible`);

        const noDopingColor = `#222222`;
        const dopingColor = `#990000`;

        const points = chart.selectAll(`circle`)
            .data(data)
            .enter()
            .append(`circle`)
            .attr(`cx`, d => xScale(d.Seconds - fastestTime))
            .attr(`cy`, d => yScale(d.Place))
            .attr(`r`, 6)
            .attr(`fill`, d => hasDopingAllegation(d) ? dopingColor : noDopingColor)
            .attr(`data-legend`, d => hasDopingAllegation(d) ? `Doping Allegations` : `No Doping Allegation`)
            .on(`mouseover`, (d) => {
                tooltip.transition()
                    .duration(200)
                    .style(`opacity`, 1);
                tooltip.html(createToolTip(d))
                    .style(`left`, `${d3.event.pageX + 10}px`)
                    .style(`top`, `${d3.event.pageY - 30}px`);
            })
            .on(`mouseout`, (d) => {
                tooltip.transition()
                    .duration(500)
                    .style(`opacity`, 0);
            });

        const pointText = chart.selectAll(`text`)
            .data(data)
            .enter()
            .append(`text`)
            .text(d => d.Name)
            .attr(`x`, d => xScale(d.Seconds - fastestTime))
            .attr(`y`, d => yScale(d.Place))
            .attr(`transform`, `translate(15, +4)`);

        const tooltip = container.append(`div`)
            .style(`opacity`, `0`)
            .style(`position`, `absolute`)
            .style(`text-align`, `left`)
            .style(`background-color`, `#000`)
            .style(`color`, `#FFF`)
            .style(`box-shadow`, `2px 2px 2px #99A`)
            .style(`padding`, `5px 10px`)
            .style(`border-radius`, `8px`)
            .html(data[0]);


        const title = chart.append(`text`)
            .attr(`font-size`, `2.5em`)
            .attr(`transform`, `translate(${width / 6}, 0)`)
            .text(`Doping in Professional Bicycle Racing`);

        const legendX = width * .8;
        const legendY = height * .6;

        // legend
        // no doping key
        chart
            .append(`circle`)
            .attr(`cx`, legendX)
            .attr(`cy`, legendY)
            .attr(`r`, 6)
            .attr(`fill`, noDopingColor);

        // no doping key label
        chart
            .append(`text`)
            .attr(`x`, legendX + 10)
            .attr(`y`, legendY + 5)
            .text(`No Doping Allegation`);

        // doping key
        chart
            .append(`circle`)
            .attr(`cx`, legendX)
            .attr(`cy`, legendY * 1.09)
            .attr(`r`, 6)
            .attr(`fill`, dopingColor);

        // doping key label
        chart
            .append(`text`)
            .attr(`x`, legendX + 10)
            .attr(`y`, legendY * 1.09 + 5)
            .text(`Doping Allegations`);



        const xLabel = chart.append(`text`)
            .attr(`x`, width / 2.5)
            .attr(`y`, height * 1.05)
            .attr(`dy`, `.35em`)
            .text(`Minutes Behind Fastest Time`);

        const yLabel = chart.append(`text`)
            .attr(`x`, -(width / 3.5))
            .attr(`y`, -25)
            .attr(`transform`, `rotate(-90)`)
            .text(`Ranking`);

        const xTicks = chart.append(`g`)
            .attr(`class`, `x axis`)
            .attr(`transform`, `translate(0, ${height})`)
            .call(xAxis);

        const yTicks = chart.append(`g`)
            .attr(`class`, `y axis`)
            .call(yAxis);

        const sources = [
            `https://en.wikipedia.org/wiki/Alpe_d%27Huez`,
            `http://www.fillarifoorumi.fi/forum/showthread.php?38129-Ammattilaispy%F6r%E4ilij%F6iden-nousutietoja-%28aika-km-h-VAM-W-W-kg-etc-%29&p=2041608#post2041608`,
            `https://alex-cycle.blogspot.com/2015/07/alpe-dhuez-tdf-fastest-ascent-times.html`,
            `http://www.dopeology.org/`,
        ];

        const notes = container.append(`div`)
            .style(`background-color`, `#FFF`)
            .style(`box-shadow`, `2px 2px 2px #99A`)
            .style(`padding`, `5px 10px`)
            .style(`border-radius`, `8px`)
            .style(`transform`, `translate(5%, 0)`)
            .html(`<div><span>Sources:</span></div>${sources.map(source => `<div><a style='color: black' href=${source}>${source}</a></div>`).join(``)}`);

    })
    .catch(err => console.log(err));
