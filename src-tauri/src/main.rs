// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::fs;

#[tauri::command]
fn read_files() -> String {
  let contents = fs::read_to_string("../../outputSlurm/slurm-2090203.out")
    .expect("error reading file");

  return contents;

  // println!("with text:\n{contents}");
}

fn main() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![read_files])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}

// fn main() {
//   let file_path = "../test.txt";

//   println!("in file {file_path}");

//   let contents = fs::read_to_string(file_path).expect("error reading file");

//   println!("with text:\n{contents}")
// }