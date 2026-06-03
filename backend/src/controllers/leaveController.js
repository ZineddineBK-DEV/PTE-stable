const { ObjectId } = require("mongodb");
const User = require("../models/user");
const Leave = require("../models/leave");
const nodemailer = require("nodemailer");
const moment = require('moment');
const mongoose = require('mongoose');

module.exports.addRequest = async function (req, res, next) {
    const generatedNumbers = new Set();
    do {
        code = Math.floor(1000 + Math.random() * 9000);
    } while (generatedNumbers.has(code));
    generatedNumbers.add(code);

    let leave
    try {
        if (req.body.type == 'Unpaid Leave') {
            leave = new Leave({
                fullName: req.body.fullName,
                email: req.body.email,
                startDate: req.body.startDate,
                endDate: req.body.endDate,
                note: req.body.note,
                type: req.body.type,
                code: "L" + code,
                applicant: req.body.applicant,
                status: 'Pending 1/2',
                supervisor: req.body.supervisor,
                supervisorAccepted: true
            })
        } else if (req.body.type == 'Maternity Leave') {
            let file
            if (req.file) {
                file = req.file.filename
            }
            leave = new Leave({
                fullName: req.body.fullName,
                email: req.body.email,
                startDate: req.body.startDate,
                endDate: req.body.endDate,
                note: req.body.note,
                certif: file,
                type: req.body.type,
                code: "L" + code,
                supervisor: req.body.supervisor,
                applicant: req.body.applicant,
            })
        } else {
            leave = new Leave({
                fullName: req.body.fullName,
                email: req.body.email,
                startDate: req.body.startDate,
                endDate: req.body.endDate,
                note: req.body.note,
                type: req.body.type,
                code: "L" + code,
                supervisor: req.body.supervisor,
                applicant: req.body.applicant,
            })
        }
        if (res.locals.user.roles.includes("ASSISTANT") || res.locals.user.teamLeader === true || res.locals.user.departement === 'Cyber Security' || res.locals.user.departement === 'Administration') {
            let file
            if (req.file) {
                file = req.file.filename
            }
            leave = new Leave({
                fullName: req.body.fullName,
                email: req.body.email,
                startDate: req.body.startDate,
                endDate: req.body.endDate,
                note: req.body.note,
                certif: file,
                type: req.body.type,
                code: "L" + code,
                supervisor: req.body.supervisor,
                applicant: req.body.applicant,
                supervisorAccepted: true,
                status: "Pending 1/2"
            })
        }
        const l = await leave.save();
        const leavee = await Leave.findOne({
            code: l.code
        }).populate({ path: "supervisor", select: "firstName lastName email _id" })
            .populate({ path: "applicant", select: "firstName lastName email _id" })


        // if (leavee) {
        //     const transporter = nodemailer.createTransport({
        //         host: "smtp.office365.com",
        //         port: 587,
        //         secure: false,
        //         auth: {
        //             user: process.env.EMAIL,
        //             pass: process.env.PASSWORD,
        //         },
        //     });
        //     const mailOptions = {
        //         from: process.env.EMAIL,
        //         to: leavee.supervisor.email,
        //         subject: 'Prologic -- New Leave Request', // Fixed the quotation marks
        //         text: `You have a new leave request from ${leavee.applicant.firstName} ${leavee.applicant.lastName}. Check it out.`,
        //         html: `
        //                     <h1>Leave Request Approval</h1>
        //                     <p>Dear ${leavee.supervisor.firstName} ${leavee.supervisor.lastName},</p>
        //                     <p>You have a new leave request from <strong>${leavee.applicant.firstName} ${leavee.applicant.lastName}</strong>. 
        //                     Please <a href="https://pte.prologic.com.tn:3200/#/dashboard/myLeave">check it out</a>.</p>
        //                 `
        //     };
        //     transporter.sendMail(mailOptions, function (error, info) {
        //         if (error) {
        //             console.log(error);
        //         } else {
        //             console.log('Email sent: ' + info.response);
        //         }
        //     });
        // }
        res.status(200).json(l);

    } catch (error) {
        res.status(500).json("internal server error: " + error.message);
    }
}
module.exports.managerAccept = async function (req, res, next) {
    const ID = req.params.id
    if (!ObjectId.isValid(ID)) {
        return res.status(400).json("Invalid Leave ID")
    }
    try {
        const leave = await Leave.findByIdAndUpdate(
            ID,
            {
                managerAccepted: true,
                status: "Approved"
            },
        )
        // if (leave) {
        //     const transporter = nodemailer.createTransport({
        //         host: "smtp.office365.com",
        //         port: 587,
        //         secure: false,
        //         auth: {
        //             user: process.env.EMAIL,
        //             pass: process.env.PASSWORD,
        //         },
        //     });
        //     const mailOptions = {
        //         from: process.env.EMAIL,
        //         to: leave.email,
        //         subject: 'Prologic -- Leave Request Final Approval', // Fixed the quotation marks
        //         text: 'The admin has just approved your leave request. Enjoy it!',
        //         html: `
        //                     <h1>Leave Request Final Approval</h1>
        //                     <p>Dear ${leave.fullName},</p>
        //                     <p>The admin has just approved your leave request. Enjoy your time off!</p>
        //                     <p>If you have any questions, feel free to reach out.</p>
        //                     <p>Thank you!</p>
        //                 `
        //     };
        //     transporter.sendMail(mailOptions, function (error, info) {
        //         if (error) {
        //             console.log(error);
        //         } else {
        //             console.log('Email sent: ' + info.response);
        //         }
        //     });
        // }
        res.status(200).json(leave);
    } catch (err) {
        res.status(500).json(err.message);
    }
}
module.exports.managerDecline = async function (req, res, next) {
    const ID = req.params.id
    if (!ObjectId.isValid(ID)) {
        return res.status(400).json("Invalid Leave ID")
    }
    try {
        const leave = await Leave.findByIdAndUpdate(
            ID,
            {
                status: "Declined"
            },
        )
        // if (leave) {
        //     const transporter = nodemailer.createTransport({
        //         host: "smtp.office365.com",
        //         port: 587,
        //         secure: false,
        //         auth: {
        //             user: process.env.EMAIL,
        //             pass: process.env.PASSWORD,
        //         },
        //     });
        //     const mailOptions = {
        //         from: process.env.EMAIL,
        //         to: leave.email,
        //         subject: 'Prologic -- Leave Request Declined', // Fixed the quotation marks
        //         text: 'Unfortunately, the admin has just declined your leave request.',
        //         html: `
        //                     <h1>Leave Request Update</h1>
        //                     <p>Dear ${leave.fullName},</p>
        //                     <p>Unfortunately, the admin has just declined your leave request.</p>
        //                     <p>If you have any questions or would like to discuss this further, please feel free to reach out.</p>
        //                     <p>Thank you for your understanding.</p>
        //                 `
        //     };
        //     transporter.sendMail(mailOptions, function (error, info) {
        //         if (error) {
        //             console.log(error);
        //         } else {
        //             console.log('Email sent: ' + info.response);
        //         }
        //     });
        // }
        res.status(200).json(leave);
    } catch (err) {
        res.status(500).json(err.message);
    }
}
module.exports.workerAccept = async function (req, res, next) {
    const ID = req.params.id
    if (!ObjectId.isValid(ID)) {
        return res.status(400).json("Invalid Leave ID")
    }
    try {
        const leave = await Leave.findByIdAndUpdate(
            ID,
            {
                supervisorAccepted: true,
                status: "Pending 1/2"
            },
        )
        // if (leave) {
        //     const transporter = nodemailer.createTransport({
        //         host: "smtp.office365.com",
        //         port: 587,
        //         secure: false,
        //         auth: {
        //             user: process.env.EMAIL,
        //             pass: process.env.PASSWORD,
        //         },
        //     });
        //     const mailOptions = {
        //         from: process.env.EMAIL,
        //         to: leave.email,
        //         subject: 'Prologic -- Leave Request Accepted 1/2', // Fixed the quotation marks
        //         text: 'Your supervisor has just accepted your leave request. Please wait until the admin approves it as well!',
        //         html: `
        //                     <h1>Leave Request Update</h1>
        //                     <p>Dear ${leave.fullName},</p>
        //                     <p>Your supervisor has just accepted your leave request. Please wait until the admin approves it as well!</p>
        //                     <p>Thank you for your patience.</p>
        //                 `
        //     };
        //     transporter.sendMail(mailOptions, function (error, info) {
        //         if (error) {
        //             console.log(error);
        //         } else {
        //             console.log('Email sent: ' + info.response);
        //         }
        //     });
        // }
        res.status(200).json(leave);
    } catch (err) {
        res.status(500).json(err.message);
    }
}
module.exports.workerDecline = async function (req, res, next) {
    const ID = req.params.id
    if (!ObjectId.isValid(ID)) {
        return res.status(400).json("Invalid Leave ID")
    }
    try {
        const leave = await Leave.findByIdAndUpdate(
            ID,
            {
                status: "Declined"
            },
        )
        // if (leave) {
        //     const transporter = nodemailer.createTransport({
        //         host: "smtp.office365.com",
        //         port: 587,
        //         secure: false,
        //         auth: {
        //             user: process.env.EMAIL,
        //             pass: process.env.PASSWORD,
        //         },
        //     });
        //     const mailOptions = {
        //         from: process.env.EMAIL,
        //         to: leave.email,
        //         subject: 'Prologic -- Leave Request Declined',
        //         text: 'Your supervisor has just declined your leave request.',
        //         html: `
        //                     <h1>Leave Request Update</h1>
        //                     <p>Dear ${leave.fullName},</p>
        //                     <p>Your supervisor has just declined your leave request.</p>
        //                     <p>If you have any questions or need further assistance, please feel free to reach out to your supervisor.</p>
        //                     <p>Thank you for your understanding.</p>
        //                 `
        //     };
        //     transporter.sendMail(mailOptions, function (error, info) {
        //         if (error) {
        //             console.log(error);
        //         } else {
        //             console.log('Email sent: ' + info.response);
        //         }
        //     });
        // }
        res.status(200).json(leave);
    } catch (err) {
        res.status(500).json(err.message);
    }
}
module.exports.getLeave = async function (req, res, next) {
    try {
        const leaves = await Leave.find({
            supervisorAccepted: true
        }).populate('applicant supervisor')
        res.status(200).json(leaves);
    } catch (err) {
        res.status(500).json(err.message);
    }

}
module.exports.getUserLeave = async function (req, res, next) {
    const userId = req.params.id
    if (!ObjectId.isValid(userId)) {
        return res.status(400).json("Invalid User ID")
    }
    try {
        const userLeave = await Leave.find({
            applicant: userId
        }).populate('applicant supervisor')
        return res.status(200).json(userLeave);
    } catch (err) {
        res.status(500).json(err.message);
    }
}
module.exports.getLeaveById = async function (req, res, next) {
    const leaveId = req.params.id
    if (!ObjectId.isValid(leaveId)) {
        return res.status(400).json("Invalid User ID")
    }
    try {
        const userLeave = await Leave.find({
            applicant: leaveId
        })
        return res.status(200).json(userLeave);
    } catch (err) {
        res.status(500).json(err.message);
    }
}
module.exports.deleteLeave = async function (req, res, next) {
    const leaveId = req.params.id
    if (!ObjectId.isValid(leaveId)) {
        return res.status(400).json("Invalid User ID")
    }
    try {
        const userLeave = await Leave.findByIdAndDelete({
            _id: leaveId
        })
        return res.status(200).json(userLeave);
    } catch (err) {
        res.status(500).json(err.message);
    }
}
module.exports.getWorkerRequests = async function (req, res, next) {
    const workerId = req.params.id
    if (!ObjectId.isValid(workerId)) {
        return res.status(400).json("Invalid User ID")
    }
    try {
        const workerRequests = await Leave.find({
            supervisor: workerId
        })
        res.status(200).json(workerRequests)
    } catch (error) {
        res.status(500).json(error)
    }
}
module.exports.getLeaveRequestForOdoo = async function (req, res, next) {
    try {


        const query = { status: "Approved" };

        const totalDocuments = await Leave.countDocuments(query);
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const totalPages = Math.ceil(totalDocuments / limit);
        const formattedPayload = [];

        const allValidRequests = await Leave.find(query)
            .populate([
                {
                    path: "applicant",
                    select: "firstName lastName matricule -_id"
                },
                {
                    path: "supervisor",
                    select: "firstName lastName"
                }
            ])
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

        for (let i = 0; i < allValidRequests.length; i++) {
            const supervisorWithoutId = { ...allValidRequests[i].supervisor.toObject() };
            delete supervisorWithoutId._id;
            if (allValidRequests[i].supervisor._id != "65ba6197ef6b541fb7af077c") {
                formattedPayload.push({
                    "Employé": allValidRequests[i].applicant,
                    "Type_congé": allValidRequests[i].type,
                    "Date_début": allValidRequests[i].startDate,
                    "Date_fin": allValidRequests[i].endDate,
                    "Validateur": [{
                        validateur_primaire: supervisorWithoutId,
                        validateur_final: {
                            firstName: "Hedi",
                            lastName: "Jaiet"
                        }
                    }],
                    "Description": allValidRequests[i].note
                })
            } else {
                formattedPayload.push({
                    "Employé": allValidRequests[i].applicant,
                    "Type_congé": allValidRequests[i].type,
                    "Date_début": allValidRequests[i].startDate,
                    "Date_fin": allValidRequests[i].endDate,
                    "Validateur": [{
                        validateur_final: supervisorWithoutId,
                    }],
                    "Description": allValidRequests[i].note
                })
            }
        }
        res.status(200).json({
            status: 200,
            message: "Leaves retrieved successfully!",
            data: formattedPayload,
            pagination: {
                totalDocuments,
                totalPages,
                currentPage: page,
                limit,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1
            },
            error: false
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 500,
            message: "Something went wrong!",
            log: error.message,
            error: true
        });
    }
};





module.exports.getLeaveStats = async (req, res) => {
    try {
        const {
            period,
            type,
            startDate,
            endDate,
            department,
        } = req.query;

        // Date filter (unchanged)
        let dateFilter = {};
        let now = moment();
        if (period === 'week') {
            dateFilter = { createdAt: { $gte: now.subtract(1, 'week').toDate() } };
        } else if (period === 'quarter') {
            dateFilter = { createdAt: { $gte: now.subtract(3, 'months').toDate() } };
        } else if (period === 'year') {
            dateFilter = { createdAt: { $gte: now.subtract(1, 'year').toDate() } };
        } else if (period === 'month') {
            dateFilter = { createdAt: { $gte: now.subtract(1, 'month').toDate() } };
        } else if (startDate && endDate) {
            dateFilter = { createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) } };
        }

        const matchStage = { ...dateFilter };
        if (type) matchStage.type = type;

        const stats = await Leave.aggregate([
            { $match: matchStage },
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
                $facet: {
                    totalRequests: [{ $count: 'count' }],
                    approvedCount: [
                        { $match: { managerAccepted: true, supervisorAccepted: true } },
                        { $count: 'count' }
                    ],
                    pendingCount: [
                        { $match: { $or: [{ managerAccepted: false }, { supervisorAccepted: false }] } },
                        { $count: 'count' }
                    ],
                    rejectedCount: [
                        { $match: { status: /Declined|Rejected/i } },
                        { $count: 'count' }
                    ],
                    approvalRate: [
                        {
                            $group: {
                                _id: null,
                                approved: { $sum: { $cond: [{ $and: ['$managerAccepted', '$supervisorAccepted'] }, 1, 0] } },
                                total: { $sum: 1 }
                            }
                        },
                        { $project: { rate: { $multiply: [{ $divide: ['$approved', '$total'] }, 100] } } }
                    ],
                    avgDuration: [
                        { $match: { managerAccepted: true, supervisorAccepted: true } },
                        { $addFields: { duration: { $divide: [{ $subtract: ['$endDate', '$startDate'] }, 86400000] } } },
                        { $group: { _id: null, avg: { $avg: '$duration' } } }
                    ],
                    totalApprovedDays: [
                        { $match: { managerAccepted: true, supervisorAccepted: true } },
                        { $addFields: { duration: { $divide: [{ $subtract: ['$endDate', '$startDate'] }, 86400000] } } },
                        { $group: { _id: null, total: { $sum: '$duration' } } }
                    ],
                    leavePerEmployee: [
                        { $match: { managerAccepted: true, supervisorAccepted: true } },
                        { $addFields: { duration: { $divide: [{ $subtract: ['$endDate', '$startDate'] }, 86400000] } } },
                        { $group: { _id: '$applicant', totalDays: { $sum: '$duration' } } },
                        { $group: { _id: null, avg: { $avg: '$totalDays' } } }
                    ],
                    byType: [
                        { $group: { _id: '$type', count: { $sum: 1 }, days: { $sum: { $divide: [{ $subtract: ['$endDate', '$startDate'] }, 86400000] } } } },
                        { $sort: { count: -1 } }
                    ],
                    monthlyTrend: [
                        { $match: { managerAccepted: true, supervisorAccepted: true } },
                        { $addFields: { duration: { $divide: [{ $subtract: ['$endDate', '$startDate'] }, 86400000] } } },
                        {
                            $group: {
                                _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
                                count: { $sum: 1 },
                                days: { $sum: '$duration' }
                            }
                        },
                        { $sort: { _id: 1 } }
                    ],
                    pendingMonthlyTrend: [
                        {
                            $match: {
                                $or: [{ managerAccepted: false }, { supervisorAccepted: false }]
                            }
                        },
                        { $addFields: { duration: { $divide: [{ $subtract: ['$endDate', '$startDate'] }, 86400000] } } },
                        {
                            $group: {
                                _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
                                count: { $sum: 1 },
                                days: { $sum: '$duration' }
                            }
                        },
                        { $sort: { _id: 1 } }
                    ],
                    avgApprovalTime: [
                        { $match: { managerAccepted: true, supervisorAccepted: true } },
                        { $addFields: { approvalTime: { $divide: [{ $subtract: ['$updatedAt', '$createdAt'] }, 86400000] } } },
                        { $group: { _id: null, avg: { $avg: '$approvalTime' } } }
                    ],
                    topTakers: [
                        { $match: { managerAccepted: true, supervisorAccepted: true } },
                        { $addFields: { duration: { $divide: [{ $subtract: ['$endDate', '$startDate'] }, 86400000] } } },
                        {
                            $group: {
                                _id: '$applicant',
                                count: { $sum: 1 },
                                days: { $sum: '$duration' },
                                fullName: { $first: '$fullName' },
                                lastLeaveDate: { $max: '$startDate' },
                                department: { $first: '$applicantInfo.departement' }
                            }
                        },
                        { $sort: { days: -1 } },
                        { $limit: 10 }
                    ],
                    peakDays: [
                        { $match: { managerAccepted: true, supervisorAccepted: true } },
                        { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$startDate' } }, overlapping: { $sum: 1 } } },
                        { $sort: { overlapping: -1 } },
                        { $limit: 10 }
                    ],
                    byDepartment: [
                        { $match: { managerAccepted: true, supervisorAccepted: true } },
                        { $addFields: { duration: { $divide: [{ $subtract: ['$endDate', '$startDate'] }, 86400000] } } },
                        {
                            $group: {
                                _id: '$applicantInfo.departement',
                                totalDays: { $sum: '$duration' },
                                requestCount: { $sum: 1 }
                            }
                        },
                        { $sort: { totalDays: -1 } }
                    ],

                    currentRemainingBalance: [
                        { $match: { managerAccepted: true, supervisorAccepted: true } },

                        // Only current year leaves
                        {
                            $match: {
                                $expr: {
                                    $eq: [{ $year: "$startDate" }, { $year: new Date() }]
                                }
                            }
                        },

                        {
                            $addFields: {
                                duration: { $divide: [{ $subtract: ['$endDate', '$startDate'] }, 86400000] }
                            }
                        },

                        // Sum used days per user
                        {
                            $group: {
                                _id: '$applicant',
                                fullName: { $first: '$fullName' },
                                usedDays: { $sum: '$duration' }
                            }
                        },

                        // Fixed entitlement: 24 days per year
                        {
                            $addFields: {
                                entitlement: 24,
                                remaining: { $subtract: [24, '$usedDays'] }
                            }
                        },

                        { $sort: { remaining: 1 } }, // lowest remaining first (most critical)
                        { $limit: 20 } // top 20 most urgent
                    ],
                }
            },
            {
                $project: {
                    pendingLeaves: { $arrayElemAt: ['$pendingCount.count', 0] },
                    approvalRate: { $arrayElemAt: ['$approvalRate.rate', 0] },
                    totalApprovedLeaveDays: { $arrayElemAt: ['$totalApprovedDays.total', 0] },
                    leaveDaysPerEmployee: { $arrayElemAt: ['$leavePerEmployee.avg', 0] },
                    leaveByType: '$byType',
                    monthlyLeaveTrend: '$monthlyTrend',
                    pendingMonthlyTrend: '$pendingMonthlyTrend',
                    averageApprovalTime: { $arrayElemAt: ['$avgApprovalTime.avg', 0] },
                    peakOverlapDays: '$peakDays',
                    topLeaveTakers: {
                        $map: {
                            input: '$topTakers',
                            as: 'taker',
                            in: {
                                $mergeObjects: [
                                    '$$taker',
                                    {
                                        avgDaysPerRequest: { $divide: ['$$taker.days', '$$taker.count'] },
                                        percentageOfTotal: {
                                            $cond: [
                                                { $gt: [{ $arrayElemAt: ['$totalApprovedDays.total', 0] }, 0] },
                                                {
                                                    $multiply: [
                                                        { $divide: ['$$taker.days', { $arrayElemAt: ['$totalApprovedDays.total', 0] }] },
                                                        100
                                                    ]
                                                },
                                                0
                                            ]
                                        }
                                    }
                                ]
                            }
                        }
                    },
                    leaveByDepartment: '$byDepartment',

                    // NEW
                    currentRemainingBalance: '$currentRemainingBalance'
                }
            }
        ]);

        res.json(stats[0] || {});
    } catch (error) {
        console.error('Leave stats error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


module.exports.getMyLeaveStats = async (req, res) => {
  try {
    const userId = req.user.id;
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const { year, month } = req.query;

    let startDate = new Date(Number(year || new Date().getFullYear()), 0, 1);
    let endDate = new Date(Number(year || new Date().getFullYear()), 11, 31, 23, 59, 59);

    if (month && Number(month) >= 1 && Number(month) <= 12) {
      startDate = new Date(Number(year || new Date().getFullYear()), Number(month) - 1, 1);
      endDate = new Date(Number(year || new Date().getFullYear()), Number(month), 0, 23, 59, 59);
    }

    const matchStage = {
      applicant: mongoose.Types.ObjectId(userId),
      startDate: { $gte: startDate, $lte: endDate }
    };

    const stats = await Leave.aggregate([
      { $match: matchStage },
      {
        $facet: {
          totalRequests: [{ $count: 'count' }],

          approvedStats: [
            { $match: { managerAccepted: true, supervisorAccepted: true } },
            {
              $addFields: {
                durationDays: {
                  $switch: {
                    branches: [
                      // 1/2 Day = always 0.5
                      { case: { $eq: ['$type', '1/2 day'] }, then: 0.5 },

                      // Authorization = real hours / 9.5 hours per day
                      {
                        case: { $eq: ['$type', 'Authorization'] },
                        then: {
                          $divide: [
                            { $divide: [{ $subtract: ['$endDate', '$startDate'] }, 3600000] }, // hours
                            9.5
                          ]
                        }
                      },

                      // All other types (Personal Leave, etc.)
                      {
                        case: { $gt: ['$endDate', '$startDate'] },
                        then: {
                          $add: [
                            { $floor: { $divide: [{ $subtract: ['$endDate', '$startDate'] }, 86400000] } },
                            1
                          ]
                        }
                      }
                    ],
                    default: 1   // same day = 1 day
                  }
                }
              }
            },
            {
              $group: {
                _id: null,
                totalDays: { $sum: '$durationDays' },
                count: { $sum: 1 }
              }
            }
          ],

          pendingStats: [
            { $match: { $nor: [{ managerAccepted: true, supervisorAccepted: true }] } },
            { $count: 'count' }
          ],

          leaveByType: [
            { $match: { managerAccepted: true, supervisorAccepted: true } },
            {
              $addFields: {
                durationDays: {
                  $switch: {
                    branches: [
                      { case: { $eq: ['$type', '1/2 day'] }, then: 0.5 },
                      {
                        case: { $eq: ['$type', 'Authorization'] },
                        then: { $divide: [{ $divide: [{ $subtract: ['$endDate', '$startDate'] }, 3600000] }, 9.5] }
                      },
                      {
                        case: { $gt: ['$endDate', '$startDate'] },
                        then: { $add: [{ $floor: { $divide: [{ $subtract: ['$endDate', '$startDate'] }, 86400000] } }, 1] }
                      }
                    ],
                    default: 1
                  }
                }
              }
            },
            { $group: { _id: '$type', days: { $sum: '$durationDays' } } }
          ],

          monthlyTrend: [
            { $match: { managerAccepted: true, supervisorAccepted: true } },
            {
              $addFields: {
                durationDays: {
                  $switch: {
                    branches: [
                      { case: { $eq: ['$type', '1/2 day'] }, then: 0.5 },
                      {
                        case: { $eq: ['$type', 'Authorization'] },
                        then: { $divide: [{ $divide: [{ $subtract: ['$endDate', '$startDate'] }, 3600000] }, 9.5] }
                      },
                      {
                        case: { $gt: ['$endDate', '$startDate'] },
                        then: { $add: [{ $floor: { $divide: [{ $subtract: ['$endDate', '$startDate'] }, 86400000] } }, 1] }
                      }
                    ],
                    default: 1
                  }
                }
              }
            },
            {
              $group: {
                _id: { $dateToString: { format: '%Y-%m', date: '$startDate' } },
                days: { $sum: '$durationDays' }
              }
            },
            { $sort: { _id: 1 } }
          ],

          avgDuration: [
            { $match: { managerAccepted: true, supervisorAccepted: true } },
            {
              $addFields: {
                durationDays: {
                  $switch: {
                    branches: [
                      { case: { $eq: ['$type', '1/2 day'] }, then: 0.5 },
                      {
                        case: { $eq: ['$type', 'Authorization'] },
                        then: { $divide: [{ $divide: [{ $subtract: ['$endDate', '$startDate'] }, 3600000] }, 9.5] }
                      },
                      {
                        case: { $gt: ['$endDate', '$startDate'] },
                        then: { $add: [{ $floor: { $divide: [{ $subtract: ['$endDate', '$startDate'] }, 86400000] } }, 1] }
                      }
                    ],
                    default: 1
                  }
                }
              }
            },
            { $group: { _id: null, avg: { $avg: '$durationDays' } } }
          ],

          last5Leaves: [
            { $sort: { createdAt: -1 } },
            { $limit: 5 },
            {
              $project: {
                type: 1,
                startDate: 1,
                endDate: 1,
                status: 1,
                managerAccepted: 1,
                supervisorAccepted: 1,
                createdAt: 1,
                note: 1,
                durationDays: {
                  $switch: {
                    branches: [
                      { case: { $eq: ['$type', '1/2 day'] }, then: 0.5 },
                      {
                        case: { $eq: ['$type', 'Authorization'] },
                        then: { $divide: [{ $divide: [{ $subtract: ['$endDate', '$startDate'] }, 3600000] }, 9.5] }
                      },
                      {
                        case: { $gt: ['$endDate', '$startDate'] },
                        then: { $add: [{ $floor: { $divide: [{ $subtract: ['$endDate', '$startDate'] }, 86400000] } }, 1] }
                      }
                    ],
                    default: 1
                  }
                }
              }
            }
          ]
        }
      }
    ]);

    const result = stats[0] || {};

    res.json({
      totalRequests: result.totalRequests?.[0]?.count || 0,
      approvedDays: result.approvedStats?.[0]?.totalDays || 0,
      pendingRequests: result.pendingStats?.[0]?.count || 0,
      leaveByType: result.leaveByType || [],
      monthlyTrend: result.monthlyTrend || [],
      avgDuration: result.avgDuration?.[0]?.avg || 0,
      last5Leaves: result.last5Leaves || []
    });

  } catch (error) {
    console.error('My Leave Stats Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};