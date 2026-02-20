import React from "react";
import ContactInfo from "./ContactInfo";
import Link from "next/link";
import { FaExternalLinkAlt, FaGithub, FaLinkedin, FaTwitter, FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa";
import { CgWebsite } from "react-icons/cg";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import Certification from "./Certification";
import { parseFormatting } from "../../utils/parseFormatting";

const TemplateTwo = ({
  namedata,
  positiondata,
  contactdata,
  emaildata,
  addressdata,
  telicon,
  emailicon,
  addressicon,
  summarydata,
  educationdata,
  projectsdata,
  workExperiencedata,
  skillsdata,
  languagesdata,
  certificationsdata,
  sectionOrder,
  onDragEnd,
  resumeData,
  setResumeData
}) => {

  const sections = [
    { id: "summary", title: "Summary", content: summarydata },
    { id: "education", title: "Education", content: educationdata },
    { id: "projects", title: "Projects", content: projectsdata },
    { id: "experience", title: "Work Experience", content: workExperiencedata },
    { id: "skills", title: "Technical Skills", content: skillsdata },
    { id: "softskills", title: "Soft Skills", content: skillsdata.find(skill => skill.title === "Soft Skills")?.skills || [] },
    { id: "languages", title: "Languages", content: languagesdata },
    { id: "certifications", title: "Certifications", content: certificationsdata }
  ];

  const orderedSections = sectionOrder
    .map(id => sections.find(section => section.id === id))
    .filter(section => section !== undefined);

  const renderSection = (section) => {
    switch (section.id) {
      case "certifications":
        return (
          <div>
            <h2 className="section-title border-b-2 border-gray-300 mb-1">Certifications</h2>
            <ul className="list-disc pl-4 content">
              {certificationsdata && certificationsdata.map((cert, i) => (
                <li key={i} className="content">
                  {cert.name}
                  {cert.issuer && (
                    <span className="text-gray-600"> - {cert.issuer}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        );
      case "summary":
        return (
          <div>
            <h2 className="section-title border-b-2 border-gray-300 mb-1">Summary</h2>
            <p className="content" dangerouslySetInnerHTML={{ __html: parseFormatting(summarydata) }} />
          </div>
        );
      case "education":
        return (
          <div>
            <h2 className="section-title border-b-2 border-gray-300 mb-1">Education</h2>
            {educationdata.map((edu, idx) => (
              <div key={idx} className="mb-1">
                <p className="content font-semibold">{edu.school}</p>
                <p className="content">{edu.degree}</p>
                <p className="sub-content font-medium text-gray-600">
                  {new Date(edu.startYear).getFullYear()} - {new Date(edu.endYear).getFullYear()}
                </p>
              </div>
            ))}
          </div>
        );
      case "projects":
        return (
          <div>
            <h2 className="section-title border-b-2 border-gray-300 mb-1">Projects</h2>
            <Droppable droppableId="projects" type="PROJECTS">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  {projectsdata.map((project, idx) => (
                    <Draggable key={project.name + idx} draggableId={`project-${idx}`} index={idx}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`mb-2 ${snapshot.isDragging ? "bg-gray-50" : ""}`}
                        >
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <p className="content i-bold">{project.name}</p>
                              {project.link && (
                                <Link
                                  href={project.link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:text-blue-800"
                                  title={project.link}
                                >
                                  <FaExternalLinkAlt size={12} />
                                </Link>
                              )}
                            </div>
                            <p className="sub-content font-medium text-gray-600">
                              {new Date(project.startYear).getFullYear()} - {new Date(project.endYear).getFullYear()}
                            </p>
                          </div>
                          <p className="content" dangerouslySetInnerHTML={{ __html: parseFormatting(project.description) }} />
                          {project.keyAchievements && (
                            <ul className="list-disc pl-4 content">
                              {project.keyAchievements.split('\n').map((achievement, i) => (
                                <li key={i} className="content" dangerouslySetInnerHTML={{ __html: parseFormatting(achievement) }} />
                              ))}
                            </ul>
                          )}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        );
      case "experience":
        return (
          <div>
            <h2 className="section-title border-b-2 border-gray-300 mb-1">Work Experience</h2>
            <Droppable droppableId="work-experience" type="WORK_EXPERIENCE">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  {workExperiencedata.map((work, idx) => (
                    <Draggable key={work.company + idx} draggableId={`work-${idx}`} index={idx}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`mb-2 ${snapshot.isDragging ? "bg-gray-50" : ""}`}
                        >
                          <div className="flex justify-between items-center">
                            <p className="content">
                              <span className="font-bold">{work.company}</span>
                              <span className="mx-1">-</span>
                              <span>{work.position}</span>
                            </p>
                            <p className="sub-content font-medium text-gray-600">
                              {new Date(work.startYear).getFullYear()} - {new Date(work.endYear).getFullYear()}
                            </p>
                          </div>
                          <p className="content" dangerouslySetInnerHTML={{ __html: parseFormatting(work.description) }} />
                          {work.keyAchievements && (
                            <ul className="list-disc pl-4 content">
                              {work.keyAchievements.split('\n').map((ach, i) => (
                                <li key={i} className="content" dangerouslySetInnerHTML={{ __html: parseFormatting(ach) }} />
                              ))}
                            </ul>
                          )}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        );
      case "skills":
        return (
          <div>
            <h2 className="section-title border-b-2 border-gray-300 mb-1">Technical Skills</h2>
            <p className="content">
              {skillsdata.find(skill => skill.title === "Technical Skills")?.skills.join(", ")}
            </p>
          </div>
        );
      case "softskills":
        return (
          <div>
            <h2 className="section-title border-b-2 border-gray-300 mb-1">Soft Skills</h2>
            <p className="content">
              {section.content.join(", ")}
            </p>
          </div>
        );
      case "languages":
        return (
          <div>
            <h2 className="section-title border-b-2 border-gray-300 mb-1">Languages</h2>
            <p className="content">
              {section.content.join(", ")}
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  const icons = [
    { name: "github", icon: <FaGithub /> },
    { name: "linkedin", icon: <FaLinkedin /> },
    { name: "twitter", icon: <FaTwitter /> },
    { name: "facebook", icon: <FaFacebook /> },
    { name: "instagram", icon: <FaInstagram /> },
    { name: "youtube", icon: <FaYoutube /> },
    { name: "website", icon: <CgWebsite /> },
  ];

  // Function to extract username from URL
  const getUsername = (url) => {
    return url.split('/').pop();
  };


  return (
    <div className="w-full h-full bg-white p-4" style={{ fontFamily: resumeData?.fontFamily || "Georgia, serif" }}>
      {/* Header Section */}
      <div className="text-center mb-2">
        <h1 className="name">{namedata}</h1>
        <p className="profession">{positiondata}</p>
        <ContactInfo
          mainclass="flex flex-row gap-1 contact justify-center"
          linkclass="inline-flex items-center gap-1"
          teldata={contactdata}
          emaildata={emaildata}
          addressdata={addressdata}
          telicon={telicon}
          emailicon={emailicon}
          addressicon={addressicon}
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
                {getUsername(socialMedia.link)}
              </a>
            );
          })}
        </div>
      </div>

      {/* Draggable Sections */}
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="sections" type="SECTION">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {orderedSections.map((section, index) => (
                <Draggable key={section.id} draggableId={section.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={`mb-2 ${snapshot.isDragging ? "outline-dashed outline-2 outline-blue-300 bg-gray-50" : ""}`}
                    >
                      <div {...provided.dragHandleProps} className="cursor-grab exclude-print select-none text-gray-300 hover:text-gray-500 float-right text-lg leading-none" title="Drag to reorder section">
                        &#8801;
                      </div>
                      {renderSection(section)}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default TemplateTwo;