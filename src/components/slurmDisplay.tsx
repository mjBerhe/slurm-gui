import { Check, X } from "lucide-react";

type Job = {
  jobMessage: string;
  jobNumber: string;
};

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
  // all completed jobs in order of job ID
  const uniqueCompletedJobs: Job[] = [...new Set(allCompletedJobs)]
    .map((x) => ({
      jobMessage: x,
      jobNumber: x.match(jobRegex)?.[1] as string,
    }))
    .sort((a, b) => parseInt(a.jobNumber) - parseInt(b.jobNumber));
  const uniqueCompletedJobIds = uniqueCompletedJobs.map((x) => x.jobNumber);

  const resubmittedJobs: Job[] = allStrings
    .filter((x) => x.includes("resubmitted with ID"))
    .map((x) => ({
      jobMessage: x,
      jobNumber: x.match(jobRegex)?.[1] as string,
    }))
    .sort((a, b) => parseInt(a.jobNumber) - parseInt(b.jobNumber));

  // all jobs that failed
  const failedJobs: Job[] = allStrings
    .filter(
      (x) =>
        x.includes("failed") ||
        x.includes("does not end with: pALM successfully finishes the run")
    )
    .map((x) => {
      return {
        jobMessage: x,
        jobNumber: x.match(jobRegex)?.[1] as string,
      };
    })
    .sort((a, b) => parseInt(a.jobNumber) - parseInt(b.jobNumber));

  // all jobs that failed and never completed after being resubmitted
  const actuallyFailedJobs = failedJobs.filter(
    (x) => !uniqueCompletedJobIds.includes(x.jobNumber)
  );

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
        <div className="flex flex-col border border-red-500 rounded-xl px-4 max-h-[500px] max-w-[333px] overflow-y-auto dark:bg-red-500/[0.075]">
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

        <div className="flex flex-col border border-yellow-500 rounded-lg px-2 max-h-[500px] max-w-[300px] overflow-y-auto dark:bg-yellow-500/[0.075]">
          <div className="flex flex-col items-center mt-4">
            <span className="text-xl font-bold">Resubmitted Jobs</span>
            <span className="font-medium">({resubmittedJobs.length})</span>
          </div>
          <div className="flex flex-col mt-4 items-center text-center">
            {resubmittedJobs.map((x) => (
              <span key={x.jobMessage}>{x.jobMessage}</span>
            ))}
          </div>
        </div>

        <div className="flex flex-col border border-green-500 rounded-lg px-2 max-h-[500px] max-w-[300px] overflow-y-auto dark:bg-green-500/[0.075] scrollbar-thin">
          <div className="flex flex-col items-center mt-4">
            <span className="text-xl font-bold">Completed Jobs</span>
            <span className="font-medium">({uniqueCompletedJobs.length})</span>
          </div>
          <div className="flex flex-col mt-4 items-center text-center">
            {uniqueCompletedJobs.map((x) => (
              <span key={x.jobMessage}>{x.jobMessage}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
