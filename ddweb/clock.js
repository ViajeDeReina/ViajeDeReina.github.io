const clock = document.querySelector(".clock");

function getTime() {
    const d = new Date();
    const year = d.getFullYear();
    const mon = d.getMonth() + 1;
    const day = d.getDate();
    const hour = d.getHours();
    const mins = d.getMinutes();
    const secs = d.getSeconds();
    clock.innerHTML = year + "-" + `${mon<10 ? `0${mon}`:mon}-${day<10 ? `0${day}`:day} ${hour<10 ? `0${hour}`:hour}:${mins<10 ? `0${mins}`:mins}:${secs<10 ? `0${secs}`:secs}`; 
  }
  function clock_init() {
    getTime();
    setInterval(getTime, 1000);
  }

  clock_init();