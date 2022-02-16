'use strict';
console.log('Script loaded')

const startGame = userName=>{
    const nikTitle = document.querySelector('#nikTitle');
    nikTitle.innerHTML =userName;

    const registerBlock = document.querySelector('#nik');
    const gameBlock = document.querySelector('#game');

    const frame = gameBlock.querySelector('iframe');
    frame.style = 'width:100%;height:500px';
    frame.src = 'https://www.jigsawplanet.com/?rc=play&pid=1831fafad66a&view=iframe&bgcolor=0x808080&rotation=1&savegame=1';

    registerBlock.classList.add('hidden');
    gameBlock.classList.remove('hidden');
}

const getUserName = ()=>{
    return localStorage.asteriaNik;
}
const setUserName = nikName=>{
    return localStorage.asteriaNik = nikName;
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
    setUserName(nikName)
    startGame(nikName);
}

const start = ()=>{
    const userName = getUserName();
    if(userName) {
        startGame(userName);
    }else{
        const btnStart = document.querySelector('#startGame')
        btnStart.addEventListener('click',validNik)
    }

}


document.addEventListener('DOMContentLoaded',()=>{
    console.log(`Document Loaded`);
    start();
})