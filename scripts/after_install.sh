#!/bin/bash
{
cd /home/ec2-user/server
npm config set legacy-peer-deps true
npm i
npm install
npm install --save react react-dom react-scripts react-particles-js
npm install pm2 -g
} > /tmp/after_install_log.log