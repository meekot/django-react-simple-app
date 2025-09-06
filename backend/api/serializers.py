from django.contrib.auth.models import User
from rest_framework import serializers

from .models import Note

class UserSerilazer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "password", "first_name", "last_name", "email", "is_staff"]
        extra_kwargs = {"password": {"write_only": True}, "is_staff": {"read_only": True}}
    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

class NoteSerializer(serializers.ModelSerializer): 
    author_username = serializers.CharField(source="author.username", read_only=True)
    class Meta:
        model = Note
        fields = ["id", "title", "content", "created_at", "author", "author_username"]
        extra_kwargs = {"author": {"read_only": True}}