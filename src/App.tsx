import { useState, useEffect } from "react";
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import "./App.css";

// import { invoke } from "@tauri-apps/api";
// import { BaseDirectory, readTextFile } from "@tauri-apps/api/fs";
import { resourceDir } from "@tauri-apps/api/path";
import { readTextFile } from "@tauri-apps/api/fs";
import { open } from "@tauri-apps/api/dialog";

function App() {
  // const [count, setCount] = useState(0)
  const [file, setFile] = useState("");
  const [path, setPath] = useState("");

  const handleOpen = async () => {
    try {
      const selectedPath = await open({
        multiple: false,
        title: "Open Text File",
      });
      if (!selectedPath) return;
      const contents = await readTextFile(selectedPath as string);
      console.log(selectedPath, contents);
      setFile(contents);
      // now we have the file contents
    } catch (err) {
      console.error(err);
    }
  };

  const allStrings = file.split(/\r?\n/);
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
    <main className="flex min-h-screen flex-col items-center text-white w-screen bg-gray-800">
      <div className="container flex flex-col items-center px-4 py-16">
        <button onClick={handleOpen}>Open Text File</button>
        <div className="w-full text-center">Slurm-2090203</div>
        <div className="">{totalJobs} Total Jobs</div>
        <div className="grid grid-cols-3 gap-6 mt-12">
          <div className="flex flex-col">
            <span className="text-lg">Completed Jobs ({uniqueCompletedJobs.length})</span>
            <div className="flex flex-col mt-2">
              {uniqueCompletedJobs.map((x) => (
                <span key={x}>{x}</span>
              ))}
            </div>
          </div>

          <div className="flex flex-col">
            <span className="text-lg">Resubmitted Jobs ({resubmittedJobs.length})</span>
            <div className="flex flex-col mt-2">
              {resubmittedJobs.map((x) => (
                <span key={x}>{x}</span>
              ))}
            </div>
          </div>

          <div className="flex flex-col">
            <span className="text-lg">Failed Jobs ({failedJobs.length})</span>
            <div className="flex flex-col mt-2">
              {failedJobs.map((x) => (
                <span key={x}>{x}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default App;

// useEffect(() => {
//   const getFiles = async () => {
//     // const files: string = await invoke("read_files");
//     // setFiles(files);
//     const resourceDirPath = await resourceDir();

//     const files = readTextFile(
//       resourceDirPath + "../../../outputSlurm/slurm-2090203.out"
//     );
//     console.log(files);
//     console.log(resourceDirPath);
//     setPath(resourceDirPath);
//     setFiles("");
//   };
//   getFiles();
// }, []);
