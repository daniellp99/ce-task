import { getTasksAction } from "@/actions/task";
import CreateTaskForm from "@/components/CreateTaskForm";
import EditTaskForm from "@/components/EditTaskForm";

export default async function Home() {
  const tasks = await getTasksAction();
  return (
    <main className="min-h-screen container mt-14 flex flex-col gap-2 items-left justify-start">
      <CreateTaskForm />
      {tasks.map((task) => (
        <EditTaskForm key={task.id} task={task} />
      ))}
    </main>
  );
}
