// Filters the data based on the magnitude range of the tornado events.
function filterData(data) {
  return data.filter(function(rawData) {
    return rawData.mag >= 1 && rawData.mag <= 5;
  });
}

// Groups the data by year and tornado magnitude.
function groupData(filteredData, mag) {
  return d3.nest()
    .key(function(rawData) { return rawData.yr; })
    .rollup(function(v) { return d3.sum(v, function(magVal) { return magVal.mag === mag ? 1 : 0; }); })
    .entries(filteredData);
}
// Creates a trace object with the specified data, magnitude, and color.
function createTrace(data, mag, color) {
  return {
    x: data.map(function(x1) { return x1.key; }),
    y: data.map(function(y1) { return y1.value; }),
    name: 'EF Scale ' + mag,
    type: 'bar',
    marker: {
      color: color
    }
  };
}

// Layout for the Bar Chart.
function createLayout() {
  return {
    title: {
        text: 'Number of Tornado Events by Magnitude and Year in the USA',
        font: {
        size: 25
        }
    },
    barmode: 'stack',
    xaxis: {
      title: 'Year',
      titlefont: {
        size: 25
      },
      tickfont: {
        size: 18
      },
      // Make sure the chart leaves a little bit of room on the sides for better display.
      range: [1948.5, 2022.5],
      // Start tick from 1950.
      tick0: 1950, 
      // Set ticks interval to 5 years.
      dtick: 5 
    },
    yaxis: {
      title: {
        text: 'Number of Tornado Events',
        font: {
          size: 25
        }
      },
      tickfont: {
        size: 18
      }
    },
    legend: {
        title: {
        text: 'Tornado Magnitude: <br>(Click/Double Click<br>To Toggle EF Value)<br>',
        font: {
        size: 18
        }
          }
        },
        margin: {
            l: 100,
            r: 50
        }
      };
}
// Creates and updates the plot with the given data and year filter.
function createPlot(data, year) {
  // Filter the data based on the specified magnitude range (1-5).
  let filteredData = filterData(data);
  // If specific year is provided, filter the data based on that year.
  if (year) {
    filteredData = filteredData.filter(function(yearPlace) {
      return yearPlace.yr == year;
    });
  }
  // Group the data that was filtered by year for each EF tornado scale 1-5.
  let magYear1 = groupData(filteredData, '1');
  let magYear2 = groupData(filteredData, '2');
  let magYear3 = groupData(filteredData, '3');
  let magYear4 = groupData(filteredData, '4');
  let magYear5 = groupData(filteredData, '5');
  // Current Colors with increasing intensity based on 1-5.
  let trace1 = createTrace(magYear1, '1', 'FFCC99');
  let trace2 = createTrace(magYear2, '2', 'FFA07A');
  let trace3 = createTrace(magYear3, '3', 'FF7F50');
  let trace4 = createTrace(magYear4, '4', 'FF4500');
  let trace5 = createTrace(magYear5, '5', 'FF0000');
  // Combine all traces into a single array for plotting.
  let traceData = [trace1, trace2, trace3, trace4, trace5];
  // Calls on the above created layout to be the variable that will go into the Plotly below.
  let layout = createLayout();
  // Plotly display of this data.
  Plotly.newPlot('myDiv', traceData, layout);
}

// Interactive legend for toggling visibility of each magnitude trace.
function createLegend() {
  // Legend Items Showing Magnitude strenght of the storm.
  let legendItems = ['Magnitude 1', 'Magnitude 2', 'Magnitude 3', 'Magnitude 4', 'Magnitude 5'];
  // storing initial variable and the state of visibility for the display
  let visibleTraces = [true, true, true, true, true];
  // The toggle Button becomes the Legend itself.
  let toggleButton = d3.select('#toggle');
  // Bind the legendItems to 'input' elements and create a clickable on labels with titles as magnitudes.
  toggleButton.selectAll('input')
    .data(legendItems)
    .enter()
    .append('div')
    .style('display', 'inline-block')
    .html(function(rawData) {
      return '<label><input type="checkbox" checked>' + rawData + '</label>';
    })
    // Add a click event listener to each item in the legend. If clicked or double clicked changes take place.
    // If double clicked only 1 item is selected and all others dropped. If single clicked a single item is added or dropped.
    .on('click', function(x, i) {
      // Get the "state" of the clicked checkbox, either on or off.
      let clickedTrace = this.childNodes[0].checked;
      // Variable for the current on or off state.
      let update = { visible: visibleTraces };
      // If clicked on change visibility of the corresponding trace to true, otherwise set to false.
      if (clickedTrace) {
        update.visible[i] = true;
      } else {
        update.visible[i] = false;
      }
      // Update Plotly with new visibility states.
      Plotly.update('myDiv', update, {});
    });
}

// Main function that initializes the plot, legend, and year selector
function init() {
  loadData().then(createPlot);
  createLegend();
  populateYearSelector();
}

// Start the visualization
init();
