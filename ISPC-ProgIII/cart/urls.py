from django.urls import path
from .views import CartView, CartItemRestarView, CartItemSumarView, CartVaciarView

urlpatterns = [
    path('', CartView.as_view()),
    
    path('<int:id>/sumar/', CartItemSumarView.as_view()),
    path('<int:id>/restar/', CartItemRestarView.as_view()),
    path('vaciar/', CartVaciarView.as_view()),
]