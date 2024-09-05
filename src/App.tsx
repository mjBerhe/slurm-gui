import { useState } from "react";
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import "./App.css";
import { readTextFile } from "@tauri-apps/api/fs";
import { open } from "@tauri-apps/api/dialog";
import { SlurmDisplay } from "./components/slurmDisplay";

function App() {
  const [selectedFile, setSelectedFile] = useState<{
    pathName: string;
    contents: string;
  }>();

  const handleOpen = async () => {
    try {
      const selectedPath = await open({
        multiple: false,
        title: "Open Text File",
      });
      if (!selectedPath) return;
      const contents = await readTextFile(selectedPath as string);
      // console.log(selectedPath, contents);
      setSelectedFile({ pathName: selectedPath as string, contents: contents });
      // now we have the file contents
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center text-white w-screen bg-gray-800">
      <div className="container flex flex-col items-center px-4 py-16">
        <div className="">
          <button
            onClick={handleOpen}
            className="border border-dashed px-4 py-2 rounded-lg font-medium"
          >
            Select Slurm Output File
          </button>
        </div>

        {selectedFile && (
          <div className="mt-6">
            <SlurmDisplay file={selectedFile} />
          </div>
        )}
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
