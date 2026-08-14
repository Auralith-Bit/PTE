import TaskScaffold from "@/components/practice/TaskScaffold";

export default function ListeningTaskPage({ params }: { params: { taskId: string } }) {
  return <TaskScaffold category="listening" taskId={params.taskId} />;
}
