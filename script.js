'use strict'; //strict mode: catch silly errors

//the data!
var dataList = [ //create some data
   {id:1, name:'A', sleep:1},
   {id:2, name:'B', sleep:3},
   {id:3, name:'C', sleep:6},
];


function update(dataList){

  var sleepMax = d3.max(dataList, function(d){ return d.sleep;});
  var widthScale = d3.scale.linear()
          .domain([0, sleepMax])   //sleep interval
          .range([10, 380]); //pixel interval

  var svg = d3.select('svg'); //reference to the HTML element
  
  var xAxis = d3.svg.axis().scale(widthScale).orient('top').ticks(5)
  
  svg.select('g').remove();
  svg.append('g') //to position the axis
    .attr('transform','translate(0,20)')  
    .call(xAxis);
  
  var rectList = svg.selectAll('rect'); //reference all the rects in the svg
  
  var dataJoin = rectList.data(dataList, function(item){return item.id}); //connect the two lists
  
  dataJoin.enter().append('rect').attr('width',0);
  
  dataJoin //for each thing in the join set
    .on('click', function(item){
      console.log('clicky clicky');
      item.sleep += 1;
      update(dataList);
    })
    .on('mouseover', function(item){
      d3.select(this).attr('fill', 'yellow');
    })
    .on('mouseout', function(item){
      d3.select(this).attr('fill', function(item){
        if(item.sleep <= 4){
          return 'red';
        }
        else {
          return 'blue';
        }
      });
    })
    .attr({x:10, height:40}) //all rects have same x and height
    .transition()
    .duration(1000)
    .attr('y', function(dataItem){ //y is a function of the item
      return dataItem.id*50; //multiply by 50
    })
    .attr('width', function(item){ //width is a function of the the item
      return widthScale(item.sleep);
    })
    .attr('fill',function(item){
      if(item.sleep <= 4){
        return 'red';
      }
      else {
        return 'blue';
      }
    })
    
  
  dataJoin.exit().transition().attr('width',0).remove();
}

update(dataList);





/** Button Handlers **/
$('#addButton').click(function(){
  var lastId = 0; //last person's id
  if(dataList.length > 0){
    lastId = dataList[dataList.length-1].id;
  }

  //add new person at end
  dataList.push({
    id:lastId+1, //increment id
    name:'New',
    sleep: Math.floor(Math.random()*24) //random sleep (integer)
  })
  console.log(dataList);
  update(dataList);
});

$('#remButton').click(function(){
  //remove first person
  dataList.shift();
  console.log(dataList);
  update(dataList);
});

$('#moreButton').click(function(){
  dataList[0].sleep += 1; //increase first guy
  console.log(dataList);
  update(dataList);
});

$('#lessButton').click(function(){
  //decrease first guy; min 0
  dataList[0].sleep = Math.max(dataList[0].sleep - 1, 0);
  console.log(dataList);
  update(dataList);
});

$('#resetButton').click(function(){
  dataList = [
    {id:1, name:'A', sleep:1},
    {id:2, name:'B', sleep:3},
    {id:3, name:'C', sleep:6},
  ];
  console.log(dataList);
  update(dataList);
});