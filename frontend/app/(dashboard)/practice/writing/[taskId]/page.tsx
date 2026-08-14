import TaskScaffold from "@/components/practice/TaskScaffold";

export default function WritingTaskPage({ params }: { params: { taskId: string } }) {
  return <TaskScaffold category="writing" taskId={params.taskId} />;
}
