cd /d %~dp0
git add .
git commit -m "Auto update" || exit /b
git push