from django.urls import path
from .views import GoogleLoginView,RegisterView, LoginView, RequestOTPView, VerifyOTPView, ResetPasswordView, VerifyAccountView, CartView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    
    # Endpoints de recuperación
    path('request-otp/', RequestOTPView.as_view(), name='request-otp'),
    path('verify-otp/', VerifyOTPView.as_view(), name='verify-otp'),
    path('reset-password/', ResetPasswordView.as_view(), name='reset-password'),
    path('verify-account/', VerifyAccountView.as_view(), name='verify-account'),
    
    #Endpoints de carrito
    path('cart/', CartView.as_view(), name='cart'),
    
    # 🔥 GOOGLE AUTH
   path('google-login/', GoogleLoginView.as_view()),
    
]