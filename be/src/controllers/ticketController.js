import { Ticket } from '../models/TicketModel.js';

// @desc    Create new ticket (Field Worker)
// @route   POST /api/tickets
// @access  Private (Worker only)
export const createTicket = async (req, res) => {
  try {
    const { title, description, priority, region } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: 'Title and description are required',
      });
    }

    const ticket = await Ticket.create({
      title,
      description,
      priority: priority || 'Medium',
      region: region || null,
      workerName: req.user.name,
      workerId: req.user.workerId,
      worker: req.user.id,
      status: 'Open',
    });

    res.status(201).json({
      success: true,
      data: ticket,
    });
  } catch (error) {
    console.error('Create ticket error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating ticket',
      error: error.message,
    });
  }
};

// @desc    Get all tickets (NGO Admin)
// @route   GET /api/tickets
// @access  Private (Admin only)
export const getTickets = async (req, res) => {
  try {
    const { status, priority, searchTerm, page = 1, limit = 50 } = req.query;

    let query = {};

    if (status && status !== 'all') {
      query.status = status;
    }

    if (priority && priority !== 'all') {
      query.priority = priority;
    }

    if (searchTerm) {
      query.$or = [
        { ticketId: { $regex: searchTerm, $options: 'i' } },
        { title: { $regex: searchTerm, $options: 'i' } },
        { workerName: { $regex: searchTerm, $options: 'i' } },
        { region: { $regex: searchTerm, $options: 'i' } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [tickets, total] = await Promise.all([
      Ticket.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Ticket.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      count: tickets.length,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
      data: tickets,
    });
  } catch (error) {
    console.error('Get tickets error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching tickets',
      error: error.message,
    });
  }
};

// @desc    Get worker's own tickets
// @route   GET /api/tickets/my-tickets
// @access  Private (Worker only)
export const getMyTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find({ worker: req.user.id })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: tickets.length,
      data: tickets,
    });
  } catch (error) {
    console.error('Get my tickets error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching your tickets',
      error: error.message,
    });
  }
};

// @desc    Get single ticket
// @route   GET /api/tickets/:id
// @access  Private
export const getTicketById = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found',
      });
    }

    // Check authorization
    if (req.user.role === 'worker' && ticket.worker.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this ticket',
      });
    }

    res.status(200).json({
      success: true,
      data: ticket,
    });
  } catch (error) {
    console.error('Get ticket error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching ticket',
      error: error.message,
    });
  }
};

// @desc    Update ticket status (NGO Admin)
// @route   PUT /api/tickets/:id/status
// @access  Private (Admin only)
export const updateTicketStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!['Open', 'In Progress', 'Resolved', 'Closed'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value',
      });
    }

    const ticket = await Ticket.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found',
      });
    }

    res.status(200).json({
      success: true,
      data: ticket,
    });
  } catch (error) {
    console.error('Update ticket status error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating ticket status',
      error: error.message,
    });
  }
};

// @desc    Add response to ticket (NGO Admin)
// @route   PUT /api/tickets/:id/response
// @access  Private (Admin only)
export const addTicketResponse = async (req, res) => {
  try {
    const { response } = req.body;

    if (!response) {
      return res.status(400).json({
        success: false,
        message: 'Response message is required',
      });
    }

    const ticket = await Ticket.findByIdAndUpdate(
      req.params.id,
      {
        ngoResponse: response,
        responseDate: new Date(),
        status: 'In Progress',
      },
      { new: true }
    );

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found',
      });
    }

    res.status(200).json({
      success: true,
      data: ticket,
    });
  } catch (error) {
    console.error('Add ticket response error:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding response',
      error: error.message,
    });
  }
};

// @desc    Get ticket statistics (NGO Admin)
// @route   GET /api/tickets/stats
// @access  Private (Admin only)
export const getTicketStats = async (req, res) => {
  try {
    const [open, inProgress, resolved, closed] = await Promise.all([
      Ticket.countDocuments({ status: 'Open' }),
      Ticket.countDocuments({ status: 'In Progress' }),
      Ticket.countDocuments({ status: 'Resolved' }),
      Ticket.countDocuments({ status: 'Closed' }),
    ]);

    const highPriority = await Ticket.countDocuments({ priority: 'High' });
    const mediumPriority = await Ticket.countDocuments({ priority: 'Medium' });
    const lowPriority = await Ticket.countDocuments({ priority: 'Low' });

    res.status(200).json({
      success: true,
      data: {
        open,
        inProgress,
        resolved,
        closed,
        total: open + inProgress + resolved + closed,
        priorities: {
          high: highPriority,
          medium: mediumPriority,
          low: lowPriority,
        },
      },
    });
  } catch (error) {
    console.error('Get ticket stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching ticket statistics',
      error: error.message,
    });
  }
};
