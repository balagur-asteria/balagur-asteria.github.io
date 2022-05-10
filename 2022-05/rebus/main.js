(async () => {
    const start = document.querySelector('.start');
    const quiz = document.querySelector('.quiz');
    const quizInput = quiz.querySelector('.answer input');
    const quizResult = document.querySelector('.result');

    const quizData = [
        {
            title: 'Разгадай ребус',
            hash: ['c82609f7d44f77f4f85b7ca66e749346']
        },
        {
            title: 'Разгадай ребус',
            hash: ['491efa07306cc8f7fccad20877cc5cc3']
        },
        {
            title: 'Разгадай ребус',
            hash: ['829595c37442a945ce101ac9cc3b1d5a']
        },
        {
            title: 'Разгадай ребус',
            hash: ['5a922eef70cfea05cfce94cfab52f750']
        },
        {
            title: 'Разгадай ребус',
            hash: [
                'ef9af8192670fd561f692c89c0ced7b4',
                'f91cd01cc73d1e780513a9878fe4e5db',
            ]
        },
        {
            title: 'Разгадай ребус',
            hash: ['558cbc0a43bd5759bac3785e7271c9cc']
        },
        {
            title: 'Разгадай ребус',
            hash: [
                'd3d9c21978b4cd6086a33cc79747da9c',
            ]
        },
        {
            title: 'Разгадай ребус',
            hash: [
                '3716035825276d9ffcefb1045febce7a',
                '2879febba0269d45f074db9a00cf05ff',
            ]
        },
        {
            title: 'Разгадай ребус',
            hash: [
                '62ced77eb87267c61fa0f9bde73b4c52',
            ]
        },
        {
            title: 'Разгадай ребус',
            hash: [
                '1708244516df4c4a9c3d2584a562d683',
            ]
        },
        {
            title: 'Разгадай ребус',
            hash: [
                '1ca6e6a0c45d4879973470a1c2956d60',
            ]
        },
        {
            title: 'Разгадай ребус',
            hash: [
                '5c3d191fed1b3e14f27dd0f3739d82a8',
            ]
        },
        {
            title: 'Разгадай ребус',
            hash: [
                '626d32f809f8f67827475aee02d8b254',
            ]
        },
        {
            title: 'Разгадай ребус',
            hash: [
                '7b1e472978ca90cb579a9b4e4c031abe',
            ]
        },
        {
            title: 'Разгадай ребус',
            hash: [
                '33fa738c5fcdda8d7ba819d260769506',
            ]
        },
        {
            title: 'Разгадай ребус',
            hash: [
                'b2a25130bfd66ccba1c367a5fd6bad1f',
            ]
        },
        {
            title: 'Разгадай ребус',
            hash: [
                'be2ed03ac9f701a7e74e1030d7a4e231',
            ]
        },
        {
            title: 'Разгадай ребус',
            hash: [
                '632448c24553426a338839a5800c02f9',
            ]
        },
        {
            title: 'Разгадай ребус',
            hash: [
                '00e4a3fadbabb3d12098edfc99b44dc2',
            ]
        },
        {
            title: 'Разгадай ребус',
            hash: [
                '5b88cc77972c21ef175ab5bcdb933d58',
            ]
        },
    ]

    const timeToStart = 'Wed May 11 2022 16:00:00 GMT+0300';

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

    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    }

    const renderQuiz = i => {
        if (!i) i = 0;
        quiz.querySelector('.title').innerHTML = quizData[i].title;
        quiz.querySelector('.task img').setAttribute('src', `./img/${i+1}.png`);
        quiz.querySelector('#counter #current').innerHTML=i+1;
        quiz.querySelector('#counter #max').innerHTML= quizData.length;
        const input = quiz.querySelector('.answer input');
        input.value = '';
        input.setAttribute('data-answer', i);
        input.classList.remove('error');
    }

    const startQuiz = () => {
        renderQuiz(0);
        quiz.classList.remove('hidden');
    }

    const checkAnswer = () => {
        const text = quizInput.value.trim().toLowerCase();
        const i = quizInput.getAttribute('data-answer');
        return quizData[i].hash.includes(MD5(text));
    }

    function b64EncodeUnicode(str) {
        return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
            function toSolidBytes(match, p1) {
                return String.fromCharCode('0x' + p1);
            }));
    }

    const printResult = () => {
        const result = quizResult.querySelector('.data');
        const nikName = getCookie('userName');
        const resultInfo = {
            nikName: nikName,
            hash: MD5(nikName)
        };
        result.innerHTML = b64EncodeUnicode(JSON.stringify(resultInfo));
        quiz.classList.add('hidden');
        quizResult.classList.remove('hidden');
    }

    const showButtonStart = ()=>{
        start.querySelector('button').classList.remove('hidden');
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
        if(!isAllowStarted()) return;
        const nikName = getNikName();
        if(!nikName) return;

        setCookie({value:nikName,name:'userName',days:null})
        start.classList.add('hidden');
        startQuiz();
    })

    quiz.querySelector('.answer button').addEventListener('click', () => {
        const result = checkAnswer();
        if (!result) {
            quizInput.classList.add('error')
            return;
        }
        let i = quizInput.getAttribute('data-answer');
        if (quizData[++i])
            renderQuiz(i);
        else printResult()
    })

    while (true){
       const timeInfo =  getTimeRemaining(timeToStart);
        console.log(timeInfo);
       if(timeInfo.total<=0){
           showButtonStart();
           break;
       }
       setTimer(timeInfo);
       showTimer();
       await sleep(1);
    }
})()