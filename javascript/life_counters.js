
const baseURL       = 'http://127.0.0.1:8080';
const templ_path    = '/html/';

var players         = [];
var domparser       = new DOMParser();
var xhr             = new XMLHttpRequest();

var main_content    = document.querySelector('.main_content');
var player_columns;
var life_counts;
var life_buttons_p5;
var life_buttons_p1;
var life_buttons_m1;
var life_buttons_m5;

const callAPI       = async (myURL) =>
{
    let file        = "";

    const response  = await fetch(myURL);
    file            = await response.text();
    return file;
}

//  client_side utilities

//  Sanitizes string_in checking for ints. Warning: 11fxoifS => 11, a11b => NaN
function intParser(string_in)
{
    const parsed = parseInt(string_in, 10);
    if(isNaN(parsed) && (parsed !== null))
    {
        return 1;
    }
    return parsed;
}

//  Simple utility that returns a query with type specified in "variable"
function getQueryVariable(variable_in)
{
    var query   = window.location.search.substring(1);
    var vars    = query.split('&');
    for (var i  = 0; i < vars.length; i++)
    {
        var pair= vars[i].split('=');
        if (decodeURIComponent(pair[0]) == variable_in)
        {
            return decodeURIComponent(pair[1]);
        }
    }
    console.log('Query variable %s not found', variable_in);
    return 0;
}

//  Player class containing life, rgb value and DOM update methods and values
function Player(div_in, counter_in)
{
    this.life       = 20;
    this.rgb_code   = "";
    this.div        = div_in;
    this.counter    = counter_in;

    this.updateRgb  = function() {
        this.rgb_code   = "rgb(" + (255 * ((25 - this.life) / 25)) + "," + (255 * (this.life / 25)) + ",0)";
        this.div.style.backgroundColor = this.rgb_code;
        this.counter.innerHTML = this.life;
    };

    this.hit        = function(dmg_val) {
        this.life  += dmg_val;
        this.updateRgb();
    };
}

function addPlayer(div_in, counter_in)
{
    let temp_player = new Player(div_in, counter_in);
    players.push(temp_player);
}

function startup()
{
    let players_num = getQueryVariable('pl');
    if(players_num  = -1) {
        players_num = 2;
    }

    let myURL = baseURL + templ_path + 'player_template.html';

    callAPI(myURL)
    .then(result => {
        alert(result);
        for(let i = 0; i < players_num; i++) {
            main_content.insertAdjacentHTML('beforeend', result);
        }
        alert("exiting first then");
    })
    .then(newRes => {
        player_columns  = document.querySelectorAll('.column');
        life_counts     = document.querySelectorAll('.player_life');

        alert(player_columns.length);
        alert(life_counts.length);

        for(let i = 0; i < players_num; i++) {
            addPlayer(player_columns[i], life_counts[i]);
            players[i].updateRgb();
        }

        life_buttons_p5 = document.querySelectorAll('.button_p5');
        life_buttons_p1 = document.querySelectorAll('.button_p1');
        life_buttons_m1 = document.querySelectorAll('.button_m1');
        life_buttons_m5 = document.querySelectorAll('.button_m5');
        alert(players.length);

        let i = 0;
        for(const button of life_buttons_p5) {
            button.addEventListener('click', function() { players[i].hit(5); });
            i++;
        }
        i = 0;
        for(const button of life_buttons_p1) {
            button.addEventListener('click', function() { players[i].hit(1); });
            i++;
        }
        i = 0;
        for(const button of life_buttons_m1) {
            button.addEventListener('click', function() { players[i].hit(-1); });
            i++;
        }
        i = 0;
        for(const button of life_buttons_m5) {
            button.addEventListener('click', function() { players[i].hit(-5); });
            i++;
        }
    })
    .catch(failure => {
        alert(error);
    });
}

window.onload = startup();
