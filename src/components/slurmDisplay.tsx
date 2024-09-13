import { Check, X } from "lucide-react";
import { cn } from "../lib/utils";

type Job = {
  jobMessage: string;
  jobNumber: string;
};

export const SlurmDisplay: React.FC<{ file: { pathName: string; contents: string } }> = (
  props
) => {
  const { file } = props;
  const { contents } = file;

  // gets everything after the last backslash (getting the file name)
  // const fileName = pathName.match(/(?<=\\)[^\\$]*$/);

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
      <div className="mt-0 flex gap-x-2 items-center">
        <span className="text-2xl font-bold">
          {uniqueCompletedJobs.length} / {totalJobs} Completed
        </span>
        <div>{isComplete ? <Check color="green" /> : <X color="red" />}</div>
      </div>

      <div className="grid grid-cols-3 gap-6 mt-8 min-w-[1000px] w-full">
        <JobCard className="bg-red-500/[0.2] hover:bg-red-500/[0.3]">
          <div className="flex flex-col gap-y-1">
            <span className="text-xl font-bold">
              Failed Jobs ({actuallyFailedJobs.length})
            </span>
            <span className="text-sm text-gray-300 min-h-[40px]">
              Jobs that failed and never completed successfully
            </span>
          </div>
          <div className="flex flex-col mt-5 gap-y-1">
            {actuallyFailedJobs.map((x) => (
              <span className="text-sm" key={x.jobMessage}>
                {x.jobMessage}
              </span>
            ))}
          </div>
        </JobCard>

        <JobCard className="bg-yellow-500/[0.2] hover:bg-yellow-500/[0.3]">
          <div className="flex flex-col gap-y-1">
            <span className="text-xl font-bold">
              Resubmitted Jobs ({resubmittedJobs.length})
            </span>
            <span className="text-sm text-gray-300">
              Jobs that failed and got resubmitted
            </span>
          </div>
          <div className="flex flex-col mt-5 gap-y-1">
            {resubmittedJobs.map((x) => (
              <span className="text-sm" key={x.jobMessage}>
                {x.jobMessage}
              </span>
            ))}
          </div>
        </JobCard>

        <JobCard className="bg-green-500/[0.2] hover:bg-green-500/[0.3]">
          <div className="flex flex-col gap-y-1">
            <span className="text-xl font-bold">
              Completed Jobs ({uniqueCompletedJobs.length})
            </span>
            <span className="text-sm text-gray-300">
              Jobs that completed successfully
            </span>
          </div>
          <div className="flex flex-col mt-5 gap-y-1">
            {uniqueCompletedJobs.map((x) => (
              <span className="text-sm" key={x.jobMessage}>
                {x.jobMessage}
              </span>
            ))}
          </div>
        </JobCard>
      </div>
    </div>
  );
};

const JobCard: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => {
  return (
    <div
      className={cn(
        "flex flex-col border border-gray-700 py-4 rounded-lg px-6 max-h-[500px] overflow-y-auto scrollbar-thin",
        className
      )}
    >
      {children}
    </div>
  );
};
