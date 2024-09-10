import { useState } from "react";
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import "./App.css";
import { readTextFile, readDir, BaseDirectory, FileEntry } from "@tauri-apps/api/fs";
import { open } from "@tauri-apps/api/dialog";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./components/ui/select";
import { SlurmDisplay } from "./components/slurmDisplay";

const slurmFileRegex = /^slurm-[0-9]{7}\.out$/;

function App() {
  const [selectedFile, setSelectedFile] = useState<{
    pathName: string;
    contents: string;
  }>();

  const [outputFiles, setOutputFiles] = useState<FileEntry[]>([]);

  const handleOpenFile = async () => {
    try {
      const selectedPath = await open({
        multiple: false,
        title: "Open Text File",
      });
      // if null or multiple files selected, return
      if (!selectedPath || Array.isArray(selectedPath)) return;
      const contents = await readTextFile(selectedPath);
      // console.log(selectedPath, contents);
      setSelectedFile({ pathName: selectedPath, contents: contents });
      setOutputFiles([]);
      // now we have the file contents
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenFolder = async () => {
    try {
      const selectedPath = await open({
        multiple: false,
        title: "Open Output Folder",
        directory: true,
      });
      if (!selectedPath || Array.isArray(selectedPath)) return;
      const contents = await readDir(selectedPath);
      const importantFiles = contents.filter((x) => {
        const match = x.name?.match(slurmFileRegex);
        return match ? match[0] : null;
      });
      setOutputFiles(importantFiles);
      setSelectedFile(undefined);
      console.log(importantFiles);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSelectOutputFile = async (path: string) => {
    const file = outputFiles.find((x) => x.path === path);
    if (!file) return;
    const contents = await readTextFile(file.path);
    setSelectedFile({ pathName: file.path, contents: contents });
  };

  return (
    <main className="flex min-h-screen flex-col items-center text-white w-screen bg-[rgba(17,24,39,1)] scrollbar-thumb-slate-800 scrollbar-track-slate-400">
      <div className="container flex flex-col items-center px-4 py-12">
        <div className="flex gap-x-8 items-center">
          <button
            onClick={handleOpenFolder}
            className="border border-dashed px-4 py-2 rounded-lg font-medium max-w-[180px]"
          >
            Select Slurp Output Folder
          </button>

          <span>OR</span>

          <button
            onClick={handleOpenFile}
            className="border border-dashed px-4 py-2 rounded-lg font-medium max-w-[180px]"
          >
            Select Slurm Output File
          </button>
        </div>

        {outputFiles?.length > 0 && (
          <div className="mt-6">
            <Select onValueChange={(value) => handleSelectOutputFile(value)}>
              <SelectTrigger className="w-[180px] text-white">
                <SelectValue placeholder="Select an Output File" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup className="bg-[rgba(17,24,39,1)]">
                  {outputFiles.map((x) => (
                    <SelectItem
                      key={x.name}
                      value={x.path}
                      className="text-white hover:bg-slate-700 cursor-pointer"
                    >
                      {x.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        )}

        {selectedFile && (
          <div className="mt-6 flex flex-col items-center">
            {outputFiles.length === 0 && (
              <span className="mb-4">
                {selectedFile.pathName.match(/(?<=\\)[^\\$]*$/)}
              </span>
            )}

            <SlurmDisplay file={selectedFile} />
          </div>
        )}
      </div>
    </main>
  );
}

export default App;
