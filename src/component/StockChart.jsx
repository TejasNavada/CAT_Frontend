import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';


class IndexedPriorityQueue {
  constructor(size) {
    this.size = size; // Maximum number of elements
    this.pq = []; // Priority queue to store indices
    this.qp = new Array(size).fill(-1); // Maps indices to their position in `pq`
    this.keys = new Array(size).fill(null); // Priority values associated with indices
    this.n = 0; // Number of elements in the queue
  }

  isEmpty() {
    return this.n === 0;
  }
  getKeys() {
    return this.keys;
  }

  contains(index) {
    return this.qp[index] !== -1;
  }

  insert(index, key) {
    // console.log(index,key)
    // console.log(this)
    if (this.contains(index)) throw new Error("Index is already in the priority queue.");
    this.keys[index] = key;
    this.pq[this.n] = index;
    this.qp[index] = this.n;
    this.swim(this.n);
    this.n++;
  }

  minIndex() {
    if (this.isEmpty()) throw new Error("Priority queue is empty.");
    return this.pq[0];
  }

  minKey() {
    if (this.isEmpty()) throw new Error("Priority queue is empty.");
    return this.keys[this.pq[0]];
  }

  deleteMin() {
    if (this.isEmpty()) throw new Error("Priority queue is empty.");
    const minIndex = this.pq[0];
    this.exchange(0, this.n - 1);
    this.n--;
    this.sink(0);
    this.qp[minIndex] = -1;
    this.keys[minIndex] = null;
    this.pq.pop();
    return minIndex;
  }

  decreaseKey(index, key) {
    if (!this.contains(index)) throw new Error("Index is not in the priority queue.");
    if (key >= this.keys[index]) throw new Error("New key is not smaller than the current key.");
    this.keys[index] = key;
    this.swim(this.qp[index]);
  }

  increaseKey(index, key) {
    if (!this.contains(index)) throw new Error("Index is not in the priority queue.");
    if (key <= this.keys[index]) throw new Error("New key is not larger than the current key.");
    this.keys[index] = key;
    this.sink(this.qp[index]);
  }

  // Helper methods
  less(i, j) {
    return this.keys[this.pq[i]] < this.keys[this.pq[j]];
  }

  exchange(i, j) {
    const swap = this.pq[i];
    this.pq[i] = this.pq[j];
    this.pq[j] = swap;
    this.qp[this.pq[i]] = i;
    this.qp[this.pq[j]] = j;
  }

  swim(k) {
    while (k > 0 && this.less(k, Math.floor((k - 1) / 2))) {
      this.exchange(k, Math.floor((k - 1) / 2));
      k = Math.floor((k - 1) / 2);
    }
  }

  sink(k) {
    while (2 * k + 1 < this.n) {
      let j = 2 * k + 1;
      if (j < this.n - 1 && this.less(j + 1, j)) j++;
      if (!this.less(j, k)) break;
      this.exchange(k, j);
      k = j;
    }
  }
}


const StockChart = ({ data, transactions, startHeight,efficientOrPretty }) => {
  const svgRef = useRef(null);
  const margin = { top: 20, right: 0, bottom: 30, left: 70 };
  const width = 1500;
  const height = 500;
  const transitionDuration = 300;

  useEffect(() => {
    if (!data || data.length === 0) return;

    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

     // Parse transaction dates
    const parsedTransactions = transactions.map(t => ({
        ...t,
        date: new Date(t.date) // Convert string dates to Date objects
    }));
    // Create scales
    const x = d3.scaleUtc()
      .domain(d3.extent(data, d => d.date))
      .range([margin.left, width - margin.right]);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.adjClose)])
      .range([height - margin.bottom, margin.top]);

    // Store current x-scale reference
    let currentX = x;

    // Create line and area generators
    const line = d3.line()
      .x(d => currentX(d.date))
      .y(d => y(d.adjClose));

    const area = d3.area()
      .x(d => currentX(d.date))
      .y0(height - margin.bottom)
      .y1(d => y(d.adjClose));

    // Add clip path
    const clip = svg.append("defs").append("clipPath")
      .attr("id", "chart-clip")
      .append("rect")
      .attr("x", margin.left)
      .attr("y", margin.top)
      .attr("width", width - margin.left - margin.right)
      .attr("height", height - margin.top - margin.bottom);

    // Create main chart group
    const chart = svg.append("g").attr("clip-path", "url(#chart-clip)");

    // Add area
    chart.append("path")
      .datum(data)
      .attr("class", "area stockchart-area") // Added specific class
      .attr("d", area)
      .style("fill", "url(#gradient)");

    // Add line
    chart.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("class", "line")
      .attr("d", line)
      .attr("stroke", "steelblue")
      .attr("stroke-width", 1.5);

    // Add axes
    const xAxisGroup = svg.append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(currentX).ticks(width / 80));
    
    xAxisGroup.selectAll("text")
      .style("fill", "white"); // Style for labels

    xAxisGroup.selectAll("line")
      .style("stroke", "white"); // Style for tick lines

    xAxisGroup.select(".domain") // The main axis line
      .style("stroke", "white");

      

    const yAxisGroup = svg.append("g")
      .attr("class", "y-axis")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y).ticks(height / 40))
      //.call(g => g.select(".domain").remove()); // You are removing the domain line here
    yAxisGroup.selectAll("text")
      .style("fill", "white"); // Style for labels

    yAxisGroup.selectAll("line")
      .style("stroke", "white"); // Style for tick lines
    yAxisGroup.select(".domain").style("stroke", "white");

    const initialYMaxForGradient = d3.max(data, d => d.adjClose) || 0;
    const initialYMinForGradient = 0; // Assuming y-domain always starts at 0 for this chart

    // Add gradient
    svg.append("defs")
      .append("linearGradient")
      .attr("id", "gradient")
      .attr("gradientUnits", "userSpaceOnUse") // Key change: use user space coordinates
      .attr("x1", "0%") // Gradient is vertical
      .attr("y1", y(initialYMaxForGradient)) // Top of gradient in user space (maps to max value)
      .attr("x2", "0%")
      .attr("y2", y(initialYMinForGradient)) // Bottom of gradient in user space (maps to min value, e.g., 0)
      .selectAll("stop")
      .data([
          { offset: "0%", color: "#304040", opacity: 0.7 }, // Color at y1 (top of data)
          { offset: "100%", color: "#333333", opacity: 0.1 } // Color at y2 (bottom of data, e.g., 0 line)
      ])
      .enter().append("stop")
      .attr("offset", d_stop => d_stop.offset)
      .style("stop-color", d_stop => d_stop.color)
      .style("stop-opacity", d_stop => d_stop.opacity);

    // gradient.append("stop")
    //   .attr("offset", "0%")
    //   .style("stop-color", "#304040")
    //   .style("stop-opacity", 1);

    // gradient.append("stop")
    //   .attr("offset", "100%")
    //   .style("stop-color", "#333333")
    //   .style("stop-opacity", 0);
    // gradient.append("stop")
    //   .attr("offset", "0%")
    //   .style("stop-color", "#304040") // Darker, more opaque at the top
    //   .style("stop-opacity", 0.7); // Slightly adjusted opacity

    // gradient.append("stop")
    //   .attr("offset", "100%")
    //   .style("stop-color", "#333333") // Lighter, less opaque at the bottom
    //   .style("stop-opacity", 0.1); // Slightly adjusted opacity for a softer fade

    // Zoom functionality
    const zoom = d3.zoom()
      .scaleExtent([1, 32])
      .translateExtent([[margin.left, -Infinity], [width - margin.right, Infinity]])
      .on("zoom", zoomed);

    svg.call(zoom);

    // Interaction elements
    const focus = svg.append("g").attr("class", "focus").style("display", "none");
    focus.append("circle").attr("r", 6).attr("stroke", "#00ff00");
    
    // const rule = svg.append("line")
    //   .attr("stroke", "black")
    //   .attr("y1", margin.top)
    //   .attr("y2", height - margin.bottom);

    const tooltip = svg.append("g").style("display", "none");

    const TransactionTooltip = d3.select("body")
        .append("div")
        .attr("class", "tooltip")
        .style("position", "absolute")
        .style("background", "white")
        .style("border", "1px solid #ccc")
        .style("padding", "5px")
        .style("border-radius", "5px")
        .style("visibility", "hidden")
        .style("pointer-events", "none") // Prevent blocking mouse interactions
        .style("font-size", "12px");
    

    // const overlay = svg.append("rect")
    //   .attr("class", "overlay")
    //   .attr("width", innerWidth)
    //   .attr("height", innerHeight)
    //   .attr("transform", `translate(${margin.left},${margin.top})`)
    //   .style("fill", "none")
    //   .style("pointer-events", "all");

      // Add transaction elements after chart creation
    const transactionGroup = svg.append("g").attr("class", "transactions");
    // Group transactions by date to handle overlapping
    const groupedTransactions = d3.group(parsedTransactions, d => +d.date);
    function convert(num){
      num=num-1
      let flip = -1+(2*(num%2))
      num = Math.ceil(num/2);
      return num*flip
    }
    // Offset overlapping transactions
    transactionGroup.selectAll(".transaction-line")
      .data(parsedTransactions)
      .join("line")
      .attr("class", "transaction-line")
      .attr("x1", d => {
        const group = groupedTransactions.get(+d.date);
        group.sort((a, b) => a.transactionId - b.transactionId);
        const index = group.findIndex(t => t === d);
        return currentX(d.date) + index * 5; // Offset by 5 pixels for each transaction on the same date
      })
      .attr("x2", d => {
        const group = groupedTransactions.get(+d.date);
        group.sort((a, b) => a.transactionId - b.transactionId);
        const index = group.findIndex(t => t === d);
        return currentX(d.date) + index * 5;
      })
      .attr("y1", margin.top)
      .attr("y2", height - margin.bottom)
      .attr("stroke", d => d.type === 'P'||d.type === 'Purchase' ? "#00ff00" : "#ff0000")
      .attr("stroke-width", 1)
      .attr("stroke-dasharray", "4 2")
      
      .on("mouseover", function (event, d) {
        TransactionTooltip.style("visibility", "visible")
        d3.select(this).style("opacity", 0.8);
      })
      .on("mousemove", function (event, d) {
        console.log(d,d.bioguideId.toLowerCase())

        // Update tooltip text
        TransactionTooltip.style("top", (event.pageY - 20) + "px")
            .style("left", (event.pageX + 10) + "px")
            .html("<div style=\"display:flex; align-items: center;\"><img   src=\"https://www.congress.gov/img/member/"+ d.bioguideId.toLowerCase()+"_200.jpg\" style=\"object-fit: cover; border-radius: 50%; height: 50px; width: 50px;\"></img><div style=\"margin-left: 10px;\"><div>"+d.firstName+" " + d.lastName+"</div><div>Transaction name: "+d.name+"</div><div>Description: "+d.description+"</div><div>Date: "+formatDate(d.date)+"</div><div>Type: "+d.type+"</div><div>Amount: "+d.amount+"</div></div></div>"); // Show stock name & value
      })
      .on("mouseout", function () {
        TransactionTooltip.style("visibility", "hidden");
          d3.select(this).style("opacity", 1);
      });

      const Threshold = 110; // Define the threshold for proximity in the x-axis
      const verticalSpacing = 12; // Space between annotations when staggered
      transactionGroup.selectAll(".transaction-label")
      .data(parsedTransactions)
      .join("text")
      .attr("class", "transaction-label")
      .attr("x", d => {
        const group = groupedTransactions.get(+d.date);
        group.sort((a, b) => a.transactionId - b.transactionId);
        const index = group.findIndex(t => t === d);
        return currentX(d.date) + index * 5; // Maintain horizontal offset
      })
      .attr("y", startHeight)
      .attr("text-anchor", "middle")
      .text(d => d.amount)
      .style("font-size", "10px")
      .style("fill", "#ffffff")
      .on("mouseover", function (event, d) {
        TransactionTooltip.style("visibility", "visible")
        d3.select(this).style("opacity", 0.8);
      })
      .on("mousemove", function (event, d) {
        console.log(d,d.bioguideId.toLowerCase())

        // Update tooltip text
        TransactionTooltip.style("top", (event.pageY - 20) + "px")
            .style("left", (event.pageX + 10) + "px")
            .html("<div style=\"display:flex; align-items: center;\"><img   src=\"https://www.congress.gov/img/member/"+ d.bioguideId.toLowerCase()+"_200.jpg\" style=\"object-fit: cover; border-radius: 50%; height: 50px; width: 50px;\"></img><div style=\"margin-left: 10px;\"><div>"+d.firstName+" " + d.lastName+"</div><div>Transaction name: "+d.name+"</div><div>Description: "+d.description+"</div><div>Type: "+d.type+"</div><div>Amount: "+d.amount+"</div></div></div>"); // Show stock name & value
      })
      .on("mouseout", function () {
        TransactionTooltip.style("visibility", "hidden");
          d3.select(this).style("opacity", 1);
      });

        // Sort the labels by their x-coordinate (start time)
        const labelNodes = transactionGroup.selectAll(".transaction-label")
        .nodes()
        .map((node, idx) => {
          const d = node.__data__;
          const group = groupedTransactions.get(+d.date);
          group.sort((a, b) => a.transactionId - b.transactionId);
          const index = group.findIndex(t => t === d);
          const currentXPos =  currentX(d.date) + index * 5; // Maintain offset
          return {
            x: +currentXPos,
            y: +d3.select(node).attr("y"),
            id: idx,  // Unique identifier for each label
            node: node,  // Store the DOM node for later use
            data: d  // Store the data for later use
          };
        });
        //console.log(labelNodes)
        // Sort the labels by their x-coordinate to follow the greedy interval scheduling order
        labelNodes.sort((a, b) => a.x - b.x);
      
      
        let d = 1
        let min_pq = new IndexedPriorityQueue(labelNodes.length+5);
        
        // Iterate through the sorted labels and assign y-positions
        labelNodes.forEach((label, index,labelNodes) => {
          //console.log(index)
          if(index==0){
              min_pq.insert(1,label.x)
              d3.select(label.node) 
              .attr("x",label.x)
              .attr("y", (startHeight));
          }
          else{
            if(!efficientOrPretty){
              let keys = min_pq.getKeys();
              //console.log(keys)
              let found = false;
              for( let i = 1;i<keys.length;i++){
                //console.log(label.x,label.x - keys[i])
                if(keys[i]!=null&&label.x - keys[i]>=Threshold ){
                  //assign to resource j
                  d3.select(label.node) 
                  .attr("x",label.x)
                  .attr("y", (startHeight)+(convert(i)*verticalSpacing));
                  min_pq.increaseKey(i, label.x)
                  found=true;
                  break;
                }
              }
              if(!found){
                d+=1;
                //assign to resource d
                d3.select(label.node) 
                .attr("x",label.x)
                .attr("y", (startHeight)+(convert(d)*verticalSpacing));
                min_pq.insert(d, label.x)
              }
            }
            else{
              let j = min_pq.minIndex();
              //not overlapping with latest resource
              console.log(j,min_pq.minKey(),label.x,label.x- min_pq.minKey())
              if(label.x- min_pq.minKey()>=Threshold){
                
                //assign to resource j
                d3.select(label.node) 
                .attr("x",label.x)
                .attr("y", (startHeight)+(convert(j)*verticalSpacing));
                min_pq.increaseKey(j, label.x)
              }
              else{
                d+=1;
                //assign to resource d
                d3.select(label.node) 
                .attr("x",label.x)
                .attr("y", (startHeight)+(convert(d)*verticalSpacing));
                min_pq.insert(d, label.x)
              }
            }
          }
        });


      function zoomed(event) {
        currentX = event.transform.rescaleX(x);
        const [minDate, maxDate] = currentX.domain();
        const visible = data.filter(d => d.date >= minDate && d.date <= maxDate);
        const maxVisibleTotal = d3.max(visible, d => d.adjClose);

        // Update gradient coordinates based on the new y-domain
        const currentVisibleYMax = y.domain()[1]; // Get max from the scale's current domain
        const currentVisibleYMin = 0; // Get min from the scale's current domain (should be 0)

        svg.select("#stockchart-gradient")
          .attr("y1", y(currentVisibleYMax)) // y-coordinate for the top of the current y-domain
          .attr("y2", y(currentVisibleYMin));    // y-coordinate for the bottom of the current y-domain (0 line)
        
          y.domain([0, maxVisibleTotal]);
        svg.select(".y-axis")   // give your left axis a class when you append it
          .transition()        // optional smooth transition
          .duration(transitionDuration)
          .call(d3.axisLeft(y).ticks(height / 40));
      
        // Update chart elements (line and area)
        chart.select(".area").attr("d", area);
        chart.select(".line").attr("d", line);
        xAxisGroup
          .transition()        // optional smooth transition
          .duration(transitionDuration)
          .call(d3.axisBottom(currentX).ticks(width / 80));
        xAxisGroup.selectAll("text").style("fill", "white");
        xAxisGroup.selectAll("line").style("stroke", "white");
        xAxisGroup.select(".domain").style("stroke", "white");

        yAxisGroup.selectAll("text").style("fill", "white");
        yAxisGroup.selectAll("line").style("stroke", "white");
        yAxisGroup.select(".domain").style("stroke", "white");
      
        // Update transaction positions with offset logic (transaction lines)
        transactionGroup.selectAll(".transaction-line")
          .attr("x1", d => {
            const group = groupedTransactions.get(+d.date);
            group.sort((a, b) => a.transactionId - b.transactionId);
            const index = group.findIndex(t => t === d);
            return currentX(d.date) + index * 5; // Maintain offset
          })
          .attr("x2", d => {
            const group = groupedTransactions.get(+d.date);
            group.sort((a, b) => a.transactionId - b.transactionId);
            const index = group.findIndex(t => t === d);
            return currentX(d.date) + index * 5; // Maintain offset
          });
        
          // Sort the labels by their x-coordinate (start time)
        const labelNodes = transactionGroup.selectAll(".transaction-label")
        .nodes()
        .map((node, idx) => {
          const d = node.__data__;
          const group = groupedTransactions.get(+d.date);
          group.sort((a, b) => a.transactionId - b.transactionId);
          const index = group.findIndex(t => t === d);
          const currentXPos =  currentX(d.date) + index * 5; // Maintain offset
          return {
            x: +currentXPos,
            y: +d3.select(node).attr("y"),
            id: idx,  // Unique identifier for each label
            node: node,  // Store the DOM node for later use
            data: d  // Store the data for later use
          };
        });
        //console.log(labelNodes)
        // Sort the labels by their x-coordinate to follow the greedy interval scheduling order
        labelNodes.sort((a, b) => a.x - b.x);
      
      
        let d = 1
        let min_pq = new IndexedPriorityQueue(labelNodes.length+5);
        // Iterate through the sorted labels and assign y-positions
        labelNodes.forEach((label, index,labelNodes) => {
          //console.log(index)
          if(index==0){
              min_pq.insert(1,label.x)
              d3.select(label.node) 
              .attr("x",label.x)
              .attr("y", (startHeight));
          }
          else{
            if(!efficientOrPretty){
              let keys = min_pq.getKeys();
              //console.log(keys)
              let found = false;
              for( let i = 1;i<keys.length;i++){
                //console.log(label.x,label.x - keys[i])
                if(keys[i]!=null&&label.x - keys[i]>=Threshold ){
                  //assign to resource j
                  d3.select(label.node) 
                  .attr("x",label.x)
                  .attr("y", (startHeight)+(convert(i)*verticalSpacing));
                  min_pq.increaseKey(i, label.x)
                  found=true;
                  break;
                }
              }
              if(!found){
                d+=1;
                //assign to resource d
                d3.select(label.node) 
                .attr("x",label.x)
                .attr("y", (startHeight)+(convert(d)*verticalSpacing));
                min_pq.insert(d, label.x)
              }
            }
            else{
              let j = min_pq.minIndex();
              //not overlapping with latest resource
              //console.log(j,min_pq.minKey(),label.x,label.x- min_pq.minKey())
              if(label.x- min_pq.minKey()>=Threshold){
                
                //assign to resource j
                d3.select(label.node) 
                .attr("x",label.x)
                .attr("y", (startHeight)+(convert(j)*verticalSpacing));
                min_pq.increaseKey(j, label.x)
              }
              else{
                d+=1;
                //assign to resource d
                d3.select(label.node) 
                .attr("x",label.x)
                .attr("y", (startHeight)+(convert(d)*verticalSpacing));
                min_pq.insert(d, label.x)
              }
            }
            

            
            
          }

          // const currentXPos = label.x;
          // console.log(currentXPos,label.data.date.toDateString());
          
          
          // const overlaps = labelNodes.filter(label => 
          //   Math.abs(label.x - currentXPos) < Threshold && label.x < currentXPos  // Threshold for proximity in x-axis
          // );
          
          // let currentYPos = height / 2;
          // let maxY = currentYPos; 
          // overlaps.sort((a,b)=>a.node.y.baseVal[0].valueInSpecifiedUnits-b.node.y.baseVal[0].valueInSpecifiedUnits);
          // for(let i = 0; i < overlaps.length; i ++){
          //   if (Math.abs(overlaps[i].node.y.baseVal[0].valueInSpecifiedUnits - maxY) >= verticalSpacing) {
          //     break;
          //   }
          //   maxY = maxY + verticalSpacing
          // }

          // d3.select(label.node) // Use `label.node` here instead of `labelNodes[index].data`
          //   .attr("x",currentXPos)
          //   .attr("y", maxY);
        });
        
      
        // Update interaction position based on the mouse position
        const [mouseX] = d3.pointer(event.sourceEvent, svg.node());
        update(currentX.invert(mouseX));
      }
      

    // Update function
    function update(date) {
      if (!data || data.length === 0) return;

      const bisect = d3.bisector(d => d.date).left;
      let i = bisect(data, date, 1);
      i = Math.max(1, Math.min(i, data.length - 1));
      
      const d0 = data[i - 1];
      const d1 = data[i];
      if (!d0 || !d1) return;

      const d = date - d0.date > d1.date - date ? d1 : d0;
      console.log(d)
      if (d?.date && d?.adjClose) {
        const xPos = currentX(d.date);
        const yPos = y(d.adjClose);
        
        focus.attr("transform", `translate(${xPos},${yPos})`);
        //rule.attr("transform", `translate(${xPos},0)`);
        
        // Update tooltip position
        tooltip.style("display", null)
          .attr("transform", `translate(${xPos},${yPos-65})`);

        const path = tooltip.selectAll("path")
        .data([,])
        .join("path")
            .attr("fill", "white")
            .attr("stroke", "black");

        const text = tooltip.selectAll("text")
        .data([,])
        .join("text")
        .call(text => text
            .selectAll("tspan")
            .data([formatDate(d.date), formatValue(d.adjClose)])
            .join("tspan")
            .attr("x", 0)
            .attr("y", (_, i) => `${i * 1.1}em`)
            .attr("font-weight", (_, i) => i ? null : "bold")
            .text(d => d));

        size(text, path);
      }
    }

    // Interaction handlers
    svg.on("mouseover", () => {
      focus.style("display", null);
      tooltip.style("display", null);
    })
    .on("mouseout", () => {
      focus.style("display", "none");
      tooltip.style("display", "none");
    })
    .on("mousemove touchmove", function(event) {
      const [mouseX] = d3.pointer(event, this);
      const adjustedX = mouseX;
      const currentDate = currentX.invert(adjustedX);
      
      if (currentDate >= data[0].date && currentDate <= data[data.length - 1].date) {
        update(currentDate);
      }
    });
    // Wraps the text with a callout path of the correct size, as measured in the page.
    function size(text, path) {
        const {x, y, width: w, height: h} = text.node().getBBox();
        text.attr("transform", `translate(${-w / 2},${15 - y})`);
        path.attr("d", `M${-w / 2 - 10},0h${w + 20}v${h + 20}H5l-5,5l-5,-5H${-w / 2 - 10}Z`);
    }
    function formatValue(value) {
        return value.toLocaleString("en", {
            style: "currency",
            currency: "USD"
        });
    }
      
    function formatDate(date) {
    return date.toLocaleString("en", {
        month: "short",
        day: "numeric",
        year: "numeric",
        timeZone: "UTC"
    });
    }

  }, [data,transactions]);

  return (
    <svg 
      ref={svgRef}
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{ maxWidth: '100%', height: 'auto' }}
    />
  );
};

export default StockChart;