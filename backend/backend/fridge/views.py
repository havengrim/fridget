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
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from transformers import pipeline
from dotenv import load_dotenv
import os
import logging
from transformers import GPT2LMHeadModel, GPT2Tokenizer
from transformers import AutoModelForCausalLM, AutoTokenizer
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

class DeleteIngredientByCategoryIndex(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        category = request.data.get("category")
        index = request.data.get("index")

        if category is None or index is None:
            return Response({"error": "Category and index are required."}, status=status.HTTP_400_BAD_REQUEST)

        # Filter ingredients by category and user
        ingredients = Ingredient.objects.filter(user=request.user, category=category).order_by("id")

        # Get ingredient by index
        try:
            ingredient_to_delete = ingredients[index]
        except IndexError:
            return Response({"error": "Ingredient not found at the given index."}, status=status.HTTP_404_NOT_FOUND)

        ingredient_to_delete.delete()
        return Response({"message": "Ingredient deleted successfully"}, status=status.HTTP_200_OK)
    




logger = logging.getLogger(__name__)


class AIRecipeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        logger.debug(f"Authorization Header: {request.headers.get('Authorization')}")

        # Get the user's ingredients
        user_ingredients = request.user.ingredients.values_list('name', flat=True)
        prompt = f"Suggest 4 dishes based on these ingredients: {', '.join(user_ingredients)}."

        try:
            # Use GPT2 model and tokenizer directly
            tokenizer = GPT2Tokenizer.from_pretrained("gpt2")
            model = GPT2LMHeadModel.from_pretrained("gpt2")

            # Tokenize the input (ingredients prompt)
            inputs = tokenizer(prompt, return_tensors="pt")

            # Generate the recipe suggestions
            outputs = model.generate(inputs["input_ids"], max_length=100)

            # Decode the output
            result = tokenizer.decode(outputs[0], skip_special_tokens=True)

            return Response({"recipes": result}, status=status.HTTP_200_OK)

        except Exception as e:
            logger.error(f"Error while fetching recipe suggestions: {str(e)}")
            logger.exception(e)  # To log more details about the exception
            return Response({"error": "An error occurred while fetching recipe suggestions."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)