from django.urls import path
from .views import CartView

urlpatterns = [
    #Endpoints de carrito
    path('', CartView.as_view()),
    
]