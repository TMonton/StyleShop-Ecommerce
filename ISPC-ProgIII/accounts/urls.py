from django.urls import path
from .views import DeleteUserView, GoogleLoginView, RegisterView, LoginView, LogoutView, RequestOTPView, VerifyOTPView, ResetPasswordView, VerifyAccountView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('delete-account/', DeleteUserView.as_view()),
    path('login/', LoginView.as_view(), name='login'),
    
    # Endpoints de recuperación
    path('request-otp/', RequestOTPView.as_view(), name='request-otp'),
    path('verify-otp/', VerifyOTPView.as_view(), name='verify-otp'),
    path('reset-password/', ResetPasswordView.as_view(), name='reset-password'),
    path('verify-account/', VerifyAccountView.as_view(), name='verify-account'),
    path('logout/', LogoutView.as_view()),

    
    # 🔥 GOOGLE AUTH
    path('google-login/', GoogleLoginView.as_view()),
    
]