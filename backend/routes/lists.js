const express = require('express');
const multer = require('multer');
const csv = require('csv-parser');
const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');
const ListDistribution = require('../models/ListDistribution');
const User = require('../models/User');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['.csv', '.xlsx', '.xls'];
  const fileExt = path.extname(file.originalname).toLowerCase();
  
  if (allowedTypes.includes(fileExt)) {
    cb(null, true);
  } else {
    cb(new Error('Only CSV, XLSX, and XLS files are allowed'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 
  }
});

router.post('/upload', protect, admin, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a file' });
    }

    const agents = await User.find({ role: 'agent' });
    if (agents.length === 0) {
      return res.status(400).json({ message: 'No agents available. Please create agents first.' });
    }

    let items = [];
    const fileExt = path.extname(req.file.originalname).toLowerCase();

    if (fileExt === '.csv') {
      items = await parseCSV(req.file.path);
    } else if (fileExt === '.xlsx' || fileExt === '.xls') {
      items = await parseExcel(req.file.path);
    }

    const validatedItems = items.filter(item => 
      item.firstName && item.phone && typeof item.firstName === 'string' && item.phone.toString().length >= 10
    );

    if (validatedItems.length === 0) {
      return res.status(400).json({ message: 'No valid items found in the file' });
    }

    
    const distributedItems = distributeItems(validatedItems, agents);

 
    const listDistribution = await ListDistribution.create({
      filename: req.file.filename,
      originalName: req.file.originalname,
      totalItems: validatedItems.length,
      distributedItems: distributedItems,
      uploadedBy: req.user._id
    });

   
    fs.unlinkSync(req.file.path);

    res.status(201).json({
      message: 'File uploaded and distributed successfully',
      distribution: listDistribution
    });

  } catch (error) {
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});


router.get('/', protect, admin, async (req, res) => {
  try {
    const distributions = await ListDistribution.find()
      .populate('uploadedBy', 'name email')
      .populate('distributedItems.agent', 'name email')
      .sort({ createdAt: -1 });

    res.json(distributions);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});


router.get('/my-lists', protect, async (req, res) => {
  try {
    const myLists = await ListDistribution.aggregate([
      { $unwind: '$distributedItems' },
      { $match: { 'distributedItems.agent': req.user._id } },
      { $sort: { 'distributedItems.createdAt': -1 } },
      {
        $group: {
          _id: '$_id',
          filename: { $first: '$filename' },
          originalName: { $first: '$originalName' },
          totalItems: { $first: '$totalItems' },
          uploadedBy: { $first: '$uploadedBy' },
          createdAt: { $first: '$createdAt' },
          items: { $push: '$distributedItems' }
        }
      }
    ]);

    await User.populate(myLists, { path: 'uploadedBy', select: 'name email' });

    res.json(myLists);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

function parseCSV(filePath) {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => {
        
        const firstName = data.FirstName || data['First Name'] || data.firstName || data['first name'] || '';
        const phone = data.Phone || data.phone || data['Phone Number'] || data['phone number'] || '';
        const notes = data.Notes || data.notes || data.Note || data.note || '';
        
        if (firstName || phone) {
          results.push({
            firstName: firstName.toString().trim(),
            phone: phone.toString().trim(),
            notes: notes.toString().trim()
          });
        }
      })
      .on('end', () => resolve(results))
      .on('error', (error) => reject(error));
  });
}

function parseExcel(filePath) {
  const workbook = xlsx.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const data = xlsx.utils.sheet_to_json(worksheet);
  
  return data.map(row => {
    const firstName = row.FirstName || row['First Name'] || row.firstName || row['first name'] || '';
    const phone = row.Phone || row.phone || row['Phone Number'] || row['phone number'] || '';
    const notes = row.Notes || row.notes || row.Note || row.note || '';
    
    return {
      firstName: firstName.toString().trim(),
      phone: phone.toString().trim(),
      notes: notes.toString().trim()
    };
  });
}

function distributeItems(items, agents) {
  const distributedItems = [];
  const agentCount = agents.length;
  
  items.forEach((item, index) => {
    const agentIndex = index % agentCount;
    distributedItems.push({
      ...item,
      agent: agents[agentIndex]._id
    });
  });

  return distributedItems;
}

module.exports = router;