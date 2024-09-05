export const SlurmDisplay: React.FC<{ file: { pathName: string; contents: string } }> = (
  props
) => {
  const { file } = props;
  const { pathName, contents } = file;

  // gets everything after the last backslash (getting the file name)
  const fileName = pathName.match(/(?<=\\)[^\\$]*$/);

  // splits file contents line by line
  const allStrings = contents.split(/\r?\n/);
  console.log(`Total strings: ${allStrings.length}`);

  const regex = /Job (\d+)/;

  const totalJobs = [
    ...new Set(
      allStrings
        .map((x) => {
          const match = x.match(regex);
          return match ? match[1] : null;
        })
        .filter((x) => x !== null)
    ),
  ].length;

  const allCompletedJobs = allStrings.filter((x) =>
    x.includes("completed successfully.")
  );
  console.log(`Completed Jobs: ${allCompletedJobs.length}`);
  const uniqueCompletedJobs = [...new Set(allCompletedJobs)];

  const resubmittedJobs = allStrings.filter((x) => x.includes("resubmitted with ID"));

  const failedJobs = allStrings.filter(
    (x) =>
      x.includes("failed") ||
      x.includes("does not end with: pALM successfully finishes the run")
  );
  console.log(failedJobs.length);

  const completeJobsStrings = allStrings.filter((x) => x === "Complete jobs: 0.");
  console.log(`Complete jobs string amount: ${completeJobsStrings.length}`);

  return (
    <div className="flex flex-col items-center">
      <div className="w-full text-center">{fileName}</div>
      <div className="">{totalJobs} Total Jobs</div>

      <div className="grid grid-cols-3 gap-6 mt-12 min-w-[800px]">
        <div className="flex flex-col border border-red-700 rounded-lg px-2 max-h-[500px] max-w-[300px] overflow-y-auto bg-red-500/10">
          <div className="flex flex-col items-center mt-4">
            <span className="text-xl font-bold">Failed Jobs</span>
            <span className="font-medium">({failedJobs.length})</span>
          </div>
          <div className="flex flex-col mt-4 items-center text-center">
            {failedJobs.map((x) => (
              <span key={x}>{x}</span>
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

        <div className="flex flex-col border border-green-700 rounded-lg px-2 max-h-[500px] max-w-[300px] overflow-y-auto bg-green-500/10">
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
