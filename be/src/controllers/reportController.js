import { Report } from '../models/ReportModel.js';
import { User } from '../models/UserModel.js';
import { WorkerProfile } from '../models/WorkerProfileModel.js';

// @desc    Create new report (Field Worker)
// @route   POST /api/reports
// @access  Private (Worker only)
export const createReport = async (req, res) => {
  try {
    const {
      region,
      reliefType,
      disasterType,
      quantity,
      beneficiaryCount,
      notes,
    } = req.body;
    
    // Validate required fields
    if (!region || !reliefType || !disasterType) {
      return res.status(400).json({
        success: false,
        message: 'Region, relief type, and disaster type are required',
      });
    }

    const report = await Report.create({
      workerId: req.user.workerId,
      workerName: req.user.name,
      worker: req.user.id,
      region,
      reliefType,
      disasterType,
      quantity: quantity || 0,
      beneficiaryCount: beneficiaryCount || 0,
      notes: notes || '',
      status: 'Pending Review',
      ticketStatus: 'Open',
      ngoResponse: 'We have received your report and will review it shortly.',
    });

    // Update worker submission count
    await WorkerProfile.findOneAndUpdate(
      { userId: req.user.id },
      { $inc: { submissionCount: 1 } }
    );

    res.status(201).json({
      success: true,
      data: report,
    });
  } catch (error) {
    console.error('Create report error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating report',
      error: error.message,
    });
  }
};

// @desc    Get all reports (NGO Admin)
// @route   GET /api/reports
// @access  Private (Admin only)
export const getReports = async (req, res) => {
  try {
    const {
      searchTerm,
      region,
      status,
      reliefType,
      disasterType,
      startDate,
      endDate,
      page = 1,
      limit = 50,
    } = req.query;

    let query = {};

    // Apply filters
    if (searchTerm && searchTerm !== 'all') {
      query.$or = [
        { submissionId: { $regex: searchTerm, $options: 'i' } },
        { workerName: { $regex: searchTerm, $options: 'i' } },
        { region: { $regex: searchTerm, $options: 'i' } },
        { notes: { $regex: searchTerm, $options: 'i' } },
        { disasterType: { $regex: searchTerm, $options: 'i' } },
      ];
    }

    if (region && region !== 'all') {
      query.region = region;
    }

    if (status && status !== 'all') {
      query.status = status;
    }

    if (reliefType && reliefType !== 'all') {
      query.reliefType = reliefType;
    }

    if (disasterType && disasterType !== 'all') {
      query.disasterType = disasterType;
    }

    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [reports, total] = await Promise.all([
      Report.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Report.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      count: reports.length,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
      data: reports,
    });
  } catch (error) {
    console.error('Get reports error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching reports',
      error: error.message,
    });
  }
};

// @desc    Get worker's own reports
// @route   GET /api/reports/my-reports
// @access  Private (Worker only)
export const getMyReports = async (req, res) => {
  try {
    const reports = await Report.find({ worker: req.user.id })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reports.length,
      data: reports,
    });
  } catch (error) {
    console.error('Get my reports error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching your reports',
      error: error.message,
    });
  }
};

// @desc    Get single report
// @route   GET /api/reports/:id
// @access  Private
export const getReportById = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found',
      });
    }

    // Check authorization
    if (req.user.role === 'worker' && report.worker.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this report',
      });
    }

    res.status(200).json({
      success: true,
      data: report,
    });
  } catch (error) {
    console.error('Get report error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching report',
      error: error.message,
    });
  }
};

// @desc    Update report (Worker only - for pending reports)
// @route   PUT /api/reports/:id
// @access  Private (Worker only)
export const updateReport = async (req, res) => {
  try {
    const {
      region,
      reliefType,
      disasterType,
      quantity,
      beneficiaryCount,
      notes,
    } = req.body;

    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found',
      });
    }

    // Check authorization - only worker who created can edit
    if (report.worker.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to edit this report',
      });
    }

    // Only allow editing if status is 'Pending Review'
    if (report.status !== 'Pending Review') {
      return res.status(400).json({
        success: false,
        message: 'Can only edit reports with Pending Review status',
      });
    }

    // Update report
    report.region = region || report.region;
    report.reliefType = reliefType || report.reliefType;
    report.disasterType = disasterType || report.disasterType;
    report.quantity = quantity !== undefined ? quantity : report.quantity;
    report.beneficiaryCount = beneficiaryCount !== undefined ? beneficiaryCount : report.beneficiaryCount;
    report.notes = notes !== undefined ? notes : report.notes;

    await report.save();

    res.status(200).json({
      success: true,
      message: 'Report updated successfully',
      data: report,
    });
  } catch (error) {
    console.error('Update report error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating report',
      error: error.message,
    });
  }
};

// @desc    Update report status (NGO Admin)
// @route   PUT /api/reports/:id/status
// @access  Private (Admin only)
export const updateReportStatus = async (req, res) => {
  try {
    const { status, ngoResponse } = req.body;

    const updateData = {
      status,
      ngoResponseDate: new Date(),
    };

    if (ngoResponse) {
      updateData.ngoResponse = ngoResponse;
    }

    const report = await Report.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found',
      });
    }

    res.status(200).json({
      success: true,
      data: report,
    });
  } catch (error) {
    console.error('Update report status error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating report status',
      error: error.message,
    });
  }
};

// @desc    Mark report as viewed by NGO
// @route   PUT /api/reports/:id/view
// @access  Private (Admin only)
export const markAsViewed = async (req, res) => {
  try {
    const report = await Report.findByIdAndUpdate(
      req.params.id,
      {
        viewedByNGO: true,
        viewedAt: new Date(),
      },
      { new: true }
    );

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found',
      });
    }

    res.status(200).json({
      success: true,
      data: report,
    });
  } catch (error) {
    console.error('Mark as viewed error:', error);
    res.status(500).json({
      success: false,
      message: 'Error marking report as viewed',
      error: error.message,
    });
  }
};

// @desc    Add custom NGO response
// @route   PUT /api/reports/:id/response
// @access  Private (Admin only)
export const addCustomResponse = async (req, res) => {
  try {
    const { responseMessage } = req.body;

    const report = await Report.findByIdAndUpdate(
      req.params.id,
      {
        ngoResponse: responseMessage,
        ngoResponseDate: new Date(),
      },
      { new: true }
    );

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found',
      });
    }

    res.status(200).json({
      success: true,
      data: report,
    });
  } catch (error) {
    console.error('Add response error:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding response',
      error: error.message,
    });
  }
};

// @desc    Add worker acknowledgment
// @route   PUT /api/reports/:id/acknowledge
// @access  Private (Worker only)
export const addAcknowledgment = async (req, res) => {
  try {
    const { acknowledgmentMessage } = req.body;

    const report = await Report.findByIdAndUpdate(
      req.params.id,
      {
        workerAcknowledgment: acknowledgmentMessage,
        acknowledgmentDate: new Date(),
        status: 'Acknowledged',
      },
      { new: true }
    );

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found',
      });
    }

    // Verify ownership
    if (report.worker.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to acknowledge this report',
      });
    }

    res.status(200).json({
      success: true,
      data: report,
    });
  } catch (error) {
    console.error('Add acknowledgment error:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding acknowledgment',
      error: error.message,
    });
  }
};

// @desc    Get dashboard stats for NGO
// @route   GET /api/reports/stats
// @access  Private (Admin only)
export const getStats = async (req, res) => {
  try {
    const [
      totalReports,
      pendingReports,
      approvedReports,
      deliveredReports,
      verifiedReports,
      rejectedReports,
      acknowledgedReports,
    ] = await Promise.all([
      Report.countDocuments(),
      Report.countDocuments({ status: 'Pending Review' }),
      Report.countDocuments({ status: 'Approved' }),
      Report.countDocuments({ status: 'Delivered' }),
      Report.countDocuments({ status: 'Verified' }),
      Report.countDocuments({ status: 'Rejected' }),
      Report.countDocuments({ status: 'Acknowledged' }),
    ]);

    const beneficiaryResult = await Report.aggregate([
      { $group: { _id: null, total: { $sum: '$beneficiaryCount' } } },
    ]);

    const reportsByRegion = await Report.aggregate([
      { $group: { _id: '$region', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);

    const recentReports = await Report.find()
      .sort({ createdAt: -1 })
      .limit(10);

    res.status(200).json({
      success: true,
      data: {
        totalReports,
        pendingReports,
        approvedReports,
        deliveredReports,
        verifiedReports,
        rejectedReports,
        acknowledgedReports,
        totalBeneficiaries: beneficiaryResult[0]?.total || 0,
        reportsByRegion,
        recentReports,
      },
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching statistics',
      error: error.message,
    });
  }
};

// @desc    Global search (NGO Admin)
// @route   GET /api/reports/search/global
// @access  Private (Admin only)
export const globalSearch = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.trim().length < 2) {
      return res.status(200).json({
        success: true,
        data: { reports: [], tickets: [] },
      });
    }

    const searchRegex = { $regex: q, $options: 'i' };

    const reports = await Report.find({
      $or: [
        { submissionId: searchRegex },
        { workerName: searchRegex },
        { region: searchRegex },
        { notes: searchRegex },
        { disasterType: searchRegex },
        { ngoResponse: searchRegex },
      ],
    })
      .limit(20)
      .sort({ createdAt: -1 });

    // Import Ticket model dynamically to avoid circular dependency
    const { Ticket } = await import('../models/TicketModel.js');
    
    const tickets = await Ticket.find({
      $or: [
        { ticketId: searchRegex },
        { title: searchRegex },
        { workerName: searchRegex },
        { region: searchRegex },
        { description: searchRegex },
      ],
    })
      .limit(10)
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: {
        reports,
        tickets,
      },
    });
  } catch (error) {
    console.error('Global search error:', error);
    res.status(500).json({
      success: false,
      message: 'Error performing search',
      error: error.message,
    });
  }
};
