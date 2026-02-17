@echo off
chcp 65001 >nul
echo.
echo ========================================
echo   ENVIANDO ATUALIZAÇÕES PARA O GITHUB
echo ========================================
echo.

cd /d "%~dp0.."

echo 1. Adicionando arquivos...
git add .
if errorlevel 1 (
    echo.
    echo ERRO: Git nao encontrado ou pasta nao e um repositorio.
    echo Instale o Git em: https://git-scm.com/download/win
    echo Ou use "Upload files" no site do GitHub.
    pause
    exit /b 1
)

echo 2. Salvando alteracoes (commit)...
git commit -m "Atualizacao do app"
if errorlevel 1 (
    echo Nenhuma alteracao nova para enviar - tudo ja estava salvo.
) else (
    echo 3. Enviando para o GitHub (push)...
    git push origin main
    if errorlevel 1 (
        echo.
        echo ERRO ao enviar. Pode ser que precise fazer login no Git.
        echo Rode no terminal: git push origin main
        echo E use seu usuario e senha/token do GitHub.
    ) else (
        echo.
        echo ========================================
        echo   PRONTO! A Vercel vai fazer o deploy.
        echo   Aguarde 1-2 minutos e abra o app de novo.
        echo ========================================
    )
)

echo.
pause
