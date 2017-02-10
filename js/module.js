/*
  Script for creating a standalone dynamic visualisations using the RAW library.

  \m/ (-_-) \m/

  The 8th of Feb, 2017 - Vathsav Harikrishnan

  // Todo
  > Chart params customisation - it's just the default values right now.
  > Consider removing the chart images from the chart.js files?
  > Colors still don't seem to work. :/
  > Minify everything. Keep the module's size under 500kb? [Currently 8,01,946 bytes]
  > Construct all of this form within the RAW app

  // General Fixes
  > Prevent dragging the dimensions values beyond the width and the height of the page.

  // console.log(Object.keys(colorScale.value.domain));
  // console.log(model.dimensions())

*/

$.getJSON("http://localhost:4000/raw_config.json", function(json) { init(json) });

var init = function(raw_config) {

    var text = raw_config.data;
    var parser = raw.parser();
    var data = parser(text);
    var metadata = parser.metadata(text);

    charts = raw.charts.values().sort(function(a, b) { return d3.ascending(a.category(), b.category()) || d3.ascending(a.title(), b.title()) })
    chart = charts.filter(function(d) { return d.title() == raw_config.chart_specifications.title })[0];
    model = chart ? chart.model() : null;

    var numberOfDimensions = model.dimensions().values().length;
    var numberOfOptions = chart.options().length;
    var dimensionKeys = Object.keys(raw_config.dimensions);

    function update() {
        d3.select("#chart")
            .append('svg')
            .datum(data)
            .call(chart);
    }

    while (numberOfDimensions--) {
        var title = model.dimensions().values()[numberOfDimensions].title();
        var value = raw_config.dimensions[numberOfDimensions];

        model.dimensions().values()[numberOfDimensions].title(dimensionKeys[numberOfDimensions]);
        model.dimensions().values()[numberOfDimensions].value.push(raw_config.dimensions[Object.keys(raw_config.dimensions)[numberOfDimensions]]);
        model.dimensions().values()[numberOfDimensions].multiple(false);
    }

    while (chart.options()[--numberOfOptions].type() == "color") {
        var scales = [{
                type: 'Ordinal (categories)',
                value: d3.scale.ordinal().range(raw.divergingRange(1)),
                reset: function(domain) {
                    this.value.range(raw.divergingRange(domain.length || 1));
                },
                update: function(domain) {
                    if (!domain.length) domain = [null];
                    this.value.domain(domain);
                }
            },
            {
                type: 'Linear (numeric)',
                value: d3.scale.linear().range(["#f7fbff", "#08306b"]),
                reset: function() {
                    this.value.range(["#f7fbff", "#08306b"]);
                },
                update: function(domain) {
                    domain = d3.extent(domain, function(d) {
                        return +d;
                    });
                    if (domain[0] == domain[1]) domain = [null];
                    this.value.domain(domain).interpolate(d3.interpolateLab);
                }
            }
        ];

        var colorScale = scales[0];
        chart.options()[numberOfOptions].value = colorScale.value;
        colorScale.reset(colorScale.value.domain());
    }

    update();
}
