'use strict';
console.log('Script loaded')
const timeToStart = 'Thu Jun 21 2023 15:00:00 GMT+0300';


const startGame = userName=>{
    const nikTitle = document.querySelector('#nikTitle');
    nikTitle.innerHTML =userName;

    const registerBlock = document.querySelector('#nik');
    const gameBlock = document.querySelector('#game');

    const frame = gameBlock.querySelector('iframe');
    frame.style = 'width:100%;height:500px';
    frame.src = 'https://www.jigsawplanet.com/?rc=play&pid=3e2979c855a1&view=iframe&bgcolor=0x808080&rotation=1&savegame=1';

    registerBlock.classList.add('hidden');
    gameBlock.classList.remove('hidden');
}

const getUserName = ()=>{
    return localStorage.asteriaNik;
}
const clearUserName = ()=>{
    localStorage.asteriaNik = '';
}
const checkFirstLoaded = ()=>{
    return !localStorage.firstLoad;
}
const setUserName = nikName=>{
    return localStorage.asteriaNik = nikName;
}

const setFirstLoad = ()=>{
    return localStorage.firstLoad = 1;
}

const toggleErrorNik = ({nikInput,isError})=>{
    if(isError) nikInput.classList.add('error')
    else nikInput.classList.remove('error')
}

const validNik = ()=>{
    const nikInput = document.querySelector('#nikName');
    const nikName = nikInput.value.trim();
    console.log(`NikName:`,nikName)
    if(!nikName){
        toggleErrorNik({nikInput,isError:1});
        return;
    }
    setUserName(nikName);
    setFirstLoad();
    startGame(nikName);
}

const start = ()=>{
    const isFirstLoad = checkFirstLoaded();
    console.log(`isFirstLoad:`,isFirstLoad)
    if(isFirstLoad) clearUserName()
    const userName = getUserName();
    console.log(`userName:`,userName)
    if(userName) {
        startGame(userName);
    }else{
        const btnStart = document.querySelector('#startGame')
        btnStart.addEventListener('click',validNik)
    }

}

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

const sleep = async seconds=>new Promise(resolve => setTimeout(()=>resolve(true),seconds*1000));

const showButtonStart = ()=>{
    document.querySelector('.timer').classList.add('hidden');
}

const setTimer = timeInfo=>{
    document.querySelector('.timer span').innerText = `${timeInfo.days}д : ${timeInfo.hours}ч : ${timeInfo.minutes}м : ${timeInfo.seconds}c`;
};

const showTimer = ()=>{
    document.querySelector('.timer').classList.remove('hidden');
}

document.addEventListener('DOMContentLoaded',async ()=>{
    console.log(`Document Loaded`);
    while (true){
        const timeInfo =  getTimeRemaining(timeToStart);
        console.log(timeInfo);
        if(timeInfo.total<=0){
            showButtonStart();
            start();
            break;
        }
        setTimer(timeInfo);
        showTimer();
        console.log('Sleep')
        await sleep(1);
    }

})