
var DATA;
// Si tu veux utiliser les DATA en dur comme ca
// Decommente ca

DATA = {
 "name": "TOPIC",
 "children": [
	 {
		 "name": "TOPIC 2",
		 "children": [
			{"name": "3", "size": 5000},
			{"name": "4", "size": 3938}
		 ]
	 },
	 {"name": "1", "size": 3938},
	 {"name": "2", "size": 3938},
 ]
};


window.onload = function () {

	var url_array = document.location.pathname.split('/');
	var room = url_array[1];
	var socket;
	var once = 1;

	if (room === "")
		socket = io();
	else
		socket = io("/" + room);

	socket.on("get id", function(data) {
		console.log(data.id);
	});
/*
	// Commente ca
	socket.on("update data", function(data) {
		console.log("UPDATEDATA");
		DATA = data;
	});

	// Et ca
	socket.emit("get data");

	// Et ca
	socket.on("get data", function(data) {
		DATA = data;
		start();
	});
	*/

	// Decommente ca
	 start();
}

function start() {
	var svg = d3.select("svg"),
	    margin = 100,
	    diameter = +svg.attr("height"),
	    g = svg.append("g").attr("transform", "translate(" + svg.attr("width") / 2 + "," + diameter / 2 + ")");



	var color = d3.scaleLinear()
	    .domain([-1, 5])
	    .range(["rgb(56,64,100)", "rgb(80,230,200)"])
	    .interpolate(d3.interpolateHcl);

	var pack = d3.pack()
	    .size([diameter - margin, diameter - margin])
	    .padding(10);



	svg.style("background", color(-1))
		 .on("click", function() { zoom(root); });
/*
	d3.json("nodes.json", function(error, root) {
	  if (error) throw error;
*/
/*
	var DATA = {
	 "name": "TOPIC",
	 "children": [
		 {
			 "name": "CAT 1",
			 "children": [
				{"name": "3", "size": 5000},
				{"name": "4", "size": 3938},
 				{"name": "3", "size": 5000},
 				{"name": "4", "size": 3938},
				{"name": "4", "size": 3938},
 				{"name": "3", "size": 5000},
 				{"name": "4", "size": 3938},
				{"name": "4", "size": 3938},
 				{"name": "3", "size": 5000},
 				{"name": "4", "size": 3938},
			 ]
		 },
		 {
			 "name": "CAT 2",
			 "children": [
				{"name": "3", "size": 5000},
				{"name": "4", "size": 3938},
 				{"name": "3", "size": 5000},
 				{"name": "4", "size": 3938},
				{"name": "4", "size": 3938},
 				{"name": "3", "size": 5000},
 				{"name": "4", "size": 3938},
			 ]
		 },
		 {
			 "name": "CAT 3",
			 "children": [
				{"name": "3", "size": 5000},
				{"name": "4", "size": 3938},
 				{"name": "3", "size": 5000},
 				{"name": "4", "size": 3938},
				{"name": "4", "size": 3938},
 				{"name": "3", "size": 5000},
 				{"name": "4", "size": 3938},
			 ]
		 },
	 ]
	};
*/
	var firstRun = true;
	var view, focus;

	function update() {

		console.log('>> UPDATE');

		root = d3.hierarchy(DATA)
			 .sum(function(d) { return d.size; })
			 .sort(function(a, b) { return b.value - a.value; });

		if (firstRun == true) {
	 		focus = root;
		}

  	var nodes = pack(root).descendants();

  	var circle = g.selectAll("circle")
		      .data(nodes)
		      .enter().append("circle")
		      .attr("class", function(d) { return d.parent ? d.children ? "node" : "node node--leaf" : "node node--root"; })
		      .attr('id', function(d) { return d.data.name; })
		      .style("fill", function(d) { return d.children ? color(d.depth) : null; })
		      .on("click", function(d) { if (focus !== d) zoom(d), d3.event.stopPropagation(); });
			/*
			.attr('rscale', 0)
			.transition()
			.delay(function(d) { return d.depth * 50; })
			.duration(5000)
  		.attrTween("rscale", function(d) {
				return d3.interpolate(0, 1);
			});
			*/


/*
		function plonk(path, duration) {
		  d3.select(plonkLock).transition()
		      .duration(duration)
		      .tween("style:fill", function() {
		        var i = d3.interpolateRgb("red", "green");
		        return function(t) { path.style("fill", i(t)); };
		      })
		    .transition()
		      .tween("style:fill", function() {
		        var i = d3.interpolateRgb("green", "red");
		        return function(t) { path.style("fill", i(t)); };
		      });

		  setTimeout(function() { plonk(path, duration); }, (Math.random() + 2) * duration);
		}
*/

		var text = g.selectAll("text")
			    .data(nodes)
			    .enter().append("text")
			    .attr("class", "label")
			    .style("fill-opacity", function(d) { return d.parent === root ? 1 : 0; })
			    .attr('css-visible', function(d) { return d.parent === root ? 'true' : 'false'; })
	     // .style("display", function(d) { return d.parent === root ? "inline" : "none"; })
			    .text(function(d) { return d.data.name; });

		var node = g.selectAll("circle,text");

		if (firstRun == true) {
			view = root;
		//	zoomTo([focus.x, focus.y, focus.r * 2 + margin]);
		}

		if (firstRun == true) {
			firstRun = false;
		}

		zoom(focus);
	}

	function zoom(d) {
		var focus0 = focus;
		focus = d;

		console.log('>> ZOOM');
		console.log('Focus from [', focus0.data.name, '] to [', focus.data.name,']');
		console.log('Item focused:', d.data.name);

		console.log(focus0, focus);

		var k = diameter / (focus.r * 2 + margin);

		g.selectAll('circle')
			.transition()
			.duration(600)
			.attr("r", function(d) { return d.r * k; })
			.attr("transform", function(d) { return "translate(" + (d.x - focus.x) * k + "," + (d.y - focus.y) * k + ")"; });


 		g.selectAll('text')
 			.transition()
 			.duration(600)
 			.attr("transform", function(d) { return "translate(" + (d.x - focus.x) * k + "," + (d.y - focus.y) * k + ")"; })
			.style("fill-opacity", function(d) { console.log('d',d); console.log('focus',focus); return d.parent != null ? d.parent.data.name === focus.data.name ? 1 : 0 : 0; })
			.on("start", function(d) { if (d.parent != null) if (d.parent.data.name === focus.data.name) this.style.display = "inline"; })
			.on("end", function(d) { if (d.parent != null) if (d.parent.data.name !== focus.data.name) this.style.display = "none"; });

/*

		transition.selectAll("text")
		 .filter(function(d) { return d.parent === focus || this.style.display === "inline"; })
			 .style("fill-opacity", function(d) { return d.parent === focus ? 1 : 0; })
			 .on("start", function(d) { if (d.parent === focus) this.style.display = "inline"; })
			 .on("end", function(d) { if (d.parent !== focus) this.style.display = "none"; });

			 */

	}







	update();

	// Decommente ca aussi si tu as besoin

	setTimeout(function(){
		DATA.children[0].children.push({"name": "YOUHOU", "size": 3938});

		update();

		// setTimeout(function(){
		// 		$('svg').trigger('click');
		// },1500);
	}, 2000);

	// Pareil
	/*
	setTimeout(function(){
		DATA.children[0].children[0].size = 6000;

		update();
	}, 6000);
	*/





//	});



};
