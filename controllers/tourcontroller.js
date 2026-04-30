const Tour = require('../models/tour');

const getAllTours = async (req, res) => {
  try {
    const tours = await Tour.findAll({
      order: [['title', 'ASC']],
    });

    res.status(200).json({ tours });

  } catch (error) {
    console.error('GET ALL TOURS ERROR:', error);
    res.status(500).json({ message: 'Failed to retrieve tours', error: error.message });
  }
};

module.exports = { getAllTours };
