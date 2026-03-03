import FormButton from "./FormButton";
import React, { useContext } from "react";
import { ResumeContext } from "../../pages/builder";
import RichInput from "./RichInput";

const Education = () => {
  const { resumeData, setResumeData } = useContext(ResumeContext);

  const handleEducation = (e, index) => {
    const newEducation = [...resumeData.education];
    newEducation[index][e.target.name] = e.target.value;
    setResumeData({ ...resumeData, education: newEducation });
  };

  const addEducation = () => {
    setResumeData({
      ...resumeData,
      education: [
        ...resumeData.education,
        { school: "", degree: "", startYear: "", endYear: "" },
      ],
    });
  };

  const removeEducation = (index) => {
    const newEducation = [...resumeData.education];
    newEducation.splice(index, 1);
    setResumeData({ ...resumeData, education: newEducation });
  };

  return (
    <div className="flex-col-gap-2">
      <h2 className="input-title">Education</h2>
      {resumeData.education.map((education, index) => (
        <div key={index} className="f-col">
          <RichInput
            placeholder="School"
            name="school"
            className="w-full other-input"
            value={education.school}
            onChange={(e) => handleEducation(e, index)} />
          <RichInput
            placeholder="Degree"
            name="degree"
            className="w-full other-input"
            value={education.degree}
            onChange={(e) => handleEducation(e, index)} />
          <div className="flex-wrap-gap-2">
            <input
              type="text"
              placeholder="e.g. Aug 2022"
              name="startYear"
              className="other-input"
              value={education.startYear}
              onChange={(e) => handleEducation(e, index)} />
            <input
              type="text"
              placeholder="e.g. Jun 2026"
              name="endYear"
              className="other-input"
              value={education.endYear}
              onChange={(e) => handleEducation(e, index)} />
          </div>
        </div>
      ))}
      <FormButton size={resumeData.education.length} add={addEducation} remove={removeEducation} />
    </div>
  )
}

export default Education;