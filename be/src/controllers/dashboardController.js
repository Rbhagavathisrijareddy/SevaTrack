import { Report } from '../models/ReportModel.js';
import { Ticket } from '../models/TicketModel.js';
import { User } from '../models/UserModel.js';
import { WorkerProfile } from '../models/WorkerProfileModel.js';

// @desc    Get NGO dashboard data
// @route   GET /api/dashboard/ngo
// @access  Private (Admin only)
export const getNgoDashboard = async (req, res) => {
  try {
    // Report statistics
    const reportStats = await Report.aggregate([
      {
        $facet: {
          total: [{ $count: 'count' }],
          byStatus: [
            { $group: { _id: '$status', count: { $sum: 1 } } },
          ],
          beneficiaries: [
            { $group: { _id: null, total: { $sum: '$beneficiaryCount' } } },
          ],
          recent: [
            { $sort: { createdAt: -1 } },
            { $limit: 10 },
          ],
        },
      },
    ]);

    // Ticket statistics
    const ticketStats = await Ticket.aggregate([
      {
        $facet: {
          byStatus: [
            { $group: { _id: '$status', count: { $sum: 1 } } },
          ],
          byPriority: [
            { $group: { _id: '$priority', count: { $sum: 1 } } },
          ],
        },
      },
    ]);

    // Worker statistics
    const workerCount = await User.countDocuments({ role: 'worker' });
    const activeWorkers = await WorkerProfile.countDocuments({ status: 'active' });

    // Reports by region
    const reportsByRegion = await Report.aggregate([
      { $group: { _id: '$region', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);

    // Recent activity (combine reports and tickets)
    const recentReports = await Report.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('submissionId workerName region status createdAt');

    const recentTickets = await Ticket.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('ticketId title workerName status priority createdAt');

    // Calculate approval rate
    const totalReviewed = await Report.countDocuments({
      status: { $in: ['Approved', 'Rejected', 'Verified', 'Delivered'] },
    });
    const approvedCount = await Report.countDocuments({
      status: { $in: ['Approved', 'Verified', 'Delivered'] },
    });
    const approvalRate = totalReviewed > 0 ? (approvedCount / totalReviewed) * 100 : 0;

    res.status(200).json({
      success: true,
      data: {
        reports: {
          total: reportStats[0]?.total[0]?.count || 0,
          pending: reportStats[0]?.byStatus.find(s => s._id === 'Pending Review')?.count || 0,
          approved: reportStats[0]?.byStatus.find(s => s._id === 'Approved')?.count || 0,
          delivered: reportStats[0]?.byStatus.find(s => s._id === 'Delivered')?.count || 0,
          verified: reportStats[0]?.byStatus.find(s => s._id === 'Verified')?.count || 0,
          rejected: reportStats[0]?.byStatus.find(s => s._id === 'Rejected')?.count || 0,
          acknowledged: reportStats[0]?.byStatus.find(s => s._id === 'Acknowledged')?.count || 0,
          totalBeneficiaries: reportStats[0]?.beneficiaries[0]?.total || 0,
          approvalRate: Math.round(approvalRate),
          recent: reportStats[0]?.recent || [],
        },
        tickets: {
          open: ticketStats[0]?.byStatus.find(s => s._id === 'Open')?.count || 0,
          inProgress: ticketStats[0]?.byStatus.find(s => s._id === 'In Progress')?.count || 0,
          resolved: ticketStats[0]?.byStatus.find(s => s._id === 'Resolved')?.count || 0,
          closed: ticketStats[0]?.byStatus.find(s => s._id === 'Closed')?.count || 0,
          highPriority: ticketStats[0]?.byPriority.find(p => p._id === 'High')?.count || 0,
          mediumPriority: ticketStats[0]?.byPriority.find(p => p._id === 'Medium')?.count || 0,
          lowPriority: ticketStats[0]?.byPriority.find(p => p._id === 'Low')?.count || 0,
        },
        workers: {
          total: workerCount,
          active: activeWorkers,
        },
        reportsByRegion,
        recentActivity: {
          reports: recentReports,
          tickets: recentTickets,
        },
      },
    });
  } catch (error) {
    console.error('Get NGO dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard data',
      error: error.message,
    });
  }
};

// @desc    Get Worker dashboard data
// @route   GET /api/dashboard/worker
// @access  Private (Worker only)
export const getWorkerDashboard = async (req, res) => {
  try {
    const workerId = req.user.id;

    const reports = await Report.find({ worker: workerId });
    const tickets = await Ticket.find({ worker: workerId });

    const totalReports = reports.length;
    const approvedReports = reports.filter(r => r.status === 'Approved').length;
    const pendingReports = reports.filter(r => r.status === 'Pending Review').length;
    const rejectedReports = reports.filter(r => r.status === 'Rejected').length;
    const deliveredReports = reports.filter(r => r.status === 'Delivered').length;
    const verifiedReports = reports.filter(r => r.status === 'Verified').length;
    const acknowledgedReports = reports.filter(r => r.status === 'Acknowledged').length;

    const totalBeneficiaries = reports.reduce((sum, r) => sum + (r.beneficiaryCount || 0), 0);
    const acknowledgmentCount = reports.filter(r => r.workerAcknowledgment).length;

    const approvalRate = totalReports > 0 ? (approvedReports / totalReports) * 100 : 0;

    const openTickets = tickets.filter(t => t.status === 'Open').length;
    const inProgressTickets = tickets.filter(t => t.status === 'In Progress').length;
    const resolvedTickets = tickets.filter(t => t.status === 'Resolved').length;

    // Group reports by region
    const reportsByRegion = reports.reduce((acc, r) => {
      acc[r.region] = (acc[r.region] || 0) + 1;
      return acc;
    }, {});

    const recentReports = reports
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);

    const recentTickets = tickets
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);

    // Get worker profile
    const workerProfile = await WorkerProfile.findOne({ userId: workerId });

    res.status(200).json({
      success: true,
      data: {
        reports: {
          total: totalReports,
          approved: approvedReports,
          pending: pendingReports,
          rejected: rejectedReports,
          delivered: deliveredReports,
          verified: verifiedReports,
          acknowledged: acknowledgedReports,
          totalBeneficiaries,
          acknowledgmentCount,
          approvalRate: Math.round(approvalRate),
          byRegion: reportsByRegion,
          recent: recentReports,
        },
        tickets: {
          total: tickets.length,
          open: openTickets,
          inProgress: inProgressTickets,
          resolved: resolvedTickets,
          recent: recentTickets,
        },
        profile: {
          submissionCount: workerProfile?.submissionCount || 0,
          status: workerProfile?.status || 'active',
          phone: workerProfile?.phone,
          location: workerProfile?.location,
        },
      },
    });
  } catch (error) {
    console.error('Get worker dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard data',
      error: error.message,
    });
  }
};
