"use client"
import { useState, useEffect } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/DataTable";
import Modal from "@/components/shared/Modal";
import { Button } from "react-daisyui";
import { useSession } from "next-auth/react";

type Subject = {
  id?: string;
  name: string;
  desc?: string;
  sectionId?: string;
  teacherId?: string;
};

const SubjectsPage = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    fetch('/api/subjects')
      .then(res => res.json())
      .then(data => {
        // Map desc to description for UI compatibility
        const mapped = Array.isArray(data)
          ? data.map((s) => ({ ...s }))
          : [];
        setSubjects(mapped);
      })
      .finally(() => setLoading(false));
  }, []);
  const { data: session } = useSession();


  const [openModal, setOpenModal] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);

  /** CRUD actions */
  const handleDelete = async (id: string) => {
    setLoading(true);
    await fetch(`/api/subjects/${id}`, { method: 'DELETE' });
    setSubjects((prev) => prev.filter((s) => s.id !== id));
    setLoading(false);
  };

  const handleSave = async (subject: Subject) => {
    setLoading(true);
    if (subject.id) {
      // update existing
      const res = await fetch(`/api/subjects/${subject.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(subject),
      });
      if (res.ok) {
        const updated = await res.json();
        setSubjects((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
      }
    } else {
      // create new
      const res = await fetch('/api/subjects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(subject),
      });
      if (res.ok) {
        const created = await res.json();
        setSubjects((prev) => [...prev, created]);
      }
    }
    setOpenModal(false);
    setEditingSubject(null);
    setLoading(false);
  };

  const columns: ColumnDef<Subject>[] = [
  { accessorKey: "name", header: "Subject Name" },
  { accessorKey: "desc", header: "Description" },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const subject = row.original;
        return (
          <div className="flex gap-2">
            <Button
              size="sm"
              color="primary"
              onClick={() => {
                setEditingSubject(subject);
                setOpenModal(true);
              }}
            >
              Edit
            </Button>
            <Button
              size="sm"
              color="error"
              onClick={() => subject.id && handleDelete(subject.id)}
            >
              Delete
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">📚 Subjects</h1>
        <Button
          color="success"
          onClick={() => {
            setEditingSubject({ name: "", desc: "", teacherId: session?.user?.id });
            setOpenModal(true);
          }}
        >
         Add Subject
        </Button>
      </div>

  {loading && <div>Loading...</div>}
  <DataTable columns={columns} data={subjects} />

      {/* Modal */}
      <Modal open={openModal} close={() => setOpenModal(false)}>
        <Modal.Header>
          {editingSubject?.id ? "Edit Subject" : "Add Subject"}
        </Modal.Header>
        <Modal.Body>
          <div className="mb-4">
            <label className="block text-sm font-medium">Name</label>
            <input
              type="text"
              className="w-full border p-2 rounded mt-1"
              value={editingSubject?.name || ""}
              onChange={(e) =>
                setEditingSubject((prev) =>
                  prev ? { ...prev, name: e.target.value } : null
                )
              }
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">Description</label>
            <textarea
              className="w-full border p-2 rounded mt-1"
              value={editingSubject?.desc || ""}
              onChange={(e) =>
                setEditingSubject((prev) =>
                  prev ? { ...prev, desc: e.target.value } : null
                )
              }
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            color="ghost"
            onClick={() => {
              setOpenModal(false);
              setEditingSubject(null);
            }}
          >
            Cancel
          </Button>
          <Button
            color="primary"
            onClick={() =>
              editingSubject ? handleSave(editingSubject) : null
            }
          >
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default SubjectsPage;
