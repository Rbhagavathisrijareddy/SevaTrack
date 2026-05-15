import React, { createContext, useContext, useState, useEffect } from 'react';

const DataContext = createContext();

export const useData = () => useContext(DataContext);

// Generate initial mock data
const generateInitialData = () => {
  const regions = ["Vizag Coastal", "East Godavari", "Guntur", "Chennai Metro", "Kerala Backwaters", "Odisha Cyclone Zone", "Maharashtra Floodplain", "Gujarat Drought Region", "Bihar Flood Zone", "Assam Valley"];
  const reliefTypes = ["Food Packets", "Medical Kits", "Water Cans", "Shelter Tents", "Hygiene Kits", "Baby Supplies", "Clothing", "Cash Assistance", "Tarpaulins", "Blankets"];
  const disasterTypes = ["Flood", "Cyclone", "Earthquake", "Landslide", "Drought", "Tsunami", "Urban Flooding", "Heatwave", "Wildfire", "Storm Surge"];
  const statuses = ["Pending Review", "Approved", "Delivered", "Verified", "Rejected"];
  const ticketStatuses = ["Open", "In Progress", "Resolved", "Closed"];
  const workerNames = ["Aarav Sharma", "Vihaan Gupta", "Ananya Reddy", "Diya Nair", "Kavya Singh", "Ishaan Mehta", "Rohan Patil", "Sanya Joshi", "Aditya Verma", "Neha Kulkarni", "Priya Menon", "Rajesh Khanna"];
  
  const reports = [];
  const tickets = [];
  
  for (let i = 1; i <= 50; i++) {
    const region = regions[i % regions.length];
    const reliefType = reliefTypes[i % reliefTypes.length];
    const disasterType = disasterTypes[i % disasterTypes.length];
    const worker = workerNames[i % workerNames.length];
    const workerId = `WRK-${1000 + i}`;
    const timestamp = new Date(Date.now() - Math.random() * 30 * 24 * 3600000).toISOString();
    const status = statuses[i % statuses.length];
    const ticketStatus = ticketStatuses[i % ticketStatuses.length];
    const quantity = Math.floor(Math.random() * 800) + 50;
    const beneficiaryCount = Math.floor(Math.random() * 500) + 20;
    
    const notesOptions = [
      `Water shortage critical in ${region}, immediate relief needed`,
      `Medical emergency reported, ${disasterType} aftermath`,
      `${reliefType} distribution ongoing, covering ${beneficiaryCount} families`,
      `Field assessment: ${disasterType} damage severe`,
      `Worker ${worker} reported successful delivery`,
      `Water contamination detected in ${region}`,
      `Food supplies running low, need replenishment`,
      `Medical aid dispatched to ${region}`
    ];
    const notes = notesOptions[i % notesOptions.length];
    
    reports.push({
      submissionId: `SUB-${2024000 + i}`,
      workerName: worker,
      workerId: workerId,
      region: region,
      reliefType: reliefType,
      quantity: quantity,
      beneficiaryCount: beneficiaryCount,
      notes: notes,
      timestamp: timestamp,
      status: status,
      disasterType: disasterType,
      ticketStatus: ticketStatus,
    });
    
    tickets.push({
      ticketId: `TKT-${202400 + i}`,
      title: `${disasterType} relief support - ${region}`,
      status: ticketStatus,
      region: region,
      workerName: worker,
      createdAt: timestamp,
      priority: i % 3 === 0 ? "High" : i % 3 === 1 ? "Medium" : "Low",
      description: notes
    });
  }
  
  return { reports, tickets, regions, reliefTypes, disasterTypes, workerNames, statuses, ticketStatuses };
};

export const DataProvider = ({ children }) => {
  const [data, setData] = useState(() => {
    const savedData = localStorage.getItem('sevatrack_data');
    if (savedData) {
      return JSON.parse(savedData);
    }
    return generateInitialData();
  });

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('sevatrack_data', JSON.stringify(data));
  }, [data]);

  // Submit new report from field worker
  const submitReport = (newReport) => {
    const submissionId = `SUB-${Date.now()}`;
    const timestamp = new Date().toISOString();
    
    const report = {
      submissionId,
      ...newReport,
      timestamp,
      status: 'Pending Review',
      ticketStatus: 'Open'
    };
    
    setData(prev => ({
      ...prev,
      reports: [report, ...prev.reports]
    }));
    
    return report;
  };

  // ✅ UPDATE REPORT STATUS - PUT THIS FUNCTION HERE
  const updateReportStatus = (submissionId, newStatus) => {
    setData(prev => ({
      ...prev,
      reports: prev.reports.map(report => 
        report.submissionId === submissionId 
          ? { ...report, status: newStatus }
          : report
      )
    }));
  };

  const searchReports = (filters) => {
    let results = [...data.reports];
    
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      results = results.filter(r => 
        r.submissionId.toLowerCase().includes(term) ||
        r.workerName.toLowerCase().includes(term) ||
        r.region.toLowerCase().includes(term) ||
        r.reliefType.toLowerCase().includes(term) ||
        r.disasterType.toLowerCase().includes(term) ||
        r.notes.toLowerCase().includes(term) ||
        r.workerId.toLowerCase().includes(term)
      );
    }
    
    if (filters.dateRange && filters.dateRange[0] && filters.dateRange[1]) {
      results = results.filter(r => {
        const date = new Date(r.timestamp);
        return date >= filters.dateRange[0] && date <= filters.dateRange[1];
      });
    }
    
    if (filters.region && filters.region !== 'all') {
      results = results.filter(r => r.region === filters.region);
    }
    
    if (filters.reliefType && filters.reliefType !== 'all') {
      results = results.filter(r => r.reliefType === filters.reliefType);
    }
    
    if (filters.workerName && filters.workerName !== 'all') {
      results = results.filter(r => r.workerName === filters.workerName);
    }
    
    if (filters.disasterType && filters.disasterType !== 'all') {
      results = results.filter(r => r.disasterType === filters.disasterType);
    }
    
    if (filters.status && filters.status !== 'all') {
      results = results.filter(r => r.status === filters.status);
    }
    
    if (filters.ticketStatus && filters.ticketStatus !== 'all') {
      results = results.filter(r => r.ticketStatus === filters.ticketStatus);
    }
    
    return results;
  };
  
  const globalSearch = (query) => {
    if (!query.trim()) return { reports: [], tickets: [] };
    const term = query.toLowerCase();
    
    const matchedReports = data.reports.filter(r =>
      r.submissionId.toLowerCase().includes(term) ||
      r.workerName.toLowerCase().includes(term) ||
      r.region.toLowerCase().includes(term) ||
      r.disasterType.toLowerCase().includes(term) ||
      r.notes.toLowerCase().includes(term) ||
      r.reliefType.toLowerCase().includes(term)
    );
    
    const matchedTickets = data.tickets.filter(t =>
      t.ticketId.toLowerCase().includes(term) ||
      t.title.toLowerCase().includes(term) ||
      t.region.toLowerCase().includes(term) ||
      t.workerName.toLowerCase().includes(term)
    );
    
    return { reports: matchedReports, tickets: matchedTickets };
  };
  
  // Get reports for a specific worker
  const getWorkerReports = (workerId) => {
    return data.reports.filter(r => r.workerId === workerId);
  };
  
  // ✅ MAKE SURE updateReportStatus IS INCLUDED IN THE RETURN STATEMENT
  return (
    <DataContext.Provider value={{ 
      data, 
      searchReports, 
      globalSearch, 
      submitReport,
      updateReportStatus,  // ✅ THIS LINE MUST BE HERE
      getWorkerReports 
    }}>
      {children}
    </DataContext.Provider>
  );
};