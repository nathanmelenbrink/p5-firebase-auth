let container, canv, input, dateInput, button; 
let loggedInUser;

function setup(){
	container = createElement('div').id('container');
	canv = createCanvas(600, 400).parent(container);
	input = createInput('beverages').parent(container);

	dateInput = document.createElement("INPUT");
    dateInput.setAttribute("type", "date");
    dateInput.setAttribute("value", new Date());
    dateInput.setAttribute("id", 'dateInput');
    document.getElementById('container').appendChild(dateInput);

	button = createButton('submit').parent(container);
	button.mousePressed(submitToFirebase);
	container.hide(); // don't show by default, wait until user signs in 
}

function plotChart(){
	background(200);
	let entries;
	return firebase.database().ref('/users/' + loggedInUser.uid).once('value').then(function(snapshot) {
		entries = snapshot.val().entries;
		let keys = Object.keys(entries);
		for (let i = 0; i < keys.length; i++) {
			let key = keys[i];
			let entry = entries[key];
		    console.log(entry);
		    console.log(key);
		    let x = (width / keys.length) * i; 
		    let y = (height/5) * entry.bevs;
		    ellipse(x, y, 20, 20);
		}
	});
	console.log(entries);

}

function loginUser(){
	loggedInUser = firebase.auth().currentUser;
	container.show();
	
	plotChart();
}

function logoutUser(){
	container.hide();
}

function submitToFirebase(){
	let day = document.getElementById('dateInput').value;
	let val = parseInt(input.value());
	input.value('');

  	firebase.database().ref('users/' + loggedInUser.uid + '/entries/' + day).set({
		bevs: val
        //some more entry data
    });

    plotChart(); // after the user submits data, refresh the chart
}