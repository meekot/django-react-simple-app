from django.urls import path
from . import views
urlpatterns = [
    path('notes/', views.NoteListCreateView.as_view(), name="note.list"),
    path('notes/delete/<int:pk>/', views.NoteDelete.as_view(), name="note.delete"),
    path('notes/admin/delete/<int:pk>/', views.AdminNoteDelete.as_view(), name="admin.note.delete"),
]
