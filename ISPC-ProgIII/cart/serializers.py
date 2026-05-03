from rest_framework import serializers
from .models import CartItem

# =========================
# 🛒 CART
# =========================

class CartItemSerializer(serializers.ModelSerializer):
    subtotal = serializers.SerializerMethodField()

    class Meta:
        model = CartItem
        fields = ['id', 'nombre', 'precio', 'cantidad', 'subtotal']

    def get_subtotal(self, obj):
        return obj.subtotal()