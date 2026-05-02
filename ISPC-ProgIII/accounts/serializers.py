from rest_framework import serializers
from django.contrib.auth.models import User
from .models import UserProfile, CartItem

# =========================
# 👤 USER (CON FOTO GOOGLE)
# =========================

class UserSerializer(serializers.ModelSerializer):
    photo = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'photo']

    def get_photo(self, obj):
        # 🔥 si viene de Google
        if hasattr(obj, 'social_auth') and obj.social_auth.exists():
            return obj.social_auth.first().extra_data.get('picture')
        return None


# =========================
# 🔐 REGISTER
# =========================

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password']

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user


# =========================
# 👤 PROFILE (opcional)
# =========================

class UserProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = UserProfile
        fields = ['user', 'encrypted_info']


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