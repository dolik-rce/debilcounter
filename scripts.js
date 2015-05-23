var timeZoneOffset = new Date().getTimezoneOffset()*60000;

var printDate = function(e,x) {
	var d = (new Date(x+timeZoneOffset)).toLocaleString();
	e.insertAdjacentText("afterEnd", d);
	e.remove();
}

var printConf = function(e,x) {
	e.insertAdjacentText("afterEnd", conf[x]);
	e.remove();
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

var textareaKeyDown = function(e){
	e = e || event;
	if (e.keyCode === 13) {
		document.getElementById("describe").getElementsByTagName("form")[0].submit();
		return false;
	}
	return true;
}

var setTextFocus = function(elem) {
	elem.focus();
	elem.setSelectionRange(elem.value.length, elem.value.length);
}

var showEditForm = function(timestamp, event, desc) {
	var x = document.getElementById("describe");
	var d = x.getElementsByTagName("input")[1];
	d.className = event;
	d.value = "Upravit záznam z " + (new Date(timestamp*1000+timeZoneOffset)).toLocaleString();
	var f = x.getElementsByTagName("form")[0];
	f.date.value = timestamp;
	var t = f.getElementsByTagName("textarea")[0];
	t.onkeydown = textareaKeyDown;
	if (desc != "") {
		t.value = desc;
	} else if (event == "D") {
		t.value = "Jsem $CONF.FCOLUMN, protože "
	} else if (event == "B") {
		t.value = "Jsem $CONF.FCOLUMN2, protože "
	}
	x.style.left = window.innerWidth * 0.15 + "px";
	x.style.top = window.innerHeight * 0.25 + "px";
	x.style.display = "";
	setTextFocus(t);
}

var hideEditForm = function(timestamp, event, desc) {
	document.getElementById("describe").style.display = "none";
}

var reload = function(last) {
	conf.last = last;
	UxPost($Tables);
	UxPost($History);
}

var checkChanges = function() {
	if(!document[conf.hidden])
		UxPost($Changed("")+conf.last);
}

var toggleEmpty = function(x, e) {
	var section = document.getElementById("section_" + e);
	var confId = "inactiveHidden" + e;
	if(conf[confId]) {
		section.className = "";
		x.innerText = "Skrýt neaktivní uživatele";
	} else {
		section.className = "hideinactive";
		x.innerText = "Zobrazit neaktivní uživatele";
	}
	conf[confId] = !conf[confId];
	return false;
}

var conf = $json(CONF);

var init = function() {
	conf["last"] = 0;
	conf["hidden"] = "";
	conf["inactiveHiddenB"] = true;
	conf["inactiveHiddenD"] = true;
	if (typeof document.hidden !== "undefined") {
		conf.hidden = "hidden";
	} else if (typeof document.mozHidden !== "undefined") {
		conf.hidden = "mozHidden";
	} else if (typeof document.msHidden !== "undefined") {
		conf.hidden = "msHidden";
	} else if (typeof document.webkitHidden !== "undefined") {
		conf.hidden = "webkitHidden";
	}
	setInterval(checkChanges, 5000);
}

init();