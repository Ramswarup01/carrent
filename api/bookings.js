// api/bookings.js

export default async function handler(req, res) {
  if (req.method === 'POST') {
    // Handle the booking request
    const { carId, userId, rentalPeriod } = req.body;
    
    // Here you can integrate with a database or any external API.
    // For now, let's assume we just send a success message.
    
    res.status(200).json({
      message: `Booking created for Car ID: ${carId}, User ID: ${userId}, Rental Period: ${rentalPeriod}`,
    });
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
