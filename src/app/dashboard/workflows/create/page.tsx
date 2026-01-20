"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, ArrowLeft, Save, X } from "lucide-react";
import { useCreateWorkflowMutation } from "@/lib/api/workflowApi";

const DEFAULT_COLORS = [
  "#6B7280", // Gray
  "#3B82F6", // Blue
  "#10B981", // Green
  "#F59E0B", // Yellow
  "#8B5CF6", // Purple
  "#EF4444", // Red
];

export default function CreateWorkflowPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [stages, setStages] = useState([
    { id: "1", name: "Backlog", order: 0, color: DEFAULT_COLORS[0] },
    { id: "2", name: "To Do", order: 1, color: DEFAULT_COLORS[1] },
    { id: "3", name: "In Progress", order: 2, color: DEFAULT_COLORS[2] },
    { id: "4", name: "Review", order: 3, color: DEFAULT_COLORS[3] },
    { id: "5", name: "Done", order: 4, color: DEFAULT_COLORS[4] },
  ]);

  const [createWorkflow] = useCreateWorkflowMutation();

  const addStage = () => {
    const newStage = {
      id: Date.now().toString(),
      name: `Stage ${stages.length + 1}`,
      order: stages.length,
      color: DEFAULT_COLORS[stages.length % DEFAULT_COLORS.length],
    };
    setStages([...stages, newStage]);
  };

  const removeStage = (id: string) => {
    if (stages.length <= 2) return;
    const updatedStages = stages
      .filter((stage) => stage.id !== id)
      .map((stage, index) => ({ ...stage, order: index }));
    setStages(updatedStages);
  };

  const updateStage = (id: string, field: string, value: string) => {
    setStages(
      stages.map((stage) =>
        stage.id === id ? { ...stage, [field]: value } : stage,
      ),
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    const workflowData = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      stages: stages,
      isDefault: formData.get("isDefault") === "on",
    };

    try {
      await createWorkflow(workflowData).unwrap();
      router.push("/dashboard/workflows");
    } catch (error) {
      console.error("Failed to create workflow:", error);
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Create Workflow
            </h1>
            <p className="text-gray-600">Design your custom workflow process</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={() => router.push("/dashboard/workflows")}
          >
            <X className="mr-2 h-4 w-4" />
            Cancel
          </Button>
          <Button type="submit" form="workflow-form" disabled={loading}>
            <Save className="mr-2 h-4 w-4" />
            {loading ? "Creating..." : "Create Workflow"}
          </Button>
        </div>
      </div>

      <form id="workflow-form" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Workflow Details */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Workflow Details</CardTitle>
              <CardDescription>
                Define your workflow name and description
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Workflow Name *</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="e.g., Development Process"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Describe this workflow process..."
                  rows={4}
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isDefault"
                  name="isDefault"
                  className="h-4 w-4 rounded border-gray-300"
                />
                <Label htmlFor="isDefault">Set as default workflow</Label>
              </div>
            </CardContent>
          </Card>

          {/* Stages */}
          <Card>
            <CardHeader>
              <CardTitle>Stages</CardTitle>
              <CardDescription>
                Add and configure workflow stages
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stages.map((stage, index) => (
                  <div
                    key={stage.id}
                    className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg"
                  >
                    <div
                      className="h-6 w-6 rounded border"
                      style={{ backgroundColor: stage.color }}
                    />
                    <div className="flex-1">
                      <Input
                        value={stage.name}
                        onChange={(e) =>
                          updateStage(stage.id, "name", e.target.value)
                        }
                        className="text-sm"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeStage(stage.id)}
                      disabled={stages.length <= 2}
                      className="h-8 w-8"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}

                <Button
                  type="button"
                  variant="outline"
                  onClick={addStage}
                  className="w-full"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Stage
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </form>

      {/* Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Workflow Preview</CardTitle>
          <CardDescription>How your workflow will look</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex overflow-x-auto pb-4 space-x-4">
            {stages.map((stage) => (
              <div
                key={stage.id}
                className="flex-shrink-0 w-64 p-4 rounded-lg border"
                style={{
                  borderColor: stage.color,
                  backgroundColor: `${stage.color}10`,
                }}
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold">{stage.name}</h3>
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: stage.color }}
                  />
                </div>
                <div className="space-y-2">
                  <div className="h-2 bg-gray-200 rounded"></div>
                  <div className="h-2 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-2 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
