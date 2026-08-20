import fs from 'fs';
import path from 'path';

export default async function ProfilePage() {
  const filePath = path.join(process.cwd(), 'data', 'mockDatabase.json');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const data = JSON.parse(fileContents);
  const profile = data.studentProfile;

  return (
    <div className="bg-slate-50/80 dark:bg-zinc-900/80 backdrop-blur-md p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-zinc-800 w-full">
      <h1 className="text-3xl font-bold mb-8 text-slate-800 dark:text-zinc-100">Student Profile</h1>
      
      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Avatar */}
        <div className="w-32 h-32 rounded-full bg-slate-200 dark:bg-zinc-700 flex items-center justify-center text-4xl font-bold text-slate-500 dark:text-zinc-400 shrink-0">
          AJ
        </div>

        {/* Details */}
        <div className="flex-1 space-y-4 w-full">
          <h2 className="text-xl font-semibold text-slate-700 dark:text-zinc-200 border-b border-slate-200 dark:border-zinc-800 pb-2">Personal Details</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-zinc-400">Name</p>
              <p className="text-lg font-semibold text-slate-900 dark:text-zinc-100">{profile.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-zinc-400">Grade</p>
              <p className="text-lg font-semibold text-slate-900 dark:text-zinc-100">{profile.grade}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-zinc-400">Student ID</p>
              <p className="text-lg font-semibold text-slate-900 dark:text-zinc-100">STU-9842</p>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-zinc-400">Advisor</p>
              <p className="text-lg font-semibold text-slate-900 dark:text-zinc-100">Dr. Emily Chen</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
