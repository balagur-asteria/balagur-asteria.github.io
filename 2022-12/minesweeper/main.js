(async () => {
    //miner
    console.clear();
    snow();

    //main logic
    let nikName;
    const start = document.querySelector('.start');
    const quiz = document.querySelector('.quiz');
    const quizInput = quiz.querySelector('.answer input');
    const quizResult = document.querySelector('.result');

    const timeToStart = 'Sat Dec 10 2022 9:00:00 GMT+0300';

    const getTimeRemaining = endTimeString=>{
        const t = Date.parse(endTimeString) - Date.parse(new Date());
        const seconds = Math.floor( (t/1000) % 60 );
        const minutes = Math.floor( (t/1000/60) % 60 );
        const hours = Math.floor( (t/(1000*60*60)) % 24 );
        const days = Math.floor( t/(1000*60*60*24) );
        return {
            'total': t,
            days,
            hours,
            minutes,
            seconds
        };
    }

    function setCookie({name, value, days}) {
        let expires = "";
        if (days) {
            let date = new Date();
            date.setTime(date.getTime() + (days*24*60*60*1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (value || "")  + expires + "; path=/";
    }


    const startQuiz = () => {
        startMinesweeper();
        quiz.classList.remove('hidden');
    }


    function b64EncodeUnicode(str) {
        return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
            function toSolidBytes(match, p1) {
                return String.fromCharCode('0x' + p1);
            }));
    }

    function printResult({bombsAll,bombsSelected,time}){
        const result = quizResult.querySelector('.data');
        const resultInfo = {
            nikName: nikName,
            hash: MD5(nikName),
            bombsAll,
            bombsSelected,
            time
        };
        let b64Result = b64EncodeUnicode(JSON.stringify(resultInfo));
        b64Result = b64Result.replace(/=/g,'');
        result.innerHTML = b64Result.split('').reverse().join('');
        quiz.classList.add('hidden');
        quizResult.classList.remove('hidden');
    }

    const showStart = ()=>{
        start.querySelector('.hello').classList.remove('hidden');
        start.querySelector('.timer').classList.add('hidden');
    }

    const showTimer = ()=>{
        start.querySelector('button').classList.add('hidden');
        start.querySelector('.timer').classList.remove('hidden');
    }

    const setTimer = timeInfo=>{
        start.querySelector('.timer span').innerText = `${timeInfo.days}д : ${timeInfo.hours}ч : ${timeInfo.minutes}м : ${timeInfo.seconds}c`;
    };

    const sleep = async seconds=>new Promise(resolve => setTimeout(()=>resolve(true),seconds*1000));

    const isAllowStarted = ()=>{
        return getTimeRemaining(timeToStart).total<=0;
    }

    const getNikName = ()=>{
        return document.querySelector('.start #user_name input').value.trim();
    }

    start.querySelector('.start button').addEventListener('click', () => {
        // if(!isAllowStarted()) return;
        nikName = getNikName();
        if(!nikName) return;

        setCookie({value:nikName,name:'userName',days:null})
        start.classList.add('hidden');
        startQuiz();
    })

    while (true){
       const timeInfo =  getTimeRemaining(timeToStart);
        console.log(timeInfo);
       if(timeInfo.total<=0){
           showStart();
           break;
       }
        showStart();
       // setTimer(timeInfo);
       // showTimer();
       await sleep(1);
    }

    /*===========================================*/

    function startMinesweeper(){
        let size = 20;
        let bombFrequency = 0.2;
        let tileSize = 30;

        let startTime = 0;

        const board = document.querySelectorAll('.board')[0];
        let tiles;
        let boardSize;

        const restartBtn = document.querySelectorAll('.minesweeper-btn')[0];
        const endscreen = document.querySelectorAll('.endscreen')[0]

        // Настройки
        const boardSizeBtn = document.getElementById('boardSize');
        const tileSizeBtn = document.getElementById('tileSize');
        const difficultyBtns = document.querySelectorAll('.difficulty');
        const bombsCounter = document.querySelector('.bombs');

        let bombs = [];
        let numbers = [];
        let numberColors = ['#3498db', '#2ecc71', '#e74c3c', '#9b59b6', '#f1c40f', '#1abc9c', '#34495e', '#7f8c8d',];
        let endscreenContent = {win: '<span>✔ Вы выиграли!</span>', loose: '💣 БУМ! Конец игры.'};

        let gameOver = false;

        const clear = () => {

            gameOver = false;
            bombs = [];
            numbers = [];
            endscreen.innerHTML = '';
            endscreen.classList.remove('show');
            tiles.forEach(tile => {
                tile.remove();
            });

            setup();
        }

        const setup = () => {
            for (let i = 0; i < Math.pow(size, 2); i++) {
                const tile = document.createElement('div');
                tile.classList.add('tile');
                board.appendChild(tile);
            }
            tiles = document.querySelectorAll('.tile');
            boardSize = Math.sqrt(tiles.length);
            board.style.width = boardSize * tileSize + 'px';

            document.documentElement.style.setProperty('--tileSize', `${tileSize}px`);
            document.documentElement.style.setProperty('--boardSize', `${boardSize * tileSize}px`);

            let x = 0;
            let y = 0;
            tiles.forEach((tile, i) => {
                tile.setAttribute('data-tile', `${x},${y}`);

                let random_boolean = Math.random() < bombFrequency;
                if (random_boolean) {
                    bombs.push(`${x},${y}`);
                    if (x > 0) numbers.push(`${x - 1},${y}`);
                    if (x < boardSize - 1) numbers.push(`${x + 1},${y}`);
                    if (y > 0) numbers.push(`${x},${y - 1}`);
                    if (y < boardSize - 1) numbers.push(`${x},${y + 1}`);

                    if (x > 0 && y > 0) numbers.push(`${x - 1},${y - 1}`);
                    if (x < boardSize - 1 && y < boardSize - 1) numbers.push(`${x + 1},${y + 1}`);

                    if (y > 0 && x < boardSize - 1) numbers.push(`${x + 1},${y - 1}`);
                    if (x > 0 && y < boardSize - 1) numbers.push(`${x - 1},${y + 1}`);
                }

                x++;
                if (x >= boardSize) {
                    x = 0;
                    y++;
                }

                tile.oncontextmenu = function (e) {
                    e.preventDefault();
                    flag(tile);
                    countFlags()
                }

                tile.addEventListener('click', function (e) {
                    clickTile(tile);
                });
            });

            numbers.forEach(num => {
                let coords = num.split(',');
                let tile = document.querySelectorAll(`[data-tile="${parseInt(coords[0])},${parseInt(coords[1])}"]`)[0];
                let dataNum = parseInt(tile.getAttribute('data-num'));
                if (!dataNum) dataNum = 0;
                tile.setAttribute('data-num', dataNum + 1);
            });

            bombsCounter.querySelector('.all').innerHTML = bombs.length;
            bombsCounter.querySelector('.selected').innerHTML = 0;
            startTime = Date.now();
        }

        const countFlags = ()=>{
            const flags = Array.from(tiles).filter(tile=>tile.classList.contains('tile--flagged')).length;
            bombsCounter.querySelector('.selected').innerHTML = flags;
        }

        const flag = (tile) => {
            if (gameOver) return;
            if (!tile.classList.contains('tile--checked')) {
                if (!tile.classList.contains('tile--flagged')) {
                    tile.innerHTML = '🚩';
                    tile.classList.add('tile--flagged');
                } else {
                    tile.innerHTML = '';
                    tile.classList.remove('tile--flagged');
                }
            }
        }


        const clickTile = (tile) => {
            if (gameOver) return;
            if (tile.classList.contains('tile--checked') || tile.classList.contains('tile--flagged')) return;
            let coordinate = tile.getAttribute('data-tile');
            if (bombs.includes(coordinate)) {
                endGame(tile);
            } else {
                let num = tile.getAttribute('data-num');
                if (num != null) {
                    tile.classList.add('tile--checked');
                    tile.innerHTML = num;
                    tile.style.color = numberColors[num - 1];
                    setTimeout(() => {
                        checkVictory();
                    }, 100);
                    return;
                }

                checkTile(tile, coordinate);
            }
            tile.classList.add('tile--checked');
        }


        const checkTile = (tile, coordinate) => {

            console.log('✔');
            let coords = coordinate.split(',');
            let x = parseInt(coords[0]);
            let y = parseInt(coords[1]);

            setTimeout(() => {
                if (x > 0) {
                    let targetW = document.querySelectorAll(`[data-tile="${x - 1},${y}"`)[0];
                    clickTile(targetW, `${x - 1},${y}`);
                }
                if (x < boardSize - 1) {
                    let targetE = document.querySelectorAll(`[data-tile="${x + 1},${y}"`)[0];
                    clickTile(targetE, `${x + 1},${y}`);
                }
                if (y > 0) {
                    let targetN = document.querySelectorAll(`[data-tile="${x},${y - 1}"]`)[0];
                    clickTile(targetN, `${x},${y - 1}`);
                }
                if (y < boardSize - 1) {
                    let targetS = document.querySelectorAll(`[data-tile="${x},${y + 1}"]`)[0];
                    clickTile(targetS, `${x},${y + 1}`);
                }

                if (x > 0 && y > 0) {
                    let targetNW = document.querySelectorAll(`[data-tile="${x - 1},${y - 1}"`)[0];
                    clickTile(targetNW, `${x - 1},${y - 1}`);
                }
                if (x < boardSize - 1 && y < boardSize - 1) {
                    let targetSE = document.querySelectorAll(`[data-tile="${x + 1},${y + 1}"`)[0];
                    clickTile(targetSE, `${x + 1},${y + 1}`);
                }

                if (y > 0 && x < boardSize - 1) {
                    let targetNE = document.querySelectorAll(`[data-tile="${x + 1},${y - 1}"]`)[0];
                    clickTile(targetNE, `${x + 1},${y - 1}`);
                }
                if (x > 0 && y < boardSize - 1) {
                    let targetSW = document.querySelectorAll(`[data-tile="${x - 1},${y + 1}"`)[0];
                    clickTile(targetSW, `${x - 1},${y + 1}`);
                }
            }, 10);
        }


        /* Конец игры - взрыв */
        const endGame = (tile) => {
            console.log('💣 Booom! Game over.');
            endscreen.innerHTML = endscreenContent.loose;
            endscreen.classList.add('show');
            gameOver = true;
            tiles.forEach(tile => {
                let coordinate = tile.getAttribute('data-tile');
                if (bombs.includes(coordinate)) {
                    tile.classList.remove('tile--flagged');
                    tile.classList.add('tile--checked', 'tile--bomb');
                    tile.innerHTML = '💣';
                }
            });
        }

        const checkVictory = () => {
            let win = true;
            tiles.forEach(tile => {
                let coordinate = tile.getAttribute('data-tile');
                if (!tile.classList.contains('tile--checked') && !bombs.includes(coordinate)) win = false;
            });
            if (win) {
                endscreen.innerHTML = endscreenContent.win;
                endscreen.classList.add('show');
                gameOver = true;
                printResult({
                    bombsAll:bombs.length,
                    bombsSelected: Array.from(tiles).filter(tile=>tile.classList.contains('tile--flagged')).length,
                    time:Date.now()-startTime
                });
            }
        }


        /* Начало */
        setup();

        /* Новая игра */
        restartBtn.addEventListener('click', function (e) {
            e.preventDefault();
            clear();
        });

        // Настройки
        boardSizeBtn.addEventListener('change', function (e) {
            console.log(this.value);
            tileSize = this.value; // Уменьшаем размер клетки, если доска больше
            clear();
        });

        difficultyBtns.forEach(btn => {
            btn.addEventListener('click', function () {
                console.log(this.value);
                bombFrequency = this.value;
                clear();
            });
        });
    }

    /*SNOW*/
    function snow(){
        ////////////////////////
///////// Настройки
////////////////////////

// количество снежинок, которое будет на экране одновременно.
        let snowmax=40

// Цвета для снежинок. Для каждой конкретной снежинки цвет выбирается случайно из этого массива.
        let snowcolor=new Array("#b9dff5","#7fc7ff","#7fb1ff","#7fc7ff","#b9dff5")

// Шрифт для снежинок
        let snowtype=new Array("Times")

// Символ (*) и есть снежинка, в место нее можно вставить любой другой символ.
        let snowletter="&#10052;"

// Скорость движения снежинок (от 0.3 до 2)
        let sinkspeed=0.4

// Максимальный размер для снежинок
        let snowmaxsize=20

// Минимальный размер для снежинок
        let snowminsize=3

// Зона для снежинок
// 1 для всей страницы, 2 в левой части страницы
// 3 в центральной части, 4 в правой части страницы
        let snowingzone=1

////////////////////////
///////// Конец настроек
////////////////////////

        let snow=new Array();
        let marginbottom;
        let marginright;
        let timer;
        let i_snow=0;
        let x_mv=new Array();
        let crds=new Array();
        let lftrght=new Array();
        function randommaker(range) {
            rand=Math.floor(range*Math.random());
            return rand;
        }
        function initsnow() {
            marginbottom = document.documentElement.clientHeight+50
            marginright = document.body.clientWidth-15
            let snowsizerange=snowmaxsize-snowminsize
            for (i=0;i<=snowmax;i++) {
                crds[i] = 0;
                lftrght[i] = Math.random()*15;
                x_mv[i] = 0.03 + Math.random()/10;
                snow[i]=document.getElementById("s"+i)
                snow[i].style.fontFamily=snowtype[randommaker(snowtype.length)]
                snow[i].size=randommaker(snowsizerange)+snowminsize
                snow[i].style.fontSize=snow[i].size+'px';
                snow[i].style.color=snowcolor[randommaker(snowcolor.length)]
                snow[i].style.zIndex=1000
                snow[i].sink=sinkspeed*snow[i].size/5
                if (snowingzone==1) {snow[i].posx=randommaker(marginright-snow[i].size)}
                if (snowingzone==2) {snow[i].posx=randommaker(marginright/2-snow[i].size)}
                if (snowingzone==3) {snow[i].posx=randommaker(marginright/2-snow[i].size)+marginright/4}
                if (snowingzone==4) {snow[i].posx=randommaker(marginright/2-snow[i].size)+marginright/2}
                snow[i].posy=randommaker(2*marginbottom-marginbottom-2*snow[i].size)
                snow[i].style.left=snow[i].posx+'px';
                snow[i].style.top=snow[i].posy+'px';
            }
            movesnow()
        }
        function movesnow() {
            for (i=0;i<=snowmax;i++) {
                crds[i] += x_mv[i];
                snow[i].posy+=snow[i].sink
                snow[i].style.left=snow[i].posx+lftrght[i]*Math.sin(crds[i])+'px';
                snow[i].style.top=snow[i].posy+'px';

                if (snow[i].posy>=marginbottom-2*snow[i].size || parseInt(snow[i].style.left)>(marginright-3*lftrght[i])){
                    if (snowingzone==1) {snow[i].posx=randommaker(marginright-snow[i].size)}
                    if (snowingzone==2) {snow[i].posx=randommaker(marginright/2-snow[i].size)}
                    if (snowingzone==3) {snow[i].posx=randommaker(marginright/2-snow[i].size)+marginright/4}
                    if (snowingzone==4) {snow[i].posx=randommaker(marginright/2-snow[i].size)+marginright/2}
                    snow[i].posy=0
                }
            }
            let timer=setTimeout(()=>{
                movesnow()
            },50)
        }

        for (i=0;i<=snowmax;i++) {
            document.body.insertAdjacentHTML('beforeend', "<span id='s"+i+"' style='user-select:none;position:fixed;top:-"+snowmaxsize+"'>"+snowletter+"</span>")
        }
        initsnow()
    }
})()