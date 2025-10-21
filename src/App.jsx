
import React, {useEffect,useState} from 'react';
import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api/tasks';

export default function App(){
  const [task,setTask] = useState(null);
  const [tasks,setTasks] = useState([]);
  const [progress,setProgress] = useState({});
  const fetchToday = async()=>{const res = await axios.get(API_URL+'/today'); setTask(res.data);};
  const fetchAll = async()=>{const res = await axios.get(API_URL); setTasks(res.data);};
  const fetchProgress = async()=>{const res = await axios.get(API_URL+'/progress/summary'); setProgress(res.data||{});};
  useEffect(()=>{fetchToday(); fetchAll(); fetchProgress();},[]);
  const markComplete = async()=>{
    if(!task) return;
    await axios.post(API_URL+'/'+task._id+'/complete',{hours:task.expectedHours});
    fetchToday(); fetchProgress(); fetchAll();
  };
  const percent = tasks.length? Math.round((progress.completedDays||0)/tasks.length*100):0;
  return <div className="min-h-screen bg-slate-50 p-6">
    <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-2xl p-6">
      <h1 className="text-2xl font-bold mb-2">Himanshu — SwitchReady Platform</h1>
      {task? <div className="border p-4 rounded mb-4">
        <h2>Day {task.day}: {task.title}</h2>
        <p>Expected Hours: {task.expectedHours}</p>
        <a href={task.resourceUrl} target="_blank">Open Resource</a><br/>
        <a href={task.quizUrl} target="_blank">Open Quiz</a><br/>
        <p>Mini Project: {task.projectSuggestion}</p>
        <button onClick={markComplete} className="mt-2 px-3 py-1 bg-green-600 text-white rounded">Mark Complete</button>
      </div>: <p>All tasks completed!</p>}
      <div className="w-full bg-slate-200 h-4 rounded overflow-hidden"><div className="h-4 bg-green-500" style={{width:percent+'%'}}></div></div>
      <p className="text-sm mt-2">{progress.completedDays||0} / {tasks.length} days completed ({percent}%)</p>
    </div>
  </div>;
}
