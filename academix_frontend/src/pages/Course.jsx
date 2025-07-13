import { useNavigate } from 'react-router-dom';

export default function Course() {
  const course = JSON.parse(localStorage.getItem('course'));
  const navigate = useNavigate();

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">{course.title}</h2>
      {course.modules.map((mod, i) => (
        <div key={mod.id} className="mb-4">
          <h3 className="font-bold">{mod.title}</h3>
          <ul className="pl-6 list-disc">
            {mod.topics.map((t) => (
              <li
                key={t.id}
                className="text-blue-600 cursor-pointer hover:underline"
                onClick={() => navigate(`/topic/${t.id}`)}
              >
                {t.title}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}