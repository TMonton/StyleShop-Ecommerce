from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from .models import CartItem
from .serializers import CartItemSerializer

# ==========================================
# 🔄 FUNCIÓN AUXILIAR (RETORNA EL CARRITO)
# ==========================================
def obtener_carrito_response(user):
    items = CartItem.objects.filter(user=user).order_by('id')
    serializer = CartItemSerializer(items, many=True)
    total = sum(item.subtotal() for item in items)
    return Response({
        "items": serializer.data,
        "total": total
    })

# =========================
# 🛒 CARRITO PRINCIPAL
# =========================
class CartView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return obtener_carrito_response(request.user)

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

        return obtener_carrito_response(request.user)


# =========================
# ➕ SUMAR
# =========================
class CartItemSumarView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, id):
        try:
            item = CartItem.objects.get(id=id, user=request.user)
            item.cantidad += 1
            item.save()
            return obtener_carrito_response(request.user)
        except CartItem.DoesNotExist:
            return Response({"error": "No encontrado"}, status=404)


# =========================
# ➖ RESTAR
# =========================
class CartItemRestarView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, id):
        try:
            item = CartItem.objects.get(id=id, user=request.user)

            if item.cantidad > 1:
                item.cantidad -= 1
                item.save()
            else:
                item.delete()

            return obtener_carrito_response(request.user)
        except CartItem.DoesNotExist:
            return Response({"error": "No encontrado"}, status=404)


# =========================
# 🗑️ VACIAR
# =========================
class CartVaciarView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request):
        CartItem.objects.filter(user=request.user).delete()
        return Response({"items": [], "total": 0})