import fs from 'fs';
import path from 'path';
import ShinyText from '@/components/ShinyText';

export default async function StudentDashboard() {
  const filePath = path.join(process.cwd(), 'data', 'mockDatabase.json');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const data = JSON.parse(fileContents);
  
  const profile = data.studentProfile;

  return (
    <div className="p-8 min-h-screen bg-gray-50 flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto">
      <div className="w-full lg:w-1/3 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-fit">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Student Dashboard</h1>
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
            <p className="text-gray-700 mb-1"><strong>Name:</strong> {profile.name}</p>
            <p className="text-gray-700 mb-1"><strong>Grade:</strong> {profile.grade}</p>
            <p className="text-gray-700"><strong>Overall Performance:</strong> <span className="text-orange-600 font-semibold">{profile.overallPerformance}</span></p>
          </div>
          
          <h2 className="text-xl font-semibold mt-8 mb-4 text-gray-800 border-b pb-2">Quiz History</h2>
          <div className="space-y-3">
            {profile.quizHistory.map((quiz: any, index: number) => (
              <div key={index} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
                <div>
                  <div className="font-semibold text-gray-800 text-lg">{quiz.subject}</div>
                  <div className="text-sm text-gray-500">{quiz.date}</div>
                </div>
                <div className="text-xl font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-lg">
                  {quiz.score}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="w-full lg:w-2/3 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-[600px]">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 border-b pb-4">AI Chat Board</h2>
        <div className="flex-1 bg-gray-50 rounded-xl p-6 overflow-y-auto mb-4 border border-gray-100 shadow-inner">
          <div className="bg-white p-5 rounded-2xl rounded-tl-sm shadow-sm border border-gray-100 max-w-[85%] mb-4">
            <ShinyText 
              text={`Hello ${profile.name}! I am your AI Tutor. Let's work on improving your physics and math scores today.`} 
              disabled={false} 
              speed={3} 
              className="text-gray-800 font-medium text-lg" 
            />
          </div>
        </div>
        <div className="flex gap-3">
          <input type="text" placeholder="Type a message to your AI Tutor..." className="flex-1 border border-gray-200 rounded-xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 focus:bg-white transition-colors" />
          <button className="bg-blue-600 text-white px-8 py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors shadow-sm">Send</button>
        </div>
      </div>
    </div>
  );
}
