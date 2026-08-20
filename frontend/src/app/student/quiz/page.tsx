import fs from 'fs';
import path from 'path';

export default async function QuizPage() {
  const filePath = path.join(process.cwd(), 'data', 'mockDatabase.json');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const data = JSON.parse(fileContents);
  const profile = data.studentProfile;

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 border-b pb-4">Quiz History</h1>
      <div className="space-y-3 mt-4">
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
  );
}
