from rest_framework import serializers
from .models import Ingredient

class IngredientSerializer(serializers.ModelSerializer):
    # Change name to a simple CharField instead of ListField
    name = serializers.CharField(allow_blank=False)  # Ensure that the name is not empty

    class Meta:
        model = Ingredient
        fields = ["name", "category"]
