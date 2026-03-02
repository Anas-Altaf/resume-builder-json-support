const DefaultResumeData = {
  name: "Anas Altaf",
  position: "DevOps Engineer | AWS",
  fontFamily: "Georgia, serif",
  spacing: {
    sectionGap: 4,     // px between major sections
    entryGap: 2,       // px between entries within a section
    lineHeight: 1.3,   // unitless line-height for body text
    columnGap: 16,     // px between columns (Template 1)
  },
  contactInformation: "+92-310-4889407",
  email: "me@anasaltaf.dev",
  address: "Faisalabad, Pakistan",
  profilePicture: "",
  socialMedia: [
    {
      socialMedia: "Github",
      link: "github.com/Anas-Altaf",
    },
    {
      socialMedia: "LinkedIn",
      link: "linkedin.com/in/anasaltaf",
    },
    {
      socialMedia: "Website",
      link: "anasaltaf.dev",
    },
  ],
  summary: "Results-oriented DevOps Engineer with one year of freelance experience in designing, implementing, and managing scalable cloud infrastructure on AWS. Skilled in CI/CD automation, containerization, infrastructure as code, and monitoring. Passionate about optimizing deployment workflows, improving system reliability, and ensuring high availability in production environments.",
  education: [
    {
      school: "FAST National University of Computer and Emerging Sciences",
      degree: "Bachelors in Software Engineering",
      startYear: "Aug 2022",
      endYear: "Jun 2026",
    },
  ],
  workExperience: [
    {
      company: "TechXpert",
      position: "DevOps Engineer",
      description: "Designed and maintained AWS-based cloud infrastructure for multiple client projects. Automated CI/CD pipelines and managed containerized deployments using Docker and Kubernetes. Implemented monitoring and logging solutions to enhance system reliability.",
      keyAchievements: "Automated deployment pipelines reducing release time by 60%\nImplemented Infrastructure as Code using Terraform for consistent environment provisioning\nImproved system uptime to 99.9% through proactive monitoring and alerting",
      startYear: "Oct 2023",
      endYear: "Mar 2024",
    },
    {
      company: "Techbug",
      position: "DevOps Intern",
      description: "Assisted in managing AWS infrastructure, configuring CI/CD workflows, and supporting containerized application deployments. Worked closely with development teams to streamline build and release processes.",
      keyAchievements: "Configured Jenkins pipelines for automated testing and deployment\nContainerized applications using Docker for consistent development environments\nMonitored cloud resources and optimized cost usage on AWS",
      startYear: "Jun 2023",
      endYear: "Sep 2023",
    },
    {
      company: "TechXpert",
      position: "Mobile App Developer | React Native",
      description: "",
      keyAchievements: "Translated Figma mockups into responsive React Native screens, achieving pixel-perfect fidelity for client demos.\nMet 100% of story points on time through daily Agile participation and sprint planning.\nIntegrated Firebase, Maps, and Camera APIs to deliver complex features that increased beta user engagement.",
      startYear: "",
      endYear: "",
    },
  ],
  projects: [
    {
      title: "AWS Scalable Web Infrastructure",
      description: "Designed and deployed a highly available web application architecture on AWS using EC2, ALB, Auto Scaling Groups, RDS, and S3. Implemented Infrastructure as Code using Terraform and automated CI/CD with Jenkins.",
      keyAchievements: "Configured Auto Scaling and Load Balancing for high availability\nImplemented Terraform scripts for complete infrastructure provisioning\nIntegrated CloudWatch monitoring with custom alerts",
      startYear: "Feb 2024",
      endYear: "Mar 2024",
      link: "https://github.com/HOTHEAD01TH/aws-scalable-infra",
    },
    {
      title: "Kubernetes CI/CD Pipeline",
      description: "Built an end-to-end CI/CD pipeline deploying containerized applications to a Kubernetes cluster on AWS EKS. Integrated GitHub Actions with Docker image builds and automated deployments.",
      keyAchievements: "Implemented blue-green deployment strategy on Kubernetes\nSecured container images using best practices and vulnerability scanning\nReduced deployment failures by 40% through automated testing stages",
      startYear: "Mar 2024",
      endYear: "Apr 2024",
      link: "https://github.com/HOTHEAD01TH/k8s-cicd-pipeline",
    },
  ],
  skills: [
    {
      title: "Technical Skills",
      skills: [
        "AWS (EC2, S3, RDS, IAM, VPC, CloudWatch, EKS, ECS, Lambda)",
        "Docker",
        "Kubernetes",
        "Terraform",
        "Jenkins",
        "GitHub Actions",
        "Linux",
        "Bash Scripting",
        "Python",
        "Ansible",
        "Prometheus",
        "Grafana",
        "NGINX",
        "Apache",
        "Git",
        "CI/CD",
        "Infrastructure as Code",
        "Microservices Architecture",
      ],
    },
    {
      title: "Soft Skills",
      skills: [
        "Collaboration",
        "Problem-solving",
        "Communication",
        "Time management",
        "Analytical thinking",
      ],
    },
    {
      title: "Additional Skills",
      skills: [
        "Cloud Security Best Practices",
        "Cost Optimization",
        "System Monitoring",
        "High Availability Architecture",
      ],
    },
  ],
  languages: ["English", "Hindi", "Urdu", "Kashmiri"],
  certifications: [
    {
      name: "AWS Certified Solutions Architect – Associate",
      issuer: "Amazon Web Services",
    },
    {
      name: "AWS Certified DevOps Engineer – Professional",
      issuer: "Amazon Web Services",
    },
    {
      name: "Docker and Kubernetes: The Complete Guide",
      issuer: "Udemy",
    },
    {
      name: "Terraform for AWS",
      issuer: "HashiCorp",
    },
  ],
};

export default DefaultResumeData;
