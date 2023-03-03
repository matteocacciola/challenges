#!/bin/bash

echo 'Locally installing the Composer'
php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');"
php composer-setup.php
php -r "unlink('composer-setup.php');"

echo 'Installing vendors'
php composer.phar install

echo 'Setting permissions on public folder'
sudo chmod g+w,o+w ./public

php -r "unlink('composer.phar');"
