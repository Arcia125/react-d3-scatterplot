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

getData()
    .then((data) => {
        // const scaleAmount = 30;
        // const scaleDown = (h) => h / scaleAmount;

        const maxY = d3.max(data, d => d.Place);
        const width = 1000;
        const height = 600;

        const fastestTime = d3.min(data, d => d.Seconds);
        const slowestTime = d3.max(data, d => d.Seconds);

        const dataLength = data.length;
        const barWidth = width / dataLength;


        const rectFillNormal = `#5F5FFF`;
        const rectFillHover = `#9F9FFF`;

        const xScale = d3.scaleLinear()
            .domain([60 * 3.5, 0])
            .range([0, width]);

        const yScale = d3.scaleLinear()
            .domain([1, dataLength])
            .range([0, height]);

        const xAxis = d3.axisBottom(xScale)
            .ticks(d3.timeSecond.every(30));
        const yAxis = d3.axisLeft(yScale)
            .ticks(6);

        const container = d3.select(`.container`)
            .style(`width`, `${width}px`)
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
            .text(`Doping in Professional Bicycle Racing`);

        const points = chart.selectAll(`circle`)
            .data(data)
            .enter()
            .append(`circle`)
            .attr(`cx`, d => xScale(d.Seconds - fastestTime))
            .attr(`cy`, d => yScale(d.Place))
            .attr(`r`, 5)
            .attr(`fill`, d => d.Doping === `` ? `#000` : `#F00`)
            .attr(`data-legend`, d => d.Doping === `` ? `No Doping Allegation` : `Doping Allegations`)
            .on(`mouseover`, (d) => {
                tooltip.transition()
                    .duration(200)
                    .style(`opacity`, .9);
                tooltip.html(`<span>Place: ${d.Place}</span>`)
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

        // const bars = chart.selectAll(`g`)
        //         .data(data)
        //     .enter().append(`g`)
        //         .attr(`transform`, (d, i) => `translate(${i * barWidth}, ${height - scaleDown(d[1])})`)
        //     .append(`rect`)
        //         .attr(`width`, barWidth)
        //         .attr(`fill`, rectFillNormal)
        //         .attr(`height`, d => scaleDown(d[1]))
        //         .on(`mouseover`, function (d) {
        //             const rect = d3.select(this);
        //             rect.attr(`fill`, rectFillHover);
        //             tooltip.transition()
        //                 .duration(250)
        //                 .style(`opacity`, `1`);
        //             tooltip.html(`<span style='font-weight: bold'>${d3.format(`$,.2f`)(d[1])} Billion</span><br><span>${d3.timeFormat(`%B - %Y`)(new Date(d[0]))}</span>`)
        //                 .style(`left`, `${d3.event.pageX + 10}px`)
        //                 .style(`top`, `${d3.event.pageY - 30}px`);
        //         })
        //         .on(`mouseleave`, function (d) {
        //             const rect = d3.select(this);
        //             rect.attr(`fill`, rectFillNormal);
        //             tooltip.transition()
        //                 .duration(500)
        //                 .style(`opacity`, `0`);
        //         })

        // const xTicks = chart.append(`g`)
        //     .attr(`class`, `x axis`)
        //     .attr(`transform`, `translate(0, ${height})`)
        //     .call(xAxis);

        // const yTicks = chart.append(`g`)
        //     .attr(`class`, `y axis`)
        //     .call(yAxis);

    })
    .catch(err => console.log(err));
