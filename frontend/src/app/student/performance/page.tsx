import fs from 'fs';
import path from 'path';

export default async function PerformancePage() {
  const filePath = path.join(process.cwd(), 'data', 'mockDatabase.json');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const data = JSON.parse(fileContents);
  const profile = data.studentProfile;

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Performance</h1>
      <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
        <p className="text-gray-700"><strong>Overall Performance:</strong> <span className="text-orange-600 font-semibold">{profile.overallPerformance}</span></p>
      </div>
    </div>
  );
}
