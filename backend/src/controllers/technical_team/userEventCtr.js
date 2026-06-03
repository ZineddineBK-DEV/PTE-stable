const { ObjectId } = require("mongodb");
const User = require("../../models/user");

const UserEvent = require("../../models/technical_team/userEvent");
const nodemailer = require("nodemailer");
const VehicleEvent = require("../../models/material_resources/events/vehicleEvent");
const moment = require('moment');
const mongoose = require("mongoose");
const Vehicle = require("../../models/material_resources/vehicle");

// create event
module.exports.createEvent = async function (req, res) {
  const body = {...req.body}
  try {
    const eventExist = await UserEvent.find({
      start: { $lte: body.end },
      end: { $gte: body.start },
      engineer: body.engineer,
    });

    // if dates are  already reserved
    if (eventExist.length > 0) {
      return res.status(500).json("Dates already reserved");
    } else {
      
      const event = await UserEvent.create(body)
      eventMaker = await User.findById(body.applicant)
      eventEng = await User.findById(body.engineer)
      // if (event) {
      //     const transporter = nodemailer.createTransport({
      //       host: "smtp.office365.com",
      //       port: 587,
      //       secure: false,
      //       auth: {
      //           user: process.env.EMAIL,
      //           pass: process.env.PASSWORD,
      //         },
      //       });
      //       const mailOptions = {
      //         from: process.env.EMAIL,
      //         to: eventEng.email,
      //         subject: 'Prologic -- Intervention Notification',
      //         text: `${eventMaker.firstName} ${eventMaker.lastName}, you just confirmed that you're going to '${req.body.address}' for '${req.body.job}'.`,
      //         html: `
      //             <h1>Intervention Notification</h1>
      //             <p>Dear ${eventMaker.firstName} ${eventMaker.lastName},</p>
      //             <p>You just confirmed that you're going to <strong>'${req.body.address}'</strong> for <strong>'${req.body.job}'</strong>.</p>
      //             <p>Thank you for using Prologic Technical Experience booking system.</p>
      //             <p>Best regards</p>
      //             <p>DEV TEAM</p>
      //         `
      //     };
      //       transporter.sendMail(mailOptions, function(error, info){
      //         if (error) {
      //         console.log(error);
      //         } else {
      //           console.log('Email sent: ' + info.response);
      //         }
      //       });
      // }
      res.status(200).json(event);
    }
  } catch (error) {
    res.status(500).json(error.message);
  }
};

/** get events by UserID*/
module.exports.getUserEvents = async function (req, res) {
  const ID = req.query.engineer;

  if (!ObjectId.isValid(ID)) {
    return res.status(404).json("ID is not valid");
  }
  try {
    //if connected user is admin
    if (res.locals.user.roles.includes("admin")) {
      const events = await UserEvent.find({
        engineer: ID,
        start: { $gte: req.query.start },
        end: { $lte: req.query.end },
      }).populate({ path: "applicant", select: "firstName lastName image" });

      if (events) {
        res.status(200).json(events);
      }
    } else {
      //connected user is not admin=> cannot display unconfirmed events of other users

      const events = await UserEvent.find({
        $and: [
          { engineer: ID },
          { start: { $gte: req.query.start } },
          { end: { $lte: req.query.end } },

          {
            $or: [
              {
                $and: [
                  { isAccepted: false },
                  {
                    $or: [
                      { applicant: res.locals.user._id },
                      { engineer: res.locals.user._id },
                    ],
                  },
                ],
              },
              { isAccepted: true },
            ],
          },
        ],
      }).populate({ path: "applicant", select: "firstName lastName image" });

      if (events) {
        res.status(200).json(events);
      }
    }
  } catch (error) {
    res.status(404).json("there is an error ");
  }
};
module.exports.getAllUsersEvents = async function (req,res){
  try {
    const usersEvents = await UserEvent.find()
      .populate({ path: "applicant", select: "_id firstName lastName" })
      .populate({ path: "engineer", select: "firstName lastName" })
    res.status(200).json(usersEvents)

  } catch (error) {
    res.send(500).json("Internal server error")
  }
}
/**Update Event  */
module.exports.updateEvent = async function (req, res) {
  const ID = req.params.id;
  if (!ObjectId.isValid(ID)) {
    return res.status(404).json("ID is not valid");
  }
  try {
    // if (body.isAccepted) {
    //   const event = await UserEvent.findById(ID);

    //   //check if there is a conflict (to assure that there  is no conflicts)
    //   const checkExist = await UserEvent.find({
    //     start: { $gte: event.start },
    //     end: { $lte: event.end },
    //     engineer: event.engineer,
    //     isAccepted: true,
    //   });

    //   if (checkExist.length > 0) {
    //     return res.status(500).json("Dates already reserved");
    //   }
      //Accept Event
      const updateEvent = await UserEvent.findByIdAndUpdate(ID, {
        title: req.body.title,
        start: req.body.start,
        end: req.body.end,
        job: req.body.job,
        address: req.body.address,
      });

      if (updateEvent) return res.status(200).json(updateEvent);
    
  } catch (error) {
    res.status(501).json(error);
  }
};
/**deleteEvent */
module.exports.deleteEvent = async function (req, res) {
  const ID = req.params.id;
  if (!ObjectId.isValid(ID)) {
    return res.status(404).json("ID is not valid");
  }
  try {
    const event = await UserEvent.findByIdAndDelete({ _id: ID });
    const vehicleEventToDelete = await VehicleEvent.findByIdAndDelete(event.vehicleEvent)
    if (event && vehicleEventToDelete) return res.status(200).json(event);
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports.getDepartments = async (req, res) => {
  try {
    const departments = await User.aggregate([
      { $group: { _id: '$departement' } },
      { $sort: { _id: 1 } },
      { $project: { department: '$_id' } }
    ]);
    res.json(departments.map(d => d.department).filter(Boolean));
  } catch (error) {
    res.status(500).json({ message: 'Error fetching departments' });
  }
};

module.exports.getMissionStats = async (req, res) => {
  try {
    const { year = new Date().getFullYear(), month, department } = req.query;

    let startOfPeriod = new Date(Number(year), 0, 1);
    let endOfPeriod = new Date(Number(year), 11, 31, 23, 59, 59);

    // Month filter
    if (month && Number(month) >= 1 && Number(month) <= 12) {
      startOfPeriod.setMonth(Number(month) - 1, 1);
      endOfPeriod.setMonth(Number(month), 0, 23, 59, 59);
    }

    const totalHoursInPeriod = moment(endOfPeriod).diff(moment(startOfPeriod), 'hours');

    const stats = await Promise.all([
      // Missions per month – UserEvent
      UserEvent.aggregate([
        { $match: { start: { $gte: startOfPeriod, $lte: endOfPeriod } } },
        ...(department ? [{ $lookup: { from: 'users', localField: 'engineer', foreignField: '_id', as: 'engineerInfo' } },
                          { $unwind: '$engineerInfo' },
                          { $match: { 'engineerInfo.departement': department } }] : []),
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m', date: '$start' } },
            userEvents: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ]),

      // Missions per month – VehicleEvent (vehicles don't have department, but can keep as is or filter if needed)
      VehicleEvent.aggregate([
        { $match: { start: { $gte: startOfPeriod, $lte: endOfPeriod } } },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m', date: '$start' } },
            vehicleEvents: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ]),

      // Top 10 engineers – filter by department if selected
      UserEvent.aggregate([
        { $match: { start: { $gte: startOfPeriod, $lte: endOfPeriod } } },
        ...(department ? [{ $lookup: { from: 'users', localField: 'engineer', foreignField: '_id', as: 'engineerInfo' } },
                          { $unwind: '$engineerInfo' },
                          { $match: { 'engineerInfo.departement': department } }] : []),
        {
          $group: {
            _id: '$engineer',
            count: { $sum: 1 }
          }
        },
        {
          $lookup: {
            from: 'users',
            localField: '_id',
            foreignField: '_id',
            as: 'engineerInfo'
          }
        },
        { $unwind: { path: '$engineerInfo', preserveNullAndEmptyArrays: true } },
        {
          $project: {
            fullName: {
              $concat: [
                { $ifNull: ['$engineerInfo.firstName', 'Unknown'] },
                ' ',
                { $ifNull: ['$engineerInfo.lastName', ''] }
              ]
            },
            count: 1
          }
        },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ]),

      // Top vehicles – no department filter needed
      VehicleEvent.aggregate([
        { $match: { start: { $gte: startOfPeriod, $lte: endOfPeriod } } },
        {
          $addFields: {
            durationHours: {
              $divide: [{ $abs: { $subtract: ['$end', '$start'] } }, 3600000]
            }
          }
        },
        {
          $group: {
            _id: '$vehicle',
            events: { $sum: 1 },
            totalKm: { $sum: '$km' },
            totalBookedHours: { $sum: '$durationHours' }
          }
        },
        {
          $addFields: {
            utilizationPercent: {
              $cond: [
                { $eq: [totalHoursInPeriod, 0] },
                0,
                { $multiply: [{ $divide: ['$totalBookedHours', totalHoursInPeriod] }, 100] }
              ]
            }
          }
        },
        {
          $lookup: {
            from: 'vehicles',
            localField: '_id',
            foreignField: '_id',
            as: 'vehicleInfo'
          }
        },
        { $unwind: { path: '$vehicleInfo', preserveNullAndEmptyArrays: true } },
        {
          $project: {
            model: { $ifNull: ['$vehicleInfo.model', 'Unknown'] },
            registration: { $ifNull: ['$vehicleInfo.registration_number', 'N/A'] },
            events: 1,
            totalKm: 1,
            utilizationPercent: { $round: ['$utilizationPercent', 1] }
          }
        },
        { $sort: { utilizationPercent: -1 } },
        { $limit: 10 }
      ]),

      // Average mission duration
      UserEvent.aggregate([
        { $match: { start: { $gte: startOfPeriod, $lte: endOfPeriod } } },
        ...(department ? [{ $lookup: { from: 'users', localField: 'engineer', foreignField: '_id', as: 'engineerInfo' } },
                          { $unwind: '$engineerInfo' },
                          { $match: { 'engineerInfo.departement': department } }] : []),
        { $match: { $expr: { $gte: ['$end', '$start'] } } },
        {
          $project: {
            durationHours: {
              $divide: [{ $subtract: ['$end', '$start'] }, 3600000]
            }
          }
        },
        { $group: { _id: null, avgDuration: { $avg: '$durationHours' } } }
      ]),

      // Missions by Department – if department selected, show only that one
      UserEvent.aggregate([
        { $match: { start: { $gte: startOfPeriod, $lte: endOfPeriod } } },
        {
          $lookup: {
            from: 'users',
            localField: 'applicant',
            foreignField: '_id',
            as: 'applicantInfo'
          }
        },
        { $unwind: { path: '$applicantInfo', preserveNullAndEmptyArrays: true } },
        ...(department ? [{ $match: { 'applicantInfo.departement': department } }] : []),
        {
          $group: {
            _id: { $ifNull: ['$applicantInfo.departement', 'Unknown'] },
            count: { $sum: 1 }
          }
        },
        { $sort: { count: -1 } }
      ]),

      // Kilometers per Vehicle per Month
      VehicleEvent.aggregate([
        { $match: { start: { $gte: startOfPeriod, $lte: endOfPeriod } } },
        {
          $group: {
            _id: {
              vehicle: '$vehicle',
              month: { $dateToString: { format: '%Y-%m', date: '$start' } }
            },
            totalKm: { $sum: '$km' }
          }
        },
        {
          $lookup: {
            from: 'vehicles',
            localField: '_id.vehicle',
            foreignField: '_id',
            as: 'vehicleInfo'
          }
        },
        { $unwind: { path: '$vehicleInfo', preserveNullAndEmptyArrays: true } },
        {
          $project: {
            _id: 0,
            vehicleId: '$_id.vehicle',
            month: '$_id.month',
            totalKm: 1,
            registration: { $ifNull: ['$vehicleInfo.registration_number', 'N/A'] },
            model: { $ifNull: ['$vehicleInfo.model', 'Unknown'] }
          }
        },
        { $sort: { month: 1, totalKm: -1 } }
      ]),

      // Engineer Workload Overlap
      UserEvent.aggregate([
        { $match: { start: { $gte: startOfPeriod, $lte: endOfPeriod } } },
        ...(department ? [{ $lookup: { from: 'users', localField: 'engineer', foreignField: '_id', as: 'engineerInfo' } },
                          { $unwind: '$engineerInfo' },
                          { $match: { 'engineerInfo.departement': department } }] : []),
        {
          $addFields: {
            date: { $dateToString: { format: '%Y-%m-%d', date: '$start' } }
          }
        },
        {
          $group: {
            _id: { engineer: '$engineer', date: '$date' },
            concurrent: { $sum: 1 }
          }
        },
        {
          $group: {
            _id: '$_id.engineer',
            maxOverlap: { $max: '$concurrent' }
          }
        },
        {
          $lookup: {
            from: 'users',
            localField: '_id',
            foreignField: '_id',
            as: 'engineerInfo'
          }
        },
        { $unwind: { path: '$engineerInfo', preserveNullAndEmptyArrays: true } },
        {
          $project: {
            fullName: {
              $concat: [
                { $ifNull: ['$engineerInfo.firstName', 'Unknown'] },
                ' ',
                { $ifNull: ['$engineerInfo.lastName', ''] }
              ]
            },
            maxOverlap: 1
          }
        },
        { $sort: { maxOverlap: -1 } },
        { $limit: 10 }
      ])
    ]);

    res.json({
      missionsPerMonth: {
        userEvents: stats[0],
        vehicleEvents: stats[1]
      },
      topEngineers: stats[2],
      topVehicles: stats[3],
      avgDurationHours: stats[4][0]?.avgDuration?.toFixed(1) || 0,
      missionsByDepartment: stats[5],
      kmPerVehiclePerMonth: stats[6],
      engineerWorkloadOverlap: stats[7]
    });
  } catch (error) {
    console.error('Mission stats error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports.getMyMissionStats = async (req, res) => {
  try {
    const userId = req.user.id;
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const { year, month, vehicleId } = req.query;

    let startDate = new Date(Number(year || new Date().getFullYear()), 0, 1);
    let endDate = new Date(Number(year || new Date().getFullYear()), 11, 31, 23, 59, 59);

    if (month && Number(month) >= 1 && Number(month) <= 12) {
      startDate = new Date(Number(year || new Date().getFullYear()), Number(month) - 1, 1);
      endDate = new Date(Number(year || new Date().getFullYear()), Number(month), 0, 23, 59, 59);
    }

    const userObjectId = mongoose.Types.ObjectId(userId);

    const commonMatch = {
      applicant: userObjectId,
      start: { $gte: startDate, $lte: endDate }
    };

    const vehicleMatch = vehicleId 
      ? { applicant: userObjectId, vehicle: mongoose.Types.ObjectId(vehicleId), start: { $gte: startDate, $lte: endDate } } 
      : { applicant: userObjectId, start: { $gte: startDate, $lte: endDate } };

    const stats = await Promise.all([
      // Total My Missions
      UserEvent.countDocuments(commonMatch),

      // Missions per Month
      UserEvent.aggregate([
        { $match: commonMatch },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m', date: '$start' } },
            count: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ]),

      // Average Mission Duration
      UserEvent.aggregate([
        { $match: { ...commonMatch, $expr: { $gte: ['$end', '$start'] } } },
        {
          $project: {
            durationHours: { $divide: [{ $subtract: ['$end', '$start'] }, 3600000] }
          }
        },
        { $group: { _id: null, avgDuration: { $avg: '$durationHours' } } }
      ]),

      // Kilometers per Month (filtered by vehicle)
      VehicleEvent.aggregate([
        { $match: vehicleMatch },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m', date: '$start' } },
            totalKm: { $sum: '$km' }
          }
        },
        { $sort: { _id: 1 } }
      ]),

      // Total Km This Period (filtered by vehicle)
      VehicleEvent.aggregate([
        { $match: vehicleMatch },
        { $group: { _id: null, totalKm: { $sum: '$km' } } }
      ]),

      // Longest Mission
      UserEvent.aggregate([
        { $match: { ...commonMatch, $expr: { $gte: ['$end', '$start'] } } },
        {
          $project: {
            durationHours: { $divide: [{ $subtract: ['$end', '$start'] }, 3600000] },
            start: 1,
            end: 1,
            job: 1,
            address: 1
          }
        },
        { $sort: { durationHours: -1 } },
        { $limit: 1 }
      ]),

      // Missions by Day of Week
      UserEvent.aggregate([
        { $match: commonMatch },
        {
          $group: {
            _id: { $dayOfWeek: '$start' },
            count: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ]),

      // Missions with Vehicle vs Without Vehicle (fixed logic)
      UserEvent.aggregate([
        { $match: commonMatch },
        {
          $group: {
            _id: vehicleId ? 'With Vehicle' : {
              $cond: {
                if: { $ifNull: ['$vehicle', false] },
                then: 'With Vehicle',
                else: 'Without Vehicle'
              }
            },
            count: { $sum: 1 }
          }
        }
      ]),

      // My Vehicles for dropdown
      (async () => {
        const vehicleIds = await VehicleEvent.distinct('vehicle', { applicant: userObjectId });
        if (!vehicleIds.length) return [];
        return Vehicle.find({ _id: { $in: vehicleIds } })
          .select('registration_number model')
          .lean();
      })()
    ]);

    const dayNames = ['', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    res.status(200).json({
      totalMyMissions: stats[0],
      missionsPerMonth: stats[1],
      avgDurationHours: stats[2][0]?.avgDuration?.toFixed(1) || 0,
      kmPerMonth: stats[3],
      totalKmThisYear: stats[4][0]?.totalKm || 0,
      longestMission: stats[5][0] || null,
      missionsByDayOfWeek: stats[6].map(item => ({ day: dayNames[item._id], count: item.count })),
      missionsWithVsWithoutVehicle: stats[7],
      myVehicles: stats[8].map(v => ({
        id: v._id.toString(),
        name: `${v.registration_number || 'N/A'} (${v.model || 'Unknown'})`
      }))
    });
  } catch (error) {
    console.error('My Mission Stats Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};