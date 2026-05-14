import os
import requests  # 🔥 FALTABA ESTO
from datetime import timedelta

from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.utils import timezone

from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated

from rest_framework_simplejwt.tokens import RefreshToken


from .models import OTP
from .serializers import RegisterSerializer, UserSerializer

# =========================
# 🔐 AUTH
# =========================

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer

    def perform_create(self, serializer):
        user = serializer.save()
        user.is_active = False
        user.save()

        otp_obj = OTP.objects.create(user=user)
        code = otp_obj.generate_code()

        print(f"\n{'='*30}")
        print(f"NUEVO REGISTRO: {user.username}")
        print(f"CÓDIGO DE VERIFICACIÓN: {code}")
        print(f"{'='*30}\n")


class VerifyAccountView(APIView):
    permission_classes = (AllowAny,)

    def post(self, request):
        email = request.data.get('email')
        code = request.data.get('otp')

        try:
            otp_record = OTP.objects.get(user__email=email, code=code)

            user = otp_record.user
            user.is_active = True
            user.save()

            otp_record.delete()

            return Response({"message": "Cuenta activada correctamente"})
        except OTP.DoesNotExist:
            return Response({"error": "Código inválido"}, status=400)


class LoginView(APIView):
    permission_classes = (AllowAny,)

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        user = authenticate(username=username, password=password)

        if user:
            refresh = RefreshToken.for_user(user)

            return Response({
                'access': str(refresh.access_token),
                'refresh': str(refresh),
                'user': UserSerializer(user).data
            })

        return Response({'error': 'Credenciales inválidas'}, status=401)


# =========================
# 🔥 GOOGLE LOGIN (AGREGADO)
# =========================

class GoogleLoginView(APIView):
    permission_classes = (AllowAny,)

    def post(self, request):
        code = request.data.get('code')

        if not code:
            return Response({"error": "No code"}, status=400)

        token_url = "https://oauth2.googleapis.com/token"

        data = {
            "code": code,
            "client_id": os.getenv("GOOGLE_CLIENT_ID"),
            "client_secret": os.getenv("GOOGLE_CLIENT_SECRET"),
            "redirect_uri": "http://localhost:4200/login",  # ⚠️ IMPORTANTE
            "grant_type": "authorization_code",
        }

        token_res = requests.post(token_url, data=data).json()
        access_token = token_res.get("access_token")

        if not access_token:
            return Response({"error": token_res}, status=400)

        user_info = requests.get(
            "https://www.googleapis.com/oauth2/v2/userinfo",
            headers={"Authorization": f"Bearer {access_token}"}
        ).json()

        email = user_info.get("email")

        if not email:
            return Response({"error": "No email"}, status=400)

        user, _ = User.objects.get_or_create(
            username=email,
            defaults={"email": email}
        )

        refresh = RefreshToken.for_user(user)

        return Response({
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "user": UserSerializer(user).data
        })


# =========================
# 🔐 RECUPERACIÓN PASSWORD
# =========================

class RequestOTPView(APIView):
    permission_classes = (AllowAny,)

    def post(self, request):
        email = request.data.get('email')

        try:
            user = User.objects.get(email=email)
            OTP.objects.filter(user=user).delete()

            otp_obj = OTP.objects.create(user=user)
            code = otp_obj.generate_code()

            print(f"OTP: {code}")

            return Response({"message": "OTP generado"})
        except User.DoesNotExist:
            return Response({"error": "Usuario no existe"}, status=404)


class VerifyOTPView(APIView):
    permission_classes = (AllowAny,)

    def post(self, request):
        email = request.data.get('email')
        code = request.data.get('otp')

        try:
            otp = OTP.objects.get(user__email=email, code=code)

            if otp.created_at < timezone.now() - timedelta(minutes=10):
                return Response({"error": "OTP expirado"}, status=400)

            otp.is_verified = True
            otp.save()

            return Response({"message": "OTP válido"})
        except OTP.DoesNotExist:
            return Response({"error": "OTP incorrecto"}, status=400)


class ResetPasswordView(APIView):
    permission_classes = (AllowAny,)

    def post(self, request):
        email = request.data.get('email')
        new_password = request.data.get('new_password')

        try:
            otp = OTP.objects.get(user__email=email, is_verified=True)

            user = otp.user
            user.set_password(new_password)
            user.save()

            otp.delete()

            return Response({"message": "Password actualizado"})
        except OTP.DoesNotExist:
            return Response({"error": "No autorizado"}, status=403)


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data["refresh"]
            token = RefreshToken(refresh_token)
            token.blacklist()  # 🔥 lo invalida
            return Response({"message": "Logout exitoso"})
        except Exception:
            return Response({"error": "Token inválido"}, status=400)