import { Check, X } from "lucide-react";

export const SlurmDisplay: React.FC<{ file: { pathName: string; contents: string } }> = (
  props
) => {
  const { file } = props;
  const { pathName, contents } = file;

  // gets everything after the last backslash (getting the file name)
  const fileName = pathName.match(/(?<=\\)[^\\$]*$/);

  // splits file contents line by line
  const allStrings = contents.split(/\r?\n/);

  const jobRegex = /Job (\d+)/;

  const totalJobs = [
    ...new Set(
      allStrings
        .map((x) => {
          const match = x.match(jobRegex);
          return match ? match[1] : null;
        })
        .filter((x) => x !== null)
    ),
  ].length;

  const allCompletedJobs = allStrings.filter((x) =>
    x.includes("completed successfully.")
  );
  const uniqueCompletedJobs = [...new Set(allCompletedJobs)];
  const uniqueCompletedJobIds = uniqueCompletedJobs.map((x) => x.match(jobRegex)?.[1]);

  const resubmittedJobs = allStrings.filter((x) => x.includes("resubmitted with ID"));

  // all jobs that failed
  const failedJobs = allStrings
    .filter(
      (x) =>
        x.includes("failed") ||
        x.includes("does not end with: pALM successfully finishes the run")
    )
    .map((x) => {
      return {
        jobMessage: x,
        jobNumber: x.match(jobRegex)?.[1],
      };
    });
  // all jobs that failed and never completed after being resubmitted
  const actuallyFailedJobs = failedJobs.filter(
    (x) => !uniqueCompletedJobIds.includes(x.jobNumber)
  );

  // const completeJobsStrings = allStrings.filter((x) => x === "Complete jobs: 0.");

  const isComplete = uniqueCompletedJobs.length === totalJobs;

  return (
    <div className="flex flex-col items-center">
      <div className="w-full text-center">{fileName}</div>
      <div className="">{totalJobs} Total Jobs</div>

      <div className="mt-4 flex gap-x-2">
        <span>
          {uniqueCompletedJobs.length} / {totalJobs} Completed
        </span>
        <div>{isComplete ? <Check color="green" /> : <X color="red" />}</div>
      </div>

      <div className="grid grid-cols-3 gap-6 mt-8 min-w-[800px] ">
        <div className="flex flex-col border border-red-700 rounded-lg px-2 max-h-[500px] max-w-[300px] overflow-y-auto bg-red-500/10">
          <div className="flex flex-col items-center mt-4">
            <span className="text-xl font-bold">Failed Jobs</span>
            <span className="font-medium">({actuallyFailedJobs.length})</span>
          </div>
          <div className="flex flex-col mt-4 items-center text-center">
            {actuallyFailedJobs.map((x) => (
              <span key={x.jobMessage}>{x.jobMessage}</span>
            ))}
          </div>
        </div>

        <div className="flex flex-col border border-yellow-700 rounded-lg px-2 max-h-[500px] max-w-[300px] overflow-y-auto bg-yellow-500/10">
          <div className="flex flex-col items-center mt-4">
            <span className="text-xl font-bold">Resubmitted Jobs</span>
            <span className="font-medium">({resubmittedJobs.length})</span>
          </div>
          <div className="flex flex-col mt-4 items-center text-center">
            {resubmittedJobs.map((x) => (
              <span key={x}>{x}</span>
            ))}
          </div>
        </div>

        <div className="flex flex-col border border-green-700 rounded-lg px-2 max-h-[500px] max-w-[300px] overflow-y-auto bg-green-500/10 scrollbar-thin">
          <div className="flex flex-col items-center mt-4">
            <span className="text-xl font-bold">Completed Jobs</span>
            <span className="font-medium">({uniqueCompletedJobs.length})</span>
          </div>
          <div className="flex flex-col mt-4 items-center text-center">
            {uniqueCompletedJobs.map((x) => (
              <span key={x}>{x}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
