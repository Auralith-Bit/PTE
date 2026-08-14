import TaskScaffold from "@/components/practice/TaskScaffold";

export default function ReadingTaskPage({ params }: { params: { taskId: string } }) {
  return <TaskScaffold category="reading" taskId={params.taskId} />;
}
