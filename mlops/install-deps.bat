@echo off
echo Activating virtual environment...
call venv\Scripts\activate.bat
if %errorlevel% neq 0 (
    echo Failed to activate venv, creating new one...
    python -m venv venv
    call venv\Scripts\activate.bat
)
echo Installing Python dependencies...
pip install --upgrade pip
pip install -r requirements.txt
echo Python deps installed successfully!
deactivate
pause
