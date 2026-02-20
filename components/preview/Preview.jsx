import {
  FaGithub,
  FaLinkedin,
  FaTwitter,
  FaFacebook,
  FaInstagram,
  FaYoutube,
  FaExchangeAlt,
  FaExternalLinkAlt,
} from "react-icons/fa";
import { MdEmail, MdLocationOn, MdPhone } from "react-icons/md";
import { CgWebsite } from "react-icons/cg";
import Skills from "./Skills";
import DateRange from "../utility/DateRange";
import ContactInfo from "./ContactInfo";
import Image from "next/image";
import Link from "next/link";
import React, { useContext, useState, useEffect } from "react";
import { ResumeContext } from "../../pages/builder";
import dynamic from "next/dynamic";
import Language from "./Language";
import Certification from "./Certification";
import TemplateTwo from "./TemplateTwo";

const DragDropContext = dynamic(
  () =>
    import("react-beautiful-dnd").then((mod) => {
      return mod.DragDropContext;
    }),
  { ssr: false }
);
const Droppable = dynamic(
  () =>
    import("react-beautiful-dnd").then((mod) => {
      return mod.Droppable;
    }),
  { ssr: false }
);
const Draggable = dynamic(
  () =>
    import("react-beautiful-dnd").then((mod) => {
      return mod.Draggable;
    }),
  { ssr: false }
);

const Preview = () => {
  const { resumeData, setResumeData } = useContext(ResumeContext);
  const [currentTemplate, setCurrentTemplate] = useState("template1");

  // Section order for Template 2
  const defaultSections = [
    "summary",
    "education",
    "projects",
    "experience",
    "skills",
    "softskills",
    "languages",
    "certifications"
  ];
  const [sectionOrder, setSectionOrder] = useState(defaultSections);

  // Section order for Template 1 right column
  const defaultT1RightSections = ["experience", "projects"];
  const [t1RightSectionOrder, setT1RightSectionOrder] = useState(defaultT1RightSections);

  const icons = [
    { name: "github", icon: <FaGithub /> },
    { name: "linkedin", icon: <FaLinkedin /> },
    { name: "twitter", icon: <FaTwitter /> },
    { name: "facebook", icon: <FaFacebook /> },
    { name: "instagram", icon: <FaInstagram /> },
    { name: "youtube", icon: <FaYoutube /> },
    { name: "website", icon: <CgWebsite /> },
  ];

  const onDragEnd = (result) => {
    const { destination, source, type } = result;

    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) return;

    // Section-level reorder for Template 1 right column
    if (source.droppableId === "t1-right-sections") {
      const newOrder = Array.from(t1RightSectionOrder);
      const [removed] = newOrder.splice(source.index, 1);
      newOrder.splice(destination.index, 0, removed);
      setT1RightSectionOrder(newOrder);
      return;
    }

    if (source.droppableId === "work-experience") {
      const newWorkExperience = [...resumeData.workExperience];
      const [removed] = newWorkExperience.splice(source.index, 1);
      newWorkExperience.splice(destination.index, 0, removed);
      setResumeData({ ...resumeData, workExperience: newWorkExperience });
    }

    if (source.droppableId.includes("WORK_EXPERIENCE_KEY_ACHIEVEMENT")) {
      const newWorkExperience = [...resumeData.workExperience];
      const workExperienceIndex = parseInt(source.droppableId.split("-")[1]);
      const keyAchievements =
        newWorkExperience[workExperienceIndex].keyAchievements.split("\n");
      const [removed] = keyAchievements.splice(source.index, 1);
      keyAchievements.splice(destination.index, 0, removed);
      newWorkExperience[workExperienceIndex].keyAchievements =
        keyAchievements.join("\n");
      setResumeData({ ...resumeData, workExperience: newWorkExperience });
    }

    if (source.droppableId === "skills") {
      const newSkills = [...resumeData.skills];
      const [removed] = newSkills.splice(source.index, 1);
      newSkills.splice(destination.index, 0, removed);
      setResumeData({ ...resumeData, skills: newSkills });
    }

    if (source.droppableId === "projects") {
      const newProjects = [...resumeData.projects];
      const [removed] = newProjects.splice(source.index, 1);
      newProjects.splice(destination.index, 0, removed);
      setResumeData({ ...resumeData, projects: newProjects });
    }

    if (source.droppableId.includes("PROJECTS_KEY_ACHIEVEMENT")) {
      const newProjects = [...resumeData.projects];
      const projectIndex = parseInt(source.droppableId.split("-")[1]);
      const keyAchievements =
        newProjects[projectIndex].keyAchievements.split("\n");
      const [removed] = keyAchievements.splice(source.index, 1);
      keyAchievements.splice(destination.index, 0, removed);
      newProjects[projectIndex].keyAchievements = keyAchievements.join("\n");
      setResumeData({ ...resumeData, projects: newProjects });
    }
  };

  const handleTemplateTwoDragEnd = (result) => {
    const { destination, source } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    // Section-level reorder
    if (source.droppableId === "sections") {
      const items = Array.from(sectionOrder);
      const [reorderedItem] = items.splice(source.index, 1);
      items.splice(destination.index, 0, reorderedItem);
      setSectionOrder(items);
      localStorage.setItem('sectionOrder', JSON.stringify(items));
      return;
    }

    // Work experience entries
    if (source.droppableId === "work-experience") {
      const newWorkExperience = [...resumeData.workExperience];
      const [removed] = newWorkExperience.splice(source.index, 1);
      newWorkExperience.splice(destination.index, 0, removed);
      setResumeData({ ...resumeData, workExperience: newWorkExperience });
      return;
    }

    // Project entries
    if (source.droppableId === "projects") {
      const newProjects = [...resumeData.projects];
      const [removed] = newProjects.splice(source.index, 1);
      newProjects.splice(destination.index, 0, removed);
      setResumeData({ ...resumeData, projects: newProjects });
      return;
    }
  };

  useEffect(() => {
    const savedOrder = localStorage.getItem('sectionOrder');
    if (savedOrder) {
      // Ensure certifications is included in the saved order
      const parsedOrder = JSON.parse(savedOrder);
      if (!parsedOrder.includes("certifications")) {
        parsedOrder.push("certifications");
      }
      setSectionOrder(parsedOrder);
    } else {
      // If no saved order, use default sections
      localStorage.setItem('sectionOrder', JSON.stringify(defaultSections));
    }
  }, []);

  return (
    <div className="md:max-w-[60%] sticky top-0 preview rm-padding-print p-6 md:overflow-y-scroll md:h-screen">
      <button
        onClick={() => setCurrentTemplate(currentTemplate === "template1" ? "template2" : "template1")}
        className="absolute top-4 right-4 z-50 p-2 bg-zinc-800 text-white rounded hover:bg-zinc-700 transition-colors exclude-print"
        title="Switch Template"
      >
        <FaExchangeAlt />
      </button>
      <A4PageWrapper>
        <DragDropContext onDragEnd={currentTemplate === "template1" ? onDragEnd : handleTemplateTwoDragEnd}>
          {currentTemplate === "template1" ? (
            <div className="w-full h-full bg-white p-4">
              <div className="text-center mb-2">
                <h1 className="name">{resumeData.name}</h1>
                <p className="profession">{resumeData.position}</p>
                <ContactInfo
                  mainclass="flex flex-row gap-1 contact justify-center"
                  linkclass="inline-flex items-center gap-1"
                  teldata={resumeData.contactInformation}
                  emaildata={resumeData.email}
                  addressdata={resumeData.address}
                  telicon={<MdPhone />}
                  emailicon={<MdEmail />}
                  addressicon={<MdLocationOn />}
                />
                <div className="flex justify-center items-center gap-2 mt-1 text-sm">
                  {resumeData.socialMedia.map((socialMedia, index) => {
                    return (
                      <a
                        href={`http://${socialMedia.link}`}
                        aria-label={socialMedia.socialMedia}
                        key={index}
                        title={socialMedia.socialMedia}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-[2px] text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        {icons.map((icon, index) => {
                          if (icon.name === socialMedia.socialMedia.toLowerCase()) {
                            return <span key={index} className="text-sm">{icon.icon}</span>;
                          }
                        })}
                        {socialMedia.link.split('/').pop()}
                      </a>
                    );
                  })}
                </div>
              </div>
              <hr className="border-dashed my-2" />
              {/* two column start */}
              <div className="grid grid-cols-3 gap-6">
                <div className="col-span-1 space-y-2">
                  {resumeData.summary.length > 0 && (
                    <div className="mb-1">
                      <h2 className="section-title mb-1 border-b-2 border-gray-300">
                        Summary
                      </h2>
                      <p className="content break-words">{resumeData.summary}</p>
                    </div>
                  )}
                  <div>
                    {resumeData.education.length > 0 && (
                      <div className="mb-1">
                        <h2 className="section-title mb-1 border-b-2 border-gray-300">
                          Education
                        </h2>
                        {resumeData.education.map((item, index) => (
                          <div key={index} className="mb-1">
                            <p className="content i-bold">{item.degree}</p>
                            <p className="content">{item.school}</p>
                            <DateRange
                              startYear={item.startYear}
                              endYear={item.endYear}
                              id={`education-start-end-date`}
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <Droppable droppableId="skills" type="SKILLS">
                    {(provided) => (
                      <div {...provided.droppableProps} ref={provided.innerRef}>
                        {resumeData.skills.map((skill, index) => (
                          <Draggable
                            key={`SKILLS-${index}`}
                            draggableId={`SKILLS-${index}`}
                            index={index}
                          >
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`mb-1 ${snapshot.isDragging &&
                                  "outline-dashed outline-2 outline-gray-400 bg-white"
                                  }`}
                              >
                                <Skills title={skill.title} skills={skill.skills} />
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                  <Language title="Languages" languages={resumeData.languages} />
                  <Certification
                    title="Certifications"
                    certifications={resumeData.certifications}
                  />
                </div>
                <div className="col-span-2 space-y-2">
                  <Droppable droppableId="t1-right-sections" type="T1_SECTION">
                    {(sectionProvided) => (
                      <div
                        {...sectionProvided.droppableProps}
                        ref={sectionProvided.innerRef}
                        className="space-y-2"
                      >
                        {t1RightSectionOrder.map((sectionKey, sectionIdx) => (
                          <Draggable
                            key={sectionKey}
                            draggableId={`T1_SECTION-${sectionKey}`}
                            index={sectionIdx}
                          >
                            {(secProvided, secSnapshot) => (
                              <div
                                ref={secProvided.innerRef}
                                {...secProvided.draggableProps}
                                className={`${secSnapshot.isDragging ? "outline-dashed outline-2 outline-blue-400 bg-white" : ""}`}
                              >
                                {sectionKey === "experience" && resumeData.workExperience.length > 0 && (
                                  <Droppable droppableId="work-experience" type="WORK_EXPERIENCE">
                                    {(provided) => (
                                      <div {...provided.droppableProps} ref={provided.innerRef}>
                                        <h2
                                          className="section-title mb-1 border-b-2 border-gray-300 editable flex items-center gap-1"
                                          contentEditable
                                          suppressContentEditableWarning
                                        >
                                          <span
                                            {...secProvided.dragHandleProps}
                                            className="cursor-grab text-gray-400 exclude-print select-none"
                                            title="Drag to reorder section"
                                          >≡</span>
                                          Work Experience
                                        </h2>
                                        {resumeData.workExperience.map((item, index) => (
                                          <Draggable
                                            key={`${item.company}-${index}`}
                                            draggableId={`WORK_EXPERIENCE-${index}`}
                                            index={index}
                                          >
                                            {(provided, snapshot) => (
                                              <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                className={`mb-1 ${snapshot.isDragging &&
                                                  "outline-dashed outline-2 outline-gray-400 bg-white"
                                                  }`}
                                              >
                                                <p className="content i-bold">{item.company}</p>
                                                <p className="content">{item.position}</p>
                                                <DateRange
                                                  startYear={item.startYear}
                                                  endYear={item.endYear}
                                                  id={`work-experience-start-end-date`}
                                                />
                                                <p className="content hyphens-auto">{item.description}</p>
                                                <Droppable
                                                  droppableId={`WORK_EXPERIENCE_KEY_ACHIEVEMENT-${index}`}
                                                  type="WORK_EXPERIENCE_KEY_ACHIEVEMENT"
                                                >
                                                  {(provided) => (
                                                    <ul
                                                      className="list-disc ul-padding content"
                                                      {...provided.droppableProps}
                                                      ref={provided.innerRef}
                                                    >
                                                      {typeof item.keyAchievements === "string" &&
                                                        item.keyAchievements
                                                          .split("\n")
                                                          .map((achievement, subIndex) => (
                                                            <Draggable
                                                              key={`${item.company}-${index}-${subIndex}`}
                                                              draggableId={`WORK_EXPERIENCE_KEY_ACHIEVEMENT-${index}-${subIndex}`}
                                                              index={subIndex}
                                                            >
                                                              {(provided, snapshot) => (
                                                                <li
                                                                  ref={provided.innerRef}
                                                                  {...provided.draggableProps}
                                                                  {...provided.dragHandleProps}
                                                                  className={`hover:outline-dashed hover:outline-2 hover:outline-gray-400 ${snapshot.isDragging &&
                                                                    "outline-dashed outline-2 outline-gray-400 bg-white"
                                                                    }`}
                                                                >
                                                                  {achievement}
                                                                </li>
                                                              )}
                                                            </Draggable>
                                                          ))}
                                                      {provided.placeholder}
                                                    </ul>
                                                  )}
                                                </Droppable>
                                              </div>
                                            )}
                                          </Draggable>
                                        ))}
                                        {provided.placeholder}
                                      </div>
                                    )}
                                  </Droppable>
                                )}

                                {sectionKey === "projects" && resumeData.projects.length > 0 && (
                                  <Droppable droppableId="projects" type="PROJECTS">
                                    {(provided) => (
                                      <div {...provided.droppableProps} ref={provided.innerRef}>
                                        <h2
                                          className="section-title mb-1 border-b-2 border-gray-300 editable flex items-center gap-1"
                                          contentEditable
                                          suppressContentEditableWarning
                                        >
                                          <span
                                            {...secProvided.dragHandleProps}
                                            className="cursor-grab text-gray-400 exclude-print select-none"
                                            title="Drag to reorder section"
                                          >≡</span>
                                          Projects
                                        </h2>
                                        {resumeData.projects.map((item, index) => (
                                          <Draggable
                                            key={`${item.title || item.name}-${index}`}
                                            draggableId={`PROJECTS-${index}`}
                                            index={index}
                                          >
                                            {(provided, snapshot) => (
                                              <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                className={`mb-1 ${snapshot.isDragging &&
                                                  "outline-dashed outline-2 outline-gray-400 bg-white"
                                                  }`}
                                              >
                                                <div className="flex items-center gap-2">
                                                  <p className="content i-bold">{item.title || item.name}</p>
                                                  {item.link && (
                                                    <Link
                                                      href={item.link}
                                                      target="_blank"
                                                      rel="noopener noreferrer"
                                                      className="text-blue-600 hover:text-blue-800"
                                                      title={item.link}
                                                    >
                                                      <FaExternalLinkAlt size={12} />
                                                    </Link>
                                                  )}
                                                </div>
                                                <DateRange
                                                  startYear={item.startYear}
                                                  endYear={item.endYear}
                                                  id={`projects-start-end-date`}
                                                />
                                                <p className="content">{item.description}</p>
                                                <Droppable
                                                  droppableId={`PROJECTS_KEY_ACHIEVEMENT-${index}`}
                                                  type="PROJECTS_KEY_ACHIEVEMENT"
                                                >
                                                  {(provided) => (
                                                    <ul
                                                      className="list-disc ul-padding content"
                                                      {...provided.droppableProps}
                                                      ref={provided.innerRef}
                                                    >
                                                      {typeof item.keyAchievements === "string" &&
                                                        item.keyAchievements
                                                          .split("\n")
                                                          .map((achievement, subIndex) => (
                                                            <Draggable
                                                              key={`${item.title || item.name}-${index}-${subIndex}`}
                                                              draggableId={`PROJECTS_KEY_ACHIEVEMENT-${index}-${subIndex}`}
                                                              index={subIndex}
                                                            >
                                                              {(provided, snapshot) => (
                                                                <li
                                                                  ref={provided.innerRef}
                                                                  {...provided.draggableProps}
                                                                  {...provided.dragHandleProps}
                                                                  className={`hover:outline-dashed hover:outline-2 hover:outline-gray-400 ${snapshot.isDragging &&
                                                                    "outline-dashed outline-2 outline-gray-400 bg-white"
                                                                    }`}
                                                                >
                                                                  {achievement}
                                                                </li>
                                                              )}
                                                            </Draggable>
                                                          ))}
                                                      {provided.placeholder}
                                                    </ul>
                                                  )}
                                                </Droppable>
                                              </div>
                                            )}
                                          </Draggable>
                                        ))}
                                        {provided.placeholder}
                                      </div>
                                    )}
                                  </Droppable>
                                )}
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {sectionProvided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              </div>
            </div>
          ) : (
            <TemplateTwo
              namedata={resumeData.name}
              positiondata={resumeData.position}
              contactdata={resumeData.contactInformation}
              emaildata={resumeData.email}
              addressdata={resumeData.address}
              telicon={<MdPhone />}
              emailicon={<MdEmail />}
              addressicon={<MdLocationOn />}
              summarydata={resumeData.summary}
              educationdata={resumeData.education}
              projectsdata={resumeData.projects}
              workExperiencedata={resumeData.workExperience}
              skillsdata={resumeData.skills}
              languagesdata={resumeData.languages}
              certificationsdata={resumeData.certifications}
              sectionOrder={sectionOrder}
              onDragEnd={handleTemplateTwoDragEnd}
              resumeData={resumeData}
              setResumeData={setResumeData}
            />
          )}
        </DragDropContext>
      </A4PageWrapper>
    </div>
  );
};

const A4PageWrapper = ({ children }) => {

  const alertA4Size = () => {
    const preview = document.querySelector(".preview");
    const previewHeight = preview.offsetHeight;
    if (previewHeight > 1122) {
      alert("A4 size exceeded");
    }
  };

  return <div className="w-8.5in" onLoad={alertA4Size}>{children}</div>;
};

export default Preview;