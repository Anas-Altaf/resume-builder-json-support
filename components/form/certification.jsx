import React, { useContext } from "react";
import { ResumeContext } from "../../pages/builder";
import FormButton from "./FormButton";
import RichInput from "./RichInput";

const Certification = () => {
  const { resumeData, setResumeData } = useContext(ResumeContext);
  const skillType = "certifications";
  const title = "Certifications";

  const handleCertification = (e, index) => {
    const newCertifications = [...resumeData[skillType]];
    newCertifications[index] = {
      ...newCertifications[index],
      [e.target.name]: e.target.value
    };
    setResumeData({ ...resumeData, [skillType]: newCertifications });
  };

  const addCertification = () => {
    setResumeData({
      ...resumeData,
      [skillType]: [
        ...resumeData[skillType],
        { name: "", issuer: "" }
      ]
    });
  };

  const removeCertification = () => {
    const newCertifications = [...resumeData[skillType]];
    newCertifications.pop();
    setResumeData({ ...resumeData, [skillType]: newCertifications });
  };

  return (
    <div className="flex-col-gap-2">
      <h2 className="input-title">{title}</h2>
      {resumeData[skillType].map((certification, index) => (
        <div key={index} className="f-col">
          <RichInput
            placeholder="Certification Name"
            name="name"
            className="w-full other-input"
            value={certification.name}
            onChange={(e) => handleCertification(e, index)}
          />
          <RichInput
            placeholder="Issuer"
            name="issuer"
            className="w-full other-input"
            value={certification.issuer}
            onChange={(e) => handleCertification(e, index)}
          />
        </div>
      ))}
      <FormButton
        size={resumeData[skillType].length}
        add={addCertification}
        remove={removeCertification}
      />
    </div>
  );
};

export default Certification;