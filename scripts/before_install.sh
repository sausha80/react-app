#!/bin/bash
cd /home/ec2-user/server
echo 'installing node'
curl -sL https://rpm.nodesource.com/setup_16.x | sudo -E bash -
yum -y install nodejs npm
echo 'done installing node npm'