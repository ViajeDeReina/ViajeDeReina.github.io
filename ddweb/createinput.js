const d = new Date();
const year = d.getFullYear();
const mon = d.getMonth() + 1;
const day = d.getDate();
const hour = d.getHours();
const mins = d.getMinutes();
const secs = d.getSeconds();

const fechatiempo = `${year}-${`${mon < 10 ? `0${mon}` : mon}-${day < 10 ? `0${day}` : day} ${hour < 10 ? `0${hour}` : hour}:${mins < 10 ? `0${mins}` : mins}:${secs < 10 ? `0${secs}` : secs}`}`;

document.getElementById("registeredDate").value = fechatiempo;