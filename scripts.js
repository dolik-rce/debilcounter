var timeZoneOffset = new Date().getTimezoneOffset()*60000;

var printDate = function(x) {
	document.write((new Date(x+timeZoneOffset)).toLocaleString());
}

var toggleConf = function() {
	var conf = document.getElementById('conf');
	if (conf.style.display == 'none')
		conf.style.display = 'block';
	else
		conf.style.display = 'none';
	return false;
}

var updateConf = function(clear){
	x=document.getElementById("incD");
	x2=document.getElementById("incB");
	c=document.getElementById("fcolumnD");
	c2=document.getElementById("fcolumnB");
	f=document.getElementById("confForm");
	if(clear) {
		x.innerText = "$CONF.MSG";
		x2.innerText = "$CONF.MSG2";
		c.innerText = "$CONF.FCOLUMN";
		c2.innerText = "$CONF.FCOLUMN2";
		x.style.color = "";
		x2.style.color = "";
		x.style.backgroundColor = "";
		x2.style.backgroundColor = "";
		return;
	}
	x.innerText = f[0].value;
	x2.innerText = f[1].value;
	c.innerText = f[2].value;
	c2.innerText = f[3].value;
	x.style.color = f[4].value;
	x2.style.color = f[5].value;
	x.style.backgroundColor = f[6].value;
	x2.style.backgroundColor = f[7].value;
}

var setTextFocus = function(elem) {
	elem.focus();
	elem.setSelectionRange(elem.value.length, elem.value.length);
}

var showEditForm = function(elem) {
	var x=elem.nextElementSibling;
	if (x.style.display=="none") {
		x.style.display="";
		setTextFocus(x.firstElementChild.firstElementChild);
	} else {
		x.style.display = "none";
	}
}
