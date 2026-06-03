module.exports.formatDate = (dateString) => {
    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true // Use 12-hour format
    };
    const date = new Date(dateString);
    return date.toLocaleString('en-US', options);
};

const Education = require("../models/cv/education");
const Experience = require("../models/cv/experience");
const Project = require("../models/cv/project");
const Certification = require("../models/cv/certification");
const Language = require("../models/cv/language");
const Skill = require("../models/cv/skill");
const User = require("../models/user");
const { ObjectId } = require("mongodb");

module.exports.getUserResumeData = async (userId) => {
    if (!ObjectId.isValid(userId)) {
        console.log("ID is not valid");
    }
    try {
        console.log("*******--------**********")
        const user = await User.findById(userId).populate('cv')
        console.log("user", user)

        const education = await Education.find(user.cv);
        console.log("education:", education);

        const experience = await Experience.find(user.cv);
        console.log("experience:", experience);

        const project = await Project.find(user.cv);
        console.log("project:", project);

        const certification = await Certification.find(user.cv);
        console.log("certification:", certification);

        const language = await Language.find(user.cv);
        console.log("language:", language);

        const skill = await Skill.find(user.cv);
        console.log("skill:", skill);
        resumeData = {
            user: user,
            education: education,
            experience: experience,
            project: project,
            certification: certification,
            language: language,
            skill: skill
        }
        return resumeData;
    } catch (error) {
        console.log("ERROR", error)
    }
}
