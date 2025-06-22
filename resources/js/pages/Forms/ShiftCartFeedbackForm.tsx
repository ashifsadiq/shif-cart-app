import React, { useState } from 'react';

type FeedbackData = {
  name: string;
  date: string;
  device: string;
  performance: {
    loadingSpeed: number;
    navigation: number;
    responsiveness: number;
    stability: number;
  };
  experience: {
    ui: number;
    clarity: number;
    design: number;
  };
  strengths: string;
  improvements: string;
  bugs: string;
  enhancements: string;
  recommend: string;
  likelihood: number;
};

const ShiftCartFeedbackForm: React.FC = () => {
  const [formData, setFormData] = useState<FeedbackData>({
    name: '',
    date: '',
    device: '',
    performance: {
      loadingSpeed: 3,
      navigation: 3,
      responsiveness: 3,
      stability: 3,
    },
    experience: {
      ui: 3,
      clarity: 3,
      design: 3,
    },
    strengths: '',
    improvements: '',
    bugs: '',
    enhancements: '',
    recommend: '',
    likelihood: 5,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name.includes('performance.') || name.includes('experience.')) {
      const [section, key] = name.split('.');
      setFormData((prev) => ({
        ...prev,
        [section]: {
          ...prev[section as keyof typeof prev],
          [key]: Number(value),
        },
      }));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitted Feedback:', formData);
    alert('Thank you for your feedback!');
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-3xl mx-auto p-6 bg-white rounded-2xl shadow-lg space-y-6"
    >
      <h2 className="text-2xl font-bold text-gray-800">📝 Shift Cart Feedback Form</h2>

      {/* User Info */}
      <div className="space-y-4">
        <div>
          <label className="block font-medium text-gray-700">Tester Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="mt-1 w-full border border-gray-300 rounded-lg p-2"
            required
          />
        </div>

        <div>
          <label className="block font-medium text-gray-700">Date of Testing</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="mt-1 w-full border border-gray-300 rounded-lg p-2"
            required
          />
        </div>

        <div>
          <label className="block font-medium text-gray-700">Testing Device & OS</label>
          <input
            type="text"
            name="device"
            value={formData.device}
            onChange={handleChange}
            className="mt-1 w-full border border-gray-300 rounded-lg p-2"
            required
          />
        </div>
      </div>

      {/* Performance Section */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800">📱 App Performance</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
          {Object.entries(formData.performance).map(([key, val]) => (
            <div key={key}>
              <label className="block text-gray-700 capitalize">
                {key.replace(/([A-Z])/g, ' $1')}
              </label>
              <input
                type="number"
                min={1}
                max={5}
                name={`performance.${key}`}
                value={val}
                onChange={handleChange}
                className="mt-1 w-full border border-gray-300 rounded-lg p-2"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Experience Section */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800">🎨 User Experience</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
          {Object.entries(formData.experience).map(([key, val]) => (
            <div key={key}>
              <label className="block text-gray-700 capitalize">
                {key.replace(/([A-Z])/g, ' $1')}
              </label>
              <input
                type="number"
                min={1}
                max={5}
                name={`experience.${key}`}
                value={val}
                onChange={handleChange}
                className="mt-1 w-full border border-gray-300 rounded-lg p-2"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Text Feedback */}
      {[
        ['strengths', 'Strengths Observed'],
        ['improvements', 'Areas Needing Improvement'],
        ['bugs', 'Bug Reports (if any)'],
        ['enhancements', 'Suggested Enhancements'],
      ].map(([key, label]) => (
        <div key={key}>
          <label className="block font-medium text-gray-700">{label}</label>
          <textarea
            name={key}
            value={formData[key as keyof FeedbackData] as string}
            onChange={handleChange}
            rows={3}
            className="mt-1 w-full border border-gray-300 rounded-lg p-2"
          />
        </div>
      ))}

      {/* Final Recommendation */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block font-medium text-gray-700">Would you recommend Shift Cart?</label>
          <select
            name="recommend"
            value={formData.recommend}
            onChange={handleChange}
            className="mt-1 w-full border border-gray-300 rounded-lg p-2"
            required
          >
            <option value="">--Select--</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>

        <div>
          <label className="block font-medium text-gray-700">Likelihood to Use Again (1 - 10)</label>
          <input
            type="number"
            name="likelihood"
            min={1}
            max={10}
            value={formData.likelihood}
            onChange={handleChange}
            className="mt-1 w-full border border-gray-300 rounded-lg p-2"
            required
          />
        </div>
      </div>

      <button
        type="submit"
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-xl transition duration-200"
      >
        Submit Feedback
      </button>
    </form>
  );
};

export default ShiftCartFeedbackForm;
