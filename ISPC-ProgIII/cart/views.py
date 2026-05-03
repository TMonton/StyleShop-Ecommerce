from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import CartItem
from .serializers import CartItemSerializer

# =========================
# 🛒 CARRITO
# =========================

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
            return Response({"error": "No encontrado"}, status=404)

    def delete(self, request):
        CartItem.objects.filter(user=request.user).delete()
        return Response({"message": "Carrito vaciado"})
    