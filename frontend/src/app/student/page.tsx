import fs from 'fs';
import path from 'path';
import ShinyText from '@/components/ShinyText';
import SocraticTutor from '@/components/dashboard/SocraticTutor';


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
      
      <div className="w-full lg:w-2/3 flex flex-col h-[600px]">
        <SocraticTutor />
      </div>
    </div>
  );
}
