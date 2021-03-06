d3.csv("/datasets/grades-ge/ge-all.csv", chart);

function chart(allGrades) {

  var l = [];
  allGrades.map(function(d, i) {
          var c = count(l, Math.round(d.MedianA*100))
          d.count = c
          d.index = i;
          l.push(Math.round(d.MedianA*100))
      })

  filteredGrades = allGrades; // global variable
  grades = allGrades // global variable
  pickedTheme = "0" // global variable

  gradesExtent = d3.extent(allGrades, function(d) { return d.MedianA })
  gradesScale = d3.scale.linear().domain([0, 1]).range([800, 30]);
  colorScale = d3.scale.linear().domain(gradesExtent).range(["#D57728", "#28D577"])
          .interpolate(d3.interpolateHcl)

  totClassExtent = d3.extent(allGrades, function(d) { return parseInt(d.TotClasses) })
  totClassScale = d3.scale.pow().exponent(0.5).domain(totClassExtent).range([0, -250])

  $("button.pickReq").click(function() {
        if ( !($(this).hasClass("blue")) ) {
          $(this).siblings().each(function() {
              if ($(this).hasClass("blue")) {
                $(this).removeClass("blue")
                $(this).addClass("basic")
              }
          })
          $(this).addClass("blue")
          $(this).removeClass("basic")
        }

        var pickedReq = $(this).attr("value")
        switch(pickedReq) {
          case "0":
            filteredGrades = allGrades;
            pickTheme(pickedTheme)
            break
          case "1":
            filteredGrades = allGrades.filter(function(d) { return d.GE === "Arts and Humanities-Literary and Cultural Analysis" })
            pickTheme(pickedTheme)
            break
          case "2":
            filteredGrades = allGrades.filter(function(d) { return d.GE === "Arts and Humanities-Philosophical and Linguistic Analysis" })
            pickTheme(pickedTheme)
            break
          case "3":
            filteredGrades = allGrades.filter(function(d) { return d.GE === "Arts and Humanities-Visual and Performance Arts Analysis and Practice" })
            pickTheme(pickedTheme)
            break
          case "4":
            filteredGrades = allGrades.filter(function(d) { return d.GE === "Society and Culture-Historical Analysis" })
            pickTheme(pickedTheme)
            break
          case "5":
            filteredGrades = allGrades.filter(function(d) { return d.GE === "Society and Culture-Social Analysis" })
            pickTheme(pickedTheme)
            break
          case "6":
            filteredGrades = allGrades.filter(function(d) { return d.GE === "Scientific Inquiry-Life Sciences" })
            pickTheme(pickedTheme)
            break
          case "7":
            filteredGrades = allGrades.filter(function(d) { return d.GE === "Scientific Inquiry-Physical Sciences" })
            pickTheme(pickedTheme)
            break
        }
      })

  var xAxis = d3.svg.axis()
      .scale(gradesScale)
      .orient("bottom")
      .tickValues([0, 0.25, 0.5, 0.75, 1])
      .outerTickSize(0.5)
      .tickPadding(10)
      .tickFormat(d3.format("%"))

  var yAxis = d3.svg.axis()
      .scale(totClassScale)
      .orient("left")
      .ticks(5)
      .outerTickSize(0.5)
      .tickPadding(3);


  d3.select("svg#chart").append("g")
    .attr("transform", "translate(0, 440)")
    .attr("class", "axis")
    .call(xAxis)

  d3.select("svg#chart").append("g")
    .attr("transform", "translate(800, 440)")
    .attr("class", "axis")
    .call(yAxis)

  // add axis labels
  d3.select("svg#chart").append("text")
      .attr("text-anchor", "middle")
      .attr("transform", "translate(800, 150)")
      .attr("class", "labelsY")
      .text("Total sections since fall 2012");

  d3.select("svg#chart").append("text")
      .attr("text-anchor", "middle")
      .attr("transform", "translate(400, 500)")
      .attr("class", "labelsX")
      .text("Percent of students who earned As");


  function pickTheme(theme) {
    switch (theme) {
      case "0":
        grades = filteredGrades;
        break;
      case "1":
        grades = filteredGrades.filter(function(d) { return d.TotClasses >= 5 & d.MedianA >= 0.6 });
        break;
      case "2":
        grades = filteredGrades.filter(function(d) { return d.TotClasses >= 5 & d.MedianA <= 0.3 });
        break;
      case "3":
        grades = filteredGrades.filter(function(d) { return d.ClassSize <= 40 & d.MedianA >= 0.6 });
        break;
      case "4":
        grades = filteredGrades.filter(function(d) { return d.ClassSize >= 100 & d.MedianA >= 0.6 });
        break;
    }
    updateChart(grades);
  }

  $("button.pickTheme").click(function() {
      if ( !($(this).hasClass("olive")) ) {
        $(this).siblings().each(function() {
            if ($(this).hasClass("olive")) {
              $(this).removeClass("olive")
              $(this).addClass("basic")
            }
        })
        $(this).addClass("olive")
        $(this).removeClass("basic")
      }
      pickedTheme = $(this).attr("value")
      pickTheme(pickedTheme)
  })

  // this renders initially once only
  updateChart(allGrades);
}


// update selection based on which combination of GE category and theme user chooses
function updateChart(grades) {
  var bottomY = 420;
  var infoX = 80;
  var infoY = 40;
  var circleRadius = 5;
  var selectedRadius = 6;

  var circles = d3.select("svg#chart")
    .selectAll("circle")
    .data(grades, function(d) { return d.index })


  circles.enter()
    .append("circle")
    .attr("r", circleRadius)
    .attr("cx", function(d, i) { return gradesScale(d.MedianA) })
    .attr("cy", function(d, i) {
            return bottomY + totClassScale(d.TotClasses)
      })
    .style("fill", function(d) { return colorScale(d.MedianA) })


    circles.on("mouseover", function(d, i) { return mouseOver(d, i) })
    .on("mouseleave", function(d, i) { return mouseLeave(d, i) })

  var classNameInfo = d3.select("svg#chart")
          .append("text")
          .attr("x", infoX)
          .attr("y", infoY)
  var classGradeInfo = d3.select("svg#chart")
          .append("text")
          .attr("x", infoX)
          .attr("y", infoY + 40)
  var classOtherInfo = d3.select("svg#chart")
          .append("text")
          .attr("x", infoX)
          .attr("y", infoY + 80)

  function mouseOver(d, i) {
    classNameInfo.text(d.Subject + " " + d.CatalogNo + " : " + d.Name);
    classGradeInfo.text("Typically, " + Math.round(d.MedianA*100) +
                    " percent of students get an A+, A or A- in this class.");
    classOtherInfo.text("This class has been taught " + d.TotClasses + (d.TotClasses > 1 ? " times" : " time") +
                    " since Fall 2012. A typical class has " + d.ClassSize + " students.")


    circles.filter(function(p, j) { return i === j })
        .attr("r", selectedRadius)
        .style("fill", "#3255A4")
  }

  function mouseLeave(d, i) {
    classNameInfo.text("");
    classGradeInfo.text("");
    classOtherInfo.text("");

    circles.attr("r", 5)
           .style("fill", function(d) { return colorScale(d.MedianA) })
  }

  // remove and transition out of existing selection to prep for new selection
  circles.exit().remove();

}


// utility function to count number of targets in an array
function count(array, target) {
  var count = 0;
  for(var i = 0; i < array.length; ++i){
     if(array[i] == target)
         count++;
  }
  return count
}
