import { useState, useEffect } from "react";
import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Input, Textarea } from "@heroui/input";
import { Alert } from "@heroui/alert";

import { title, subtitle } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";
import { api } from "@/api";
import { Note, User, CreateNoteRequest } from "@/types/api";

export default function HomePage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newNote, setNewNote] = useState<CreateNoteRequest>({
    title: "",
    content: "",
  });
  const [creating, setCreating] = useState(false);
  const [showOnlyMine, setShowOnlyMine] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const user = await api.getCurrentUser();

      setCurrentUser(user);

      const userNotes = await api.getNotes();

      setNotes(userNotes);
    } catch (err: any) {
      setError(err.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNote = async () => {
    if (!newNote.title.trim() || !newNote.content.trim()) {
      setError("Please fill in both title and content");

      return;
    }

    try {
      setCreating(true);
      setError(null);

      await api.createNote(newNote);
      setSuccess("Note created successfully!");
      setTimeout(() => setSuccess(null), 3000);
      setNewNote({ title: "", content: "" });
      setShowCreateForm(false);

      await loadData();
    } catch (err: any) {
      setError(err.message || "Failed to create note");
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteNote = async (
    noteId: number,
    isCurrentUser: boolean = true,
  ) => {
    if (!confirm("Are you sure you want to delete this note?")) {
      return;
    }

    try {
      setError(null);

      if (isCurrentUser) {
        await api.deleteNote(noteId);
      } else {
        // Admin delete
        await api.adminDeleteNote(noteId);
      }

      setSuccess("Note deleted successfully!");
      setTimeout(() => setSuccess(null), 3000);

      // Reload data to reflect the deletion
      await loadData();
    } catch (err: any) {
      setError(err.message || "Failed to delete note");
    }
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getDisplayedNotes = () => {
    if (showOnlyMine && currentUser) {
      return notes.filter((n) => n.author === currentUser.id);
    }

    return notes;
  };

  if (loading) {
    return (
      <DefaultLayout>
        <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
          <div className="text-center">Loading...</div>
        </section>
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout username={currentUser?.username}>
      <section className="flex flex-col items-center justify-center gap-6 py-8 md:py-10">
        {/* Header */}
        <div className="inline-block max-w-4xl text-center justify-center">
          <span className={title()}>Notes&nbsp;</span>
          <span className={title({ color: "violet" })}>Dashboard&nbsp;</span>
          <div className={subtitle({ class: "mt-4" })}>
            Manage your notes and view community posts
          </div>
        </div>

        {/* Alerts */}
        {error && (
          <Alert className="max-w-4xl w-full" color="danger">
            {error}
          </Alert>
        )}

        {success && (
          <Alert className="max-w-4xl w-full" color="success">
            {success}
          </Alert>
        )}

        <div className="max-w-4xl w-full space-y-6">
          {/* Controls Section */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-4">
              <h2 className="text-2xl font-bold">
                {showOnlyMine ? "My Notes" : "All Notes"} (
                {getDisplayedNotes().length})
              </h2>
              <Button
                color={showOnlyMine ? "primary" : "default"}
                size="sm"
                variant={showOnlyMine ? "solid" : "bordered"}
                onPress={() => setShowOnlyMine(!showOnlyMine)}
              >
                {showOnlyMine ? "Show All Notes" : "Show Only Mine"}
              </Button>
            </div>
            <Button
              color="primary"
              onPress={() => setShowCreateForm(!showCreateForm)}
            >
              {showCreateForm ? "Cancel" : "Create New Note"}
            </Button>
          </div>

          {/* Create Note Form */}
          {showCreateForm && (
            <Card className="p-4">
              <CardHeader>
                <h3 className="text-lg font-semibold">Create New Note</h3>
              </CardHeader>
              <CardBody>
                <div className="space-y-4">
                  <Input
                    required
                    label="Title"
                    placeholder="Enter note title"
                    value={newNote.title}
                    onChange={(e) =>
                      setNewNote({ ...newNote, title: e.target.value })
                    }
                  />
                  <Textarea
                    required
                    label="Content"
                    placeholder="Enter note content"
                    value={newNote.content}
                    onChange={(e) =>
                      setNewNote({ ...newNote, content: e.target.value })
                    }
                  />
                  <div className="flex gap-2">
                    <Button
                      color="primary"
                      isLoading={creating}
                      onPress={handleCreateNote}
                    >
                      Create Note
                    </Button>
                    <Button
                      color="default"
                      variant="light"
                      onPress={() => setShowCreateForm(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </CardBody>
            </Card>
          )}

          {/* Notes List */}
          <div className="space-y-3">
            {getDisplayedNotes().length === 0 ? (
              <Card>
                <CardBody className="text-center py-8">
                  <p className="text-gray-500">
                    {showOnlyMine
                      ? "You haven't created any notes yet."
                      : "No notes available yet."}
                  </p>
                  {showOnlyMine && (
                    <Button
                      className="mt-2"
                      color="primary"
                      variant="light"
                      onPress={() => setShowCreateForm(true)}
                    >
                      Create your first note
                    </Button>
                  )}
                </CardBody>
              </Card>
            ) : (
              getDisplayedNotes().map((note) => {
                const isCurrentUserNote = currentUser
                  ? note.author === currentUser.id
                  : false;
                const canDelete = isCurrentUserNote || currentUser?.is_staff;

                return (
                  <Card key={note.id} className="w-full">
                    <CardHeader className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold">{note.title}</h3>
                        <p className="text-sm text-gray-500">
                          By: {note.author_username} •{" "}
                          {formatDate(note.created_at)}
                          {isCurrentUserNote && (
                            <span className="ml-2 text-blue-500">
                              (Your note)
                            </span>
                          )}
                        </p>
                      </div>
                      {canDelete && (
                        <Button
                          color="danger"
                          size="sm"
                          variant="light"
                          onPress={() =>
                            handleDeleteNote(note.id, isCurrentUserNote)
                          }
                        >
                          {currentUser?.is_staff && !isCurrentUserNote
                            ? "Admin Delete"
                            : "Delete"}
                        </Button>
                      )}
                    </CardHeader>
                    <CardBody>
                      <p className="whitespace-pre-wrap">{note.content}</p>
                    </CardBody>
                  </Card>
                );
              })
            )}
          </div>
        </div>

        {/* Admin Info */}
        {currentUser?.is_staff && (
          <div className="max-w-4xl w-full">
            <Alert color="warning">
              <strong>Admin Mode:</strong> You can delete any note as a
              superadmin.
            </Alert>
          </div>
        )}
      </section>
    </DefaultLayout>
  );
}
