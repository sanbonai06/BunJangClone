const { response } = require('express');
const express = require('./config/express');
const {logger} = require('./config/winston');
const port = 3000;

express().use((req, res, next) => {
    if(disableKeepAlive) {
        response.set('Connection', 'close');

    }
    next();
})

let server = express().listen(port, () => {
                console.log('서버 시작');
                process.send('ready');
            });

process.on('uncaughtException', (err) => {
    console.log('예기치 못한 오류 발생');
    console.log(err);

    process.exit(1);
});

process.on('SIGINT', async () =>{
    disableKeepAlive = true;
    server.close();
    process.exit(0);
});

logger.info(`${process.env.NODE_ENV} - API Server Start At Port ${port}`);