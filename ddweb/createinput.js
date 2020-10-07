const d = new Date();
const year = d.getFullYear();
const mon = d.getMonth() + 1;
const day = d.getDate();

const fechatiempo = year + "-" + `${mon<10 ? `0${mon}`:mon}-${day<10 ? `0${day}`:day}`;

document.getElementById("registeredDate").value = fechatiempo;