export default function TeacherDashboard() {
  return (
    <div className="flex flex-col gap-8">
      <div className="bg-white p-6 rounded-xl border border-zinc-100 shadow-sm">
        <h3 className="text-xl font-bold mb-4">Class Overview</h3>
        <p className="text-zinc-600">
          Welcome to the Teacher Dashboard. Here you can monitor your students' progress, view insights, and flag students needing attention based on quiz and engagement patterns.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-zinc-100 shadow-sm">
          <h4 className="font-semibold mb-2 text-red-600 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
            Needs Attention
          </h4>
          <ul className="space-y-3">
            <li className="flex justify-between items-center border-b pb-2">
              <span>Alice Smith</span>
              <span className="text-sm px-2 py-1 bg-red-100 text-red-700 rounded-full">Struggling with Algebra</span>
            </li>
            <li className="flex justify-between items-center border-b pb-2">
              <span>Bob Johnson</span>
              <span className="text-sm px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full">Low engagement</span>
            </li>
          </ul>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-zinc-100 shadow-sm">
           <h4 className="font-semibold mb-2 text-green-600 flex items-center gap-2">
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
             Recent Achievements
           </h4>
           <ul className="space-y-3">
            <li className="flex justify-between items-center border-b pb-2">
              <span>Charlie Davis</span>
              <span className="text-sm text-zinc-500">Completed 10 quizzes</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
