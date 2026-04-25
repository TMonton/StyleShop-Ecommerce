from django.shortcuts import render
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import RegisterSerializer, UserSerializer
from django.utils import timezone
from datetime import timedelta
from .models import OTP
from .models import CartItem
from .serializers import CartItemSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
# Create your views here.

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer

    def perform_create(self, serializer):
        # 1. Guardamos el usuario pero como INACTIVO
        user = serializer.save()
        user.is_active = False 
        user.save()

        # 2. Generamos el OTP de bienvenida
        otp_obj = OTP.objects.create(user=user)
        code = otp_obj.generate_code()
        
        # 3. Lo mostramos en consola para el TP
        print(f"\n{"="*30}")
        print(f"NUEVO REGISTRO: {user.username}")
        print(f"CÓDIGO DE VERIFICACIÓN: {code}")
        print(f"{"="*30}\n")
        
class VerifyAccountView(APIView):
    permission_classes = (AllowAny,)

    def post(self, request):
        email = request.data.get('email')
        code = request.data.get('otp')
        
        try:
            # Buscamos el código que coincida con el email
            otp_record = OTP.objects.get(user__email=email, code=code)
            
            # ACTIVACIÓN: Cambiamos el estado del usuario a True
            user = otp_record.user
            user.is_active = True
            user.save()
            
            # Borramos el código para que no se use de nuevo
            otp_record.delete()
            
            return Response({
                "message": "Cuenta activada con éxito. Ya podés iniciar sesión."
            }, status=status.HTTP_200_OK)
            
        except OTP.DoesNotExist:
            return Response({
                "error": "Código de verificación inválido o expirado."
            }, status=status.HTTP_400_BAD_REQUEST)

class UserListView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]
    
class LoginView(APIView):
    permission_classes = (AllowAny,)

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(username=username, password=password)
        if user:
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'user': UserSerializer(user).data
            })
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
    
# --- Vistas de Recuperación de Contraseña ---

class RequestOTPView(APIView):
    permission_classes = (AllowAny,)

    def post(self, request):
        email = request.data.get('email')
        try:
            user = User.objects.get(email=email)
            # Borramos OTPs viejos del usuario para no acumular basura
            OTP.objects.filter(user=user).delete()
            
            otp_obj = OTP.objects.create(user=user)
            code = otp_obj.generate_code()
            
            print(f"--- DEBUG OTP ---")
            print(f"Usuario: {user.username} | Email: {email}")
            print(f"Código Generado: {code}")
            print(f"------------------")
            
            return Response({"message": "OTP generado con éxito. Revisá la consola."}, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({"error": "No existe un usuario con ese email."}, status=status.HTTP_404_NOT_FOUND)

class VerifyOTPView(APIView):
    permission_classes = (AllowAny,)

    def post(self, request):
        email = request.data.get('email')
        code = request.data.get('otp')
        
        try:
            otp_record = OTP.objects.get(user__email=email, code=code)
            
            # Opcional: Validar que el OTP no tenga más de 10 minutos
            if otp_record.created_at < timezone.now() - timedelta(minutes=10):
                return Response({"error": "El código ha expirado."}, status=status.HTTP_400_BAD_REQUEST)
            
            otp_record.is_verified = True
            otp_record.save()
            
            return Response({"message": "Código verificado. Ya podés cambiar tu contraseña."}, status=status.HTTP_200_OK)
        except OTP.DoesNotExist:
            return Response({"error": "Código o email incorrectos."}, status=status.HTTP_400_BAD_REQUEST)

class ResetPasswordView(APIView):
    permission_classes = (AllowAny,)

    def post(self, request):
        email = request.data.get('email')
        new_password = request.data.get('new_password')
        
        try:
            # Aquí está la validación: chequeamos que el OTP esté verificado
            otp_record = OTP.objects.get(user__email=email, is_verified=True)
            
            user = otp_record.user
            user.set_password(new_password)
            user.save()
            
            # Una vez usada, borramos la sesión de recuperación
            otp_record.delete()
            
            return Response({"message": "Contraseña actualizada correctamente."}, status=status.HTTP_200_OK)
        except OTP.DoesNotExist:
            return Response({"error": "Acceso no autorizado. Primero verificá el OTP."}, status=status.HTTP_403_FORBIDDEN)
class CartView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        items = CartItem.objects.filter(user=request.user)
        serializer = CartItemSerializer(items, many=True)

        total = sum(item.subtotal() for item in items)

        return Response({
            "items": serializer.data,
            "total": total
        })

    def post(self, request):
        nombre = request.data.get('nombre')
        precio = request.data.get('precio')

        item, created = CartItem.objects.get_or_create(
            user=request.user,
            nombre=nombre,
            defaults={'precio': precio, 'cantidad': 1}
        )

        if not created:
            item.cantidad += 1
            item.save()

        return Response({"message": "Producto agregado"})

    def patch(self, request):
        item_id = request.data.get('id')

        try:
            item = CartItem.objects.get(id=item_id, user=request.user)

            if item.cantidad > 1:
                item.cantidad -= 1
                item.save()
            else:
                item.delete()

            return Response({"message": "Producto actualizado"})
        except CartItem.DoesNotExist:
            return Response({"error": "Producto no encontrado"}, status=404)

    # 🔥 VACIAR CARRITO
    def delete(self, request):
        CartItem.objects.filter(user=request.user).delete()
        return Response({"message": "Carrito vaciado correctamente"})