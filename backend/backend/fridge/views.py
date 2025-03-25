from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth.models import User
from rest_framework.permissions import AllowAny
from rest_framework.permissions import IsAuthenticated
from rest_framework import viewsets
from .models import Ingredient
from .serializers import IngredientSerializer
from rest_framework.authentication import TokenAuthentication
from rest_framework import viewsets, permissions

class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")

        user = authenticate(username=username, password=password)
        if user:
            token, created = Token.objects.get_or_create(user=user)
            return Response({"token": token.key, "message": "Login successful"})
        return Response({"error": "Invalid credentials"}, status=400)
    

class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get("username")
        first_name = request.data.get("first_name")
        password = request.data.get("password")
        allergies = request.data.get("allergies", [])
        spiciness = request.data.get("spiciness")
        meat_consumption = request.data.get("meat_consumption")
        fish_consumption = request.data.get("fish_consumption")
        vegetable_consumption = request.data.get("vegetable_consumption")

        if not username or not password:
            return Response({"error": "Username and password are required"}, status=400)

        if User.objects.filter(username=username).exists():
            return Response({"error": "Username already taken"}, status=400)

        user = User.objects.create_user(username=username, first_name=first_name, password=password)

        user.profile.allergies = allergies
        user.profile.spiciness = spiciness
        user.profile.meat_consumption = meat_consumption
        user.profile.fish_consumption = fish_consumption
        user.profile.vegetable_consumption = vegetable_consumption
        user.profile.save()

        token = Token.objects.create(user=user)

        return Response({"message": "User registered successfully", "token": token.key})
class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            request.user.auth_token.delete()  # Deletes the user's token
            return Response({"message": "Logged out successfully"})
        except Exception:
            return Response({"error": "Logout failed"}, status=400)


class IngredientViewSet(viewsets.ModelViewSet):
    serializer_class = IngredientSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Ingredient.objects.filter(user=self.request.user)  # Only fetch user's ingredients

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)