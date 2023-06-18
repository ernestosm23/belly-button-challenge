function init() {
    // dropdown select box
    var selector = d3.select("#selDataset");
  
    // select options
    d3.json("samples.json").then((data) => {
      var sampleNames = data.names;
  
      sampleNames.forEach((sample) => {
        selector
          .append("option")
          .text(sample)
          .property("value", sample);
      });
  
      // build chart
      var firstSample = sampleNames[0];
      buildCharts(firstSample);
      buildMetadata(firstSample);
    });
  }
  
  // initialize the dashboard
  init();
  
  function optionChanged(newSample) {
    // get new data with sample selection
    buildMetadata(newSample);
    buildCharts(newSample);
    
  }
  
  // demographics
  function buildMetadata(sample) {
    d3.json("samples.json").then((data) => {
      var metadata = data.metadata;
      // filter data
      var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
      var result = resultArray[0];
      // using d3 library to select data
      var PANEL = d3.select("#sample-metadata");
  
      // blank html
      PANEL.html("");
  
      // Use `Object.entries` to add each key and value pair to the panel
      // Hint: Inside the loop, you will need to use d3 to append new
      // tags for each key-value in the metadata.
      Object.entries(result).forEach(([key, value]) => {
        PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
      });
  
    });
  }
  
  // Create the buildCharts function.
  function buildCharts(sample) {
  
    d3.json("samples.json").then((data) => {
      let samples = data.samples;
      let metadata = data.metadata;
      
      // Create variables
      let desiredSample = samples.filter(d => d.id == sample)[0]
      let desiredMeta = metadata.filter(d => d.id == sample)[0]
      let otu_IDs = desiredSample.otu_ids;
      let otu_labels = desiredSample.otu_labels;
      let sample_values = desiredSample.sample_values;
      let wfreq = parseInt(desiredMeta.wfreq)
  
      // Bar Chart
      var yticks = otu_IDs.map(function(id){
        return `OTU ${id}`;
      }).slice(0,10).reverse();
  
      // Bar Data
      var barData = [
        {
          x: sample_values.slice(0,10).reverse(),
          y: yticks,
          type: "bar",
          orientation: "h",
          text: otu_labels,
          marker: {
            color: otu_IDs,
            colorscale: 'Portland'}
        }
        ];
  
      // Bar Layout
      var barLayout = {
       title: "Top 10 Bacterial Cultures Found",
       titlefont: {"size": 25}
      };
  
      // Use Plotly to plot the data with the layout. 
      Plotly.newPlot('bar', barData, barLayout)
    
      // Bubble Chart Data
      var bubbleData = [
        {
          x: otu_IDs,
          y: sample_values,
          text: otu_labels,
          mode: "markers",
          marker: {
            size: sample_values,
            color: otu_IDs,
            colorscale: 'Portland'
          }
        }];
  
      // Bubble Layout
      var bubbleLayout = {
        title: "Bacterial Cultures per Sample",
        titlefont: {"size": 25},
        xaxis: {title: "OTU ID"},
        hovermode: "closest"      
      };
  
      // Plotly 
      Plotly.newPlot("bubble", bubbleData, bubbleLayout); 
  
      // Gauge Chart
      var gaugeData = [
        {
          title: {text: "Wash Frequency per Week", font: {size: 18}},
          type: "indicator",
          mode: "gauge+number",
          value: wfreq,
          tickmode: 'linear',
          gauge: {
            axis: { range: [null, 10], dtick: 2, tick0: 0 },
            bar: { color: "black" },
            steps: [
              { range: [0, 2], color: "indianred"},
              { range: [2, 4], color: "peachpuff"},
              { range: [4, 6], color: "lemonchiffon"},
              { range: [6, 8], color: "khaki" },
              { range: [8, 10], color: "lightblue" },
            ]},
            
        }];
        // 5. Create the layout for the gauge chart.
        var gaugeLayout = { 
          title: "Belly Button Washing Frequency",
          titlefont: {"size": 25}
        };
  
  
      // Use Plotly to plot the gauge data and layout.
      Plotly.newPlot('gauge', gaugeData, gaugeLayout);
    });
  }