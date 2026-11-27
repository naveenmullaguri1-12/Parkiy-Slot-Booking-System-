const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data', 'parking.json');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

function readData() {
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
}
function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

app.get('/api/slots', (req, res) => res.json(readData().slots));
app.get('/api/bookings', (req, res) => {
  const data = readData();
  res.json(data.bookings.slice().sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)));
});
app.get('/api/stats', (req, res) => {
  const { slots, bookings } = readData();
  res.json({
    total: slots.length,
    occupied: slots.filter(s => s.status === 'occupied').length,
    available: slots.filter(s => s.status === 'available').length,
    activeBookings: bookings.filter(b => b.status === 'active').length
  });
});

app.post('/api/bookings', (req, res) => {
  const { owner, vehicleNumber, vehicleType, slotId } = req.body;
  if (![owner, vehicleNumber, vehicleType, slotId].every(v => String(v || '').trim())) {
    return res.status(400).json({ message: 'Please provide all required booking details.' });
  }
  const data = readData();
  const slot = data.slots.find(s => s.id === slotId);
  if (!slot) return res.status(404).json({ message: 'Parking slot not found.' });
  if (slot.status !== 'available') return res.status(409).json({ message: 'This slot is already occupied.' });
  const normalizedNumber = vehicleNumber.trim().toUpperCase();
  if (data.bookings.some(b => b.status === 'active' && b.vehicleNumber === normalizedNumber)) {
    return res.status(409).json({ message: 'This vehicle already has an active booking.' });
  }
  const booking = {
    id: `BK${Date.now()}`,
    owner: owner.trim(),
    vehicleNumber: normalizedNumber,
    vehicleType,
    slotId,
    entryTime: new Date().toISOString(),
    exitTime: null,
    status: 'active',
    createdAt: new Date().toISOString()
  };
  slot.status = 'occupied';
  data.bookings.push(booking);
  writeData(data);
  res.status(201).json(booking);
});

app.patch('/api/bookings/:id/checkout', (req, res) => {
  const data = readData();
  const booking = data.bookings.find(b => b.id === req.params.id && b.status === 'active');
  if (!booking) return res.status(404).json({ message: 'Active booking not found.' });
  booking.status = 'completed';
  booking.exitTime = new Date().toISOString();
  const slot = data.slots.find(s => s.id === booking.slotId);
  if (slot) slot.status = 'available';
  writeData(data);
  res.json(booking);
});

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));
app.listen(PORT, () => console.log(`Parking system running at http://localhost:${PORT}`));
