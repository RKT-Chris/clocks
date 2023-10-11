const weekdays = ["Dimanche", "Lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"];
const months = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
var clock = 0;
function getMilliseconds() {
    let date = new Date();
    return date.getMilliseconds();
}
function getSeconds() {
    let date = new Date();
    return date.getSeconds();
};
function getMinutes() {
    let date = new Date();
    return date.getMinutes();
};
function getHours() {
    let date = new Date();
    return date.getHours();
};
function getWeekday() {;
    let date = new Date();
    return weekdays[date.getDay()];
};
function getMonthday() {
    let date = new Date();
    return date.getDate();
};
function getMonth() {
    let date = new Date();
    return months[date.getMonth()];
};
function getYear() {
    let date = new Date();
    return date.getFullYear();
};
function get_pos_on_circle(xcenter, ycenter, radius, angle) {
    return {
        x : xcenter + radius * Math.cos(angle - 0.5 * Math.PI),
        y : ycenter + radius * Math.sin(angle - 0.5 * Math.PI)
    }
}
window.onload = function () {
    const H = window.innerHeight;
    const W = window.innerWidth;
    console.log(H, W);
    const canvas = document.getElementById("clock");
    const ctx = canvas.getContext("2d");
        canvas.addEventListener("click", () => {
        if(clock < 1){
            clock+=1;
        }
        else{
            clock = 0;
        }
        ctx.clearRect(0,0, 1920, 1080)
    })

    function draw() {
        const H = window.innerHeight;
        const W = window.innerWidth;
        canvas.height = H;
        canvas.width = W;
        const middle_y = H/2;
        const middle_x = W/2; 
        window.requestAnimationFrame(draw);
        ctx.clearRect(249, 99, 802, 802);
        var gradients = {
            day : ctx.createLinearGradient(425, 0, 1000, 50),
            time : ctx.createLinearGradient(585, 310, 700, 360),
            clock : {
                seconds : ctx.createLinearGradient(middle_x - 130, middle_y - 130, middle_x + 130, middle_y + 130),
                minutes : ctx.createLinearGradient(middle_x - 130, middle_y - 130, middle_x + 130, middle_y + 130),
                hours : ctx.createLinearGradient(middle_x - 130, middle_y - 130, middle_x + 130, middle_y + 130)
            },
            jauge : {
                seconds : ctx.createLinearGradient(850, 160, 900, 400),
                minutes : ctx.createLinearGradient(650, 160, 700, 400),
                hours : ctx.createLinearGradient(450, 160, 500, 400)
            }
        }
        gradients.day.addColorStop(0, "blueviolet");
        gradients.day.addColorStop(1, "orangered");
        gradients.time.addColorStop(0, "blueviolet");
        gradients.time.addColorStop(1, "orangered");
        for (let i = 0; i < 5; i++) {
            for (let j = 0; j < 5; j++) {
                ctx.beginPath();
                ctx.fillStyle = "rgb(" + (255 - 51 * i) + "," + (255 - 51 * j) + ",255)";
                ctx.rect(W/5*j, H/5*i, W/5, H/5);
                ctx.fill();
                ctx.closePath();
            }
        }
        ctx.beginPath()
        ctx.font = W/20 + "px sans-serif";
        ctx.fillStyle = gradients.day;
        ctx.fillText(getWeekday() + " " + getMonthday() + " " + getMonth() + " " + getYear(), W/2 - W/5, H/10);
        ctx.fill();
        ctx.closePath()
        switch (clock) {
            case 0:
                gradients.clock.hours.addColorStop(0, "lightgreen");
                gradients.clock.hours.addColorStop(1, "blue");
                gradients.clock.seconds.addColorStop(0, "blue");
                gradients.clock.seconds.addColorStop(1, "red");
                gradients.clock.minutes.addColorStop(0, "red");
                gradients.clock.minutes.addColorStop(1, "lightgreen");
                
                class circle {
                    constructor(unite, nb, color, width) {
                        this.unite = unite;
                        this.nb = nb;
                        this.angle = unite*nb;
                        this.color = color;
                        this.width = width;
                    }
                }
                let circles = [
                    new circle((2*Math.PI)/720, getHours() < 12 ? getHours()*60 + getMinutes() : (getHours() - 12)*60 + getMinutes(), gradients.clock.hours, 10),
                    new circle((2*Math.PI)/3600, getMinutes()*60 + getSeconds(), gradients.clock.minutes, 5),
                    new circle((2*Math.PI)/60000, getSeconds()*1000 + getMilliseconds(), gradients.clock.seconds, 2)
                ]

                for (let i = 0; i < circles.length; i++) {
                    ctx.lineWidth = circles[i].width;
                    ctx.beginPath();
                    ctx.strokeStyle = circles[i].color;
                    ctx.arc(middle_x, middle_y, W/10 - W/25 + W/40 * i, -0.5 * Math.PI, circles[i].angle - 0.5 * Math.PI);
                    ctx.stroke();
                    ctx.closePath();
                }

                for (let i = 0; i < circles.length; i++) {
                    ctx.lineWidth = circles[i].width;
                    ctx.beginPath();
                    ctx.fillStyle = circles[i].color;
                    ctx.arc(W/2, H/2 - (W/10 - W/25 + W/40 * i), circles[i].width/2, 0, 2*Math.PI);
                    ctx.fill();
                    ctx.closePath()
                }

                for (let i = 0; i < circles.length; i++) {
                    ctx.lineWidth = 3-i;
                    ctx.beginPath();
                    ctx.fillStyle = "darkgrey";
                    ctx.strokeStyle = "whitesmoke";
                    var pos = get_pos_on_circle(middle_x, middle_y, W/10 - W/25 + W/40 * i, circles[i].angle);
                    ctx.arc(pos.x, pos.y, 6-i, -0.5 * Math.PI, 1.5 * Math.PI);
                    ctx.fill();
                    ctx.stroke()
                    ctx.closePath()
                }

                ctx.beginPath();
                ctx.font = W/26 + "px sans-serif";
                ctx.fillStyle = gradients.time;
                ctx.fillText(getMinutes() >= 10 && getHours() >= 10 ? getHours().toString() + ":" + getMinutes().toString() : getMinutes() < 10 && getHours() >= 10 ? getHours().toString() + ":0" + getMinutes() : getMinutes() >= 10 && getHours() < 10 ? "0" + getHours().toString() + ":" + getMinutes().toString() : "0" + getHours().toString() + ":00", W/2 - W/20, H/2 + W/60);
                ctx.fill();
                ctx.closePath();
                break;  
            case 1:
                gradients.jauge.hours.addColorStop(0, "lightgreen");
                gradients.jauge.hours.addColorStop(1, "blue");

                gradients.jauge.minutes.addColorStop(0, "orangered");
                gradients.jauge.minutes.addColorStop(1, "lightgreen");

                gradients.jauge.seconds.addColorStop(0, "blue");
                gradients.jauge.seconds.addColorStop(1, "orangered");
                
                unite = [H/2.5/1440, H/2.5/3600, H/2.5/60000];
                let h = [getHours()*60 + getMinutes(), (getMinutes()*60 + getSeconds()), (getSeconds()*1000 + getMilliseconds())];
                let hauteur = new Array();
                let y = new Array();
                var jauge_color = [gradients.jauge.hours, gradients.jauge.minutes, gradients.jauge.seconds];
                var get = [getHours(), getMinutes(), getSeconds()];
                for (let i = 0; i < h.length; i++) {
                    hauteur[i] = h[i] * unite[i];
                    y[i] = H/4 + H/2.5 - hauteur[i];
                }

                for (let i = 0; i < 3; i++) {
                    ctx.beginPath();
                    ctx.rect(W/3 + W/6 * i, H/4, W/24, H/2.5);
                    ctx.fillStyle = "darkgrey";
                    ctx.fill();
                    ctx.closePath();
                }

                for (let i = 0; i < 3; i++) {
                    ctx.beginPath();
                    ctx.fillStyle = jauge_color[i];
                    ctx.rect(W/3 + W/6 * i, y[i], W/24, hauteur[i]);
                    ctx.fill();
                    ctx.closePath();
                }

                for (let i = 0; i < 3; i++) {
                    ctx.beginPath();
                    ctx.font = "25px sans-serif";
                    ctx.fillStyle = "black";
                    ctx.fillText(get[i] >= 10 ? get[i] : "0" + get[i].toString(), (W/3 + W/6 * i), H/1.4);
                    ctx.fill();
                    ctx.closePath();
                }
                break;
        }
    }
    draw()
};