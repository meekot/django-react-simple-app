from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics
from rest_framework.response import Response
from rest_framework import status

from .permissions import IsOwner

from .models import Note
from .serializers import NoteSerializer, UserSerilazer
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser

class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerilazer
    permission_classes = [AllowAny]
    authentication_classes = []

class GetUsersView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerilazer
    permission_classes = [IsAdminUser]

class GetUsersNamesView(generics.ListAPIView): 
    queryset = User.objects.all() 


class NoteListCreateView(generics.ListCreateAPIView):
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]
    queryset = Note.objects.all().order_by('-created_at')
 
    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save(author=self.request.user)
        else:
            print(serializer.errors)

class NoteDelete(generics.DestroyAPIView):
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated, IsOwner]

    def get_queryset(self):
        user = self.request.user
        return Note.objects.filter(author=user)

class AdminNoteDelete(generics.DestroyAPIView):
    queryset = Note.objects.all()
    serializer_class = NoteSerializer
    permission_classes = [IsAdminUser]

class CurrentUserView(generics.RetrieveAPIView):
    serializer_class = UserSerilazer
    permission_classes = [IsAuthenticated]
    
    def get_object(self):
        return self.request.user
