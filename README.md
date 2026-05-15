🛍️ StyleShop — E-commerce Full Stack
📌 Descripción
StyleShop es una aplicación web de e-commerce desarrollada con arquitectura Full Stack, que permite a los usuarios navegar productos, gestionar un carrito de compras y realizar procesos de autenticación seguros.

#El proyecto integra:

🔐 Autenticación con JWT (access + refresh)

🔑 Login tradicional + Google OAuth

🛒 Gestión de carrito

💳 Flujo de checkout (en progreso)

📧 Sistema de OTP para verificación y recuperación de cuenta

🧱 Tecnologías utilizadas
Frontend
Angular

TypeScript

RxJS

Bootstrap / CSS

Backend
Django
cd ISPC-ProgIII
Django REST Framework

SimpleJWT (autenticación)

SQLite (por ahora)

🔐 Autenticación
El sistema implementa un esquema moderno basado en tokens:

Access Token → usado para acceder a endpoints protegidos

Refresh Token → permite renovar la sesión sin relogin

Blacklist → invalida tokens al hacer logout

También incluye:

Verificación de cuenta por OTP

Recuperación de contraseña

Login con Google

📦 Funcionalidades actuales
✔ Registro de usuarios
✔ Login (JWT)
✔ Login con Google
✔ Logout con invalidación de tokens
✔ Protección de rutas (Auth Guard)
✔ Interceptor HTTP para auth
✔ Carrito de compras (básico)

🚧 En desarrollo
Checkout completo

Integración con pasarela de pago (ARCA)

Gestión de órdenes

Panel de administración

▶️ Cómo ejecutar el proyecto

Backend
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python manage.py runserver

Frontend
cd ISPC-ProgIII-Front/login-frontend
npm install
ng serve

🔍 Estructura del proyecto
backend/
  accounts/
  cart/
  core/

frontend/
  app/
    paginas/
    services/
    guards/
    interceptors/
    
👥 Equipo
Proyecto desarrollado como parte de la formación en desarrollo Full Stack.

📄 Estado del proyecto
🟡 En desarrollo activo




Capturas de pantalla:

<img width="1919" height="901" alt="Captura de pantalla 2026-04-20 202340" src="https://github.com/user-attachments/assets/b7fdf7c4-849f-43ff-8e30-2964c28005ed" />
<img width="1919" height="904" alt="Captura de pantalla 2026-04-20 202320" src="https://github.com/user-attachments/assets/1e1f872f-30bd-49ef-9a23-b00cd8b99cdb" />
<img width="1903" height="897" alt="Captura de pantalla 2026-04-20 202307" src="https://github.com/user-attachments/assets/ea46612e-535a-4775-a19c-46e3890c2190" />

