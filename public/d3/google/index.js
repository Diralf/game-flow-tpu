
function run() {
    console.log({ sheetForm: window.sheetForm, sheet_url: window.sheet_url.value });
    google.charts.load('current');
    google.charts.setOnLoadCallback(init);
}

window.sheetForm.addEventListener('submit', function (event) {
    // Stop the browser trying to submit the form itself.
    event.preventDefault();
    run();
});



function init() {
    if (!window.sheet_url.value) throw Error('Sheet URL should be specified');
    var url = window.sheet_url.value;
    var query = new google.visualization.Query(url);
    query.setQuery('select A, B');
    query.send(processSheetsData);
}

function processSheetsData(response) {
    var array = [];
    var data = response.getDataTable();
    var columns = data.getNumberOfColumns();
    var rows = data.getNumberOfRows();
    for (var r = 0; r < rows; r++) {
        var row = [];
        for (var c = 0; c < columns; c++) {
            row.push(data.getFormattedValue(r, c));
        }
        array.push({
            name: row[0],
            value: +row[1],
        });
    }
    console.log({ data, columns, rows, array });
    renderData(array);
}

function renderData(data) {
    const margin = { top: 30, right: 0, bottom: 30, left: 50 };
    const color = 'steelblue';
    const height = 400;
    const width = 600;
    const yAxis = (g) =>
        g
            .attr('transform', `translate(${margin.left},0)`)
            .call(d3.axisLeft(y).ticks(null, data.format))
            .call((g) => g.select('.domain').remove())
            .call((g) =>
                g
                    .append('text')
                    .attr('x', -margin.left)
                    .attr('y', 10)
                    .attr('fill', 'currentColor')
                    .attr('text-anchor', 'start')
                    .text(data.y)
            );

    const xAxis = (g) =>
        g.attr('transform', `translate(0,${height - margin.bottom})`).call(
            d3
                .axisBottom(x)
                .tickFormat((i) => data[i].name)
                .tickSizeOuter(0)
        );
    const y = d3
        .scaleLinear()
        .domain([0, d3.max(data, (d) => d.value)])
        .nice()
        .range([height - margin.bottom, margin.top]);

    const x = d3
        .scaleBand()
        .domain(d3.range(data.length))
        .range([margin.left, width - margin.right])
        .padding(0.1);

    const svg = d3.select('svg').attr('width', width).attr('height', height).attr('fill', color);

    svg
        .selectAll('rect')
        .data(data)
        .enter()
        .append('rect')
        .attr('x', (d, i) => x(i))
        .attr('y', (d) => y(d.value))
        .attr('height', (d) => y(0) - y(d.value))
        .attr('width', x.bandwidth());

    svg.append('g').call(xAxis);

    svg.append('g').call(yAxis);
}