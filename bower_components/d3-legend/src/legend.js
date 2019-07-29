import { select } from "d3-selection"
import { format, formatPrefix } from "d3-format"

const d3_identity = d => d

const d3_reverse = arr => {
  const mirror = []
  for (let i = 0, l = arr.length; i < l; i++) {
    mirror[i] = arr[l - i - 1]
  }
  return mirror
}

//Text wrapping code adapted from Mike Bostock
const d3_textWrapping = (text, width) => {
  text.each(function() {
    var text = select(this),
      words = text
        .text()
        .split(/\s+/)
        .reverse(),
      word,
      line = [],
      lineNumber = 0,
      lineHeight = 1.2, //ems
      y = text.attr("y"),
      dy = parseFloat(text.attr("dy")) || 0,
      tspan = text
        .text(null)
        .append("tspan")
        .attr("x", 0)
        .attr("dy", dy + "em")

    while ((word = words.pop())) {
      line.push(word)
      tspan.text(line.join(" "))
      if (tspan.node().getComputedTextLength() > width && line.length > 1) {
        line.pop()
        tspan.text(line.join(" "))
        line = [word]
        tspan = text
          .append("tspan")
          .attr("x", 0)
          .attr("dy", lineHeight + dy + "em")
          .text(word)
      }
    }
  })
}

const d3_mergeLabels = (gen = [], labels, domain, range, labelDelimiter) => {
  if (typeof labels === "object") {
    if (labels.length === 0) return gen

    let i = labels.length
    for (; i < gen.length; i++) {
      labels.push(gen[i])
    }
    return labels
  } else if (typeof labels === "function") {
    const customLabels = []
    const genLength = gen.length
    for (let i = 0; i < genLength; i++) {
      customLabels.push(
        labels({
          i,
          genLength,
          generatedLabels: gen,
          domain,
          range,
          labelDelimiter
        })
      )
    }
    return customLabels
  }

  return gen
}

const d3_linearLegend = (scale, cells, labelFormat) => {
  let data = []

  if (cells.length > 1) {
    data = cells
  } else {
    const domain = scale.domain(),
      increment = (domain[domain.length - 1] - domain[0]) / (cells - 1)
    let i = 0

    for (; i < cells; i++) {
      data.push(domain[0] + i * increment)
    }
  }

  const labels = data.map(labelFormat)
  return {
    data: data,
    labels: labels,
    feature: d => scale(d)
  }
}

const d3_quantLegend = (scale, labelFormat, labelDelimiter) => {
  const labels = scale.range().map(d => {
    const invert = scale.invertExtent(d)
    return (
      labelFormat(invert[0]) +
      " " +
      labelDelimiter +
      " " +
      labelFormat(invert[1])
    )
  })

  return {
    data: scale.range(),
    labels: labels,
    feature: d3_identity
  }
}

const d3_ordinalLegend = scale => ({
  data: scale.domain(),
  labels: scale.domain(),
  feature: d => scale(d)
})

const d3_cellOver = (cellDispatcher, d, obj) => {
  cellDispatcher.call("cellover", obj, d)
}

const d3_cellOut = (cellDispatcher, d, obj) => {
  cellDispatcher.call("cellout", obj, d)
}

const d3_cellClick = (cellDispatcher, d, obj) => {
  cellDispatcher.call("cellclick", obj, d)
}

export default {
  d3_drawShapes: (
    shape,
    shapes,
    shapeHeight,
    shapeWidth,
    shapeRadius,
    path
  ) => {
    if (shape === "rect") {
      shapes.attr("height", shapeHeight).attr("width", shapeWidth)
    } else if (shape === "circle") {
      shapes.attr("r", shapeRadius)
    } else if (shape === "line") {
      shapes
        .attr("x1", 0)
        .attr("x2", shapeWidth)
        .attr("y1", 0)
        .attr("y2", 0)
    } else if (shape === "path") {
      shapes.attr("d", path)
    }
  },

  d3_addText: function(svg, enter, labels, classPrefix, labelWidth) {
    enter.append("text").attr("class", classPrefix + "label")
    const text = svg
      .selectAll(`g.${classPrefix}cell text.${classPrefix}label`)
      .data(labels)
      .text(d3_identity)

    if (labelWidth) {
      svg
        .selectAll(`g.${classPrefix}cell text.${classPrefix}label`)
        .call(d3_textWrapping, labelWidth)
    }

    return text
  },

  d3_calcType: function(
    scale,
    ascending,
    cells,
    labels,
    labelFormat,
    labelDelimiter
  ) {
    const type = scale.invertExtent
      ? d3_quantLegend(scale, labelFormat, labelDelimiter)
      : scale.ticks
        ? d3_linearLegend(scale, cells, labelFormat)
        : d3_ordinalLegend(scale)

    //for d3.scaleSequential that doesn't have a range function
    const range = (scale.range && scale.range()) || scale.domain()
    type.labels = d3_mergeLabels(
      type.labels,
      labels,
      scale.domain(),
      range,
      labelDelimiter
    )

    if (ascending) {
      type.labels = d3_reverse(type.labels)
      type.data = d3_reverse(type.data)
    }

    return type
  },

  d3_filterCells: (type, cellFilter) => {
    let filterCells = type.data
      .map((d, i) => ({ data: d, label: type.labels[i] }))
      .filter(cellFilter)
    const dataValues = filterCells.map(d => d.data)
    const labelValues = filterCells.map(d => d.label)
    type.data = type.data.filter(d => dataValues.indexOf(d) !== -1)
    type.labels = type.labels.filter(d => labelValues.indexOf(d) !== -1)
    return type
  },

  d3_placement: (orient, cell, cellTrans, text, textTrans, labelAlign) => {
    cell.attr("transform", cellTrans)
    text.attr("transform", textTrans)
    if (orient === "horizontal") {
      text.style("text-anchor", labelAlign)
    }
  },

  d3_addEvents: function(cells, dispatcher) {
    cells
      .on("mouseover.legend", function(d) {
        d3_cellOver(dispatcher, d, this)
      })
      .on("mouseout.legend", function(d) {
        d3_cellOut(dispatcher, d, this)
      })
      .on("click.legend", function(d) {
        d3_cellClick(dispatcher, d, this)
      })
  },

  d3_title: (svg, title, classPrefix, titleWidth) => {
    if (title !== "") {
      const titleText = svg.selectAll("text." + classPrefix + "legendTitle")

      titleText
        .data([title])
        .enter()
        .append("text")
        .attr("class", classPrefix + "legendTitle")

      svg.selectAll("text." + classPrefix + "legendTitle").text(title)

      if (titleWidth) {
        svg
          .selectAll("text." + classPrefix + "legendTitle")
          .call(d3_textWrapping, titleWidth)
      }

      const cellsSvg = svg.select("." + classPrefix + "legendCells")
      const yOffset = svg
          .select("." + classPrefix + "legendTitle")
          .nodes()
          .map(d => d.getBBox().height)[0],
        xOffset = -cellsSvg.nodes().map(function(d) {
          return d.getBBox().x
        })[0]
      cellsSvg.attr("transform", "translate(" + xOffset + "," + yOffset + ")")
    }
  },

  d3_defaultLocale: {
    format,
    formatPrefix
  },

  d3_defaultFormatSpecifier: ".01f",

  d3_defaultDelimiter: "to"
}
