import { ExclamationCircleIcon } from "@heroicons/react/20/solid";

export const ErrorTasksComponent = () => {
  return (
    <div className="flex items-center my-6 text-center self-center text-red-600">
      <ExclamationCircleIcon className="w-6 h-6 mr-2 " />
      <span>Error loading tasks</span>
    </div>
  );
};
