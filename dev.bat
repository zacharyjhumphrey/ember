set parent-dir=%CD%
cd %parent-dir%\client
start npm run start
cd %parent-dir%\api
start npm run start
exit