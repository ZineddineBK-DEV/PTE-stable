const { ObjectId } = require("mongodb");
const User = require("../models/user");
const Cv = require("../models/cv");
const Education = require("../models/cv/education");
const Experience = require("../models/cv/experience");
const Certification = require("../models/cv/certification");
const Skill = require("../models/cv/skill");
const Project = require("../models/cv/project");
const Language = require("../models/cv/language");

module.exports.addEducation = async function (req, res, next) {
  try {
    const edu = new Education({
      establishment: req.body.establishment,
      section: req.body.section,
      diploma: req.body.diploma,
      year_start: req.body.year_start,
      year_end: req.body.year_end,
      present: req.body.present || false,
      cv: req.body.cv
    })
    const e = await edu.save()
    res.status(200).json(e);
  }
  catch (err) {
    res.status(500).json(err)
  }
};
module.exports.addExperience = async function (req, res, next) {
  try {
    const exp = new Experience({
      company: req.body.company,
      job: req.body.job,
      start: req.body.start,
      end: req.body.end,
      present: req.body.present || false,
      task_description: req.body.task_description,
      cv: req.body.cv
    })

    const e = await exp.save()
    res.status(200).json(e);
  }
  catch (err) {
    res.status(500).json(err)
  }
};
module.exports.addCertif = async function (req, res, next) {
  // const body = { ...req.body };
  if (req.file) {
    req.body.cert_file = req.file.filename;
  }
  try {
    const certif = new Certification({
      domaine: req.body.domaine,
      date: req.body.date,
      credential: req.body.credential,
      cert_file: req.body.cert_file,
      cv: req.body.cv
    })
    const cert = await certif.save()
    res.status(200).json(cert);
  }
  catch (err) {
    res.status(500).json(err)
  }
};
module.exports.addSkill = async function (req, res, next) {

  try {
    const skill = new Skill({
      name: req.body.name,
      level: req.body.level,
      cv: req.body.cv
    })
    const s = await skill.save()
    res.status(200).json(s);
  }
  catch (err) {
    res.status(500).json(err)
  }
};
module.exports.addLanguage = async function (req, res, next) {

  try {
    const language = new Language({
      name: req.body.name,
      level: req.body.level,
      cv: req.body.cv
    })
    const l = await language.save()
    res.status(200).json(l);
  }
  catch (err) {
    res.status(500).json(err)
  }
};
module.exports.addProject = async function (req, res, next) {

  try {
    const project = new Project({
      title: req.body.title,
      organization: req.body.organization,
      date: req.body.date,
      description: req.body.description,
      cv: req.body.cv
    })
    const p = await project.save()
    res.status(200).json(p);
  }
  catch (err) {
    res.status(500).json(err.message)
  }
};




module.exports.getEducation = async function (req, res, next) {
  const cvID = req.params.id;
  if (!ObjectId.isValid(cvID)) {
    return res.status(404).json("ID is not valid");
  }
  try {
    const e = await Education.find({ cv: cvID })
    res.status(200).json(e);
  } catch (err) {
    res.status(500).json(err)
  }
};
module.exports.getExperience = async function (req, res, next) {
  const cvID = req.params.id;
  if (!ObjectId.isValid(cvID)) {
    return res.status(404).json("ID is not valid");
  }
  try {
    const exp = await Experience.find({ cv: cvID })
    res.status(200).json(exp);
  }
  catch (err) {
    res.status(500).json(err)
  }
};
module.exports.getCertif = async function (req, res, next) {
  const cvID = req.params.id;
  if (!ObjectId.isValid(cvID)) {
    return res.status(404).json("ID is not valid");
  }
  try {
    const cert = await Certification.find({ cv: cvID })
    res.status(200).json(cert);
  }
  catch (err) {
    res.status(500).json(err)
  }
};
module.exports.getSkill = async function (req, res, next) {
  const cvID = req.params.id;
  if (!ObjectId.isValid(cvID)) {
    return res.status(404).json("ID is not valid");
  }
  try {
    const skill = await Skill.find({ cv: cvID })
    res.status(200).json(skill);
  }
  catch (err) {
    res.status(500).json(err)
  }
};
module.exports.getLanguage = async function (req, res, next) {
  const cvID = req.params.id;
  if (!ObjectId.isValid(cvID)) {
    return res.status(404).json("ID is not valid");
  }
  try {
    const language = await Language.find({ cv: cvID })
    res.status(200).json(language);
  }
  catch (err) {
    res.status(500).json(err)
  }
};
module.exports.getProject = async function (req, res, next) {
  const cvID = req.params.id;
  if (!ObjectId.isValid(cvID)) {
    return res.status(404).json("ID is not valid");
  }
  try {
    const project = await Project.find({ cv: cvID })
    res.status(200).json(project);
  }
  catch (err) {
    res.status(500).json(err)
  }
};
module.exports.getUserCV = async function (req, res, next) {
  const userID = req.params.id;
  if (!ObjectId.isValid(userID)) {
    return res.status(404).json("ID is not valid");
  }
  try {
    const cv = await Cv.find({ user: userID })
    res.status(200).json(cv);
  }
  catch (err) {
    res.status(500).json(err)
  }
};
module.exports.getSummary = async function (req, res, next) {
  const userID = req.params.id;
  if (!ObjectId.isValid(userID)) {
    return res.status(404).json("ID is not valid");
  }
  try {
    const cv = await Cv.findOne({ user: userID })
      .select('summary -_id')
    res.status(200).json(cv);
  }
  catch (err) {
    res.status(500).json(err)
  }
};



module.exports.updateEducation = async function (req, res, next) {
  const ID = req.params.id;
  if (!ObjectId.isValid(ID)) {
    return res.status(404).json("ID is not valid");
  }
  try {
    const e = await Education.findByIdAndUpdate(ID,
      {
        establishment: req.body.establishment,
        section: req.body.section,
        diploma: req.body.diploma,
        year_start: req.body.year_start,
        year_end: req.body.year_end,
        present: req.body.present || false,
        cv: req.body.cv
      }).populate('cv')
    res.status(200).json(e);
  }
  catch (err) {
    res.status(500).json(err)
  }
};
module.exports.updateExperience = async function (req, res, next) {
  const ID = req.params.id;
  if (!ObjectId.isValid(ID)) {
    return res.status(404).json("ID is not valid");
  }
  try {
    const exp = await Experience.findByIdAndUpdate(ID,
      {
        company: req.body.company,
        job: req.body.job,
        start: req.body.start,
        end: req.body.end,
        present: req.body.present || false,
        task_description: req.body.task_description,
        cv: req.body.cv

      }).populate('cv')
    res.status(200).json(exp);
  }
  catch (err) {
    res.status(500).json(err)
  }
};
module.exports.updateCertif = async function (req, res, next) {
  const ID = req.params.id;
  if (!ObjectId.isValid(ID)) {
    return res.status(404).json("ID is not valid");
  }
  try {
    if (req.file) {
      req.body.cert_file = req.file.filename;
    }
    const cert = await Certification.findByIdAndUpdate(ID,
      {
        domaine: req.body.domaine,
        date: req.body.date,
        credential: req.body.credential,
        cert_file: req.body.cert_file,
        cv: req.body.cv
      }).populate('cv')
    res.status(200).json(cert);
  }
  catch (err) {
    res.status(500).json(err)
  }
};
module.exports.updateSkill = async function (req, res, next) {
  const ID = req.params.id;
  if (!ObjectId.isValid(ID)) {
    return res.status(404).json("ID is not valid");
  }
  try {
    const skill = await Skill.findByIdAndUpdate(ID,
      {
        name: req.body.name,
        level: req.body.level,
        cv: req.body.cv
      }).populate('cv')
    res.status(200).json(skill);
  }
  catch (err) {
    res.status(500).json(err)
  }
};
module.exports.updateLanguage = async function (req, res, next) {
  const ID = req.params.id;
  if (!ObjectId.isValid(ID)) {
    return res.status(404).json("ID is not valid");
  }
  try {
    const language = await Language.findByIdAndUpdate(ID,
      {
        name: req.body.name,
        level: req.body.level,
        cv: req.body.cv
      }).populate('cv')
    res.status(200).json(language);
  }
  catch (err) {
    res.status(500).json(err)
  }
};
module.exports.updateSummary = async function (req, res, next) {
  const ID = req.params.id;
  if (!ObjectId.isValid(ID)) {
    return res.status(404).json("ID is not valid");
  }
  try {
    const cv = await Cv.findByIdAndUpdate(ID,
      {
        summary: req.body.summary,
        user: req.body.user
      })
    res.status(200).json(cv);
  }
  catch (err) {
    res.status(500).json(err)
  }
};
module.exports.updateProject = async function (req, res, next) {
  const ID = req.params.id;
  if (!ObjectId.isValid(ID)) {
    return res.status(404).json("ID is not valid");
  }
  try {
    const project = await Project.findByIdAndUpdate(ID,
      {
        organization: req.body.organization,
        title: req.body.title,
        date: req.body.date,
        description: req.body.description,
        cv: req.body.cv
      }).populate('cv')
    res.status(200).json(project);
  }
  catch (err) {
    res.status(500).json(err)
  }
};




module.exports.deleteEducation = async function (req, res) {
  const ID = req.params.id;

  if (!ObjectId.isValid(ID)) {
    return res.status(404).json("ID is not valid");
  }
  try {
    const edu = await Education.findByIdAndDelete({
      _id: ID
    })
    return res.status(200).json(edu);
  }
  catch (err) {
    res.status(500).json(err)
  };
};
module.exports.deleteExperience = async function (req, res) {
  const ID = req.params.id;

  if (!ObjectId.isValid(ID)) {
    return res.status(404).json("ID is not valid");
  }
  try {
    const exp = await Experience.findByIdAndDelete({ _id: ID })
    return res.status(200).json(exp);
  }
  catch (err) {
    res.status(500).json(err)
  };
};
module.exports.deleteCertif = async function (req, res) {
  const ID = req.params.id;

  if (!ObjectId.isValid(ID)) {
    return res.status(404).json("ID is not valid");
  }
  try {
    const cert = await Certification.findByIdAndDelete({ _id: ID })
    return res.status(200).json(cert);
  }
  catch (err) {
    res.status(500).json(err)
  };
};
module.exports.deleteLanguage = async function (req, res) {
  const ID = req.params.id;

  if (!ObjectId.isValid(ID)) {
    return res.status(404).json("ID is not valid");
  }
  try {
    const language = await Language.findByIdAndDelete({ _id: ID }).populate('cv')
    return res.status(200).json(language);
  }
  catch (err) {
    res.status(500).json(err)
  };
};
module.exports.deleteSkill = async function (req, res) {
  const ID = req.params.id;

  if (!ObjectId.isValid(ID)) {
    return res.status(404).json("ID is not valid");
  }
  try {
    const skill = await Skill.findByIdAndDelete({ _id: ID }).populate('cv')
    return res.status(200).json(skill);
  }
  catch (err) {
    res.status(500).json(err)
  };
};
module.exports.deleteProject = async function (req, res) {
  const ID = req.params.id;

  if (!ObjectId.isValid(ID)) {
    return res.status(404).json("ID is not valid");
  }
  try {
    const p = await Project.findByIdAndDelete({ _id: ID }).populate('cv')
    return res.status(200).json(p);
  }
  catch (err) {
    res.status(500).json(err)
  };
};



const { getUserResumeData } = require("../tools/dates")
const PDFDocument = require('pdfkit');
const fs = require('fs');

const path = require('path'); // ✅ added

module.exports.downloadResume = async function (req, res, next) {
  try {
    const userId = req.body.user
  
   if (!ObjectId.isValid(userId)) {
          console.log("ID is not valid");
      }
     
          const user = await User.findById(userId).populate('cv')
  
          const education = await Education.find({cv:user.cv._id});
          const experience = await Experience.find({cv:user.cv._id});
          const project = await Project.find({cv:user.cv._id});
          const certification = await Certification.find({cv:user.cv._id});
          const language = await Language.find({cv:user.cv._id});
          const skill = await Skill.find({cv:user.cv._id});

          resumeData = {
              user: user,
              educations: education,
              experiences: experience,
              projects: project,
              certifications: certification,
              languages: language,
              skills: skill
          }

    const doc = new PDFDocument({ size: "A4", margins: { top: 20, bottom: 20, left: 40, right: 40 } });

    const fileName = `resume_${resumeData.user.firstName}_${resumeData.user.lastName}.pdf`;
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    doc.pipe(res);
    doc.registerFont('NotoSans', './src/tools/NotoSans-VariableFont.ttf');
    doc.registerFont('FontAwesome', './src/tools/fontawesome-webfont.ttf');

    const IMAGE_PATH = path.join(__dirname, '../static/images/');

    const HEADER_HEIGHT = 160;

    doc.rect(0, 0, doc.page.width, HEADER_HEIGHT)
      .fill('#2980b9');

    const imageX = doc.page.margins.left ;
    const imageY = 20;
    const imageWidth = 120;
    const borderWidth = 3;
    const radius = imageWidth / 2;

    if (resumeData.user.image) {
      try {
        const imageFullPath = path.join(IMAGE_PATH, resumeData.user.image);

        if (fs.existsSync(imageFullPath)) {
          doc.fillColor('#ffffff')
            .circle(imageX + radius, imageY + radius, radius + borderWidth)
            .fill();

          doc.save();
          doc.roundedRect(imageX, imageY, imageWidth, imageWidth, radius);
          doc.clip();

          doc.image(imageFullPath, imageX, imageY, { width: imageWidth });

          doc.restore();
        }
      } catch (err) {
        console.warn('Error loading image, skipping.');
      }
    }

    const textX = imageX + imageWidth + 40;
    const textY = imageY;

    const iconX = textX;
    const iconSize = 9;
    const textYOffset = 15;

    doc.font('NotoSans')
      .fillColor('#ffffff')
      .fontSize(20)
      .text(`${resumeData.user.firstName} ${resumeData.user.lastName}`, textX, textY)
      .fontSize(10)
      .text(`${resumeData.user.title}`, textX, textY + 25)

    let currentY = textY + 45;

    doc.font('FontAwesome').fontSize(iconSize).text('\uf0e0', iconX, currentY);
    doc.font('NotoSans').text(`${resumeData.user.email}`, textX + 20, currentY - 1);
    currentY += textYOffset;

    if (resumeData.user.linkedin) {
      doc.font('FontAwesome').text('\uf08c', iconX, currentY);
      doc.font('NotoSans').text(`${resumeData.user.linkedin}`, textX + 20, currentY - 1, { link: resumeData.user.linkedin });
      currentY += textYOffset;
    }

    if (resumeData.user.github) {
      doc.font('FontAwesome').text('\uf09b', iconX, currentY);
      doc.font('NotoSans').text(`${resumeData.user.github}`, textX + 20, currentY - 1, { link: resumeData.user.github });
      currentY += textYOffset;
    }

    doc.font('FontAwesome').text('\uf095', iconX, currentY);
    doc.font('NotoSans')
      .text(`+216 ${resumeData.user.phone}`, textX + 20, currentY - 1);

    doc.y = HEADER_HEIGHT + 20;
    doc.x = 40;

    const addSectionTitle = (title) => {
      doc.x = 40;
      doc.fontSize(13).fillColor('#2980b9').text(title, { underline: true, align: 'left' });
      doc.moveDown();
    };

    if (resumeData.user.cv.summary) {
      addSectionTitle('Summary');
      doc.fontSize(7).fillColor('black').text(resumeData.user.cv.summary, { align: 'justify' });
      doc.moveDown();
    }

    if (resumeData.skills && resumeData.skills.length > 0) {
      addSectionTitle('Skills');

      const skillPadding = 5;
      const badgeHeight = 20;
      const badgeMargin = 5;
      const borderRadius = 10;

      let currentYSkills = doc.y;
      let currentX = 40;
      const maxWidth = doc.page.width - doc.page.margins.right;

      resumeData.skills.forEach((skill) => {
        const skillTextWidth = doc.widthOfString(skill.name);
        const skillBadgeWidth = skillTextWidth + skillPadding * 2 + 2;

        if (currentX + skillBadgeWidth > maxWidth) {
          currentX = 40;
          currentYSkills += badgeHeight + badgeMargin;
        }

        doc.fontSize(7)
          .fill('#ecf0f1')
          .roundedRect(currentX, currentYSkills, skillBadgeWidth, badgeHeight, borderRadius)
          .fill();

        doc.fillColor('#333')
          .text(skill.name, currentX + skillPadding, currentYSkills + (badgeHeight / 4), {
            width: skillBadgeWidth - skillPadding * 2,
            align: 'center'
          });

        currentX += skillBadgeWidth + badgeMargin;
      });

      doc.y = currentYSkills + badgeHeight + 10;
    }

    if (resumeData.experiences && resumeData.experiences.length > 0) {
      addSectionTitle('Experiences');
      resumeData.experiences.forEach((exp) => {
        const startDate = new Date(exp.start).toLocaleDateString('en', { year: 'numeric', month: 'short' });
        const endDate = exp.present ? 'Present' : new Date(exp.end).toLocaleDateString('en', { year: 'numeric', month: 'short' });

        const dateColumnWidth = 100;
        const jobColumnX = doc.page.margins.left + dateColumnWidth + 10;

        doc.fontSize(8).fillColor('#2980b9')
          .text(`${startDate} - ${endDate}`, doc.page.margins.left, doc.y, { width: dateColumnWidth });

        doc.fontSize(10)
          .text(`${exp.job} at ${exp.company}`, jobColumnX, doc.y - 15);

        doc.fontSize(7).fillColor('black')
          .text(exp.task_description);

        doc.moveDown();
      });
    }

    if (resumeData.educations && resumeData.educations.length > 0) {
      addSectionTitle('Educations');
      resumeData.educations.forEach((edu) => {
        const startDate = new Date(edu.year_start).toLocaleDateString('en', { year: 'numeric', month: 'short' });
        const endDate = edu.present ? 'Present' : new Date(edu.year_end).toLocaleDateString('en', { year: 'numeric', month: 'short' });

        const dateColumnWidth = 100;
        const educationColumnX = doc.page.margins.left + dateColumnWidth + 10;

        doc.fontSize(8).fillColor('#2980b9')
          .text(`${startDate} - ${endDate}`, doc.page.margins.left, doc.y, { width: dateColumnWidth });

        doc.fontSize(10)
          .text(`${edu.diploma} in ${edu.section} from ${edu.establishment}`, educationColumnX, doc.y - 15);

        doc.moveDown();
      });
    }

    if (resumeData.projects && resumeData.projects.length > 0) {
      addSectionTitle('Projects');
      resumeData.projects.forEach((project) => {
        const projectDate = new Date(project.date).toLocaleDateString('en', { year: 'numeric', month: 'short' });

        const dateColumnWidth = 100;
        const projectColumnX = doc.page.margins.left + dateColumnWidth + 10;

        doc.fontSize(8).fillColor('#2980b9')
          .text(`${projectDate}`, doc.page.margins.left, doc.y, { width: dateColumnWidth });

        doc.fontSize(10)
          .text(`${project.title} at ${project.organization}`, projectColumnX, doc.y - 15);

        doc.fontSize(7).fillColor('black')
          .text(project.description);

        doc.moveDown();
      });
    }

    if (resumeData.certifications && resumeData.certifications.length > 0) {
      addSectionTitle('Certifications');
      resumeData.certifications.forEach((cert) => {
        const certDate = new Date(cert.date).toLocaleDateString('en', { year: 'numeric', month: 'short' });

        const dateColumnWidth = 100;
        const certColumnX = doc.page.margins.left + dateColumnWidth + 10;

        doc.fontSize(7).fillColor('#2980b9')
          .text(`${certDate}`, doc.page.margins.left, doc.y, { width: dateColumnWidth });

        doc.fontSize(10)
          .text(`${cert.domaine}`, certColumnX, doc.y - 15);

        if (cert.credential) {
          doc.fontSize(7).fillColor('black')
            .text(`Credential: ${cert.credential}`, certColumnX, doc.y);
        }

        doc.moveDown();
      });
    }

    // ===== UPDATED LANGUAGE MAPPING =====
    if (resumeData.languages && resumeData.languages.length > 0) {
      addSectionTitle('Languages');

      const getLevelLabel = (value) => {
        if (value <= 25) return 'Beginner';
        if (value <= 50) return 'Intermediate';
        if (value <= 75) return 'Advanced';
        return 'Expert';
      };

      resumeData.languages.forEach((lang) => {
        const levelLabel = getLevelLabel(lang.level);
        doc.fontSize(9).text(`${lang.name}: ${levelLabel}`);
      });
    }

    doc.end();

  } catch (error) {
    console.error('Error generating resume PDF:', error);
    next(error);
  }

}

module.exports.filterCvs = async function (req, res) {
  var skillsFilter = req.body.skills;

  if (skillsFilter) {
    skillsFilter = skillsFilter.trim().length === 0 ? null : skillsFilter;
  }
  try {
    if (skillsFilter) {
      const cvs = await Cvs.skills.find({
        roles: { $ne: "admin" },
        isEnabled: isNotEnabledFilter ? false : true,
        _id: { $ne: res.locals.user._id },
        skillsFilter: req.body.skills,
      })
        .select(skillsFilter);

      if (cvs) {
        res.status(200).json(cvs);
      }
    }
  } catch (error) {
    res.status(500).json(error);
  }
};
module.exports.searchCvs = async function (req, res) {
  var skillsFilter = req.body.skills;

  if (skillsFilter) {
    skillsFilter = skillsFilter.trim().length === 0 ? null : skillsFilter;
  }
  try {
    const cvs = await Cvs.skills.find({
      roles: { $ne: "admin" },
      isEnabled: isNotEnabledFilter ? false : true,
      _id: { $ne: res.locals.user._id },

      skills: skillsFilter
        ? new RegExp(skillsFilter, "i")
        : new RegExp("[a-zA-Z]"),
    })
      .select(skillsFilter);
    if (cvs) {
      res.status(200).json(cvs);
    }
  } catch (error) {
    res.status(500).json(error);
  }
};
