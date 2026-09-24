@echo off
title Deploy Checklist PO Jersey ke Vercel
echo ========================================================
echo   DEPLOY SISTEM CHECKLIST PO JERSEY KE VERCEL
echo ========================================================
echo.
echo Sedang menyiapkan deployment ke Vercel...
echo Jika diminta login, pilih Continue with GitHub / Email.
echo.
call npx vercel --prod
echo.
echo ========================================================
echo   Deployment selesai! Link website Anda tertera di atas.
echo ========================================================
pause
